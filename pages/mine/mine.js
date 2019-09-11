// pages/mine/mine.js
const app = getApp()
var that = this;
var api = require('../../api.js').api;
const public_js = require('../../utils/public.js').public_js;
Page({
  data: {
    showModel:false,
    show_opt: '',
    is_zs:false
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    that = this;
    var user = wx.getStorageSync('userInfo');
    that.setData({
      avatarUrl: user.avatarUrl,
      nickName: user.nickName,
      isvip: wx.getStorageSync('isvip') == 1 ? true : false 
    })
    
    if (wx.getStorageSync('staff_id') && wx.getStorageSync('staff_id') != 0) {
      this.getWorkTimeList();
      that.setData({
        is_zs:true
      })
    }
    if (wx.getStorageSync('shipping_address')){
      wx.removeStorageSync('shipping_address')
    }
  },
  onShow(){
    this.getProfit();
  },
  getWorkTimeList() {
    wx.request({
      url: api.per_center.plantime,
      data: {
        staff_id: wx.getStorageSync('staff_id'),
        action: 1,
        
      },
      method: "POST",
      success(res) {
        var workTimeList = res.data.data;
        console.log(res);
        if (workTimeList.length==0){
          wx.showModal({
            title: '温馨提示',
            content: '您还没有工作计划，去添加？',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../workManagement/index',
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })
  },
  getProfit(){
    wx.request({
      url: api.per_center.getProfit,
      data:{
        user_id: wx.getStorageSync('user_id')
      },
      method:"POST",
      success(res){
       var userInfo = res.data.data;
       that.setData({
         userInfo
       })
      }
    })
  },
  showModel() {
    this.setData({
      showModel: true
    })
  },
  cancle() {
    this.setData({
      showModel: false
    })
  },
  formSubmit(e){
    var info = e.detail.value;
    var n =  !/^1\d{10}$/.test(info.phone) ? '请输入联系方式' : false;
    if(n){
      wx.showModal({
        title: '温馨提示',
        content: ''+n+'',
        showCancel:false
      })
      return false;
    }
    wx.request({
      url: api.per_center.apply,
      data:{
        user_id: wx.getStorageSync('user_id'),
        types : 1,
        apply_phone: info.phone
      },
      method:"POST",
      success(res){
        if(res.data.status.succeed==1){
          wx.showToast({
            title: '保存成功'
          })
          that.data.userInfo.apply_phone = info.phone;
          that.setData({
            userInfo: that.data.userInfo,
            showModel: false
          })
        }
      }
    })
  },
  lookMore() {
    var show_opt = that.data.show_opt;
    public_js.lookMore(that, show_opt)
  },
  robbing(e){  //我要抢单
    public_js.sendFormId(e.detail.formId, 0);
    wx.navigateTo({
      url:'../order-management/order-management'
    })
  },
  myrobbing(e) {  //我的接单
    public_js.sendFormId(e.detail.formId, 0);
    wx.navigateTo({
      url:'../myRobbing/index'
    })
  },
})

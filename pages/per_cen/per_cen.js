//index.js
//获取应用实例
var api = require('../../api.js').api;
const app = getApp();
const public_js = require('../../utils/public.js').public_js;
var that = '';
Page({
  data: {
  },
  onLoad: function () {
    that = this;
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      nickName: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl,
    })
    
  },
  onShow(){
    this.per_center();
  },
  per_center (){
    wx.request({
      url: api.per_center.userInfoType,
      data:{
        user_id: wx.getStorageSync('user_id')
      },
      method:"POST",
      success(res){

        var userInfo = res.data.data;
        that.setData({
          userInfo,
          isvip: userInfo.isvip
        })
        wx.setStorageSync('staff_id', userInfo.staff_id);
        wx.setStorageSync('isvip', userInfo.isvip);
        wx.setStorageSync('monthly_card_end', userInfo.monthly_card_end);
      }
    })
  },
  paotui(e) {
    
    public_js.sendFormId(e.detail.formId,0);
    if (this.data.userInfo.staff_id==0){
      if (this.data.userInfo.apply_for==0){
        wx.showModal({
          title: '温馨提示',
          content: '是否申请成为骑手',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../apply_for/index',  // 自由人员进入
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }else{
        if (this.data.userInfo.apply_for.apply_status == 0) {
          wx.showModal({
            title: '温馨提示',
            content: '您已提交审核，正在审核中',
            showCancel: false,
            apply_status:true
          })
        } else {
          wx.navigateTo({
            url: '../mine/mine',  // 自由人员进入
          })
        }
      }

    }else{
      wx.navigateTo({
        url: '../mine/mine?staff_id=' + this.data.userInfo.staff_id+'', //专职人员  id
      })
    }
  },
  toSecondPage(){
    wx.navigateTo({
      url: '../buy/index',
    })
  },
  dispatch(e){  //我要派单
    public_js.sendFormId(e.detail.formId, 0);
    wx.showModal({
      title: '温馨提示',
      content: '该功能正在修缮为您带来的不便敬请谅解！',
      showCancel:false
    })
    return false;
  },
  mydispatch(e) {  //我的派单
    public_js.sendFormId(e.detail.formId, 0);
    wx.navigateTo({
      url: '../myRobbing/index?types=is_my',
    })
  },
  address(e) {  //地址管理
    public_js.sendFormId(e.detail.formId, 0);
    wx.navigateTo({
      url: '../address_list/index',
    })
  },
  orderList(e){
    public_js.sendFormId(e.detail.formId, 0);
    wx.navigateTo({
      url: '../order/index',
    })
  },
  deliveryList(e){
    public_js.sendFormId(e.detail.formId, 0);
    wx.navigateTo({
      url: './delivery_list/index',
    })
  }
})

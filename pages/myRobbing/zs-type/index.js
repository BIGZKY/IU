// pages/order-management/zs-type/index.js
var api = require('../../../api.js').api;
var that = '';
Page({
  data: {
    currentTab:'',
  },

  onLoad: function (options) {
    that = this;
    var staff_id = wx.getStorageSync('staff_id');
    if (staff_id != 0) {   //是否显示预约
      that.setData({
        taskType: true,   //专职人员
        currentTab:1
      })
      that.getSpecDelivery();
    } else {
      that.setData({
        taskType: false,  //兼职人员  
        currentTab: 2
      })
      that.getSpecDelivery(1);
    }
  },
  onReady: function () {
  
  },
  onShow: function () {
    //判断当从订单列表页返回时，所需要加载预约单 or 及时单 
    if (wx.getStorageSync('zs_type')){
      var zs_type = wx.getStorageSync('zs_type');
      if (zs_type == 1) {
        that.getSpecDelivery();   //预约
      } else if (zs_type == 2){
        that.getSpecDelivery(1);   //及时
      } 
      wx.removeStorageSync('zs_type');
    }
    
  },
  getSpecDelivery(type) {
    wx.showLoading({
      title: '正在加载数据',
    })
    var data = {
      staff_id: wx.getStorageSync('staff_id'),

    }
    if(type){
      var data = {
        staff_id: wx.getStorageSync('staff_id'),
        is_jishi:2,
        user_id: wx.getStorageSync('user_id'),
      }
    }
    wx.request({
      url: api.order.regions,
      data:data,
      method: "POST",
      success(res) {
        console.log(res)
        that.setData({
          spec_delivery_list: res.data.data
        })
        if (that.data.spec_delivery_list.length == 0) {
          that.setData({
            noData: true,
          })
        } else {
          that.setData({
            noData: false,
          })
        }
        wx.hideLoading();
      },
      fail(){
        wx.hideLoading();
        wx.showToast({
          title: '获取失败',
          icon:"none"
        })
      }
    })
  },

  tabNav: function (e) {
    if (e.currentTarget.dataset.current==1){
      this.getSpecDelivery();  //预约单
    }else {
      this.getSpecDelivery(1);  //及时单
    }
    this.setData({
      currentTab: e.currentTarget.dataset.current,   //1 预约单   2 即时单
    })
  },
})
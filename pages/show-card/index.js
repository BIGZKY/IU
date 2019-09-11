// pages/show-card/index.js
var api = require('../../api.js').api;
var that = '';
Page({
  data: {

  },
  onLoad: function (options) {
    that= this;
    that.getCardData();
  },
  getCardData(){
    wx.request({
      url: api.per_center.coupon,
      data:{
        user_id: wx.getStorageSync('user_id')
      },
      method:"POST",
      success(res){
        console.log(res)
      }
    })
  }
})
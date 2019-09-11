// pages/dispatch/add-addrInfo/index.js
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
var app = getApp();
// 实例化API核心类
var demo = new QQMapWX({
  key: 'B2VBZ-P3F3P-T5UDC-VT7AL-ENIGV-R6FT5' // 必填
});
var that = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    if (options.type){
      that.setData({
        type:'end'
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync('addrInfo')){  //派单页
      that.setData({
        floor: wx.getStorageSync('addrInfo').addr,
        tel: wx.getStorageSync('addrInfo').tel,
        name: wx.getStorageSync('addrInfo').name,
        detailAddr: wx.getStorageSync('addrInfo').detailAddr,
        newAddr:false
      })
      // wx.removeStorageSync('addrInfo');
    }
    if (wx.getStorageSync('addr_info')){   //地址选择列表
      that.setData({
        floor: wx.getStorageSync('addr_info').info,
        city: wx.getStorageSync('addr_info').city.city+wx.getStorageSync('addr_info').city.district,

        newAddr: wx.getStorageSync('addr_info').newAddr ? true : false
      })
      // wx.removeStorageSync('addr_info');
    }

  },
  sbt(e){
    console.log(e);
    let value = e.detail.value;
    let n = !value.detailAddr ? '请输入详细地址' : !value.tel ? '请输入电话号码' : !/^1(3|5|6|7|8)\d{9}$/.test(value.tel) ? '请输入正确的电话号码' : !value.name ? '请输入联系人' : false;
    if(n){
      wx.showToast({
        title: n,
        icon:'none'
      })
      return false;
    }
    if (that.data.newAddr){ 
      console.log((that.data.city || '') + that.data.floor + value.detailAddr)
      demo.geocoder({
        address:   value.detailAddr,
        success: function (res) {
          console.log(res);
          var addrInfo = {
            name: value.name,
            tel: value.tel,
            city: that.data.city,
            floor: that.data.floor,
            detailAddr: value.detailAddr,
            location: res.result.location,
            type: that.data.type ? 'end' : ''
          }
          wx.setStorageSync('addrInfo', addrInfo);
          // wx.navigateBack({
          //   delta: 1
          // })
        },
        fail: function (res) {
          console.log(res);
        },

      });
    }else{
      console.log('没有更新地址');
      var addrInfo = {
        name: value.name,
        tel: value.tel,
        city: that.data.city,
        floor: that.data.floor,
        detailAddr: value.detailAddr,
        type: that.data.type ? 'end' : ''
      }
      wx.setStorageSync('addrInfo', addrInfo);
      // wx.navigateBack({
      //   delta: 1
      // })
    }
 
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
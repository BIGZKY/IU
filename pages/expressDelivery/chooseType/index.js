// pages/expressDelivery/chooseType/index.js
var api = require('../../../api.js').api;
var that = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rootUrl: 'https://iu.yitiyan360.com/content/uploads/',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.request({
      url: api.delivery.postDelivery,
      data: {
      },
      success(res) {
        console.log(res);
        that.setData({
          delivery: res.data.data.delivery
        })
      }
    })
  },
  chooseType(e){
    var index = e.currentTarget.dataset.index;
    var obj = that.data.delivery[index];
    wx.setStorageSync('delivery_company', obj);
    wx.navigateBack({
      delta:1
    })
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
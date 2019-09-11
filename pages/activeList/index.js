// pages/activeList/index.js
const app = getApp()
var api = require('../../api.js').api;
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
      url: api.ad.getActiveList,
      data:{

      },
      method:"GET",
      success(res){
        console.log(res);
        that.setData({
          activeList:res.data.data
        })
      }
    })
  },
  lookImage(e){
    var img = e.currentTarget.dataset.img;
    wx.previewImage({
      urls: [img],
      current: img,
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
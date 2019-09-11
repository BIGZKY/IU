// pages/per_cen/delivery_list/index.js
var api = require('../../../api.js').api;
var that = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navIndex:0,
    deliveryList:[],
    deliveryList_child:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.request({
      url: api.delivery.delivery_look,
      data: {
        user_id: wx.getStorageSync('user_id'),
      },
      method:"POST",
      success(res) {
        console.log(res)
        if (res.data.data && res.data.data.length>0){
          var deliveryList = res.data.data;
          var deliveryList_child = deliveryList.filter(function (el) {
            return el.status == 0;
          })
          that.setData({
            deliveryList,
            deliveryList_child
          })
        }
        
      }
    })
  },
  navClick(e) {
    var index = e.currentTarget.dataset.index;

    var deliveryList_child = this.data.deliveryList.filter(function (el) {
      return el.status == index;
    })
    this.setData({
      navIndex: index,
      deliveryList_child
    })
  },
  call(e){
    var mobile = e.currentTarget.dataset.mobile;
    wx.makePhoneCall({
      phoneNumber: mobile,
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
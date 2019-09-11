// pages/mine/deliveryWait/index.js
var api = require('../../../api.js').api;
var that = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navIndex:0,
    deliveryList_child:[],
    deliveryList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.request({
      url: api.delivery.courier_delivery_list,
      data:{
        user_id: wx.getStorageSync('user_id'),
        staff_id: wx.getStorageSync('staff_id') || ''
      },
      method:"POST",
      success(res){
        console.log(res.data.data)
        if (res.data.data==null){
          return false;
        }
        var data = res.data.data;

        var deliveryList_child = data.filter(function (el) {
          return el.status == 0;
        })
        that.setData({
          deliveryList:data,
          deliveryList_child
        })

      } 
    })
  },
  navClick(e){
    var index = e.currentTarget.dataset.index;

    var deliveryList_child = this.data.deliveryList.filter(function(el){
      return el.status == index;
    })
    this.setData({
      navIndex:index,
      deliveryList_child
    })
  },
  robbing(e){
    var index = e.currentTarget.dataset.index;
    var id = this.data.deliveryList_child[index].id;
    wx.request({
      url: api.delivery.delivery_take,
      data:{
        user_id: wx.getStorageSync('user_id'),
        id
      },
      method: "POST",
      success(res){
        console.log(res)
        if(res.data.data==200){
          wx.showToast({
            title: '接单成功',
            icon:"none"
          })
          var indexs = that.data.deliveryList.findIndex(function(el){
            return el.id == id;
          })
          that.data.deliveryList[indexs].status = 1;
          that.data.deliveryList_child.splice(index,1)
          that.setData({
            deliveryList: that.data.deliveryList,
            deliveryList_child: that.data.deliveryList_child
          })

        }else{
          wx.showToast({
            title: '订单已被接',
            icon: "none",
            duration:1500
          })
        }
      }
    })
  },
  complete(e){
    var index = e.currentTarget.dataset.index;
    var id = this.data.deliveryList_child[index].id;
    wx.request({
      url: api.delivery.delivery_finish,
      data: {
        user_id: wx.getStorageSync('user_id'),
        id
      },
      method: "POST",
      success(res) {
        console.log(res)
        if (res.data.data == 200) {
          wx.showToast({
            title: '已完成',
            icon: "none"
          })
          var indexs = that.data.deliveryList.findIndex(function (el) {
            return el.id == id;
          })
          that.data.deliveryList[indexs].status = 2;
          that.data.deliveryList_child.splice(index, 1)
          that.setData({
            deliveryList: that.data.deliveryList,
            deliveryList_child: that.data.deliveryList_child
          })

        } else {
          wx.showToast({
            title: '订单已被接',
            icon: "none",
            duration: 1500
          })
        }
      }
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
// pages/expressDelivery/index.js
var api = require('../../api.js').api;
var that = '';
// var animation = wx.createAnimation({
//   duration: 200,
//   timingFunction: 'ease',
// })
// animation.translateY(0).step();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rootUrl: 'https://iu.yitiyan360.com/content/uploads/',
    index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
  },
  chooseType(){
    wx.navigateTo({
      url: './chooseType/index',
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
    //选择快递公司
    if (wx.getStorageSync("delivery_company")){
      this.setData({
        delivery_company: wx.getStorageSync("delivery_company")
      })
      wx.removeStorageSync('delivery_company')
    }

    // 收件地址
    if (wx.getStorageSync('shipping_address')){
      let info = wx.getStorageSync('shipping_address');
      this.setData({
        receivAddr: info
      })
      // wx.removeStorageSync('shipping_address')
    }

    // 寄件地址
    if (wx.getStorageSync('address')) {
      let address = wx.getStorageSync('address');
      wx.request({
        url: api.delivery.postDelivery,
        data: {
          dormitory_id: address.id
        },
        success(res) {
          console.log(res);
          if (res.data.status.succeed==1){

            that.setData({
              showcourier:true,
              dormitory: res.data.data.dormitory,
            })
          }
          that.setData({
            originAddr: address
          })
          wx.removeStorageSync('address')
        }
      })
      
    }
  },
  note(e) {
    var note = e.detail.value;
    that.setData({
      note
    })
  },
  goodsName(e) {
    var goods_name = e.detail.value;
    that.setData({
      goods_name
    })
  },
  tip() {
    wx.showToast({
      title: '请先选择寄件地址',
      icon: "none"
    })
  },
  call(){
    wx.makePhoneCall({
      phoneNumber: that.data.dormitory.student_phone,
    })
  },
  bindPickerChange(e){
    console.log(e)
    var time = this.data.dormitory.time[e.detail.value].times;
    this.setData({
      time
    })
  },
  sbt(){
    var data = that.data;
    var n = !data.delivery_company.id ? '请选择快递公司' : !data.originAddr ? '请填写寄件地址' : !data.receivAddr ? '请填写收件地址' : !data.time ? '请选择取件时间' : !data.goods_name ? '请填写商品名称' : false;
    if(n){
      wx.showToast({
        title: n,
        icon:"none"
      })
      return false;
    }
    wx.request({
      url: api.delivery.shipping_delivery,
      data:{
        receiver_name: data. receivAddr.name,
        receiver_phone: data.receivAddr.tel,
        receiver_address: data. receivAddr.addr,
        shipper_name: data.originAddr.consignee,
        shipper_phone: data.originAddr.mobile,
        shipper_address: data.originAddr.address + data.originAddr.address_info,
        remarks: data.note,
        delivery_name: data.delivery_company.delivery_name,
        time: data.time,
        goods_name: data.goods_name,
        staff_id:data.dormitory.staff_id,
        user_id: wx.getStorageSync('user_id'),
        region_id: data.dormitory.region_id
      },
      method:"POST",
      success(res){
        if(res.data.data==200){
          wx.showToast({
            title: '下单成功',
          })
          setTimeout(function(){
            wx.navigateBack({
              delta:1
            })
          },1500)
          wx.removeStorageSync('shipping_address')
        }
        console.log(res);
      }
    })
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
    wx.setStorageSync('shipping_address', null)
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
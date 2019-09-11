// pages/expressDelivery/editInfo/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region:[0,0,0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type==1){
      this.setData({
        type:1
      })
    }else{
      this.setData({
        type: 2
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
    if (wx.getStorageSync('shipping_address')) {
      let info = wx.getStorageSync('shipping_address');
      this.setData({
        name:info.name,
        tel: info.tel,
        addr: info.addr,
        region: info.region
      })
      // wx.removeStorageSync('shipping_address')
    }
  },
  formsubmit(e){
    console.log(e)
    var n = !e.detail.value.name ? '请输入姓名' : !e.detail.value.tel ? '请输入联系方式' : !/^1(3|5|6|7|8|)\d{9}$/.test(e.detail.value.tel) ? '请输入正确格式联系方式' : !this.data.region[0] ? '请选择省市区' : !e.detail.value.addr ? '请输入地址信息' : false;
    if(n){
      wx.showToast({
        title: n,
        icon:"none"
      })
      return false;
    }
    var info = {
      name: e.detail.value.name,
      tel: e.detail.value.tel,
      addr: e.detail.value.addr,
      region: this.data.region
    }

    wx.setStorageSync('shipping_address', info);
    wx.navigateBack({
      delta:1
    })
  },
  bindRegionChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
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
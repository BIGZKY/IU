// pages/login/index.js
var api = require('../../api.js').api;
var app = getApp();
Page({
  data: {
  
  },
  onLoad: function (options) {

  },
  onGotUserInfo(e) {
    wx.showLoading({
      title: '正在登录……',
    })
    wx.setStorageSync('userInfo', e.detail.userInfo);
    wx.login({
      success: res => {
        console.log(res)
        if (res.code) {
          wx.request({
            url: api.login.login,
            method: "POST",
            data: {
              code: res.code,
              
            },
            success(res) {
              if(res.data.status.succeed==1){

                wx.request({
                  url: api.login.second_login,
                  data:{
                    user_info: e.detail.rawData,
                    encrypteddata: e.detail.encryptedData,
                    iv: e.detail.iv,
                    signature: e.detail.signature,
                    openid: res.data.data.openid,
                    session_key: res.data.data.session_key,
                  },
                  method:"POST",
                  success(res){
                    wx.hideLoading();
                    console.log(res)
                    if (res.data.status.succeed != 1) {

                      var res = JSON.stringify(res)
                      wx.showToast({
                        title: 1+res,
                        icon: "none"
                      })
                      return false;
                    }
                    app.globalData.userInfo_bool = true;
                    var user_id = res.data.data.user.id;
                    var token = res.data.data.token;
                    var isvip = res.data.data.user.isvip;
                    var staff_id = res.data.data.user.staff_id;
                    var monthly_card_end = res.data.data.user.monthly_card_end;
                    var user_isnew = res.data.data.isnew;
                    wx.setStorageSync('token', token);
                    wx.setStorageSync('user_id', user_id);

                    wx.reLaunch({
                      url: '/pages/index/index',
                    })
                    
                  }
                })
              }else{
                var res = JSON.stringify(res)
                wx.showToast({
                  title: 2+res,
                  icon: "none"
                })
                return false;
              }
              wx.hideLoading();
              //保存登录态
            },
            fail() {
              wx.hideLoading();
              wx.showToast({
                title: 3+'授权失败，请重新点击授权',
                icon: "none"
              })
            }
          })
        }
      }, fail(){
        wx.showToast({
          title: '登录失败',
        })
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
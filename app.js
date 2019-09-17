//app.js
var api = require('./api.js').api;
App({
  onLaunch: function () {
    // this.login();
    var app = this;
    wx.getSystemInfo({
      success: function (res) {
        app.globalData.windowWidth = res.windowWidth;
        app.globalData.windowHeight = res.windowHeight
      }
    })
  },
  login() {
    var app = this
    wx.showLoading({
      title: "正在登录",
      mask: true,
    });
    if (!wx.getStorageSync('user_id')){

      wx.navigateTo({
        url: '/pages/login/index',
      })
    }else{
      wx.getSetting({
        success: function (res) {
          if (!res.authSetting['scope.userInfo']) {
            wx.navigateTo({
              url: '/pages/login/index',
            })
          }
        }
      })
    }
    wx.hideLoading();
  },
  globalData: {
    userInfo_bool: wx.getStorageSync('user_id') ? true : false,
    user_id:null,
    init:null
  },
  err_tip(msg) {
    wx.showToast({
      title: msg,
      icon: "none",
      duration: 1500
    })
    return false;
  },
  
})
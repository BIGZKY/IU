//index.js
//获取应用实例
const app = getApp()
var api = require('../../api.js').api;
var that = '';
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {

  },
  onLoad: function (options) {
    that = this;
    that.setData({
      adver_id: options.id
    })
    this.getAdData(options.id);  
  },

  getAdData(id){
    wx.request({
      url: api.ad.adDetail,
      data:{
        adver_id: id
      },
      method:"POST",
      success(res){
        console.log(res)
        var adInfo = res.data.data;
        that.setData({
          adInfo
        })
        wx.setNavigationBarTitle({
          title: res.data.data.adver_name,
        })
        var adInfoStorage = {
          adver_id: res.data.data.adver_id,
          enroll_money: res.data.data.enroll_money,
          adver_preferential: res.data.data.adver_preferential
        }
        wx.setStorageSync('adInfoStorage', adInfoStorage)
        WxParse.wxParse('content', 'html', res.data.data.adver_introduction, that,5);
      }
    })
  },
  onShareAppMessage(res) {
    return {
      title: '店铺详情',
      path: 'pages/ad-details/index?adver_id=' + that.data.adver_id
    }
  }
})

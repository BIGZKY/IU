// pages/dispatch/addr-list/index.js
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');

// 实例化API核心类
var demo = new QQMapWX({
  key: 'B2VBZ-P3F3P-T5UDC-VT7AL-ENIGV-R6FT5' // 必填
});
var that = this;
Page({

  data: {
    page_index:1,
    keyword:''
  },
  onLoad: function (options) {
    if(options.type=='e'){
      var chooseAddrType = 'e';
      this.setData({
        chooseAddrType
      })
    }
    that = this;
  },
  bindinput(e){

    // 调用接口
    var keyword = e.detail.value;
    if (!keyword){
      this.setData({
        addrList:[]
      })
      return false;
    }
    var page_index = 1;
    this.setData({
      keyword,
      page_index
    })
    demo.search({
      keyword: keyword,
      page_index: page_index,
      success: function (res) {
        if (!res.data){
          return false;
        }
        that.setData({
          addrList:res.data
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
      }
    });
  },
  chooseAddr(e){
    var info = e.currentTarget.dataset;
    let obj = {
      newAddr:true
    }
    info = Object.assign(info, obj)

    wx.setStorageSync('addr_info', info);
    wx.navigateBack({
      delta:1
    })
  },
  onReachBottom(){
    var keyword = this.data.keyword;

    var page_index = this.data.page_index++;
    demo.search({
      keyword: keyword,
      page_index: page_index,
      success: function (res) {
        if (!res.data) {
          return false;
        }
        var addrList = [...that.data.addrList, ...res.data]
        that.setData({
          addrList
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
      }
    });
  }
})
// pages/arond/fragment/find.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    type:0,
    money:0
  },

  onLoad: function (options) {
    var money = options.money;
    var type = options.type;
    this.setData({
        type:type,
        money:money
    });
  }

})
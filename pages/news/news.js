// pages/news/news.js
var api = require('../../api.js').api;
var WxParse = require('../../wxParse/wxParse.js');
var that = '';
Page({
  data: {
    
  },
  onLoad: function (options) {
    that = this;
    this.getNewsData(options.article_id)
  },
  onShow(){

  },
  getNewsData(article_id){
    wx.request({
      url: api.article.getOneNews,
      data:{
        article_id: article_id
      },
      method:"POST",
      success(res){
        var data = JSON.parse(res.data.data);
        that.setData({
          title: data.title,

        })
        var article = data.content;
        WxParse.wxParse('article', 'html', article, that, 5);
      }
    })
  }
})
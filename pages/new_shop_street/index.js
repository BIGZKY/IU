// pages/shop_street/index.js
var api = require('../../api.js').api;
var app = getApp();
// var is_show = false;
var animation = wx.createAnimation({
  duration: 300,
  timingFunction: "ease",
  delay: 0
})
const public_js = require('../../utils/public.js').public_js;
var token = '';
var that = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rootUrl: 'https://iu.yitiyan360.com/content/uploads/',
    nav_index:0
  },
  onLoad: function (options) {
    that = this;
    that.setData({
      windowHeight: app.globalData.windowHeight
    })
    this.getData();
    this.getBanner();
  },
  onShow() {
    that.setData({
      isHide: false
    })
    // this.aa();
  },
  getData() {
    wx.showLoading({
      title: '数据加载中',
    })
    wx.request({
      url: api.shop_street.shopList,
      data: {
        user_id: wx.getStorageSync('user_id')
      },
      success(res) {
        console.log(res)

        if (res.data.status.succeed == 1) {
          if (res.data.data.is_new) {
            var voucher = {
              name: res.data.data.marks.name,
              useendtime: res.data.data.marks.useendtime,
              run_type: 2,
              is_type: 1
            }
            that.setData({
              hasvoucher: true,
              voucher
            })
          }
          var shopList = res.data.data.datas;
          var title = shopList[0].shop_name
          var id = shopList[0].id
          that.setData({
            shopList,
            title
          })
          
          that.foodsList(id) 

        }
        wx.hideLoading();
      }
    })
  },
  foodsList(id) {
    wx.request({
      url: api.shop_street.foodsList,
      data: {
        user_id: wx.getStorageSync('user_id'),
        shop_id: id
      },
      success(res) {
        console.log(res)
        if(res.data.status.succeed ==1){
          that.setData({
            goods_menu:res.data.data
          })
        }
      }
    })
  },
  getBanner() {
    public_js.getBanner(that, 1);
  },
  link(e) {
    public_js.link(e, that);
  },
  closevoucher() {
    public_js.colose_lj(that, );

  },
})
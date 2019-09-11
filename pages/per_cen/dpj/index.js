// pages/per_cen/dpj/index.js
const app = getApp()
var that = this;
var api = require('../../../api.js').api;
const public_js = require('../../../utils/public.js').public_js;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    
  },
  getData(){
    wx.request({
      url: api.per_center.run,
      data:{
        user_id: wx.getStorageSync('user_id') 
      },
      success(res){
        var runList = res.data.data;
        that.setData({
          runList
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
    wx.showShareMenu({
      withShareTicket: true
    })
    this.getData();
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: 'IU科技',
      path: '/pages/index/index',
      success: function (res) {
        console.log(res)
        if (res.errMsg == 'shareAppMessage:ok') {
          var order_id = '';
          that.getdpj(2)
        }
      }
    }
  },
  getdpj(run_type) {
    wx.request({
      url: api.order.getDpj,
      data: {
        user_id: wx.getStorageSync('user_id'),
        run_type,
      },
      method: "POST",
      success(res) {
        console.log(res);
        if (res.data.data) {
          var voucher = res.data.data;
          that.getData();
          that.setData({
            hasvoucher: true,
            voucher
          })
        }else{
          that.setData({
            hasvoucher: false,
          })
        }
      }
    })
  },
  closevoucher() {
    public_js.colose_lj(that,0);

  },
})
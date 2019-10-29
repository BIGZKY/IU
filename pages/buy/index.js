//index.js
var api = require('../../api.js').api;
var that = '';
const public_js = require('../../utils/public.js').public_js;
const app = getApp();
var animation = wx.createAnimation({
  duration: 400,
  timingFunction: '"linear"',
  delay: 0,
  transformOrigin: '"50% 50% 0"',
})
Page({
  data: {
  },
  onLoad: function (options) {
    that = this;
    wx.showLoading({
      title: '正在加载数据',
    })

    this.getCardList();
    
  },
  getCardList(){
    wx.request({
      url: api.per_center.coupon,
      data: {
        
      },
      method: "POST",
      success(res) {
        console.log(res)
        that.setData({
          coupon_list: res.data.data,
          id: res.data.data[0].id,
          money: res.data.data[0].discount_price,
          coupon: 0
        })
        wx.hideLoading();
      }
    })
  },
  buy_coupon(e){
    wx.showToast({
      title: '正在发起支付...',
      icon:"none"
    })
    wx.request({
      url: api.per_center.buyCoupon,
      data: {
        monthcard_id: this.data.id,
        user_id: wx.getStorageSync('user_id'),
        order_amount: this.data.money,
        pay_id: 18
      },
      method: "POST",
      success(res) {
        console.log(res);
        var order_id = res.data.data.order_id;
        that.setData({
          order_id: res.data.data.order_id
        })
        wx.request({
          url: api.per_center.wx_pay,
          data: {
            "order_id": res.data.data.order_id,
            user_id: wx.getStorageSync('user_id'),
          },
          method: "POST",
          success(res) {
            var payment = res.data.data.payment;
            wx.requestPayment({
              'timeStamp': '' + payment.timeStamp + '',
              'nonceStr': '' + payment.nonceStr + '',
              'package': '' + payment.package + '',
              'signType': 'MD5',
              'paySign': '' + payment.paySign + '',
              'success': function (res) {
                wx.hideToast();
                public_js.getdpj(that, 8, order_id);
                // wx.navigateBack({
                //   delta:1
                // })
              },
              'fail': function (res) {
                app.err_tip('支付失败，请重新支付');
              }
            })
          }
        })
      }
    })
  },

  onShow: function () {
    this.setData({
      isvip: wx.getStorageSync('isvip'),
      monthly_card_end: wx.getStorageSync('monthly_card_end')
    })
  },
  closevoucher() {
    public_js.colose_lj(that, 1);
  },
  select_coupon(e){
    var money = e.currentTarget.dataset.money;
    var id = e.currentTarget.dataset.id;
    var coupon = e.currentTarget.dataset.index;
    that.setData({
      money,
      id,
      coupon
    })
  },

  showGG(){
    this.animation = animation
    animation.opacity(1).step();
    this.setData({
      showGG:true,
      animationData: animation.export()
    })
  },
  close(){
    animation.opacity(0).step();
    this.setData({
      showGG: false,
      animationData: animation.export()
    })
  }
})  
  


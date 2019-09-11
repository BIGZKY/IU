// pages/order_detail/index.js
var api = require('../../api.js').api;
var token = '';
var app = getApp();
const public_js = require('../../utils/public.js').public_js;
var that = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    back_index:false,
    use_hb:false,
    use_dp:false,
    youhui:'',
    show_opt:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    token = wx.getStorageSync("token");
    var order_id = options.order_id;
    this.getOrderDetail(order_id);

  },
  getOrderDetail(order_id){
    wx.showLoading({
      title: '正在加载数据',
    })
    wx.request({
      url: api.order.order_detail,
      data:{
        order_id,
        token
      },
      method:"POST",
      success(res){
        that.setData({
          consignee: res.data.data.consignee,
          address: res.data.data.address,
          seller_name: res.data.data.seller_name,
          goods_list: res.data.data.goods_list,
          goods_amount: res.data.data.goods_amount,
          shipping_fee: res.data.data.shipping_fee,
          total_fee: res.data.data.total_fee,
          pay_fee: res.data.data.pay_fee,
          order_sn: res.data.data.order_sn,
          formated_add_time: res.data.data.formated_add_time,
          mobile: res.data.data.mobile,
          shipping_name: res.data.data.shipping_name,
          shipping_time: res.data.data.shipping_time,
          select_time_tip: res.data.data.select_time_tip,
          bonus: res.data.data.bonus,
          label_order_status: res.data.data.label_order_status,
          pay_status: res.data.data.pay_status,
          order_id: res.data.data.order_id,
          pay_note: res.data.data.pay_note,
          shipping_id: res.data.data.shipping_id
        })

        //检查是否有优惠
        if(res.data.data.is_run!=0){
          that.setData({
            use_dp:true,
            youhui: res.data.data.shipping_fee,
          })
        }
        if (res.data.data.bonus>0){
          that.setData({
            use_hb: true,
            youhui: res.data.data.bonus
          })
        }
        if (res.data.data.bonus > 0 && res.data.data.is_run != 0) {
          that.setData({
            use_hb: true,
            youhui: res.data.data.shipping_fee + res.data.data.bonus
          })
        }
        if (res.data.data.is_vip ==1){
          that.setData({
            use_yueka: true,
            youhui: res.data.data.shipping_fee
          })
        }
        //检查订单状态
        wx.hideLoading();
      }
    })
  },

  //返回首页
  back_index(){
    wx.reLaunch({
      url: '../main/main',
    })
  },
  go_pay(){
    var n = public_js.check_shop_time();
    if (n) {
      return false;
    }
    var order_id = this.data.order_id;
    wx.showToast({
      title: '正在发起支付...',
      mask: true,
      icon: "loading"
    })
    wx.request({
      url: api.order.pay,
      data: {
        "order_id": order_id,
        user_id: wx.getStorageSync('user_id')
      },
      method: "POST",
      success(res) {
        console.log(res)
        if (res.data.status.succeed == 0) {
          wx.showToast({
            title: res.data.status.error_desc,
            icon: "none"
          })
          return false;
        }
        var payment = res.data.data.payment;
        wx.requestPayment({
          'timeStamp': '' + payment.timeStamp + '',
          'nonceStr': '' + payment.nonceStr + '',
          'package': '' + payment.package + '',
          'signType': 'MD5',
          'paySign': '' + payment.paySign + '',
          'success': function (res) {
            wx.hideToast();
            that.getOrderDetail(order_id)
          },
          'fail': function (res) {
            app.err_tip('支付失败，请重新支付');

          }
        })

      }
    })
  },
  look_more(e) {

    var gnum = e.currentTarget.dataset.gnum;
    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 300,
      timingFunction: "ease",
      delay: 0
    })
    var animationData = animation.height(gnum * 100).step().export();
    this.setData({
      animationData,
      is_more: true
    })
  },
  shouqi(e) {
    var gnum = e.currentTarget.dataset.gnum;
    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 300,
      timingFunction: "ease",
      delay: 0
    })
    var animationData = animation.height(2 * 100).step().export();
    this.setData({
      animationData,
      is_more:false
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
  
  },
  lookMore(){
    var show_opt = that.data.show_opt;
    public_js.lookMore(that, show_opt)
  }
})
// pages/payment/payment.js
var api = require('../../api.js').api;
const public_js = require('../../utils/public.js').public_js;
const app = getApp();
var token = '';
var user_id = '';
var that = '';
Page({

  data: {
    nav_list:[],
  },

  onLoad: function (options) {
    that = this;
    wx.removeStorageSync('address');
    user_id = wx.getStorageSync('user_id');
    token = wx.getStorageSync("token");
    this.getData();
    this.getNavList();
  },

  onShow: function () {
    var that = this
    public_js.addr_info(that);
    public_js.getAddressData(that);
  },
  getNavList(){
    wx.request({
      url: api.djf.getNavList,
      data:{
        
      },
      method:"POST",
      success(res){
        that.setData({
          typeList:res.data.data
        })
      }
    })
  },

  bg_click() {
    this.hide_list()
  },
  hide_list() {
    public_js.hide_list(that);
  },
  //选择时间
  bindPickerChange(e) {
    public_js.bindPickerChange(e, that);
  },
  //显示选择域
  show_section(e) {
    public_js.show_section(e, that);
  },
  // 显示选择配送域
  select_ship(e) {
    public_js.select_ship(e, that);
  },
  select_ship_mode(e) {
    public_js.select_ship_mode(e, that);
  },
  //领取代跑卷
  receive_dp(e) {
    public_js.receive_dp(e, that);
  },
  getData() {
    public_js.getData(that,4);
  },
  money(e){
    var money = e.detail.value;
    this.setData({
      money: parseFloat(money)
    })
    console.log(this.data.money)
  },
  pay_note(e){
    var note = e.detail.value;
    this.setData({
      note
    })
  },
  selectPayType(e) {
    var min_money = e.currentTarget.dataset.minmoney;
    var shop_id = e.currentTarget.dataset.id;
    var typeIndex = e.currentTarget.dataset.index;
    this.setData({
      min_money,
      typeIndex,
      shop_id
    })
  },
  go_pay() {
    var n = !this.data.address ? '请填写收货地址' : !this.data.shop_id ? '请先选择缴费类型': !this.data.money ? '请输入缴费金额' : this.data.money < this.data.min_money ? '最低缴费金额' + this.data.min_money+'' : '';
    if (n) {
      wx.showModal({
        title: '温馨提示',
        content: n,
        showCancel: false
      })
      return false;
    }
    var data = {
      address_id: this.data.address.id,
      run_type: 4,
      shipping_id: this.data.shipping_id,
      postscript: this.data.note || '',
      run_id: this.data.run_id || '',
      select_time_tip: this.data.select_time_tip || '',
      user_id,
      token,
      shop_id: this.data.shop_id,
      pay_fee: this.data.money
    }
    wx.request({
      url: api.delivery.delivery,
      data: data,
      method: "POST",
      success(res) {
        if (res.data.status.succeed == 1) {
          var order_id = res.data.data.order_id;
          that.setData({
            order_id
          })
          if (res.data.data.order_info.order_status == 1) {
            public_js.getdpj(that, 7, order_id)
            return false;
          }
          wx.request({
            url: api.order.pay,
            data: {
              "order_id": res.data.data.order_id,
              user_id
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
                  public_js.getdpj(that, 7, order_id)
                },
                'fail': function (res) {

                  app.err_tip('支付失败，请重新支付');
                  setTimeout(function () {
                    wx.reLaunch({
                      url: '../order_detail/index?order_id=' + order_id + '',
                    })
                  }, 1500)
                }
              })
              
            }
          })
        } else {
          app.err_tip('支付失败')
        }
      }
    })
  },
  closevoucher() {
    public_js.colose_lj(that);

  }
})
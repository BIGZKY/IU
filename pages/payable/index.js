// pages/payable/index.js
var api = require('../../api.js').api;
const public_js = require('../../utils/public.js').public_js;
const app = getApp();
var token = '';
var user_id = '';
var that = '';
Page({
  data: {
    selctedGoods:[],
    able_isvip: false,
    paying: false,
    addMoney:'',
    controll:0,
    footerType:1
  },
  onLoad: function (options) {
    that = this;
    wx.showLoading({
      title: '处理数据中',
    })
    if(options.type==2){
      that.setData({
        type:2
      })
    }
    wx.removeStorageSync('note');
    wx.removeStorageSync('address');
    user_id = wx.getStorageSync('user_id');
    token = wx.getStorageSync("token");
    var shop_id = options.shop_id;
    var selctedGoods = wx.getStorageSync('selctedGoods');
    var str = '';
    var addMoney = 0;
    selctedGoods.forEach(function(item){
      if (item.marks[item.s_index]){
        str += item.food_name + ' ' + item.marks[item.s_index] + ' ';
      }
      addMoney += parseFloat(item.food_current) * item.num;
    })
    addMoney = parseFloat(addMoney.toFixed(2));
    this.setData({
      shop_id,
      selctedGoods,
      note:str,
      addMoney
    })
    if(str){
      this.setData({
        note: str
      })
      wx.setStorageSync('note', str)
    }
    
    this.getData();
    // this.getShopDetail(shop_id);
    
  },
  
  onShow: function () {
    var a = this
    public_js.getAddressData(that);
    this.setData({
      isvip: wx.getStorageSync('isvip')
    })
    var note = wx.getStorageSync('note');
    if (note) {
      this.setData({
        note
      })
    }
    wx.hideLoading();
  },
  getShopDetail(shop_id){
    wx.request({
      url: api.shop_street.shopdetail,
      data:{
        shop_id
      },
      method:"POST",
      success(res){
        var tagList = res.data.data.tag.split('，');
        var tagArr = [];
        that.setData({
          logo: res.data.data.logo,
          shop_name: res.data.data.shop_name,
          shop_time: res.data.data.shop_time,
          shop_phone: res.data.data.shop_phone,
        })
        wx.hideLoading();
      }
    })
  },

  jia(e){
    var index = e.currentTarget.dataset.index;
    var num = this.data.selctedGoods[index].num || 0;
    var money = this.data.selctedGoods[index].food_current;
    num++;
    this.data.selctedGoods[index].num = num;
    var addMoney = that.data.addMoney + parseFloat(money);
    let selctedGoods = this.data.selctedGoods.filter(function (item) {
      return item.num > 0;
    })

    this.setData({
      selctedGoods,
      addMoney
    })

  },
  jian(e){
    var index = e.currentTarget.dataset.index;
    var num = this.data.selctedGoods[index].num;
    var money = this.data.selctedGoods[index].food_current;
    num--;
    this.data.selctedGoods[index].num = num;
    var addMoney = that.data.addMoney - parseFloat(money);
    let selctedGoods = this.data.selctedGoods.filter(function (item) {
      return item.num > 0;
    })
    this.setData({
      selctedGoods,
      addMoney
    })
  },
  makePhoneCall(){
    wx.makePhoneCall({
      phoneNumber: that.data.shop_phone,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
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
  getData() {
    public_js.getData(that,2);
  },
  bg_click() {
    this.hide_list()
  },
  hide_list() {
    public_js.hide_list(that)
  },
  //选择时间包月
  baoyue(e) {
    public_js.baoyue(e,that);
  },

  //领取代跑卷
  receive_dp(e) {
    public_js.receive_dp(e, that)
  },

  delivery_info(e) {
    var delivery_info = e.detail.value;
    this.setData({
      delivery_info
    })
  }, 

  go_pay() {
    var n = public_js.check_shop_time();
    if (n) {
      return false;
    }
    var n = !this.data.address ? '请填写收货地址' : !this.data.selctedGoods.length ? '请先选择商品' : !this.data.shipping_id ? '请选择配送方式' : !this.data.address.run_type.includes(this.data.shipping_area_id + '') ? "该地址无法使用此配送方式,请重新选择" : !this.data.ship_time && this.data.shipping_id == 7? '请选择配送时间' : '';
    if (n) {
      wx.showModal({
        title: '温馨提示',
        content: n,
        showCancel: false
      })
      return false;
    }
    //判断是否超出当前时间-------------start
    if (that.data.ableChooseTime) {
      var current_time = new Date().getHours();
      var current_time_minutes = new Date().getMinutes();
      current_time_minutes = current_time_minutes < 10 ? '0' + current_time_minutes : current_time_minutes;
      if (parseFloat(current_time + '.' + current_time_minutes) > parseFloat(that.data.ship_end_time.replace(':', '.'))) {
        wx.showModal({
          title: '温馨提示',
          showCancel: false,
          content: '请选择合理配送时间',
        })
        return false;
      }
    }

    //-------------------------------end
    wx.showToast({
      title: '正在发起支付...',
      mask: true,
      icon: "loading"
    })
    that.setData({
      paying: true
    })
    var restaurant = [];
    this.data.selctedGoods.forEach(function(item){
      if (item.num){
        var obj = {};
        obj.tagName = item.food_name;
        obj.num = item.num;
        obj.id = item.id;
        obj.selected = false;
        restaurant.push(obj)
      }
     
    })
    
    var data = {
      address_id: this.data.address.id,
      run_type: 2,
      shipping_id: this.data.shipping_id,
      postscript: this.data.note ||'',
      run_id: this.data.run_id || '',
      select_time_tip: this.data.ship_time,
      user_id,
      token,
      restaurant: restaurant,
      shop_id: this.data.shop_id,
      type: this.data.type || 0
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
            wx.hideToast();
            public_js.getdpj(that, 6, order_id)
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
                  wx.hideToast();
                  public_js.getdpj(that, 6, order_id);
                  that.setData({
                    paying: false
                  })
                },
                'fail': function (res) {
                  app.err_tip('支付失败，请重新支付');
                  setTimeout(function () {
                    wx.reLaunch({
                      url: '../order_detail/index?order_id=' + order_id + '',
                    })
                  }, 1500);
                  that.setData({
                    paying: false
                  })
                }
              })
              
            }
          })
        } else {
          app.err_tip('支付失败');
          that.setData({
            paying: false
          })
        }
      }
    })
  },
  closevoucher() {
    public_js.colose_lj(that);

  },
  //选择配送时间
  select_ship_time(e) {
    public_js.select_ship_time(that, e)
  },
  onReady(){

  }
})
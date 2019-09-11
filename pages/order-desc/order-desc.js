// pages/order-desc/order-desc.js
var api = require('../../api.js').api;
const public_js = require('../../utils/public.js').public_js;
const app = getApp();
var token = '';
var user_id = '';
var that = '';
Page({
  data: {
    animationData: {},
    is_show: false,
    time_index: -1,
    money: 0,
    select_time_tip: '',
    address: '',
    run_member: [],
    ship_tip: '',
    albe_choose_time: false,
    paying: false,
    addMoney: 0,
    controll: 0,
    discount: 1
  },
  onLoad: function (options) {
    that = this;
    wx.removeStorageSync('note');
    wx.removeStorageSync('address');
    user_id = wx.getStorageSync('user_id');
    token = wx.getStorageSync("token");
    var rec_id = options.rec_id;
    this.setData({
      rec_id: rec_id
    })
    this.getOrderData(rec_id);
  },
  onShow() {
    // public_js.addr_info(that);
    public_js.getAddressData(that);
    that.setData({
      isvip: wx.getStorageSync('isvip')
    })
    var note = wx.getStorageSync('note');
    if (note) {
      this.setData({
        note
      })
    }

  },
  //获取订单
  getOrderData(rec_id) {
    wx.showLoading({
      title: '正在处理数据',
    })
    // 购物流检查订单
    wx.request({
      url: api.car.checkOrder,
      data: {
        token,
        rec_id: rec_id,
        run_type: 3,
        user_id
      },
      method: "POST",
      success(res) {
        console.log(res);
        var isvip = wx.getStorageSync('isvip');
        if (isvip) {        //显示是不是VIP会员配送结果
          that.setData({
            able_isvip: true
          })
        } else {
          that.setData({
            able_isvip: false
          })
        }

        var car_goods_list = res.data.data.goods_list;
        that.setData({
          car_goods_list: car_goods_list
        })
        var sum = 0;
        car_goods_list.forEach(function (element) {
          sum += parseFloat(element.subtotal);
        })
        var goods_num = car_goods_list.length;

        that.setData({
          sum: sum.toFixed(2),
          goods_num,

        })
        if (res.data.data.is_run == 1) {
          var run_num = res.data.data.run_member.length;
          that.setData({
            is_run: true,
            run_member: res.data.data.run_member,
            dp_tip: run_num + '个代跑劵可用'
          })
        }
        //配送方式
        var ship_mode_list = res.data.data.shipping;
        var newShip_mode_list = [];
        ship_mode_list.forEach(function (element, index) {
          element.fee = element.configure[1].value;
          if (element.configure[1].isvip && element.configure[1].isvip == 1) {
            element.isvip = true;
            element.discount = element.fee
          }
          if (element.shipping_id != 1 && element.shipping_id != 9) {
            newShip_mode_list.push(element)
          }
        })
        ship_mode_list = newShip_mode_list
        var ship_index = ship_mode_list.findIndex(function (element) {
          return element.defult == 1;
        })
        var obj = ship_mode_list[ship_index];
        that.setData({
          shipping_id: obj.shipping_id,  //设置默认的配送ID,
          shipping_area_id: obj.shipping_area_id
        })
        var fee_list = obj.configure;
        var obj_fee = fee_list[1] // 设置基重obj
        // if (obj_fee.isvip) {
        //   obj_fee.value = 0
        // }
        var time = fee_list.find(function (element) {
          return element.name == 'ship_time';
        })
        if (time.value.length) {
          that.setData({
            ableChooseTime: true,
          })
        } else {
          that.setData({
            ableChooseTime: false,
          })
        }
        var time_list = time.value;
        var arr = [];
        //当前毫秒数
        var current_time = (new Date()).getTime();
        time_list = time_list.filter(function (item) {
          item.times = item.times || 0;
          //截止毫秒数
          var end_time = new Date().toLocaleDateString() + ' ' + item.end;

          return (current_time + item.times * 60 * 1000) > new Date(end_time).getTime() ? false : true;

        })

        time_list.forEach(function (value, indexs) {
          var item = value.end;
          arr[indexs] = {}
          arr[indexs].time_stage = value.start + '-' + value.end;
          arr[indexs].time = value.end;
          arr[indexs].p_index = indexs;
        })
        var time_list = arr;

        if (time_list.length > 0) {
          time_list.reverse();
          var select_time_tip = time_list[0].time;
          that.setData({
            time_list,
            ship_time: time_list[0].time_stage,
            ship_end_time: time_list[0].time
          })
        } else {
          that.setData({
            time_list: [],
            ship_time: '',
          })
        }
        that.setData({
          ship_mode_list: ship_mode_list,
          albe_choose_time: true,
          fee: parseFloat(obj_fee.value),
          ship_index,
          ship_time_index: 0,

          supermarket_day: res.data.data.user_info.supermarket_day || '',
        })
        var bonus = res.data.data.bonus || ''
        //获取红包列表
        if (bonus) {
          var hb_list = res.data.data.bonus;
          that.setData({
            allow_use_bonus: 1,
            hb_list: hb_list,
            hb_tip: hb_list.length + '个可用红包'
          })
        } else {
          that.setData({
            allow_use_bonus: 0,
            hb_list: [],
            hb_tip: '暂无红包可用'
          })
        }
        wx.hideLoading();
      }
    })
  },


  //显示选择域
  show_section(e) {
    public_js.show_section(e, that)
  },
  hide_list() {
    public_js.hide_list(that)
  },
  bg_click() {
    this.hide_list()
  },

  //领取红包
  receive_hb(e) {
    public_js.receive_hb(e, that)
  },

  //领取代跑卷
  receive_dp(e) {
    public_js.receive_dp(e, that)
  },

  //选择配送方式
  select_ship_mode(e) {
    var that = this;
    public_js.select_ship_mode(e, that);
  },
  //获取包月
  baoyue(e) {
    public_js.baoyue(e, that);
  },
  //选择时间
  // bindPickerChange(e){
  //   var that = this;
  //   public_js.bindPickerChange(e, that);
  // },

  //加入订单
  go_pay() {
    //检查营业时间
    var n = public_js.check_shop_time();
    if (n) {
      return false;
    }

    //检查最低金额不低于10元
    var minShopMoney = wx.getStorageSync('minShopMoney');
    if ((that.data.sum - that.data.money) < minShopMoney && minShopMoney) {
      wx.showToast({
        title: `满${minShopMoney}元起送`,
        icon: "none"
      })
      return false;
    }
    if (!this.data.address) {
      wx.showModal({
        title: '温馨提示',
        showCancel: false,
        content: '请选择配送地址',
      })
      return false;
    }
    if (!this.data.shipping_id) {
      wx.showModal({
        title: '温馨提示',
        showCancel: false,
        content: '请选择配送方式',
      })
      return false;
    }
    if (!this.data.address.run_type.includes(this.data.shipping_area_id + '')) {
      wx.showModal({
        title: '温馨提示',
        showCancel: false,
        content: '该地址无法使用此配送方式,请重新选择',
      })
      return false;
    }

    if (this.data.ship_time == '' && this.data.shipping_id == 7) {
      wx.showModal({
        title: '温馨提示',
        showCancel: false,
        content: '请选择配送时间',
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
    that.setData({
      paying: true
    })
    // console.log(this.data.address)
    wx.showToast({
      title: '正在发起支付...',
      mask: true,
      icon: "loading"
    })
    wx.request({
      url: api.car.done,
      data: {
        token,
        rec_id: this.data.rec_id,  //购物车id
        pay_id: 0,
        bonus_id: this.data.bonus_id || '',  // 红包id
        shipping_id: this.data.shipping_id,  //配送id
        address_id: this.data.address.id,
        note: this.data.note || '', //备注留言
        run_id: this.data.run_id || '',  //代跑卷id
        run_type: 3,
        user_id,
        select_time_tip: this.data.ship_time,
      },
      method: "POST",
      success(res) {
        wx.hideToast();
        var order_id = res.data.data.order_id;
        that.setData({
          order_id
        })
        if (res.data.status.succeed == 1) {
          wx.request({
            url: api.order.pay,
            data: {
              "order_id": res.data.data.order_id,
              'user_id': wx.getStorageSync('user_id')
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
                  that.setData({
                    paying: false
                  })
                  public_js.getdpj(that, 5, order_id)
                },
                'fail': function (res) {
                  app.err_tip('支付失败');
                  that.setData({
                    paying: false
                  })
                  setTimeout(function () {
                    wx.reLaunch({
                      url: '../order_detail/index?order_id=' + order_id + '',
                    })
                  }, 100)
                }
              })
            }
          })
        } else {
          that.setData({
            paying: false
          })
          app.err_tip('支付失败')
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
  }
})

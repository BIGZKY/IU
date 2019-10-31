// pages/delivery/index.js
var api = require('../../api.js').api;
const public_js = require('../../utils/public.js').public_js;
const app = getApp();
var token = '';
var user_id = '';
var that = '';

Page({
  data: {
    nav_list: [
      {
        src: '../../images/415003601142441838.png',
        nav_name: '快递'
      }
    ],
    village:'',
    floor:'',
    detail_addr: '', 
    payment:'',
    multiArray: [1,2,3,4,5,6,7,8],
    multiIndex: 0,
    ship_tip:'',
    delivery_num:[{val:''}],
    is_showTip:true,
    able_isvip:false,
    shipping_id:'',
    paying: false,
    addMoney:0,
    controll: 0,
    hasdiscount: 1,
    footerType:0,
    num:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
  },

  onShow: function () {
    public_js.getAddressData(that); 
    user_id = wx.getStorageSync('user_id');
    token = wx.getStorageSync("token");
    if (app.globalData.userInfo_bool) {
      that.setData({
        isvip: wx.getStorageSync('isvip')
      })
      this.getData();
    }
  },
  bindarea(e) {
    var detail_addr = e.detail.value;
    this.setData({
      detail_addr: detail_addr
    })
  },
  bind_payment(e){
    var payment = e.detail.value;
    this.setData({
      payment: payment
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
  //获取配送方式数据
  getData(){
    public_js.getData(that,1);
  },
  
  bg_click() {
    this.hide_list()
  },
  hide_list() {
    public_js.hide_list(that)
  },
  //选择件数
  bindPickerChange(e) {
    var multiIndex = e.detail.value;
    var multiArray = this.data.multiArray;
    var val = multiArray[multiIndex];
    var moneyList = that.data.moneyList;
    
    var moneyObj = moneyList.find(function(item){
      return item.express_distance == val;
    })
    if(that.data.isvip){
      var a = parseFloat(moneyObj.express_money).toFixed(2);
    }else{
      var a = (parseFloat(moneyObj.express_money) * that.data.hasdiscount).toFixed(2);
    }

    that.setData({
      multiIndex,
      addMoney : parseFloat(a),
      num: val
    }) 
    
  },
  //领取代跑卷
  receive_dp(e) {
    public_js.receive_dp(e, that)
  },
  baoyue(e){
    public_js.baoyue(e, that);
  },
  
  //检测快递类型
  typeTest(delivery_info){
    var str = '唯品会，德邦，邮政EMS，苏宁易购，室外货架，顺丰，京东';
    var keyWords = str.split('，');
    keyWords.forEach(function(item){
      that.testStr(delivery_info, item)
    })
  },
  testStr(delivery_info, keyWord){
    var reg = new RegExp(keyWord, "g");
    var t = reg.test(delivery_info);
    if (t) {
      that.setData({
        hasEspecial:1
      })
    }
  },
  //判断是几个快递
  judgeNum() {
    let info = this.data.delivery_info;
    let num = this.data.multiArray[this.data.multiIndex];
    let r = /韵达|近邻宝|中通|顺丰|圆通|京东/g;
    let n = info.match(r);
    if (n!==null && n.length !== num) {
      return false;
    }
    return true;
  },

  //发起支付
  go_pay(){
    var that = this;
    if(!this.judgeNum()){
      wx.showToast({
        title: '请检查快递件数',
        icon: 'none'
      })
      return false;
    } 
    if (!app.globalData.userInfo_bool){
      wx.showModal({
        title: '温馨提示',
        content: '请先登录',
        confirmText: '登录',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/index',
            })
          }
        }
      })
      return false;
    }
    //判断账号是否异常
    var controll = that.data.controll;
    if (controll == 2) {
      wx.showModal({
        title: '警告提示',
        content: '系统检测到您多次为他人代取已禁止使用该功能，请联系客服!',
        showCancel: false
      })
      return false;
    }
    //判断营业时间 
    var n = public_js.check_shop_time();
    if (n) {
      return false;
    }
    //判断金额
    var n = !this.data.address ? '请填写收货地址' : !this.data.delivery_info ? '请填写快递信息' : !this.data.shipping_id ? '请选择配送方式' : !this.data.address.run_type.includes(this.data.shipping_area_id + '')? "该地址无法使用此配送方式,请重新选择" : !this.data.ship_time && this.data.shipping_id == 7? '请选择配送时间' : '';
    if(n){
      wx.showModal({
        title: '温馨提示',
        content: n,
        showCancel:false
      })
      return false;
    }

    //检测是否有其它类型快递；
    that.typeTest(this.data.delivery_info);

    //判断件数
    if (that.data.multiArray[that.data.multiIndex] == 0) {
      wx.showModal({
        title: '温馨提示',
        content: '请选择快递件数',
        showCancel: false
      })
      return false
    }
    //判断是否超出当前时间
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
    var user_id = wx.getStorageSync('user_id');
    var data = {
      address_id: this.data.address.id,
      run_type: 1,
      shipping_id: this.data.shipping_id,
      postscript: this.data.delivery_info,
      run_id: this.data.run_id || '',
      select_time_tip: this.data.ship_time,
      user_id: user_id,
      token,
      num: this.data.multiArray[this.data.multiIndex],
      hasEspecial: this.data.hasEspecial || 0
    }

    wx.showToast({
      title: '正在发起支付...',
      mask: true,
      icon: "loading"
    })
    that.setData({
      paying:true
    })
    
    wx.request({
      url: api.delivery.delivery,
      data:data,
      method:"POST",
      success(res){
        if (res.data.status.succeed==1){
          var order_id = res.data.data.order_id;
          that.setData({
            order_id
          })
          if (res.data.data.order_info.order_status == 1){
            that.setData({
              paying: false
            })
            wx.reLaunch({
              url: '../order_detail/index?order_id=' + order_id + '',
            })
            
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
                  public_js.getdpj(that, 4, order_id)
                  that.setData({
                    paying: false
                  })
                },
                'fail': function (res) {
                  app.err_tip('支付失败，请重新支付');
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
        }else{
          app.err_tip('支付失败');
          that.setData({
            paying: false
          })
        }
      }
    }) 
  },

  delivery_info(e) {
    var delivery_info = e.detail.value;

    this.setData({
      delivery_info
    })
  },
  hide_tip(){
    this.setData({
      is_showTip:false
    })
  },
  bindfocus(){
    this.setData({
      is_showTip: false
    })
  },
  closevoucher(){
    public_js.colose_lj(that,);

  },
  //选择配送时间
  select_ship_time(e){
    public_js.select_ship_time(that,e)
  },
})  
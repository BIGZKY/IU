// pages/robbing/index.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var app = getApp();
// 实例化API核心类
var demo = new QQMapWX({
  key: 'B2VBZ-P3F3P-T5UDC-VT7AL-ENIGV-R6FT5' // 必填
});
var hours = [];
var minutes = [];
var days = ['今天','明天'];
var hour = '';
var that = '';
var showTypeList = false;
var api = require('../../api.js').api;
var token = '';
var animation = wx.createAnimation({
  transformOrigin: "50% 50%",
  duration: 300,
  timingFunction: "ease",
  delay: 0
})
Page({
  data: {
    days,
    hours,
    minutes,
    value: [0, 0, 0],
    multiIndex: [0, 0, 0],
    multiArray: [],
    date:0,
    chooseType:0,
    defaultAddr:'',
    goodsTypeList:[
      { className: '其它', imgSrc: '/images/icon_gt_05.png' },
      { className: '文件', imgSrc: '/images/icon_gt_03.png' },
      { className: '工具', imgSrc: '/images/icon_gt_01.png' },
      { className: '药品', imgSrc: '/images/icon_gt_02.png' },
      { className: '生活品', imgSrc: '/images/icon_gt_04.png' },
      { className: '美食', imgSrc:'/images/icon_gt_06.png'},
      ],
    goodsIndex:0,
    // showTip:true,
    goodsType:'其它',
    paying:false,
    tip:{}
  },
  onLoad: function (options) {
    that = this;
    token = wx.getStorageSync('token');
    var userInfo = wx.getStorageSync('userInfo');
    var avatarUrl = wx.getStorageSync('userInfo').avatarUrl;
    var nickName = wx.getStorageSync('userInfo').nickName;
    wx.removeStorageSync('addrInfo')
    this.setData({
      avatarUrl,
      nickName
    })
    this.getDefaultAddr(token);
    this.getServiceType()
  },

  getServiceType(){
    wx.request({
      url: api.delivery.configstore,
      method: "POST",
      data: {
        user_id: wx.getStorageSync('user_id'),
        run_type: 1
      },
      success(res) {
        var ship_mode_list = res.data.data.shipping;
        var serviceType = ship_mode_list.find(function (element, index) {
           return element.shipping_id == 9   
        })
        var priceList = '';
        var a = serviceType.configure;
        
        for(var i in a){
          if (a[i].name == 'express'){
            priceList = a[i].value;
            break;
          }
        }
        var maxPrice = 0;
        priceList.forEach(function(item){
          if (maxPrice < parseInt(item.express_money)){
            maxPrice = parseInt(item.express_money);
          }
        })
        
        var maxObj = priceList.find(function(item){
          return item.express_money == maxPrice
        })
        var maxDistance = maxObj.express_distance.split('-')[1];
        that.setData({
          shipping_area_name: serviceType.shipping_area_name,
          priceList: priceList,
          maxDistance,
          maxPrice
        })
        //显示默认时间
      }

    })
  },
  onShow: function () {

    // hour = new Date().getHours();
    // for (let i = 0; i <= 23; i++) {
    //   if (i > hour) {

    //     if (i < 10) {
    //       i = '0' + i
    //     }
    //     hours.push(i);
    //   }
    // }
    // // hours.unshift('立即配送');
    // this.setData({
    //   multiArray: [days, hours, minutes]
    // })
    
    if (wx.getStorageSync('addrInfo')){
      var addrInfo = wx.getStorageSync('addrInfo');
      if (addrInfo.type){  // 终点
        this.setData({
          receiveAddr: addrInfo.floor, 
          receiveLat: addrInfo.location ? addrInfo.location.lat : that.data.receiveLat,
          receiveLng: addrInfo.location ? addrInfo.location.lng : that.data.receiveLng,
          receivePeople: addrInfo.name,
          receivePhone: addrInfo.tel,
          receiveDetailAddr: addrInfo.detailAddr,
        })
        console.log(addrInfo.location)
      } else {   //起点
        
        this.setData({
          
          originAddr: addrInfo.floor,
          originLat: addrInfo.location ? addrInfo.location.lat : that.data.originLat,
          originLng: addrInfo.location ? addrInfo.location.lng : that.data.originLng,
          originPeople: addrInfo.name,
          originPhone: addrInfo.tel,
          originDetailAddr: addrInfo.detailAddr,
        })

      }
      wx.removeStorageSync('addrInfo')
    }

    var data = this.data;
    if (data.receiveLat && data.originLat){
      this.distance(data.originLat, data.originLng, data.receiveLat, data.receiveLng)
    }
  },
  robbing() {
    wx.request({
      url: '',
    })
  },
  bindMultiPickerChange: function (e) {
    this.setData({
      multiIndex: e.detail.value
    })
    console.log(this.data.multiIndex)
  },
  
  bindMultiPickerColumnChange(e){
    if (e.detail.column==0){   //变第一列
      if (e.detail.value==0){
        hours = []
        for (let i = 0; i <= 23; i++) {
          if (i > hour) {
            if (i < 10) {
              i = '0' + i
            }
            hours.push(i);
          }
        }
        hours.unshift('立即配送');
        minutes = [];
        this.setData({
          multiArray: [days, hours, minutes],
          multiIndex: [0, 0, 0],
          date:0
        })
      } else {
        hours = [];
        for (let i = 0; i <= 23; i++) {
          if (i < 10) {
            i = '0' + i
          }
          hours.push(i);
        }
        minutes = [];
        for (let i = 0; i <= 59; i++) {
          if (i < 10) {
            i = '0' + i
          }
          minutes.push(i)
        }
        
        this.setData({
          multiArray: [days, hours, minutes],
          multiIndex: [1, 0, 0],
          date: 1
        })
        
      }
    } else if (e.detail.column == 1) {  //变第二列
      if (this.data.date == 0 && e.detail.value == 0){
        minutes = [];
        this.setData({
          multiArray: [days, hours, minutes],
          h: e.detail.value
        })
      }else{
        minutes = [];
        for (let i = 0; i <= 59; i++) {
          if (i < 10) {
            i = '0' + i
          }
          minutes.push(i)
        }
        this.setData({
          multiArray: [days, hours, minutes],
          multiIndex: [this.data.date, e.detail.value,0],
          h: e.detail.value,
        })
      }
    } else if (e.detail.column == 2){
      this.setData({
        multiIndex: [this.data.date, this.data.h, e.detail.value],
      })
    }
  },
  showTypeList(){
    showTypeList = !showTypeList;
    this.setData({
      showTypeList
    })
  },
  chooseType(e){
    var chooseType = e.currentTarget.dataset.s_type;
    showTypeList = false;
    if (chooseType){
        this.setData({
          chooseType:1,
          showTypeList
        })
    }else{
      this.setData({
        chooseType: 0,
        showTypeList
      })
    }
    that.setData({
      receiveAddr: '',
      receiveDetailAddr: '',
      receivePhone: '',
      receiveLat: '',
      receiveLng: '',
      originAddr: '',
      originDetailAddr: '',
      originPhone: '',
      originLat: '',
      originLng: '',
      originPeople:'',
      receivePeople:'',

    })
    if(that.data.tip.content){
      that.setData({
        showTip: true
      })
    }
  },
  // 获取默认地址
  getDefaultAddr(token){
    var that = this;
    wx.request({
      url: api.address.addr_list,
      data: {
        token: token,
        user_id: wx.getStorageSync('user_id')
      },
      success(res) {
        console.log(res)
        if (res.data.data[0]) {
          var defaultAddr = res.data.data[0]; 
          var tip = {}
          tip.content = defaultAddr.merchent_xiaoqu + defaultAddr.merchent_flow + defaultAddr.address_info;
          tip.phone = defaultAddr.mobile;
          that.setData({
            defaultAddr,
            tip,
          })
          if (tip.content){
            that.setData({
              showTip: true
            })
          }
        }else{
          that.setData({
            defaultAddr:false
          })
        }
      }
    })
  },
  // 点击提示赋值
  assign(e){
    var defaultAddr = that.data.defaultAddr;
    if (that.data.chooseType==0){
      that.setData({
        originAddr: defaultAddr.merchent_xiaoqu + defaultAddr.merchent_flow,
        originDetailAddr: defaultAddr.address_info,
        originPhone: defaultAddr.mobile,
        originLat: defaultAddr.location.latitude,
        originLng: defaultAddr.location.longitude,
        originPeople: defaultAddr.consignee,
        
        receiveAddr: '',
        receiveDetailAddr: '',
        receivePhone: '',
        receiveLat: '',
        receiveLng: '',
        receivePeople:''
      })
    }else{
      that.setData({
        originAddr:'',
        originDetailAddr: '',
        originPhone: '',
        originLat:'',
        originLng: '',
        originPeople:'',

        receiveAddr: defaultAddr.merchent_xiaoqu,
        receiveDetailAddr: defaultAddr.merchent_flow,
        receivePhone: defaultAddr.mobile,
        receiveLat: defaultAddr.location.latitude,
        receiveLng: defaultAddr.location.longitude,
        receivePeople: defaultAddr.consignee,
      })
    }
    if (e){
      that.setData({
        showTip: false
      })
    }
  },
  coloseTip(){
    that.setData({
      showTip:false
    })
  },

  // 选择送什么商品
  choose_goods_type(e){
    var index = e.currentTarget.dataset.index;
    var goodsType = e.currentTarget.dataset.goods
    this.setData({
      goodsIndex:index,
      goodsType: goodsType,
    })

  },
  //绑定取货/发货-电话
  originPhone(e){
    var originPhone = e.detail.value;
    this.setData({
      originPhone
    })
  },
  //绑定收货/发货-地址
  originDetailAddr(e){
    var originDetailAddr = e.detail.value;
    this.setData({
      originDetailAddr
    })
  },
  //绑定收货电话
  receivePhone(e) {
    var receivePhone = e.detail.value;
    this.setData({
      receivePhone
    })
  },
  //绑定收货地址
  receiveDetailAddr(e) {
    var receiveDetailAddr = e.detail.value;
    this.setData({
      receiveDetailAddr
    })
  },
  // 绑定备注
  dispatch_note(e){
    var dispatch_note = e.detail.value;
    this.setData({
      dispatch_note
    })
  },
  // 绑定收货人
  receivePeople(e){
    var receivePeople = e.detail.value;
    this.setData({
      receivePeople
    })
  },
  //绑定发货人
  originPeople(e) {
    var originPeople = e.detail.value;
    this.setData({
      originPeople
    })
  },
  //计算距离
  distance(originLat, originLng,receiveLat, receiveLng){
    console.log(originLat, originLng, receiveLat, receiveLng)
    that.setData({
      isCompuute:true
    })
    demo.calculateDistance({
      mode:'driving',
      from: {
        latitude: originLat,
        longitude: originLng
      },
      to:[{
          latitude: receiveLat,
          longitude: receiveLng
      }],
      success: function (res) {
       
        var distance = res.result.elements[0].distance;
        
        if (distance / 1000 >30){
          wx.showModal({
            title: '温馨提示',
            content: '超出服务范围，请重新选择地点',
            showCancel:false
          })
          return false;
        } else if (distance == 0){
          
        }
        var t = that.data.priceList
        var c = '';
        for(let i=0;i<t.length;i++){
          let u = t[i].express_distance.split('-');
          if (parseFloat(u[0]) <= (distance / 1000) && (distance / 1000) < parseFloat(u[1])){
              c =  t[i]
          }
        }

        if(c){
          var price = c.express_money;
        }else{
          var cd = (distance / 1000).toFixed(1) - that.data.maxDistance ;
          var price = that.data.maxPrice + cd * 1;
        }
        that.setData({
          price,
          distance: (distance / 1000).toFixed(1),
          isCompuute: false
        })
      },
      fail: function (res) {
        console.log(res);
        wx.showModal({
          title: '温馨提示',
          content: '超出服务范围，请重新选择地点',
          showCancel: false
        })
        that.setData({
          isCompuute:false
        })
        return false;
        
      },
    });
  },
  dispatch(){
    let data = this.data;
    let n = '',t='',e = '',x = '', p='';
    if (data.chooseType==0){
      t = '请输入发货电话';
      e = '请输入发货地址';
      x = '请输入详细发货地址';
      p = '请输入发货人'
    }else{
      t = '请输入取货电话';
      e = '请输入取货地址';
      x = '请输入详细取货地址';
      p = '请输入取货人';
    }
    n = !/^1(3|5|6|7|8)\d{9}$/.test(data.originPhone) ? t : !data.originAddr ? e : !data.originPeople ? p :!data.receiveAddr ? '请输入收货地址' : !/^1(3|5|6|7|8)\d{9}$/.test(data.receivePhone) ? '请输入收货电话' : !data.receivePeople ? '请输入收货人' :false;
    if(n){
      wx.showModal({
        title: '温馨提示',
        content: n,
      })
      return false;
    }
    wx.showToast({
      title: '正在发起支付...',
      mask: true,
      icon: "loading"
    })
    that.setData({
      paying: true
    })
    let obj = {
      chooseType: data.chooseType,
      goodsType: data.goodsType,
      originPhone: data.originPhone,
      originAddr: data.originAddr,
      originDetailAddr: data.originDetailAddr || '',
      receivePhone: data.receivePhone,
      receiveAddr: data.receiveAddr,
      receiveDetailAddr: data.receiveDetailAddr || '',
      serviceTime: data.multiArray[1][data.multiIndex[1]] + data.multiArray[2][data.multiIndex[2]] ? data.multiArray[2][data.multiIndex[2]] :'',
      dispatch_note: data.dispatch_note || '',
      receiveLat: data.receiveLat,
      receiveLng: data.receiveLng,
      originLat: data.originLat,
      originLng: data.originLng,
      user_id: wx.getStorageSync('user_id'),
      price: data.price,
      shipment_name: data.originPeople,
      delivery_name: data.receivePeople,

    }
    wx.request({
      url: api.dispatch.dispatch,
      data:obj,  
      method:"POST",
      success(res){
        console.log(res)
        if (res.data.status.error_code == 400){

          wx.showModal({
            title: '温馨提示',
            content: res.data.status.error_desc,
            showCancel:false
          })
          that.setData({
            paying: false
          })
          return false;
        }
        var order_id = res.data.data.order_id;
        // 支付
        wx.request({
          url: api.dispatch.dispatchPay,
          data: {
            "order_id": res.data.data.order_id,
            user_id: wx.getStorageSync('user_id')
          },
          method: "POST",
          success(res) {
            console.log(res)
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
                wx.showToast({
                  title: '派单成功',
                })
                setTimeout(function(){
                  wx.redirectTo({
                    url: '../robbing-detail/index?id=' + order_id + '&types=is_my',
                  })
                },1200)
                
               
              },
              'fail': function (res) {
                app.err_tip('支付失败，请重新支付');
                that.setData({
                  paying: false
                })
              }
            })

          }
        })
      }
    })
  },
  navigator(e){

    var i = e.currentTarget.dataset.i;
    if(i==0){
      var addrInfo = {
        name: that.data.originPeople,
        tel: that.data.originPhone,
        addr: that.data.originAddr,
        detailAddr: that.data.originDetailAddr,
        hasLocation: that.data.originLat ? true : false
      }
      wx.setStorageSync('addrInfo', addrInfo);
      wx.navigateTo({
        url: './add-addrInfo/index',
      })
    }else if(i==1){
      var addrInfo = {
        name: that.data.receivePeople,
        tel: that.data.receivePhone,
        addr: that.data.receiveAddr,
        detailAddr: that.data.receiveDetailAddr,
        hasLocation: that.data.receiveLng ? true : false
      }
      wx.setStorageSync('addrInfo', addrInfo);
      wx.navigateTo({
        url: './add-addrInfo/index?type=end',
      })
    }
  }
})

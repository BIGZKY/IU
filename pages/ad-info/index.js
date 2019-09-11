//index.js
//获取应用实例
const app = getApp()
var api = require('../../api.js').api;
var that = '';
Page({
  data: {
    items: [
      { name: '男', value: '男', checked: 'true' },
      { name: '女', value: '女'},
    ],
    userSex:'男'
  },
  onShow(){
    // if (wx.getStorageSync('adInfoStorage').enroll_money){
    //   this.setData({
    //     enroll_money: wx.getStorageSync('adInfoStorage').enroll_money,
    //     adver_preferential: wx.getStorageSync('adInfoStorage').adver_preferential
    //   })
    // }
  },
  onLoad: function (options) {
    that = this;
    this.getAdData(options.id);
  },

  getAdData(id) {
    wx.request({
      url: api.ad.adDetail,
      data: {
        adver_id: id
      },
      method: "POST",
      success(res) {
        console.log(res)
        var adInfo = res.data.data;
        that.setData({
          adInfo
        })

      }
    })
  },
  radioChange: function (e) {

    this.setData({
      userSex: e.detail.value
    })
  },
  formSubmit(e){  

  },
  userName(e){
    this.setData({
      userName:e.detail.value
    })
  },
  userPhone(e) {
    this.setData({
      userPhone: e.detail.value
    })
  },
  submit(){
    var n = '';
    var data = this.data
    n = !data.userName ? '请输入姓名' : !/^1\d{10}$/.test(data.userPhone) ? '请输入联系方式' : false;
    if(n){
      wx.showModal({
        title: '温馨提示',
        content: n,
        showCancel: false
      })
      return false;
    }
    wx.request({
      url: api.ad.submitInfo,
      data:{
        userName: data.userName,
        userPhone: data.userPhone,
        userSex: data.userSex,
        adver_preferential: data.adInfo.adver_preferential,
        user_id: wx.getStorageSync('user_id'),
        adver_id: data.adInfo.adver_id,
        enroll_money: data.adInfo.enroll_money
      },
      method:"POSt",
      success(res){
        if (res.data.data.order_info.order_status==1){
          app.err_tip('报名成功');
          setTimeout(function () {
            wx.reLaunch({
              url: '../main/main',
            })
          }, 2000)
        }else{
          wx.request({
            url: api.ad.adPay,
            data: {
              "order_id": res.data.data.order_id,
              user_id: wx.getStorageSync('user_id')
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
                  app.err_tip('报名成功');
                  setTimeout(function(){
                    wx.reLaunch({
                      url: '../main/main',
                    })
                  },2000)
                },
                'fail': function (res) {
                  app.err_tip('支付失败，请重新支付');
                }
              })

            }
          })
        }
      }
    }) 
  }
})

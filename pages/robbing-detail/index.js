// pages/robbing/index.js
var api = require('../../api.js').api;
const public_js = require('../../utils/public.js').public_js;
var that = '';
var animation = wx.createAnimation({
  transformOrigin: "50% 50%",
  duration: 300,
  timingFunction: "ease",
  delay: 0
})

Page({
  data: {
    progress_status: [
      { title: '发布', time: '05-09 12:32' },
      { title: '接单', time: '05-09 12:32' },
      { title: '取货', time: '05-09 12:32' },
      { title: '完成', time: '05-09 12:32' },
    ],
    showModel: false,
    show_opt: '',
    types:''
  },
  onLoad: function (options) {
    that = this;
    var id = options.id;

    this.setData({
      id: id,
    })
    if (options.express_id) {
      that.setData({
        express_id: options.express_id
      })
    }
    if (options.types) {
      that.setData({
        types: options.types   //我的派单 ismy   我的抢单  myrobbing    列表  list 
      })
      wx.setStorageSync('status', options.status);
    }

    this.getTaskData(id)
  },
  getTaskData(id) {
    wx.showLoading({
      title: '正在加载数据',
    })
    wx.request({
      url: api.dispatch.dispatchDetail,
      data: {
        user_id: wx.getStorageSync('user_id'),
        free_id: id,
      },
      method: "POST",
      success(res) {
        console.log(res)
        var taskObj = res.data.data;
        taskObj.distance_detail = (taskObj.distance_detail / 1000).toFixed(2);
        that.progress(taskObj.status)
        that.setData({
          taskObj,
        })
      }
    })
  },
  onReady: function () {


  },
  progress(progressStatus) {
    var progress = 0;
    var status = 0;
    switch (progressStatus) {
      case 0:
        progress = 0;
        status = 0;
        break;
      case 1:
        progress = 33.333;
        status = 1;
        break;
      case 2:
        progress = 66.666;
        status = 2;
        break;
      case 5:
        progress = 100;
        status = 3;
        break;
    }
    animation.width('' + progress + '%').step();
    that.setData({
      animationData: animation.export(),
      status
    })
    wx.hideLoading();
  },
  onShow: function () {

    // console.log(that.data.types)
  },  

  go_addr(e) {
    let a = e.currentTarget.dataset.addr;
    let b = a.split(',');
    let c = new Number(b[0])
    let d = new Number(b[1])
    wx.openLocation({
      latitude: c,
      longitude: d,
      scale: 28
    })
  },
  callPhone(e) {
    let a = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: '' + a + '',
    })
  },
  robbing() {
    wx.request({
      url: api.dispatch.robbing,
      data: {
        user_id: wx.getStorageSync('user_id'),
        order_id: this.data.express_id
      },
      method: "POST",
      success(res) {
        console.log(res);
        if (res.data.data) {

          wx.showToast({
            title: '' + res.data.data.message + '',
            icon: 'none'
          })
          that.progress(1)
          that.setData({
            tip: '抢单成功'
          })
          wx.request({
            url: api.dispatch.smscode,
            data: {
              order_id: res.data.data.order_id
            },
            method: "POST",
            success(res) {
              console.log(res)
            }
          })
        }
      }
    })
  },
  showModel() {
    this.setData({
      showModel: true
    })
  },
  cancle() {
    this.setData({
      showModel: false
    })
  },
  takeGoods() {
    wx.request({
      url: api.dispatch.freestatus,
      data: {
        user_id: wx.getStorageSync('user_id'),
        order_id: this.data.express_id,
        status: 2
      },
      method: 'GET',
      success: function (res) {
        if (res.data.data) {
          that.progress(2);
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  receipt_code(e) {
    var a = e.detail.value;
    this.setData({
      receipt_code: a
    })
  },
  complete() {
    if (!this.data.receipt_code) {
      wx.showToast({
        title: '请先输入验证码',
        icon: "none",
        duration: 1500
      })
      return false;
    }
    wx.request({
      url: api.dispatch.freestatus,
      data: {
        user_id: wx.getStorageSync('user_id'),
        order_id: this.data.express_id,
        status: 5,
        receipt_code: this.data.receipt_code,
        
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        if (res.data.data) {
          that.data.taskObj.status = 5;
          that.setData({
            showModel: false,
            taskObj: that.data.taskObj
          })
          that.progress(5);
          wx.showToast({
            title: '任务已完成',
          })
        } else {
          wx.showModal({
            title: '温馨提示',
            content: '' + res.data.status.error_desc + '',
            showCancel: false
          })
        }

      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  callMe() {
    wx.makePhoneCall({
      phoneNumber: '' + that.data.taskObj.express_mobile + '',
    })
  },
  lookMore() {
    var show_opt = that.data.show_opt;
    public_js.lookMore(that, show_opt)
  }
})
var api = require('../../../api.js').api;
const public_js = require('../../../utils/public.js').public_js;
var that = '';
Page({

  data: {
    taskList:[],
    noData:false,
    is_jishi:'',
    currentTab:0
  },
  onLoad: function (options) {
    that = this;
    var region_id = options.id;
    that.setData({
      region_id,
    })

    var zs_type = options.zs_type;
    wx.setStorageSync('zs_type', zs_type);
    if (zs_type==1){   //预约单
      that.setData({
        is_jishi: '',
        zs_type:1
      })
    }else{
      that.setData({  //及时单
        is_jishi: 2,
        zs_type:2
      })
    }
  },
  getTaskData(region_id, express_status){
    wx.showLoading({
      title: '正在加载数据',
    })
    wx.request({
      url: api.order.regions,
      data: {
        region_id,
        type_list:1,
        staff_id: wx.getStorageSync('staff_id'),
        is_jishi: that.data.is_jishi || '',
        user_id: wx.getStorageSync('user_id'),
        express_status: express_status || ''
      },
      method: "POST",
      success(res) {
        if (res.data.status.succeed == 1){
          var taskList = res.data.data;
          taskList.forEach(function(item){
            item.add_time = public_js.timestampToTime(item.add_time);
          })
          that.setData({
            taskList,
            noData:true
          })
          if(taskList.length>0){
            that.setData({
              noData: false
            })
          }
        }else{
          that.setData({
            noData: true
          })
        }
        wx.hideLoading();
      }
    })
  },

  onShow: function () {
    var region_id = that.data.region_id;
    that.getTaskData(region_id,1);
  },

  tabNav: function (e) {
    var region_id = that.data.region_id;
    if (e.currentTarget.dataset.current == 0) {
      this.getTaskData(region_id,1)
    } else {
      this.getTaskData(region_id,5)
    }
    this.setData({
      currentTab: e.currentTarget.dataset.current,
    })
  },
  showModel(e) {
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index;
    this.setData({
      showModel: true,
      express_id:id,
      index
    })
  },
  cancle() {
    this.setData({
      showModel: false
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
      console.log(this.data.receipt_code)
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
        types:1
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.data.data) {
          that.data.taskList.splice(that.data.index,1);
          that.setData({
            showModel: false,
            taskList: that.data.taskList,
            receipt_code:''
          })
          wx.showToast({
            title: '操作成功',
            
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
  yu_complete(e){  //预约单完成
    var express_id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    wx.request({
      url: api.dispatch.freestatus,
      data: {
        user_id: wx.getStorageSync('user_id'),
        order_id: express_id,
        status: 5,
        types: 1
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.data.data) {
          that.data.taskList.splice(index, 1);
          that.setData({
            showModel: false,
            taskList: that.data.taskList,
            receipt_code: ''
          })
          wx.showToast({
            title: '操作成功',

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
  }
})
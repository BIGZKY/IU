
var api = require('../../api.js').api;
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var demo = new QQMapWX({
  key: 'B2VBZ-P3F3P-T5UDC-VT7AL-ENIGV-R6FT5' // 必填
});
var that = '';
Page({

  data: {
    navIndex: 0,
    taskList: [],
    currentTab:0,
    moreDataTip: false
  },

  onLoad: function (options) {
    that = this;
    
  },
  tabNav: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.current,
      moreDataTip: false
    })
  },
  getTaskData(skip,type) {
    wx.showLoading({
      title: '正在加载数据',
    })
    wx.request({
      url: api.dispatch.getDispatchList,
      data: {
        user_id: wx.getStorageSync('user_id'),
        skip: skip,
        types: 'is_kk'
      },
      method: "POST",
      success(res) {
        var data = res.data.data.date;
        if (data.length>0){
          data.forEach(function (item, index) {
            let a = item.service_address_longlat.split(',');
            item.add_time = item.add_time.slice(5, -3);
          })
          
        }
        let taskList = [...that.data.taskList, ...data];
        if (type == 2 && data.length == 0) { //没有数据
          that.setData({
            hasMoreData:false
          })
        } else if (type == 2 && data.length > 0) {  //还有数据
          that.setData({
            hasMoreData: true
          })
        }
        that.setData({
          skip: res.data.data.skip
        })
        that.setData({
          taskList
        })
      },
      complete() {
        wx.hideLoading()
      }
    })
  },
  getSpecDelivery() {
    wx.showLoading({
      title: '正在加载数据',
    })
    var data = {
      staff_id: wx.getStorageSync('staff_id'),
      is_jishi: 1
    }
    wx.request({
      url: api.order.regions,
      data: data,
      method: "POST",
      success(res) {
        console.log(res)
        that.setData({
          spec_delivery_list: res.data.data
        })
        // if (that.data.spec_delivery_list.length == 0) {
        //   that.setData({
        //     noData: true,
        //   })
        // } else {
        //   that.setData({
        //     noData: false,
        //   })
        // }
        wx.hideLoading();
      }
    })
  },
  onShow: function () {
    var skip = 0;
    that.setData({
      taskList: [],
      moreDataTip:false,
    })
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speedmoreDataTip
        var accuracy = res.accuracy;
        that.setData({
          latitude,
          longitude
        })
        that.getTaskData(skip);
      }
    })
    that.getSpecDelivery()
  },
  distance(originLat, originLng, receiveLat, receiveLng, taskList, index) {
    demo.calculateDistance({
      mode: 'driving',
      from: {
        latitude: originLat,
        longitude: originLng
      },
      to: [{
        latitude: receiveLat,
        longitude: receiveLng
      }],
      success: function (res) {
        let d = res.result.elements[0].distance;
        taskList[index].d = (d / 1000).toFixed(2);

      },
      fail: function (res) {
        let d = '超出配送范围'
        taskList[index].d = d;
      },
      complete() {
        taskList[index].distance_detail = (taskList[index].distance_detail / 1000).toFixed(2);
        that.setData({
          taskList
        })
      }
    });
  },

  bindscrolltolower(){
    that.setData({
      moreDataTip: true
    })
    var skip = this.data.skip;
    this.getTaskData(skip,2);
  },
  mapView(e) {
    let a = e.currentTarget.dataset.loglat;
    let b = a.split(',');
    let c = new Number(b[0])
    let d = new Number(b[1])
    wx.openLocation({
      latitude: c,
      longitude: d,
      scale: 28
    })
  },

})
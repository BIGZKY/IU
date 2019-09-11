// pages/freeOrderList/index.js
var api = require('../../api.js').api;
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');

// 实例化API核心类
var demo = new QQMapWX({
  key: 'B2VBZ-P3F3P-T5UDC-VT7AL-ENIGV-R6FT5' // 必填
});
var that = '';
Page({

  data: {
    navIndex:0,
    taskList:[]
  },

  onLoad: function (options) {
    that = this;

  },
  getTaskData(skip){
    wx.showLoading({
      title: '正在加载中',
    })
    wx.request({
      url: api.dispatch.getDispatchList,
      data:{
        user_id: wx.getStorageSync('user_id'),
        skip: skip
      },
      method:"POST",
      success(res){
        let taskList = [...that.data.taskList, ...res.data.data.date];
        taskList.forEach(function (item, index){
          let a = item.service_address_longlat.split(',');
          let distance = '';
          that.distance(that.data.latitude, that.data.longitude, a[0], a[1], taskList, index)
        })
        that.setData({
          skip: res.data.data.skip
        })
      },
      complete(){
        wx.hideLoading()
      }
    })
  },

  onShow: function () {
    var skip = 0;
    that.setData({
      taskList:[]
    })
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy;
        that.setData({
          latitude,
          longitude
        })
        that.getTaskData(skip);
      }
    })
    
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
      complete(){
        taskList[index].distance_detail = (taskList[index].distance_detail /1000).toFixed(2);
        taskList[index].add_time = taskList[index].add_time.slice(5,-3);
        that.setData({
          taskList
        })
      }
    });
  },
  onReachBottom: function () {
    var skip = this.data.skip;
    this.getTaskData(skip);

  },
  // robbing(e){
  //   var id = e.currentTarget.dataset.id;
  //   wx.navigateTo({
  //     url: '../robbing/index?id='+id+'',
  //   })
  // },
  mapView(e){
    let a = e.currentTarget.dataset.loglat;
    let b = a.split(',');
    let c = new Number(b[0])
    let d = new Number(b[1])
    wx.openLocation({
      latitude: c,
      longitude: d,
      scale: 28
    })
  }
})
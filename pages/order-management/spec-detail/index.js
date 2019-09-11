var api = require('../../../api.js').api;
const public_js = require('../../../utils/public.js').public_js;
var that = '';
Page({
  data: {
    taskList:[],
    noData:false,
    is_jishi:''
  },
  onLoad: function (options) {
    that = this;
    var region_id = options.id;
    that.setData({
      region_id,
    })
    var zs_type = options.zs_type;
    if (zs_type==1){
      that.setData({
        is_jishi: 1
      })
    }
  },
  getTaskData(region_id){
    wx.request({
      url: api.order.regions,
      data: {
        region_id,
        type_list:1,
        staff_id: wx.getStorageSync('staff_id'),
        is_jishi: that.data.is_jishi || ''
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
      }
    })
  },

  onShow: function () {
    var region_id = that.data.region_id;
    that.getTaskData(region_id);
  },
  robbing(e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    wx.request({
      url: api.dispatch.robbing,
      data: {
        user_id: wx.getStorageSync('user_id'),
        order_id: id,
        types:1
      },
      method: "POST",
      success(res) {
        console.log(res);
        if(res.data.status.error_code==404){
          wx.showToast({
            title: '抢单失败',
            icon:"none",
          })
          return false;
        }
        if (res.data.data) {

          wx.showToast({
            title: '' + res.data.data.message + '',
            icon: 'none'
          })
          that.data.taskList.splice(index, 1);
          that.setData({
            taskList: that.data.taskList
          })
          
          wx.request({
            url: api.dispatch.smscode,
            data: {
              order_id: res.data.data.order_id,
              types:1
            },
            method: "POST",
            success(res) {
              console.log(res)
              wx.showToast({
                title: '抢单成功',
              })
            }
          })
        }
      }
    })
  },
  
})
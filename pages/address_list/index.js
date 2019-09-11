//index.js
//获取应用实例
var api = require('../../api.js').api;
const app = getApp();
var token = '';
Page({
  data: {
    is_show: false,
    type:0
  },

  onLoad: function (options) {
    if(options.type){
        this.setData({
          type:2
        })
    }
  },
  onShow(){
    token = wx.getStorageSync('token');
    this.getData(token)

  },
  getData(token) {
    var that = this;
    wx.showLoading({
      title: '数据处理中',
    })
    wx.request({
      url: api.address.addr_list,
      data: {
        token: token,
        user_id: wx.getStorageSync('user_id')
      },
      method:"POST",
      success(res) {
        if (res.data.data && res.data.data.length>0) {
          that.setData({
            addr_list: res.data.data,
            is_show: false,
            no_data:false
          })
        }else{
          that.setData({
            addr_list:[],
            no_data: true,
            is_show: false,
          })
          if(that.data.type==2){
            wx.setStorageSync('address', '');
            // wx.setStorageSync('address_null', 'true');
          }
        }
        wx.hideLoading();
      }
    })
  },
  show_option(e){
    var id = e.currentTarget.dataset.id
    this.setData({
      is_show:true,
      id
    })
  },
  update(){
    var id = this.data.id
    this.setData({
      is_show: false,
    })
    wx.navigateTo({
      url: '../add_address/index?id='+id+''
    })
  },
  addr_delete() {
    var that = this;
    var id = this.data.id;
    wx.showModal({
      title: '提示',
      content: '确定删除吗',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: api.address.addr_delete,
            data: {
              "token": token,
              "address_id": id
            },
            method:"POST",
            success(res){
              if(res.data.status.succeed==1){
                that.getData(token);
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
   
  },
  bg_click() {
    this.setData({
      is_show: false
    })
  },
  select(e){
    if(this.data.type!=2){
      return false;
    }
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var addr_list = this.data.addr_list;
    var address = {
      address: addr_list[index].address ,
      address_info: addr_list[index].address_info,
      mobile: addr_list[index].mobile,
      consignee: addr_list[index].consignee,
      run_type: addr_list[index].run_type,
      id: id
    }
    wx.setStorageSync('address', address);

    wx.navigateBack({
      delta:1
    })
  }
})

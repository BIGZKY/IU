var that = '';
var app = getApp();
const public_js = require('../../utils/public.js').public_js;
var api = require('../../api.js').api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rootUrl: 'https://iu.yitiyan360.com/content/uploads/',
    tjShop:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.getTJShop();
  },
  //获取推荐店铺
  getTJShop() {
    wx.request({
      url: api.shop_street.getTJShop,
      success(res) {

        if (!JSON.parse(res.data.data).length) {
          that.setData({
            tjShop: [],
          })

          return false
        }
        let tjShop = JSON.parse(res.data.data);
        tjShop.forEach(function(el){
          if(el.hasyy)
            el.hasyy = true
          else
            el.hasyy = false
        }) 
        that.setData({
          tjShop: tjShop
        })
      }
    })
  },
  yy(e){
    var type = e.currentTarget.dataset.type;
    var selectId = e.currentTarget.dataset.id; 
    var index = e.currentTarget.dataset.index; 
    
    that.setData({
      selectId,
      index
    })
    if(type==1){
      that.setData({
        showModel: true
      })
      
    }else{

      wx.request({
        url: api.shop_street.yy,
        data: {
          type: 2,
          id:selectId
        },
        success(res) {
          if(res.data.data){
            that.data.tjShop[index].hasyy = false;
            wx.showToast({
              title: '取消预约成功',
            })
            that.setData({
              tjShop: that.data.tjShop
            })
          }
        }
      })
    }
  },
  formSubmit(e){
    var info = e.detail.value;
    var n =  !info.name ? '请输入姓名': !/^1\d{10}$/.test(e.detail.value.phone) ? '请输入联系方式' : !info.time ? '请输入预约时间' : false;
    console.log(info);
    if (n) {
      wx.showModal({
        title: '温馨提示',
        content: '' + n + '',
        showCancel: false
      })
      return false;
    }
    let data = Object.assign({type:1},info,{id:that.data.selectId})
    wx.request({
      url: api.shop_street.yy,
      data: data,
      success(res) {
        if(res.data.data == true){
          that.data.tjShop[that.data.index].hasyy = true;
          that.setData({
            showModel: false,
            tjShop: that.data.tjShop
          })
          wx.showToast({
            title: '预约成功',
          })
        }
        
      }
    })
  },
  cancle(){
    this.setData({
      showModel: false
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
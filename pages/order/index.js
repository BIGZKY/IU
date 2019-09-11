// pages/order/index.js
var api = require('../../api.js').api;
var token = '';
var that = '';
const app = getApp();
const public_js = require('../../utils/public.js').public_js;
var animation = wx.createAnimation({
  duration: 600,
  timingFunction: "ease",
  delay: 0
})
Page({
  data: {
    nav_list: [
      {
        src: '../../images/order_icon01.png',
        nav_name: '全部'
      },
      {
        src: '../../images/order_icon02.png',
        nav_name: '已完成'
      },
      {
        src: '../../images/order_icon04.png',
        nav_name: '待付款'
      },
      {
        src: '../../images/order_icon03.png',
        nav_name: '待收货'
      }
    ],
    page:1,
    order_list:[],
    nav_index:0,
    goods_index:'',
    index:0,
    run_type:1,
    animationList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
  },
  onShow(){
    token = wx.getStorageSync("token");
    var page = 1;
    this.setData({
      nav_index: 0,
      order_list:[],
      copyed_order_list:[],
      animationList:[],
    })
    this.getOrderList(page, 0, 2);
    
  },
  getOrderList(page,index,type){   
    wx.request({
      url: api.order.order_list,
      data:{
        token,
        "pagination": {
          "count": 10,
           page
        },
        user_id: wx.getStorageSync('user_id')
      },
      method:"POST",
      success(res){
        var order_list = [...that.data.order_list, ...res.data.data];
        order_list.forEach(function(item){
          item.is_more = false;
        })
        that.setData({
          order_list
        })
        var copyed_order_list = order_list;
        if(type==1){    
          that.filterData(index);
        }else{
          that.setData({
            copyed_order_list
          })
        }
        that.setData({
          page,
          index,
          order_list
        })
        if (res.data.data.length==0 && type ==1){
          wx.showToast({
            title: '没有更多数据',
            icon:"none"
          })
        }
      }
      
    })
  },
  switch_nav(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      nav_index: index,
      page: 1,
      index
    })
    that.filterData(index);
  },
  filterData(index){
    var copyed_order_list = this.data.order_list;

    var t = this.data.copyed_order_list;
    var animationList = this.data.animationList;
    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 300,
      timingFunction: "ease",
      delay: 0
    })
    t.forEach(function(item,index){
      var n = item.goods_list.length>=2? 2 : 1;
      animationList[item.order_id] = animation.height(n * 100).step().export();
    })
    
    that.setData({
      animationList
    })
    switch (index) {
      case 0:
        that.setData({
          copyed_order_list: copyed_order_list
        })
        break;
      case 1:
        var arr = copyed_order_list.filter(function (item) {
          return item.shipping_status == 2 && item.pay_status == 2 && item.order_status == 5;

        })
        that.setData({
          copyed_order_list: arr
        })
        break;
      case 2:
        var arr = copyed_order_list.filter(function (item) {
          return item.pay_status == 0 && item.order_status!= 2;
        })
        that.setData({
          copyed_order_list: arr,

        })
        break;
      case 3:
        var arr = copyed_order_list.filter(function (item) {
          return item.pay_status == 2 && item.shipping_status != 2 && item.order_status != 2 
        })
        that.setData({
          copyed_order_list: arr,

        })
        break;
    }
  },
  //上拉加载
  onReachBottom(){
    
    var page = this.data.page;
    page++;
    var index = this.data.index;
    
    var t = this.data.copyed_order_list;
    var animationList = this.data.animationList;
    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 300,
      timingFunction: "ease",
      delay: 0
    })
    t.forEach(function (item, index) {
      var n = item.goods_list.length >= 2 ? 2 : 1;
      animationList[item.order_id] = animation.height(n * 100).step().export();
    })

    that.setData({
      animationList
    })
    this.getOrderList(page,index,1);
  },

  //跳转到详情页
  show_detail(e){
    var order_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../order_detail/index?order_id=' + order_id+'',
    })
  },
 
  // 删除订单
  delete_order(e){
    var that = this;
    var order_id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var copyed_order_list = this.data.copyed_order_list;
    wx.showModal({
      title: '提示',
      content: '确认取消该订单吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: api.order.order_cancle,
            data: {
              token,
              order_id
            },
            method: "POST",
            success(res) {
              console.log(res)
              if (res.data.status.succeed==1){
                copyed_order_list[index].order_status=2;
                that.setData({
                  copyed_order_list
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //去支付
  go_pay(e){
    var n = public_js.check_shop_time();
    if (n) {
      return false;
    }
    var that = this;
    var order_id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    wx.showToast({
      title: '正在发起支付...',
      mask: true,
      icon: "loading"
    })
    wx.request({
      url: api.order.pay,
      data: {
        "order_id": order_id,
        'user_id': wx.getStorageSync('user_id')
      },
      method: "POST",
      success(res) {
        console.log(res)
        if(res.data.status.succeed==0){
          wx.showToast({
            title: res.data.status.error_desc,
            icon:"none"
          })
          return false;
        }
        var payment = res.data.data.payment;
        wx.requestPayment({
          'timeStamp': '' + payment.timeStamp + '',
          'nonceStr': '' + payment.nonceStr + '',
          'package': '' + payment.package + '',
          'signType': 'MD5',
          'paySign': '' + payment.paySign + '',
          'success': function (res) {
            wx.hideToast();
            wx.navigateTo({
              url: '../order_detail/index?order_id=' + order_id + '',
            })
          },
          'fail': function (res) {
            app.err_tip('支付失败');
          }
        })
      }
    })
  },

  look_more(e) {
    var index = e.currentTarget.dataset.index;
    var gnum = e.currentTarget.dataset.gnum;
    var am = e.currentTarget.dataset.am;
    var copyed_order_list = this.data.copyed_order_list;
    copyed_order_list[index].is_more = true;
    var animationList = this.data.animationList;
    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 300,
      timingFunction: "ease",
      delay: 0
    })
    animationList[am] = animation.height(gnum * 100).step().export();
    this.setData({  
      animationList,
      copyed_order_list
    })
  },
  shouqi(e){
    var index = e.currentTarget.dataset.index;
    var copyed_order_list = this.data.copyed_order_list;
    var gnum = e.currentTarget.dataset.gnum;
    var am = e.currentTarget.dataset.am;
    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 300,
      timingFunction: "ease",
      delay: 0
    })
    var animationList = this.data.animationList;
    animationList[am] = animation.height(200).step();
    copyed_order_list[index].is_more = false;
    this.setData({
      animationList,
      copyed_order_list
    })
  },
  shouhuo(e){
    wx.showModal({
      title: '温馨提示',
      content: '是否确认收货？',
      success: function (res) {
        if (res.confirm) {
          var order_id = e.currentTarget.dataset.id;
          var index = e.currentTarget.dataset.index;
          wx.request({
            url: api.order.affirmReceived,
            data: {
              token,
              order_id,
              user_id: wx.getStorageSync('user_id')
            },
            method: "POST",
            success(res) {
              if (res.data.status.succeed == 1) {
                wx.showToast({
                  title: '确认收获成功',
                  duration: 2000
                })
                var copyed_order_list = that.data.copyed_order_list;
                var order_list = that.data.order_list;
                
                var i = order_list.findIndex(function(item){
                  return item.order_id == order_id
                })
                copyed_order_list.splice(index, 1);
                order_list[i].shipping_status = 2;
                that.setData({
                  order_list,
                  copyed_order_list
                })

              }else{
                wx.showToast({
                  title: '操作失败',
                  icon: "none",
                  duration: 2000
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  }
})
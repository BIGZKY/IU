var that = '';
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var demo = new QQMapWX({
  key: 'B2VBZ-P3F3P-T5UDC-VT7AL-ENIGV-R6FT5' // 必填
});
const public_js = require('../../utils/public.js').public_js;
var api = require('../../api.js').api;
var animation = wx.createAnimation({
  duration: 300,
  timingFunction: 'ease',
})

var app = getApp();
Page({
  data: {

  },
  onLoad(){
    that = this;
    if (!wx.getStorageSync('user_id')){
      wx.navigateTo({
        url: '../load/load',
      })
      return false
    }
    this.checkUpdate();
    wx.setStorageSync('tan_num', 3);
    this.getMark();
    this.getCenter();
    this.getNewsData();
    this.per_center();

  },
  checkUpdate(){
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        console.log(res.hasUpdate)
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }

  },
  onReady(){
    this.mapCtx = wx.createMapContext('map');
    this.getCenterLocation();
  },
  onShow(){
    wx.showShareMenu({
      withShareTicket: true,
      isHide: false
    })

    public_js.gettime(that);
  },
  youhuiAm(){

  },
  // gettime(){
    
  // },
  getMark(){
    wx.request({
      url: api.main.getMark,
      data:{},
      method:"POST",
      success(res){
        console.log(res);
        var markers = [];
        var markList = res.data.data;
        for (let i = 0; i < markList.length;i++){
          var arr = markList[i].split(',');
          var obj = {};
          obj.iconPath = '/images/icon-addrMark.png';
          obj.id = i;
          obj.latitude = arr[1];
          obj.longitude = arr[0];
          obj.width = 25;
          obj.height = 25;
          markers.push(obj);
        }
        that.setData({
          markers
        })
      }
    })
  },
  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function (res) {
        that.parseAddress(res.latitude, res.longitude)
      }
    })
  },
  bindregionchange(){
    that.setData({
      addrInfo:''
    })
    this.getCenterLocation()
  },
  getCenter(){
    wx.getLocation({
      type: 'gcj02',
      altitude:true,
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        that.parseAddress(res.latitude, res.longitude);
      }
    })
  },

  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  parseAddress(latitude, longitude){
    demo.reverseGeocoder({
      location: {
        latitude,
        longitude
      },
      success: function (res) {
        that.setData({
          addrInfo: res.result.formatted_addresses.recommend
        })
      },
      fail: function (res) {
        console.log(res);
      },

      
      complete: function (res) {
        // console.log(res);
      }
    });
  },
  navSwitch(e){
    var index = e.currentTarget.dataset.index;
    if (index == 1 || index == 2 || index == 3){
      var n = public_js.check_shop_time();
      if(n){
        return false;
      }
    }
    switch(index){
      case 1:
        wx.navigateTo({
          url: '../shop_street/index',
        })
      break;
      case 2:
        wx.navigateTo({
          url: '../shop/shop',
        })
      break;
      case 3:
        wx.navigateTo({
          url: '../cgList/index',
        })
      break;
      case 4:
        // wx.showModal({
        //   title: '温馨提示',
        //   content: '该功能正在修缮为您带来的不便敬请谅解！',
        //   showCancel: false
        // })
        // return false;
        wx.navigateTo({
          url: '/pages/delivery/index', 
        })
        setTimeout(function () {
          that.closeSccond()
        }, 600)
      break;
      case 5:
        if (!this.data.showModel.model5){
         wx.showModal({
           title: '温馨提示',
           content: '该功能尚未开放为您带来的不便敬请谅解！',
           showCancel: false
         })
         return false;
       }
        // this.paotui();
        wx.navigateTo({
          url: '/pages/expressDelivery/index',
        })
        setTimeout(function () {
          that.closeSccond()
        }, 600)
        break;
    }
  },
  order(){
    wx.navigateTo({
      url: '../order/index',
    })
  },
  center(){
    wx.navigateTo({
      url: '../per_cen/per_cen',
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: 'IU科技',
      path: '/pages/index/index',
      success: function (res) {
        if (res.errMsg == 'shareAppMessage:ok') {
          var order_id = '';
          that.getdpj(2)
        }
      }
    }
  },
  getdpj(run_type){
    wx.request({
      url: api.order.getDpj,
      data: {
        user_id: wx.getStorageSync('user_id'),
        run_type,
      },
      method: "POST",
      success(res) {
        if (res.data.data){
          var voucher = res.data.data;
          that.setData({
            hasvoucher: true,
            voucher
          })
        } else {
          that.setData({
            hasvoucher: false,
          })
        }
      }
    })
  },
  closevoucher() {
    that.setData({
      hasvoucher: false
    })
  },
  yd(){
    this.mapCtx.moveToLocation()
  },
  youhui(){
    wx.navigateTo({
      url: '../activeList/index',
    })
  },

  // 打开二级导航
  openSecond(){
    animation.left(0).step();
    that.setData({
      animationData: animation.export()
    })
  },
  // 关闭二级导航
  closeSccond(){
    animation.left('100%').step();
    that.setData({
      animationData:animation.export()
    })
  },
  // 获取个人信息
  per_center() {
    wx.request({
      url: api.per_center.userInfoType,
      data: {
        user_id: wx.getStorageSync('user_id')
      },
      method: "POST",
      success(res) {
        var userInfo = res.data.data;
        that.setData({
          userInfo:res.data.data
        })
        wx.setStorageSync('staff_id', userInfo.staff_id)
        wx.setStorageSync('isvip', userInfo.isvip)
      }
    })
  },
  paotui() {
    if (this.data.userInfo.staff_id == 0) {
      if (this.data.userInfo.apply_for == 0) {
        wx.showModal({
          title: '温馨提示',
          content: '是否申请成为骑手',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../apply_for/index',  // 自由人员进入
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        if (this.data.userInfo.apply_for.apply_status == 0) {
          wx.showModal({
            title: '温馨提示',
            content: '您已提交审核，正在审核中',
            showCancel: false,
            apply_status: true
          })
        } else {
          wx.navigateTo({
            url: '../mine/mine',  // 自由人员进入
          })
        }
      }

    } else {
      wx.navigateTo({
        url: '../mine/mine?staff_id=' + this.data.userInfo.staff_id + '', //专职人员  id
      })
    }
  },

  getNewsData(){
    public_js.getNewsData(that, 1)
  },
  link(e) {
    public_js.link(e, that);
  },
  viewJl(){
    wx.navigateTo({
      url: '../per_cen/dpj/index',
    })
  }
}) 

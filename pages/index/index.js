var that = '';
var app = getApp();
var public_js = require('../../utils/public.js').public_js;
var api = require('../../api.js').api;
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var demo = new QQMapWX({
  key: 'B2VBZ-P3F3P-T5UDC-VT7AL-ENIGV-R6FT5' // 必填
});
var animation = wx.createAnimation({
  duration: 300,
  timingFunction: 'ease',
  initAn: null
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rootUrl: 'https://iu.yitiyan360.com/content/uploads/',
    typeList: [],
    isFlod: true,
    v_nav: null,
    init: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;

    public_js.gettime(that);
    this.checkUpdate();
    if (wx.getStorageSync('user_id')){
      this.per_center();
    }else{
      wx.showModal({
        title: '温馨提示',
        content: '未登录将影响您的使用, 是否去登录',
        confirmText: '登录',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/per_cen/per_cen',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
  
    }
  },
  onShow: function () {
    this.getNewsData();
    this.getBanner();
    this.getTypeList();
    this.getTJShop();
    if (app.globalData.windowHeight < 603) {
      that.setData({
        largeScreen: false
      })
    } else {
      that.setData({
        largeScreen: true
      })
    }
  },
  previewImage(e) {
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
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
        that.setData({
          tjShop: JSON.parse(res.data.data),
        })
      }
    })
  },
  checkUpdate() {
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
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
  
  getTypeList() {
    wx.request({
      url: api.shop_street.shopList,
      data: {
        user_id: wx.getStorageSync('user_id')
      },
      success(res) {
        if (res.data.status.succeed == 1 && res.data.data.datas) {
          that.setData({
            typeList: res.data.data.datas,
            s_typeList: res.data.data.datas.slice(0, 9)
          })
        }
      }
    })
  },
  getBanner() {
    wx.request({
      url: api.article.news,
      data: {
        type: 4
      },
      method: "POST",
      success(res) {
        var baList = JSON.parse(res.data.data);
        that.setData({
          baList
        })
      },
    })
  },
  navSwitch(e) {
    var index = e.currentTarget.dataset.index;
    if (index == 1 || index == 2 || index == 3) {
      var n = public_js.check_shop_time();
      if (n) {
        return false;
      }
    }
    switch (index) {
      case 5:
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
        break;
      case 4:
        wx.navigateTo({
          url: '/pages/yptj/index',
        })
        break;
      case 3:
        wx.navigateTo({
          url: '../cgList/index',
        })
        break;
      case 2:
        wx.navigateTo({
          url: '../shop/shop',
        })
        break;
      case 1:
        wx.navigateTo({
          url: '/pages/delivery/index',
        })
        break;

    }
  },
  order() {
    wx.navigateTo({
      url: '../order/index',
    })
  },
  center() {
    wx.navigateTo({
      url: '../per_cen/per_cen',
    })
  },
  // 分享获得短跑卷
  onShareAppMessage: function (res) {
    return {
      title: 'IU科技',
      path: '/pages/load/load',
      success: function (res) {
        if (res.errMsg == 'shareAppMessage:ok') {
          var order_id = '';
          that.getdpj(2)
        }
      }
    }
  },
  // 定义获取短跑卷函数
  getdpj(run_type) {
    wx.request({
      url: api.order.getDpj,
      data: {
        user_id: wx.getStorageSync('user_id'),
        run_type,
      },
      method: "POST",
      success(res) {
        if (res.data.data) {
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
  // 关闭短跑卷
  closevoucher() {
    that.setData({
      hasvoucher: false
    })
  },
  youhui() {
    wx.navigateTo({
      url: '../activeList/index',
    })
  },

  // 打开二级导航
  openSecond() {
    var n = public_js.check_shop_time();
    if (n) {
      return false;
    }
    animation.left(0).step();
    that.setData({
      animationData: animation.export()
    })
  },
  // 关闭二级导航
  closeSccond() {
    animation.left('100%').step();
    that.setData({
      animationData: animation.export()
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
          userInfo: res.data.data
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

  getNewsData() {
    public_js.getNewsData(that, 1)
  },
  link(e) {
    public_js.link(e, that);
  },
  viewJl() {
    wx.navigateTo({
      url: '../per_cen/dpj/index',
    })
  },
  enterShop(e) {
    var shop_id = e.currentTarget.dataset.id;
    var shopName = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/cgList/index?shop_id=' + shop_id + '&shopName=' + shopName,
    })
  },
  moreShop(e) {
    var type = e.currentTarget.dataset.type;
    var nav_animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })

    if (type == 1) {
      nav_animation.translateY('-107px').step();
      this.setData({
        s_typeList: this.data.typeList,
        isFlod: false,
        nav_animation: nav_animation.export()
      })
    } else {
      nav_animation.translateY('-0').step();
      this.setData({
        s_typeList: this.data.typeList.slice(0, 9),
        isFlod: true,
        nav_animation: nav_animation.export()
      })
    }

  },
  onReady() {
    this.mapCtx = wx.createMapContext('map');
    this.getCenter();
    this.getMark();
  },
  getMark() {
    wx.request({
      url: api.main.getMark,
      data: {},
      method: "POST",
      success(res) {
        var markers = [];
        var markList = res.data.data;
        for (let i = 0; i < markList.length; i++) {
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
  getCenter() {
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
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
  parseAddress(latitude, longitude) {
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
  bindregionchange() {
    that.setData({
      addrInfo: ''
    })
    this.getCenterLocation()
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
})
// pages/cgList/index.js
var that = this;
var api = require('../../api.js').api;
var app = getApp();
var height1 = 0;
var height2 = 0;
let touchDotX = 0;//X按下时坐标
let touchDotY = 0;//y按下时坐标
let interval;//计时器
let time = 0;//从按下到松开共多少时间*100;
var animation1 = wx.createAnimation({
  duration: 300,
  timingFunction: 'ease',
})
var animation2 = wx.createAnimation({
  duration: 300,
  timingFunction: 'ease',
})
var animation3 = wx.createAnimation({
  duration: 300,
  timingFunction: 'ease',
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rootUrl: 'https://iu.yitiyan360.com/content/uploads/',
    typeList: [],
    typeIndex: 0,
    shop_id: '',
    showList: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);

    that = this;
    var windowHeight = app.globalData.windowHeight;
    if (options.shop_id) {
      if (options.shopName) {
        wx.setNavigationBarTitle({
          title: options.shopName,
        })
      } else {
        wx.setNavigationBarTitle({
          title: '店铺详情',
        })
      }
      that.setData({
        shop_id: options.shop_id
      })
      if (options.type == 2) {
        that.setData({
          type: options.type || 0
        })
        this.getGoodsList(0, options.type)
      } else {
        this.getGoodsList()
      }

    } else {
      wx.setNavigationBarTitle({
        title: '校内餐厅',
      })
      this.getTypeList();
    }
    that.data.shop_id ? height1 = windowHeight - 120 - 50 : height2 = windowHeight - 120 - 50 - 96;
    that.setData({
      height1: height1 || 0,
      height2: height2 || 0
    })
  },
  getTypeList() {
    wx.request({
      url: api.shop_street.getTypeList,
      data: {

      },
      success(res) {
        console.log(res)
        if (!res.data.data.length) {
          that.setData({
            typeList: [],
            goodsArr: []
          })

          return false
        }
        that.setData({
          typeList: res.data.data
        })
        var cate_id = res.data.data[0].id;
        that.getGoodsList(cate_id);
      }
    })
  },
  getGoodsList(cate_id, type) {

    wx.request({
      url: api.shop_street.foodsList,
      data: {
        user_id: wx.getStorageSync('user_id'),
        shop_id: that.data.shop_id || 0,
        type: type || 0,
        cate_id: cate_id || 0
      },
      success(res) {
        if (res.data.status.succeed == 1) {
          var goodsArr = res.data.data;
          goodsArr.forEach(function (item) {
            item.num = 0;
            item.mark = [];
            item.s_index = null;
            for (let i = 0; i < item.marks.length; i++) {
              // console.log(item.marks[i])
              if (item.marks[i]!==""){
                var obj = {};
                obj.tagName = item.marks[i];

                item.mark.push(obj);
              }
              
            }

          })
          that.setData({
            goodsArr
          })
          setTimeout(() => {
            that.setData({
              showList: true
            });
            console.log(that.data.showList)
          }, 400);
        } else {
          wx.showToast({
            title: '数据请求错误',
            icon: "none"
          })
        }

      }
    })
  },

  jia(e) {
    if (!app.globalData.userInfo_bool) {
      wx.showModal({
        title: '温馨提示',
        content: '请先登录',
        confirmText: '登录',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/index',
            })
          }
        }
      })
      return false;
    }
    var index = e.currentTarget.dataset.index;
    var num = this.data.goodsArr[index].num || 0;
    num++;
    this.data.goodsArr[index].num = num;
    this.setData({
      goodsArr: this.data.goodsArr,
    })
  },
  jian(e) {
    var index = e.currentTarget.dataset.index;
    var num = this.data.goodsArr[index].num;
    num--;
    this.data.goodsArr[index].num = num;

    this.setData({
      goodsArr: this.data.goodsArr,
    })

  },
  sbt() {
    var selctedGoods = this.data.goodsArr.filter(function (item) {
      return item.num > 0;
    })
    if (selctedGoods.length) {

      wx.setStorageSync('selctedGoods', selctedGoods);
      if (that.data.type) {
        wx.navigateTo({
          url: '../payable/index?shop_id=' + that.data.shop_id + '&type=2',
        })
      } else {
        wx.navigateTo({
          url: '../payable/index?shop_id=' + that.data.shop_id + '',
        })
      }
    } else {
      wx.showToast({
        title: '请先选择商品',
        icon: "none",
        duration: 1500
      })
      return false;
    }
  },
  previewImage(e) {
    var url = e.currentTarget.dataset.url;
    var urls = [];
    urls.push(url)
    wx.previewImage({
      urls: urls,
      current: url,
      success: function (res) {

      }
    })
  },
  onShow: function () {
    if (wx.getStorageSync('selctedGoods')) {

    }
  },
  itemClick(e) {
    var index = e.currentTarget.dataset.index;
    var c_index = e.currentTarget.dataset.c_index;
    var t = e.currentTarget.dataset.t;
    var goodsArr = this.data.goodsArr;

    goodsArr[index].s_index = c_index
    goodsArr[index].t = t
    this.setData({
      goodsArr,

    })
  },
  chooseType(e) {
    var shop_id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    that.setData({
      typeIndex: index,
      showList: false
    })
    that.getGoodsList(shop_id);
  },
  //监听手势滑动


  // 触摸开始事件
  touchStart: function (e) {
    touchDotX = e.touches[0].pageX; // 获取触摸时的原点
    touchDotY = e.touches[0].pageY;
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸结束事件
  touchEnd: function (e) {
    let touchMoveX = e.changedTouches[0].pageX;
    let touchMoveY = e.changedTouches[0].pageY;
    let tmX = touchMoveX - touchDotX;
    let tmY = touchMoveY - touchDotY;
    if (time < 20) {
      let absX = Math.abs(tmX);
      let absY = Math.abs(tmY);
      if (absX > 2 * absY) {
        if (tmX < 0) {
          console.log("左滑=====")
        } else {
          console.log("右滑=====")
        }
      }
      if (absY > absX * 2 && tmY < 0) {
        console.log("上滑动=====")
        this.bannerAm = animation1;
        this.navAm = animation2;
        this.contentAm = animation3;
        this.bannerAm.opacity(0).step();
        this.navAm.translateY(-120).step();
        this.contentAm.height(this.data.height2 + 120).translateY(-120).step();
        that.setData({
          bannerAm: this.bannerAm.export(),
          navAm: this.navAm.export(),
          contentAm: this.contentAm.export(),
        })
      }
      if (absY > absX * 2 && tmY > 0) {
        console.log("下滑动=====")
        this.bannerAm = animation1;
        this.navAm = animation2;
        this.contentAm = animation3;
        this.bannerAm.opacity(1).step();
        this.navAm.translateY(0).step();
        this.contentAm.height(this.data.height2).translateY(0).step();
        that.setData({
          bannerAm: this.bannerAm.export(),
          navAm: this.navAm.export(),
          contentAm: this.contentAm.export(),
        })
      }
    }
    clearInterval(interval); // 清除setInterval
    time = 0;
  },
  onShareAppMessage(res) {
    return {
      title: '店铺详情',
      path: 'pages/cgList/index?type=' + that.data.type + '&shop_id=' + that.data.shop_id
    }
  }
})
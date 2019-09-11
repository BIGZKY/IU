// pages/shop_street/index.js
var api = require('../../api.js').api;
var that = '';
const public_js = require('../../utils/public.js').public_js;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rootUrl:'https://iu.yitiyan360.com/content/uploads/'
  },
  onLoad: function (options) {
    that = this;
    // if (!app.globalData.userInfo_bool) {
    //   wx.navigateTo({
    //     url: '../logins/index',
    //   })
    //   return false
    // }
    that.setData({
      windowHeight: app.globalData.windowHeight
    })
    this.getData();
    this.getBanner();
  },
  onShow(){
    that.setData({
      isHide: false
    })
    // this.aa();
  },
  getData(){
    wx.showLoading({
      title: '数据加载中',
    })
    wx.request({
      url: api.shop_street.shopList,
      data:{
        user_id: wx.getStorageSync('user_id')
      },
      success(res){
        console.log(res)
        if (res.data.status.succeed == 1 && res.data.data.datas){
          var shopList = res.data.data.datas;
          console.log(shopList)
          shopList.forEach(function(item,index){
              item.tag = item.tag.split('，');
              if (item.tag.length>4){
                var len = item.tag.length-2;
                item.tag.splice(3, len);
                console.log(item.tag)
              }
          })
          that.setData({
            shopList
          })
          if (res.data.data.is_new ){
            var voucher = {
              name: res.data.data.marks.name,
              useendtime: res.data.data.marks.useendtime,
              run_type: 2,
              is_type: 1
            }
            that.setData({
              hasvoucher: true,
              voucher
            })
          }
          
        }
        wx.hideLoading();
      }
    })
  },

  getBanner() {
    public_js.getBanner(that,1);
  },
  link(e) {
    public_js.link(e, that);
  },
  closevoucher() {
    public_js.colose_lj(that,);

  },
  t(e){
    var id = e.currentTarget.dataset.id;
    var maxNumber = e.currentTarget.dataset.maxnumber;
    var ismai = e.currentTarget.dataset.ismai;
    if (ismai <= maxNumber){
      wx.navigateTo({
        url: '/pages/cgList/index?shop_id=' + id + '',
      })
    }else{
     wx.showToast({
       title: '已售完',
       icon:"none"
     }) 
    }
    
  },
  // 预览显示图片
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
})
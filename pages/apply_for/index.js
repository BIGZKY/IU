// pages/shop_street/index.js
const app = getApp()
var that = '';
var api = require('../../api.js').api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls:[
      {
        src:'../../images/banner.png'
      },
      {
        src: '../../images/banner01.png'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
  },
  uploadPic(e){
    var index = e.currentTarget.dataset.index;
    console.log(index)
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: api.per_center.upLoadPic, //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'ad_code',
          formData: {
            'user_id': wx.getStorageSync('user_id')
          },
          success: function (res) {
            var data = JSON.parse(res.data).data;
            switch(index){
              case 1:
                that.setData({
                  img_01: data
                })
                break;
              case 2:
                that.setData({
                  img_02: data
                })
                break;
              case 3:
                that.setData({
                  img_03: data
                })
                break;
            }
            console.log(data)
            //do something
          }
        })
      }
    })

  },
  formSubmit(e){
    that.setData({
      name: e.detail.value.name,
      phone: e.detail.value.phone,

    })
    let data = that.data ;
    let n = !data.name ? "请输入姓名" : !/^1\d{10}$/.test(data.phone) ? "请输入正确格式电话" : !data.img_01 ? "请上传身份证正面照" : !data.img_02 ? "请上传身份证反面照" : !data.img_03 ? "请上传学生证有效页" : false;
    if(n){
      wx.showModal({
        title: '温馨提示',
        content: ''+n+'',
        showCancel:false
      })
      return false;
    }
    wx.request({
      url: api.per_center.apply,
      data:{
        apply_name:data.name,
        apply_phone:data.phone,
        apply_ID_card_z:data.img_01,
        apply_ID_card_f:data.img_02,
        apply_student_card:data.img_03,
        user_id: wx.getStorageSync("user_id")
      },
      method:"POST",
      success(res){
        if(res.data.data){
          wx.showToast({
            title: '已提交申请',
          })
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },1200)
          
        }
      }
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
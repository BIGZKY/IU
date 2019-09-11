// pages/myRobbing/index.js
var api = require('../../api.js').api;
var that = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navType:1,
    order_list:[],
    moreDataTip:false,
    nav:1,
    skip:0
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      navType: 1
    })
    wx.removeStorage({
      key: 'status',
      success: function (res) { },
    })
    if(options.types){
      that.setData({
        types:'is_my'
      })
      wx.setNavigationBarTitle({
        title: '我的派单',
      })

    }else{
      that.setData({
        types: 'myrobbing'
      })
      wx.setNavigationBarTitle({
        title: '我的接单',
      })
      
    }
    
    var skip = that.data.skip;
    var status = 1;
    this.getData(skip, status,1);
  },
  getData(skip, status,type){
    wx.showLoading({
      title: '正在加载数据',
    })
    wx.request({
      url: api.dispatch.getDispatchList,
      data:{
        status: status,
        skip:skip,
        user_id: wx.getStorageSync('user_id'),
        types: that.data.types || 'is_gg'
      },
      method:"POST",
      success(res){
        if (res.data.data.date.length==0){
          var order_list = that.data.order_list 
        }else{
          var order_list = [...that.data.order_list, ...res.data.data.date];
        }
        that.setData({
          skip: res.data.data.skip,
          order_list
        })
        // if (res.data.data.date.length==5){
          
        // } else if(res.data.data.date.length <= 5){
        //   that.setData({
        //     skip: that.data.skip,
        //     order_list
        //   })
        // }
        
   
        if (type == 2 && res.data.data.date.length==0){
          that.setData({
            hasMoreData:false
          })
        }else if(type == 2 && res.data.data.date.length > 0) {
          that.setData({
            hasMoreData: true
          })
        }
        if (that.data.order_list.length==0){
          that.setData({
            noData:true,
          })
        }else{
          that.setData({
            noData: false,
          })
        }
        wx.hideLoading();
      }
      
    })
  },

  onShow: function () {
    
    if (wx.getStorageSync('status')){

      var status = parseInt(wx.getStorageSync('status'));
      wx.removeStorage({
        key: 'status',
        success: function (res) { },
      })
      var skip = that.data.skip;
      this.getData(skip, status, 1);
    }
    that.setData({
      nav:1
    })
  },
  switchNav(e) {
    let a = e.currentTarget.dataset.index;
    this.setData({
      navType: a,
      order_list:[],
      moreDataTip:false
    })
    let skip = 0;
    this.getData(skip, a)
  },
  switch(e){
    let index = e.currentTarget.dataset.index;
    var staff_id = wx.getStorageSync('staff_id');
    // if (staff_id != 0){
    //   wx.setStorageSync('zs_type', 0);  //专职人员  
    // }else{
    //   wx.setStorageSync('zs_type', 2);  //兼职人员
    // }
    
    if(index==5){
      wx.navigateTo({
        url: './zs-type/index',
      })
    }
    this.setData({
      nav:index
    })
  },
  bindscrolltolower: function () {
    let skip = this.data.skip;
    let a = this.data.navType;
    if (that.data.order_list.length){
      that.setData({
        moreDataTip: true
      })
    }
    
    this.getData(skip,a,2);

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
// pages/note/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    note:'',
    text_list:[
      {
        text:'多带一份米饭'
      },
      {
        text: '多放辣椒'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var text_list = this.data.text_list;
    text_list.forEach(function (item) {
      item.selected = false
    })
    if (wx.getStorageSync('note')){
      var note = wx.getStorageSync('note');
      this.setData({
        note,
        text_num:note.length
      })
    }
    
    this.setData({
      text_list
    })
    

  },
  bindinput(e){
    if (e.detail.value.length>=50){
      wx.showToast({
        title: '最多50字哦',
        icon: "none",
        duration: 1500
      })
      this.setData({
        text_num: 50
      })
    }else{
      this.setData({
        note: e.detail.value,
        text_num: e.detail.value.length
      })
      
    }
  },
  select_text(e){
    var index = e.currentTarget.dataset.index;
    var text_list = this.data.text_list;
    var obj = text_list[index];
    var tip_num = obj.text.length;
    var note_num = this.data.note.length + tip_num;
    if (note_num>50){
      wx.showToast({
        title: '超出字数限制',
        icon:'none',
        duration:1500
      })
    }else{
      this.setData({
        note: this.data.note + obj.text,
        text_num: note_num
      })
    }
    text_list[index].selected = true;
    this.setData({
      text_list
    })
  },
  save(){
    wx.setStorageSync('note', this.data.note);
    wx.navigateBack({
      delta:1
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
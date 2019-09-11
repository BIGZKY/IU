// pages/arond/fragment/find.js
var api = require('../../api.js').api;
var that = '';
const public_js = require('../../utils/public.js').public_js;
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    money : '',
    need_money:'',

  },
  onLoad: function (options) {
    that = this;
    this.getProfit()
  },
  money(e){
    var money = this.clearNoNum(e.detail.value);
    this.setData({
      money
    })
  },

  kahao(e) {
    var kahao = e.detail.value;
    this.setData({
      kahao
    })
  },
  getProfit() {
    wx.request({
      url: api.per_center.getProfit,
      data: {
        user_id: wx.getStorageSync('user_id')
      },
      method: "POST",
      success(res) {
        var userInfo = res.data.data;
        that.setData({
          userInfo
        })
      }
    })
  },
  payment(){
    var data = this.data;
    var n = !data.money ? "请输入提现金额" : !data.kahao ? "请输入支付宝账号":false;
    if(n){
      wx.showToast({
        title: n,
        icon:"none"
      })
      return false;
    }
    wx.request({
      url: api.per_center.tixian,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        amount: data.money,
        kahao: data.kahao,
      },
      method:"POST",
      success: function (res) {
        console.log(res)
        wx.showToast({
          title: res.data.data,
          icon:"none"
        })
      }
    })
  },
  all_pay(){
    var all_money = this.data.userInfo.user_money;
    this.setData({
      money: all_money
    })
  },
  clearNoNum(value) {
    //修复第一个字符是小数点 的情况.  
    if (value != '' && value.substr(0, 1) == '.') {
      value = "";
    }

    value = value.replace(/^0*(0\.|[1-9])/, '$1');//解决 粘贴不生效  
    value = value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符  
    value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的       
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数       
    if (value.indexOf(".") < 0 && value != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
      if (value.substr(0, 1) == '0' && value.length == 2) {
        value = value.substr(1, value.length);
        
        return value;
      }
    }
    return value;
  }  
})
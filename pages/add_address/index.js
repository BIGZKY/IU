var api = require('../../api.js').api;
const app = getApp();
var token = '';
Page({
  data: {
    multiArray: [],
    multiIndex: [0,0,0],
    region_name: 'region_name',
    default_address:1,
    type:0
  },
  // 选择三级联动
  changeMultiPicker(e) {
    var multiIndex = e.detail.value;
    var villageData = this.data.villageData;
    var p_region_id = villageData[multiIndex[0]].parent[multiIndex[1]].region_id;
    var s_region_id = villageData[multiIndex[0]].parent[multiIndex[1]].son[multiIndex[2]].region_id;
    var address = this.data.multiArray[1][multiIndex[1]] + this.data.multiArray[2][multiIndex[2]];
    
    if (/\d{1}-\d{1}/.test(address)) {
      wx.showModal({
        title: '温馨提示',
        content: '为避免地址错误，请尽可能补充完整地址信息!',
        showCancel: false
      })
    }
    this.setData({ 
      multiIndex: e.detail.value,
      p_region_id,
      s_region_id,
      address
    })

  },
  onLoad(options){
    token = wx.getStorageSync('token');
    if (options.id){
      this.getAddrInfo(options.id);
      this.setData({
        type:1,
        id: options.id
      })
    }
    this.getVillageData();
  },
  getAddrInfo(id){
    var that = this;
    wx.request({
      url: api.address.addr_info,
      data:{
        user_id: wx.getStorageSync('user_id'),
        token,
        "address_id":id
      },
      method:"POST",
      success(res){
        var address = res.data.data.address;
        var multiArray = 
        that.setData({
          consignee: res.data.data.consignee,
          mobile: res.data.data.mobile,
          address_info: res.data.data.address_info,
          address: res.data.data.address,
          default_address: res.data.data.default_address,
          s_region_id: res.data.data.merchent_flow,
          p_region_id: res.data.data.merchent_xiaoqu,

        })
      }
    })
  },
  getVillageData(){
    var that = this;
    wx.request({
      url: api.address.addr_village,
      data:{
        user_id: wx.getStorageSync('user_id')
      },
      method:"POST",
      success(res){
       
        var villageData = res.data.data;
        var multiArray =[];
        multiArray[0] = [];
        multiArray[1] = [];
        multiArray[2] = [];
        villageData.forEach(function(element){
          multiArray[0].push(element.shipping_area_name);         
        })
        console.log(villageData)
        var son = villageData[0].parent;
        son.forEach(function (element) {
          if (element.son.length){
            multiArray[1].push(element.region_name);            
          }
        })
        var son_arr = villageData[0].parent[0].son;
        son_arr.forEach(function (element) {
          multiArray[2].push(element.region_name);
        })
        that.setData({
          multiArray: multiArray,
          villageData
        })
      }
    })
  },
  input_consignee(e){
    var consignee = e.detail.value;
    this.setData({
      consignee
    })
  },
  input_mobile(e){
    var mobile = e.detail.value; 
    this.setData({
      mobile
    })
  },
  input_address_info(e){
    var address_info = e.detail.value; 
    this.setData({
      address_info
    })
  },
  switchChange(e){
    var default_address = e.detail.value;
    if (default_address){
      this.setData({
        default_address:1
      })
    }else{
      this.setData({
        default_address:0
      })
    }
    wx.request({
      url: api.address.setDefault,
      data:{
        token,
        "address_id": this.data.id
      },
      method:"POST",
      success(res){
      }
    })
  },
  add_addr() {
    var that = this;
    var consignee = this.data.consignee;
    var mobile = this.data.mobile;
    var address_info = this.data.address_info;
    var check = this.data.default_address;
    var multiArray = this.data.multiArray;
    var multiIndex = this.data.multiIndex;
    var default_address = this.data.default_address;
    var address = ''+multiArray[1][multiIndex[1]]+multiArray[2][multiIndex[2]]+'';
    if (!consignee || !mobile || !address_info || !address){
      wx.showToast({
        title: '请补充完善地址信息',
        icon:"none",
        duration:1500
      })
      return false;
    }
    var check_mobile = /^1\d{10}$/;
    if (!check_mobile.test(mobile)) {
      wx.showModal({
        title: '提示',
        content: '手机号格式不正确',
        icon:"none"
      });
      return false;
    }
    if (this.data.type==0){   //新加
      var data = {
        token,
        "address": {
          "consignee": consignee,
          "mobile": mobile,
          "address": address,
          "address_info": address_info,
          merchent_flow: that.data.s_region_id,
          merchent_xiaoqu: that.data.p_region_id,
          default_address,
          
        },
        user_id: wx.getStorageSync('user_id'),
      }
      var url = api.address.add_address;
    } else if (this.data.type == 1) {    //更新
      address = this.data.address;
      var data = {
        token,
        "address": {
          "consignee": consignee,
          "mobile": mobile,
          "address": address,
          "address_info": address_info,
          merchent_flow: that.data.s_region_id,
          merchent_xiaoqu: that.data.p_region_id,
          default_address,
          
        },
        address_id: that.data.id,
        user_id: wx.getStorageSync('user_id')
      }
      var url = api.address.addr_update;
    }
    wx.request({
      url: url,
      data: data,
      method: "POST",
      success(res) {
        if (res.data.status.succeed==1){
          wx.showToast({
            title: '保存成功',
            complete(){
              wx.navigateBack({
                delta: 1
              })
            }
          }) 
        }
      }
    })
  },
  bindcolumnchange(e){  
    if (e.detail.column == 0){
      var multiIndex = this.data.multiIndex;
      var index = e.detail.value;
      var villageData = this.data.villageData;
      var multiArray = this.data.multiArray;
      multiArray[1] = [];
      multiArray[2] = [];
      var son = villageData[index].parent;
      var son_son = villageData[index].parent[0].son;

      son.forEach(function (element) {
        multiArray[1].push(element.region_name);
      })
      son_son.forEach(function (element){
        multiArray[2].push(element.region_name);
      })
      this.setData({
        multiArray: multiArray,
        multiIndex: [e.detail.value,0,0]
      })
    }
    if (e.detail.column==1){
      var multiIndex = this.data.multiIndex;
      var index = e.detail.value;
      var villageData = this.data.villageData;
      var multiArray = this.data.multiArray;
      var son_arr = villageData[multiIndex[0]].parent[index].son;

      multiArray[2] = [];

      son_arr.forEach(function (element) {
        multiArray[2].push(element.region_name);
      })
      multiIndex[1] = e.detail.value
      multiIndex[2] = 0
      this.setData({
        multiArray: multiArray,
        multiIndex
      })
    }
    if (e.detail.column == 2){
      var multiIndex = this.data.multiIndex;
      var index = e.detail.value;
      multiIndex[2] = index;
      this.setData({
        multiIndex
      })
    }
  }
})
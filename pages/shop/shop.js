// pages/shop/shop.js
var api = require('../../api.js').api;
var order = ['red', 'yellow', 'blue', 'green', 'red'];
var app = getApp();
var user_id='';
// var is_show = false;
var animation = wx.createAnimation({
  duration: 300,
  timingFunction: "ease",
  delay: 0
})
const public_js = require('../../utils/public.js').public_js;
var token='';
var that ='' ;
Page({
  data: {
    toView: 'red',
    scrollTop: 100,
    second_menu:'',
    nav_index:-1,
    num:0,
    total:0,
    title:'',
    second_nav:0,
    car_goods_list:[],
    slected_all:true,
    car_goods_num:0,
    is_show: false,
    rootUrl:'https://iu.yitiyan360.com/content/uploads/',
    animationList:[]
  },
  onLoad: function () {
    that = this;
    that.setData({
      windowHeight:app.globalData.windowHeight

    })
    user_id = wx.getStorageSync('user_id');
    token = wx.getStorageSync("token");
    this.getData();
    this.getNewsData(); 
    this.getBanner();

  },
  onShow(){
    that.setData({
      isHide:false
    })
  },
  //获取商品列表,
  getData(){
    wx.showLoading({
      title: '数据处理中',
    })
    var that = this;
    wx.request({
      url: api.supermarket.category,
      success(res){
        wx.hideLoading();
        if (!res.data.data.category){
          return false
        }
        var first_menu = res.data.data.category;
        var typegoods = res.data.data.typegoods;
        var specal_menu = [];
        var i = 0;
        for (var value in typegoods){
          i--;
          var obj = {};
          obj[typegoods[value][1]] = typegoods[value][0]
          obj.cat_name = typegoods[value][0];
          obj.index = i;
          obj.id = typegoods[value][1];
          specal_menu.push(obj);
        }
        console.log(first_menu)
        
        first_menu.forEach(function(item){
          item.isClick = false
        })
        that.setData({
          specal_menu: specal_menu,
          first_menu: first_menu,
          second_menu: first_menu[0].children,
          title: specal_menu[0].cat_name,
        })
        wx.request({
          url: api.supermarket.goosList,
          data: {
            storeintro_type: 'is_hot',
            user_id: wx.getStorageSync('user_id')
          },

          success(res) {
            if (res.data.data.is_new){
              var voucher = {
                name: res.data.data.marks.name,
                useendtime: res.data.data.marks.useendtime,
                run_type: 3,
                is_type: 1
              }
              that.setData({
                hasvoucher:true,
                voucher
              })
            }
            res.data.data.goods.forEach(function (item) {
              if (item.market_price == 0) {
                item.discount = 1;
              } else {
                item.discount = (item.shop_price / item.market_price).toFixed(2);
              }
            })
            that.setData({
              goods_menu: res.data.data.goods
            })
            that.getCarGoodsList()
          }
        })
      }
    })
  },

  //一级切换
  switch_nav(e){
    var nav_index = e.currentTarget.dataset.index;
    var animationList = this.data.animationList;
    var a = wx.createAnimation({
      duration: 300,
      timingFunction: "ease",
      delay: 0
    })
    for (var i = 0; i < animationList.length; i++) {
      animationList[i] = a.height(0).step().export();
    }
    this.data.first_menu.forEach(function (item, index) {
      if (index != nav_index) {
        item.isClick = false;
      }
    })
    that.setData({
      animationList,
    })
    if (nav_index >= 0) {
      if (!this.data.first_menu[nav_index].isClick) {
        var n = this.data.first_menu[nav_index].children.length * 39
        animationList[nav_index] = a.height(n).step().export();
      } else {
        animationList[nav_index] = a.height(0).step().export();
      }
      this.data.first_menu[nav_index].isClick = !this.data.first_menu[nav_index].isClick;
      this.setData({
        first_menu: this.data.first_menu,
        animationList,
      })
    }
    var id = e.currentTarget.dataset.type;
    var ids = e.target.dataset.types;
    if (nav_index == that.data.nav_index){
      return false;
    }
    this.setData({
      nav_index: nav_index,
    })
    if(nav_index<0){  //热销全部等菜单
      var specal_menu = this.data.specal_menu;
      var index = specal_menu.findIndex(function(element){
        return element.index == nav_index
      })
      this.setData({
        second_title:'',
        title: this.data.specal_menu[index].cat_name,
        second_nav:0
      })
      wx.request({
        url: api.supermarket.goosList,
        data:{
          storeintro_type:id
        },
        success(res){
          if (res.data.data.goods.length == 0) {
            wx.showToast({
              title: '暂无商品信息',
              icon: "none",
              duration: 1500
            })
            that.setData({
              goods_menu: []
            })
            return false;
          }
          res.data.data.goods.forEach(function (item) {
            if (item.market_price == 0) {
              item.discount = 1;
            } else {
              item.discount = (item.shop_price / item.market_price).toFixed(2);
            }
          })
          that.setData({
            goods_menu: res.data.data.goods
          })
          that.contrast();
        }
      })
      return false;
    }

    this.setData({   //普通一级菜单
      second_menu: this.data.first_menu[nav_index].children,
      title: this.data.first_menu[nav_index].cat_name,
      second_nav: 0
    })
    if (ids == undefined) {   // 判断是点击的一级导航  避免出现发出两次请求
      if (this.data.second_menu==undefined){  //没有二级导航的情况
        that.setData({
          goods_menu: '',
          second_title:''
        })
        wx.hideLoading();
        wx.showToast({
          title: '暂无商品信息',
          icon: "none",
          duration: 1500
        })
        return false;
      }
      var id = this.data.second_menu[0].cat_id;
      var second_title = this.data.second_menu[0].cat_name;
      wx.request({
        url: api.supermarket.goosList,
        data: {
          merchant_cat_id: id
        },
        success(res) {
          if (res.data.data.goods.length == 0) {
            wx.showToast({
              title: '暂无商品信息',
              icon: "none",
              duration: 1500
            })
            return false;
          }
          res.data.data.goods.forEach(function(item){
            if (item.market_price == 0) {
              item.discount = 1;
            } else {
              item.discount = (item.shop_price / item.market_price).toFixed(2);
            }
          })
          that.setData({
            goods_menu: res.data.data.goods,
            second_title
          })
          that.contrast();
          wx.hideLoading();
          
        }
      })
    } 
  },
  //二级导航切换
  switch_scond_nav(e){
    var nav_index = this.data.nav_index;
    var index = e.currentTarget.dataset.index;
    var ids = e.currentTarget.dataset.types;
    wx.showLoading({
      title: '数据处理中',
    })
    this.setData({
      second_title: this.data.first_menu[nav_index].children[index].cat_name,
      second_nav:index
    })
    wx.request({
      url: api.supermarket.goosList,
      data: {
        merchant_cat_id: ids 
      },
      success(res) {
        if (res.data.data.goods.length == 0) {
          wx.showToast({
            title: '暂无商品信息',
            icon: "none",
            duration: 1500
          })
          that.setData({
            goods_menu:[],
            second_nav: index
          })
          return false;
        }
        res.data.data.goods.forEach(function (item) {
          if (item.market_price == 0) {
            item.discount = 1;
          } else {
            item.discount = (item.shop_price / item.market_price).toFixed(2);
          }
        })
        that.setData({
          goods_menu: res.data.data.goods,
          second_nav: index
        })
        that.contrast();
        wx.hideLoading();
        
      }
    })
    
  },

  //商品列表加减
  jian(e) {
    var rec_id = e.currentTarget.dataset.rec;
    var index = e.currentTarget.dataset.index;
    var num = this.data.goods_menu[index].num || 0;
    num--;
    if (num <= 0) {
      this.data.goods_menu[index].num = 0;
      this.setData({
        goods_menu: this.data.goods_menu
      })
      this.goods_delete(rec_id);
      return false;
    }
    this.data.goods_menu[index].num = num;
    this.setData({
      goods_menu: this.data.goods_menu
    })
    this.updateGoods(rec_id, num);
  },
  jia(e) {
    var index = e.currentTarget.dataset.index;
    var goods_sn = e.currentTarget.dataset.sn;
    var num = this.data.goods_menu[index].num || 0;
    var rec_id = e.currentTarget.dataset.rec;
    var goods_id = e.currentTarget.dataset.id;
    if(num==0){
      num++;
      that.data.goods_menu[index].num = num;
      this.addGoods(goods_sn, num, goods_id,index)
    }else{
      num++;
      that.data.goods_menu[index].num = num;
      this.updateGoods(rec_id, num)
    }
    // public_js.handleClick(e, that);
  },
  //购物车显示隐藏
  show_car(){
    var is_show = this.data.is_show;
    this.animation = animation;
    if (!is_show){
      animation.opacity(1).height(325).step();

    }else{
      animation.height(0).opacity(0).step();
      
    }   
    is_show = !is_show;
    this.setData({
      animationData: this.animation.export(),
      is_show
    })
  },
  bg_click() {
    this.show_car()
  },
  slected_all(){
    var slected_all = this.data.slected_all;
    slected_all = !slected_all;
    var car_goods_list = this.data.car_goods_list;
    console.log(car_goods_list)
    car_goods_list.forEach(function (element) {
      slected_all ? element.is_checked = 1 : element.is_checked = 0;
    })
    this.setData({
      slected_all,
      car_goods_list
    })
    
  },
  slecte(e){
    var index = e.currentTarget.dataset.index;
    var car_goods_list = this.data.car_goods_list;
    car_goods_list[index].is_checked = 1;
    var rec_id = e.currentTarget.dataset.rec;
    this.setData({
      car_goods_list,
    })
    this.goos_check(rec_id, 1)
  },
  no_slecte(e) {
    var index = e.currentTarget.dataset.index;
    var car_goods_list = this.data.car_goods_list;
    car_goods_list[index].is_checked = 0;
    var rec_id = e.currentTarget.dataset.rec;;
    this.setData({
      car_goods_list,
      slected_all:false,
      
    })
    this.goos_check(rec_id,0);
  },
  //更换选中状态
  goos_check(rec_id, is_checked){
    wx.request({
      url: api.car.goods_check,
      data: {
        token,
        rec_id,
        "is_checked": is_checked,
        user_id
      },
      method: "POST",
      success(res) {
        if (!res.data.data.cart_list.length){
          return false;
        }
        var car_goods_list = res.data.data.cart_list[0].goods_list;
        var all_price = res.data.data.total.goods_price
        that.setData({
          car_goods_list,
          car_goods_num: res.data.data.total.goods_number,
          all_price
        })
      }
    })
  },
  //获取购物车商品列表
  getCarGoodsList(){
    wx.request({
      url: api.car.getCarGoodsList,
      data:{
        token: wx.getStorageSync('token'),
        user_id
      },
      method:"POST",
      success(res){
        var slected_all = that.data.slected_all;
        if (res.data.data.cart_list.length>0){
          var car_goods_list = res.data.data.cart_list[0].goods_list;
          var all_price = res.data.data.total.goods_price;
          var all_price = res.data.data.total.goods_price;
          var goods_menu = that.data.goods_menu;
          car_goods_list.forEach(function(element){
            var goods_id = element.goods_id;
            var index = goods_menu.findIndex(function(item){
              return item.goods_id == goods_id
            });
            var obj = goods_menu[index];
            if(obj!=undefined){
              obj.num = element.goods_number;  
              obj.rec_id = element.rec_id         
            } 
            if (element.is_checked!=1){
              slected_all = false;
            }
          })
          that.setData({
            goods_menu,
            car_goods_list,
            car_goods_num: res.data.data.total.goods_number,
            all_price,
            slected_all: slected_all
          })
        }else{
          that.setData({
            slected_all:false
          })
        }
      }
    })
  },
  //对比商品列表
  contrast(){
    var goods_menu = that.data.goods_menu;
    var car_goods_list = that.data.car_goods_list;
    car_goods_list.forEach(function (element) {
      var goods_id = element.goods_id;
      var index = goods_menu.findIndex(function (item) {
        return item.goods_id == goods_id
      });
      var obj = goods_menu[index];
      if (obj != undefined) {
        obj.num = element.goods_number;
        obj.rec_id = element.rec_id
      }
    })
    that.setData({
      goods_menu,
    })
  },
  //购物车加减
  car_jia(e){
    var index = e.currentTarget.dataset.index;
    var goods_id = e.currentTarget.dataset.id;
    var num = this.data.car_goods_list[index].goods_number;
    var rec_id = e.currentTarget.dataset.rec;
    num++;
    this.data.car_goods_list[index].goods_number = num;
    var goods_menu = that.data.goods_menu;
    var index = goods_menu.findIndex(function (item) {
      return item.goods_id == goods_id
    });
    if(index>=0){
      goods_menu[index].num = num;    
    }
    this.updateGoods(rec_id, num)
  },
  car_jian(e){
    var index = e.currentTarget.dataset.index;
    var goods_id = e.currentTarget.dataset.id;
    var num = this.data.car_goods_list[index].goods_number;
    var rec_id = e.currentTarget.dataset.rec;
    num--;
    
    this.data.car_goods_list[index].goods_number = num;
    var goods_menu = that.data.goods_menu;
    var index = goods_menu.findIndex(function (item) {
      return item.goods_id == goods_id
    });

    if(index>=0){
      goods_menu[index].num = num;
      that.setData({
        goods_menu: goods_menu
      })
    }
    if (num <= 0) {
      num = 0;
      this.goods_delete(rec_id);
      return false;
    }
    this.updateGoods(rec_id, num);

  },
  //删除购物车商品
  goods_delete(rec_id){
    wx.request({
      url: api.car.goods_delete,
      data: {
        token,
        rec_id,
        user_id
      },
      success(res) {
        if (res.data.data.cart_list.length>0){
          var car_goods_list = res.data.data.cart_list[0].goods_list;
          var all_price = res.data.data.total.goods_price
          that.setData({
            car_goods_list,
            car_goods_num: res.data.data.total.goods_number,
            all_price
          })
        }else{
          that.setData({
            car_goods_list:[],
            car_goods_num: 0,
            all_price:0,
            slected_all:false
          })
        }
        
      }
    })
  },
  //添加商品到购物车
  addGoods(goods_sn, num, goods_id, index) {
    wx.request({
      url: api.car.addcar,
      data: {
        user_id: wx.getStorageSync('user_id'),
        goods_sn: goods_sn,
        number: num,
        user_id
      },
      method: "POST",
      success(res) {
        var car_goods_list = res.data.data.cart_list[0].goods_list;
        var all_price = res.data.data.total.goods_price;
        var obj = car_goods_list.find(function(element){
          return element.goods_id == goods_id;
        })
        var rec_id = obj.rec_id;
        that.data.goods_menu[index].rec_id = rec_id;
        that.setData({
          car_goods_list,
          car_goods_num: res.data.data.total.goods_number,
          all_price,
          goods_menu: that.data.goods_menu,
        })
      }
    })
  },
  //更新购物车
  updateGoods(rec_id, num) {
    wx.request({
      url: api.car.update,
      data: {
        rec_id: rec_id,
        new_number: num,
        token: wx.getStorageSync('token'),
        user_id
      },
      method: "POST",
      success(res) {
        if (res.data.status.succeed!=0){
          if (res.data.data.cart_list.length > 0) {
            
            var car_goods_list = res.data.data.cart_list[0].goods_list;
            var all_price = res.data.data.total.goods_price
            that.setData({
              car_goods_list,
              car_goods_num: res.data.data.total.goods_number,
              all_price
            })
          }
        }else{

        }
        that.setData({
          goods_menu: that.data.goods_menu,
        })
      }
    })
  },
  //清空购物车
  cleanCar(){
    var length = this.data.car_goods_list.length;
    if (length>0){
      wx.showModal({
        title: '提示',
        content: '确定清空购物车吗？',
        success: function (res) {
          if (res.confirm) {
            var arr = [];
            var car_goods_list = that.data.car_goods_list;
            car_goods_list.forEach(function (element) {
              var rec_id = element.rec_id;
              arr.push(rec_id);
            })
            var rec_id = arr.join(',');
            that.goods_delete(rec_id);
            var goods_menu = that.data.goods_menu;
            goods_menu.forEach(function (item) {
              item.num = 0
            });
            that.setData({
              goods_menu
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  // 提交订单
  submit_order(){
    var n = public_js.check_shop_time();
    if (n) {
      return false;
    }
    var arr = [];
    var car_goods_list = that.data.car_goods_list;
    if (!car_goods_list || car_goods_list.length==0){
      wx.showToast({
        title: '请先选择商品',
        icon:"none",
        duration:1500
      })
      return false;
    }
    var a = true;//判断是否存在 购物车 列表  全部不选中的场景；
    car_goods_list.forEach(function (element) {
      if (element.is_checked==1){
        a = false;
        var rec_id = element.rec_id;
        arr.push(rec_id);
      }
    })
    if(a){
      wx.showToast({
        title: '请至少选择一种商品',
        icon:"none"
      })
      return false;
    }

    var rec_id = arr.join(',');
  
    wx.navigateTo({
      url: '../order-desc/order-desc?rec_id=' + rec_id+'',
    })
  },
  getNewsData() {
    public_js.getNewsData(that,2);
    
  },
  getBanner(){
    public_js.getBanner(that,2);
  },
  link(e){
    public_js.link(e, that);
  },
  // 预览显示图片
  previewImage(e){
    var url = e.currentTarget.dataset.url;
    var urls = [];
    urls.push(url)
    wx.previewImage({
      urls: urls,
      current: url,
      success:function(res){

      }
    })
  },
  closevoucher() {
    public_js.colose_lj(that,);

  },
  onPageScroll: function (e) {
    if (e.scrollTop < 0) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    }
  }
})
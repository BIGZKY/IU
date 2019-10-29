const api = require('../api.js').api;
const public_js = {
  addr_info,
  hide_list,
  select_ship_mode,
  receive_dp,
  receive_hb,
  show_section,
  handleClick,
  getAddressData,
  getData,
  colose_lj,
  getdpj,
  select_ship_time,
  lookMore,
  baoyue,
  getNewsData,
  getBanner,
  link,
  timestampToTime,
  sendFormId,
  gettime,
  check_shop_time,
  hasDiscount
}
const app = getApp();

function show_section(e,that) {
  
  var  animation = wx.createAnimation({
    duration: 400,
    timingFunction: "ease",
    delay: 0
  })
  var type = e.currentTarget.dataset.type;
  type = parseInt(type);
  that.setData({
    type
  })
  animation.translateY(0).step();
  switch (type) {
    case 0:
      that.setData({
        dp_animationData: animation.export(),
        is_show: true
      })
      break;
    case 1:
      that.setData({
        hb_animationData: animation.export(),
        is_show: true
      })
      break;
    case 2:
      that.setData({
        goods_animationData: animation.export(),
        is_show: true
      })

      break;
    case 3:
      that.setData({
        ship_animationData: animation.export(),
        is_show: true
      })
      break;
  }
}
function receive_hb(e, that) {
  var index = e.currentTarget.dataset.index;
  var money = e.currentTarget.dataset.money;
  var bonus_id = e.currentTarget.dataset.id;
  that.setData({
    money: money,
    hb_tip: '红包抵用' + money + '元',
    bonus_id,
    hb_index: index
  })
  that.hide_list();
}
function receive_dp(e, that) {
  var run_name = e.currentTarget.dataset.money;
  var run_id = e.currentTarget.dataset.id;
  var index = e.currentTarget.dataset.index;
  that.setData({
    dp_tip: run_name,
    run_id,
    fee: 0,
    dp_index:index
  })
  that.hide_list();
}
//点击选择配送方式
function select_ship_mode(e,that) {
  var type = e.currentTarget.dataset.type;
  var shipping_id = e.currentTarget.dataset.shippingid;
  var shipping_area_id = e.currentTarget.dataset.shippingareaid;

  var index = e.currentTarget.dataset.index;
  var ship_mode_list = that.data.ship_mode_list;
  var isvip = e.currentTarget.dataset.isvip;

  var a = ship_mode_list[index].configure.filter(function (item) {
    return item.name == 'ship_time'
  })
 
  if (!a.length) {
    that.setData({
      ableChooseTime:false,
      run_id:'',
      dp_index:-1,
      dp_tip: that.data.run_member ? that.data.run_member.length + '个代跑劵可用' : '暂无可用',
      select_time_tip:''
    })
  }else{
    that.setData({
      ableChooseTime: true,
      ship_time_index:0
    })
  }

  that.setData({
    ship_index: index,
    fee: parseFloat(ship_mode_list[index].fee),
    shipping_area_name: ship_mode_list[index].shipping_area_name,
    shipping_id,
    shipping_area_id
  })
  if (isvip) {
    that.setData({
      able_isvip:true
    })
  }else{
    that.setData({
      able_isvip: false
    })
  }

  that.setData({
    selected_index: index,
  })
  that.hide_list();
}
function addr_info(that){
  if (wx.getStorageSync('address_id') || wx.getStorageSync('address_null')) {
    that.setData({
      address_id: wx.getStorageSync('address_id'),
      address: wx.getStorageSync('address'),
    })
  }
}
function hide_list(that) {
  var animation = wx.createAnimation({
    duration: 400,
    timingFunction: "ease",
    delay: 0
  })
  var is_show = that.data.is_show;
  animation.translateY(345).step();
  is_show = false;
  var type = that.data.type;
  switch (type) {
    case 0:
      that.setData({
        dp_animationData: animation.export(),
        is_show
      })
      break;
    case 1:
      that.setData({
        hb_animationData: animation.export(),
        is_show
      })
      break;
    case 2:
      that.setData({
        goods_animationData: animation.export(),
        is_show
      })
      break;
    case 3:
      that.setData({
        ship_animationData: animation.export(),
        is_show
      })
      break;
  }
}
function setDelayTime(sec) {
  return new Promise((resolve, reject) => {
    setTimeout(() => { resolve() }, sec)
  })
}
function handleClick(e,that){
  // x, y表示手指点击横纵坐标, 即小球的起始坐标.
  let ballX = e.detail.x-10,
    ballY = e.detail.y-15;
  that.setData({
    ballX,
    ballY,
    showBall: true
  })
  createAnimation(ballX, ballY, that);
}

// 创建动画
function createAnimation(ballX, ballY,that) {

    var bottomX = 20,
    bottomY = app.globalData.windowHeight-47,
    animationX = flyX(bottomX, ballX, 200),   // 创建小球水平动画
    animationY = flyY(bottomY, ballY, 200);			 // 创建小球垂直动画
    setDelayTime(100).then(() => {
    that.setData({
      animationX: animationX.export(),
      animationY: animationY.export()
    })
    // 400ms延时, 即小球的抛物线时长
    return setDelayTime(300);
  }).then(() => {
    that.setData({
      animationX: flyX(0, 0, 0).export(),
      animationY: flyY(0, 0, 0).export(),
      showBall: false
    })
  })
}
// 水平动画
function flyX(bottomX, ballX, duration) {
  let animation = wx.createAnimation({
    duration: duration || 200,
    timingFunction: 'linear',
  })
  animation.translateX(bottomX - ballX).step();
  return animation;
}
// 垂直动画
function flyY(bottomY, ballY, duration) {
  let animation = wx.createAnimation({
    duration: duration || 200,
    timingFunction: 'ease-in',
  })
  animation.translateY(bottomY - ballY).step();
  return animation;
}

//获取地址信息
function getAddressData(that){
  if (wx.getStorageSync('address')) {
    that.setData({
      address: wx.getStorageSync('address')
    })
    hasDiscount(that, wx.getStorageSync('address').id)
    return false;
  } 
  wx.request({
    url: api.address.addr_list,
    data: {
      token: wx.getStorageSync('token'),
      user_id: wx.getStorageSync('user_id')
    },
    success(res) {
      let addr_list =  res.data.data;
      if (!addr_list){
        that.setData({
          address: ''
        })
        return false
      }
      let address = addr_list.find(function(item){
        return item.default_address == 1;
        
      })
      if (address){
        that.setData({
          address
        })
      }else{
        that.setData({
          address:''
        })
      }
      var addr_id = address ? address.id : '';
      hasDiscount(that, addr_id )
    }
  })
}

//计算配送方式
function getData(that, run_type) {
  var isvip = wx.getStorageSync('isvip');
  if (isvip) {        //显示是不是VIP会员配送结果
    that.setData({
      able_isvip: true
    })
  } else {
    that.setData({
      able_isvip: false
    })
  }

  wx.request({
    url: api.delivery.configstore,
    method: "POST",
    data: {
      user_id: wx.getStorageSync('user_id'),
      run_type: run_type
    },
    success(res) {
      if (res.data.data.is_new == 1 && run_type == 1){
        var voucher = {
          name: res.data.data.marks.name,
          run_type: 1,
          is_type:1,
          useendtime: res.data.data.marks.useendtime
        }
        that.setData({
          hasvoucher: true,
          voucher
        })
      }
      //判断账号 是否异常 ------------------start
      if(run_type==1){
        var controll = res.data.data.user_info.controll;
        if (controll == 1) {
          wx.showModal({
            title: '警告提示',
            content: '系统检测到您多次为他人代取，请联系客服!',
            showCancel:false
          })
        } else if (controll == 2) {
          wx.showModal({
            title: '警告提示',
            content: '系统检测到您多次为他人代取已禁止使用该功能，请联系客服!',
            showCancel: false
          })
        }else if (wx.getStorageSync('isvip')) {
          if (wx.getStorageSync('tanNum')>0){
            console.log(222)
            var tanNum = wx.getStorageSync('tanNum');
            --tanNum;
            wx.setStorageSync('tanNum', tanNum);
            wx.showModal({
              title: '温馨提示',
              content: '月卡只可用于本人领取快递，为他人代取快递将会被系统封停该功能!',
              showCancel: false
            })
          }  
        }
        that.setData({
          controll
        })
      }
      
      // -----------------------------------start
      var ship_mode_list = res.data.data.shipping;
      var newShip_mode_list = [];
      ship_mode_list.forEach(function (element, index) {
        if (element.shipping_id != 1 && element.shipping_id != 9) {
          element.fee = element.configure[1].value;
          if (element.configure[1].isvip && element.configure[1].isvip == 1) {
            element.isvip = true;
            // element.discount = element.fee
          }
          newShip_mode_list.push(element)
        }
      })
      ship_mode_list = newShip_mode_list;
  
      //显示默认时间   
      var ship_index = ship_mode_list.findIndex(function (element) {   //默认配送方式
        return element.defult == 1;
      })

      var obj = ship_mode_list[ship_index];
      //计算快递配送金额列表 ---------------start
      var moneyList = ''
      var moneyObj = ''
      moneyObj = obj.configure.find(function(item){
        return item.name == "express" && typeof(item.value) =='object';
      })
      if (moneyObj){
        moneyList = moneyObj.value;
      }
     //          --------------- end
      that.setData({
        shipping_id: obj.shipping_id,  //设置默认的配送ID
        shipping_area_id: obj.shipping_area_id,
        moneyList
      })
      
      var fee_list = obj.configure;  //设置费用列表
      var obj_fee = fee_list[1] // 设置基重obj
      var time = fee_list.find(function (element) {  //  设置默认时间
        return element.name == 'ship_time';
      })    
      if (time.value.length){
        that.setData({
          ableChooseTime: true,
        })
      }else{
        that.setData({
          ableChooseTime: false,
        })
      }
      var time_list = time.value;
      var arr = [];   //选择 显示不过期时间

      //当前毫秒数
      var current_time = (new Date()).getTime();
      time_list = time_list.filter(function (item) {
        item.times = item.times || 0;
        //截止毫秒数
        var end_time = new Date().toLocaleDateString() + ' ' + item.end;
        
        return (current_time + item.times * 60 * 1000) > new Date(end_time).getTime() ? false : true;

      })
      time_list.forEach(function (value, indexs) {
        var item = value.end;
        arr[indexs] = {}
        arr[indexs].time_stage = value.start + '-' + value.end;
        arr[indexs].time = value.end;
        arr[indexs].p_index = indexs;
      })
      var time_list = arr;
      if (time_list.length > 0) {
        time_list.reverse();
        var select_time_tip = time_list[0].time;
        that.setData({
          time_list,
          ship_time: time_list[0].time_stage,
          ship_end_time: time_list[0].time
        })
      }else{
        that.setData({
          time_list:[],
          ship_time:'',
        })
      }
      that.setData({
        ship_mode_list,
        albe_choose_time: 1,
        fee: parseFloat(obj_fee.value),
        ship_index,
        ship_time_index:0,
        express_day: res.data.data.user_info.express_day,
        merchant_shop_day: res.data.data.user_info.merchant_shop_day,
        supermarket_day: res.data.data.user_info.supermarket_day,
      })

      if (res.data.data.is_run == 1) {
        that.setData({
          is_run: true,
          run_member: res.data.data.run_member,
          dp_tip: '' + res.data.data.run_member.length + '个代跑劵可用'
        })
      } else {
        that.setData({
          is_run: false,
        })
      }
    }
    
  })
  
}
function baoyue(e,that) {
  var index = e.currentTarget.dataset.index;
  that.setData({
    ship_index: index,
    ship_time_index: 1000,
    shipping_id: '',
    ableChooseTime: false
  })
  wx.showModal({
    title: '温馨提示',
    content: '是否购买包月服务',
    success: function (res) {
      if (res.confirm) {
        wx.navigateTo({
          url: '../buy/index',
        })
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
}
// 选择配送时间
function select_ship_time(that,e){
  var index = e.currentTarget.dataset.index;
  var time_stage = that.data.time_list[index].time_stage;
  var ship_end_time = that.data.time_list[index].time;
  that.setData({
    ship_time: time_stage,
    ship_time_index: index,
    ship_end_time: ship_end_time
  })
}
// 关闭代跑劵
function colose_lj(that,type){
  that.setData({
    hasvoucher:false
  })
  if (type == 0 || !that.data.order_id) {
    return false;
  }
  if(type==1){
    wx.navigateBack({
      delta:1
    })
    return false;
  }
  var order_id = that.data.order_id;
  wx.reLaunch({
    url: '../order_detail/index?order_id=' + order_id + '',
  })
}
// 获取到代跑劵
function getdpj(that, run_type, order_id){
  wx.request({
    url: api.order.getDpj,
    data: {
      user_id: wx.getStorageSync('user_id'),
      run_type,
      order_id
    },
    method: "POST",
    success(res) {
      if (res.data.data){
        var voucher = res.data.data;
        that.setData({
          hasvoucher: true,
          voucher
        })
        return false;
      }else{
        var order_id = that.data.order_id;
        wx.reLaunch({
          url: '../order_detail/index?order_id=' + order_id + '',
        })
      }
      
    }
  })
}
function lookMore(that, show_opt){
  var animation = wx.createAnimation({
    duration: 300,
    timingFunction: "ease",
    delay: 0
  })
  var animations = wx.createAnimation({
    duration: 300,
    timingFunction: "ease",
    delay: 0
  })
  if (!show_opt) {
    var aa = animation.opacity(1).translateY(0).step();
    var bb = animations.rotate(720).step();
    that.setData({
      opt_animationData: aa.export(),
      o_animationData: bb.export()
    })

  } else {
    var aa = animation.opacity(0).translateY(160).step();
    var bb = animations.rotate(-720).step();
    that.setData({
      opt_animationData: aa.export(),
      o_animationData: bb.export()
    })
  }
  show_opt = !show_opt;
  that.setData({
    show_opt
  })
}
function getNewsData(that,type) {
  wx.request({
    url: api.article.news,
    data: {
      type:1
    },
    method: "POST",
    success(res) {
      var msgList = JSON.parse(res.data.data);
      that.setData({
        msgList
      })
    },
  })
}
function getBanner(that,type) {
  wx.request({
    url: api.article.banner,
    data: {
      type
    },
    method: "POST",
    success(res) {
      that.setData({
        imgUrls: JSON.parse(res.data.data)
      })
    }
  })
}
function link(e,that) {
  var link = e.currentTarget.dataset.url;
  var type = e.currentTarget.dataset.type;
  var article_id = e.currentTarget.dataset.article_id;
  if (type == 3) {
    wx.navigateTo({
      url: '/' + link,
    })
  } else if (type == 1){
    wx.navigateTo({
      url: '/pages/news/news' + '?article_id=' + article_id + '' ,
    })
  }
   else if (type == 2) {
    that.setData({
      httpLink: link,
      isHide: true
    })
  }
}
function timestampToTime(timestamp) {
  var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
  var h = date.getHours() < 10 ? '0' + date.getHours() + ' ' : date.getHours() + ':';
  var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ' ' : date.getMinutes();
  var s = date.getSeconds();
  return  Y + M + D + h + m;
}
// function able_shopTime(that,index){
//   if (that.data.is_kg!=1){0
//     return 0
//   }
//   if (index == 1 || index == 2 || index == 3){
//     var able_shopTime = that.data.able_shopTime;
//     var shop_start = able_shopTime.start.replace(':', '.');
//     var shop_end = able_shopTime.end.replace(':', '.');
//     var current_time = new Date().getHours();
//     var current_time_minutes = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
//     var time =current_time + '.' + current_time_minutes;

//     if (parseFloat(time) >= parseFloat(shop_end) || parseFloat(time) <= parseFloat(shop_start)) {
//       return 1;
//     }
    
//   }else{
//     return 0;
//   }
  
// }
//效验营业时间
function check_shop_time(){
  if (wx.getStorageSync('is_kg')!=1){
    return 0;  //关闭营业时间  不弹出提示
  }
  var shop_time = wx.getStorageSync('shop_time');
  var current_time = new Date().getHours();
  var current_time_minutes = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
  var time = current_time + '.' + current_time_minutes;
  if (parseFloat(time) >= parseFloat(shop_time.end) || parseFloat(time) <= parseFloat(shop_time.start)) {
    wx.showToast({
      title: '暂不在营业时间' + shop_time.start + '-' + shop_time.end + '内',
      icon: "none",
      duration: 2000
    })
    return 1; // 检查营业时间 弹出提示
    // return 1; 
  }else{
    return 0; // 不弹出提示
  }
}
//获取营业时间
function gettime(that) {
  if (!wx.getStorageSync('user_id')) {
    return false;
  }
  if (!app.globalData.init) {
    that.setData({
      init: true
    })
    app.globalData.init = true;
    
  }
  wx.request({
    url: api.main.gettime,
    data: {
      user_id: wx.getStorageSync('user_id') || ''
    },
    method: "POST",
    success(res) {
      var is_kg = res.data.data.is_kg;
      var telephone = res.data.data.telephone;
      var minShopMoney = res.data.data.min_money;
      var setTanNum = res.data.data.setTanNum;
      var shop_time = {};
      shop_time.start = res.data.data.is_shangban.start.replace(':', '.');
      shop_time.end = res.data.data.is_shangban.end.replace(':', '.');
      that.setData({
        is_lingka: res.data.data.is_lingka,
        showModel: res.data.data.showModel,
        version: res.data.data.version,
        isShowWq: res.data.data.isShowWq,
        main_bgColor: res.data.data.main_bgColor,
      })
      setTimeout(() => {
        let an = wx.createAnimation({
          duration: 300,
          timingFunction: 'ease',
          initAn: null
        })
        an.opacity(0).step();
        that.setData({
          initAn: an.export(),
          init: false
        })
      }, 500)

      wx.setStorageSync('minShopMoney', minShopMoney);
      wx.setStorageSync('telephone', telephone);
      wx.setStorageSync('shop_time', shop_time);
      wx.setStorageSync('is_kg', is_kg);
      if (!setTanNum){
        wx.setStorageSync('tanNum', 0);
      }
    }
  })
}
//发送formID
function sendFormId(formid, wxapp_type){
  wx.request({
    url: api.sendMsg.sendMsg,
    data:{
      formid,
      wxapp_type,    //0 form表单  1支付
      user_id: wx.getStorageSync('user_id')
    },
    method:"POST",
    success(res){
      console.log(res);
    }
  })
}
//判断是否需要折扣
function hasDiscount(that,addr_id){
  if (addr_id ==''){
    return false;
  }
  wx.request({
    url: api.hasDiscont.hasDiscont,
    data: {
      addr_id
    },
    method: "POST",
    success(res) {
      if (res.data.data && res.data.data.is_status == 0){  //配送员
        wx.showModal({
          title: '温馨提示',
          content: res.data.data.instruction,
          showCancel:false,
          success(r) {
            if (r.confirm) {
              that.setData({
                hasdiscount: res.data.data.discount
              })
            } else if (r.cancel) {
              wx.redirectTo({
                url:'/pages/index/index'
              })
            }
          }
        })
      }else{
        that.setData({
          hasdiscount: 1
        })
      }
      
    }
  })
}
module.exports =  {
  public_js: public_js
}
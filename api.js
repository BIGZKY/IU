
// 财大
// var appid = wxbd29c00b5e8162b3
var api_root = 'https://iu.yitiyan360.com/sites/api/?store_id=62&uuid=56e9c868ee7a4cf0be0505b5fdc9c49a&url='

// 经贸
// appid = wx94fb13d313a24d46
// var api_root = 'https://iu.yitiyan360.com/sites/api/?store_id=65&uuid=bd41be8030de4d5f9f34528bc99ccab5&url=';

// 华水
// appid = wx25b4836e3b59472e
// var api_root = 'https://iu.yitiyan360.com/sites/api/?store_id=66&uuid=9d262692264c4b4fb13351816c568fe5&url=';

var api = {
  supermarket:{
    category: api_root + 'goods/mhcategory',
    goosList: api_root + 'goods/mhgoods',
  },
  shop_street:{
    seller_list: api_root + '	seller/list',
    shopList: api_root + 'mechshop/shop',
    shopdetail: api_root + 'mechshop/shopdetail',
    foodsList: api_root + 'mechshop/foods',
    getTypeList: api_root + 'mechshop/foodscate',
    getTJShop: api_root + 'adsense/shop',
    yy: api_root + 'adsense/kun',
  },
  address:{
    addres_list: api_root + 'address/list'
  },
  delivery:{
    pay: api_root + 'order/pay',
    delivery: api_root + 'flow/delivery',
    configstore: api_root + 'flow/configstore',
    postDelivery:api_root + 'shipping/delivery',
    shipping_delivery: api_root+ 'shipping/delivery_order',
    courier_delivery_list: api_root + 'shipping/delivery_list', 
    delivery_look: api_root + 'shipping/delivery_look',
    delivery_take: api_root + 'shipping/delivery_take',
    delivery_finish: api_root +'shipping/delivery_finish'
  },
  djf:{
    getNavList: api_root + 'flow/paytype'
  },
  login: {
    login: api_root + "weapp/wxzlogint",
    second_login: api_root + 'weapp/wxbindt',

  },
  car:{
    addcar: api_root + 'storebuy/cart/create',
    update: api_root + 'storebuy/cart/update',
    getCarGoodsList: api_root + 'storebuy/cart/list',
    goods_check: api_root + 'storebuy/cart/checked',
    goods_delete: api_root + 'storebuy/cart/delete',
    checkOrder: api_root + 'storebuy/flow/checkOrder',
    done: api_root + 'storebuy/flow/done'
  },
  address:{
    add_address: api_root + 'address/add',
    addr_village: api_root + 'address/village',
    addr_list: api_root + 'address/list',
    addr_info: api_root + 'address/info',
    addr_update: api_root + 'address/update',
    setDefault: api_root + 'address/setDefault',
    addr_delete: api_root + 'address/delete',
  },
  order:{
    hb_list: api_root + 'user/bonus',
    pay: api_root +'weapp/wxpay',
    order_list: api_root + 'order/list',
    order_detail: api_root + 'order/detail',
    order_cancle: api_root + 'order/cancel',
    affirmReceived: api_root + 'order/affirmReceived',
    regions:api_root + 'order/regions',
    getDpj: api_root + 'staff/adddaipao',
  },
  per_center:{
    coupon: api_root + 'mothcard/mothcard',
    buyCoupon: api_root + 'mothcard/order_monthcard',
    wx_pay: api_root +'weapp/wxpay_monthcard',
    userInfoType : api_root + 'user/info',
    getProfit: api_root + 'staff/userinfo',
    upLoadPic: api_root + 'staff/upload',
    apply: api_root + 'staff/apply',
    plantime: api_root + 'staff/plantime',
    plantadd: api_root +'staff/plantadd',
    run: api_root + 'staff/run',
    tixian: api_root + 'user/account/raply'
  },
  dispatch:{
    dispatch: api_root + 'freeorder/freeorder',
    dispatchPay: api_root + 'weapp/wxpay_freeorder',
    getDispatchList: api_root + 'freeorder/freelist',
    dispatchDetail:api_root + 'freeorder/freedetail',
    robbing:api_root + 'information/redis',
    smscode:api_root + 'information/smscode',
    freestatus: api_root + 'freeorder/freestatus',
    accept: api_root + 'staff/accept'
  },
  ad:{
    adDetail: api_root + 'information/info',
    submitInfo: api_root + 'information/user',
    adPay: api_root + 'weapp/wxpay_enroll',
    getActiveList: api_root + 'information/adver'
  },
  main:{
    getMark: api_root + 'staff/marks',
    gettime: api_root + 'merchant/config'
  },
  article:{
    news: api_root + 'adsense/headline',
    banner:api_root + 'adsense/wheel' ,
    getOneNews: api_root + 'adsense/detailed',
  },
  sendMsg:{
    sendMsg: api_root +  'weapp/addformid'
  },
  hasDiscont:{
    hasDiscont: api_root + 'shipping/is_delivery'
  }
}
module.exports = {
  api:api
}
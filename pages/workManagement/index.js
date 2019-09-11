//index.js
//获取应用实例
const app = getApp()
var api = require('../../api.js').api;
var that = '';
Page({
  data: {
    year: 0,
    month: 0,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    isToday: 0,
    isTodayWeek: false,
    todayIndex: 0,
    timeArr:[]
  },
  onLoad: function () {
    that = this;
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    this.dateInit();
    this.setData({
      year: year,
      month: month,
      isToday: '' + year + month + now.getDate()
    })
    wx.request({
      url: api.per_center.plantime,
      data: {

      },
      method: "POST",
      success(res) {
        var timeList = [];

        res.data.data.forEach(function (item) {
          var obj = {};
          obj.time = item;
          obj.isChoose = false;
          timeList.push(obj)
        })

        that.setData({
          timeList
        })
      }
    })
  },
  dateInit: function (setYear, setMonth) {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let dateArr = [];						//需要遍历的日历数组数据
    let arrLen = 0;							//dateArr的数组长度
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth || now.getMonth();					//没有+1方便后面计算当月总天数
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    let startWeek = new Date(year + '/' + (month + 1) + '/' + 1).getDay();							//目标月1号对应的星期
    let dayNums = new Date(year, nextMonth, 0).getDate();				//获取目标月有多少天
    let obj = {};
    let num = 0;

    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    arrLen = startWeek + dayNums;
    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;
        obj = {
          isToday: '' + year + (month + 1) + num,
          dateNum: num,
          weight: 5
        }
      } else {
        obj = {};
      }
      dateArr[i] = obj;
    }
    this.setData({
      dateArr: dateArr
    })

    let nowDate = new Date();
    let nowYear = nowDate.getFullYear();
    let nowMonth = nowDate.getMonth() + 1;
    let nowWeek = nowDate.getDay();
    let getYear = setYear || nowYear;
    let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;

    if (nowYear == getYear && nowMonth == getMonth) {
      this.setData({
        isTodayWeek: true,
        todayIndex: nowWeek
      })
    } else {
      this.setData({
        isTodayWeek: false,
        todayIndex: -1
      })
    }
  },
  lastMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
  },
  nextMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
  },
  dateClick(e){   //点击日期
    var d = e.currentTarget.dataset.d;

    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
    let date = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
    let str0 = '' + year + month + date;

    let years = this.data.year;
    let months = this.data.month < 10 ? '0'+ this.data.month : this.data.month;
    let dates = d <10 ? '0' + d : d;
    let str1 = '' + years + months + dates

    if (str0 > str1){
      wx.showToast({
        title: '该日期已过',
        icon:'none',
        duration:1500,

      })
      return false;
    }
    let timeList = that.data.timeList;
    timeList.forEach(function(item){
      item.isChoose = false ;
    })

    this.setData({
      t: true,
      d,
      timeList,
      timeArr:[]
    })

  },
  chooseTime(e){
    var index = e.currentTarget.dataset.index;
    var time = e.currentTarget.dataset.time;
    var timeList = this.data.timeList;
    var timeArr = this.data.timeArr;
    if (timeList[index]['isChoose']){
      timeArr.splice(index,1);
    }else{
      timeArr.push(time)
    }
    timeList[index]['isChoose'] = !timeList[index]['isChoose'];
    this.setData({
      timeList,
      timeArr
    })
    
    console.log(that.data.timeArr)
  },

  cancle(){
    this.setData({
      t:false,
      index:-1,
      timeArr: []
    })
  },
  confirm(){
  

    var year = this.data.year;
    var month = this.data.month;
    var d = this.data.d;
    var date_plan = ''+year+'-'+month+'-'+d+'';
    console.log(date_plan)
    var plan_time = this.data.timeArr;
    if (!plan_time.length) {
      wx.showToast({
        title: '请先选择工作时间',
        icon: "none",
        duration: 1500
      })
      return false;
    }
    wx.request({
      url: api.per_center.plantadd,
      data: {
        staff_id: wx.getStorageSync('staff_id'),
        plan_time: plan_time,
        date_plan: date_plan
      },
      method: "POST",
      success(res) {
        console.log(res);
        if (res.data.status.error_code==404){
          wx.showModal({
            title: '温馨提示',
            content: '' + res.data.status.error_desc+'',
            showCancel:false
          })
          return false;
        }
        if (res.data.status.succeed == 1){
          that.setData({
            t: false,
            index: -1,
            timeArr: []
          })
          app.err_tip('添加成功');
          that.getWorkTimeList();
        }
        
      }
    })
  },
  onShow(){
    this.getWorkTimeList();
  },

  // 获取时间安排列表
  getWorkTimeList(){
    wx.request({
      url: api.per_center.plantime,
      data: {
        staff_id: wx.getStorageSync('staff_id'),
        action:1
      },
      method: "POST",
      success(res) {
        var workTimeList = res.data.data;
        workTimeList.forEach(function(item){
          item['plan_obj'] = [];
          if (item.is_guoshi==1){
            item.plan_time.forEach(function(element){
              var timeOBj = {};
              timeOBj['time'] = element;
              timeOBj['isPass'] = true;
              item['plan_obj'].push(timeOBj)
            })
          }
          if (item.is_guoshi == 0) {  //现在
            item.plan_time.forEach(function (element) {
              var timeOBj = {};
              var lastTime = parseInt(element.split('-')[1]);
              var current_time = new Date().getHours();
              if (current_time < lastTime){
                timeOBj['time'] = element;
                timeOBj['isPass'] = false;
              }else{
                timeOBj['time'] = element;
                timeOBj['isPass'] = true;
              }
              item['plan_obj'].push(timeOBj)
            })
          }
          if (item.is_guoshi == 2) {  //未来
            item.plan_time.forEach(function (element) {
              var timeOBj = {};
              timeOBj['time'] = element;
              timeOBj['isPass'] = false;
              item['plan_obj'].push(timeOBj)
            })
          }
        })
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        let day = '' + year +'-'+ month +'-'+ now.getDate();
        let index = workTimeList.findIndex(function(item){
          return item.date_plan == day;
        })
        if (index!=-1){
          
          var todayObj = workTimeList[index];
          workTimeList.splice(index, 1);
          that.setData({
            todayObj
          })
        }

        that.setData({
          workTimeList,
        })
      }
    })
  }
})


import moment from 'moment'
//节流函数
export function debounce(func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
// fmt: yyyy-MM-dd hh:mm:ss
export function formatTime(str, fmt = 'yyyy-MM-dd') {
  if (!str) return null;
  let date = new Date(parseInt(str))
  let obj = {
    'y': date.getFullYear(),
    'M': date.getMonth() + 1,
    'd': date.getDate(),
    'h': date.getHours(),
    'm': date.getMinutes(),
    's': date.getSeconds()
  }

  return fmt.replace(/(y+|M+|d+|h+|m+|s+)/g, function ($0, $1) {
    let time = obj[$1.substr(0, 1)] + ''
    time = time.length == 1 ? ('0' + time) : time;
    return time.substr(time.length - $1.length, $1.length)
  })
}

export function isInDateRange(s, e, c) {
  return c.getTime() >= s.getTime() && c.getTime() <= e.getTime();
}
export function toDecimal(x) {
  var f = parseFloat(x);
  if (isNaN(f)) {
    return false;
  }
  var f = Math.round(x * 100) / 100;
  var s = f.toString();
  var rs = s.indexOf(".");
  if (rs < 0) {
    rs = s.length;
    s += ".";
  }
  while (s.length <= rs + 2) {
    s += "0";
  }
  return s;
}
export function formatWeek(value) {
  if (!value) return null;
  return Number(moment(value).weekYear() + '' + moment(value).weeks())
}

export function getWeekDates(value) {
  if (!value) return null;
  let year = (value + "").substr(0, 4)
  let week = Number((value + "").substr(4, 2))
  return moment(year, 'YYYY').week(week).subtract(1, 'days').format('YYYY-MM-DD') + '至'
    + moment(year, 'YYYY').week(week).add(5, 'days').format('YYYY-MM-DD')
}
export function numberToWeekStr(value) {
  return `${(value + "").substr(0, 4)}年第${(value + "").substr(
    4,
    2
  )}个星期`;
}
export function numberToMonthStr(value) {
  return `${(value + "").substr(0, 4)}年第${(value + "").substr(
    4,
    2
  )}月`;
}
export const shortcuts = [
  {
    text: "最近一周",
    onClick(picker) {
      const end = new Date();
      const startStr = moment().subtract(7, 'days').format('YYYY-MM-DD');
      const start = moment(startStr, 'YYYY-MM-DD').toDate()
      picker.$emit("pick", [start, end]);
    }
  },
  {
    text: "最近一个月",
    onClick(picker) {
      const end = new Date();
      const startStr = moment().subtract(1, 'months').format('YYYY-MM-DD');
      const start = moment(startStr, 'YYYY-MM-DD').toDate()
      picker.$emit("pick", [start, end]);
    }
  },
  {
    text: "最近三个月",
    onClick(picker) {
      const end = new Date();
      const startStr = moment().subtract(3, 'months').format('YYYY-MM-DD');
      const start = moment(startStr, 'YYYY-MM-DD').toDate()
      picker.$emit("pick", [start, end]);
    }
  }
]
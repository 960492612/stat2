<template>
  <div class="productShelveChart">

    <div class="echart-wrapper" ref="echart"></div>
  </div>
</template>
<script>
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/line";
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/legendScroll";
import "echarts/lib/component/dataZoom";
import "common/js/macarons";
import {
  formatTime,
  toDecimal,
  numberToWeekStr,
  numberToMonthStr,
  getWeekDates
} from "common/js/util";
var legendsObj = {
  views: "曝光量",
  pv: "访问量",
  uv: "客户访问数",
  orderNumber: "订单数",
  transform: "转化率"
};
var yAxisIndexArr = {
  views: 0,
  pv: 0,
  uv: 0,
  orderNumber: 1,
  transform: 2
};
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    dateType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      myChart: null,
      xAxis: [],
      yAxis: [
        {
          type: "value",
          splitLine: { show: false },
          // minInterval: 0.01,
          // maxInterval: ,
          name: "数量",
          axisLabel: {
            // formatter: (value, index) => {
            //   return (value * 100).toFixed(0) + "%";
            // }
          },
          axisPointer: {
            snap: true
          }
        }
      ],
      legends: Object.values(legendsObj),
      series: []
    };
  },
  mounted() {
    // this.xAxis = this.setxAxis();
    // this.legends = this.setLegends();

    if (this.data && this.data.length > 0) {
      this.loadChart();
    }
  },
  watch: {
    data(val) {
      if (val.length >= 0) {
        this.loadChart();
      }
    }
  },
  methods: {
    loadChart() {
      this.myChart ||
        (this.myChart = echarts.init(this.$refs.echart, "macarons"));
      // 加载图表
      this.series = this.setSeries();
      this.myChart.setOption(this.setChartOptions(), true, true);
    },
    setSeries() {
      let orderByPlatform = {};
      let Series = [];
      this.yAxis.splice(1);
      this.xAxis = []; //重置
      // 排出系列数据
      this.data.forEach(item => {
        let str = this.dateType == 0 ? item.week : item.month;
        this.xAxis.push(str);
      });
      Object.keys(legendsObj).forEach(legend => {
        if (legend == "orderNumber") {
          this.yAxis.push({
            type: "value",
            splitLine: { show: false },
            // minInterval: 0.01,
            // maxInterval: ,
            name: legendsObj[legend],
            position: "right",
            axisLabel: {
              // formatter: (value, index) => {
              //   return (value * 100).toFixed(0) + "%";
              // }
            },
            axisPointer: {
              snap: true
            }
          });
        }
        if (legend == "transform") {
          this.yAxis.push({
            type: "value",
            splitLine: { show: false },
            // minInterval: 0.01,
            // maxInterval: ,
            offset: 80,
            name: legendsObj[legend],
            position: "right",
            axisLabel: {
              formatter: (value, index) => {
                return value + "%";
              }
            },
            axisPointer: {
              snap: true
            }
          });
        }
        let serie = {
          type: this.xAxis.length > 1 ? "line" : "bar",
          label: {
            normal: {
              show: true,
              position: "top",
              formatter: params => {
                return legend == "transform"
                  ? params.value.toFixed(2) + "%"
                  : params.value;
              }
            }
          },
          // symbolSize: 10,
          legendHoverLink: true,
          smooth: true,
          yAxisIndex: yAxisIndexArr[legend],
          name: legendsObj[legend],
          // stack: 'tiled',
          data: this.data.map(item => {
            return item[legend];
          })
        };
        Series.push(serie);
      });
      return Series;
    },
    setChartOptions() {
      return {
        title: {
          left: "center",
          top: "20px"
          // text: "产品访问数据折线图"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              show: true,
              precision: 0
            }
          }
        },
        xAxis: {
          type: "category",
          name: "日期",
          data: this.xAxis,
          // boundaryGap: false
          axisLabel: {
            formatter: value => {
              return this.dateType == 0
                ? numberToWeekStr(value)
                : numberToMonthStr(value);
            }
          },
          axisPointer: {
            label: {
              formatter: params => {
                return this.dateType == 0
                  ? getWeekDates(params.value)
                  : numberToMonthStr(params.value);
                // return 'haha'
              }
            }
          }
        },
        grid: [
          {
            top: 40,
            width: "80%",
            // bottom: "45%",
            left: "20px",
            containLabel: true
          }
        ],
        legend: {
          type: "scroll",
          data: this.legends,
          orient: "vertical",
          right: 10,
          top: 20,
          bottom: 20,
          icon: "stack",
          width: 100
          //   selected: this.setLegendSelected()
        },
        yAxis: this.yAxis,
        dataZoom: [
          // {
          //   type: "slider",
          //   yAxisIndex: 0,
          //   filterMode: "empty"
          // },
          {
            type: "inside",
            show: true,
            // xAxisIndex: [0],
            start: 0
            // end: this.xAxis.length > 10 ? 50 : 100
          }
        ],
        series: this.series
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.productShelveChart {
  margin-top: 20px;
}
.echart-wrapper {
  height: 550px;
}
</style>

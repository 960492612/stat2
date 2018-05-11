<template>
  <div class="countryLogisticsFee">
    
    <div class="echart-wrapper" ref="echart"></div>
  </div>
</template>
<script>
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/line";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/legendScroll";
import "echarts/lib/component/dataZoom";
import "common/js/macarons";
import { formatTime, toDecimal } from "common/js/util";
export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      }
    },
    months: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      myChart: null,
      legends: [],
      xAxis: null,
      legends: [],
      series: [],
      // contrys: [],
      selectedContry: null,
      prev: 0
    };
  },
  computed: {

  },
  mounted() {
    // this.xAxis = this.setxAxis();
    // this.legends = this.setLegends();
  this.loadChart();
   
  },
  watch: {
    data(val) {
      if (val.length > 0) {
        this.loadChart();
      }
    }
  },
  methods: {
    // getCountrys(){
    //   let byCountry = {}
    //   if(byCountry[this.data['国家']])
    // },
    loadChart() {
      this.prev = 0;
      this.myChart ||
        (this.myChart = echarts.init(this.$refs.echart, "macarons"));
      // 加载图表
      // this.series = this.setSeries();
      this.myChart.setOption(this.setChartOptions(), true, true);
    },

    setChartOptions() {
      return {
        title: {
          left: "center",
          top: "20px",
          text: "前十名sku销量变化"
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
          type: "category"
          // boundaryGap: false
        },
        grid: [
          {
            top: 100,
            width: "80%",
            // bottom: "45%",
            left: "center",
            containLabel: true
          }
        ],
        legend: {
          type: "scroll",
          // data: this.legends,
          orient: "vertical",
          right: 10,
          top: 20,
          bottom: 20,
          icon: "stack",
          width: 100
          //   selected: this.setLegendSelected()
        },
        yAxis: {
          type: "value",
          splitLine: { show: false },
          // minInterval: 0.01,
          // maxInterval: 0.01,
          name: "销量",
          axisLabel: {},
          axisPointer: {
            snap: true,
            label: {}
          }
        },
        dataZoom: [
          // {
          //   type: "slider",
          //   show: true,
          //   // xAxisIndex: [0],
          //   start: 0
          //   // end: this.xAxis.length > 10 ? 50 : 100
          // },
          {
            type: "inside",
            show: true,
            // xAxisIndex: [0],
            start: 0
            // end: this.xAxis.length > 10 ? 50 : 100
          }
        ],
        dataset: {
          // dimensions:['产品名称'].concat(this.months),
          source: [["产品名称"].concat(this.months)].concat(
              this.data.map(item => {
                return [item["产品名称"]].concat(
                  this.months.map(month => {
                    return item[month];
                  })
                );
              })
            ),
          // sourceHeader: false
        },
        series: this.data.map(item => {
          return { type: "line", seriesLayoutBy: "row", label: {show:true} };
        })
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.echart-wrapper {
  height: 750px;
}
.countryLogisticsFee {
  .selectCountry {
    margin-top: 20px;
    text-align: center;
  }
}
</style>

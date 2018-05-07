<template>
  <div class="StatisByMonth">

    <div class="echart-wrapper" ref="echart"></div>

  </div>

</template>
<script>
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/line";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/legendScroll";
import "echarts/lib/component/dataZoom";
import "common/js/macarons";
import { formatTime, getWeekDates, numberToMonthStr, numberToWeekStr } from "common/js/util";
import { getRecordByMonth, getRecordByWeek } from "api/record";
import { mapGetters } from "vuex";
import { roles } from "common/js/config";
export default {
  name: "StatisByMonth",
  props: {
    totalByDate: {
      type: String,
      default: "周"
    }
  },
  data() {
    return {
      data: [],
      selectAdmin: null,
      selectProduct: null
    };
  },
  created() {
    if (this.role == roles["推广员"]) {
      this.selectAdmin = this.id;
    } else {
      this.selectAdmin = this.changeAdmin;
    }
    this.selectProduct = this.changeProduct;

    this._getRecord();
  },
  computed: {
    params() {
      return {
        pid: this.selectProduct,
        owner: this.selectAdmin
      };
    },
    ...mapGetters(["role", "id", "changeAdmin", "changeProduct"])
  },
  watch: {
    changeAdmin(val) {
      this.selectAdmin = val;
      this._getRecord();
    },
    changeProduct(val) {
      this.selectProduct = val;
      this._getRecord();
    },
    totalByDate(){
      this._getRecord()
    }
  },
  methods: {
    _getRecord() {
      this.data = []
      let fn = this.totalByDate == "周" ? getRecordByWeek : getRecordByMonth;
      fn(this.params).then(res => {
        if (res.code == 1) {
          this.data = res.data;
          this.loadChart();
        }
      });
    },
    loadChart() {
      this.myChart ||
        (this.myChart = echarts.init(this.$refs.echart, "macarons"));
      // 加载图表
      this.myChart.setOption(this.setChartOptions(), true, true);
    },
    setChartOptions() {
      return {
        title: {
          left: "center",
          top: "20px",
          text: `阅读量的${this.totalByDate}变化图`
        },
        tooltip: {
          trigger: "item",
          axisPointer: {
            type: "cross",
            label: {
              show: true,
              precision: 0
            }
          }
          // formatter: (params, ticket, callback)=>{
          //     console.log(params);
          //     return
          // }
        },
        xAxis: {
          type: "category",
          name: "日期",
          data: this.data.map(item => {
            return item["年月"];
          }),
          axisLabel: {
            formatter: value => {
              return this.totalByDate == '周'
                ? numberToWeekStr(value)
                : numberToMonthStr(value);
            }
          },
          axisPointer: {
            label: {
              formatter: params => {
                return this.totalByDate == '周'
                  ? getWeekDates(params.value)
                  : numberToMonthStr(params.value);
                // return 'haha'
              }
            }
          },
          boundaryGap: false
        },
        grid: [
          {
            top: 30,
            width: "90%",
            // bottom: "45%",
            left: 10,
            // right: 10,
            containLabel: true
          }
        ],
        // legend: {
        //   type: "scroll",
        //   data: this.legends,
        //   orient: "vertical",
        //   right: 10,
        //   top: 20,
        //   bottom: 20,
        //   icon: "stack",
        //   width: 100,
        //   selected: this.setLegendSelected()
        // },
        yAxis: {
          type: "value",
          splitLine: { show: false },
          //   minInterval: 1,
          name: "阅读量",

          axisPointer: {
            snap: true
          }
        },
        dataZoom: [
          {
            type: "inside",
            show: true,
            // xAxisIndex: [0],
            start: 0
            // end: this.xAxis.length > 10 ? 50 : 100
          }
        ],
        series: {
          type: "line",
          showSymbol: true,
          // stack: "访问数",
          smooth: true,
          label: {
            normal: {
              position: "top",
              show: true
            }
          },
          //   name: data[i].key,
          stack: "tiled",
          data: this.data.map(item => {
            return item.readTotal;
          })
        }
      };
    }
    // setSeries(data) {
    //   let serie = {
    //     type: "line",
    //     showSymbol: true,
    //     // stack: "访问数",
    //     smooth: true,
    //     name: data[i].key,
    //     // stack: 'tiled',
    //     data: Object.values(serieData)
    //   };

    //   return ret;
    // }
  }
};
</script>
<style lang="scss" scoped>
.StatisByMonth {
  margin-top: 20px;
  text-align: left;
  .echart-wrapper {
    height: 700px;
  }
}
</style>

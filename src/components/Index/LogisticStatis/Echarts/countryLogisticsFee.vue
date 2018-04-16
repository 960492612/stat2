<template>
  <div class="countryLogisticsFee">
    <div class="selectCountry">
      <el-tag type="primary">查看国家：</el-tag>
      <el-select v-model="selectedContry" placeholder="选择国家" filterable @change="loadChart" size="medium">
        <el-option v-for="(contry, index) in contrys" :key="index" :value="contry" :label="contry"></el-option>
      </el-select>
    </div>
    <div class="echart-wrapper" ref="echart"></div>
  </div>
</template>
<script>
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/bar";
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
    }
  },
  data() {
    return {
      myChart: null,
      legends: [],
      xAxis: null,
      legends: [],
      series: [],
      contrys: [],
      selectedContry: null,
      prev: 0
    };
  },
  computed: {
    dataInContry() {
      if (!this.selectedContry) {
        return [];
      }
      let ret = [];
      this.data.forEach(item => {
        if (item["国家"] == this.selectedContry) {
          ret.push(item);
        }
      });
      ret.sort((a, b) => {
        return a["月份"] - b["月份"];
      });
      return ret;
    }
  },
  mounted() {
    // this.xAxis = this.setxAxis();
    // this.legends = this.setLegends();

    if (this.data && this.data.length > 0) {
      let byContry = {};
      this.data.forEach(item => {
        if (byContry[item["国家"]] == undefined) {
          byContry[item["国家"]] = 1;
        }
      });
      this.contrys = Object.keys(byContry);
      this.loadChart();
    }
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
      this.prev = 0
      this.myChart ||
        (this.myChart = echarts.init(this.$refs.echart, "macarons"));
      // 加载图表
      this.series = this.setSeries();
      this.myChart.setOption(this.setChartOptions(), true, true);
    },
    setSeries() {
      let serie = {};
      let Series = [];
      this.xAxis = this.dataInContry.map(item => {
        // console.log(item["月份"]);
        return `${(item["月份"] + "").substr(0, 4)}年${(
          item["月份"] + ""
        ).substr(4, 2)}月`;
      });

      serie = {
        type: "bar",
        label: {
          normal: {
            show: true,
            formatter: params => {
              let append = ''
              if(this.prev != 0){
                let delta = params.value - this.prev
                if(delta>0){
                  append = `  变化:增长${(delta*100).toFixed(2)}%`
                }else{
                  append = `  变化:减少${(delta*100).toFixed(2)}%`
                }
              }
              this.prev = params.value
              // console.log(params);
              return (params.value * 100).toFixed(2) + "%" +
              append;
            },
            position: "top"
          }
        },
        // symbolSize: 10,
        legendHoverLink: true,
        smooth: true,
        // name: this,
        // stack: 'tiled',
        barMaxWidth: 50,
        data: this.dataInContry.map(item => {
          return Number((item["物流费"] / item["营业额"]).toFixed(4));
        })
      };
      Series.push(serie);

      return Series;
    },
    setChartOptions() {
      return {
        title: {
          left: "center",
          top: "20px",
          text: (this.selectedContry?this.selectedContry:'某国') + "物流费占比其营业额的变化折线图"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              show: true,
              precision: 0
            }
          },
          formatter: params => {
            let html = `<p>${params[0].name}</p>`;
            params.forEach(item => {
              html += `<p style="line-height:24px;"><span style="display: inline-block;width:12px;height:12px;border-radius:50%;background: ${
                item.color
              }"></span>
              ${(item.value * 100).toFixed(2)}%</p>`;
              // console.log(this.prev);
            });

            // console.log(params);
            return html;
          }
        },
        xAxis: {
          type: "category",
          name: "日期",
          data: this.xAxis
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
        // legend: {
        //   type: "scroll",
        //   data: this.legends,
        //   orient: "vertical",
        //   right: 10,
        //   top: 20,
        //   bottom: 20,
        //   icon: "stack",
        //   width: 100
        //   //   selected: this.setLegendSelected()
        // },
        yAxis: {
          type: "value",
          splitLine: { show: false },
          // minInterval: 0.01,
          // maxInterval: 0.01,
          name: "物流费占比其营业额",
          axisLabel: {
            formatter: (value, index) => {
              return (value * 100).toFixed(0) + "%";
            }
          },
          axisPointer: {
            snap: true,
            label: {
              precision: 2,
              formatter: params => {
                return (params.value * 100).toFixed(2) + "%";
              }
            }
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
        series: this.series
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

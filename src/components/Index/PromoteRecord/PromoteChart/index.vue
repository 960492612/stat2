<template>
    <div>
        <div class="content">
            <div class="echart-wrapper" ref="echart"></div>
        </div>
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
import { getRecordList } from "api/recordByChannel";
import { mapGetters, mapActions } from "vuex";
const yAxisIndexArr = {
  展现量: 0,
  阅读量: 0,
  互动量: 1,
  文章数: 2
  //   "订单数": 3
};
const keyMap = {
  展现量: "showCount",
  阅读量: "readCount",
  互动量: "activeCount",
  文章数: "articleCount"
};
export default {
  data() {
    return {
      data: null
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getRecordList();
    },
    getRecordList() {
      getRecordList({ channel_owner_id: this.id }).then(res => {
        if (res.code == 1) {
          this.data = res.data;
          this.loadChart();
        }
        // console.log(res.data)
      });
    },
    genareterTotalSource(data) {
      let dimensions = ["type"];
      let source = {};

      data.forEach(obj => {
        dimensions.push(obj.time);
        for (let key in keyMap) {
          if (!source[key]) {
            source[key] = [key, obj[keyMap[key]]];
          } else {
            source[key].push(obj[keyMap[key]]);
          }
        }
      });

      return [dimensions, ...Object.values(source)];
    },
    loadChart() {
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
          text: `总数据变化图`
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
            left: "left",
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
        yAxis: [
          {
            type: "value",
            splitLine: { show: false },
            // minInterval: 0.01,
            // maxInterval: 0.01,
            name: "数量",
            axisLabel: {},
            axisPointer: {
              snap: true,
              label: {}
            }
            // axisLine:{
            //   lineStyle:{
            //     color:'#2ec7c9'
            //   }
            // }
          },
          {
            type: "value",
            splitLine: { show: false },
            // minInterval: 0.01,
            // maxInterval: 0.01,
            offset: 160,
            name: "互动量",
            axisLabel: {},
            axisPointer: {
              snap: true,
              label: {}
            },
            axisLine: {
              lineStyle: {
                color: "#5ab1ef"
              }
            }
          },
          {
            type: "value",
            splitLine: { show: false },
            // minInterval: 0.01,
            // maxInterval: 0.01,
            offset: 80,
            name: "文章数",
            axisLabel: {},
            axisPointer: {
              snap: true,
              label: {
                precision: 2
              }
            },
            axisLine: {
              lineStyle: {
                color: "#ffb980"
              }
            }
          },

        //   {
        //     type: "value",
        //     splitLine: { show: false },
        //     // minInterval: 0.01,
        //     // maxInterval: 0.01,
        //     name: "订单数",
        //     axisLabel: {},
        //     axisPointer: {
        //       snap: true,
        //       label: {}
        //     },
        //     axisLine: {
        //       lineStyle: {
        //         color: "#d87a80"
        //       }
        //     }
        //   }
        ],
        dataZoom: [
          {
            type: "inside",
            show: true,
            // xAxisIndex: [0],
            start: 0
          }
        ],
        dataset: {
          //   dimensions: ["月份"].concat(this.legends),
          source: this.genareterTotalSource(this.data)
          // sourceHeader: false
        },
        series: Object.values(yAxisIndexArr).map(item => {
          return {
            type: "line",
            label: { show: true },
            yAxisIndex: item,
            seriesLayoutBy: "row"
          };
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
</style>

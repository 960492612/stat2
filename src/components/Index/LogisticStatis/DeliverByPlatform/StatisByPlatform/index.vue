<template>
    <div class="accountLogisticsFee">

        <div class="echart-wrapper" ref="echart"></div>
        <div class="sum">
            全平台的海外仓发货占比：
            <el-tag type="primary">{{(haiwai/total*100).toFixed(2)+'%'}}</el-tag>
        </div>
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
      total: 0,
      haiwai: 0
    };
  },
  mounted() {
    // this.xAxis = this.setxAxis();
    // this.legends = this.setLegends();

    if (this.data && this.data.length > 0) {
      this.loadChart();
    }
  },
  activated(){
    if (this.data && this.data.length > 0) {
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
    loadChart() {
      this.myChart ||
        (this.myChart = echarts.init(this.$refs.echart, "macarons"));
      // 加载图表
      this.series = this.setSeries();
      this.myChart.setOption(this.setChartOptions(), true, true);
    },
    setSeries() {
      let serie = {};
      let orderByPlatform = {};
      let Series = [];
      this.xAxis = null;
      // 排出系列数据
      this.data.forEach(item => {
        if (orderByPlatform[item["平台"]] == undefined) {
          orderByPlatform[item["平台"]] = [item];
        } else {
          orderByPlatform[item["平台"]].push(item);
        }
      });

      this.legends = Object.keys(orderByPlatform);
      for (let i in orderByPlatform) {
        let data = orderByPlatform[i];
        let orderByMonth = {};

        data.forEach(item => {
          if (orderByMonth[item["月份"]] == undefined) {
            orderByMonth[item["月份"]] = {
              // platform: item["平台"],
              total: Number(item["出货量"]),
              haiwai:
                item["发运仓库"] != "SZ01 [深圳坂田仓]"
                  ? Number(item["出货量"])
                  : 0
            };
          } else {
            // console.log(1);
            // orderByMonth[item["月份"]].data.push(item);
            orderByMonth[item["月份"]]["total"] += Number(item["出货量"]);
            orderByMonth[item["月份"]]["haiwai"] +=
              item["发运仓库"] != "SZ01 [深圳坂田仓]"
                ? Number(item["出货量"])
                : 0;
          }
        });
        // console.log(orderByMonth);
        this.xAxis =
          this.xAxis ||
          Object.keys(orderByMonth).map(item => {
            return `${item.substr(0, 4)}年${item.substr(4, 2)}月`;
          });
       
        let seriesData = Object.values(orderByMonth);
        // 计算总数的占比
        seriesData.forEach(item => {
          this.total += item.total;
          this.haiwai += item.haiwai;
        });
        let serie = {
          type: seriesData.length == 1 ? "bar" : "line",
          label: {
            normal: {
              show: true,
              formatter: params => {
                return (params.value * 100).toFixed(2) + "%";
              },
              position: "top"
            }
          },
          // symbolSize: 10,
          legendHoverLink: true,
          // showSymbol: true,
          // stack: "访问数",
          smooth: true,
          name: i,
          // stack: 'tiled',
          barMaxWidth: 50,
          data: seriesData.map(item => {
            return Number((item.haiwai / item.total).toFixed(4));
          })
        };
        Series.push(serie);
      }
      return Series;
    },
    setChartOptions() {
      return {
        title: {
          left: "center",
          top: "20px",
          text: "各平台海外仓发货占比折线图"
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
              ${item.seriesName}: ${(item.value * 100).toFixed(2)}%</p>`;
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
        yAxis: {
          type: "value",
          splitLine: { show: false },
          // minInterval: 0.01,
          //   maxInterval: 0.01,
          name: "海外仓占比",
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
</style>

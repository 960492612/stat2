<template>
    <div class="echart-wrapper" ref="singleSubjectEchart"></div>
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
import { LegendNames } from "common/js/config";
import { formatTime } from "common/js/util";
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      myChart: null
    };
  },
  mounted() {
    this.myChart = echarts.init(this.$refs.singleSubjectEchart, "macarons");
    this.loadChart();
  },
  methods: {
    loadChart() {
      // 加载图表
      this.myChart.setOption(this.setOptions(this.sortByTime(this.data)), true);
    },
    sortByTime(data){
      for(let key in data){
        data[key].sort((a, b)=>{
          return Number(a.time) - Number(b.time)
        })
      }
      return data
    },
    setOptions(data) {
      let yAxis = [];
      let xAxis = [];
      let series = [];
      let gridIndex = -1;
      let grid = [];
      let title = [];
      let xAxisIndex = [];
      for (let key in data) {
        gridIndex++;
        yAxis.push({
          type: "value",
          gridIndex: gridIndex,
          axisLabel: {
            interval: 0,
            // align: '',
            // width:100,
            fontWeight: "bold",
            fontSize: 12
            // rotate: 30
          },
          splitLine: {
            show: false
          }
        });

        xAxis.push({
          type: "category",
          // max: builderJson.all,
          gridIndex,
          data: data[key].map(obj => {
            return formatTime(obj.time);
          }),
          splitLine: {
            show: false
          }
        });
        xAxisIndex.push(gridIndex);
        grid.push({
          top: 50 + gridIndex * 240,
          height: "200px",
          //   gridIndex,
          width: "80%",
          //   bottom: 800 - 200*gridIndex,
          left: "center",
          containLabel: false
        });
        title.push({
          text: data[key][0].channel,
          // subtext: "总计 " + data.all,
          x: 120,
          top: 15 + gridIndex * 240,
          textAlign: "center"
        });
        series = [
          ...series,
          ...Object.keys(LegendNames).map(_item => {
            return {
              name: LegendNames[_item],
              type: "bar",
              //   stack: key,
              xAxisIndex: gridIndex,
              yAxisIndex: gridIndex,
              barGap: 0,
              barMaxWidth: 50,
              label: {
                normal: {
                  formatter: "{a}: {c}",
                  fontSize: 14,
                  position: "top",
                  show: true
                }
              },
              data: Object.keys(data[key]).map(_key => {
                return data[key][_key][_item];
              })
            };
          })
        ];
      }

      this.$refs.singleSubjectEchart.style.height =
        (gridIndex + 1) * 250 + "px";
      return {
        dataZoom: [
          {
            type: "inside",
            show: true,
            xAxisIndex,
            start: 0,
            end: 100
          }
        ],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        toolbox: {
          show: true,
          orient: "vertical",
          right: "50",
          top: "center",
          feature: {
            // mark: { show: true },
            // dataView: { show: true, readOnly: false },
            // magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        title,
        legend: {
          type: "scroll",
          data: ["阅读量", "点赞量", "评论量", "转发量", "收藏量"],
          orient: "vertical",
          right: 50,
          top: 20,
          // bottom: 20,
          icon: "stack"
          // width:
          // selected: this.setLegendSelected()
        },
        grid,
        xAxis,
        yAxis,
        series
      };
    }
  },
  watch:{
    data(val){
      this.loadChart()
    }
  }
};
</script>
<style lang="scss" scoped>
.echart-wrapper {
  height: 750px;
}
</style>

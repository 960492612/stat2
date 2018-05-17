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
import { getOneLogisticsFee } from "api/logistics";
import { mapGetters } from "vuex";
var yAxisIndexArr = {
  "物流费": 0,
  "订单平均物流费": 1,
  "订单总金额（包含客户运费）": 0,
  "占比": 2,
  "订单数": 3
};
export default {
  props: {
    account: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      myChart: null,
      data: null,
   
      legends: [
        "物流费",
        "订单平均物流费",
        "订单总金额（包含客户运费）",
        "占比",
        "订单数"
      ],
 
    };
  },
  computed: {
    ...mapGetters("logistics", ["begin", "end"])
  },
  mounted() {
    // this.xAxis = this.setxAxis();
    // this.legends = this.setLegends();
    this._getFeeByAccount();
  },
  activated(){
    this._getFeeByAccount();
  },
  watch: {
    // data(val) {
    //   if (val.length > 0) {
    //     this.loadChart();
    //   }
    // },
    begin() {
      this._getFeeByAccount();
    },
    end() {
      this._getFeeByAccount();
    }
  },
  methods: {
    // getCountrys(){
    //   let byCountry = {}
    //   if(byCountry[this.data['国家']])
    // },
    _getFeeByAccount() {
      if (!this.begin) {
        // this.$message.error("请先选择日期");
        // this.loading = 0;
        this.data = []
        return;
      }
      let beginDate = this.begin
        ? Number(formatTime(this.begin.getTime(), "yyyyMM"))
        : null;
      let endDate = this.end
        ? Number(formatTime(this.end.getTime(), "yyyyMM"))
        : null;
      getOneLogisticsFee({ beginDate, endDate, account: this.account }).then(
        res => {
          this.data = this.generaterData(res.data);
          this.loadChart();
        }
      );
    },
    generaterData(data){
      return data.map(item=>{
        for(let key in item){
          if(key == '月份'){
            continue
          }
          if(!isNaN(item[key])){
            // console.log(item[key]);
            item[key] = toDecimal(item[key])
          }
        }
        return item
      })
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
          text: `${this.account}物流数据变化图`
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
            },
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
            name: "平均订单物流费",
            axisLabel: {},
            axisPointer: {
              snap: true,
              label: {}
            },
            axisLine:{
              lineStyle:{
                
                 color:'#b6a2de'
              }
            }
          },
          {
            type: "value",
            splitLine: { show: false },
            minInterval: 0.01,
            // maxInterval: 0.01,
            offset: 80,
            name: "物流费占比",
            axisLabel: {},
            axisPointer: {
              snap: true,
              label: {
                precision: 2
              }
            },
            axisLine:{
              lineStyle:{
                color:'#ffb980',
              }
            }
          },
          
          {
            type: "value",
            splitLine: { show: false },
            // minInterval: 0.01,
            // maxInterval: 0.01,
            name: "订单数",
            axisLabel: {},
            axisPointer: {
              snap: true,
              label: {}
            },
            axisLine:{
              lineStyle:{
                color:'#d87a80'
              }
            }
          }
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
          dimensions: ["月份"].concat(this.legends),
          source: this.data
          // sourceHeader: false
        },
        series: this.legends.map(item => {
          return { type: "line", label: { show: true },yAxisIndex: yAxisIndexArr[item]};
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

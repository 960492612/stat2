<template>
  <div>
    <div class="select-box">
      <!-- <label for="" class="label">{{$t('search.label.sd')}}：</label> -->
      <el-select v-model="selectAdmin" placeholder="选择推广员" filterable clearable @change="changeAdminMethod" :loading="getAdminOptions" size="medium" v-if="!isPromoter">
        <el-option v-for="item in admins" :key="item.id" :value="item.id" :label="item.name">{{item.name}}</el-option>
      </el-select>
      <el-date-picker v-model="selectDate" type="daterange" size="medium" :start-placeholder="$t('search.placeholder.start')" :end-placeholder="$t('search.placeholder.end')" @change="changeDateMethod">
      </el-date-picker>
    </div>
    <div class="echart-wrapper" ref="productEchart"></div>
  </div>

</template>
<script>
import { getRecords } from "api/record";
import { getAdmins } from "api/account";
import { LegendNames, roles } from "common/js/config";
import { formatTime, isInDateRange } from "common/js/util";
import { mapGetters } from "vuex";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/legendScroll";
import "echarts/lib/component/dataZoom";
import "common/js/macarons";
var waterMarkText = "FireBee";
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = canvas.height = 100;
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.globalAlpha = 0.08;
ctx.font = "20px Microsoft Yahei";
ctx.translate(50, 50);
ctx.rotate(-Math.PI / 4);
ctx.fillText(waterMarkText, 0, 0);

var productNums = 0;
export default {
  data() {
    return {
      admins: [],
      getAdminOptions: true,
      loadStatus: 1,
      selectDate: null,
      selectAdmin: null,
      selectProduct: null,
      selectTopChannels: null,
      selectSubChannels: null,
      totalData: [],
      groupData: [],
      myChart: null
    };
  },
  created() {
    if (this.role == 6) {
      this.selectAdmin = this.id;
    }
    this._getRecords();
    this._getAdmins();
  },
  activated() {
    if (this.role == 6) {
      this.selectAdmin = this.id;
    }
    this._getRecords();
    this._getAdmins();
  },
  mounted() {
    this.myChart = echarts.init(this.$refs.productEchart, "macarons");
  },
  computed: {
    params() {
      return {
        owner: this.selectAdmin,
        pid: this.selectProduct,
        cids: this.selectTopChannels
          ? this.selectTopChannels
          : this.selectSubChannels
      };
    },
    isPromoter() {
      return this.role == roles["推广员"];
    },
    ...mapGetters(["id", "role"])
  },
  methods: {
    _getRecords() {
      getRecords({
        params: this.params,
        date: {
          begin: this.selectDate ? this.selectDate[0].getTime() : null,
          end: this.selectDate ? this.selectDate[1].getTime() : null
        }
      }).then(this.getRecordsCallback);
    },
    _getAdmins() {
      getAdmins({ role: roles["推广员"] }).then(res => {
        if (res.code == 1) {
          this.admins = res.data;
          this.getAdminOptions = false;
        }
      });
    },
    getRecordsCallback(res) {
      this.totalData = [];
      if (res.code == 1) {
        if (res.data.length == 0) {
          this.loadStatus = 0;
          return;
        }
        this.totalData = res.data
        
        this.loadChart();
      } else {
        this.loadStatus = 0;
      }
    },
    
    loadChart() {
      // 加载图表
      this.myChart.setOption(
        this.setOptions(this.getTotalByProduct(this.totalData)),
        true
      );
      // this.myChart.resize();
      window.addEventListener("resize", () => {
        if (this.$route.name == "StatisByProduct") {
          this.myChart.resize();
        }
      });
    },
    getTotalByProduct(data) {
      let countByProduct = {};
      data.forEach(item => {
        if (countByProduct[item.product] == undefined) {
          // console.log(item.readCount);
          countByProduct[item.product] = {
            readCount: item.readCount,
            thumbsCount: item.thumbsCount,
            commontCount: item.commontCount,
            relayCount: item.relayCount,
            showCount: item.showCount
          };
        } else {
          for (let key in countByProduct[item.product]) {
            countByProduct[item.product][key] += item[key] ;
          }
        }
      });
      return countByProduct;
    },
    changeDateMethod(value) {
      this._getRecords();
    },
    setOptions(data) {
      return {
        backgroundColor: {
          type: "pattern",
          image: canvas,
          repeat: "repeat"
        },
        dataZoom: [
          {
            type: "inside",
            show: true,
            yAxisIndex: [0],
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
        title: [
          {
            text: "各产品的各项数据统计量",
            // subtext: "总计 " + data.all,
            x: 120,
            y: 20,
            textAlign: "center"
          }
        ],
        legend: {
          type: "scroll",
          data: ["阅读量", "点赞量", "评论量", "转发量", "收藏量"],
          // orient: "",
          left: "center",
          top: 50,
          // bottom: 20,
          icon: "stack"
          // width:
          // selected: this.setLegendSelected()
        },
        grid: [
          {
            top: 100,
            width: "90%",
            // bottom: "45%",
            left: 10,
            containLabel: true
          },
          {
            top: "55%",
            width: "50%",
            bottom: 0,
            left: 10,
            containLabel: true
          }
        ],
        xAxis: [
          {
            type: "value",
            // max: builderJson.all,
            splitLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: "category",
            data: Object.keys(data),
            axisLabel: {
              interval: 0,
              fontWeight: "bold",
              fontSize: 15
              // rotate: 30
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: Object.keys(LegendNames).map(item => {
          return {
            name: LegendNames[item],
            type: "bar",
            barGap: 0,
            label: {
              normal: {
                position: "right",
                show: true
              }
            },
            data: Object.keys(data).map(key => {
              return data[key][item];
            })
          };
        })
      };
    },
    changeAdminMethod(value) {
      this.selectAdmin = value;
      this._getRecords();
    }
  }
};
function sortByTime(a, b) {
  return Number(b.time) - Number(a.time);
}
</script>

<style lang="scss" scoped>
.echart-wrapper {
  height: 650px;
}
.select-box {
  margin-top: 20px;
  text-align: left;
  padding-left: 30px;
}
</style>

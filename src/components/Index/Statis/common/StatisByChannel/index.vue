<template>
  <div>
    <div class="select-box">
      <el-select v-model="selectAdmin" placeholder="选择推广员" filterable clearable @change="changeAdminMethod" :loading="getAdminOptions" size="medium" v-if="!isPromoter">
        <el-option v-for="item in admins" :key="item.id" :value="item.id" :label="item.name">{{item.name}}</el-option>
      </el-select>

      <el-select v-model="selectProduct" placeholder="选择产品" filterable clearable @change="changeProductMethod" :loading="getProductOptions" size="medium" class="select">
        <el-option v-for="item in products" :key="item.id" :value="item.id" :label="item.name">{{item.name}}</el-option>
      </el-select>
      <el-select v-model="selectCountType" placeholder="选择查看数据类型" size="medium" align="left" class="select">
        <el-option v-for="(item,index) in CountTypeNames" :key="index" :value="item.name" :label="item.label">{{item.label}}</el-option>
      </el-select>

      <!-- <label for="" class="label">{{$t('search.label.sd')}}：</label> -->
      <el-date-picker v-model="selectDate" type="daterange" size="medium" :start-placeholder="$t('search.placeholder.start')" :end-placeholder="$t('search.placeholder.end')" @change="changeDateMethod">
      </el-date-picker>
    </div>
    <div class="echart-wrapper" ref="channelEchart"></div>
  </div>
</template>
<script>
import { getRecords } from "api/record";
import { formatTime, isInDateRange } from "common/js/util";
import { mapGetters } from "vuex";
import { getAdmins } from "api/account";
import { getProducts } from "api/product";
import { roles } from "common/js/config";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/pie";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/legendScroll";
// import "echarts/lib/component/dataZoom";
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

// 数据对应名字
const CountTypeNames = {
  readCount: "阅读量",
  thumbsCount: "点赞量",
  commontCount: "评论量",
  relayCount: "转发量",
  showCount: "收藏量"
};
export default {
  data() {
    return {
      loadStatus: 1,
      admins: [],
      products: [],
      selectDate: null,
      selectAdmin: null,
      selectProduct: null,
      selectTopChannels: null,
      selectSubChannels: null,
      myChart: null,
      totalData: [],
      groupData: [],
      selectCountType: "readCount",
      channelNums: 0,
      getAdminOptions: true,
      getProductOptions: true,
      CountTypeNames: [
        {
          name: "readCount",
          label: "阅读量"
        },
        { name: "thumbsCount", label: "点赞量" },
        { name: "commontCount", label: "评论量" },
        { name: "relayCount", label: "转发量" },
        { name: "showCount", label: "收藏量" }
      ]
    };
  },
  created() {
    if (this.isPromoter) {
      this.selectAdmin = this.id;
    }
    this._getRecords();
    this._getAdmins();
    this._getProducts();
  },
  activated() {
    if (this.isPromoter) {
      this.selectAdmin = this.id;
    }
    this._getRecords();
    this._getAdmins();
  },
  mounted() {
    this.myChart = echarts.init(this.$refs.channelEchart, "macarons");
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
      getRecords(this.params).then(this.getRecordsCallback);
    },
    _getAdmins() {
      getAdmins({ role: roles["推广员"] }).then(res => {
        if (res.code == 1) {
          this.admins = res.data;
          this.getAdminOptions = false;
        }
      });
    },
    _getProducts() {
      getProducts().then(res => {
        if (res.code == 1) {
          this.products = res.data;
          this.getProductOptions = false;
        }
      });
    },
    getRecordsCallback(res) {
      this.totalData = [];
      if (res.code == 1) {
        if (res.data.length == 0) {
          this.loadStatus = 0;
        } else {
          this.totalData = this.getRecentestRecordBySid(
            this.groupBySid(res.data)
          );
        }
      } else {
        this.loadStatus = 0;
      }
      this.loadChart();
    },
    // 按主题分组
    groupBySid(data) {
      let groupBySid = {};
      data.forEach(item => {
        if (groupBySid[item.subjectId] == undefined) {
          groupBySid[item.subjectId] = [item];
        } else {
          groupBySid[item.subjectId].push(item);
        }
      });
      return groupBySid;
    },
    getRecentestRecordBySid(data) {
      let ret = [];
      for (let key in data) {
        // data[key].sort(sortByTime);
        this.groupData.push(data[key]);
        if (this.selectDate) {
          if (
            isInDateRange(
              this.selectDate[0],
              this.selectDate[1],
              new Date(Number(data[key][0].startTime))
            )
          ) {
            ret.push(data[key][0]);
          }
        } else {
          ret.push(data[key][0]);
        }
      }
      return ret;
    },
    loadChart() {
      this.TotalByChannel = this.getTotalByChannel(this.totalData);
      //   console.log(channelNums * 50 );

      // 加载图表
      this.myChart.setOption(this.setOptions(this.TotalByChannel), true);
      this.myChart.resize();
      //   监听窗口事件
      window.addEventListener("resize", () => {
        if (this.$route.name == "StatisByChannel") {
          this.myChart.resize();
        }
      });
    },
    getTotalByChannel(data) {
      let countByChannel = {};
      let countByTopChannel = {};
      this.channelNums = 0;
      data.forEach(item => {
        if (countByChannel[item.channel] === undefined) {
          countByChannel[item.channel] = this.getCountObj(item);
          // 记录有几个渠道
          this.channelNums++;
        } else {
          for (let key in countByChannel[item.channel]) {
            countByChannel[item.channel][key] += item[key];
          }
        }

        // 顶级渠道
        if (countByTopChannel[item.pChannel] === undefined) {
          countByTopChannel[item.pChannel] = this.getCountObj(item);
        } else {
          for (let key in countByTopChannel[item.pChannel]) {
            countByTopChannel[item.pChannel][key] += item[key];
          }
        }
      });
      //   设置高度
      this.$refs.channelEchart.style.height =
        (this.channelNums * 60 < 750 ? 750 : this.channelNums * 60) + "px";
      return { countByChannel, countByTopChannel };
    },
    getCountObj(obj) {
      return {
        readCount: obj.readCount,
        thumbsCount: obj.thumbsCount,
        commontCount: obj.commontCount,
        relayCount: obj.relayCount,
        showCount: obj.showCount
      };
    },
    setOptions(data) {
      return {
        backgroundColor: {
          type: "pattern",
          image: canvas,
          repeat: "repeat"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },

        toolbox: {
          show: true,
          orient: "vertical",
          right: "20",
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
            text: `各渠道的${CountTypeNames[this.selectCountType]}比例图`,
            // subtext: "总计 " + data.all,
            x: 120,
            y: 20,
            textAlign: "center"
          }
        ],
        legend: {
          type: "scroll",
          data: Object.keys(data.countByChannel),
          orient: "vertical",
          right: 20,
          top: "20%",
          // bottom: 20,
          icon: "stack",
          width: 50,
          //   height: 500,
          borderRadius: 4
          // selected: this.setLegendSelected()
        },
        series: [
          {
            name: CountTypeNames[this.selectCountType],
            type: "pie",
            selectedMode: "single",
            radius: ["50%", "65%"],
            center: ["50%", "55%"],
            label: {
              normal: {
                formatter: "{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ",
                backgroundColor: "#eee",
                borderColor: "#aaa",
                borderWidth: 1,
                borderRadius: 4,
                rich: {
                  a: {
                    color: "#999",
                    lineHeight: 22,
                    align: "center"
                  },
                  hr: {
                    borderColor: "#aaa",
                    width: "100%",
                    borderWidth: 0.5,
                    height: 0
                  },
                  b: {
                    fontSize: 14,
                    lineHeight: 33
                  },
                  per: {
                    color: "#eee",
                    backgroundColor: "#334455",
                    padding: [2, 4],
                    borderRadius: 2
                  }
                }
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            data: Object.keys(data.countByChannel).map(key => {
              return {
                name: key,
                value: data.countByChannel[key][this.selectCountType]
              };
            })
          },
          {
            name: CountTypeNames[this.selectCountType],
            type: "pie",
            selectedMode: "single",
            radius: [0, "40%"],
            center: ["50%", "55%"],
            label: {
              normal: {
                position: "inner"
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: Object.keys(data.countByTopChannel).map(key => {
              return {
                name: key,
                value: data.countByTopChannel[key][this.selectCountType]
              };
            })
          }
        ]
      };
    },
    changeDateMethod(value) {
      this._getRecords();
    },
    changeProductMethod(value) {
      this.selectProduct = value;
      this._getRecords();
    },
    changeAdminMethod(value) {
      this.selectAdmin = value;
      this._getRecords();
    }
  },
  watch: {
    selectCountType(oldval, newval) {
      if (oldval == newval) return;
      // 加载图表
      this.myChart.setOption(this.setOptions(this.TotalByChannel), true);
    }
  }
};
</script>

<style lang="scss" scoped>
.select-box {
  margin-top: 20px;
  text-align: left;
  padding-left: 35px;
}
</style>

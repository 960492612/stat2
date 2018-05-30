<template>
  <div class="SkuInfoTable">
    <div class="search-box">
      <el-autocomplete v-model="selectSku" placeholder="输入sku进行查找" :fetch-suggestions="findSKus" @select="handleSelect" size="medium"></el-autocomplete>
      <!-- <el-tag type="primary" v-if="this.data.length>0">{{this.data[0]['产品代码']}}</el-tag> -->
      <el-tag type="primary" v-if="this.data.length>0">{{this.data[0]['产品名称']}}</el-tag>
      <el-select v-model="selectPlatform" placeholder="筛选平台" size="medium" clearable multiple collapse-tags>
        <el-option v-for="(item, index) in platforms" :key="index" :value="item.name" :label="item.name">{{item.name}}</el-option>
      </el-select>
      <label for="">分组统计：</label>

      <el-checkbox-group v-model="groupList" style="display: inline-block;height: auto;overflow:inherit;">
        <el-checkbox label="平台" border size="medium"></el-checkbox>
        <el-checkbox label="账户" border size="medium"></el-checkbox>
        <el-checkbox label="国家" border size="medium"></el-checkbox>
        <el-checkbox label="时间" border size="medium"></el-checkbox>
      </el-checkbox-group>
      <label for="">输入过滤阀值：</label>
      <el-input placeholder="填写整数" v-model.number="filterNumber" size="medium" style="width:60px;">
      </el-input>
      <json-excel class="btn btn-default" :data="groupData" :fields="json_fields" :name="xlsName" v-if="groupData" style="display:inline-block;">
        <el-button type="success" icon="el-icon-download" size="medium">
          导出Excel
        </el-button>
      </json-excel>
    </div>
    <div class="content">
      <el-table :data="groupData" max-height="650" :style='style' class="table">
        <div slot="empty">
          <i class="el-icon-loading" v-show="loadStatus == 1"></i> {{loadingText}}
        </div>
        <el-table-column label="平台" prop="平台" width="200" align="center" v-if="showColumn('平台')"></el-table-column>
        <el-table-column label="账户" prop="账户" width="100" align="center" v-if="showColumn('账户')"></el-table-column>
        <el-table-column label="国家" prop="国家" width="150" align="center" v-if="showColumn('国家')"></el-table-column>
        <el-table-column label="时间" prop="时间" align="center" v-if="showColumn('时间')" width="200" :formatter="timeFormatter"></el-table-column>
        <el-table-column label="销售数量" prop="销售数量" width="200" align="center" sortable></el-table-column>
        <!-- <el-table-column label="操作" align="center"></el-table-column> -->
      </el-table>
      <div class="echart">
        <div class="echart-wrapper" ref="echart"></div>
      </div>

    </div>

  </div>
</template>

<script>
import { getSkuInfoByAccount, findSkus } from "api/logistics";
import { mapGetters } from "vuex";
import { logisticsMixin } from "../../common/mixin";
import { numberToMonthStr } from "common/js/util";
import { getPlatforms } from "api/store";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/pie";
import "echarts/lib/chart/line";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/legendScroll";
import "echarts/lib/component/dataZoom";
import "common/js/macarons";
import JsonExcel from "vue-json-excel";
export default {
  mixins: [logisticsMixin],
  props: {
    sku: {
      type: String,
      default: ""
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
      data: [],
      groupList: ["平台", "账户"],
      myChart: null,
      platforms: [],
      selectPlatform: [],
      selectSku: null,
      dimensions: [],
      source: [],
      series: null,
      filterNumber: 20
    };
  },
  computed: {
    groupData() {
      if (this.data.length <= 0) {
        return [];
      }
      let ret = {};
      // let fieldIndex = this.groupList.length - 1
      let temp = JSON.parse(JSON.stringify(this.data));
      temp.forEach(item => {
        if (
          (this.selectPlatform.length == 0 ||
          this.selectPlatform.some(platform => {
            return platform == item["平台"];
          }))&&(this.filterNumber<= item["销售数量"])
        ) {
          let key = "";
          this.groupList.forEach(group => {
            key += item[group];
          });
          if (ret[key] == undefined) {
            ret[key] = item;
            ret[key]["销售数量"] = Number(ret[key]["销售数量"]);
          } else {
            ret[key]["销售数量"] += Number(item["销售数量"]);
          }
        }
      });
      return Object.values(ret);
    },
    style() {
      let width =
        Number(this.showColumn("平台")) * 200 +
        Number(this.showColumn("账户")) * 100 +
        Number(this.showColumn("国家")) * 150 +
        Number(this.showColumn("时间")) * 200 +
        200 +
        "px";
      return {
        flex: "0 0 " + width
      };
    },
    json_fields() {
      let ret = {};
      this.groupList.concat("销售数量").forEach(item => {
        ret[item] = item;
      });
      return ret;
    },
    xlsName() {
      return this.selectSku + ".xls";
    },

    isSelectTime() {
      return this.showColumn("时间");
    },
    ...mapGetters("logistics", ["begin", "end"])
  },
  mounted() {
    //   this._getSkuInfoByAccount()
    this.init();
  },
  activated() {
    this.init();
  },
  watch: {
    groupData(newVal) {
      if (newVal.length > 0) {
        this.$nextTick(() => {
          this.source = this.getSource();
          this.series = this.getSeries();
          this.loadChart();
        });
      }
    }
  },
  components: {
    JsonExcel
  },
  methods: {
    init() {
      this._getPlatforms();
      if (this.sku) {
        this.selectSku = this.sku;
        this.searchDataByDate();
      }
    },
    _getPlatforms() {
      getPlatforms().then(res => {
        if (res.code == 1) {
          this.platforms = res.data;
        }
      });
    },
    showColumn(name) {
      let res = this.groupList.find(item => {
        return item == name;
      });

      return !!res;
    },
    searchDataByDate() {
      let isOk = this.transformDate();
      if (!isOk) {
        return;
      }
      if (!this.selectSku) {
        return;
      }
      let { beginDate, endDate } = isOk;
      this.loadStatus == 1;

      getSkuInfoByAccount({ beginDate, endDate, sku: this.selectSku }).then(
        res => {
          if (res.code == 1) {
            if (res.data.length == 0) {
              this.loadStatus = 0;
              return;
            }
            //   this.origin = JSON.parse(JSON.stringify(res.data));
            this.data = res.data;

            this.$nextTick(() => {
              this.source = this.getSource();
              this.series = this.getSeries();
              this.loadChart();
            });
          } else {
            this.loadStatus = 0;
          }
        }
      );
    },

    timeFormatter(row) {
      return numberToMonthStr(row["时间"]);
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
          top: "20px"
          // text: "前十名sku销量变化"
        },
        tooltip: this.isSelectTime
          ? {
              trigger: "axis",
              axisPointer: {
                type: "cross",
                label: {
                  show: true,
                  precision: 0
                }
              }
            }
          : {
              trigger: "item",
              formatter: params => {
                // console.log(params.value.split(','));
                return `${params.name} : ${
                  (params.value + "").split(",")[1]
                } (${params.percent}%)`;
              }
            },
        toolbox: {
          show: true,
          left: "50",
          top: "20",
          feature: {
            // dataZoom: {
            //   yAxisIndex: "none"
            // },
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: { show: true }
          }
        },
        grid: [
          {
            top: 100,
            width: "100%",
            // bottom: "45%",
            left: 0,
            containLabel: true
          }
        ],
        legend: {
          type: "scroll",
          // data: this.legends,
          // orient: "vertical",
          // right: 10,
          // top: 20,
          left: 10,
          bottom: 0,
          icon: "stack",
          width: "80%"
          //   selected: this.setLegendSelected()
        },
        xAxis: this.isSelectTime ? { type: "category" } : null,
        yAxis: this.isSelectTime ? {} : null,
        dataset: {
          dimensions: this.isSelectTime
            ? ["时间"].concat(this.dimensions)
            : null,

          source: this.source
          // sourceHeader: false
        },
        series: this.series
      };
    },
    findSKus(query, cb) {
      findSkus(query).then(res => {
        if (res.code == 1) {
          cb(res.data);
        }
      });
    },
    getSource() {
      if (this.isSelectTime) {
        let temp = JSON.parse(JSON.stringify(this.groupData));
        let serie = {};
        temp.forEach(item => {
          let key = "";
          this.groupList.forEach(group => {
            if (group == "时间") {
              key += "";
            } else {
              key += item[group] + " ";
            }
          });
          for (let month of this.months) {
            if (Number(item["时间"]) == Number(month)) {
              if (serie[month]) {
                serie[month][key] = item["销售数量"];
              } else {
                serie[month] = { [key]: item["销售数量"] };
              }
            }
          }
        });
        let ret = [];
        let length = 0;
        // 取最长的
        this.months.forEach(month => {
          let keys = Object.keys(serie[month]);
          console.log(length);
          if (keys.length > length) {
            length = keys.length;
            this.dimensions = keys;
          }
        });

        for (let key in serie) {
          ret.push({ ...{ 时间: key }, ...serie[key] });
        }
        return ret;
      } else {
        // 饼图的dataset
        return this.groupData.map(item => {
          let key = "";
          this.groupList.forEach(group => {
            key += item[group] + " ";
          });
          return [key, item["销售数量"]];
        });
      }
    },
    getSeries() {
      if (this.isSelectTime) {
        return this.dimensions.map(item => {
          return { type: "line", label: { show: true } };
        });
      } else {
        return {
          type: "pie",
          label: {
            show: true
          },
          center: ["45%", "55%"]
        };
      }
    },
    handleSelect(sku) {
      this.searchDataByDate();
    }
  }
};
</script>

<style lang="scss">
.SkuInfoTable {
  .content {
    display: flex;
    // flex-wrap: wrap;
  }
  .table {
    // float: left;
  }
  .echart {
    flex: 1;
    .echart-wrapper {
      height: 650px;
    }
  }
}
</style>


<template>
  <div class="contryLogisticsFee">
    <div class="searchBox">
      <el-tag type="primary">选择月份范围(查询单月只需选择起始月)：</el-tag>
      <el-date-picker v-model="beginDate" type="month" placeholder="选择起始月" size="medium" :editable="false"></el-date-picker> -
      <el-date-picker v-model="endDate" type="month" placeholder="选择结束月" size="medium" :editable="false"></el-date-picker>
      <el-button type="primary" @click="searchDataByDate" size="medium">查找</el-button>
      <el-button type="info" class="toggleEchart" size="medium" plain @click="toggleEchart">切换图表显示</el-button>
    </div>
    <div class="table" v-if="!isShowChart">
      <el-table :data="data" @row-click="rowClick" ref="table" height="750" show-summary :summary-method="getSummaries">
        <div slot="empty">
          <i class="el-icon-loading" v-show="loadStatus == 1"></i> {{loadingText}}</div>

        <el-table-column label="国家" prop="国家" width="200" class-name="column"></el-table-column>
        <el-table-column label="营业额" prop="营业额" width="220" class-name="column" :formatter="keetInt"></el-table-column>
        <el-table-column label="总物流费" prop="物流费" width="230" :formatter="toDecimal1" class-name="column"></el-table-column>
        <el-table-column label="物流费占比营业额" prop="物流费占比营业额" width="230" :formatter="toPercentByCountry" class-name="column"></el-table-column>
        <el-table-column label="发货包裹数" prop="发货包裹数" width="230" :formatter="keetInt" class-name="column"></el-table-column>

        <el-table-column label="包裹单价" prop="包裹单价" :formatter="getTotalAvgFee" class-name="column"></el-table-column>
      </el-table>
    </div>
    <CountLogisticsChart :data="origin" v-if="isShowChart"></CountLogisticsChart>
  </div>
</template>
<script>
import { getCountryLogisticsFee } from "api/logistics";
import { formatTime, toDecimal } from "common/js/util";
// import { LogisticsKey } from "common/js/config";
import CountLogisticsChart from "../Echarts/countryLogisticsFee";
export default {
  data() {
    return {
      beginDate: null,
      endDate: null,
      data: null,
      origin: null,
      loadStatus: -1,
      isShowChart: false
      //   logisticsKey: LogisticsKey
    };
  },
  computed: {
    loadingText() {
      return this.loadStatus == 1
        ? this.$t("data.loading")
        : this.$t("data.none");
    }
  },
  components: {
    CountLogisticsChart
  },
  methods: {
    
    searchDataByDate() {
      if (!this.beginDate) {
        this.$message.error("请先选择日期");
        // this.loading = 0;
        return;
      }
      let beginDate = this.beginDate
        ? Number(formatTime(this.beginDate.getTime(), "yyyyMM"))
        : null;
      let endDate = this.endDate
        ? Number(formatTime(this.endDate.getTime(), "yyyyMM"))
        : null;
      this.loadStatus = 1;
      if (endDate && beginDate > endDate) {
        this.$message.error("起始日期不可大于结束日期");
        // this.loading = 0;
        return;
      }
      getCountryLogisticsFee(beginDate, endDate).then(res => {
        if (res.code == 1) {
          if (res.data.length == 0) {
            this.loadStatus = 0;
            return;
          }
          this.origin = JSON.parse(JSON.stringify(res.data));
          this.data = this.genater(res.data);
        } else {
          this.loadStatus = 0;
        }
      });
    },
    genater(data) {
      let ret = {};
      data.forEach(item => {
        if (ret[item["国家"]] == undefined) {
          ret[item["国家"]] = {
            国家: item["国家"],
            营业额: item["营业额"],
            物流费: item["物流费"],
            发货包裹数: item["发货包裹数"]
          };
        } else {
          ret[item["国家"]]["营业额"] += item["营业额"];
          ret[item["国家"]]["物流费"] += item["物流费"];
          ret[item["国家"]]["发货包裹数"] += item["发货包裹数"];
        }
      });
      return Object.values(ret);
    },
    rowClick(row) {
      // this.$refs.table.toggleRowExpansion(row);
    },
    toWord() {
      return "";
    },
    keetInt(row, column, vlaue) {
      return Math.round(vlaue);
    },
    toDecimal1(row, column,value) {
      return toDecimal(value);
    },
    toPercentByAccount(row, column, value) {
      return toDecimal(value * 100) + "%";
    },
    toPercentByCountry(row, column) {
      return toDecimal(row["物流费"] / row["营业额"] * 100) + "%";
    },
    getTotalAvgFee(row) {
      return toDecimal(row["物流费"] / row["发货包裹数"]);
    },
    toggleEchart() {
      if (!this.beginDate) {
        this.$message.info("请先选择时间");
        return;
      }
      this.isShowChart = !this.isShowChart;
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
          return;
        }
        if (column.property == "国家" || column.property == "物流费占比营业额" || column.property == "包裹单价" ) {
          return;
        }
        const values = data.map(item => {
          return Number(item[column.property]);
        });
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          // sums[index] += " 次";
        } else {
          // sums[index] = "";
        }
      });
      sums[3] = (sums[2] / sums[1]).toFixed(3) * 100 + '%'
      sums[5] = toDecimal(sums[2] / sums[4])
      sums[1] = Math.round(sums[1])
      sums[2] = toDecimal(sums[2])
      return sums;
    }
  }
};
</script>
<style lang="scss">
.contryLogisticsFee {
  margin-top: 20px;
  text-align: left;
  .searchBox {
    text-align: left;
  }
  .table{
    margin-left: 20px;
  }
  .el-table__expanded-cell[class*="cell"] {
    padding: 10px 40px 10px 50px;
    // background: rgba(30, 179, 216, 0.233);
  }
  // .column {
  //   font-weight: bold;
  //   padding: 5px;
  //   font-size: 15px;
  //   .cell {
  //     font-weight: bold;
  //   }
  // }
  .expend-column {
    padding: 8px 5px;
    color: #666;
    // background: rgba(30, 179, 216, 0.233);
  }
  .toggleEchart {
    //   text-align: right;
    float: right;
  }
}
</style>


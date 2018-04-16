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
            <el-table :data="data" @row-click="rowClick" ref="table" show-summary :summary-method="getSummaries">
                <div slot="empty">
                    <i class="el-icon-loading" v-show="loadStatus == 1"></i> {{loadingText}}</div>

                <el-table-column label="发运仓库" prop="发运仓库" width="300" class-name="column"></el-table-column>
                <el-table-column :label="item" :prop="item" width="220" class-name="column" v-for="(item, index) in platforms" :key="index" align="center"></el-table-column>
                <el-table-column label="合计" prop="发运仓库" :formatter="getSumByWare" class-name="column" align="center"></el-table-column>
            </el-table>
        </div>
        <DeliverByplatform :data="origin" v-if="isShowChart"></DeliverByplatform>
    </div>
</template>
<script>
import { getDeliverByPlatform } from "api/logistics";
import { formatTime, toDecimal } from "common/js/util";
// import { LogisticsKey } from "common/js/config";
import DeliverByplatform from "../Echarts/deliverByplatform";
export default {
  data() {
    return {
      beginDate: null,
      endDate: null,
      data: null,
      origin: null,
      loadStatus: -1,
      isShowChart: false,
      platforms: []
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
    DeliverByplatform
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
      getDeliverByPlatform(beginDate, endDate).then(res => {
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
      let orderByWaleHouse = {};
      let platforms = {};
      data.forEach(item => {
        if (orderByWaleHouse[item["发运仓库"]] == undefined) {
          orderByWaleHouse[item["发运仓库"]] = [item];
        } else {
          orderByWaleHouse[item["发运仓库"]].push(item);
        }
        if (platforms[item["平台"]] == undefined) {
          platforms[item["平台"]] = 1;
        }
      });
      //   console.log(platforms);
      this.platforms = Object.keys(platforms);

      let ret = [];
      for (let house in orderByWaleHouse) {
        let orderByPlatform = {};
        orderByWaleHouse[house].forEach(item => {
          if (orderByPlatform[item["平台"]] == undefined) {
            orderByPlatform[item["平台"]] = Number(item["出货量"]);
          } else {
            orderByPlatform[item["平台"]] += Number(item["出货量"]);
          }
        });
        ret.push({ ...{ 发运仓库: house }, ...orderByPlatform });
      }
      return ret;
    },
    rowClick(row) {
      // this.$refs.table.toggleRowExpansion(row);
    },
    toggleEchart() {
      if (!this.beginDate) {
        this.$message.info("请先选择时间");
        return;
      }
      this.isShowChart = !this.isShowChart;
    },
    getSumByWare(row) {
      let ret = 0;
      for (let key in row) {
        if (!isNaN(row[key])) {
          ret += Number(row[key]);
        }
      }
      return ret;
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
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
      sums[sums.length] = sums.reduce((pre, cur) => {
        const value = Number(cur);
        if (!isNaN(value)) {
          return pre + cur;
        } else {
          return pre;
        }
      }, 0);
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
  .table {
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


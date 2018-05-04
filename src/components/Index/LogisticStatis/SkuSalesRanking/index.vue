<template>
  <div class="SkuSalesRanking">
    <div class="searchBox">
      <el-tag type="primary">选择月份范围(查询单月只需选择起始月)：</el-tag>
      <el-date-picker v-model="beginDate" type="month" placeholder="选择起始月" size="medium" :editable="false"></el-date-picker> -
      <el-date-picker v-model="endDate" type="month" placeholder="选择结束月" size="medium" :editable="false"></el-date-picker>
      <el-button type="primary" @click="searchDataByDate" size="medium">查找</el-button>
      <!-- <el-button type="info" class="toggleEchart" size="medium" plain @click="toggleEchart">切换图表显示</el-button> -->
    </div>
    <div class="table" v-if="!isShowChart">
      <el-table :data="data" ref="table" height="750" show-summary :cell-class-name="keyShow">
        <div slot="empty">
          <i class="el-icon-loading" v-show="loadStatus == 1"></i> {{loadingText}}</div>

        <el-table-column label="SKU" prop="产品代码" width="200" class-name="column"></el-table-column>
        <el-table-column label="产品名称" prop="产品名称" width="350" class-name="column"></el-table-column>
        <el-table-column label="品类" prop="品类" width="200" class-name="column" :filters="type" filter-placement="bottom-end" :filter-method="filterHandler"></el-table-column>
        <el-table-column :label="item" :prop="item" width="220" class-name="column" v-for="(item, index) in months" :key="index" align="center"></el-table-column>
        <el-table-column label="环比" width="230" :formatter="getHuanBi" class-name="column" align="center"></el-table-column>

      </el-table>
    </div>
    <!-- <CountLogisticsChart :data="origin" v-if="isShowChart"></CountLogisticsChart> -->
  </div>
</template>
<script>
import { getSKURanking } from "api/logistics";
import { formatTime, toDecimal } from "common/js/util";
// // import { LogisticsKey } from "common/js/config";
// import CountLogisticsChart from "../Echarts/countryLogisticsFee";
export default {
  data() {
    return {
      beginDate: null,
      endDate: null,
      data: null,
      origin: null,
      loadStatus: -1,
      isShowChart: false,
      type: [],
      months: []
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
    // CountLogisticsChart
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
      // 动态创建月份字段
      this.selectedMonths();
      getSKURanking(beginDate, endDate).then(res => {
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
      let orderByProduct = {};
      let orderByType = {};
      data.forEach(item => {
        if (orderByProduct[item["产品代码"]] == undefined) {
          orderByProduct[item["产品代码"]] = [item];
        } else {
          orderByProduct[item["产品代码"]].push(item);
        }
        if (orderByType[item["品类"]] == undefined) {
          orderByType[item["品类"]] = {
            text: item["品类"],
            value: item["品类"]
          };
        }
      });
      this.type = Object.values(orderByType);
      let ret = Object.values(orderByProduct).map(item => {
        let orderByMonth = {};
        item.forEach(_item => {
          if (orderByMonth[_item["月份"] + ""] == undefined) {
            orderByMonth[_item["月份"] + ""] = Number(_item["数量"]);
          }
        });
        return { ...item[0], ...orderByMonth };
      });

      return ret;
    },
    selectedMonths() {
      // 一个月的
      if (!this.endDate) {
        this.months = [formatTime(this.beginDate.getTime(), "yyyyMM")];
        return;
      }
      // 时间段的
      let beginY = this.beginDate.getFullYear();
      let endY = this.endDate.getFullYear();
      let endM = this.endDate.getMonth() + 1;
      let beginM = this.beginDate.getMonth() + 1;
      let monthCount =
        endY == beginY
          ? endM - beginM + 1
          : (endY - beginY) * 12 - (beginM - 1) + endM;
      // console.log(monthCount);
      let months = [];
      for (let i = 0; i < monthCount; i++) {
        let deltaY = (beginM + i) / 12 > 1 ? ((beginM + i) / 12) | 0 : 0;
        months.push(
          (beginY + deltaY) * 100 +
            (deltaY > 0
              ? (beginM + i) % 12 == 0 ? 12 : (beginM + i) % 12
              : beginM + i) +
            ""
        );
      }
      // console.log(months);
      this.months = months;
    },
    getHuanBi(row, column, value) {
      let length = this.months.length;
      if (length <= 1) {
        return "";
      }
      let result =
        (row[this.months[length - 1]] - row[this.months[length - 2]]) /
        row[this.months[length - 2]] *
        100;
      
      return result.toFixed(2) + "%";
    },
    keyShow(item) {
      if (item.columnIndex != Object.keys(item.row).length - 3) return "";
      let length = this.months.length;
      if (length <= 1) {
        return "";
      }
      let result =
        (item.row[this.months[length - 1] + ""] -
          item.row[this.months[length - 2] + ""]) /
        item.row[this.months[length - 2] + ""] *
        100;
      if (result >= 10) {
        return "keyShow";
      } else {
        return "";
      }
    },
    toggleEchart() {
      if (!this.beginDate) {
        this.$message.info("请先选择时间");
        return;
      }
      this.isShowChart = !this.isShowChart;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      // console.log(value);
      return row[property] == value;
    }
  }
};
</script>
<style lang="scss">
.SkuSalesRanking {
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
  .keyShow {
    font-weight: bold;
    color: red;
  }
  .big {
    .cell {
      font-weight: bold;
      color: red;
    }
  }
  .el-checkbox-group {
    height: 500px;
    overflow-y: scroll;
  }
}
</style>


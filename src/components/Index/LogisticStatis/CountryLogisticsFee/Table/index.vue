<template>
    <div class="table">
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
</template>

<script>
import { formatTime, toDecimal } from "common/js/util";
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    loadStatus: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
    //   loadStatus: -1
    };
  },
  computed: {
    loadingText() {
      return this.loadStatus == 1
        ? this.$t("data.loading")
        : this.$t("data.none");
    }
  },
  methods: {
    rowClick(row) {
      // this.$refs.table.toggleRowExpansion(row);
    },
    toWord() {
      return "";
    },
    keetInt(row, column, vlaue) {
      return Math.round(vlaue);
    },
    toDecimal1(row, column, value) {
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
        if (
          column.property == "国家" ||
          column.property == "物流费占比营业额" ||
          column.property == "包裹单价"
        ) {
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
      sums[3] = (sums[2] / sums[1]).toFixed(3) * 100 + "%";
      sums[5] = toDecimal(sums[2] / sums[4]);
      sums[1] = Math.round(sums[1]);
      sums[2] = toDecimal(sums[2]);
      return sums;
    }
  }
};
</script>

<style>
</style>

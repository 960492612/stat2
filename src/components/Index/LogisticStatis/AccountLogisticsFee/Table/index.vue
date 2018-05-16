<template>
    <div class="table">
        <el-table :data="data" @row-click="rowClick" ref="table">
            <div slot="empty">
                <i class="el-icon-loading" v-show="loadStatus == 1"></i> {{loadingText}}</div>
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-table :data="props.row.children" style="width:100%;background:#eee;" :show-header="false">
                        <el-table-column label="平台" prop="平台" width="150" class-name="expend-column" :formatter="toWord"></el-table-column>
                        <el-table-column label="账户别名" prop="账户别名" width="220" class-name="expend-column"></el-table-column>
                        <el-table-column label="订单总金额(包含客户运费)" prop="订单总金额（包含客户运费）" width="230" :formatter="keetInt" class-name="expend-column"></el-table-column>
                        <el-table-column label="物流费" prop="物流费" width="230" :formatter="keetInt" class-name="expend-column"></el-table-column>
                        <el-table-column label="订单平均物流费" prop="订单平均物流费" width="230" :formatter="getTotalAvgFee" class-name="expend-column"></el-table-column>
                        <el-table-column label="物流费占比营业额" prop="占比" :formatter="toPercentByAccount" class-name="expend-column"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button @click.native.prevent="seeInfo(scope.row)" type="text">
                                    查看详情
                                </el-button>

                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column label="平台" prop="平台" width="150" class-name="column"></el-table-column>
            <el-table-column label="账户别名" prop="账户别名" width="220" class-name="column"></el-table-column>
            <el-table-column label="订单总金额(包含客户运费)" prop="订单总金额（包含客户运费）" width="230" :formatter="keetInt" class-name="column"></el-table-column>
            <el-table-column label="物流费" prop="物流费" width="230" :formatter="keetInt" class-name="column"></el-table-column>
            <el-table-column label="订单平均物流费" prop="订单平均物流费" width="230" :formatter="getTotalAvgFee" class-name="column"></el-table-column>
            <el-table-column label="物流费占比营业额" prop="占比" :formatter="toPercentByPlatform" class-name="column"></el-table-column>
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
    }
  },
  data(){
      return {
           loadStatus: -1,
      }
  },
  computed: {
    loadingText() {
      return this.loadStatus == 1
        ? this.$t("data.loading")
        : this.$t("data.none");
    }
    // ...mapGetters("logistics", ["begin", "end"])
  },

  methods: {
    rowClick(row) {
      this.$refs.table.toggleRowExpansion(row);
    },
    toWord() {
      return "";
    },
    keetInt(row, column, vlaue) {
      return Math.round(vlaue);
    },
    toPercentByAccount(row, column, value) {
      return toDecimal(value * 100) + "%";
    },
    toPercentByPlatform(row, column) {
      return (
        toDecimal(row["物流费"] / row["订单总金额（包含客户运费）"] * 100) + "%"
      );
    },
    getTotalAvgFee(row) {
      return Math.round(row["物流费"] / row["订单数"]);
    },
    seeInfo(){}
  }
};
</script>

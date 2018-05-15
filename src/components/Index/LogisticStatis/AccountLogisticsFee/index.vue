<template>
    <div class="accountLogisticsFee">
        <div class="searchBox">
            <el-tag type="primary">选择月份范围(查询单月只需选择起始月)：</el-tag>
            <el-date-picker v-model="beginDate" type="month" placeholder="选择起始月" size="medium" :editable="false"></el-date-picker>-
            <el-date-picker v-model="endDate" type="month" placeholder="选择结束月" size="medium" :editable="false"></el-date-picker>
            <el-button type="primary" @click="searchDataByDate" size="medium">查找</el-button>
            <el-button type="info" class="toggleEchart" size="medium" plain @click="toggleEchart">切换图表显示</el-button>
        </div>
        <div class="table" v-if="!isShowChart">
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
        <AccountLogisticsChart :data="origin" v-if="isShowChart"></AccountLogisticsChart>
    </div>
</template>
<script>
import { getAccountLogisticsFee } from "api/logistics";
import { formatTime, toDecimal } from "common/js/util";
// import { LogisticsKey } from "common/js/config";
import AccountLogisticsChart from '../Echarts/accountLogisticsFee'
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
  components:{
      AccountLogisticsChart
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
      this.loadStatus == 1;
      if (endDate && beginDate > endDate) {
        this.$message.error("起始日期不可大于结束日期");
        // this.loading = 0;
        return;
      }
      getAccountLogisticsFee(beginDate, endDate).then(res => {
        if (res.code == 1) {
          if (res.data.length == 0) {
            this.origin = []
            this.data = []
            this.loadStatus = 0;
            return;
          }
          this.origin = JSON.parse(JSON.stringify(res.data))
          this.data = this.genater(res.data);
        } else {
          this.loadStatus = 0;
        }
      });
    },
    genater(data) {
      let ret = {};
      data.forEach(item => {
        if (ret[item["平台"]] == undefined) {
          ret[item["平台"]] = {
            ...item,
            ...{ children: [item] }
          };
          ret[item["平台"]]["账户别名"] = "";
        } else {
          ret[item["平台"]]["订单总金额（包含客户运费）"] +=
            item["订单总金额（包含客户运费）"];
          ret[item["平台"]]["物流费"] += item["物流费"];
          ret[item["平台"]]["订单数"] += item["订单数"];
          let length = ret[item["平台"]].children.length;
        //   各月份数据叠加
          if (
            ret[item["平台"]].children[length - 1]["账户别名"] ==
            item["账户别名"]
          ) {
            ret[item["平台"]].children[length - 1][
              "订单总金额（包含客户运费）"
            ] +=
              item["订单总金额（包含客户运费）"];
            ret[item["平台"]].children[length - 1]["物流费"] += item["物流费"];
            ret[item["平台"]].children[length - 1]["订单数"] += item["订单数"];
          } else {
            ret[item["平台"]].children.push(item);
          }
        }
      });
      return Object.values(ret);
    },
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
    toggleEchart(){
      if(!this.beginDate){
        this.$message.info('请先选择时间')
        return
      }
        this.isShowChart = !this.isShowChart
    }
  }
};
</script>
<style lang="scss">
.accountLogisticsFee {
  margin-top: 20px;
  text-align: left;
  .searchBox {
    text-align: left;
  }
  .el-table__expanded-cell[class*="cell"] {
    padding: 10px 40px 10px 50px;
    // background: rgba(30, 179, 216, 0.233);
  }
  .column {
    font-weight: bold;
    padding: 5px;
    font-size: 15px;
    .cell {
      font-weight: bold;
    }
  }
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


<template>
  <div class="accountLogisticsFee">
    <search-date />
    <el-tabs v-model="activeTab">
      <el-tab-pane label="总表" name="first">
        <my-table :data="data" v-if="activeTab == 'first'" @seeInfo="seeInfo" :loadStatus="loadStatus"></my-table>
      </el-tab-pane>
      <el-tab-pane label="总物流费占比" name="second">
        <AccountLogisticsChart :data="origin" v-if="activeTab == 'second'"></AccountLogisticsChart>
      </el-tab-pane>
      <el-tab-pane label="单个账户物流费" name="third">
        <fee :account="currentAccount" v-if="activeTab == 'third'" />
      </el-tab-pane>

    </el-tabs>

  </div>
</template>
<script>
import { getAccountLogisticsFee } from "api/logistics";
import { formatTime, toDecimal } from "common/js/util";
// import { LogisticsKey } from "common/js/config";
import AccountLogisticsChart from "./Rate";
import myTable from "./Table";
import SearchDate from "../common/searchDate";
import Fee from "./Fee";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      // beginDate: null,
      // endDate: null,
      data: null,
      origin: null,
      activeTab: "first",
      currentAccount: "A1",
      loadStatus: -1
      //   logisticsKey: LogisticsKey
    };
  },
  computed: {
    loadingText() {
      return this.loadStatus == 1
        ? this.$t("data.loading")
        : this.$t("data.none");
    },
    ...mapGetters("logistics", ["begin", "end"])
  },
  components: {
    AccountLogisticsChart,
    SearchDate,
    myTable,
    Fee
  },
  mounted() {
    this.searchDataByDate();
    // console.log(this['begin']);
  },
  activated() {
    this.searchDataByDate();
  },
  watch: {
    begin() {
      this.searchDataByDate();
    },
    end() {
      this.searchDataByDate();
    }
  },
  methods: {
    transformDate() {
      if (!this.begin) {
        return false;
      }
      let beginDate = this.begin
        ? Number(formatTime(this.begin.getTime(), "yyyyMM"))
        : null;
      let endDate = this.end
        ? Number(formatTime(this.end.getTime(), "yyyyMM"))
        : null;
      
      if (endDate && beginDate > endDate) {
        this.$message.error("起始日期不可大于结束日期");
        // this.loading = 0;
        return false;
      }
      return {beginDate, endDate}
    },
    searchDataByDate() {
      let isOk = this.transformDate()
      if(!isOk){
        return
      }
      let {beginDate, endDate} = isOk
      this.loadStatus == 1;
      getAccountLogisticsFee(beginDate, endDate).then(res => {
        if (res.code == 1) {
          if (res.data.length == 0) {
            this.origin = [];
            this.data = [];
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

    seeInfo(row) {
      this.activeTab = "third";
      this.currentAccount = row["账户别名"];
      // this.$router.push({
      //   path: `/logisticStatis/accountLogisticsFee/fee/${row["账户别名"]}`
      // });
    },
    seeRateInfo() {
      this.$router.push({
        name: "Rate",
        params: { data: 1 }
      });
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


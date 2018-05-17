<template>
  <div class="contryLogisticsFee">

    <search-date />
    <el-tabs v-model="activeTab">
      <el-tab-pane label="总表" name="first">
        <my-table :data="data" v-if="activeTab == 'first'" @seeInfo="seeInfo" :loadStatus="loadStatus"></my-table>
      </el-tab-pane>
      <el-tab-pane label="国家物流费变化图" name="second">
        <CountLogisticsChart :data="origin" v-if="activeTab == 'second'"></CountLogisticsChart>

      </el-tab-pane>
      <!-- <el-tab-pane label="单个账户物流费" name="third">
        <fee :account="currentAccount" v-if="activeTab == 'third'"/>
      </el-tab-pane> -->

    </el-tabs>
  </div>
</template>
<script>
import { getCountryLogisticsFee } from "api/logistics";
// import { LogisticsKey } from "common/js/config";
import { formatTime } from "common/js/util";
import CountLogisticsChart from "./Fee";
import MyTable from "./Table";
import SearchDate from "../common/searchDate";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
     
      data: null,
      origin: null,
      activeTab: "first",
      loadStatus: -1
      //   logisticsKey: LogisticsKey
    };
  },
  computed: {
    
    ...mapGetters("logistics", ["begin", "end"])
  },
  components: {
    CountLogisticsChart,
    MyTable,
    SearchDate
  },
  mounted(){
     this.searchDataByDate();
    // console.log(this['begin']);
  },
  activated(){
     this.searchDataByDate();
  },
  watch:{
    begin() {
      this.searchDataByDate();
    },
    end() {
      this.searchDataByDate();
    }
  },
  methods: {
    searchDataByDate() {
      if (!this.begin) {
        // this.$message.error("请先选择日期");
        // this.loading = 0;
        return;
      }
      let beginDate = this.begin
        ? Number(formatTime(this.begin.getTime(), "yyyyMM"))
        : null;
      let endDate = this.end
        ? Number(formatTime(this.end.getTime(), "yyyyMM"))
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
    seeInfo(){}
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


<template>
  <div class="contryLogisticsFee">

    <search-date />
    <el-tabs v-model="activeTab">
      <el-tab-pane label="总表" name="first">
        <my-table :data="data" v-if="activeTab == 'first'" :loadStatus="loadStatus" :platforms="platforms"></my-table>
      </el-tab-pane>
      <el-tab-pane label="各平台海外仓发货占比" name="second">
        <DeliverByplatform :data="origin" v-if="activeTab == 'second'"></DeliverByplatform>
      </el-tab-pane>

    </el-tabs>

  </div>
</template>
<script>
import { getDeliverByPlatform } from "api/logistics";
// import { formatTime, toDecimal } from "common/js/util";
// import { LogisticsKey } from "common/js/config";
import MyTable from "./Table";
import SearchDate from "../common/searchDate";
import DeliverByplatform from "./StatisByPlatform";
import { logisticsMixin } from "../common/mixin";
export default {
  mixins: [logisticsMixin],
  data() {
    return {
      activeTab: "first",
      platforms: []
      //   logisticsKey: LogisticsKey
    };
  },
  computed: {},
  components: {
    DeliverByplatform,
    MyTable,
    SearchDate
  },
  methods: {
    searchDataByDate() {
      let isOk = this.transformDate();
      if (!isOk) {
        return;
      }
      let { beginDate, endDate } = isOk;
      this.loadStatus == 1;
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


<template>
  <div class="SkuSalesRanking">
    <search-date />
    <el-tabs v-model="activeTab">
      <el-tab-pane label="总表" name="first">
        <my-table :data="data" v-if="activeTab == 'first'" :loadStatus="loadStatus" :months="months" :type="type" @seeInfo="seeInfo"></my-table>
      </el-tab-pane>
      <el-tab-pane label="前十名sku数据变化图" name="second">
        <SkuRanking :data="top10Data" :months="months" v-if="activeTab == 'second'"></SkuRanking>
      </el-tab-pane>
      <el-tab-pane label="sku销售详情" name="third">
        <sku-info-table :sku="currentSku" :months="months"  v-if="activeTab == 'third'"/>
      </el-tab-pane>

    </el-tabs>

  </div>
</template>
<script>
import { getSKURanking } from "api/logistics";
import { formatTime } from "common/js/util";
import SkuRanking from "./TopSkuStatis";
import MyTable from "./Table";
import SkuInfoTable from './SkuInfoTable'
import SearchDate from "../common/searchDate";
import { logisticsMixin } from "../common/mixin";
export default {
  mixins: [logisticsMixin],
  data() {
    return {
      type: [],
      months: [],
      currentSku: ''
      //   logisticsKey: LogisticsKey
    };
  },
  computed: {
    top10Data() {
      if(!this.data||this.data.length<=0){
        return []
      }
      return this.data.slice(0, 10);
    }
  },
  components: {
    SkuRanking,
    SearchDate,
    MyTable,
    SkuInfoTable
  },
  methods: {
    searchDataByDate() {
      let isOk = this.transformDate();
      if (!isOk) {
        return;
      }
      let { beginDate, endDate } = isOk;
      this.loadStatus == 1;
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
      if (!this.end) {
        this.months = [formatTime(this.begin.getTime(), "yyyyMM")];
        return;
      }
      // 时间段的
      let beginY = this.begin.getFullYear();
      let endY = this.end.getFullYear();
      let endM = this.end.getMonth() + 1;
      let beginM = this.begin.getMonth() + 1;
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
    seeInfo(row){
      this.activeTab = "third";
      this.currentSku = row["产品代码"];
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


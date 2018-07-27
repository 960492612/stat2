<template>
  <div class="FangkuanResult">
    
    <div class="content">
      <el-table :data="part" v-loading="loading" max-height="650" element-loading-text="拼命加载中">
        <el-table-column label="订单号" prop="订单号" header-align="center" align="center"></el-table-column>
        <el-table-column label="账户" prop="账户" header-align="center" align="center"></el-table-column>
        <el-table-column label="店铺" prop="店铺" header-align="center" align="center"></el-table-column>
        <el-table-column label="代号" prop="code" header-align="center" align="center"></el-table-column>
        <el-table-column label="资金表放款数" prop="资金表放款数" header-align="center" align="center"></el-table-column>
        <el-table-column label="放款表放款数" prop="放款表放款数" header-align="center" align="center"></el-table-column>
        <el-table-column label="资金表货币" prop="资金表货币" header-align="center" align="center"></el-table-column>
        <el-table-column label="放款表货币" prop="放款表货币" header-align="center" align="center"></el-table-column>
        <el-table-column label="汇率" prop="rate" header-align="center" align="center"></el-table-column>
        <el-table-column label="资金表时间" prop="资金表时间" header-align="center" align="center"></el-table-column>
        <el-table-column label="入账账户" prop="入账账户" header-align="center" align="center"></el-table-column>
        <el-table-column label="订单总金额" prop="订单总金额" header-align="center" align="center"></el-table-column>
        <el-table-column label="联盟佣金扣除" prop="联盟佣金扣除" header-align="center" align="center"></el-table-column>
        <el-table-column label="平台佣金扣除" prop="平台佣金扣除" header-align="center" align="center"></el-table-column>
      </el-table>
    </div>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="20" layout="total, prev, pager, next" :total="result.length">
    </el-pagination>
  </div>
</template>
<script>
import { getFangkuanHuiZong } from "api/finance";
import { toDecimal, formatTime } from "common/js/util";
import JsonExcel from "vue-json-excel";
export default {
  data() {
    return {
      time: null,
      result: [],
      loading: false,
      currentPage:1
    };
  },
  computed: {
    xlsName() {
      if (!this.time) {
        return "汇总表";
      }
      return `${formatTime(this.time.getTime(), "yyyy年MM月")}放款汇总表.xls`;
    },
    json_fields() {
      if (this.result.length <= 0) {
        return {};
      }
      let ret = {};
      Object.keys(this.result[0]).forEach(item => {
        ret[item] = item;
      });
      return ret;
    },
    part() {
      return this.result.slice((this.currentPage-1)*20, this.currentPage*20);
    }
  },
  watch:{
    result(newVal){
      this.$emit('resultChange', {result: newVal, xlsName: this.xlsName, fields: this.fields})
    }
  },
  methods: {
    loadData(time){
      this.time = time
      this.getFangkuanHuiZong()
    },
    getFangkuanHuiZong() {
      this.loading = true;
      getFangkuanHuiZong({
        year: this.time.getFullYear(),
        month: this.time.getMonth() + 1
      }).then(res => {
        if (res.code == 1) {
          this.result = this.sort(res.data);
          this.loading = false;
        }
      });
    },
    sort(data) {
      data = data.map(item => {
        if (item["资金表货币"] == "美元" && item["账户"] == "速卖通") {
          item["code"] = "B2";
        } else {
          item["code"] = "B4";
        }
        return item;
      });
      return data.sort((a, b) => {
        return a["店铺"].match(/(\d+)/g)[0] - b["店铺"].match(/(\d+)/g)[0];
      });
    },
    handleSizeChange(){},
    handleCurrentChange(index){

    }
  }
};
</script>
<style lang="scss" scoped>
.FangkuanResult {
  margin-top: 20px;
  text-align: left;
}
</style>

<template>
  <div class="FangkuanResult">
    <div class="search">
      <el-date-picker v-model="time" placeholder="选择月份" type="month"></el-date-picker>
      <el-button type="primary" @click="getFangkuanHuiZong" size="medium">搜索</el-button>
      <json-excel class="btn btn-default" :data="result" :fields="json_fields" :name="xlsName" v-if="result&&result.length>0" style="display:inline-block;">
        <el-button type="success" icon="el-icon-download" size="medium">
          导出Excel
        </el-button>
      </json-excel>
    </div>
    <div class="content">
      <el-table :data="result" v-loading="loading" max-height="650" element-loading-text="拼命加载中">
        <el-table-column label="订单号" prop="订单号" header-align="center" align="center"></el-table-column>
        <el-table-column label="账户" prop="账户" header-align="center" align="center"></el-table-column>
        <el-table-column label="店铺" prop="店铺" header-align="center" align="center"></el-table-column>
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
      loading: false
    };
  },
  computed:{
    xlsName() {
      if (!this.time) {
        return "汇总表";
      }
      return `${formatTime(this.time.getTime(), "yyyy年MM月")}放款汇总表.xls`;
    },
    json_fields(){
      if (this.result.length<=0) {
        return {}
      }
      let ret = {}
      Object.keys(this.result[0]).forEach(item=>{
        ret[item] = item
      })
      return ret
    }
  },
  components: {
    JsonExcel
  },
  methods: {
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
      return data.sort((a, b) => {
        return a["店铺"].match(/(\d+)/g)[0] - b["店铺"].match(/(\d+)/g)[0];
      });
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

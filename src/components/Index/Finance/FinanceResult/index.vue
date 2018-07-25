<template>
  <div class="FinanceResult">
    <div class="search">
      <el-date-picker v-model="time" placeholder="选择月份" type="month"></el-date-picker>
      <el-button type="primary" @click="getZiJinHuiZong" size="medium">搜索</el-button>
      <json-excel class="btn btn-default" :data="result" :fields="json_fields" :name="xlsName" v-if="result&&result.length>0" style="display:inline-block;">
        <el-button type="success" icon="el-icon-download" size="medium">
          导出Excel
        </el-button>
      </json-excel>
    </div>
    <div class="content">
      <el-table :data="result" v-loading="loading" max-height="650" element-loading-text="拼命加载中">
        <el-table-column label="name" prop="name" header-align="center" align="center"></el-table-column>
        <!-- <el-table-column label="账户" prop="账户" header-align="center" align="center"></el-table-column>
        <el-table-column label="店铺" prop="店铺" header-align="center" align="center"></el-table-column>
        <el-table-column label="货币" prop="货币" header-align="center" align="center"></el-table-column> -->
        <el-table-column label="放款净额" prop="放款净额" header-align="center" align="center"></el-table-column>
        <el-table-column label="退款净额" prop="退款净额" header-align="center" align="center"></el-table-column>
        <el-table-column label="提现" prop="提现" header-align="center" align="center"></el-table-column>
        <el-table-column label="代扣" prop="代扣" header-align="center" align="center"></el-table-column>
        <el-table-column label="手续费" prop="手续费" header-align="center" align="center"></el-table-column>
        <el-table-column label="赔付卖家" prop="赔付卖家" header-align="center" align="center"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getZiJinHuiZong } from "api/finance";
import { toDecimal, formatTime } from "common/js/util";
import JsonExcel from "vue-json-excel";
export default {
  data() {
    return {
      time: null,
      result: [],
      loading: false,
      
    };
  },
  computed:{
    xlsName() {
      if (!this.time) {
        return "汇总表";
      }
      return `${formatTime(this.time.getTime(), "yyyy年MM月")}资金汇总表.xls`;
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
  components:{
    JsonExcel
  },
  methods: {
    getZiJinHuiZong() {
      this.loading = true;
      getZiJinHuiZong({
        year: this.time.getFullYear(),
        month: this.time.getMonth() + 1
      }).then(res => {
        if (res.code == 1) {
          this.loading = false;
          this.result = this.sort(res.data);
        }
      });
    },
    sort(data) {
      // 保留两位小数
      data = data.map(item => {
        for (let key in item) {
          if (!isNaN(item[key])) {
            item[key] = toDecimal(item[key]);
          }
        }
        item['name'] = item['店铺']+item['账户']+item['货币']
        return item;
      });
      return data.sort((a, b) => {
        return a["店铺"].match(/(\d+)/g)[0] - b["店铺"].match(/(\d+)/g)[0];
      });
    },
    numberFormat(row) {}
  }
};
</script>
<style lang="scss" scoped>
.FinanceResult {
  margin-top: 20px;
  text-align: left;
}
</style>

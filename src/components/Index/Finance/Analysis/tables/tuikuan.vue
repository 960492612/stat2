<template>
  <div class="FinanceResult">
    
    <div class="content">
      <el-table :data="result" v-loading="loading" max-height="650" element-loading-text="拼命加载中">
        <el-table-column label="name" prop="name" header-align="center" align="center"></el-table-column>
        <el-table-column label="订单号" prop="订单号" header-align="center" align="center"></el-table-column>
        <el-table-column label="时间" prop="时间" header-align="center" align="center"></el-table-column>
        <el-table-column label="退款总额" prop="退款总额" header-align="center" align="center"></el-table-column>
        <el-table-column label="明细" prop="明细" header-align="center" align="center"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getTuikuan } from "api/finance";
import { toDecimal, formatTime } from "common/js/util";

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
      return `${formatTime(this.time.getTime(), "yyyy年MM月")}退款汇总表.xls`;
    },
    fields(){
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
  watch:{
    result(newVal){
      this.$emit('resultChange', {result: newVal, xlsName: this.xlsName, fields: this.fields})
    }
  },
  // components:{
  //   JsonExcel
  // },
  methods: {
    loadData(time){
      this.time = time
      this.getTuikuan()
    },
    getTuikuan() {
      this.loading = true;
      getTuikuan({
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

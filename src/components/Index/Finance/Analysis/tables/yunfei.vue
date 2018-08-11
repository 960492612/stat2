<template>
  <div class="FinanceResult">
    
    <div class="content">
      <el-table :data="result" v-loading="loading" max-height="650" element-loading-text="拼命加载中">
        <el-table-column label="账户" prop="账户" header-align="center" align="center" width="200"></el-table-column>
        <el-table-column label="店铺" prop="店铺" header-align="center" align="center" width="200"></el-table-column>
        <el-table-column label="货币" prop="货币" header-align="center" align="center" width="200"></el-table-column>
        <el-table-column label="订单号" prop="订单号" header-align="center" align="center"></el-table-column>
        <el-table-column label="时间" prop="时间" header-align="center" align="center"></el-table-column>
        <el-table-column label="运费" prop="运费" header-align="center" align="center"></el-table-column>
        
      </el-table>
    </div>
  </div>
</template>
<script>
import { getYunfei } from "api/finance";
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
      return `${formatTime(this.time.getTime(), "yyyy年MM月")}运费汇总表.xls`;
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
      this.getData()
    },
    getData() {
      this.loading = true;
      getYunfei({
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
      // data = data.map(item => {
      //   item['name'] = item['店铺']+item['账户']+item['货币']
      //   return item;
      // });
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

<template>
  <div class="summary">
    <div class="search-tool">
      <span class="label1">选择日期段查询该段时间的访问总{{isPv?'':'人'}}数:</span>

      <el-date-picker v-model="dateRange" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
      </el-date-picker>

      <el-select v-model="selectedKey" filterable placeholder="选择推广条目" class="select">
        <el-option v-for="(item, index) in datas" :key="index" :value="item.key" :label="item.key"></el-option>
      </el-select>

      <span class="label2">总数:</span>
      <el-tag type="success" class="tip">
        {{result}}{{isPv?'次':'人'}}</el-tag>

    </div>
  </div>
</template>
<script>
import { formatTime,shortcuts ,isInDateRange} from "common/js/util";
export default {
  props: {
    datas: {
      type: Array,
      default: []
    },
    type:{
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dateRange: null,
      selectedKey: "",
      pickerOptions: {
        shortcuts
      }
    };
  },
  computed: {
    result() {
      let ret = 0
       this.datas.forEach(item => {
        if (item.key == this.selectedKey) {
          if (!this.dateRange) {
            // 没有选择日期就返回全部
            ret = Object.values(item.data).reduce((total, num) => {
              return total + num;
            });
          } else {
            let start = this.dateRange[0]
            let end = this.dateRange[1]
            
            Object.entries(item.data).forEach(_item => {
              // 选择在日期区间段的
              if(isInDateRange(start, end, new Date(_item[0]))){
                ret += _item[1]
              }
            });
          }
        }
      });
      return ret
    },
    isPv(){
      return this.type == 'pv'
    }
  },
  methods:{
    
  }
};
</script>
<style lang="scss" scoped>
.summary {
  border-top: 1px solid #eee;
  margin-top: 25px;
  padding-top: 25px;
  .search-tool {
    padding-left: 20px;
    .label1 {
      font-size: 14px;
      margin-right: 15px;
    }
    .label2 {
      font-size: 14px;
      margin-left: 15px;
    }
    .tip {
      margin-left: 5px;
    }
    .select {
      width: 135px;
    }
  }
}
</style>


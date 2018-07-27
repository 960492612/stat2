<template>
    <div class="search">
        <el-date-picker v-model="time" placeholder="选择月份" type="month"></el-date-picker>
        <el-button type="primary" @click="search" size="medium">搜索</el-button>
        <json-excel class="btn btn-default" :data="result" :fields="fields" :name="xlsName" v-if="result&&result.length>0" style="display:inline-block;">
            <el-button type="success" icon="el-icon-download" size="medium">
                导出Excel
            </el-button>
        </json-excel>
    </div>
</template>

<script>
import JsonExcel from "vue-json-excel";
export default {
  props: {
    result: {
      type: Array,
      default: () => []
    },
    fields: {
      type: Object,
      default: () => {}
    },
    xlsName: {
      type: String,
      default: "##.xls"
    }
  },
  data() {
    return {
      time: null
    };
  },
  components: {
    JsonExcel
  },
  methods: {
    search() {
        if(this.time){
            this.$emit("search", this.time);
        }else{
            this.$message.info('请先选择时间')
        }
      
    }
  }
};
</script>

<style>
.search{
    padding: 20px;
    text-align: left;
}
</style>

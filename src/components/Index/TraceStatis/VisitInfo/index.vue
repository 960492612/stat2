<template>
  <div >
      <el-table :data="datas" height="500px">
        <el-table-column label="序号" type="index" width="100"></el-table-column>
        <el-table-column label="ip" prop="ip"></el-table-column>
        <el-table-column label="地址" prop="location"></el-table-column>
        <el-table-column label="时间" prop="time" :formatter="timeFormater"></el-table-column>
      </el-table>
  </div>
</template>
<script>
import {formatTime} from 'common/js/util'
export default {
  props:{
      datas:{
          type: Array,
          default:()=>[]
      }
  },
  methods:{
      timeFormater(row, column, value){
        return formatTime(value, "yyyy-MM-dd hh:mm:ss")
      }
  }
}
</script>

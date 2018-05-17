<template>
    <div class="searchBox">
        <el-tag type="primary">选择月份范围(查询单月只需选择起始月)：</el-tag>
        <el-date-picker v-model="begin" type="month" placeholder="选择起始月" size="medium" :editable="false" @change="changeBegin"></el-date-picker>-
        <el-date-picker v-model="end" type="month" placeholder="选择结束月" size="medium" :editable="false" @change="changeEnd"></el-date-picker>
        <!-- <el-button type="primary" @click="searchDataByDate" size="medium">查找</el-button> -->

    </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      begin: null,
      end: null
    };
  },
  computed: {
    ...mapGetters(["logistics/begin", "logistics/end"])
  },
  created() {
    this.begin = this["logistics/begin"];
    this.end = this["logistics/end"];
  },
  methods:{
      changeBegin(val){
          this.setBegin(val)
      },
      changeEnd(val){
          this.setEnd(val)
      },
    //   searchDataByDate(){
    //       this.$emit('searchDataByDate')
    //   },
      ...mapMutations('logistics',[
          'setBegin',
          'setEnd'
      ])
  }
};
</script>

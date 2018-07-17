<template>
  <div class="FinnaceRecord">
    <div class="upload-wrap">
      <el-button type="primary" @click="showZijinBox">上传资金数据zip压缩包</el-button>
      <upload-zijin ref="uploadZijin"/>
    </div>
    
  </div>
</template>

<script>
import uploadZijin from '../Base/uploadZijin'
export default {
  data() {
    return {
     
      data: {}
    };
  },
  components:{
    uploadZijin
  },
  watch: {},
  methods:{
    showZijinBox(){
      
      this.$refs.uploadZijin.toggleShow()
    }
  }
};
</script>
<style lang="scss" scoped>
.FinnaceRecord {
  margin-top: 20px;
  text-align: left;
}
</style>

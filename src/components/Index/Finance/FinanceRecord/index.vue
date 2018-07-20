<template>
  <div class="FinnaceRecord">
    <div class="upload-wrap">
      <el-button type="primary" @click="showZijinBox">上传资金数据zip压缩包</el-button>
      <el-button type="primary" @click="showFangkuanBox">上传平台放款数据zip压缩包</el-button>
      <upload-zijin ref="uploadZijin" />
      <upload-fangkuan ref="uploadFangkuan" />
    </div>

  </div>
</template>

<script>
import uploadZijin from "../Base/uploadZijin";
import uploadFangkuan from "../Base/uploadFangkuan";
export default {
  data() {
    return {
      data: {}
    };
  },
  components: {
    uploadZijin,
    uploadFangkuan
  },
  watch: {},
  methods: {
    showZijinBox() {
      this.$refs.uploadZijin.toggleShow();
    },
    showFangkuanBox(){
      this.$refs.uploadFangkuan.toggleShow();
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

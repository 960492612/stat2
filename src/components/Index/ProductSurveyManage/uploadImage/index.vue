<template>
  <div class="survey-uploadImage">

    <div class="main">

      <el-upload class="upload" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" :data="{id: surveyId}" :auto-upload="false" list-type="picture" :on-change="fileChange" ref="upload" :action="url" multiple :on-success="uploadSuccess" :with-credentials="true">
        <el-button size="medium" type="primary" plain icon="el-icon-search">选择文件</el-button>
        <el-button style="margin-left: 10px;" icon="el-icon-upload" size="medium" type="primary" plain @click.stop="submitUpload()">上传</el-button>
        <span style="font-size:12px;">Tip：图片需要点击上传按钮进行保存</span>
      </el-upload>

      <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
    </div>
    <!-- :http-request="postAction" -->
  </div>
</template>
<script>
import { apiBaseUrl } from "@/config";
import { mapGetters } from "vuex";
import { deleteSurveyImage } from "api/productSurvey";
export default {
  props: {
    surveyId: {
      type: Number,
      default: 0
    },
    images: {
      type: Array,
      default: ()=>[]
    }
  },
  data() {
    return {
      // uploadShow: false,
      data: {},
      url: apiBaseUrl + "productSurvey/uploadSurveyImage",
      fileList: []
    };
  },
  computed: {
    ...mapGetters(["loginName"])
  },
  created() {
    this.fileList = this.images 
  },
  methods: {
    // setShow(row) {
    //   this.data = row;
    //   this.uploadShow = true;
    // },
    handlePreview() {},
    postAction(param) {
      console.log(param);
    },
    //   添加图片
    fileChange(file) {
      
      // this.fileList.push(file)
      //   this.fileList.push(file);
    },
    uploadSuccess(response, file, fileList) {
      if (response.code == 1) {
        this.$message.success("上传成功");
      } else {
        this.$message.info("上传失败");
      }
    },

    handleRemove(file, fileList) {
     
      deleteSurveyImage({url:file.url, surveyId: this.surveyId}).then(res=>{
        if(res.code == 1){
          this.$message.success(res.msg)
        }
      })
    },
    submitUpload() {
      // console.log( this.$refs.upload);
      this.$refs.upload.submit();
    }
  }
};
</script>
<style lang="scss">
.survey-uploadImage {
  //   .upload {
  //     text-align: left;
  //     .el-upload {
  //       display: block;
  //       text-align: left;
  //     }
  .el-upload-list {
    // float: left;
    // width: 200px;
    .el-upload-list__item {
      float: left;
      width: 25%;
      margin-right: 15px;
    }
  }
  //   }
  .el-upload__tip {
    margin-top: 0;
    font-size: 16px;
  }
}
</style>


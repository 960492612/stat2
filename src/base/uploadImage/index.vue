<template>
    <el-dialog :title="`上传主题${data.sid}相关的数据截图`" :visible.sync="uploadShow" class="uploadImage">
        <div class="el-upload__tip">只能上传jpg/png文件，且不超过2M，同主题的截图会进行覆盖</div>
        <div class="main">

            <div v-for="(item, index) in data.channels" :key="item.id" class="channel">
                <el-upload class="upload" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" 
                :data="{id: item.id, name: loginName}"
                :auto-upload="false" list-type="picture" :limit="1" :on-exceed="exceed"  :on-change="fileChange" ref="upload" :action="url"
                :on-success="uploadSuccess">
                    <label for="">关联渠道：{{item.channels}}</label>
                    <el-button size="medium" type="text">选择文件</el-button>
                    <el-button style="margin-left: 10px;" size="medium" type="text" @click.stop="submitUpload(index)">上传</el-button>
                </el-upload>
            </div>
            <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
        </div>
<!-- :http-request="postAction" -->
    </el-dialog>
</template>
<script>
import { apiBaseUrl } from '@/config'
import {mapGetters} from 'vuex'
export default {
  data() {
    return {
      uploadShow: false,
      data: {},
      url: apiBaseUrl + 'subject/postSubjectImage',
      fileList: []
    };
  },
  computed:{
    ...mapGetters(['loginName'])
  },
  methods: {
    setShow(row) {
      this.data = row;
      this.uploadShow = true;
    },
    handlePreview() {},
    postAction(param) {
      console.log(param);
    },
    //   添加图片
    fileChange(file) {
      // this.fileList.push(file)
      //   this.fileList.push(file);
    },
    uploadSuccess(response, file, fileList){
      if(response.code == 1){
        this.$message.success('上传成功')
      }else{
        this.$message.info('上传失败')
      }
    },
    exceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    handleRemove(file, fileList) {},
    submitUpload(index) {
      // console.log( this.$refs.upload);
      this.$refs.upload[index].submit();
    }
  }
};
</script>
<style lang="scss">
.uploadImage {
//   .upload {
//     text-align: left;
//     .el-upload {
//       display: block;
//       text-align: left;
//     }
//     .el-upload-list{
//         // width: 100%;
//     }
//   }
  .channel {
    margin-top: 15px;
    // label {
    //   width: 50%;
    //   display: inline-block;
    // }
  }
}
.el-dialog__body{
  padding: 15px 20px;
}
</style>


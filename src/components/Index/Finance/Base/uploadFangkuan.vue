<template>
    <div class="uploadArea" v-if="show">

        <input id="excel-upload-input" type="file" accept=".zip" class="c-hide" @change="handleFileChange" />
        <div id="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">

            <span v-html="tip"></span>
            <el-button style="margin-left:16px;" size="medium" type="text" @click="handleUpload">打开文件夹</el-button>
        </div>
        <div class="fileList" v-show="loading == 4">
            <el-button type="success" @click="upload" size="medium">确认上传</el-button>
            <h5>检测到的文件:</h5>
            <ul>
                <li v-for="(item, index) in filesTitle" :key="index">
                    <span class="el-icon-document"></span>&nbsp;{{item}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { mixin } from "./mixin.js";
import JSzip from "jszip";
import iconv from "iconv-lite";
import { upload2 } from "api/finance";
import { formatTime } from "common/js/util";
export default {
  mixins: [mixin],
  props: {
    already: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      data: [],
      filesTitle: [],
      pass: true
    };
  },
  computed: {},
  methods: {
    upload() {
      let result = this.genarateData(this.data);
      if (!this.pass) {
        this.$message.info("上传数据的时间已重复，请检查");
        return;
      }
      upload2(result).then(res => {
        if (res.code == 1) {
          this.$message.success("上传成功");
          this.loading = 2;
        }else{
            this.$message.error("上传失败");
            this.loading = 3
        }
        // console.log(res);
      });
    },
    genarateData(data) {
      return data.map(item => {
        delete item["商品数量"];
        delete item["商品名称"];
        delete item[" 商品ID"];
        delete item["商品ID"];
        delete item["订单支付时间"];
        item["货币"] = /CNH|CNY/.test(item["放款币种"])?'人民币':'美元';
        item["时间"] = item["放款时间"].replace(/\-/g, '/');
        // 检查时间
        let time = new Date(item['时间'])
        time=formatTime(time.getTime(), 'yyyy-MM')
        if(this.already.some(item=>{
          return item['月份'] == time
        })){
          this.pass = false
        }
        for (let key in item) {
          if (!isNaN(item[key])) {
            item[key] = Number(item[key]);
          }
        }
        return item;
      });
    },
    decodeZip(zip) {
      this.data = []
      this.filesTitle = []
      JSzip.loadAsync(zip, {
        decodeFileName: function(bytes) {
          return iconv.decode(bytes, "gb2312");
        }
      })
        .then(_zip => {
          _zip.forEach((relativePath, zipEntry) => {
            // console.log(zipEntry);
            this.genarateFile(zipEntry);
          });
        })
        .catch(err => {
          this.$message.error(err);
          this.loading = 3;
        });
    },
    genarateFile(file) {
      if (!file.dir) {
        let output = {};
        let keys = ["店铺", "fileType"];
        let reg = /\/(A\d+)\/[\s\S]+\.(csv|xls)/;
        let result = file.name.match(reg);
        let data = null;
        // console.log(result)
        this.filesTitle.push(file.name);
        if (result) {
          for (let i = 1; i <= 2; i++) {
            if (!result[i]) {
              throw new Error("压缩包文件格式不正确，请先处理");
            }
            output[keys[i - 1]] = result[i];
          }
        }
        if (output.fileType == "csv") {
          // this.readerData(file);
          file.async("arraybuffer").then(blob => {
            blob = iconv.decode(Buffer.from(blob), "GBK");
            this.data = [
              ...this.data,
              ...this.readerData(blob, "string").map(item => {
                return { ...item, ...output };
              })
            ];
          });
        } else {
          file.async("base64").then(blob => {
            this.data = [
              ...this.data,
              ...this.readerData(blob, "base64").map(item => {
                return { ...item, ...output };
              })
            ];
          });
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#excel-upload-input {
  display: none;
  z-index: -9999;
}
#drop {
  border: 2px dashed #bbb;
  width: 100%;
  height: 160px;
  line-height: 160px;
  margin: 10px auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
.uploadArea {
  margin-top: 20px;
  width: 50%;
}
.fileList{
    text-align: center;
    h5{
        // text-align: center;
        line-height: 30px;
    }
    ul{
        
        li{
            line-height: 24px;
            color:rgb(240, 96, 96) ;
            span{
                color: #333;
            }
        }
    }
}
</style>

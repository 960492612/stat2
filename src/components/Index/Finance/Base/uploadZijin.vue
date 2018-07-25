<template>
  <div class="uploadArea" v-if="show">

    <input id="excel-upload-input" type="file" accept=".zip" class="c-hide" @change="handleFileChange" />
    <div id="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">

      <span v-html="tip"></span>
      <el-button style="margin-left:16px;" size="mini" type="primary" @click="handleUpload">打开文件夹</el-button>
    </div>
    <div class="fileList" v-show="loading == 4">
      <el-button type="primary" @click="upload" size="medium">确认上传</el-button>
      <h5>检测到的文件:</h5>
      <ul>
        <li v-for="(item, index) in filesTitle" :key="index">
          {{item}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mixin } from "./mixin.js";
import JSzip from "jszip";
import iconv from "iconv-lite";
import { upload1 } from "api/finance";
export default {
  mixins: [mixin],
  data() {
    return {
      data: [],
      filesTitle: []
    };
  },
  computed: {},
  methods: {
    upload() {
      let result = this.genarateData(this.data);
      upload1(result).then(res => {
        if (res.code == 1) {
          this.$message.success("上传成功");
          this.loading = 2;
        } else {
          this.$message.error("上传失败");
          this.loading = 3;
        }
        // console.log(res);
      });
    },
    genarateData(data) {
      return data.map(item => {
        let orderId = item["交易信息"].match(/\d+/);
        item["订单号"] = orderId ? orderId[0] : "无";
        item['时间'] = item['时间'].replace(/\-/g, '/')
        let result;
        if (item["资金明细"]) {
          result = item["资金明细"].match(/(\+|\-)([A-Z]+)\s*(\d+[.*]\d*)/);
          item["资金方向"] = result[1] == "+" ? 1 : -1;
          // 合并人民币
          item["货币"] = /CNH|CNY/.test(result[2])?'人民币':'美元';
          item["数额"] = Number(result[3]);
        } else {
          if (item["出款"]) {
            item["出款"] = item["出款"].replace(/\s/g, "");
            result = item["出款"].match(/([A-Z]+)(\d+[.*]\d*)/);
            item["资金方向"] = -1;
          } else if (item["入款"]) {
            item["入款"] = item["入款"].replace(/\s/g, "");
            result = item["入款"].match(/([A-Z]+)(\d+[.*]\d*)/);
            item["资金方向"] = 1;
          }
          item["货币"] = /CNH|CNY/.test(result[1])?'人民币':'美元';
          item["数额"] = Number(result[2]);
        }

        // delete item[" 交易对方"];
        // delete item["交易信息"];
        // delete(item['资金明细'])
        return item;
      });
    },
    decodeZip(zip) {
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
        let keys = ["账户", "店铺", "货币", "fileType"];
        let reg = /\/(支付宝|速卖通)账户\/(\w+)\/(CNY|CNH|美元|人民币)[\u4e00-\u9fa5]+\.(csv|xls)/;
        let result = file.name.match(reg);
        let data = null;
        // console.log(result)
        this.filesTitle.push(file.name);
        if (result) {
          for (let i = 1; i <= 4; i++) {
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
.fileList {
  text-align: center;
  h5 {
    // text-align: center;
    line-height: 30px;
  }
  ul {
    li {
      line-height: 24px;
      color: rgb(240, 96, 96);
      span {
        color: #333;
      }
    }
  }
}
</style>

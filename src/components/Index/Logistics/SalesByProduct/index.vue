<template>
  <div class="logistics">
    <el-tag type="primary">先选择日期：</el-tag>
    <el-date-picker v-model="date" type="month" placeholder="选择年月" size="medium" @change="checkDataByDate"></el-date-picker>
    <div class="tip">
      <p>Excel表格应只有以下字段：</p>
      <el-tag type="primary" v-for="(item, index) in keys" :key="index" class="key-tag">{{item}}</el-tag>
    </div>
    <div class="uploadArea" v-if="date">
      <input id="excel-upload-input" type="file" accept=".xlsx, .xls" class="c-hide" @change="handleFileChange" />

      <div id="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
        <span v-html="tip"></span>
        <el-button style="margin-left:16px;" size="mini" type="primary" @click="handleUpload">打开文件夹</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { addSalesByProduct, getCountProductByDate } from "api/logistics";
import { formatTime } from "common/js/util";
import { LogisticsByProductKey } from "common/js/config";
import XLSX from "xlsx";
const status = {
  0: "拖拽excel表格文件到此 <span class='el-icon-upload'></span>",
  1: "正在处理表格数据，请耐心等候 <span class='el-icon-loading'></span>",
  2: "表格已成功上传 <span class='el-icon-success'></span>",
  3: "表格上传失败，请重试，或联系管理员 <span class='el-icon-error'></span>"
};
export default {
  data() {
    return {
      loading: 0,
      excelData: {
        header: null,
        results: null
      },
      date: null
    };
  },
  computed: {
    tip() {
      return status[this.loading];
    },

    keys() {
      return Object.values(LogisticsByProductKey);
    }
  },
  methods: {
    generateDate({ header, results }) {
      // this.excelData.header = header;
      // 保证表格字段的准确性
      let keys = Object.values(LogisticsByProductKey);
      let isOk = header.every(item => {
        return keys.some(_item => {
          return item == _item;
        });
      });
      if (!isOk) {
        this.$message.error("表格字段有误， 请重新对照检查");
        return;
      }
      let ret = results.map(item => {
        for (let key in item) {
          let temp = Number(item[key]);
          if (!isNaN(temp)) {
            item[key] = temp;
          }
        }
        item["date"] = Number(formatTime(this.date.getTime(), "yyyyMM"));
        return item;
      });

      // this.excelData.results = ret;
      this.upload(ret);
    },
    upload(data) {
      addSalesByProduct(data)
        .then(res => {
          if (res.code == 1) {
            this.loading = 2;
          } else {
            this.loading = 3;
          }
          data = null;
        })
        .catch(err => {
          console.log(err);
          this.loading = 3;
          data = null;
        });
    },
    checkDataByDate(value){
      let date = Number(formatTime(this.date.getTime(), "yyyyMM"));
      getCountProductByDate().then(res=>{
        if(res.code == 1){
          let isOk = res.data.some(item=>{
            return item.date == date
          })
          if(isOk){
            this.$message.info('该月份的数据已上传，请勿重新提交，如需更改，请先删除该月份数据。')
            this.date = null
            return 
          }
        }else{
          this.date = null
          this.$message.error('数据连接错误')
        }
      })
    },
    handleDrop(e) {
      e.stopPropagation();
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length !== 1) {
        this.$message.error("只支持同时上传一个文件!");
        return;
      }
      const itemFile = files[0]; // only use files[0]
      this.readerData(itemFile);
      this.loading = 1;
      e.stopPropagation();
      e.preventDefault();
    },
    handleDragover(e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    },
    handleUpload() {
      document.getElementById("excel-upload-input").click();
    },
    handleFileChange(e) {
      if (!this.date) {
        this.$message.error("请先选择日期");
        this.loading = 0;
        return;
      }
      const files = e.target.files;
      const itemFile = files[0]; // only use files[0]
      this.readerData(itemFile);
    },
    readerData(itemFile) {
      const reader = new FileReader();
      reader.onload = e => {
        const data = e.target.result;
        const fixedData = this.fixdata(data);
        const workbook = XLSX.read(btoa(fixedData), { type: "base64" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const header = this.get_header_row(worksheet);
        const results = XLSX.utils.sheet_to_json(worksheet);

        this.generateDate({ header, results });
      };
      reader.readAsArrayBuffer(itemFile);
    },
    fixdata(data) {
      let o = "";
      let l = 0;
      const w = 10240;
      for (; l < data.byteLength / w; ++l)
        o += String.fromCharCode.apply(
          null,
          new Uint8Array(data.slice(l * w, l * w + w))
        );
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
      return o;
    },
    get_header_row(sheet) {
      const headers = [];
      const range = XLSX.utils.decode_range(sheet["!ref"]);
      let C;
      const R = range.s.r; /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) {
        /* walk every column in the range */
        var cell =
          sheet[
            XLSX.utils.encode_cell({ c: C, r: R })
          ]; /* find the cell in the first row */
        var hdr = "UNKNOWN " + C; // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
        headers.push(hdr);
      }
      return headers;
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
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
.logistics {
  margin-top: 20px;
  text-align: left;
  .uploadArea {
    margin-top: 20px;
  }
  .tip {
    margin-top: 20px;
    margin-bottom: 20px;
    .key-tag {
      margin-top: 10px;
      margin-right: 5px;
    }
  }
}
</style>

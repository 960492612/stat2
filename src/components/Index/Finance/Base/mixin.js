
import XLSX from "xlsx";
import { UPLOADSTATUS } from "common/js/config";
export const mixin = {
  data() {
    return {
      loading: 0,
      show: false
    };
  },
  computed: {
    tip() {
      return UPLOADSTATUS[this.loading];
    }
  },
  methods: {
    toggleShow() {
      this.show = !this.show;
    },
    readerData(itemFile, codeType) {
      // raw: true 不将格式进行转化
      const workbook = XLSX.read(itemFile, { type: codeType, raw: true });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const results = XLSX.utils.sheet_to_json(worksheet);
      this.loading = 4
      return results;
    },
    handleDrop(e) {
      e.stopPropagation();
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length !== 1) {
        this.$message.error("请选择一个文件！");
        return;
      }
      const itemFile = files[0]; // only use files[0]
      this.decodeZip(itemFile);
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
      const files = e.target.files;
      const itemFile = files[0]; // only use files[0]
      this.decodeZip(itemFile);
      this.loading = 1;
    }
  }
};

<template>
  <div class="FinnaceRecord">
    <div class="upload-wrap">
      <el-button type="primary" @click="showZijinBox" title="点击展开或收起上传栏">上传资金数据zip压缩包</el-button>
      <el-button type="primary" @click="showFangkuanBox" title="点击展开或收起上传栏">上传平台放款数据zip压缩包</el-button>
      <upload-zijin ref="uploadZijin" :already="zijinMonth"/>
      <upload-fangkuan ref="uploadFangkuan" :already="fangkuanMonth"/>
    </div>
    <div class="record">
      <div class="zijin">
        <div>已上传资金表的月份</div>
        <el-table :data="zijinMonth">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column label="月份" prop="月份"></el-table-column>
          <el-table-column prop="oper" :label="$t('oper.oper')" class-name="expend-column" width="240">
            <template slot-scope="scope">
              <el-button @click.native.prevent="destroyZijin(scope.row)" type="text" size="mini" class="btn">
                {{$t('oper.delete')}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="zijin">
        <div>已上传平台放款表的月份</div>
        <el-table :data="fangkuanMonth">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column label="月份" prop="月份"></el-table-column>
          <el-table-column prop="oper" :label="$t('oper.oper')" class-name="expend-column" width="240">
            <template slot-scope="scope">
              <el-button @click.native.prevent="destroyFangkuan(scope.row)" type="text" size="mini" class="btn">
                {{$t('oper.delete')}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import uploadZijin from "../Base/uploadZijin";
import uploadFangkuan from "../Base/uploadFangkuan";
import {
  getZijinMonth,
  getFangkuanMonth,
  destroyFangkuan,
  destroyZijin
} from "api/finance";
export default {
  data() {
    return {
      data: {},
      zijinMonth: null,
      fangkuanMonth: null
    };
  },
  components: {
    uploadZijin,
    uploadFangkuan
  },
  watch: {},
  created() {
    this.getUploaded();
  },
  methods: {
    showZijinBox() {
      this.$refs.uploadZijin.toggleShow();
    },
    showFangkuanBox() {
      this.$refs.uploadFangkuan.toggleShow();
    },
    getUploaded() {
      getFangkuanMonth().then(res => {
        if (res.code == 1) {
          this.fangkuanMonth = res.data;
        }
      });
      getZijinMonth().then(res => {
        if (res.code == 1) {
          this.zijinMonth = res.data;
        }
      });
    },
    destroyZijin(row) {
      let time = row["月份"].split("-");
      this.$confirm("删除该时间段的资金表数据？", this.$t("product.delete.tip"), {
        confirmButtonText: this.$t("product.delete.sure"),
        cancelButtonText: this.$t("product.delete.cancel"),
        type: "warning"
      }).then(() => {
        destroyZijin({ year: Number(time[0]), month: Number(time[1]) }).then(res => {
          if (res.code == 1) {
            this.$message.success("删除成功");
          }else{
            this.$message.error("删除失败");
          }
          this.getUploaded();
        });
      });
    },
    destroyFangkuan(row) {
      let time = row["月份"].split("-");
      this.$confirm("删除该时间段的平台放款表数据？", this.$t("product.delete.tip"), {
        confirmButtonText: this.$t("product.delete.sure"),
        cancelButtonText: this.$t("product.delete.cancel"),
        type: "warning"
      }).then(() => {
        destroyFangkuan({ year: Number(time[0]), month: Number(time[1]) }).then(res => {
          if (res.code == 1) {
            this.$message.success("删除成功");
          }else{
            this.$message.error("删除失败");
          }
          this.getUploaded();
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.FinnaceRecord {
  margin-top: 20px;
  text-align: left;
  .record {
    margin-top: 20px;
    display: flex;
    > div {
      flex: 1;
    }
  }
}
</style>

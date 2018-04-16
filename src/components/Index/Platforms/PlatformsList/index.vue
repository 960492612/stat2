<template>
  <div>
    <div class="content">
      <el-table :data="tableData" style="width:770px;">
        <div slot="empty">
          <i class="el-icon-loading" v-show="loadStatus == 1"></i> {{loadingText}}</div>
        <el-table-column prop="id" label="平台id" width="80" align="center">
        </el-table-column>
        <el-table-column prop="name" label="平台名" width="180" align="center">
        </el-table-column>
        <el-table-column prop="desc" :label="$t('product.label.desc')" width="180" align="center">
        </el-table-column>
        <el-table-column prop="oper" :label="$t('oper.oper')" align="center" v-show="isManager">
          <template slot-scope="scope">
            <el-button @click.native.prevent="editRow(scope.row)" type="text">
              {{$t('oper.edit')}}
            </el-button>
            <el-button @click.native.prevent="deleteRow(scope.row, scope.$index)" type="text">
              {{$t('oper.delete')}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
// import { getProducts, deleteProduct } from "api/product";
import { getPlatforms, deletePlatform } from "api/store";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Platform",
  data() {
    return {
      tableData: [],
      loadStatus: 1
    };
  },
  computed: {
    loadingText() {
      return this.loadStatus == 1
        ? this.$t("data.loading")
        : this.$t("data.none");
    },
    
    ...mapGetters(["id", "isManager"])
  },
  created() {
    this._getPlatforms();
  },
  methods: {
    _getPlatforms() {
      getPlatforms().then(res => {
        if (res.code == 1) {
          if (res.data.length == 0) {
            this.loadStatus = 0;
            return;
          }
          this.tableData = res.data;
        } else {
          this.loadStatus = 0;
        }
      });
    },
    editRow(row) {
      this.$router.push({
        name: "EditPlatform",
        params: row
      });
    },
    deleteRow(row, index) {
      if (!this.isManager) {
        this.$message.error("抱歉，您不是管理员，无权删除");
        return;
      }
      this.$confirm(
        this.$t("product.delete.confirm"),
        this.$t("product.delete.tip"),
        {
          confirmButtonText: this.$t("product.delete.sure"),
          cancelButtonText: this.$t("product.delete.cancel"),
          type: "warning"
        }
      )
        .then(() => {
          deletePlatform({ id: row.id }).then(res => {
            if (res.code == 1) {
              this.$message({
                type: "success",
                message: this.$t("product.delete.success")
              });
              this._getPlatforms();
            } else {
              this.$message.error(this.$t("product.delete.error"));
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("product.delete.canceled")
          });
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  margin-top: 20px;
  text-align: left;
  .second-content {
    li {
      height: 30px;
      line-height: 30px;
      border-bottom: 1px solid #eee;
      span {
        padding-left: 10px;
        display: inline-block;
        width: 166px;
      }
    }
  }
}
</style>

<template>
  <div>
    <div class="content">
      <el-table :data="tableData" style="" height="700">
        <div slot="empty">
          <i class="el-icon-loading" v-show="loadStatus == 1"></i> {{loadingText}}</div>
        <el-table-column type="index" width="80" align="center">
        </el-table-column>
        <el-table-column prop="name" :label="$t('store.label.name')" width="180" align="center">
        </el-table-column>
        <el-table-column prop="link" :label="$t('store.label.link')" width="250" align="center" >
          <template slot-scope="scope">
            <el-popover trigger="click" placement="right">
              <p style="maxWidth:350px;">
                <a :href="scope.row.link" target="_blank">{{scope.row.link}}</a>
              </p>
              <p slot="reference" :title="$t('statis.tip')">{{contentFormat(scope.row.link)}}</p>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="platform" :label="$t('store.label.platform')" width="180" align="center">
        </el-table-column>
        <el-table-column prop="owner" :label="$t('store.label.owner')" width="180" align="center">
        </el-table-column>
        <el-table-column prop="desc" :label="$t('store.label.desc')" width="270" align="center" show-overflow-tooltip >
        </el-table-column>
        <el-table-column prop="oper" :label="$t('oper.oper')" align="center" fixed="right" min-width="180">
          <template slot-scope="scope">
            <el-button @click.native.prevent="editRow(scope.row)" type="text">
              {{$t('oper.edit')}}
            </el-button>
            <el-button @click.native.prevent="deleteRow(scope.row)" type="text" v-show="isManager">
              {{$t('oper.delete')}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getStores, deleteStore } from "api/store";
import { mapActions, mapGetters } from "vuex";
import {roles} from 'common/js/config'
export default {
  name: "Products",
  data() {
    return {
      tableData: [],
      loadStatus: 1
    };
  },
  computed: {
    loadingText() {
      return this.loadStatus == 1 ? this.$t('data.loading') : this.$t('data.none');
    },
    isManager(){
      return this.role == roles['最高管理员']
    },
    ...mapGetters(["id", "role"])
  },
  created() {
    this._getStores();
  },
  methods: {
    _getStores() {
      getStores().then(res => {
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
        name: "EditStore",
        params:row
      });
    },
    contentFormat(content) {
      return content.length > 25 ? content.substr(0, 25) + "..." : content;
    },
    deleteRow(row) {
      if (!this.isManager) {
        this.$message.error("您无权删除店铺信息");
        return;
      }
      this.$confirm('确认删除？', this.$t('product.delete.tip'), {
        confirmButtonText: this.$t('product.delete.sure'),
        cancelButtonText: this.$t('product.delete.cancel'),
        type: "warning"
      })
        .then(() => {
          deleteStore({ id: row.id}).then(res => {
            if (res.code == 1) {
              this.$message({
                type: "success",
                message: this.$t('product.delete.success')
              });
              this._getStores()
            } else {
              this.$message.error(this.$t('product.delete.error'));
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t('product.delete.canceled')
          });
        });
    }
  },
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


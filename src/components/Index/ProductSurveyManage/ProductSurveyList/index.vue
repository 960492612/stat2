<template>
  <div>
    <div class="ProductSurveyList">
      <el-table :data="tableData">
        <div slot="empty">
          <i class="el-icon-loading" v-show="loadStatus == 1"></i> {{loadingText}}</div>
        <el-table-column prop="id" label="调查表id" width="80" align="center">
        </el-table-column>
        <el-table-column prop="product" label="产品" width="180" align="center">
        </el-table-column>
        <el-table-column prop="category" :label="$t('product.label.category')" width="180" align="center" :filter-method="filterCategory" :filters="categories">
        </el-table-column>
        <el-table-column prop="desc" :label="$t('product.label.desc')" width="180" align="center">
        </el-table-column>
        <el-table-column prop="time" label="创建时间" width="180" align="center" :formatter="timeFormat">
        </el-table-column>
        <el-table-column prop="oper" :label="$t('oper.oper')" align="center">
          <template slot-scope="scope">

            <el-button type="text" @click="showPublishBox(scope.row)" v-if="scope.row.isPublished == 0">
              发布
            </el-button>
            <el-button type="text" @click="canclePublished(scope.row.id)" v-if="scope.row.isPublished == 1">
              取消发布
            </el-button>
            <el-button @click.native.prevent="preview(scope.row)" type="text">
              预览
            </el-button>
            <el-button @click.native.prevent="editRow(scope.row)" type="text" v-if="scope.row.isPublished == 1">
              查看反馈
            </el-button>
            <el-button @click.native.prevent="editRow(scope.row)" type="text" v-if="scope.row.isPublished == 0">
              {{$t('oper.edit')}}
            </el-button>
            <el-button @click.native.prevent="copyRow(scope.row)" type="text">
              复制
            </el-button>
            <el-button @click.native.prevent="deleteRow(scope.row, scope.$index)" type="text">
              {{$t('oper.delete')}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="调查表详情" :visible.sync="isShowInfo" width="80%">
      <product-survey-info :survey="currentSurvey" />
    </el-dialog>
    <el-dialog title="选择部门进行发布" :visible.sync="isShowPublishBox">
      <el-select v-model="selectDepartment" placeholder="选择部门" size="medium" multiple>
        <el-option v-for="(item, index) in departments" :key="index" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-button type="primary" size="medium" @click="publish()">确认发布</el-button>
    </el-dialog>
    <el-dialog title="选择产品进行复制" :visible.sync="isShowCopyBox">
      <el-select v-model="selectProduct" placeholder="选择产品" size="medium">
        <el-option v-for="(item, index) in products" :key="index" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-button type="primary" size="medium" @click="copySurvey()">确认复制</el-button>
    </el-dialog>
  </div>
</template>
<script>
import {
  getSurveys,
  deleteSurvey,
  publish,
  canclePublished,
  copySurvey
} from "api/productSurvey";
import { getProductCates, getProducts } from "api/product";
import { mapActions, mapGetters } from "vuex";
import { formatTime } from "common/js/util";
import ProductSurveyInfo from "../ProductSurveyInfo";
import { getDepartments } from "api/account";
export default {
  data() {
    return {
      tableData: [],
      loadStatus: 1,
      productCates: [],
      currentSurvey: null,
      isShowInfo: false,
      isShowPublishBox: false,
      isShowCopyBox: false,
      departments: [],
      selectDepartment: [],
      selectProduct: null,
      products: null
    };
  },
  computed: {
    loadingText() {
      return this.loadStatus == 1
        ? this.$t("data.loading")
        : this.$t("data.none");
    },
    categories() {
      return this.productCates.map(item => {
        return {
          text: item.name,
          value: item.name
        };
      });
    },
    ...mapGetters(["id"])
  },
  created() {
    this._getSurveys();
    this._getProductCates();
    this._getDepartments();
  },
  activated() {
    this._getSurveys();
  },
  components: {
    ProductSurveyInfo
  },
  methods: {
    _getSurveys() {
      getSurveys({ owner_id: this.id }).then(res => {
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
    _getProductCates() {
      getProductCates().then(res => {
        if (res.code == 1) {
          this.productCates = res.data;
        }
      });
    },
    _getProduct() {
      getProducts().then(res => {
        if (res.code == 1) {
          if (res.data.length == 0) {
            return;
          }
          this.products = res.data;
        }
      });
    },
    _getDepartments() {
      getDepartments().then(res => {
        if (res.code == 1) {
          this.departments = res.data;
        }
      });
    },
    filterCategory(value, row) {
      return row.category == value;
    },
    timeFormat(item) {
      return formatTime(item.time);
    },
    showPublishBox(row) {
      this.currentSurvey = row;
      this.isShowPublishBox = true;
      this.selectDepartment = [];
    },
    publish() {
      if (this.selectDepartment.length <= 0) {
        this.$message.info("请选择部门");
        return;
      }
      publish({
        surveyId: this.currentSurvey.id,
        dids: this.selectDepartment
      }).then(res => {
        if (res.code == 1) {
          this.$message.success("发布成功");
          this.isShowPublishBox = false;
          this._getSurveys();
        }
      });
    },
    preview(row) {
      this.currentSurvey = row;
      this.isShowInfo = true;
    },
    canclePublished(id) {
      this.$confirm("同时清除已有的反馈信息", "取消发布调查表", {
        confirmButtonText: this.$t("product.delete.sure"),
        cancelButtonText: this.$t("product.delete.cancel"),
        type: "warning"
      })
        .then(() => {
          canclePublished({ surveyId: id }).then(res => {
            if (res.code == 1) {
              this.$message.success("取消成功");
              this._getSurveys();
            } else {
              this.$message.error("取消失败");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消操作"
          });
        });
    },
    editRow(row) {
      this.$router.push({
        name: "UpdateProduct",
        params: row
      });
    },
    copyRow(row) {
      this.currentSurvey = row;
      this.isShowCopyBox = true;
      this.selectProduct = null;
      this._getProduct();
    },
    copySurvey(row) {
      if (!this.selectProduct) {
        this.$message.info("请选择部门");
        return;
      }
      copySurvey({
        surveyId: this.currentSurvey.id,
        productId: this.selectProduct
      }).then(res => {
        if (res.code == 1) {
          this.$message.success("复制成功");
          this._getSurveys();
        } else {
          this.$message.error("复制失败");
        }
      });
    },
    deleteRow(row, index) {
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
          deleteSurvey({ id: row.id, owner: this.id }).then(res => {
            if (res.code == 1) {
              this.$message({
                type: "success",
                message: this.$t("product.delete.success")
              });
              this._getSurveys();
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
.ProductSurveyList {
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
  .checkbox-box {
    display: flex;
    flex-wrap: wrap;
    .checkbox-item {
      margin-bottom: 10px;
      flex: 0 0 20%;
    }
  }
}
</style>

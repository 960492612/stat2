<template>
    <div>
        <div class="ProductSurveyList">
            <el-table :data="tableData">
                <div slot="empty">
                    <i class="el-icon-loading" v-show="loadStatus == 1"></i> {{loadingText}}</div>
                <el-table-column  label="处理状态" width="120" align="center">
                    <template slot-scope="scope">
                        <i class="el-icon-news" style="color: red;" v-if="scope.row.isConfirm == 0">未确认</i>
                        <i class="el-icon-check" style="color: green;" v-if="scope.row.isConfirm == 1">已确认</i>
                        
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="调查表id" width="180" align="center">
                    
                </el-table-column>
                <el-table-column prop="product" label="产品" width="180" align="center">
                </el-table-column>
                <el-table-column prop="category" :label="$t('product.label.category')" width="180" align="center" :filter-method="filterCategory" :filters="categories">
                </el-table-column>
                <el-table-column prop="desc" :label="$t('product.label.desc')" width="180" align="center">
                </el-table-column>
                <el-table-column prop="publishTime" label="发布时间" width="180" align="center" :formatter="timeFormat">
                </el-table-column>
                <el-table-column prop="publisher" label="发布人" width="180" align="center">
                </el-table-column>
                <el-table-column prop="oper" :label="$t('oper.oper')" align="center">
                    <template slot-scope="scope">

                        <el-button @click.native.prevent="seeDetails(scope.row)" type="text">
                            查看参数详情
                        </el-button>
                        <el-button @click.native.prevent="editRow(scope.row)" type="text" v-if="scope.row.isPublished == 1">
                            填写反馈
                        </el-button>
                        <el-button @click.native.prevent="editRow(scope.row)" type="text" v-if="scope.row.isPublished == 0">
                            {{$t('oper.edit')}}
                        </el-button>

                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="调查表详情" :visible.sync="isShowInfo" width="80%">
            <product-survey-info :survey="currentSurvey" />
        </el-dialog>

    </div>
</template>
<script>
import { getPublishSurveys } from "api/productSurvey";
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
    this._getPublishSurveys();
    this._getProductCates();
  },
  activated() {
    this._getPublishSurveys();
  },
  components: {
    ProductSurveyInfo
  },
  methods: {
    _getPublishSurveys() {
      getPublishSurveys({ adminId: this.id }).then(res => {
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

    filterCategory(value, row) {
      return row.category == value;
    },
    timeFormat(item) {
      return formatTime(item.publishTime);
    },
    seeDetails(row){
        this.$router.push({
            name: 'ProductSurveyInfo',
            params: row
        })
    },
    editRow(row) {
      this.$router.push({
        name: "EditProductSurvey",
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
          deleteSurvey({ surveyId: row.id }).then(res => {
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

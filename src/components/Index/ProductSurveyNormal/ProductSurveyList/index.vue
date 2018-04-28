<template>
  <div>
    <div class="ProductSurveyList">
      <el-table :data="tableData">
        <div slot="empty">
          <i class="el-icon-loading" v-show="loadStatus == 1"></i> {{loadingText}}</div>
        <el-table-column label="处理状态" width="120" align="center">
          <template slot-scope="scope">
            <i class="el-icon-news" style="color: red;" v-if="scope.row.isConfirm == 0">未确认</i>
            <i class="el-icon-check" style="color: green;" v-if="scope.row.isConfirm == 1">已确认</i>

          </template>
        </el-table-column>
        <el-table-column prop="id" label="调查表id" width="100" align="center">

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
        <el-table-column prop="confirmTime" label="确认时间" width="180" align="center" :formatter="timeFormat1" >
        </el-table-column>
        <el-table-column prop="oper" :label="$t('oper.oper')" align="center">
          <template slot-scope="scope">
            <el-button @click.native.prevent="seeDetails(scope.row)" type="text">
              查看参数详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
   

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
      getPublishSurveys({ admin_id: this.id }).then(res => {
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
      return formatTime(item.publishTime, "yyyy-MM-dd hh:mm");
    },
    timeFormat1(item) {
      return formatTime(item.confirmTime, "yyyy-MM-dd hh:mm");
    },
    seeDetails(row) {
      this.$router.push({
        name: "ProductSurveyInfo",
        params: row
      });
    },
    
    
    
    
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

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
        <el-table-column prop="survey_id" label="调查表编号" width="100" align="center">

        </el-table-column>
        <el-table-column prop="product" label="产品" width="180" align="center">
        </el-table-column>
        <el-table-column prop="category" :label="$t('product.label.category')" width="180" align="center" :filter-method="filterCategory" :filters="categories">
        </el-table-column>
        <el-table-column prop="desc" label="卖点说明" width="180" align="center">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p v-html="scope.row.desc" style="max-width: 500px;line-height: 24px;"></p>
              <div slot="reference" class="name-wrapper">
                {{ shortStr(scope.row.desc)}}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="publishTime" label="发布时间" width="180" align="center" :formatter="timeFormat">
        </el-table-column>
        <el-table-column prop="publisher" label="发布人" width="180" align="center">
        </el-table-column>
        <el-table-column label="图片" align="center">
          <template slot-scope="scope">
            <div class="mini-image-box" @click.stop="showBigImages(scope.row.survey_images)" title="点击查看大图">
              <img :src="item.url" :alt="item.name" v-for="(item, index) in scope.row.survey_images" :key="index" class="mini-image">
            </div>
          </template>
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
    <el-dialog title="查看大图" :visible.sync="isShowImagesBox" width="70%" top="5vh" >
      <el-carousel indicator-position="outside" height="650px">
        <el-carousel-item v-for="(item, index) in currentImages" :key="index">
          <img :src="item.url" :alt="item.name" style="height:100%;">
        </el-carousel-item>
      </el-carousel>
    </el-dialog>

  </div>
</template>
<script>
import { getPublishSurveys } from "api/productSurvey";
import { getProductCates, getProducts } from "api/product";
import { mapActions, mapGetters } from "vuex";
import { formatTime } from "common/js/util";
import ProductSurveyInfo from "../ProductSurveyNormalInfo";
import { getDepartments } from "api/account";
export default {
  data() {
    return {
      tableData: [],
      loadStatus: 1,
      productCates: [],
      currentSurvey: null,
  
      departments: [],
      selectDepartment: [],
      selectProduct: null,
      products: null,
      isShowImagesBox: false,
      currentImages: [],
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
    shortStr(str) {
      return str&&str.length > 7 ? str.substr(0, 7)+'...' : str;
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
        name: "ProductSurveyNormalInfo",
        params: row
      });
    },
    showBigImages(images) {
      this.isShowImagesBox = true;
      this.currentImages = images
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
  .mini-image-box {
    // display: flex;
    cursor: pointer;
    .mini-image {
      // flex: 1;
      margin-right: 3px;
      width: 50px;
      height: 50px;
    }
  }
}
</style>

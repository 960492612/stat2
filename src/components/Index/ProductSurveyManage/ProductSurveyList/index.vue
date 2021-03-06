<template>
  <div>
    <div class="ProductSurveyList">
      <el-table :data="tableData">
        <div slot="empty">
          <i class="el-icon-loading" v-show="loadStatus == 1"></i> {{loadingText}}</div>
        <el-table-column label="处理状态" width="120" align="center">
          <template slot-scope="scope">
            <i class="el-icon-edit" style="color: red;" v-if="scope.row.isPublished == 0">未发布</i>
            <i class="el-icon-check" style="color: green;" v-if="scope.row.isPublished == 1">已发布</i>

          </template>
        </el-table-column>
        <el-table-column prop="id" label="调查表id" width="80" align="center">
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
        <el-table-column prop="time" label="创建时间" width="180" align="center" :formatter="timeFormat">
        </el-table-column>
        <el-table-column label="图片" align="center">
          <template slot-scope="scope">
            <div class="mini-image-box" @click.stop="showBigImages(scope.row.survey_images)" title="点击查看大图">
              <img :src="item.url" :alt="item.name" v-for="(item, index) in scope.row.survey_images" :key="index" class="mini-image">
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="oper" :label="$t('oper.oper')" align="center" min-width="250" fixed="right">
          <template slot-scope="scope">
            <div class="btn-box">

              <el-button type="text" @click="showPublishBox(scope.row)" v-if="scope.row.isPublished == 0" class="btn1">
                发布
              </el-button>
              <el-button type="text" @click="canclePublished(scope.row.id)" v-if="scope.row.isPublished == 1" class="btn1">
                取消发布
              </el-button>
              <el-button @click.native.prevent="preview(scope.row)" type="text" class="btn1">
                预览
              </el-button>
              <el-button @click.native.prevent="getFeedback(scope.row)" type="text" v-if="scope.row.isPublished == 1" class="btn1">
                查看反馈
              </el-button>
              <el-button @click.native.prevent="editRow(scope.row)" type="text" v-if="scope.row.isPublished == 0" class="btn1">
                {{$t('oper.edit')}}
              </el-button>
              <el-button @click.native.prevent="copyRow(scope.row)" type="text" class="btn1">
                复制
              </el-button>
              <el-button @click.native.prevent="deleteRow(scope.row, scope.$index)" type="text"  class="btn1">
                {{$t('oper.delete')}}
              </el-button>
            </div>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="调查表详情" :visible.sync="isShowInfo" width="80%" :before-close="beforeCloseInfo">
      <span>(拖拽可进行排序)</span>
      <product-survey-info :survey="currentSurvey" ref="productSurveyInfo"/>
    </el-dialog>
    <el-dialog title="选择部门进行发布" :visible.sync="isShowPublishBox">
      <el-select v-model="selectDepartment" placeholder="选择部门" size="medium" multiple>
        <el-option v-for="(item, index) in departments" :key="index" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-button type="primary" size="medium" @click="selectAllDepartment">全选</el-button>
      <el-button type="primary" size="medium" @click="publish()">确认发布</el-button>
    </el-dialog>
    <el-dialog title="选择目标产品进行复制" :visible.sync="isShowCopyBox">
      <el-select v-model="selectProduct" placeholder="选择产品" size="medium">
        <el-option v-for="(item, index) in products" :key="index" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-button type="primary" size="medium" @click="copySurvey()">确认复制</el-button>
    </el-dialog>
    <el-dialog title="查看大图" :visible.sync="isShowImagesBox" width="70%" top="5vh">
      <el-carousel indicator-position="outside" height="650px">
        <el-carousel-item v-for="(item, index) in currentImages" :key="index">
          <img :src="item.url" :alt="item.name" style="height:100%;">
        </el-carousel-item>
      </el-carousel>
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
      isShowImagesBox: false,
      currentImages: [],
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
    shortStr(str) {
      return str && str.length > 7 ? str.substr(0, 7) + "..." : str;
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
    getFeedback(row) {
      this.$router.push({ name: "ProductSurveyFeedback", params: row });
    },
    selectAllDepartment() {
      this.selectDepartment = this.departments.map(item => {
        return item.id;
      });
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
    },
    showBigImages(images) {
      this.isShowImagesBox = true;
      this.currentImages = images;
    },
    beforeCloseInfo(done){
      
      this.$refs.productSurveyInfo.saveSort().then(res=>{
        if(res==1){
          this.$message.success('保存成功')
        }else{
          this.$message.error('保存失败')
        }
        done()
      }).catch(err=>{
        // console.log(err);
        done()
      })
    }
  }
};
</script>
<style lang="scss">
.el-tooltip__popper {
  max-width: 500px;
  font-size: 13px;
}
.el-dialog__body{
  padding: 0 20px 30px;
}
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
    height: 50px;
    cursor: pointer;
    .mini-image {
      // flex: 1;
      margin-right: 3px;
      width: 50px;
      height: 50px;
    }
  }
  .btn-box {
    display: flex;
    width: 250px;
    margin: 0 auto;
    .btn1 {
      flex: 1;
    }
  }
}

</style>

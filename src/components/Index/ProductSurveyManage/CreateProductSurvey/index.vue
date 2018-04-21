<template>
  <div class="CreateProductSurvey">
    <div>
      <label for="">上架产品：</label>
      <el-select v-model="product" filterable placeholder='选择相关产品' size="medium">
        <el-option v-for="(item, index) in products" :key="index" :value="item.id" :label="item.name" v-if="products">
          <span style="float: left">{{ item.name }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.desc }}</span>
        </el-option>
      </el-select>
      <!-- <label for="">相关平台：</label>
      <el-select v-model="selectedPlatform" placeholder="选择相关销售平台" filterable clearable size="medium" multiple collapse-tags>
        <el-option v-for="(item, index) in platforms" :key="index" :value="item.id" :label="item.name">{{item.name}}</el-option>
      </el-select> -->
      <el-button type="primary" size="medium" @click="createTable">初始化调查表</el-button>
      <el-button type="success" size="medium" @click="saveTable">保存</el-button>
    </div>
    <div class="content">
      <el-form :model="form" label-width="120px" label-position="right">
        <el-form-item :label="item.name+':'" v-for="(item, index) in params" :key="index" class="form-item">
          <el-select v-model="form[item.id]" placeholder="" multiple filterable v-if="item.inputType==3" collapse-tags style="" size="medium">
            <el-option v-for="(_item, index) in item.options" :key="index" :value="_item.id" :label="_item.name"></el-option>
          </el-select>
          <el-input v-model="form[item.id]" placeholder="" v-if="item.inputType==1" size="medium"></el-input>
          <el-select v-model="form[item.id]" placeholder="" multiple filterable v-if="item.inputType==2" style="" size="medium">
            <el-option v-for="(_item, index) in item.options" :key="index" :value="_item.id" :label="_item.name"></el-option>
          </el-select>
          <el-date-picker v-model="form[item.id]" placeholder="" v-if="item.inputType==4" size="medium" style="width:200px;"></el-date-picker>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getProducts } from "api/product";
import { getParams } from "api/productSurvey";
import { getPlatforms } from "api/store";
export default {
  data() {
    return {
      product: null,
      products: [],
      params: [],
      form: {},
      selectedPlatform: null,
      platforms: []
    };
  },
  //   1是文本，2是单选，3是多选，4是时间
  computed: {
    product_category() {
      return this.products.find(item => {
        return item.id == this.product;
      }).category_id;
    }
  },
  created() {
    this._getProduct();
    this._getPlatforms()
  },
  methods: {
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
    _getParams(category) {
      getParams({ category }).then(res => {
        if (res.code == 1) {
          this.params = res.data;
          this.assignDefault(res.data);
        }
      });
    },
    _getPlatforms() {
          getPlatforms().then(res => {
            if (res.code == 1) {
              this.platforms = res.data;
              // if (this.isShow1) {
                this.selectedPlatform = this.platforms.map(item => {
                  return item.id;
                });
              // }
            }
          });
        },
    // 选上默认值
    assignDefault(params) {
      params.forEach(item => {
        if (item.options.length > 0) {
          let defaults = item.options
            .filter(item => {
              return item.isDefault == 1;
            })
            .map(item => item.id);
          this.$set(this.form, item.id, defaults);
        } else {
          this.$set(this.form, item.id, "");
        }
      });
    },
    createTable() {
      if (!this.product) {
        this.$message.info("请先选择产品");
        return;
      }
      this._getParams(this.product_category);
    },
    saveTable(){

    }
  }
};
</script>
<style lang="scss" scoped>
.CreateProductSurvey {
  margin-top: 20px;
  text-align: left;
  .content {
    margin-top: 15px;
  }
  .form-item {
    float: left;
    width: 320px;
    //   min-width: 250px;
  }
}
</style>

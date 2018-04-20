<template>
    <div class="CreateProductSurvey">
        <div>
            <el-select v-model="product" filterable placeholder='选择相关产品' size="medium">
                <el-option v-for="(item, index) in products" :key="index" :value="item.id" :label="item.name" v-if="products">
                    <span style="float: left">{{ item.name }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.desc }}</span>
                </el-option>
            </el-select>
            <el-button type="primary" size="medium" @click="createTable">确定创建调查表</el-button>
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
                    <el-date-picker v-model="form[item.id]" placeholder="" v-if="item.inputType==4" size="medium"></el-date-picker>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import { getProducts } from "api/product";
import { getParams } from "api/productSurvey";

export default {
  data() {
    return {
      product: null,
      products: [],
      params: [],
      form: {}
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
      this._getParams(this.product_category);
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

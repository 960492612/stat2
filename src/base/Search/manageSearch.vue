<template>
  <div class="search">
    <div class="selectAdmin search-item">
      <label for="">选择推广员：</label>
      <el-select v-model="selectedAdmin" placeholder="可输入进行搜索" filterable clearable @change="changeAdminMethod" :loading="getAdminOptions" size="medium">
        <el-option v-for="item in admins" :key="item.id" :value="item.id" :label="item.name">{{item.name}}</el-option>
      </el-select>
    </div>
    <div class="selectProduct search-item">
      <label for="">选择产品：</label>
      <el-select v-model="selectedProduct" placeholder="可输入进行搜索" filterable clearable @change="changeProductMethod" :loading="getProductOptions" size="medium" class="select">
        <el-option v-for="item in products" :key="item.id" :value="item.id" :label="item.name">{{item.name}}</el-option>
      </el-select>
    </div>
    <div class="selectDate search-item">
      <label for="">选择时间段：</label>
      <el-date-picker v-model="selectedDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" size="medium" @change="changeDateMethod">
      </el-date-picker>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import { getAdmins } from "api/account";
import { getProducts } from "api/product";
import { shortcuts } from "common/js/util";
import { roles } from "common/js/config";
export default {
  data() {
    return {
      admins: [],
      products: [],
      selectedAdmin: null,
      selectedProduct: null,
      selectedDate: null,
      getAdminOptions: true,
      getProductOptions: true,
      pickerOptions: {
        shortcuts
      }
    };
  },
  created() {
    this._getAdmins();
    this._getProducts();
    this.selectedAdmin = this.changeAdmin;
    this.selectedProduct = this.changeProduct;
    this.selectedDate = this.changeDate;
  },
  computed: {
    ...mapGetters([
      "id",
      "changeAdmin",
      "changeDate",
      // "changeTopChannels",
      // "changeSubChannels",
      "changeProduct"
    ])
  },
  methods: {
    _getAdmins() {
      getAdmins({ role: roles["推广员"] }).then(res => {
        if (res.code == 1) {
          this.admins = res.data;
          this.getAdminOptions = false;
        }
      });
    },
    _getProducts() {
      getProducts().then(res => {
        if (res.code == 1) {
          this.products = res.data;
          this.getProductOptions = false;
        }
      });
    },
    changeAdminMethod(value) {
      // this.$emit("changeAdmin", value);
      this.setChangeAdmin(value);
    },
    changeProductMethod(value) {
      // this.$emit("changeProduct", value);
      this.setChangeProduct(value);
    },
    changeDateMethod(value) {
      // this.$emit("changeDate", value);
      this.setChangeDate(value);
    },
    ...mapMutations({
      setChangeAdmin: "SET_CHANGE_ADMIN",
      setChangeProduct: "SET_CHANGE_PRODUCT",
      setChangeDate: "SET_CHANGE_DATE"
    })
  }
};
</script>
<style lang="scss" scoped>
.search {
  text-align: left;
  margin-top: 20px;
  overflow: hidden;
  label {
    font-size: 14px;
  }
  .search-item{
    float: left;
    margin-right: 5px;
    margin-bottom: 10px;
  }
  // .selectAdmin {
  //   text-align: left;
  //   height: 50px;
  //   line-height: 50px;
  // }
  // .selectProduct {
  //   .select {
  //     margin-left: 14px;
  //   }
  // }
  // .selectDate {
  //   margin-top: 10px;
  // }
}
</style>

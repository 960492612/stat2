<template>
  <div class="search">
    <div class="selectChannel search-item">
      <!-- 可多选 -->

      <label for="" class="label">{{$t('search.label.sc')}}：</label>
      <el-select v-model="selectedTopChannels" :placeholder="$t('search.placeholder.stc')" multiple collapse-tags style="width:217px;" :loading="!topChannels" class="select" @change="changeTopChannelsMethod" size="medium">
        <el-option v-for="(item, index) in topChannels" :key="index" :value="item.id" :label="item.name">{{item.name}}</el-option>
      </el-select>
      <el-select v-model="selectedSubChannels" :placeholder="$t('search.placeholder.ssc')" collapse-tags multiple @change="changeSubChannelsMethod" :loading="!subChannels" :loading-text="selectedTopChannels&&selectedTopChannels.length>0? $t('search.select.loading'):$t('search.select.pstc')" :title="$t('search.select.title')" size="medium">
        <el-option-group v-for="item in subChannels" :key="item.id" :value="item.name" :label="item.name">
          <el-option v-for="_item in item.children" :key="_item.id" :label="_item.name" :value="_item.id">
            <span style="float: left">{{ _item.name }}</span>
            <span style="float: right; color: #8492a6;marginRight:15px; font-size: 13px">{{ _item.desc }}</span>
          </el-option>
        </el-option-group>
      </el-select>
    </div>
    <div class="selectProduct search-item">
      <label for="" class="label">{{$t('search.label.sp')}}：</label>
      <el-select v-model="selectedProduct" :placeholder="$t('search.placeholder.select')" filterable clearable @change="changeProductMethod" :loading="products.length==0" size="medium" class="select">
        <el-option v-for="item in products" :key="item.id" :value="item.id" :label="item.name">{{item.name}}</el-option>
      </el-select>
    </div>
    <div class="selectDate search-item">
      <label for="" class="label">{{$t('search.label.sd')}}：</label>
      <el-date-picker v-model="selectedDate" type="daterange" :start-placeholder="$t('search.placeholder.start')" :end-placeholder="$t('search.placeholder.end')" :picker-options="pickerOptions" @change="changeDateMethod" size="medium">
      </el-date-picker>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import { getProducts } from "api/product";
import {
  getChannelsByOwner,
  getTopChannelsByOwner,
  getSubChannelsByOwnerAndId
} from "api/channel";
import { debounce, shortcuts } from "common/js/util";
export default {
  data() {
    return {
      products: [],
      topChannels: null,
      subChannels: null,
      selectedAdmin: null,
      selectedProduct: null,
      selectedDate: null,
      selectedTopChannels: null,
      selectedSubChannels: null,
      pickerOptions: {
        shortcuts
      }
    };
  },
  created() {
    this._getTopChannelsByOwner();
    this._getProducts();
    // this.selectedAdmin = this.changeAdmin;
    this.selectedProduct = this.changeProduct;
    this.selectedDate = this.changeDate;
    this.selectedTopChannels = this.changeTopChannels;
    this.selectedSubChannels = this.changeSubChannels;
  },
  computed: {
    ...mapGetters([
      "id",
      // "changeAdmin",
      "changeDate",
      "changeTopChannels",
      "changeSubChannels",
      "changeProduct"
    ])
  },
  methods: {
    _getProducts() {
      getProducts().then(res => {
        if (res.code == 1) {
          this.products = res.data;
        }
      });
    },
    _getTopChannelsByOwner() {
      getTopChannelsByOwner(this.id, 0).then(res => {
        if (res.code == 1) {
          this.topChannels = res.data;
        }
      });
    },
    // 查找对应的次级渠道
    changeTopChannelsMethod(value) {
      // 如果存在子级渠道，就不管父级渠道了
      if (!this.selectedSubChannels || this.selectedSubChannels.length == 0) {
        // this.$emit("changeTopChannels", value);
        this.setChangeTopChannels(value);
      }
      // value是数组
      getSubChannelsByOwnerAndId(this.id, value).then(res => {
        this.subChannels = res.data;
      });
    },
    changeSubChannelsMethod(value) {
      // this.$emit("changeSubChannels", value);
      this.setChangeSubChannels(value);
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
      setChangeProduct: "SET_CHANGE_PRODUCT",
      setChangeDate: "SET_CHANGE_DATE",
      setChangeTopChannels: "SET_CHANGE_TOP_CHANNELS",
      setChangeSubChannels: "SET_CHANGE_SUB_CHANNELS"
    })
  }
};
</script>
<style lang="scss" scoped>
.search {
  text-align: left;
  margin-top: 20px;
  overflow: hidden;
  // >div{
  //   float: left;
  // }
  .label {
    // display: inline-block;
    // width: 100px;
    font-size: 14px;
  }
  .search-item{
    float: left;
    margin-right: 5px;
    margin-bottom: 10px;
  }
  // .selectChannel {
  //   text-align: left;
  //   height: 50px;
  //   line-height: 50px;
  // }
  // .selectDate {
  //   margin-top: 10px;
  // }
}
</style>

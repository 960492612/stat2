<template>
  <div class="ProductShelvesStatisListByWeek">
    <div class="search-box">
      <label for="">相关产品：</label>
      <el-select v-model="product" filterable placeholder='选择相关产品' size="medium">
        <el-option v-for="(item, index) in jmProducts" :key="index" :value="item.id" :label="item.name" v-if="jmProducts">
          <span style="float: left">{{ item.name }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.desc }}</span>
        </el-option>
      </el-select>
      <span v-show="activeName == 'second'">
        <i class="el-icon-info" style="font-size:13px;margin-left:10px;"></i>
        <span style="font-size:13px;">转化率计算方式: &nbsp;&nbsp;{{transformTypeText}}</span>
      </span>
    </div>
    <el-tabs v-model="activeName" type="border-card" class="tabs">
      <el-tab-pane label="单周统计表" name="first">
        <div class="search-box">
          <label for="">时间段：</label>
          <el-date-picker v-model="date" format="yyyy 第 WW 周" type="week" placeholder="选择时间段" size="medium"></el-date-picker>
          <!-- 平台 -->
          <label for="">相关平台：</label>
          <el-select v-model="selectedPlatform" placeholder="选择相关销售平台" filterable clearable @change="changePlatformMethod" :disabled="!isShow1" size="medium" multiple collapse-tags>
            <el-option v-for="(item, index) in platforms" :key="index" :value="item.id" :label="item.name">{{item.name}}</el-option>
          </el-select>
          <el-button type="primary" @click="selectSingle" size="medium">查询</el-button>
          <json-excel class="btn btn-default" :data="datas" :fields="json_fields" :name="xlsName" v-if="datas">
            <el-button type="success" icon="el-icon-download" size="medium">
              导出Excel
            </el-button>
          </json-excel>
        </div>
        <div class="content">
          <myTable :datas="datas"></myTable>
        </div>
      </el-tab-pane>
      <el-tab-pane label="多周变化统计图" name="second">
        <div class="search-box">
          <el-date-picker v-model="beginTime" format="yyyy 第 WW 周" type="week" placeholder="选择起始周" size="medium" title="不选则从最早开始"></el-date-picker>
          <el-date-picker v-model="endTime" format="yyyy 第 WW 周" type="week" placeholder="选择结束周" size="medium" title="不选则以当前时间为准"></el-date-picker>
          <el-select v-model="groupField" placeholder="选择查询的分组方式" size="medium" @change="changeGroupField">
            <el-option v-for="(item, index) in fields" :key="index" :value="item.value" :label="item.name">{{item.name}}</el-option>
          </el-select>
          <el-select v-model="selectedPlatform1" placeholder="选择平台" @change="changePlatform1" v-show="groupField=='platform_id'||groupField=='store_id'" size="medium" :disabled="!isShow1">
            <el-option v-for="(item, index) in platforms" :key="index" :value="item.id" :label="item.name">{{item.name}}</el-option>
          </el-select>
          <el-select v-model="selectedStore" placeholder="选择店铺" v-show="groupField=='store_id'" size="medium">
            <el-option v-for="(item, index) in stores" :key="index" :value="item.id" :label="item.name">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.desc }}</span>
            </el-option>
          </el-select>

          <el-button type="primary" @click="selectMutiple" size="medium">查询</el-button>
          
        </div>
        <myChart :data="datas1"></myChart>
      </el-tab-pane>

    </el-tabs>
    <div class="search-box">

    </div>

  </div>
</template>
<script>
// import { getInfoByWeek, getGroupList } from "api/productShelves";
// import { getPlatforms, findStores } from "api/store";
// import { mapGetters } from "vuex";
// import myTable from "../common/table";
// import myChart from "../common/chart";
// import { getProducts } from "api/product";
import { formatTime, formatWeek, getWeekDates } from "common/js/util";
// import { roles, transformTypes } from "common/js/config";
import { mixin } from "../common/mixin";
export default {
  mixins: [mixin],
  data() {
    return {
      type: 0,
      
    };
  },
  computed: {
    params() {
      return {
        week: formatWeek(this.date),
        product: this.product,
        platform: this.selectedPlatform
      };
    },
    params1() {
      return {
        beginTime: formatWeek(this.beginTime),
        endTime: formatWeek(this.endTime),
        product_id: this.product,
        type: this.type, //周
        groupField: this.groupField,
        groupValue: this.selectedStore
          ? this.selectedStore
          : this.selectedPlatform1 ? this.selectedPlatform1 : null
      };
    },
    xlsName() {
      return `${getWeekDates(this.params.week)}的${
        this.datas ? this.product : "产品"
      }上架分析表.xls`;
    }
  },

  methods: {}
};
</script>
<style lang="scss" scoped>
.ProductShelvesStatisListByWeek {
  margin-top: 20px;
  .search-box {
    text-align: left;
  }
  .tabs {
    // margin-left: 5px;
    margin-top: 20px;
  }
  .btn {
    display: inline-block;
  }
}
</style>

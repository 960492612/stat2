<template>
    <div>
        <div class="search">
            <label for="">分组统计：</label>
            <el-checkbox-group v-model="groupList" style="display: inline-block;height: auto;overflow:inherit;">
                <el-checkbox label="发运仓库" border size="medium"></el-checkbox>
                <el-checkbox label="国家" border size="medium"></el-checkbox>
                <el-checkbox label="时间" border size="medium"></el-checkbox>
            </el-checkbox-group>
            <label for="">sku筛选：</label>
            <el-input type="primary" size="medium" v-model="skuFilter" style="width:150px;" placeholder="输入sku"></el-input>
            <label for="">产品数量过滤：</label>
            <el-input type="primary" size="medium" v-model="totalFilter" style="width:150px;">
                <el-button slot="append" @click="searchDataByDate">确认</el-button>
            </el-input>
        </div>
        <div class="content">
            <el-table :data="datas" max-height="650">
                <el-table-column label="sku组合" prop="code" align="center" width="250">
                    <template slot-scope="scope">
                        <div v-html="wrapString(scope.row.code)">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="产品名称" prop="name" header-align="center">
                    <template slot-scope="scope">
                        <div v-html="wrapString(scope.row.name)">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="产品数量" prop="total" align="center" width="200" sortable></el-table-column>
                <el-table-column label="订单数" prop="orderNumber" width="200" align="center" sortable></el-table-column>
                <el-table-column :label="item" v-for="(item, index) in  groupList" :key="index" :prop="checkboxLable[item]" align="center"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { getSkuGroupInfo } from "api/logistics";
import { logisticsMixin } from "../../common/mixin";
const checkboxLable = {
  发运仓库: "warehouse",
  国家: "contry",
  时间: "date"
};
export default {
  mixins: [logisticsMixin],
  data() {
    return {
      origin: [],
      datas: [],
      groupList: [],
      checkboxLable: checkboxLable,
      skuFilter: null,
      totalFilter: 0
    };
  },
  computed: {
    field() {
      return this.groupList.map(item => {
        return checkboxLable[item];
      });
    }
  },
  created() {},
  watch: {
    groupList() {
      this.searchDataByDate();
    },
    skuFilter(val) {
      if ((!val || val == "")) {
        this.datas = this.origin;
        return;
      }
      this.datas = this.origin.filter(item => {
        return new RegExp(val, "i").test(item.code);
      });
    }
  },
  methods: {
    searchDataByDate() {
      let isOk = this.transformDate();
      if (!isOk) {
        return;
      }
      let { beginDate, endDate } = isOk;
      this.loadStatus == 1;
      getSkuGroupInfo({
        beginDate,
        endDate,
        field: this.field,
        totalFilter: this.totalFilter
      }).then(res => {
        if (res.code == 1) {
          if (res.data.length == 0) {
            this.loadStatus = 0;
            return;
          }
          this.origin = JSON.parse(JSON.stringify(res.data));
          let temp = this.skuFilter 
          this.skuFilter = null
          this.datas = res.data;
          this.$nextTick(()=>{
              this.skuFilter = temp
          })
        } else {
          this.loadStatus = 0;
        }
      });
    },
    wrapString(name) {
      return name.replace(/,/g, ";<br/>");
    }
  }
};
</script>

<style>
</style>

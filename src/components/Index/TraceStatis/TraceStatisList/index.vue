<template>
  <div class="TraceStatisList">
    <div class="search-tool">
      <div class="selectAdmin" v-if="role != 6">
        <el-select v-model="selectedAdmin" placeholder="选择推广员" filterable clearable @change="changeAdminMethod" :loading="getAdminOptions">
          <el-option v-for="item in admins" :key="item.id" :value="item.id" :label="item.name">{{item.name}}</el-option>
        </el-select>
      </div>
      <!-- 产品 -->
      <el-select v-model="selectedProduct" placeholder="选择相关产品" filterable clearable @change="changeProductMethod">
        <el-option v-for="(item, index) in products" :key="index" :value="item" :label="item">{{item}}</el-option>
      </el-select>
      <!-- 平台 -->
      <el-select v-model="selectedPlatform" placeholder="选择相关销售平台" filterable clearable @change="changePlatformMethod">
        <el-option v-for="(item, index) in platforms" :key="index" :value="item" :label="item">{{item}}</el-option>
      </el-select>
      <el-date-picker v-model="dateRange" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" @change="changeDate">
      </el-date-picker>

      <!-- <el-select v-model="selectedKey" filterable clearable placeholder="选择推广条目" class="select">
        <el-option v-for="(item, index) in datas" :key="index" :value="item.key" :label="item.key"></el-option>
      </el-select> -->
    </div>
    <el-table :data="filteredData" show-summary max-height="700" :summary-method="getSummaries" @row-click="rowClick" ref="table">
      <div slot="empty">
        <i class="el-icon-loading" v-show="loadStatus == 1"></i> {{loadingText}}</div>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.children" style="width:auto;float:left;" :show-header="false">
            <el-table-column align="left" width="230"></el-table-column>
            <el-table-column label="渠道" prop="channel" align="left" sortable width="150"></el-table-column>
            <el-table-column label="pv" prop="pv" align="left" sortable width="120"></el-table-column>
            <el-table-column label="uv" prop="uv" align="left" sortable width="120"></el-table-column>
            <el-table-column prop="itemDesc" label="描述" width="200" class-name="expend-column" align="center">
            </el-table-column>
            <el-table-column prop="oper" :label="$t('oper.oper')" align="center" fixed="right" min-width="180">
              <template slot-scope="scope">
                <el-button @click.native.prevent="_getVisitInfo(scope.row.itemId)" type="text">
                  查看详情
                </el-button>
                
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="序号" type="index" align="left" width="80"></el-table-column>

      <el-table-column label="产品" prop="product" align="left" sortable width="150"></el-table-column>
      <el-table-column label="发布渠道数量" prop="children.length" align="left" width="150"></el-table-column>
      <el-table-column label="pv" prop="pv" align="left" sortable width="120"></el-table-column>
      <el-table-column label="uv" prop="uv" align="left" sortable width="120"></el-table-column>

      <el-table-column label="原始链接" prop="url" align="left" show-overflow-tooltip :formatter="urlFormatter" width="300"></el-table-column>
      <el-table-column label="相关店铺" prop="store" align="center" width="180" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="相关平台" prop="platform" align="center" width="150"></el-table-column>
      <el-table-column label="所属" prop="owner" align="center" width="150" v-show="!isPromoter"></el-table-column>
      <el-table-column label="描述" prop="desc" align="left" show-overflow-tooltip></el-table-column>
      <!-- <el-table-column label="注册时间" prop="time" align="left" sortable></el-table-column> -->
    </el-table>
    <el-dialog title="访问详情" :visible.sync="showInfo" center>
      <visit-info :datas="visitInfoData"/>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { getAllVisits , getVisitInfo} from "api/traceStatis";
import { getAdmins } from "api/account";
import { roles } from "common/js/config";
import VisitInfo from '../VisitInfo'
import { formatTime, shortcuts, isInDateRange } from "common/js/util";
export default {
  data() {
    return {
      admins: [],
      getAdminOptions: true,
      selectedAdmin: null,
      selectedProduct: null,
      selectedPlatform: null,
      datas: [],
      filteredData: [],
      loadStatus: 1,
      dateRange: null,
      products: [],
      platforms: [],
      // selectedKey: "",
      pickerOptions: {
        shortcuts
      },
      showInfo: false,
      visitInfoData: []
    };
  },
  computed: {
    // 计算结果并构建成表格可用的数据
    tableDatas() {},
    loadingText() {
      return this.loadStatus == 1 ? "加载中" : "暂无数据";
    },
    params() {
      return {
        owner_id: this.selectedAdmin,
        begin: this.dateRange && this.dateRange[0].getTime(),
        end: this.dateRange && this.dateRange[1].getTime()
      };
    },
    isPromoter() {
      return this.role == roles["推广员"];
    },
    ...mapGetters(["id", "role"])
  },
  created() {
    if (this.isPromoter) {
      this.selectedAdmin = this.id;
    } else {
      this._getAdmins();
    }
    this._getAllVisits();
  },
  components:{
    VisitInfo
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
    // 时间和推广员的选择，数据从数据库重新取
    changeAdminMethod() {
      this._getAllVisits();
    },
    changeDate() {
      this._getAllVisits();
    },
    changeProductMethod() {
      // let ret = []
      this.changeMethod();
    },
    changePlatformMethod() {
      this.changeMethod();
    },
    changeMethod() {
      this.filteredData = this.datas.filter(item => {
        return (
          (!this.selectedProduct || item.product == this.selectedProduct) &&
          (!this.selectedPlatform || item.platform == this.selectedPlatform)
        );
      });
      if (this.filteredData.length == 0) {
        this.loadStatus = 0;
      }
    },
    generateData(data) {
      let orderByGroup = {};
      let orderByProduct = {};
      let orderByPlatform = {};
      data.forEach(item => {
        if (orderByGroup[item.groupId] == undefined) {
          orderByGroup[item.groupId] = {
            ...item,
            ...{ children: [item] }
          };
        } else {
          orderByGroup[item.groupId].pv += item.pv;
          orderByGroup[item.groupId].uv += item.uv;
          orderByGroup[item.groupId].children.push(item);
        }

        // 筛选出产品
        if (orderByProduct[item.product] == undefined) {
          orderByProduct[item.product] = 1;
        }
        // 筛选出平台
        if (orderByPlatform[item.platform] == undefined) {
          orderByPlatform[item.platform] = 1;
        }
      });
      this.products = Object.keys(orderByProduct);
      this.platforms = Object.keys(orderByPlatform);
      return Object.values(orderByGroup);
    },
    _getAllVisits() {
      getAllVisits(this.params).then(res => {
        if (res.code == 1) {
          // 序列化数据

          this.datas = this.generateData(res.data);
          // this.filteredData = this.datas;
          this.changeMethod();
          //   this.loadChart();
        } else {
          this.$message.error("加载失败");
        }
        this.loading = false;
      });
    },
    // 访问详情
    _getVisitInfo(id){
      getVisitInfo({itemId: id}).then(res=>{
        if(res.code == 1){
          this.showInfo = true
          this.visitInfoData = res.data.reverse()
        }
      })
    },
    urlFormatter(row, column, value) {
      return decodeURIComponent(value);
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
          return;
        }
        if (column.property == "pv" || column.property == "uv") {
          const values = data.map(item => {
            return Number(item[column.property]);
          });
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            // sums[index] += " 次";
          } else {
            sums[index] = "";
          }
        }
      });

      return sums;
    },
    rowClick(row) {
      this.$refs.table.toggleRowExpansion(row);
    }
  }
};
</script>
<style lang="scss" scoped>
.TraceStatisList {
  // border-top: 1px solid #eee;
  margin-top: 20px;
  // padding-top: 25px;
  .search-tool {
    padding-bottom: 20px;
    border-bottom: 1px solid #ddd;
    text-align: left;
    .selectAdmin {
      float: left;
      margin-right: 10px;
    }
    .label1 {
      font-size: 14px;
      margin-right: 15px;
    }
    .label2 {
      font-size: 14px;
      margin-left: 15px;
    }
    .tip {
      margin-left: 5px;
    }
    .select {
      width: 135px;
    }
  }
}
</style>


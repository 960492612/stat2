<template>
  <div class="ProductShelvesList">
    <el-tabs v-model="activeName" type="border-card" class="tabs" @tab-click="tabClick">

      <el-tab-pane label="按周统计表" name="Week">
        <el-table :data="datasByWeek" border style="float:left;width:auto;" height="650" ref="table1">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column label="平台" prop="platform" align="center" width="100" :filter-method="filterPlatform" :filters="platforms">
          </el-table-column>
          <el-table-column label="星期" prop="week" align="center" width="150" :filter-method="filterWeek" :filters="weeks">
            <template slot-scope="scope">
              <el-popover trigger="click" placement="right">
                <p style="maxWidth:350px;">
                  {{_getWeekDates(scope.row.week)}}
                </p>
                <p slot="reference" :title="$t('statis.tip')">{{weekFormater(scope.row.week)}}</p>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="产品" prop="product" align="center" width="100" :filter-method="filterProduct" :filters="products">
          </el-table-column>
          <el-table-column label="店铺" prop="store" align="center" width="150">
          </el-table-column>
          <el-table-column prop="oper" :label="$t('oper.oper')" class-name="column" width="200" align="center">
            <template slot-scope="scope">
              <el-button @click.native.prevent.stop="editRow(scope.row, 0)" type="info" size="mini" class="btn" plain>
                修改
              </el-button>
              <el-button @click.native.prevent.stop="deleteRow(scope.row, 0)" type="danger" size="mini" class="btn" plain>
                {{$t('oper.delete')}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="按月统计表" name="Month">
        <el-table :data="datasByMonth" border style="float:left;width:auto;" height="650">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column label="平台" prop="platform" align="center" width="100" :filter-method="filterPlatform" :filters="platforms">
          </el-table-column>
          <el-table-column label="月份" prop="month" align="center" width="150" :formatter="monthFormater" :filter-method="filterMonth" :filters="weeks">
          </el-table-column>
          <el-table-column label="产品" prop="product" align="center" width="100" :filter-method="filterProduct" :filters="products">
          </el-table-column>
          <el-table-column label="店铺" prop="store" align="center" width="150">
          </el-table-column>
          <el-table-column prop="oper" :label="$t('oper.oper')" class-name="column" width="200" align="center">
            <template slot-scope="scope">
              <el-button @click.native.prevent.stop="editRow(scope.row, 1)" type="info" size="mini" class="btn" plain>
                修改
              </el-button>
              <el-button @click.native.prevent.stop="deleteRow(scope.row, 1)" type="danger" size="mini" class="btn" plain>
                {{$t('oper.delete')}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

    </el-tabs>
    <el-dialog :title="dialogTitle" :visible.sync="showDetail" width="80%">
      <single-shelve-detail :data="activedData" :type="currentType" @refresh="refreshTable" />
    </el-dialog>
  </div>
</template>
<script>
import { getAllByWeek, deleteShelve, getAllByMonth } from "api/productShelves";
import { mapGetters } from "vuex";
import {
  getWeekDates,
  numberToWeekStr,
  numberToMonthStr
} from "common/js/util";
import SingleShelveDetail from "../SingleShelveDetail";
export default {
  data() {
    return {
      datasByWeek: [],
      datasByMonth: [],
      activeName: "Week",
      contactObjectByWeek: null,
      contactObjectByMonth: null,
      weeks: [],
      platforms: [],
      products: [],
      showDetail: false,
      activedData: [], //选中即将修改的数据
      currentType: 0
    };
  },
  created() {
    this._getAllByWeek();
    // this._getAllByMonth();
  },
  activated() {
    this._getAllByWeek();
  },
  computed: {
    dialogTitle() {
      if (this.activedData.length <= 0) {
        return "";
      }
      return (
        this.activedData[0].platform +
        "-" +
        this.activedData[0].product +
        "-" +
        (this.activedData[0].week
          ? this.activedData[0].week
          : this.activedData[0].month)
      );
    },
    ...mapGetters(["platform", "id"])
  },
  watch: {
    // activeName(oldval, newval) {
    //   newval == "week" ? this._getAllByWeek() : this._getAllByMonth();
    // }
  },
  components: {
    SingleShelveDetail
  },
  methods: {
    _getAllByWeek() {
      getAllByWeek({ platform: this.platform }).then(res => {
        if (res.code == 1) {
          this.datasByWeek = res.data;
          this.groupByProperty(res.data);
          this.contactObjectByWeek = this.initContactArray(res.data, [
            "platform",
            "week",
            "product"
          ]);
        }
      });
    },
    _getAllByMonth() {
      getAllByMonth({ platform: this.platform }).then(res => {
        if (res.code == 1) {
          this.datasByMonth = res.data;
          this.groupByProperty(res.data);
          this.contactObjectByMonth = this.initContactArray(res.data, [
            "platform",
            "month",
            "product"
          ]);
        }
      });
    },
    groupByProperty(data) {
      let groupByWeek = {};
      let groupByPlatform = {};
      let groupByProduct = {};
      data.forEach(item => {
        if (item["week"] && groupByWeek[item["week"]] == undefined) {
          groupByWeek[item["week"]] = {
            text: numberToWeekStr(item.week),
            value: item.week
          };
        }
        if (item["month"] && groupByWeek[item["month"]] == undefined) {
          groupByWeek[item["month"]] = {
            text: numberToMonthStr(item.month),
            value: item.month
          };
        }
        if (groupByPlatform[item["platform"]] == undefined) {
          groupByPlatform[item["platform"]] = {
            text: item.platform,
            value: item.platform
          };
        }
        if (groupByProduct[item["product"]] == undefined) {
          groupByProduct[item["product"]] = {
            text: item.product,
            value: item.product
          };
        }
      });
      this.weeks = Object.values(groupByWeek);
      this.platforms = Object.values(groupByPlatform);
      this.products = Object.values(groupByProduct);
    },

    initContactArray(data, properties) {
      let ret = {};
      properties.forEach(property => {
        let dot = 0;
        let contactArray = [1];
        for (let i = 1, length = data.length; i < length; i++) {
          if (data[i][property] == data[i - 1][property]) {
            contactArray.push(0);
            contactArray[dot] += 1;
          } else {
            contactArray.push(1);
            dot = i;
          }
        }
        ret[property] = contactArray;
      });
      return ret;
    },
    tabClick() {
      this["_getAllBy" + this.activeName]();
    },
    editRow(row, type) {
      this.showDetail = true;
      this.activedData = [row];
      this.currentType = type;
      // console.log(row);
    },
    refreshTable() {
      this.currentType == 0 ? this._getAllByWeek() : this._getAllByMonth();
    },
    deleteRow(row, type) {
      if (row.admin_id != this.id) {
        this.$message.error("您无权删除");
        return;
      }

      this.$confirm(
        this.$t("product.delete.confirm"),
        this.$t("product.delete.tip"),
        {
          confirmButtonText: this.$t("product.delete.sure"),
          cancelButtonText: this.$t("product.delete.cancel"),
          type: "warning"
        }
      ).then(() => {
        deleteShelve({ id: row.id, type })
          .then(res => {
            if (res.code == 1) {
              this.$message({
                type: "success",
                message: "删除成功"
              });
              type == 0 ? this._getAllByWeek() : this._getAllByMonth();
              // this.tableData.splice(index, 1);
            } else {
              this.$message.error(this.$t("product.delete.error"));
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: this.$t("product.delete.canceled")
            });
          });
      });
    },
    spanRowMethodByWeek({ row, column, rowIndex, columnIndex }) {
      if (
        this.contactObjectByWeek &&
        Object.keys(this.contactObjectByWeek).some(property => {
          return column.property == property;
        })
      ) {
        let _row = this.contactObjectByWeek[column.property][rowIndex];
        let _col = _row > 0 ? 1 : 0;
        return [_row, _col];
      }
    },
    spanRowMethodByMonth({ row, column, rowIndex, columnIndex }) {
      if (
        this.contactObjectByMonth &&
        Object.keys(this.contactObjectByMonth).some(property => {
          return column.property == property;
        })
      ) {
        let _row = this.contactObjectByMonth[column.property][rowIndex];
        let _col = _row > 0 ? 1 : 0;
        return [_row, _col];
      }
    },
    weekFormater(value) {
      return numberToWeekStr(value);
    },
    _getWeekDates(week) {
      return getWeekDates(week);
    },
    monthFormater(row, column, value) {
      return numberToMonthStr(value);
    },
    filterWeek(value, row) {
      return row.week == value;
    },
    filterMonth(value, row) {
      return row.month == value;
    },
    filterPlatform(value, row) {
      return row.platform == value;
    },
    filterProduct(value, row) {
      return row.product == value;
    }
    // filterChange(){
    //   let temp = this.datasByWeek
    //   this.datasByWeek = []
    //   this.$nextTick(()=>{
    //     this.datasByWeek = temp
    //   })
    //   this.$refs.table1.doLayout()
    // }
  }
};
</script>

<style lang="scss">
.ProductShelvesList {
  margin-top: 20px;
  .tabs {
    text-align: center;
  }
  .el-checkbox-group {
    height: auto;
  }
}
</style>

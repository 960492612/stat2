<template>
  <div>
    <div class="ProductSurveyList">
      <el-button type="primary" @click="isShowSortBox=true">调整顺序</el-button>

      <el-table :data="tableData" style="width:100%;" max-height="700">
        <div slot="empty">
          <i class="el-icon-loading" v-show="loadStatus == 1"></i> {{loadingText}}</div>
        <el-table-column type="expand">
          <template slot-scope="props">
            <span class="option-title">选项：</span>
            <div class="option-list">
              <span v-for="(item ,index) in props.row.options" :key="index">
                <i class="el-icon-check" v-show="item.isDefault == 1" style="color:red;font-size:16px;"></i>{{item.name}}</span>
              <span v-if="props.row.options.length==0">无</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index" width="100" align="center">
        </el-table-column>
        <el-table-column prop="name" label="参数名" width="180" align="center">
        </el-table-column>
        <el-table-column prop="type" label="参数类型" width="180" align="center" :formatter="paramsTypeFormater" :filter-method="filterType" :filters="paramTypes">
        </el-table-column>
        <el-table-column prop="inputType" label="输入类型" width="180" align="center" :formatter="inputTypeFormater">
        </el-table-column>

        <el-table-column prop="oper" :label="$t('oper.oper')" align="center">
          <template slot-scope="scope">
            <el-button @click.native.prevent="editRow(scope.row)" type="text">
              {{$t('oper.edit')}}
            </el-button>
            <el-button @click.native.prevent="deleteRow(scope.row, scope.$index)" type="text">
              {{$t('oper.delete')}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="拖拽调整排序" :visible.sync="isShowSortBox">
      <draggable v-model="tableData" class="sort-box">
        <transition-group>
          <div v-for="(element, index) in tableData" :key="element.id" class="sort-item">
            <div class="inner">{{index+1}}: {{element.name}}</div>
          </div>
        </transition-group>
      </draggable>
      <el-button type="success" @click="saveSort">保存调整</el-button>
    </el-dialog>
  </div>
</template>
<script>
import { getAllParams, deleteParam, saveParamsSort } from "api/productSurvey";

import { mapActions, mapGetters } from "vuex";
import { PARAMTYPES, INPUTTYPES } from "common/js/config";
import draggable from "vuedraggable";
export default {
  data() {
    return {
      tableData: [],
      loadStatus: 1,
      productCates: [],
      isShowSortBox: false
      //   currentSurvey: null,
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
    paramTypes() {
      let ret = [];
      for (let i in PARAMTYPES) {
        ret.push({
          value: i,
          text: PARAMTYPES[i]
        });
      }
      return ret;
    },
    ...mapGetters(["id"])
  },
  created() {
    this._getAllParams();
  },
  activated() {
    // this._getPublishSurveys();
  },
  components: {
    draggable
  },
  methods: {
    _getAllParams() {
      getAllParams().then(res => {
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

    paramsTypeFormater(row) {
      return PARAMTYPES[row.type];
    },
    inputTypeFormater(row) {
      return INPUTTYPES[row.inputType];
    },
    filterType(value, row) {
      return row.type == value;
    },
    editRow(row) {
      this.$router.push({ name: "EditProductSurveyParams", params: row });
    },
    saveSort() {
      for (let i = 0; i < this.tableData.length; i++) {
        this.tableData[i].sort = i+1;
      }
      saveParamsSort({ params: this.tableData }).then(res => {
        if (res.code == 1) {
          this.$message.success('保存成功')
          this.isShowSortBox = false
          this._getAllParams()
        }
      });
    },
    deleteRow(row, index) {
      this.$confirm("此操作将永久删除该参数", this.$t("product.delete.tip"), {
        confirmButtonText: this.$t("product.delete.sure"),
        cancelButtonText: this.$t("product.delete.cancel"),
        type: "warning"
      })
        .then(() => {
          deleteParam({ id: row.id }).then(res => {
            if (res.code == 1) {
              this.$message({
                type: "success",
                message: this.$t("product.delete.success")
              });
              this._getAllParams();
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
    }
  }
};
</script>
<style lang="scss" scoped>
.ProductSurveyList {
  margin-top: 20px;
  text-align: left;
  .option-title {
    float: left;
    height: 44px;
    line-height: 44px;
  }
  .option-list {
    float: left;
    height: 44px;
    line-height: 44px;
    margin-left: 20px;
    span {
      border-right: 1px solid #555;
      padding-left: 15px;
      padding-right: 15px;
    }
  }
}
.sort-box {
  margin: 0 auto;
  // width: 817px;
  // padding: 0 20px;
  overflow: hidden;
  .sort-item {
    float: left;
    width: 25%;
    height: 44px;
    // margin-right: -10px;
    margin-bottom: 10px;
    line-height: 44px;
    // padding-left: 10px;

    .inner {
      border: 1px solid #222;
      border-radius: 4px;
      cursor: move;
      margin-right: 10px;
    }
  }
}
</style>

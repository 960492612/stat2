<template>
  <div class="traceList">
  
    <el-table :data="data" @row-click="rowClick" ref="table" height="700" @expand-change="expandChange">
      <div slot="empty">
        <i class="el-icon-loading" v-show="loadStatus == 1"></i> {{loadingText}}</div>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="traceItems[props.row.id]" style="width:auto;float:left;" :show-header="true">
            <div slot="empty">
              <i class="el-icon-loading" v-show="itemLoadStatus == 1"></i> {{itemLoadingText}}</div>
            <el-table-column prop="channel" label="渠道" class-name="expend-column" align="center" width="200">
            </el-table-column>

            <el-table-column prop="link" label="追踪链接" class-name="expend-column" align="center" width="300" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="time" label="注册时间" width="200" class-name="expend-column" align="center" :formatter="timeFormatter">
            </el-table-column>
            <el-table-column prop="desc" label="描述" width="200" class-name="expend-column" align="center" >
            </el-table-column>
            <el-table-column class-name="expend-column" align="center" width="300">
              <template slot-scope="scope">
                <el-button @click="copyToClip(scope.row.link)" size="small">复制到剪切板</el-button>
                <el-button @click.native.prevent="editItem(scope.row)" type="text" size="mini" class="btn">
                  {{$t('oper.edit')}}
                </el-button>

                <el-button @click.native.prevent="deleteTraceItem(scope.row)" type="text" size="mini" class="btn">
                  {{$t('oper.delete')}}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="序号" type="index" align="center" width="50"></el-table-column>
      <el-table-column label="相关产品" prop="product" align="center" width="150" class-name="column"></el-table-column>
      <el-table-column label="相关店铺" prop="store" align="center" width="150" class-name="column" show-overflow-tooltip></el-table-column>
      <el-table-column label="店铺所属平台" prop="platform" align="center" width="200" class-name="column"></el-table-column>
      <!-- <el-table-column label="店铺主管" prop="storeOwner" align="center" width="150"></el-table-column> -->
      <el-table-column label="原始链接" prop="url" :formatter="urlFormatter" align="center" :show-overflow-tooltip="true" width="250" class-name="column">
      </el-table-column>
      <el-table-column label="注册时间" prop="time" :formatter="timeFormatter" sortable align="center" width="200" class-name="column"></el-table-column>
      <el-table-column label="描述" prop="desc" align="center" :show-overflow-tooltip="true" class-name="column"></el-table-column>
      <el-table-column label="操作" align="center" min-width="200" fixed="right" class-name="column" ref="oper">
        <template slot-scope="scope">
          <el-button size="mini" @click.stop="addTrace(scope.$index, scope.row)" type="plain">添加推广渠道</el-button>
          <el-dropdown>
            <span class="el-dropdown-link">
              more
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button size="mini" @click.stop="editSubject(scope.row)" class="hidden">编辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button size="mini" type="danger" @click.stop="deleteTraceGroup(scope.row)" class="hidden">删除</el-button>
              </el-dropdown-item>

            </el-dropdown-menu>
          </el-dropdown>

        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {
  deleteTraceItem,
  deleteTraceGroup,
  getTraceGroup,
  getTraceItem
} from "api/trace";
import { mapGetters } from "vuex";
import copy from "copy-to-clipboard";
import { formatTime } from "common/js/util";
export default {
  data() {
    return {
      data: [],
      loadStatus: 1,
      itemLoadStatus: 1,
      traceItems: {}
    };
  },
  computed: {
    tableData() {},
    loadingText() {
      return this.loadStatus == 1 ? "加载中" : "暂无数据";
    },
    itemLoadingText() {
      return this.itemLoadStatus == 1 ? "加载中" : "暂无数据";
    },
    ...mapGetters(["id"])
  },
  created() {
    // this._getAllRegistersById(this.id);
    this._getTraceGroup();
  },
  methods: {
    _getTraceGroup() {
      getTraceGroup({ owner_id: this.id }).then(res => {
        this.selectActions(res);
      });
    },
    selectActions(res) {
      if (res.code == 1) {
        if (res.data.length == 0) {
          this.loadStatus = 0;
          // 先置空
          this.data = [];
          return;
        }
        // this.sortByDegree(res.data);
        this.data = res.data;
      } else {
        this.$message("查询失败");
        this.loadStatus = 0;
      }
    },
    timeFormatter(row, column) {
      return formatTime(row.time);
    },
    urlFormatter(row, column) {
      return decodeURIComponent(row.url);
    },
    getTraceItems(id) {
      getTraceItem({ group_id: id }).then(res => {
        if (res.code == 1) {
          if (res.data.length == 0) {
            this.itemLoadStatus = 0;
            return;
          }
          let data = res.data.map(item => {
            return {
              id: item.id,
              channel: item.channel,
              hash: item.hash,
              domain: item.domain,
              link: `http://${item.domain}/statis/proxy.html#${item.hash}`,
              desc: item.desc,
              time: item.time,
              subChannel_id: item.subChannel_id,
              topChannel_id: item.topChannel_id
            };
          });
          this.$set(this.traceItems, id, data);
        } else {
          this.itemLoadStatus = 0;
        }
      });
    },
    // 点击打开详情
    rowClick(row, event, column) {
      this.getTraceItems(row.id);
      this.$refs.table.toggleRowExpansion(row);
    },
    		
    expandChange(row){
      this.getTraceItems(row.id);
    },
    addTrace(index, row) {
      this.$router.push({
        name: "AddTraceItem",
        params: { data: row }
      });
    },
    editSubject(row) {
      // row.url = decodeURIComponent(row.url);
      this.$router.push({
        name: "EditTraceGroup",
        params: { data: row, id: row.owner_id }
      });
    },
    editItem(row) {
      // row.url = decodeURIComponent(row.url);
      this.$router.push({
        name: "EditTraceItem",
        params: { data: row }
      });
    },
    deleteTraceGroup(row) {
      this.$confirm("此操作将永久删除该主题组, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteTraceGroup(row.id).then(res => {
            if (res.code == 1) {
              // this.data.splice(index, 1);
              this.$message({
                message: "删除成功",
                type: "success",
                onClose: () => {
                  this.traceItems = {};
                  this._getTraceGroup();
                }
              });
            } else {
              this.$message({
                message: "删除失败",
                type: "warning"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    deleteTraceItem(row) {
      this.$confirm("此操作将永久删除该渠道链接, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteTraceItem(row.id).then(res => {
            if (res.code == 1) {
              // this.data.splice(index, 1);
              this.$message({
                message: "删除成功",
                type: "success",
                onClose: () => {
                  this.traceItems = {};
                  this._getTraceGroup();
                }
              });
            } else {
              this.$message({
                message: "删除失败",
                type: "warning"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    copyToClip(link) {
      copy(link);
      this.$message("复制成功");
    }
  },
  watch: {}
};
</script>
<style lang="scss">
.traceList {
  margin-top: 25px;
  .el-table__expanded-cell[class*="cell"] {
    padding: 25px 40px 25px 80px;
    // background: rgba(30, 179, 216, 0.233);
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background: #fff;
  }
  .column {
    font-weight: bold;
    padding: 5px;
    font-size: 15px;
    .cell {
      font-weight: bold;
    }
  }
  .expend-column {
    padding: 5px;
    color: #666;
    // background: rgba(30, 179, 216, 0.233);
  }
}
</style>

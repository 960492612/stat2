<template>
  <div class="total-table">
    <div class="export">

      <json-excel class="btn btn-default" :data="xlsData" :fields="json_fields" :name="xlsName">
        <el-button type="success" icon="el-icon-download">
          导出当前数据的Excel表格
        </el-button>

      </json-excel>
    </div>
    <h4 class="total-table-title">{{$t('statis.totalTitle')}}</h4>
    <el-table :data="totalData" style="width:100%;" border stripe show-summary header-cell-class-name="header-cell" ref="table" :summary-method="getSummaries" max-height="680">
      <div slot="empty">
        <i class="el-icon-loading" v-show="loadStatus == 1"></i> {{loadingText}}
        <el-button type="primary" v-show="loadStatus == 0" @click="init">获取数据</el-button>
      </div>
      <el-table-column type="index" :label="$t('statis.label.index')" width="60" align="center">
      </el-table-column>
      <!-- 只有产品的时候 -->
      <el-table-column :label="$t('role.admin')" width="80" align="center" prop="admin" v-if="!this.selectAdmin">
      </el-table-column>
      <el-table-column prop="content" :label="$t('statis.label.content')" width="180" align="center" class-name="content">
        <template slot-scope="scope">
          <el-popover trigger="click" placement="right">
            <p style="maxWidth:300px;">
              {{scope.row.content}}
            </p>
            <p slot="reference" :title="$t('statis.tip')">{{contentFormat(scope.row.content)}}</p>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="product" sortable :label="$t('statis.label.product')" width="130" align="center" v-if="!this.selectProduct" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="channel" sortable :label="$t('statis.label.channel')" width="150" align="center" show-overflow-tooltip>
      </el-table-column>
      <!-- 阅读量 -->
      <el-table-column prop="readCount" :label="$t('statis.label.readCount')" width="125" align="center" class-name="number" sortable>
      </el-table-column>
      <!-- 点赞 -->
      <el-table-column prop="thumbsCount" :label="$t('statis.label.thumbsCount')" width="125" align="center" class-name="number" sortable>
      </el-table-column>
      <!-- 评论 -->
      <el-table-column prop="commontCount" :label="$t('statis.label.commontCount')" width="125" align="center" class-name="number" sortable>
      </el-table-column>
      <!-- 转发 -->
      <el-table-column prop="relayCount" :label="$t('statis.label.relayCount')" width="125" align="center" class-name="number" sortable>
      </el-table-column>
      <!-- 收藏 -->
      <el-table-column prop="showCount" :label="$t('statis.label.showCount')" width="125" align="center" class-name="number" sortable>
      </el-table-column>
      <el-table-column prop="time" :label="$t('statis.label.laterTime')" width="160" align="center" :formatter="timeFormat" sortable></el-table-column>
      <el-table-column prop="startTime" :label="$t('statis.label.registerTime')" width="150" align="center" :formatter="startTimeFormat" sortable></el-table-column>
      <el-table-column prop="oper" :label="$t('accountList.label.oper')" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button @click.native.prevent="findRecordsBySid(scope.row)" type="text" size="small" icon="el-icon-document">
            {{$t('statis.oper.findRecordsBySid')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getRecords } from "api/record";
import { formatTime, isInDateRange } from "common/js/util";
import { mapGetters } from "vuex";
import JsonExcel from "vue-json-excel";
export default {
  name: "common",
  data() {
    return {
      totalData: [],

      loadStatus: 0,
      selectAdmin: null,
      selectProduct: null,
      selectDate: null,
      selectTopChannels: null,
      selectSubChannels: null,
      json_fields: {
        产品: "product",
        渠道: "channel",
        内容: "content",
        链接: "link",
        阅读量: "readCount",
        点赞量: "thumbsCount",
        评论量: "commontCount",
        转发量: "relayCount",
        收藏量: "showCount",
        时间: "startTime"
      }
    };
  },
  computed: {
    loadingText() {
      return this.loadStatus == 1
        ? "正在好努力地找东西(～￣▽￣)～"
        : this.$t("data.none");
    },
    params() {
      return {
        owner: this.selectAdmin,
        pid: this.selectProduct,
        cids: this.selectTopChannels
          ? this.selectTopChannels
          : this.selectSubChannels
      };
    },
    xlsData() {
      return this._getXls();
    },
    xlsName() {
      return (
        "推广数据统计表" +
        formatTime(new Date().getTime(), "yyyy-MM-dd-hh-mm-ss") +
        ".xls"
      );
    },
    ...mapGetters([
      "role",
      "id",
      "changeAdmin",
      "changeDate",
      "changeDate",
      "changeProduct",
      "changeSubChannels",
      "changeTopChannels"
    ])
  },
  created() {
    // this.init()
  },
  activated() {
    this.init()
  },
  components: {
    JsonExcel
  },
  methods: {
    // 排序excel数据
    _getXls() {
      let arr = JSON.parse(JSON.stringify(this.totalData));
      arr.sort((a, b) => {
        if (a.product == b.product) {
          return a.channel > b.channel ? -1 : 1;
        }
        return a.product > b.product ? -1 : 1;
      });
      return arr.map(item => {
        item.startTime = formatTime(item.startTime);
        return item;
      });
    },
    init() {
      if (this.role == 6) {
        this.selectAdmin = this.id;
      } else {
        this.selectAdmin = this.changeAdmin;
      }
      this.selectProduct = this.changeProduct;
      this.selectDate = this.changeDate;
      this.selectTopChannels = this.changeTopChannels;
      this.selectSubChannels = this.changeSubChannels;
      this._getRecords();
    },
    _getRecords() {
      this.loadStatus = 1;
      getRecords({
        params: this.params,
        date: {
          begin: this.selectDate ? this.selectDate[0].getTime() : null,
          end: this.selectDate ? this.selectDate[1].getTime() : null
        }
      }).then(this.getRecordsCallback);
    },
    getRecordsCallback(res) {
      this.totalData = [];
      if (res.code == 1) {
        if (res.data.length == 0) {
          this.loadStatus = 0;
          return;
        }

        this.totalData = res.data;
      } else {
        this.loadStatus = 0;
      }
    },
    // 按主题分组
    // groupBySid(data) {
    //   let groupBySid = {};
    //   data.forEach(item => {
    //     if (groupBySid[item.subjectId] == undefined) {
    //       groupBySid[item.subjectId] = [item];
    //     } else {
    //       groupBySid[item.subjectId].push(item);
    //     }
    //   });
    //   return groupBySid;
    // },
    // // 抽取最近一条记录
    // getRecentestRecordBySid(data) {
    //   let ret = [];
    //   for (let key in data) {
    //     data[key].sort(sortByTime);
    //     this.groupData.push(data[key]);
    //     if (this.selectDate) {
    //       if (
    //         isInDateRange(
    //           this.selectDate[0],
    //           this.selectDate[1],
    //           new Date(Number(data[key][0].startTime))
    //         )
    //       ) {
    //         ret.push(data[key][0]);
    //       }
    //     } else {
    //       ret.push(data[key][0]);
    //     }
    //   }
    //   return ret;
    // },
    timeFormat(item) {
      return formatTime(item.time);
    },
    // 注册时间
    startTimeFormat(item) {
      return formatTime(item.startTime);
    },
    contentFormat(content) {
      return content.length > 10 ? content.substr(0, 10) + "..." : content;
    },
    findRecordsBySid(row) {
      this.$router.push({
        name: "StatisSingleList",
        params: { subjectId: row.subjectId }
      });
    },
    // 选择管理员
    changeAdminMethod(admin) {
      this.selectAdmin = admin;
      this._getRecords();
    },
    changeTopChannelsMethod(channels) {
      this.selectTopChannels =
        channels && channels.length > 0 ? channels : null;
      this.temp = this.selectTopChannels;
      this.selectSubChannels = null;
      this._getRecords();
    },
    changeSubChannelsMethod(channels) {
      this.selectSubChannels =
        channels && channels.length > 0 ? channels : null;
      // 去掉子级渠道。应当复原父级渠道的搜索，所以缓存父级渠道
      this.selectTopChannels = this.selectSubChannels ? null : this.temp;
      this._getRecords();
    },
    changeProductMethod(product) {
      this.selectProduct = product;
      this._getRecords();
    },
    changeDateMethod(dateRange) {
      this.selectDate = dateRange;
      this._getRecords();
    },
    // filterDate() {
    //   if (this.selectDate) {
    //     let result = [];
    //     this.totalData.forEach(item => {
    //       isInDateRange(
    //         this.selectDate[0],
    //         this.selectDate[1],
    //         new Date(Number(item.startTime))
    //       ) && result.push(item);
    //     });
    //     this.totalData = result;
    //     this.$refs.table.doLayout();
    //   } else {
    //     // 清除日期
    //     this._getRecords();
    //   }
    // },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
          return;
        }
        if (column.property == "time" || column.property == "startTime") {
          return;
        }
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
          sums[index] += " 次";
        } else {
          sums[index] = "";
        }
      });

      return sums;
    }
  },
  watch: {
    changeAdmin(val) {
      this.changeAdminMethod(val);
    },
    changeTopChannels(val) {
      this.changeTopChannelsMethod(val);
    },
    changeSubChannels(val) {
      this.changeSubChannelsMethod(val);
    },
    changeProduct(val) {
      this.changeProductMethod(val);
    },
    changeDate(val) {
      this.changeDateMethod(val);
    }
  }
};
function sortByTime(a, b) {
  return Number(b.time) - Number(a.time);
}
</script>
<style lang="scss">
.total-table {
  position: relative;
  .export {
    position: absolute;
    right: 10px;
    top: 0;
    text-align: right;
  }
  .total-table-title {
    height: 44px;
    line-height: 44px;
    font-size: 16px;
    text-align: left;
  }
  .header-cell {
    .cell {
      font-weight: bold;
      font-size: 14px;
      color: rgb(52, 59, 59);
    }
  }
  .number {
    color: rgb(226, 111, 111);
    font-size: 15px;
  }
  .has-gutter {
    .number {
      font-size: 18px;
      font-weight: bold;
    }
  }
  .content {
    cursor: pointer;
  }
}
</style>


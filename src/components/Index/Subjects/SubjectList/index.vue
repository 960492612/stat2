<template>
  <div class="subjectList">
    <div class="search">
      <div>
        <span>以发布时间查找主题：</span>
        <el-date-picker v-model="publishTime" @change="_searchSubjectOnDays" type="daterange" range-separator="至" start-placeholder="起始日期" end-placeholder="结束日期"></el-date-picker>
        <span>以最近记录时间查找主题：</span>
        <el-select v-model="searchRecordDays" placeholder="最近记录时间" clearble class="search" style="width: 150px;" @change="_searchSubjectOnDays">
          <el-option v-for="(item, index) in recordDaysOptions" :key="index" :value="item.value" :label="item.label">{{item.label}}</el-option>
        </el-select>
      </div>
    </div>
    <div>
      <el-table :data="tableData" style="width:100%;" :default-sort="{prop: 'sid', order: 'descending'}" :row-class-name="stopRowClassName">
        <div slot="empty">
          <i class="el-icon-loading" v-show="loadStatus == 1"></i> {{loadingText}}</div>
        <el-table-column prop="sid" :label="$t('subject.label.sid')" width="150" align="center">
        </el-table-column>
        <el-table-column prop="content" :label="$t('statis.label.content')" width="180" align="center" class-name="subject-content">
          <template slot-scope="scope">
            <el-popover trigger="click" placement="right">
              <p style="maxWidth:300px;">
                {{scope.row.content}}
              </p>
              <p slot="reference" :title="$t('statis.tip')">{{contentFormat(scope.row.content)}}</p>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="product" :label="$t('statis.label.product')" width="150" align="center">
        </el-table-column>
        <el-table-column :label="$t('statis.label.channel')" align="center">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top" v-for="(item, index) in scope.row.channels" :key="index" @show="getRecordById(item.id)">
              <p>{{$t('subject.label.pc')}}：
                <span>{{item.parentChannel}}</span>
              </p>
              <p>{{$t('subject.label.link')}}：
                <a :href="item.link" target="_blank" class="link">
                  <i>{{ item.link }}</i>
                </a>
              </p>
              <p>
                <img v-lazy="item.image" alt="" width="50" height="50" @click="showBigImage(item.image)" v-show="item.image" title="点击查看大图" style="cursor:pointer;">
              </p>
              <p>
                阅读量: {{ readCount}}
              </p>
              <el-tag size="medium" slot="reference" class="channel-tag">{{ item.channels }}</el-tag>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column prop="time" :label="$t('subject.label.time')" width="150" align="center" :formatter="timeFormat" sortable>
        </el-table-column>
        <el-table-column prop="recentRecordTime" :label="$t('statis.label.laterTime')" width="320" align="center" sortable>
          <template slot-scope="scope">
            <span>{{recentRecordTime(scope.row)?recentRecordTime(scope.row):$t('subject.label.none')}}</span>
            <el-tag :type="tagType(scope.row)" v-if="recentRecordTime(scope.row)" size="small">{{recordTip(scope.row) == 0 ? $t('subject.label.hasRecordToday') : $t('subject.label.noRecord1')+recordTip(scope.row)+$t('subject.label.noRecord2')}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="oper" :label="$t('accountList.label.oper')" align="center">
          <template slot-scope="scope">
            <el-button @click.native.prevent="record(scope.row)" type="text" size="small">
              {{$t('subject.oper.record')}}
            </el-button>
            <el-button @click.native.prevent="uploadImage(scope.row)" type="text" size="small">
              {{$t('subject.oper.upload')}}
            </el-button>
            <el-button @click.native.prevent="editRow(scope.row)" type="text" size="small">
              {{$t('subject.oper.edit')}}
            </el-button>
            <el-button @click.native.prevent="toggleRow(scope.row)" type="text" size="small">
              {{scope.row.status == 1 ? $t('subject.oper.stop') : $t('subject.oper.start')}}
            </el-button>
            <el-button @click.native.prevent="deleteRow(scope.row)" type="text" size="small">
              {{$t('subject.oper.delete')}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination v-if="isShowPage" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[5, 10, 20, 30]" :current-page.sync="currentPage" :page-size="size" layout="total,sizes, prev, pager, next" :total="total" class="page" background>
      </el-pagination>
    </div>
    <upload-image ref="uploadImage" />
    <!-- 大图 -->
    <el-dialog title="" center :visible.sync="isShowBig" @close="closeImage" append-to-body top="3vh" lock-scroll>
      <div class="wrap" style="height:100%;text-align:center;">
        <img :src="image" alt="" width="100%" height="80%">
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getSubjectsByAid,
  deleteSubject,
  getSubjectsTotal,
  toggleSubject,
  searchSubjectOnDays
} from "api/subject";
import { getRecords } from "api/record";
import { mapGetters } from "vuex";
import { formatTime } from "common/js/util";
import uploadImage from "base/uploadImage";
export default {
  name: "Subjects",
  data() {
    return {
      total: 0,
      size: 10,
      currentPage: 1,
      tableData: [],
      loadStatus: 1,
      image: null,
      publishTime: null,
      searchRecordDays: null,
      readCount: 0,
      recordDaysOptions: [
        { label: "暂无记录", value: -1 },
        { label: "3天以上未记录", value: 3 },
        { label: "5天以上未记录", value: 5 },
        { label: "7天以上未记录", value: 7 },
        { label: "10天以上未记录", value: 10 },
        { label: "15天以上未记录", value: 15 },
        { label: "30天以上未记录", value: 30 }
      ]
    };
  },
  computed: {
    loadingText() {
      return this.loadStatus == 1
        ? this.$t("data.loading")
        : this.$t("data.none");
    },
    isShowBig() {
      return this.image != null;
    },
    isShowPage() {
      return !(this.searchRecordDays || this.publishTime);
    },
    ...mapGetters(["id"])
  },
  created() {
    this._getSubjectsByAid(this.currentPage, this.size);
    this._getSubjectsTotal();
  },
  activated() {
    !this.isShowPage
      ? this._searchSubjectOnDays()
      : this._getSubjectsByAid(this.currentPage, this.size) &&
        this._getSubjectsTotal();
  },
  components: {
    uploadImage
  },
  methods: {
    handleSizeChange(size) {
      this.size = size;
      this._getSubjectsByAid(this.currentPage, size);
    },
    handleCurrentChange(page) {
      this._getSubjectsByAid(page, this.size);
    },
    _getSubjectsTotal() {
      getSubjectsTotal(this.id).then(res => {
        this.total = res.data[0].total;
      });
    },
    _getSubjectsByAid(page, size) {
      getSubjectsByAid(this.id, page, size).then(res => {
        if (res.code == 1) {
          if (res.data.length == 0) {
            this.loadStatus = 0;
            return;
          }
          // console.log();
          this.tableData = this.generateData(res.data);
        } else {
          this.loadStatus = 0;
        }
      });
    },
    generateData(data) {
      let groupBySid = {};
      data.forEach(item => {
        if (groupBySid[item.sid] == undefined) {
          groupBySid[item.sid] = item;
          groupBySid[item.sid].channels = [this.getChannelObj(item)];
        } else {
          groupBySid[item.sid].channels.push(this.getChannelObj(item));
        }
      });
      return Object.values(groupBySid);
    },
    timeFormat(item) {
      return formatTime(item.time);
    },
    getChannelObj(obj) {
      let ret = { channels: null, link: null, parentChannel: null };
      return { ...ret, ...obj };
    },
    contentFormat(content) {
      return content.length > 10 ? content.substr(0, 10) + "..." : content;
    },
    editRow(row) {
      let data = this.tableData.find(item => {
        return item.sid == row.sid;
      });

      this.$router.push({
        name: "UpdateSubject",
        params: data
      });
    },
    // 上传图片组件显示
    uploadImage(row) {
      this.$refs.uploadImage.setShow(row);
    },
    showBigImage(image) {
      this.image = image;
    },
    closeImage() {
      this.image = null;
    },
    recentRecordTime(item) {
      return item.recentRecordTime ? formatTime(item.recentRecordTime) : false;
    },
    // 不同天就算入未记录的时间
    recordTip(item) {
      if (
        formatTime(new Date().getTime()) == formatTime(item.recentRecordTime)
      ) {
        return 0;
      }
      return Math.round(
        (new Date().getTime() - Number(item.recentRecordTime)) /
          1000 /
          3600 /
          24
      );
    },
    tagType(item) {
      let days = this.recordTip(item);
      return days == 0
        ? "success"
        : days < 3
          ? "primary"
          : days < 7
            ? "info"
            : days < 14 ? "waring" : days < 30 ? "warning" : "info";
    },
    record(row) {
      this.$router.push({ name: "AddRecord", params: { sid: row.sid } });
    },
    // 停用启用
    toggleRow(row) {
      let status = (row.status - 1) * (row.status - 1);
      toggleSubject({ status, sid: row.sid }).then(res => {
        if (res.code == 1) {
          // console.log(this.tableData[index]);
          let index = this.tableData.findIndex(item => {
            return item.sid == row.sid;
          });
          this.$set(this.tableData[index], "status", status);
          // this.tableData[index].status = status
        }
      });
    },
    stopRowClassName({ row, index }) {
      if (row.status == 0) {
        return "stopSubject";
      }
    },
    getRecordById(id) {
      this.readCount = 0;
      getRecords({params:{ subjectId: id }}).then(res => {
        if (res.code == 1 && res.data.length > 0) {
        
          this.readCount = res.data[0].readCount;
        }
      });
      // return
    },
    deleteRow(row) {
      this.$confirm("此操作将永久删除该主题, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteSubject({ sid: row.sid }).then(res => {
            if (res.code == 1) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              let index = this.tableData.findIndex(item => {
                return item.sid == row.sid;
              });
              this.tableData.splice(index, 1);
            } else {
              this.$message.error("删除失败");
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
    _searchSubjectOnDays() {
      if (!this.searchRecordDays && !this.publishTime) {
        // this.$message.info('请选择时间段')
        this._getSubjectsByAid(this.currentPage, this.size);
        this._getSubjectsTotal();
        return;
      }
      console.log(1);
      // 取消选择的时候
      let publishTime = this.publishTime
        ? this.publishTime.map(item => {
            return item.getTime();
          })
        : null;
      searchSubjectOnDays(this.searchRecordDays, publishTime, this.id).then(
        res => {
          if (res.code == 1) {
            if (res.data.length == 0) {
              this.loadStatus = 0;
            }
            this.tableData = this.generateData(res.data);
            // this.publishTime = null
          } else {
            this.loadStatus = 0;
          }
        }
      );
    }
  }
};
function sortByTime(a, b) {
  return Number(b.time) - Number(a.time);
}
</script>
<style lang="scss">
.subjectList {
  margin-top: 20px;
  text-align: left;
  .channel-tag {
    float: left;
    margin-top: 2px;
    margin-left: 5px;
    margin-bottom: 2px;
  }
  .subject-content {
    cursor: pointer;
  }
}
.el-popper .link {
  color: rgb(163, 43, 34);
}
.el-popper .link:hover {
  color: rgb(236, 48, 34);
}
.page {
  margin-top: 20px;
  padding-left: 20px;
}
.el-table .stopSubject {
  background: rgba(236, 233, 233, 0.829) !important;
}
</style>

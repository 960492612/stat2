<template>
  <div class="addRecord">
    <div class="search">

      <el-autocomplete v-model="sid" :placeholder="$t('statis.placeholder.searchSubject')" filterable :fetch-suggestions="searchMethod" :loading="loading" @select="selectSubject" :debounce="300" suffix-icon="el-icon-search">
        <el-select v-model="field" :placeholder="$t('statis.placeholder.selectType')" class="field" slot="prepend">
          <el-option v-for="item in fields" :key="item.key" :value="item.key" :label="item.label">{{item.label}}</el-option>
        </el-select>
        <template slot-scope="props">
          <div class="sid">{{$t('subject.label.sid')+'：' + props.item.sid }}</div>
          <span class="value">{{ props.item.value }}</span>
          <!-- <span class="addr">{{ props.item.address }}</span> -->
        </template>
      </el-autocomplete>
      <!-- <el-button type="primary" size="mini">全部提交</el-button> -->
      <div class="introduce">
        <p>
          {{$t('subject.label.sid')}}：
          <el-tag type="primary">{{subject.length>0?subject[0].sid: $t('statis.error.noSelected')}}</el-tag>
          {{$t('statis.label.content')}}
          <el-popover trigger="click" placement="left">

            <el-tag slot="reference" type="primary" :title="$t('statis.tip')">{{subject.length>0?contentFormat(subject[0].content): $t('statis.error.noSelected')}}</el-tag>
            <p style="width:500px;">{{subject.length>0?subject[0].content: $t('statis.error.noSelected')}}</p>
          </el-popover>

        </p>
      </div>
    </div>

    <div class="addRecordList" v-loading="listLoading" :element-loading-text="$t('data.loading')" element-loading-spinner="el-icon-loading">
      <ul v-if="subject.length>0">
        <!-- 按channel分开，可以单独提交 -->
        <li class="recordItem" v-for="item in subject" :key="item.id">
          <el-form :inline="true" :model="records[item.id]" class="form" label-position="top">
            <el-form-item :label="$t('subject.label.id')" class="item">
              <span>{{item.id}}</span>
            </el-form-item>
            <el-form-item :label="$t('statis.label.channel')" class="item" style="width:150px;">
              <span>{{item.channels}}</span>
            </el-form-item>
            <el-form-item :label="$t('statis.label.readCount')" class="item">
              <el-input type="text" class="input" v-model.number="records[item.id]['readCount']" clearable @change="isNumber(item.id,'readCount', $event)"></el-input>
            </el-form-item>
            <el-form-item :label="$t('statis.label.relayCount')" class="item">
              <el-input v-model.number="records[item.id]['relayCount']" class="input" clearable @change="isNumber(item.id,'relayCount', $event)" />
            </el-form-item>
            <el-form-item :label="$t('statis.label.commontCount')" class="item">
              <el-input v-model.number="records[item.id]['commontCount']" class="input" clearable @change="isNumber(item.id,'commontCount', $event)" />
            </el-form-item>
            <el-form-item :label="$t('statis.label.thumbsCount')" class="item">
              <el-input v-model.number="records[item.id]['thumbsCount']" class="input" clearable @change="isNumber(item.id,'thumbsCount', $event)" />
            </el-form-item>
            <el-form-item :label="$t('statis.label.showCount')" class="item">
              <el-input type="text" class="input" v-model.number="records[item.id]['showCount']" clearable @change="isNumber(item.id,'showCount', $event)"></el-input>
            </el-form-item>
            <el-form-item class="submit-item">
              <el-button :type="submited[item.id]?'success':'primary'" @click="submitOne(item.id)" size="medium" :title="$t('statis.submit.title')">{{submited[item.id]?$t('statis.submit.title'): $t('statis.submit.no')}}</el-button>
            </el-form-item>
          </el-form>
        </li>
      </ul>
    </div>
    <!-- 图 -->
    <singleSubjectChart :data="groupData" v-if="groupData" ref="myChart" />
  </div>
</template>
<script>
import { getSubjectsBySid, getSubjectsByQuery } from "api/subject";
import { addRecords, getSubjectsRocordBySid } from "api/record";
import { mapGetters } from "vuex";
import { debounce } from "common/js/util";
import SingleSubjectChart from "base/SingleSubjectChart";
export default {
  name: "AddRecord",
  data() {
    return {
      field: "content",
      fields: [
        { key: "sid", label: this.$t("statis.searchFields.sid") },
        { key: "content", label: this.$t("statis.searchFields.content") },
        { key: "product", label: this.$t("statis.searchFields.product") },
        { key: "link", label: this.$t("statis.searchFields.link") }
      ],
      sid: null,
      subject: [], //需要添加记录的主题
      retDatas: [], //查询用的
      groupData: null,
      loading: false,
      listLoading: true,
      records: {}, //填写的数据，
      submited: {}
    };
  },
  computed: {
    ...mapGetters(["id"])
  },
  components: {
    SingleSubjectChart
  },
  created() {
    let sid = this.$route.params.sid;
    (sid && this._getSubjectsBySid(sid)) || (this.listLoading = false);
    // sid && this._getSubjectsRocordBySid(sid);
  },
  activated() {
    let sid = this.$route.params.sid;
    (sid && this._getSubjectsBySid(sid)) || (this.listLoading = false);
    // sid && this._getSubjectsRocordBySid(sid);
  },
  methods: {
    _getSubjectsBySid(sid) {
      getSubjectsBySid(sid).then(res => {
        if (res.code == 1) {
          res.data.forEach(item => {
            this.$set(this.records, item.id, {});
            // this.records[item.id] = {};
          });
          // this.getPrevRecords(res.data)
          this.subject = res.data;
          this.listLoading = false;
          this._getSubjectsRocordBySid(sid);
        }
      });
    },
    // 调用的方法
    searchMethod(query, cb) {
      (this._debounce && this._debounce(query, cb)) ||
        (this._debounce = this.searchDebounce());
    },
    // 加节流
    searchDebounce() {
      return debounce((query, callback) => {
        this.searchSubject(query, callback);
      }, 200);
    },
    _getSubjectsRocordBySid(sid) {
      getSubjectsRocordBySid(sid).then(this.getRecordsCallback);
    },
    getRecordsCallback(res) {
      // this.totalData = [];
      if (res.code == 1) {
        if (res.data.length == 0) {
          // this.loadStatus = 0;
          return;
        }
        this.groupData = this.groupBySid(res.data);
        this.getRecentestRecordBySid(this.groupData);
      }
    },
    groupBySid(data) {
      let groupBySid = {};
      data.forEach(item => {
        if (groupBySid[item.subjectId] == undefined) {
          groupBySid[item.subjectId] = [item];
        } else {
          groupBySid[item.subjectId].push(item);
        }
      });
      return groupBySid;
    },
    getRecentestRecordBySid(data) {
      // let ret = [];
      for (let key in data) {
        data[key].sort(sortByTime);
        // this.groupData.push(data[key]);
        // ret.push(data[key][0]);
        this.fillPrevRecords(data[key][0]);
      }
      // return ret;
    },
    // 填写上次记录的数据
    fillPrevRecords(data) {
      // console.log(data);
      let countsKey = [
        "readCount",
        "relayCount",
        "commontCount",
        "thumbsCount",
        "showCount"
      ];
      countsKey.forEach(key => {
        if (data[key] != null) {
          this.$set(this.records[data.subjectId], key, data[key]);
        }
      });
    },
    contentFormat(content) {
      return content.length > 20 ? content.substr(0, 20) + "..." : content;
    },
    // 查询词主方法
    searchSubject(query, cb) {
      if (query == "") {
        cb(null);
        return;
      }
      getSubjectsByQuery(this.field, query, this.id).then(res => {
        let data = [];
        if (res.code == 1) {
          res.data.forEach(item => {
            data.push({
              value: `${item.channels}-${item.content}`,
              sid: item.sid + ""
            });
          });
        }
        cb(data);
      });
    },
    // 选中条目更换subject
    selectSubject(item) {
      this.subject = [];
      this.listLoading = true;
      this.$nextTick(() => {
        this._getSubjectsBySid(item.sid);
      });
    },
    submitOne(id) {
      if (isEmpty(this.records[id])) {
        this.$message.error(this.$t("data.input"));
        return;
      }
      addRecords({
        ...this.records[id],
        ...{
          subjectId: id,
          sid: this.subject[0].sid,
          owner: this.id,
          time: new Date().getTime()
        }
      }).then(res => {
        if (res.code == 1) {
          //表示已提交成功
          this.$message.success(this.$t("statis.success.record"));
          this.$set(this.submited, id, true);
        }
      });
    },
    isNumber(id, key, event) {
      if (this.records[id][key] == "") {
        this.records[id][key] = 0;
        return;
      }
      if (isNaN(this.records[id][key])) {
        console.log(1);
        // event.target = 0;
        this.records[id][key] = 0;
        this.$message.error(this.$t("data.int"));
      }
    }
  }
};
function isEmpty(obj) {
  for (var key in obj) {
    return false;
  }
  return true;
}
function sortByTime(a, b) {
  return Number(b.time) - Number(a.time);
}
</script>
<style lang="scss" scoped>
.addRecord {
  margin-top: 20px;
  // margin-left: 20px;
  .search {
    text-align: left;
    padding-left: 20px;
    overflow: hidden;
    .field {
      width: 150px;
    }
    .introduce {
      float: right;
      font-size: 13px;
    }
    .sid {
      height: 24px;
      font-size: 14px;
      line-height: 24px;
    }
   
  }
  .addRecordList {
    margin-top: 20px;
    // min-height: 400px;
    z-index: 0;
    .form {
      padding-left: 20px;
      text-align: left;
      border-bottom: 1px solid #999;
    }
    .item {
      text-align: center;
    }
    .input {
      width: 160px;
    }
    // .input {
    //   width: 160px;
    //   text-align: right;
    //   -webkit-appearance: none;
    //   background-color: #fff;
    //   border-radius: 4px;
    //   border: 1px solid #dcdfe6;
    //   -webkit-box-sizing: border-box;
    //   box-sizing: border-box;
    //   color: #606266;
    //   display: inline-block;
    //   font-size: inherit;
    //   height: 40px;
    //   line-height: 1;
    //   outline: 0;
    //   padding: 0 15px;
    //   -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    //   transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    //   // width: 100%;
    //   &::placeholder {
    //     color: #999;
    //   }
    // }
    .submit-item {
      margin-top: 48px;
      margin-bottom: 0;
    }
  }
}
</style>


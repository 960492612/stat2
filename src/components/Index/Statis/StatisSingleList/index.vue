<template>
  <div class="single-statis">
    <div class="search"></div>
    <!-- 每个元主题的记录总表 -->

    <div class="total-table" v-if="tableData.length>0">
      <h4 class="total-table-title">{{$t('statis.singleTitle')}}</h4>
      <div class="info content">
        <span>{{$t('statis.label.content')}}：</span>{{tableData[0].content}}</div>
      <div class="info product">
        <span>{{$t('statis.label.product')}}：</span>{{tableData[0].product}}</div>
      <div class="info channel">
        <span>{{$t('statis.label.channel')}}：</span>{{tableData[0].channel}}</div>
      <div class="info link">
        <span>{{$t('statis.label.link')}}：</span>
        <a :href="tableData[0].link" target="_blank">
          <i>{{tableData[0].link}}</i>
        </a>
      </div>
      <div class="info image">
        <span>截图：</span>
        <div  v-if="tableData[0].image">
          <img :src="tableData[0].image" alt="">
        </div>
        <span v-if="!tableData[0].image">
          未上传截图
        </span>
      </div>
      <div class="info channel">
        <span>{{$t('statis.label.registerTime')}}：</span>{{timeFormat(tableData[0].startTime)}}</div>
      <el-table :data="tableData" style="marginTop:10px;marginLeft:20px;" border stripe :highlight-current-row="false" header-cell-class-name="header-cell">

        <el-table-column type="index" :label="$t('statis.label.index')" width="80" align="center">
        </el-table-column>
        <el-table-column prop="readCount" :label="$t('statis.label.readCount')" width="120" align="center" class-name="number">
        </el-table-column>
        <el-table-column prop="showCount" :label="$t('statis.label.showCount')" width="120" align="center" class-name="number">
        </el-table-column>
        <el-table-column prop="relayCount" :label="$t('statis.label.relayCount')" width="120" align="center" class-name="number">
        </el-table-column>
        <el-table-column prop="commontCount" :label="$t('statis.label.commontCount')" width="120" align="center" class-name="number">
        </el-table-column>
        <el-table-column prop="thumbsCount" :label="$t('statis.label.thumbsCount')" width="120" align="center" class-name="number">
        </el-table-column>
        <el-table-column prop="time" :label="$t('statis.label.time')" width="180" align="center" :formatter="timeFormat" sortable></el-table-column>

      </el-table>
    </div>
  </div>
</template>
<script>
import { getSubjectsRocordBySubjectId } from "api/record";
import { formatTime } from "common/js/util";

export default {
  name: "statis",
  data() {
    return {
      tableData: [],
      //   groupData: [],
      loadStatus: 1
    };
  },

  created() {
   this.init()
  },
  activated() {
    this.init()
  },
  methods: {
    init() {
      if (this.$route.params.subjectId) {
        this.getData();
      } else {
        this.$router.push({ name: "Statis" });
      }
    },
    timeFormat(item) {
      if (!(item instanceof Object)) {
        return formatTime(item);
      }
      return formatTime(item.time);
    },
    getData() {
      getSubjectsRocordBySubjectId(this.$route.params.subjectId).then(res => {
        if (res.code == 1) {
          this.tableData = res.data;
        } else {
        }
      });
    }
  },
  watch: {
    // $route(val) {
    //   this.tableData =
    //     val.params && val.params.data && val.params.data.length > 0
    //       ? val.params.data
    //       : [];
    // }
  }
};
function sortByTime(a, b) {
  return Number(b.time) - Number(a.time);
}
</script>
<style lang="scss">
.single-statis {
  .total-table-title {
    height: 44px;
    line-height: 44px;
    font-size: 16px;
    text-align: center;
  }
  .header-cell {
    .cell {
      font-weight: bold;
      font-size: 14px;
      color: rgb(52, 59, 59);
    }
  }
  .total-table {
    .number {
      color: rgb(34, 186, 233);
      font-weight: bold;
      font-size: 15px;
    }
    .info {
      padding-left: 20px;
      span {
        font-size: 15px;
        color: #222;
        margin-right: 10px;
      }
      font-size: 13px;
      line-height: 22px;
      text-align: left;
    }
    .link {
      cursor: pointer;
      color: rgb(163, 43, 34);
    }
    .link:hover {
      color: rgb(236, 48, 34);
    }
    .image{
      >div{
        padding-left: 20px;
      }
    }
  }
}
</style>


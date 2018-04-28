<template>
    <div class="ProductSurveyFeedback">
        <div class="content">
            <el-table :data="feedbacks" :row-class-name="confirmClass">
                <el-table-column label="序号" type="index" align="center"></el-table-column>
                <el-table-column label="接收人" prop="accepter" align="center"></el-table-column>
                <el-table-column label="是否确认" :formatter="isConfirm" align="center"></el-table-column>
                <el-table-column label="确认时间" prop="accepter" :formatter="timeFormat" align="center"></el-table-column>
                <el-table-column label="意见" prop="feedback" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="oper" :label="$t('oper.oper')" align="center">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="seeDetails(scope.row)" type="text">
                            查看反馈详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="反馈详情" :visible.sync="isShowFeedback">
            <div class="feedback-box" v-if="currentFeedback">
                <ul>
                    <li class="feedback-list-item header">
                        <div class="store">相关店铺</div>
                        <div class="links">链接详情</div>
                    </li>
                    <li v-for="(item ,index) in currentFeedback" :key="index" class="feedback-list-item">
                        <div class="store">{{item.store}}</div>
                        <div class="links">
                            <ul>
                                <li v-for="(link, _index) in item.links" :key="_index" class="link-item">
                                    <div class="link">
                                        <a :href="link.link" target="_blank">{{link.link}}</a>
                                    </div>
                                    <div>
                                        <i>价格:</i>{{link.price}}</div>
                                    <div>
                                        <i>描述:</i>{{link.desc}}</div>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getPublishSurveys, getPublishStores } from "api/productSurvey";
import { formatTime } from "common/js/util";
export default {
  data() {
    return {
      survey: null,
      feedbacks: [],
      isShowFeedback: false,
      currentFeedback: null
    };
  },
  created() {
    if (this.$route.params.id) {
      this.survey = this.$route.params;
      this._getPublishSurveys();
    }
  },
  methods: {
    _getPublishSurveys() {
      getPublishSurveys({ survey_id: this.survey.id }).then(res => {
        if (res.code == 1) {
          this.feedbacks = res.data;
        }
      });
    },
    isConfirm(row) {
      return row.isConfirm == 1 ? "已确认" : "尚未确认";
    },
    timeFormat(row) {
      return row.confirmTime
        ? formatTime(row.confirmTime, "yyyy-MM-dd hh:mm:ss")
        : "无";
    },
    seeDetails(row) {
      this.isShowFeedback = true;
      getPublishStores({ publishId: row.id }).then(res => {
        if (res.code == 1) {
          if (res.data.length > 0) {
            this.currentFeedback = res.data.map(item => {
              item.links = JSON.parse(item.links);
              return item;
            });
          }
        }
      });
    },
    confirmClass({ row }) {
      return row.isConfirm == 1 ? "confirm" : "";
    }
  }
};
</script>
<style lang="scss">
.ProductSurveyFeedback {
  .content {
    .el-table .confirm {
      background: #f0f9eb;
    }
  }
  .feedback-box {
    .header {
      height: 40px;
      line-height: 40px;
      font-weight: bold;
    }
    .feedback-list-item {
      display: flex;
      line-height: 35px;
      text-align: center;
      border-bottom: 1px solid #666;
      .store {
        flex: 0 0 100px;
      }
      .links {
        flex: 1;
        //   display: flex;
        .link-item {
          > div {
            text-align: left;
            height: 35px;
            line-height: 35px;
            .link {
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }
            a:hover {
              color: rgb(60, 143, 74);
            }
            i {
              padding-right: 15px;
            }
          }
        }
      }
    }
  }
}
</style>

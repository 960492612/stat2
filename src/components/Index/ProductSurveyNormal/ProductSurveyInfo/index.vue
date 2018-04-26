<template>
    <div class="ProductSurveyInfo">
        <div class="detail-wrapper">
            <div style="text-align:left;">
                <el-button type="primary" @click="isShowDetail=!isShowDetail">
                    {{isShowDetail?'收起参数列表':'展开参数列表'}}
                    <i :class="(isShowDetail?'el-icon-arrow-down':'el-icon-arrow-up')+' el-icon--right'"></i>
                </el-button>
            </div>
            <ul v-show="isShowDetail">
                <li v-for="(item ,index) in totalParams" :key="index" class="item">
                    <div class="key">{{item.key}}:</div>
                    <div class="value">
                        <span v-if="!item.inputType||item.inputType == 1">{{item.value}}</span>
                        <el-tag v-if="item.inputType&&item.inputType == 2" type="primary" size="medium">{{item.value}}</el-tag>
                        <div v-if="item.inputType&&item.inputType == 3">
                            <el-tag type="primary" v-for="(tag, _index) in toArray(item.value)" :key="_index" class="tag">{{tag}}</el-tag>
                        </div>

                        <span v-if="item.inputType&&item.inputType == 4">{{timeFormat(item.value)}}</span>
                    </div>
                </li>
            </ul>
        </div>
        <div class="feedback-wrapper">
            <el-form :model="feedback">
              <el-form-item label=""></el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import { getSurveyParamsBySurveyId } from "api/productSurvey";
import { formatTime } from "common/js/util";
export default {
  //   props: {
  //     survey: {
  //       type: Object,
  //       default: () => {}
  //     }
  //   },
  data() {
    return {
      survey: null,
      totalParams: [],
      isShowDetail: true,
      feedback: {

      }
    };
  },
  created() {
    if (this.$route.params.id) {
      this.survey = this.$route.params;
      this._getSurveyParams();
    }
  },
  watch: {
    survey() {
      this._getSurveyParams();
    }
  },
  methods: {
    init() {
      //   this.totalParams = JSON.parse(this.survey.dynamicParams)
    },
    _getSurveyParams() {
      getSurveyParamsBySurveyId({ surveyId: this.survey.survey_id }).then(
        res => {
          if (res.code == 1) {
            this.totalParams = [
              ...this.generaParams(res.data),
              ...JSON.parse(this.survey.dynamicParams)
            ];
          }
        }
      );
    },
    toArray(value) {
      return JSON.parse(value);
    },
    generaParams(data) {
      return data.map(item => {
        return {
          key: item.param,
          value: item.value,
          inputType: item.inputType
        };
      });
    },
    timeFormat(value) {
      return formatTime(new Date(value).getTime());
    }
  }
};
</script>
<style lang="scss" scoped>
.ProductSurveyInfo {
  margin-top: 20px;
  max-height: 600px;
  overflow-y: scroll;
  .detail-wrapper{
      border-bottom: 1px solid #ddd;
      padding-bottom: 20px;
      margin-bottom: 20px;
  }
  ul {
    // overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    margin-top: 15px;
  }
  .item {
    // float: left;
    flex: 0 0 33%;
    // overflow: hidden;
    display: flex;
    // width: 33%;
    // height: 44px;
    line-height: 44px;
    font-size: 16px;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    &:nth-of-type(3n) {
      border-right: none;
    }
    &:nth-of-type(1) {
      border-top: 1px solid #ddd;
    }
    &:nth-of-type(2) {
      border-top: 1px solid #ddd;
    }
    &:nth-of-type(3) {
      border-top: 1px solid #ddd;
    }
    .key {
      flex: 1;
      // width: 200px;
    }
    .value {
      flex: 2;
      //   width: 250px;
      text-align: left;
      .tag {
        margin-right: 5px;
      }
    }
  }
}
</style>

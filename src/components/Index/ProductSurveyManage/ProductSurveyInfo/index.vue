<template>
  <div class="ProductSurveyInfo">
    <ul>
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
    <ul>
      <li v-for="(item ,index) in dynamicParams" :key="index" class="dynamic-item">
        <div class="key">{{item.cn.key}}:</div>
        <div class="value">{{item.cn.value}}</div>
        <div class="key">{{item.en.key}}:</div>
        <div class="value">{{item.en.value}}</div>
      </li>
    </ul>
  </div>
</template>
<script>
import { getSurveyParamsBySurveyId } from "api/productSurvey";
import { formatTime } from "common/js/util";
export default {
  props: {
    survey: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      totalParams: [],
      dynamicParams: []
    };
  },
  created() {
    this._getSurveyParams();
    this.dynamicParams = JSON.parse(this.survey.dynamicParams);
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
      getSurveyParamsBySurveyId({ surveyId: this.survey.id }).then(res => {
        if (res.code == 1) {
          this.totalParams = this.generaParams(res.data);
        }
      });
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
  ul {
    // overflow: hidden;
    display: flex;
    flex-wrap: wrap;
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
    &:nth-of-type(3n) {
      border-right: none;
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
  .dynamic-item {
    width: 100%;
    display: flex;
    // width: 33%;
    height: 44px;
    line-height: 44px;
    font-size: 16px;

    .key {
      flex: 1;
    }
    .value {
      flex: 2;
      text-align: left;
      border-right: 1px solid #ddd;
      &:nth-of-type(4n) {
        border-right: none;
      }
     
    }
  }
}
</style>

<template>
  <div class="ProductSurveyInfo">
    <ul class="totalParams">
      <draggable v-model="totalParams" @update="onEnd">
        <li v-for="(item ,index) in totalParams" :key="index" class="item">
          <div class="inner">
            <div class="key">{{item.key}}:</div>
            <div class="value">
              <span v-if="!item.inputType||item.inputType == 1">{{item.value}}</span>
              <el-tag v-if="item.inputType&&item.inputType == 2" type="primary" size="medium">{{item.value}}</el-tag>
              <div v-if="item.inputType&&item.inputType == 3">
                <el-tag type="primary" v-for="(tag, _index) in toArray(item.value)" :key="_index" class="tag">{{tag}}</el-tag>
              </div>

              <span v-if="item.inputType&&item.inputType == 4">{{timeFormat(item.value)}}</span>
            </div>
          </div>
        </li>
      </draggable>
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
import {
  getSurveyParamsBySurveyId,
  saveSurveyParamsSort
} from "api/productSurvey";
import { formatTime } from "common/js/util";
import draggable from "vuedraggable";
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
      dynamicParams: [],
      isSortAction: false
    };
  },
  created() {
    this.init();
  },
  activated() {
    this.init();
  },
  computed: {
    sortTable() {
      if (this.totalParams.length <= 0) {
        return [];
      }
      let index = 1;
      return this.totalParams.map(item => {
        return {
          id: item.id,
          sort: index++
        };
      });
    }
  },
  watch: {
    survey() {
      this.init();
    }
  },
  components: {
    draggable
  },
  methods: {
    init() {
      this._getSurveyParams();
      this.dynamicParams = JSON.parse(this.survey.dynamicParams);
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
      data.every(item => {
        return item.sort_id != null;
      }) &&
        data.sort((a, b) => {
          return a.sort_id - b.sort_id;
        });
      return data.map(item => {
        return {
          id: item.id,
          key: item.param,
          value: item.value,
          inputType: item.inputType
        };
      });
    },
    timeFormat(value) {
      return formatTime(new Date(value).getTime());
    },
    onEnd() {
      this.isSortAction = true;
    },
    saveSort() {
      if (this.isSortAction) {
        return this.$confirm(
          "您进行了重排序操作，是否保存？",
          this.$t("product.delete.tip"),
          {
            confirmButtonText: this.$t("product.delete.sure"),
            cancelButtonText: this.$t("product.delete.cancel"),
            type: "warning"
          }
        )
          .then(() => {
            return saveSurveyParamsSort({ params: this.sortTable }).then(
              res => {
                if (res.code == 1) {
                  this.isSortAction = false;
                  return 1;
                } else {
                  return 0;
                }
              }
            );
          })
          .catch(() => {
            this.isSortAction = false;
            this.$message({
              type: "info",
              message: "取消排序"
            });
            return 0;
          });
      } else {
        this.isSortAction = false;
        return Promise.reject(0);
      }
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
  }

  .totalParams {
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #555;
    > div {
      display: flex;
      flex-wrap: wrap;
    }
    .item {
      // float: left;
      flex: 0 0 33%;
      // overflow: hidden;

      border-right: 1px solid #ddd;
      &:nth-of-type(3n) {
        border-right: none;
      }
      .inner {
        margin: 2px 10px;
        display: flex;
        line-height: 44px;
        font-size: 16px;
        border: 1px solid #fff;
        border-radius: 3px;

        &:hover {
          border: 1px solid #ddd;
          box-shadow: 2px 2px 2px #999;
          cursor: move;
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

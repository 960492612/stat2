<template>
  <div class="ProductSurveyInfo">
    <div class="detail-wrapper">
      <div style="text-align:left;">
        <el-button type="primary" size="medium" @click="isShowDetail=!isShowDetail">
          {{isShowDetail?'收起参数列表':'展开参数列表'}}
          <i :class="(isShowDetail?'el-icon-arrow-down':'el-icon-arrow-up')+' el-icon--right'"></i>
        </el-button>
        <json-excel class="btn btn-default" :data="excelData" :fields="json_fields" :name="xlsName" v-if="excelData" style="display:inline-block;">
          <el-button type="success" icon="el-icon-download" size="medium">
            导出Excel
          </el-button>
        </json-excel>
      </div>
      <div v-show="isShowDetail">
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
            <!-- <div class="key" v-show="!item.cn.key">无:</div> -->
            <div class="value">{{item.cn.value}}</div>
            <div class="key">{{item.en.key}}:</div>
            <!-- <div class="key" v-show="!item.en.key">无:</div> -->
            <div class="value">{{item.en.value}}</div>
          </li>
        </ul>

      </div>

    </div>
    <div class="feedback-wrapper">
      <el-form :model="feedback" status-icon label-position="right" label-width="100px" ref="form" class="form" style="width:50%;">
        <el-form-item label="意见" prop="opinion">
          <el-input v-model="feedback.opinion" placeholder="填写意见 " type="textarea" :rows="2"></el-input>
        </el-form-item>
        <el-form-item label="上架店铺" prop="stores">
          <el-select v-model="feedback.stores" placeholder="选择店铺" style="width:100%" multiple @change="changeStore">
            <el-option v-for="(item, index) in stores" :key="index" :value="item.id" :label="item.name">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px;margin-right:15px;">{{ item.desc }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="item.name" v-for="(item, index) in selectStoreNames" :key="index" class="links">
          <div v-for="(_item, index) in feedback.links[item.id]" :key="index" class="left">
            <el-input v-model="feedback.links[item.id][index]['link']" placeholder="填写链接" style="width:25%"></el-input>
            <el-input v-model="feedback.links[item.id][index]['price']" placeholder="该链接产品价格" style="width:30%"></el-input>
            <el-input v-model="feedback.links[item.id][index]['desc']" placeholder="描述" style="width:30%"></el-input>
          </div>
          <el-button type="primary" class="right" size="medium" @click="addLink(item.id)">
            <i class="el-icon-plus"></i>
          </el-button>
        </el-form-item>
        <el-form-item label="" style="text-align:left;">
          <el-button type="success" @click="submit" style="width:20%;">确认并保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {
  getSurveyParamsBySurveyId,
  saveFeedback,
  getPublishStores
} from "api/productSurvey";
import { formatTime } from "common/js/util";
import { mapGetters } from "vuex";
import { findStores } from "api/store";
import JsonExcel from "vue-json-excel";
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
      stores: [],
      dynamicParams: [],
      feedback: {
        opinion: null,
        stores: [],
        links: {}
      },
      json_fields: {
        参数名: "key",
        参数值: "value"
      }
    };
  },
  computed: {
    selectStoreNames() {
      return this.feedback.stores.map(item => {
        return this.stores.find(store => {
          return store.id == item;
        });
      });
    },
    excelData() {
      if (!this.survey) {
        return [];
      }
      let one = this.totalParams.map(item => {
        let key = item.key;
        let value = "";
        if (item.inputType == 3) {
          // console.log(item.value);
          value = item.value ? JSON.parse(item.value).join("、") : "";
        } else if (item.inputType == 4) {
          value = this.timeFormat(item.value);
        } else {
          value = item.value;
        }
        return { key, value };
      });
      let two = [];
      this.dynamicParams.forEach(item => {
        if (item.cn.key) {
          two.push(item.cn);
        }
        if (item.en.key) {
          two.push(item.en);
        }
      });
      return [...[{ key: "卖点说明", value: this.survey.desc }], ...one, ...two];
    },
    xlsName() {
      if (!this.survey) {
        return "参数表";
      }
      return `${this.survey.category}${this.survey.product}产品参数表.xls`;
    },
    ...mapGetters(["platform"])
  },
  created() {
    if (this.$route.params.id) {
      this.survey = this.$route.params;
      this._getSurveyParams();
      this._findStores();
      this.dynamicParams = JSON.parse(this.survey.dynamicParams);
      if (this.survey.isConfirm == 1) {
        this.init();
      }
    } else {
      this.$router.push({ name: "ProductSurveyNormalList" });
    }
  },
  watch: {
    survey() {
      this._getSurveyParams();
    }
  },
  components: {
    JsonExcel
  },
  methods: {
    init() {
      this.feedback.opinion = this.survey.feedback;
      getPublishStores({ publishId: this.survey.id }).then(res => {
        if (res.code == 1) {
          if (res.data.length > 0) {
            res.data.forEach(item => {
              this.feedback.stores.push(item.store_id);
              let links = JSON.parse(item.links);
              this.$set(this.feedback.links, item.store_id, links);
            });
          }
        }
      });
    },
    _findStores() {
      findStores({ platform: this.platform }).then(res => {
        if (res.code == 1) {
          this.stores = res.data;
        }
      });
    },
    _getSurveyParams() {
      getSurveyParamsBySurveyId({ surveyId: this.survey.survey_id }).then(
        res => {
          if (res.code == 1) {
            this.totalParams = this.generaParams(res.data);
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
    changeStore(val) {
      // 增加没有的店铺
      val.forEach(item => {
        if (!this.feedback.links.hasOwnProperty(item)) {
          this.$set(this.feedback.links, item, [
            { link: null, price: null, desc: null }
          ]);
        }
      });
      //减去多余的店铺
      for (let key in this.feedback.links) {
        if (
          !val.find(item => {
            return item == key;
          })
        ) {
          this.$delete(this.feedback.links, key);
        }
      }
    },
    addLink(id) {
      this.feedback.links[id].push({
        link: null,
        price: null,
        desc: null
      });
    },
    timeFormat(value) {
      return formatTime(new Date(value).getTime());
    },
    submit() {
      // publish表的数据
      let publish = {
        id: this.survey.id,
        feedback: this.feedback.opinion,
        isConfirm: 1,
        confirmTime: new Date().getTime()
      };
      // 发布与店铺的关联表
      let publishStores = this.feedback.stores.map(item => {
        return {
          publish_id: this.survey.id,
          store_id: item,
          links: JSON.stringify(this.feedback.links[item])
        };
      });
      saveFeedback({ publish, publishStores }).then(res => {
        if (res.code == 1) {
          this.$message.success("保存成功");
        } else {
          this.$message.error("操作失败");
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.ProductSurveyInfo {
  margin-top: 20px;
  // max-height: 600px;
  // overflow-y: scroll;
  .detail-wrapper {
    border-bottom: 1px solid #333;
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
  .feedback-wrapper {
    .links {
      // display: flex;
      .left {
        // float: left;
        text-align: left;
        margin-bottom: 10px;
      }
      .right {
        // float: left;
        right: 0;
        position: absolute;
        bottom: 12px;
      }
    }
  }
}
</style>

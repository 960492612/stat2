<template>
  <div class="CreateProductSurvey" @keydown.prevent.ctrl.83="saveTable">
    <div>
      <span v-if="survey">当前产品：{{survey.product}}</span>
      <el-button type="success" size="medium" @click="saveTable">保存</el-button>
    </div>
    <div class="content">
      <section v-if="params.length>0">
        <h3>规定参数区</h3>
        <el-form :model="form" label-width="150px" label-position="right" style="overflow:hidden;">
          <el-form-item label="卖点说明:">
            <el-input type="textarea" v-model="desc" placeholder="输入框可通过右下角图标进行大小调整" size="medium" style="width:50%;" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="上传产品图片:">
            <upload-image :surveyId="survey.id" :images="survey.survey_images" />
          </el-form-item>
          <el-form-item :label="item.name+':'" v-for="(item, index) in params" :key="index" class="form-item">
            <!-- 文本输入 -->
            <el-input v-model="form[item.id]" placeholder="" v-if="item.inputType==1" size="medium"></el-input>
            <!-- 单选 -->
            <el-select v-model="form[item.id]" placeholder="" filterable v-if="item.inputType==2" style="" size="medium">
              <el-option v-for="(_item, index) in item.options" :key="index" :value="_item.name" :label="_item.name"></el-option>
            </el-select>
            <!-- 多选 -->
            <el-select v-model="form[item.id]" placeholder="" multiple filterable v-if="item.inputType==3" collapse-tags style="" size="medium">
              <el-option v-for="(_item, index) in item.options" :key="index" :value="_item.name" :label="_item.name"></el-option>
            </el-select>
            <!-- 时间 -->
            <el-date-picker v-model="form[item.id]" placeholder="" v-if="item.inputType==4" size="medium" style="width:200px;"></el-date-picker>
          </el-form-item>
        </el-form>
      </section>
      <section v-if="params.length>0">
        <h3>自定义参数区</h3>
        <el-table :data="table" style="width:80%;margin: 0 auto;">
          <el-table-column label="参数名"  width="400">
            <template slot-scope="scope">
              <el-input v-model="dynamicParams[scope.row.index]['cn']['key']" placeholder="填写中文" style="width:45%;"></el-input>
              <el-input v-model="dynamicParams[scope.row.index]['en']['key']" placeholder="填写英文" style="width:45%;"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="参数值" >
            <template slot-scope="scope">
              <el-input v-model="dynamicParams[scope.row.index]['cn']['value']" placeholder="填写中文" style="width:45%;"></el-input>
              <el-input v-model="dynamicParams[scope.row.index]['en']['value']" placeholder="填写英文" style="width:45%;"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作"  width="250">
            <template slot-scope="scope">
              <el-button type="info" plain @click.stop="insertParam(scope.row)" size="mini">在下方插入一行</el-button>
              <el-button type="danger" plain @click="deleteParam(scope.row)" size="medium">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top:20px; text-align: center;" @keyup.enter="enterMethod">

          <el-input v-model.number="addParamNumber" placeholder="填写数量" style="width:280px;">
            <el-button type="primary" @click="addParam" size="medium" slot="prepend">添加</el-button>
            <span type="primary" slot="append">个参数</span>
            <el-button type="primary" @click="addParam" size="medium" slot="append" class="el-icon-check"></el-button>
          </el-input>

        </div>

      </section>

    </div>
  </div>
</template>
<script>
// import { getProducts } from "api/product";
import {
  getParams,
  editSurvey,
  getSurveyParamsBySurveyId
} from "api/productSurvey";
import { getPlatforms } from "api/store";
import { mapGetters } from "vuex";
import UploadImage from "../uploadImage";
export default {
  data() {
    return {
      survey: null,
      params: [],
      form: {},
      table: [],
      dynamicParams: {},
      addParamNumber: null,
      desc: null,
      index: 0
    };
  },
  //   1是文本，2是单选，3是多选，4是时间
  computed: {
    ...mapGetters(["id"])
  },
  created() {
    if (this.$route.params.id) {
      this.survey = this.$route.params;
      this.desc = this.survey.desc;
      this._getParams(this.survey.category_id);
    } else {
      this.$router.push({
        name: "ProductSurveyList"
        // params: res.data
      });
      return;
    }

    // this._getPlatforms();

    this.initDynamicParams();
  },
  components: {
    UploadImage
  },
  methods: {
    initDynamicParams() {
      let dynamicParams = JSON.parse(this.survey.dynamicParams);
      let i = 1;
      this.table = dynamicParams.map(item => {
        this.dynamicParams[i] = { ...{}, ...item };
        return {
          index: i++,
          value: item.value
        };
      });

      this.index = i - 1;
    },
    _getSurveyParams() {
      getSurveyParamsBySurveyId({ surveyId: this.survey.id }).then(res => {
        if (res.code == 1) {
          res.data.forEach(item => {
            if (item.inputType <= 2) {
              this.form[item.params_id] = item.value;
            } else if (item.inputType == 3) {
              this.form[item.params_id] = JSON.parse(item.value);
            } else {
              this.form[item.params_id] = new Date(item.value);
            }
          });
        }
      });
    },
    _getParams(category) {
      getParams({ category }).then(res => {
        if (res.code == 1) {
          this.params = res.data;
          this.assignDefault(res.data);
          this._getSurveyParams();
        }
      });
    },

    // 选上默认值
    assignDefault(params) {
      params.forEach(item => {
        if (item.options.length > 0) {
          let defaults = item.options
            .filter(item => {
              return item.isDefault == 1;
            })
            .map(item => item.name);
          this.$set(this.form, item.id, defaults);
        } else {
          this.$set(this.form, item.id, "");
        }
      });
    },
    addParam() {
      if (!this.addParamNumber) {
        this.addParamNumber = 1;
      }

      for (let i = 0; i < this.addParamNumber; i++) {
        this.index += 1;
        this.table.push({ index: this.index, value: null });
        this.dynamicParams[this.index] = {
          cn: { key: null, value: null },
          en: { key: null, value: null }
        };
      }
    },
    insertParam(row) {
      this.table.splice(row.index, 0, { index: row.index + 1, value: null });
      let index = 1;
      let temp = {};
  
      // 重新建dynamicParams
      this.table.forEach(item => {
        item.index = index;
        if (index < row.index + 1) {
          temp[index] = this.dynamicParams[index];
        } else if (index == row.index + 1) {
          temp[index] = {
            cn: { key: null, value: null },
            en: { key: null, value: null }
          };
        } else if(index > row.index + 1){
          temp[index] = this.dynamicParams[index - 1];
        }
        index++;
      });
      console.log(temp);
      this.dynamicParams = temp;
      
      // this.$forceUpdate()
      this.$nextTick(() => {
        this.$set(this.dynamicParams, row.index + 1, {
          cn: { key: '', value: '' },
          en: { key: '', value: '' }
        });
        // this.dynamicParams = temp
      });
    },
    deleteParam(row) {
      // console.log(row);
      let deleteIndex = this.table.findIndex(item => {
        return item.index == row.index;
      });

      this.table.splice(deleteIndex, 1);
      delete this.dynamicParams[row.index];
      let index = 1;
      this.table.forEach(item => {
        item.index = index;
        index++;
      });
      let _index = 1;
      let temp = {};
      for (let key in this.dynamicParams) {
        temp[_index] = this.dynamicParams[key];
        _index++;
      }
      this.dynamicParams = temp;
    },
    // createTable() {
    //   if (!this.product) {
    //     this.$message.info("请先选择产品");
    //     return;
    //   }
    //   checkProduct({ product_id: this.product }).then(res => {
    //     if (res.code == 1) {
    //       this.$message.info("该产品的调查表已存在");
    //       return;
    //     } else {
    //       this._getParams(this.product_category);
    //     }
    //   });
    // },
    enterMethod() {
      this.addParam();
      // console.log(1);
    },
    saveTable() {
      // 构建上传的数据
      let survey = {
        id: this.survey.id,
        time: new Date().getTime(),
        desc: this.desc,
        dynamicParams: JSON.stringify(Object.values(this.dynamicParams))
      };
      let params = [];
      for (let id in this.form) {
        if (!this.form[id]) {
          continue;
        }
        let value =
          this.form[id] instanceof Array
            ? JSON.stringify(this.form[id])
            : this.form[id];
        params.push({
          id,
          value
        });
      }
      editSurvey({ survey, params }).then(res => {
        if (res.code == 1) {
          this.$message.success("保存成功");
        } else if (res.msg.name == "SequelizeUniqueConstraintError") {
          this.$message.error("请勿重复提交");
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.CreateProductSurvey {
  margin-top: 20px;
  text-align: left;
  .content {
    margin-top: 15px;

    section {
      margin-bottom: 20px;
      border-top: 1px solid #999;
      h3 {
        // text-align: center;
        font-size: 18px;
        line-height: 36px;
      }
    }
  }
  .form-item {
    float: left;
    width: 350px;
    //   min-width: 250px;
  }
}
</style>

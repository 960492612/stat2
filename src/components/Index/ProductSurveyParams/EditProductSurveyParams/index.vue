<template>
    <div class="addParam" v-loading="working" :element-loading-text="$t('product.loading.add')" element-loading-spinner="el-icon-loading">
        <el-form :model="data" status-icon label-position="right" label-width="120px" :rules="rules" ref="form" class="form">
            <el-form-item label="参数名:" prop="name">
                <el-input v-model="data.name" placeholder="填写参数名"></el-input>
            </el-form-item>
            <el-form-item label="参数类型:" prop="type">
                <el-select v-model="data.type" placeholder="选择参数类型" filterable style="width:100%">
                    <el-option v-for="item in paramTypes" :key="item.id" :value="item.id" :label="item.name">{{item.name}}</el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="输入类型:" prop="type">
                <el-select v-model="data.inputType" placeholder="选择输入类型" filterable style="width:100%" @change="changeInputType">
                    <el-option v-for="item in inputTypes" :key="item.id" :value="item.id" :label="item.name">{{item.name}}</el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="添加选项:" prop="options" v-show="data.inputType==2||data.inputType==3">
                <div v-for="(item, index) in options" :key="index" class="left">
                    <el-checkbox v-model="options[index]['isDefault']" @change="checkMethod(index)">默认已选</el-checkbox>
                    <label for="" style="margin-left:20px;">选项名：</label>
                    <el-input v-model="options[index]['name']" placeholder="填写选项名" style="width:25%" size="medium"></el-input>

                </div>
                <el-button type="primary" class="right" size="medium" @click="addOption()">
                    <i class="el-icon-plus"></i>
                </el-button>
            </el-form-item>

            <el-form-item>
                <submit :submitAbled="submitAbled" @click="submit"></submit>
            </el-form-item>
        </el-form>

    </div>
</template>
<script>
import { debounce } from "common/js/util";
import { PARAMTYPES, INPUTTYPES } from "common/js/config";
import { editParam, checkParam } from "api/productSurvey";
import { mapGetters } from "vuex";
import Submit from "base/Submit";
export default {
  data() {
    var _hasKey = (rule, value, callback) => {
      this._debounce(value, callback);
    };
    return {
      data: {
        name: null,
        type: null,
        inputType: null
      },
      options: [{ name: null, isDefault: false }],
      rules: {
        name: [
          { required: true, message: this.$t("data.empty"), trigger: "blur" },
          { validator: _hasKey, trigger: "change" }
        ],
        type: [
          { required: true, message: this.$t("data.empty"), trigger: "blur" }
        ],
        inputType: [
          { required: true, message: this.$t("data.empty"), trigger: "blur" }
        ]
      },
      PARAMTYPES: PARAMTYPES,
      working: false,
      INPUTTYPES: INPUTTYPES,
      submitAbled: true
    };
  },
  created() {
    this._debounce = this._hasKey();
    if (this.$route.params.id) {
      let data = this.$route.params;
      this.data.id = data.id;
      this.data.name = data.name;
      this.$nextTick(() => {
        this.data.type = data.type;
        this.data.inputType = data.inputType;
      });
      this.options = data.options.map(item => {
        item.isDefault = item.isDefault == 1;
        return item;
      });
    } else {
      this.$router.push({ name: "ProductSurveyParamsList" });
    }
  },
  computed: {
    paramTypes() {
      let ret = [];
      for (let i in PARAMTYPES) {
        ret.push({
          id: Number(i),
          name: PARAMTYPES[i]
        });
      }
      return ret;
    },
    inputTypes() {
      let ret = [];
      for (let i in INPUTTYPES) {
        ret.push({
          id: Number(i),
          name: INPUTTYPES[i]
        });
      }
      return ret;
    },
    ...mapGetters(["id"])
  },
  mounted() {},
  methods: {
    _hasKey() {
      return debounce((value, callback) => {
        checkParam(value).then(res => {
          if (res.code == 1) {
            callback(new Error("已存在该参数名"));
          } else {
            callback();
          }
        });
      }, 300);
    },
    addOption() {
      this.options.push({ name: null, isDefault: false });
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this._editParam();
        }
      });
    },
    // 手动维持单选
    checkMethod(index) {
      // 多选无所谓
      if (this.data.inputType == 3) {
        return;
      }

      for (let i = 0; i < this.options.length; i++) {
        if (i == index) {
          continue;
        }
        this.options[i].isDefault = false;
      }
    },
    changeInputType() {
      this.options.forEach(item => {
        item.isDefault = false;
      });
    },
    _editParam() {
      //   去掉不正确的值
      let options = this.options.filter(item => {
        return item.name != null && item.name != "";
      });
      editParam({ param: this.data, options }).then(res => {
        if (res.code == 1) {
          this.$message({
            message: "修改成功",
            type: "success",
            onClose: () => {
              this.$router.push({ name: "ProductSurveyParamsList" });
            }
          });
        } else {
          this.$message(this.$t("product.add.error"));
          this.submitAbled = true;
        }
      });
    }
  },
  components: {
    Submit
  }
};
</script>
<style lang="scss" scoped>
.addParam {
  margin-top: 20px;
  width: 50%;
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
</style>

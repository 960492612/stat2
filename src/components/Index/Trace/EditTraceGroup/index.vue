<template>
  <div class="AddTrace" v-loading="working" element-loading-text="正在努力添加.." element-loading-spinner="el-icon-loading">
    <el-form :model="data" status-icon label-position="right" label-width="100px" :rules="rules" ref="form" class="form">
      <!-- <el-form-item label="主题名" prop="key" required>
        <el-input v-model="data.key" placeholder="填写唯一的名字用于该推广链接的记录,建议加属于自己的前缀" :disabled="isEdit"></el-input>
      </el-form-item> -->
      <el-form-item label="网址" prop="url" required>
        <el-input v-model="data.url" placeholder="填写原始链接的完整网址"></el-input>
      </el-form-item>

      <el-form-item label="相关店铺" prop="store">
        <el-select v-model="selectedPlatform" placeholder="选择平台" @change="changePlatform" style="width:49%">
          <el-option v-for="(item, index) in platforms" :key="index" :value="item.id" :label="item.name">{{item.name}}</el-option>
        </el-select>
        <el-select v-model="data.store" placeholder="选择店铺" style="width:49%">
          <el-option v-for="(item, index) in stores" :key="index" :value="item.id" :label="item.name">
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.desc }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="相关产品" prop="product">
        <el-select v-model="data.product" filterable :placeholder="$t('search.label.sp')" style="width:100%">
          <el-option v-for="(item, index) in products" :key="index" :value="item.id" :label="item.name" v-if="products">
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.desc }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input v-model="data.desc" placeholder="简短的描述"></el-input>
      </el-form-item>
      <el-form-item align="left">
        <el-button type="primary" @click="submit">保存修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { editTraceGroup } from "api/trace";
import { getPlatforms } from "api/store";
import { mapGetters } from "vuex";
import { findStores } from "api/store";
import { getProducts } from "api/product";
export default {
  data() {
    var isUrl = (rule, value, callback) => {
      //   网址检测
      let reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
      if (!reg.test(value)) {
        callback(new Error("请输入正确的可直接访问的网址"));
      } else {
        callback();
      }
    };
    return {
      data: {
        url: "",
        desc: "",
        store: null,
        product: null,
        id: null
      },
      rules: {
        // key: [
        //   { required: true, message: "不能为空", trigger: "blur" },
        //   { validator: _hasKey, trigger: "change" }
        // ],
        url: [
          { required: true, message: "不能为空", trigger: "blur" },
          { validator: isUrl, trigger: "change" }
        ]
      },
      platforms: null,
      stores: null,
      products: null,
      selectedPlatform: null,
      working: false
    };
  },
  created() {
    // this._debounce = this._hasKey();

    if (this.$route.params.data) {
      const params = this.$route.params.data;
      this.data = {
        url: decodeURIComponent(params.url),
        desc: params.desc,
        store: params.store_id,
        platform: params.platform_id,
        product: params.product_id,
        id: params.id
      };
      this._getStores(params.platform_id)
      this.selectedPlatform = params.platform;
    } else {
      this.$router.go(-1);
    }
    this._getPlatforms();
    this._getProduct();
  },
  mounted() {},
  computed: {
    ...mapGetters(["id"])
  },
  methods: {
    _getPlatforms() {
      getPlatforms().then(res => {
        if (res.code == 1) {
          this.platforms = res.data;
        }
      });
    },
    _getProduct() {
      getProducts().then(res => {
        if (res.code == 1) {
          this.products = res.data;
        }
      });
    },
    _getStores(platform) {
      findStores({ platform }).then(res => {
        if (res.code == 1) {
          this.stores = res.data;
        }
      });
    },
    changePlatform(val) {
      this.data.store = null
      this._getStores(val);
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this._editTraceGroup();
        }
      });
    },
    _editTraceGroup() {
      this.working = true
      editTraceGroup({ ...this.data, ...{ owner_id: this.id } }).then(res => {
        this.working = false
        if (res.code == 1) {
          // this.result = this.makeResult(res.hash);
          this.$message({
            message: "修改成功",
            type: "success",
            onClose: () => {
              this.$router.push({ name: "TraceList" });
            }
          });
        } else {
          this.$message("注册失败");
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.AddTrace {
  margin-top: 20px;
  width: 50%;
  .form {
    border-bottom: 1px solid #eee;
  }
  .rate {
    margin-top: 10px;
    width: 140px;
  }
  .result {
    padding-top: 15px;
    text-align: left;
    padding-left: 55px;
    font-size: 14px;
  }
  .resultText {
    margin-top: 20px;
  }
}
</style>

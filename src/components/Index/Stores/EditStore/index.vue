<template>
  <div class="addStore" v-loading="working" :element-loading-text="$t('product.loading.add')" element-loading-spinner="el-icon-loading">
    <el-form :model="data" status-icon label-position="right" label-width="120px" :rules="rules" ref="form" class="form">
      <el-form-item label="店铺名" prop="name">
        <el-input v-model="data.name" placeholder="店铺名"></el-input>
      </el-form-item>
      <el-form-item label="首页链接" prop="link">
        <el-input v-model="data.link" placeholder="首页链接"></el-input>
      </el-form-item>
      <el-form-item label="所属平台" prop="platform">
        <el-select v-model="data.platform" placeholder="选择平台" filterable style="width:100%" @change="selectPlatform">
          <el-option v-for="item in platforms" :key="item.id" :value="item.id" :label="item.name">{{item.name}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="负责人" prop="owner">
        <el-select v-model="data.owner" placeholder="选择负责人" filterable style="width:100%" loading-text="请选择平台" :loading="!data.platform">
          <el-option v-for="item in admins" :key="item.id" :value="item.id" :label="item.name">{{item.name}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('product.label.desc')" prop="desc">
        <el-input v-model="data.desc" :placeholder="$t('product.placeholder.desc')"></el-input>
      </el-form-item>

      <el-form-item>
        <submit :submitAbled="submitAbled" @click="submit"></submit>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import { debounce } from "common/js/util";
import { editStore, hasStoreKey , getPlatforms} from "api/store";
import { getAdmins } from "api/account";
import { roles } from "common/js/config";
import { mapGetters } from "vuex";
import Submit from "base/Submit";
export default {
  data() {
    var _hasKey = (rule, value, callback) => {
      this._debounce(value, callback);
    };
    return {
      data: {
        id: null,
        name: null,
        link: null,
        platform: null,
        owner: null,
        desc: null
      },
      rules: {
        name: [
          { required: true, message: this.$t("data.empty"), trigger: "blur" },
          { validator: _hasKey, trigger: "change" }
        ],
        link: [
          { required: true, message: this.$t("data.empty"), trigger: "blur" }
        ],
        platform: [
          { required: true, message: this.$t("data.empty"), trigger: "blur" }
        ],
        owner: [
          { required: true, message: this.$t("data.empty"), trigger: "blur" }
        ]
      },
      platforms: [],
      working: false,
      admins: [],
      // isEdit: false,
      getAdminOptions: true,
      submitAbled: true
    };
  },
  created() {
    this._debounce = this._hasKey();
    if (this.$route.params) {
      // this.isEdit = true;
      let params = this.$route.params
      this.data.id = params.id;
      this.data.name = params.name;
      this.data.link = params.link;
      this.data.desc = params.desc;
      this.data.platform = params.platform_id;
      this.data.owner = params.owner_id;
      this._getAdmins(params.platform_id)
    }
    this._getPlatforms();
    // this._getAdmins()
  },
  computed: {
    ...mapGetters(["id"])
  },
  mounted() {},
  methods: {
    _hasKey() {
      return debounce((value, callback) => {
        hasStoreKey(value).then(res => {
          if (res.code == 1) {
            callback(new Error(this.$t("product.add.product")));
          } else {
            callback();
          }
        });
      }, 300);
    },
    _getPlatforms() {
      getPlatforms().then(res => {
        if (res.code == 1) {
          this.platforms = res.data;
        }
      });
    },
    _getAdmins(platform) {
      getAdmins({ role: roles["平台管理员"], platform }).then(res => {
        if (res.code == 1) {
          this.admins = res.data;
          this.getAdminOptions = false;
        }
      });
    },
    selectPlatform(val){
      this.admins = []
      this._getAdmins(val)
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this._editStore();
        }
      });
    },
    _editStore() {
      
      editStore(this.data).then(res => {
        if (res.code == 1) {
          this.$message({
            message: "修改店铺成功",
            type: "success",
            onClose: () => {
              this.$router.push({ name: "Stores" });
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
  },
  
};
</script>
<style lang="scss" scoped>
.addStore {
  margin-top: 20px;
  width: 50%;
  // .form {
  //   // border-bottom: 1px solid #eee;
  // }
}
</style>

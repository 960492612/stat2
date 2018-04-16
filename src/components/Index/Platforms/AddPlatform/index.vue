<template>
  <div class="addPlatform" v-loading="working" :element-loading-text="$t('product.loading.add')" element-loading-spinner="el-icon-loading">
    <el-form :model="data" status-icon label-position="right" label-width="120px" :rules="rules" ref="form" class="form">
      <el-form-item :label="$t('product.label.name')" prop="name">
        <el-input v-model="data.name" placeholder="请输入平台名" :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item :label="$t('product.label.desc')" prop="desc">
        <el-input v-model="data.desc" placeholder="备注"></el-input>
      </el-form-item>

      <el-form-item>
        <submit :submitAbled="submitAbled" @click="submit"></submit>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
// import { registerStat, hasKey, updateStat } from "api/updateStat";
// import { debounce } from "common/js/util";
import { addPlatform } from "api/store";
import { mapGetters } from "vuex";
import Submit from "base/Submit";
export default {
  data() {
    return {
      data: {
        name: null,
        desc: null
      },
      rules: {
        name: [
          { required: true, message: this.$t("data.empty"), trigger: "blur" }
        ]
      },
      working: false,
      isEdit: false,
      submitAbled: true
    };
  },
  created() {},
  computed: {
    ...mapGetters(["id"])
  },
  mounted() {},
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this._addPlatform();
        }
      });
    },
    _addPlatform() {
      // let mid = this.$route.params.mid;
      let id = this.$route.params.id;
      addPlatform({ ...this.data }).then(res => {
        if (res.code == 1) {
          this.$message({
            message: this.$t("product.add.success"),
            type: "success",
            onClose: () => {
              this.$router.push({ name: "PlatformsList" });
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
.addPlatform {
  margin-top: 20px;
  width: 50%;
}
</style>

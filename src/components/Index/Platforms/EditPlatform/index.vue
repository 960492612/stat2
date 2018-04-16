<template>
  <div class="addPlatform" v-loading="working" :element-loading-text="$t('product.loading.add')" element-loading-spinner="el-icon-loading">
    <el-form :model="data" status-icon label-position="right" label-width="120px" :rules="rules" ref="form" class="form">
      <el-form-item label="平台名" prop="name">
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
import { editPlatform } from "api/store";
import { mapGetters } from "vuex";
import Submit from "base/Submit";
export default {
  data() {
    return {
      data: {
        id: null,
        name: null,
        desc: null
      },
      name: [
        { required: true, message: this.$t("data.empty"), trigger: "blur" }
      ],
      working: false,
      isEdit: false,
      submitAbled: true
    };
  },
  created() {
    if (this.$route.params) {
      this.data.id = this.$route.params.id;
      this.data.name = this.$route.params.name;
      this.data.desc = this.$route.params.desc;
    }
  },
  computed: {
    ...mapGetters(["id"])
  },
  mounted() {},
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this._editPlatform();
        }
      });
    },
    _editPlatform() {
      // let mid = this.$route.params.mid;
      let id = this.$route.params.id;
      editPlatform({ ...this.data }).then(res => {
        if (res.code == 1) {
          this.$message({
            message: '修改成功',
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

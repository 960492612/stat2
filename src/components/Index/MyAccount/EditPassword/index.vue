<template>
  <div class="editAccount" v-loading="working" element-loading-text="正在努力.." element-loading-spinner="el-icon-loading">
    <el-form :model="data" status-icon label-position="right" label-width="100px" :rules="rules" ref="form" class="form">
      
      <el-form-item label="旧密码:" prop="oldPwd">
        <el-input v-model="data.oldPwd" placeholder="填写旧密码" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码:" prop="newPwd">
        <el-input v-model="data.newPwd" placeholder="填写新密码" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码:" prop="confirmNewPwd">
        <el-input v-model="data.confirmNewPwd" placeholder="确认新密码" type="password"></el-input>
      </el-form-item>
      <el-form-item align="left">
        <submit :submitAbled="submitAbled" @click="submit"></submit>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
// import { registerStat, hasKey, updateStat } from "api/updateStat";
import { debounce } from "common/js/util";
import { editUserPassword } from "api/account";
import { mapGetters, mapActions } from "vuex";
import Submit from "base/Submit";
export default {
  data() {
 
    var confirmNewPwd = (rule, value, callback) => {
      if (value !== this.data.newPwd) {
        callback(new Error("两次新密码输入不一致！"));
      } else {
        callback();
      }
    };
    return {
      data: {
        oldPwd: null,
        newPwd: null,
        confirmNewPwd: null
      },
      rules: {
       
        oldPwd: [{ required: true, message: "不能为空", trigger: "blur" }],
        newPwd: [{ required: true, message: "不能为空", trigger: "blur" }],
        confirmNewPwd: [
          { required: true, message: "不能为空", trigger: "blur" },
          { validator: confirmNewPwd, trigger: "change" }
        ]
      },
      platforms: [],
      working: false,
      submitAbled: true
    };
  },
  created() {
    this.data.id = this.id
  },
  computed: {
    ...mapGetters(["id", "loginName"])
  },
  mounted() {},
  methods: {
    
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this._editUserPassword();
        }
      });
    },
    _editUserPassword() {
      editUserPassword(this.data).then(res => {
        if (res.code == 1) {
          this.$message({
            message: "修改成功",
            type: "success",
            onClose: () => {
              this.setLogout()
              // this.$router.push({ name: "Account" });
            }
          });
        } else {
          this.$message("修改失败");
        }
      });
    },
    ...mapActions(["setLogout"])
  },
  components: {
    Submit
  }
};
</script>
<style lang="scss" scoped>
.editAccount {
  margin-top: 20px;
  width: 50%;
 
}
</style>

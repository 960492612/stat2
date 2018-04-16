<template>
  <div class="login-main" v-loading="loading" :element-loading-text="$t('login.loadingText')" element-loading-spinner="el-icon-loading" @keyup.enter="submit">
    <div class="loging-title">
      {{$t('login.title')}}
    </div>
    <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm">
      <el-form-item prop="name">
        <el-input v-model="loginForm.name" :placeholder="$t('login.placeholder.username')" class="input"></el-input>
      </el-form-item>
      <el-form-item  prop="password">
        <el-input v-model="loginForm.password" type="password" :placeholder="$t('login.placeholder.password')" class="input"></el-input>
      </el-form-item>
      <el-form-item align="center">
        <el-button type="primary" @click="submit" class="login-btn">{{$t('login.enter')}}</el-button>
        <!-- <el-button @click="resetForm">重置</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { login } from "api/login";
import { mapActions } from "vuex";
export default {
  data() {
    const nameCheck = (rule, value, cb) => {
      if (!value) return cb(new Error(this.$t('login.error.username')));
      if (/<+|>+|\?+|\s+/g.test(value)) return cb(new Error(this.$t('login.error.illegal')));
      cb();
    };
    const pwdCheck = (rule, value, cb) => {
      if (!value) return cb(new Error(this.$t('login.error.illegal')));
      cb();
    };
    return {
      loginForm: {
        name: "",
        password: ""
      },
      rules: {
        name: [{ validator: nameCheck, trigger: "blur" }],
        password: [{ validator: pwdCheck, trigger: "blur" }]
      },
      loading: false
    };
  },
  methods: {
    submit() {
      this.$refs.loginForm.validate(valid => {
        // pass
        if (valid) {
          this.loading = true;
          login(this.loginForm).then(res => {
            this.loading = false;
            // 登录成功
            if (res.code == 1) {
              // console.log(res);
              this.setLogin(res);
              let redirect = this.$route.query.redirct;
              this.$router.push({ path: redirect ? redirect : "/" });
            } else {
              this.$message(res.msg);
            }
          });
        }else{
          this.$message(this.$t('login.error.illegal'));
          this.$refs.loginForm.resetFields();
        }
      });
    },
    resetForm() {
      this.$refs.loginForm.resetFields();
    },
    ...mapActions(["setLogin"])
  }
};
</script>

<style lang="scss">
.login-main {
  width: 300px;
  height: 254px;
  padding: 10px 20px;
  border: 1px solid #eee;
  border-radius: 5px;
  .loging-title{
    font-size: 16px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .input{
    box-sizing: border-box;
    padding: 2px;
  }
  .login-btn{
    width: 100%;
    padding: 10px 20px;
    background: #9173ff;
    border: none;
    font-size: 18px;
    letter-spacing: 10px;
  }
}
</style>

<template>
    <el-dropdown placement="bottom-end" @command="_changeLanguage">
        <span class="el-dropdown-link">
            {{$t('lang')}}
            <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="zh-cn">中文</el-dropdown-item>
            <el-dropdown-item command="en">English</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "changeLanguage",
  data(){
      return {
        cn: '??'
      }
  },
  methods: {
    _changeLanguage(command) {
      this.$i18n.locale = command;
      
      this.changeLanguage(command);
    },
    ...mapActions(["changeLanguage"])
  }
};
</script>


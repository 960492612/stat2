<template>
  <div class="sidebar">
    <el-menu :default-active="activeIndex" :router="true" mode="horizontal" class="menu" v-if="_router.children&& _router.children.length>0">

      <!-- 字符串和router对象都可以 -->
      <el-menu-item v-for="(item, _index) in _router.children" :key="_index" :index="item.name" :route="{name: item.name}" class="menu-item" v-if="item.meta.isMenu">
        <span slot="title">{{isCn?item.cn:item.en}}</span>
      </el-menu-item>

    </el-menu>
    <div class="admin">
      <span>{{roleText}}:</span>
      <span>{{loginName}}</span>
      <span>| {{currentDay}} |</span>
      <change-lang/>
      <el-button type="info" @click="setLogout" size="mini">{{$t('login.logout')}}</el-button>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { formatTime } from "common/js/util";
import ChangeLang from "base/ChangeLang";
import { roles } from "common/js/config";
export default {
  props: {
    topMenuName: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      activeIndex: "",
      currentDay: formatTime(new Date().getTime()),
      roles: roles
    };
  },
  computed: {
    _router() {
      return this.router.find(item => {
        return item.name == this.topMenuName;
      });
    },
    roleText(){
      for(let role in this.roles){
        if(roles[role] == this.role){
          return role
        }
      }
    },
    isCn() {
      return this.language == "zh-cn";
    },
    ...mapGetters(["router", "loginName", "role", "language"])
  },
  created() {
    this.activeIndex = this.$route.name;
  },
  methods: {
    logout() {
      // this.$router.push({ path: "/" });
      this.setLogout();
    },
    ...mapActions(["setLogout"])
  },
  components: {
    ChangeLang
  },
  watch: {
    $route(newVal) {
      this.activeIndex = newVal.name;
    }
  }
};
</script>
<style lang="scss" scoped>
.sidebar {
  height: 44px;
  position: relative;
  .menu {
    height: 100%;
    .menu-item {
      height: 44px;
      line-height: 44px;
    }
  }
  .admin {
    position: absolute;
    font-size: 14px;
    right: 24px;
    top: 9px;
    span {
      &:nth-of-type(2) {
        margin-right: 5px;
      }
    }
    .el-dropdown-link {
      cursor: pointer;
      color: rgb(47, 135, 218);
    }
  }
}
</style>
<template>
  <div class="left-sidebar">
    <el-menu :default-active="activeIndex" :router="true" class="menu" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <!-- 字符串和router对象都可以 -->
      <!-- <el-menu-item v-for="(item, _index) in router" :key="_index" :index="
      item.path" :route="{path: item.path}">
        <span slot="title">{{isCn?item.cn:item.en}}</span>
      </el-menu-item> -->
      <el-submenu :index="index" v-for="(group, index) in groupRouter" :key="index" v-if="groupRouter">
        <template slot="title">
          <span>{{index}}</span>
        </template>
        <el-menu-item v-for="(item, _index) in group" :key="_index" :index="item.path" :route="{path: item.path}">
          <span slot="title">{{isCn?item.cn:item.en}}</span>
        </el-menu-item>
      </el-submenu>
      <!-- <el-menu-item-group v-for="(group, index) in groupRouter" :key="index" v-if="groupRouter">
        <template slot="title">
          <span>{{index}}</span>
        </template>
        <el-menu-item v-for="(item, _index) in group" :key="_index" :index="
      item.path" :route="{path: item.path}">
          <span slot="title">{{isCn?item.cn:item.en}}</span>
        </el-menu-item>
      </el-menu-item-group> -->
    </el-menu>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      activeIndex: "",
      groupRouter: null
    };
  },
  computed: {
    isCn() {
      return this.language == "zh-cn";
    },

    ...mapGetters(["router", "language"])
  },
  mounted() {
    if (/(\/\w+)\//.test(this.$route.fullPath)) {
      this.activeIndex = RegExp.$1;
    }
  },
  created() {
    this.groupRouter = this._getGroupRouter();
  },
  watch: {
    router() {
      this.groupRouter = this._getGroupRouter();
    }
  },
  methods: {
    _getGroupRouter() {
      // let ret = []
      let groups = {};
      this.router.forEach(item => {
        if (groups[item.group] === undefined) {
          groups[item.group] = [item];
          // ret.push({
          //   [item.group]: [item]
          // })
        } else {
          groups[item.group].push(item);
        }
      });
      return groups;
    }
  }
};
</script>
<style lang="scss">
.left-sidebar {
  .el-submenu__title {
    // padding-left: 0;
    // font-size: 16px;
    // color: #a5a5a5;
    text-align: left;
    font-size: 14px;
    // background: #409EFF;
    // span {
    //   // padding-left: 12px;
    //   // font-weight: bold;
    //   // color: #409EFF;
    // }
  }
  .is-opened{
    .el-submenu__title{
      color: #ffd04b!important;
      // background: rgba(0, 0, 0, 0.4)!important;
    }
  }
  .el-menu-item {
    font-size: 12px;
  }
  .el-submenu .el-menu-item{
    min-width: 0;
  }
  height: 100%;
  // .header {
  //   height: 80px;
  //   h2 {
  //     text-align: center;
  //     line-height: 80px;
  //     font-size: 18px;
  //     img {
  //       width: 80px;
  //       height: 80px;
  //       vertical-align: middle;
  //     }
  //     span {
  //       padding-left: 20px;
  //     }
  //   }
  // }
  .menu {
    min-height: 100%;
    // width: 250px;
    .link {
      text-decoration: underline;
      color: #fff;
    }
  }
}
</style>
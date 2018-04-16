<template>
  <div id="app">

    <router-view/>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import Index from "@/components/Index";
import Vue from "vue";
export default {
  name: "app",
  created() {
    this.checkLogin().then(res => {
      this.init();
      if (res) {
        this.$router.push({ path: this.currentLocation });
      } else {
        this.$router.push({ path: "/entry" });
      }

      // }
    });
  },
  computed: {
    ...mapGetters(["router", "isLogin", "currentLocation"])
  },
  methods: {
    init() {
      let children = this.initRouter(
        JSON.parse(JSON.stringify(this.router)),
        `./components/Index`
      );
      let redirect = children.length > 0 ? children[0].path : "/entry"
      // console.log(children);
      let routes = [
        {
          path: "/",
          name: "Index",
          component: Index,
          redirect,
          meta: { requireAuth: true },
          children
        }
      ];

      this.$router.addRoutes(routes);
      // if(this.currentLocation == ''){
      this.$router.push({ path: redirect});
      // }
      // this.$nextTick(() => {
      //   // this.$router.push({ path: this.currentLocation });
      // });
    },
    // 动态添加递归路由
    initRouter(router, path) {
      router.map(item => {
        // let _path = path;
        let _path = `${path}/${item.name}`;
        item.component = res => {
          import(_path + "").then(module => {
            res(module);
          });
        };
        if (item.children && item.children.length) {
          this.initRouter(item.children, _path);
        }
      });
      return router;
    },
    ...mapActions(["checkLogin"]),
    ...mapMutations({
      setCurrentLocation: "SET_CURRENT_LOCATION"
    })
  },
  watch: {
    isLogin(newVal) {
      this.init();
    },
    $route(newVal) {
      this.setCurrentLocation(newVal.fullPath);
    }
  }
};
</script>

<style>
#app {
  font-family: "微软雅黑", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  height: 100%;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

<template>
  <div class="home">

    <el-container class="container">

      <!-- 菜单栏 -->
      <el-aside width="160px">
        <sidebar></sidebar>
      </el-aside>
      <!-- 左侧 -->
      <el-container>
        <!-- <el-header>

          </el-header> -->
        <el-main class="main">
          <!-- 对应菜单的主内容 -->

          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>

        </el-main>
      </el-container>

    </el-container>

  </div>
</template>
<script>
import Sidebar from "components/Sidebar";
// import AppHeader from "components/AppHeader";
export default {
  components: {
    // AppHeader,
    Sidebar
    // TopSearch
  }
};
</script>
<style lang="scss" scoped>
.home,
.container {
  height: 100%;
}
.main {
  // position: relative;
  padding-top: 5px;
  // width: 100%;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

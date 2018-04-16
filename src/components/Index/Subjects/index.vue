<template>
  <div>
    <subMenu :topMenuName="`Subjects`"></subMenu>
    <transition name="fade" mode="out-in">
      <keep-alive exclude="RegisterSubject, AddRecord">
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>
<script>
import subMenu from "base/subMenu";

export default {
  name: "Subjects",
  components: {
    subMenu
  }
};
</script>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

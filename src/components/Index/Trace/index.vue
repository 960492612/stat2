<template>
  <div>
    <subMenu :topMenuName="`Trace`"></subMenu>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import subMenu from "base/subMenu";

export default {
  name: "Trace",
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
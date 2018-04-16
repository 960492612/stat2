<template>
  <div>
    <subMenu :topMenuName="`Platforms`"></subMenu>
    <router-view></router-view>

  </div>
</template>
<script>
import subMenu from 'base/subMenu'
export default {
  name:'Platforms',
  components:{
    subMenu
  }
}
</script>

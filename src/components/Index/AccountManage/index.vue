<template>
  <div>
    <subMenu :topMenuName="`AccountManage`"></subMenu>
    <router-view></router-view>

  </div>
</template>
<script>
import subMenu from 'base/subMenu'
export default {
  name:'Accounts',
  components:{
    subMenu
  }
}
</script>

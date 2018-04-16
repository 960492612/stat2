<template>
  <div>
    <subMenu :topMenuName="`MyAccount`"></subMenu>
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

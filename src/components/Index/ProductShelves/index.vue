<template>
  <div>
    <subMenu :topMenuName="`ProductShelves`"></subMenu>
    <keep-alive>
      <router-view/>
    </keep-alive>
    
  </div>
</template>
<script>
import subMenu from "base/subMenu";

export default {
  name: "ProdutShelves",
  components: {
    subMenu
  },
};
</script>
<style lang="scss" scoped>
.content {
  margin-top: 20px;
  text-align: left;
  .second-content {
    li {
      height: 30px;
      line-height: 30px;
      border-bottom: 1px solid #eee;
      span {
        padding-left: 10px;
        display: inline-block;
        width: 166px;
      }
    }
  }
}
</style>

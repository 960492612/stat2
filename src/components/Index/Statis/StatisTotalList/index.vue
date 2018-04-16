<template>
  <div class="statis">
    <AdminSearch v-if="role == 6"/>
    <manage-search v-if="role != 6"/>
    <!-- 每个元主题的记录总表 -->

    <statis />
  </div>
</template>
<script>
import Statis from "../common/Statis";
import AdminSearch from "base/Search/adminSearch";
import ManageSearch from "base/Search/manageSearch";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["role"])
  },
  created(){
    
  },
  components: {
    AdminSearch,
    ManageSearch,
    Statis
  }
};
</script>
<style lang="scss">

</style>


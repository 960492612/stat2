<template>
    <el-button :type="submitAbled?'primary':'info'" @click="submit" :disabled="!submitAbled" class="button">{{submitAbled? $t('submit.save'): $t('submit.working')}}</el-button>
</template>
<script>
export default {
  props: {
    submitAbled: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  methods: {
    submit() {
      this.$emit("click");
    }
  }
};
</script>

<style lang="scss" scoped>
.button{
  width: 50%;
}
</style>

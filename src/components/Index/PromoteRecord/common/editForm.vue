<template>
    <div>
        <el-form :model="data" :inline="true" :label-position="right" :rules="rules" ref="form">
            <el-form-item label="展现量">
                <el-input v-model.number="data['showCount']" placeholder="填入整数" clearable style="width:120px;"></el-input>
            </el-form-item>
            <el-form-item label="阅读量">
                <el-input v-model.number="data['readCount']" placeholder="填入整数" clearable style="width:120px;"></el-input>
            </el-form-item>
            <el-form-item label="互动量">
                <el-input v-model.number="data['activeCount']" placeholder="填入整数" clearable style="width:120px;"></el-input>
            </el-form-item>
            <el-form-item label="文章数">
                <el-input v-model.number="data['articleCount']" placeholder="填入整数" clearable style="width:120px;"></el-input>
            </el-form-item>
            <el-form-item label="">
                <el-button type="success" @click="save">修改数据</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { editRecord } from "api/recordByChannel";
export default {
  props: {
    record: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    var checkPositive = (rule, value, callback) => {
      if (value && Number(value) < 0) {
        return callback(new Error("不能为负数"));
      } else {
        callback();
      }
    };
    return {
      data: {
        id: this.record.id,
        showCount: this.record.showCount,
        readCount: this.record.readCount,
        activeCount: this.record.activeCount,
        articleCount: this.record.articleCount
      },
      rules: {
        showCount: [{ validator: checkPositive, trigger: "change" }],
        readCount: [{ validator: checkPositive, trigger: "change" }],
        activeCount: [{ validator: checkPositive, trigger: "change" }],
        articleCount: [{ validator: checkPositive, trigger: "change" }]
      }
    };
  },
  methods: {
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
            editRecord({data: this.data}).then(res=>{
                if(res.code == 1){
                    this.$message.success('修改成功')
                    this.$emit('close')
                }
            })
        }
      });
    }
  }
};
</script>

<style>
</style>

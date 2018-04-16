<template>
    <div class="form">
        <el-table :data="data">
            <el-table-column label="店铺" prop="store">
            </el-table-column>
            <el-table-column label="平台售价" prop="price">
                <template slot-scope="scope">
                    <el-input v-model="uploadData['price']" placeholder="普通文本格式"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="上架链接数量" prop="linkNumber">
                <template slot-scope="scope">
                    <el-input v-model.number="uploadData['linkNumber']" placeholder=""></el-input>
                </template>
            </el-table-column>
            <el-table-column label="推广费用(RMB)" prop="fee">
                <template slot-scope="scope">
                    <el-input v-model.number="uploadData['fee']" placeholder="请用人民币表示"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="曝光量" prop="views">
                <template slot-scope="scope">
                    <el-input v-model.number="uploadData['views']" placeholder=""></el-input>
                </template>
            </el-table-column>
            <el-table-column label="页面访问量" prop="pv">
                <template slot-scope="scope">
                    <el-input v-model.number="uploadData['pv']" placeholder=""></el-input>
                </template>
            </el-table-column>
            <el-table-column label="访问客户数" prop="uv">
                <template slot-scope="scope">
                    <el-input v-model.number="uploadData['uv']" placeholder=""></el-input>
                </template>
            </el-table-column>
            <el-table-column label="累计收藏" prop="collection">
                <template slot-scope="scope">
                    <el-input v-model.number="uploadData['collection']" placeholder=""></el-input>
                </template>
            </el-table-column>
            <el-table-column label="订单量" prop="orderNumber">
                <template slot-scope="scope">
                    <el-input v-model.number="uploadData['orderNumber']" placeholder=""></el-input>
                </template>
            </el-table-column>
            <el-table-column label="销售数量" prop="saleNumber">
                <template slot-scope="scope">
                    <el-input v-model.number="uploadData['saleNumber']" placeholder=""></el-input>
                </template>
            </el-table-column>
            <el-table-column label="刷单数量" prop="scalp">
                <template slot-scope="scope">
                    <el-input v-model.number="uploadData['scalp']" placeholder=""></el-input>
                </template>
            </el-table-column>
            <el-table-column label="累计销量" prop="totalSale">
                <template slot-scope="scope">
                    <el-input v-model.number="uploadData['totalSale']" placeholder=""></el-input>
                </template>
            </el-table-column>
            <el-table-column label="主要国家" prop="contry">
                <template slot-scope="scope">
                    <el-input v-model.number="uploadData['contry']" placeholder=""></el-input>
                </template>
            </el-table-column>
            <el-table-column label="备注" prop="remark">
                <template slot-scope="scope">
                    <el-input v-model="uploadData['remark']" placeholder="普通文本"></el-input>
                </template>
            </el-table-column>
        </el-table>
        <div class="btn-box">
            <el-button type="success" @click="save" :loading="saving">{{saving?'保存中...':'保存'}}</el-button>
        </div>
    </div>
</template>
<script>
import {editShelve} from 'api/productShelves'
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    type:{
        type:Number,
        default: 0
    }
  },
  data() {
    return {
        uploadData: {},
        saving: false
    }
  },
  created(){
      this.uploadData = {...{type: this.type}, ...this.data[0]}
  },
  watch:{
      data(){
          this.uploadData = {...{type: this.type}, ...this.data[0]}
      }
  },
  methods:{
      save(){
          this.saving = true
          editShelve(this.uploadData).then(res=>{
              if(res.code == 1){
                  this.$message.success('修改成功')
                  this.$emit('refresh')
              }else{
                  this.$message.error(res.msg)
              }
              this.saving = false
          })
      }
  }
};
</script>
<style lang="scss" scoped>
.btn-box{
    margin-top: 10px;
}
</style>

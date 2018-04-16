<template>
  <div class="addProduct" v-loading="working" :element-loading-text="$t('product.loading.add')" element-loading-spinner="el-icon-loading">
    <el-form :model="data" status-icon label-position="right" label-width="120px" :rules="rules" ref="form" class="form">
      <el-form-item :label="$t('product.label.name')" prop="name">
        <el-input v-model="data.name" :placeholder="$t('product.placeholder.product')" :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item :label="$t('product.label.category')" prop="category">
        <el-select v-model="data.category" :placeholder="$t('product.placeholder.category')" filterable style="width:100%">
          <el-option v-for="item in productCates" :key="item.id" :value="item.id" :label="item.name">{{item.name}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('product.label.desc')" prop="desc">
        <el-input v-model="data.desc" :placeholder="$t('product.placeholder.desc')"></el-input>
      </el-form-item>

      <el-form-item>
        <submit :submitAbled="submitAbled" @click="submit"></submit>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
// import { registerStat, hasKey, updateStat } from "api/updateStat";
import { debounce } from "common/js/util";
import { addProduct, editProduct, hasProductKey, getProductCates } from "api/product";
import { mapGetters } from "vuex";
import Submit from "base/Submit";
export default {
  data() {
    var _hasKey = (rule, value, callback) => {
      this.isEdit ? callback() : this._debounce(value, callback);
    };
    return {
      data: {
        name: null,
        category: null,
        desc: null
      },
      rules: {
        name: [
          { required: true, message: this.$t('data.empty'), trigger: "blur" },
          { validator: _hasKey, trigger: "change" }
        ],
        category:[{required: true, message: this.$t('data.empty'), trigger: "blur"}]
      },
      productCates: [],
      working: false,
      isEdit: false,
      submitAbled: true
    };
  },
  created() {
    this._debounce = this._hasKey();
    if (this.$route.params.id) {
      this.isEdit = true;
      this.data = { ...this.data, ...this.$route.params };
    }
    this._getProductCates()
  },
  computed: {
    ...mapGetters(["id"])
  },
  mounted() {},
  methods: {
    _hasKey() {
      return debounce((value, callback) => {
        hasProductKey(value).then(res => {
          if (res.code == 1) {
            callback(new Error(this.$t('product.add.product')));
          } else {
            callback();
          }
        });
      }, 300);
    },
    _getProductCates(){
      getProductCates().then(res=>{
        if(res.code == 1){
          this.productCates = res.data
        }
      })
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.isEdit ? this._editProduct() : this._addProduct();
        }
      });
    },
    _addProduct() {
      // let mid = this.$route.params.mid;
      let id = this.$route.params.id;
      addProduct({ ...this.data, ...{ owner: this.id } }).then(res => {
        if (res.code == 1) {
          this.$message({
            message: this.$t('product.add.success'),
            type: "success",
            onClose: () => {
              this.$router.push({ name: "Products" });
            }
          });
        } else {
          this.$message(this.$t('product.add.error'));
          this.submitAbled = true;
        }
      });
    },
    _editProduct() {
      editProduct({ ...this.data }).then(res => {
        if (res.code == 1) {
          this.$message({
            message: this.$t('product.edit.success'),
            type: "success",
            onClose: () => {
              this.$router.push({ name: "Products" });
            }
          });
        } else {
          this.$message(this.$t('product.edit.error'));
        }
      });
    }
  },
  components:{
    Submit
  }
};
</script>
<style lang="scss" scoped>
.addProduct {
  margin-top: 20px;
  width: 50%;

}
</style>

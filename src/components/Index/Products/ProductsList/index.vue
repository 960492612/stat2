<template>
  <div class="ProductList">
    <div class="search" style="text-align:left;">
      <label for="">查找产品:</label>
      <el-input v-model="currentProduct" placeholder="输入进行快捷查找"  @keyup.native="selectProduct" clearable style="width: 200px;">
      </el-input>
    </div>
    <div class="content">
      <el-table :data="tableData" style="width:770px;" max-height="650">
        <div slot="empty">
          <i class="el-icon-loading" v-show="loadStatus == 1"></i> {{loadingText}}</div>
        <el-table-column prop="id" :label="$t('product.label.id')" width="80" align="center">
        </el-table-column>
        <el-table-column prop="name" :label="$t('product.label.name')" width="180" align="center">
        </el-table-column>
        <el-table-column prop="category" :label="$t('product.label.category')" width="180" align="center" :filter-method="filterCategory" :filters="categories" >
        </el-table-column>
        <el-table-column prop="desc" :label="$t('product.label.desc')" width="180" align="center">
        </el-table-column>
        <el-table-column prop="oper" :label="$t('oper.oper')" align="center">
          <template slot-scope="scope">
            <el-button @click.native.prevent="editRow(scope.row)" type="text">
              {{$t('oper.edit')}}
            </el-button>
            <el-button @click.native.prevent="deleteRow(scope.row, scope.$index)" type="text">
              {{$t('oper.delete')}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getProducts, deleteProduct, getProductCates } from "api/product";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Products",
  data() {
    return {
      tableData: [],
      loadStatus: 1,
      productCates:[],
      currentProduct: null,
      originData: []
    };
  },
  computed: {
    loadingText() {
      return this.loadStatus == 1 ? this.$t('data.loading') : this.$t('data.none');
    },
    categories(){
      return this.productCates.map(item=>{
        return {
          text: item.name,
          value: item.name
        }
      })
    },
    ...mapGetters(["id"])
  },
  created() {
    this._getProduct();
    this._getProductCates()
  },
  methods: {
    _getProduct() {
      getProducts().then(res => {
        if (res.code == 1) {
          if (res.data.length == 0) {
            this.loadStatus = 0;
            return;
          }
          this.originData = res.data
          this.tableData = res.data;
        } else {
          this.loadStatus = 0;
        }
      });
    },
    _getProductCates(){
      getProductCates().then(res=>{
        if(res.code == 1){
          this.productCates = res.data
        }
      })
    },
    filterCategory(value, row) {
      return row.category == value;
    },
    selectProduct(e){
      if(this.currentProduct==""||!this.currentProduct){
        this.tableData = this.originData
        return
      }
      // console.log(val);
      this.tableData = this.originData.filter(item=>{
        return  new RegExp(this.currentProduct, 'i').test(item.name)
      })
    },
    editRow(row) {
      this.$router.push({
        name: "UpdateProduct",
        params: row
      });
    },
    deleteRow(row, index) {
      if (row.owner != this.id) {
        this.$message.error(this.$t('product.delete.disabled'));
        return;
      }
      this.$confirm(this.$t('product.delete.confirm'), this.$t('product.delete.tip'), {
        confirmButtonText: this.$t('product.delete.sure'),
        cancelButtonText: this.$t('product.delete.cancel'),
        type: "warning"
      })
        .then(() => {
          deleteProduct({ id: row.id, owner: this.id }).then(res => {
            if (res.code == 1) {
              this.$message({
                type: "success",
                message: this.$t('product.delete.success')
              });
              this._getProduct();
            } else {
              this.$message.error(this.$t('product.delete.error'));
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t('product.delete.canceled')
          });
        });
    }
  },
};
</script>
<style lang="scss" scoped>
.ProductList {
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

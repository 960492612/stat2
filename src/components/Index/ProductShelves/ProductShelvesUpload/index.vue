<template>
    <div class="ProdutShelvesUpload">
        <div class="search-box">
            <el-select v-model="product" filterable placeholder='选择相关产品' size="medium">
                <el-option v-for="(item, index) in jmProducts" :key="index" :value="item.id" :label="item.name" v-if="jmProducts">
                    <span style="float: left">{{ item.name }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.desc }}</span>
                </el-option>
            </el-select>
            <el-select v-model="type" placeholder="选择类型" size="medium" @change="changeType">
                <el-option v-for="(item, index) in [{name:'周数据',type: 0},{name:'月数据',type: 1} ]" :key="index" :value="item.type" :label="item.name"></el-option>
            </el-select>
            <el-date-picker v-model="date" :format="type==0?'yyyy 第 WW 周':''" :type="dateType" placeholder="选择时间段" size="medium" @change="checkDataByDate"></el-date-picker>
            <el-select v-model="selectedStores" placeholder="选择相关店铺" multiple size="medium" collapse-tags @change="changeStore">
                <el-option v-for="(item, index) in stores" :key="index" :value="item.id+'|'+item.name" :label="item.name">
                    <span style="float: left">{{ item.name }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.desc }}</span>
                </el-option>
            </el-select>
            <el-button type="primary" size="medium" @click="submit">提交</el-button>
        </div>
        <div class="form">
            <el-table :data="formType">
                <el-table-column label="店铺" prop="store">
                </el-table-column>
                <el-table-column label="平台售价" prop="price">
                    <template slot-scope="scope">
                        <el-input v-model="uploadData[scope.row.store_id]['price']" placeholder="普通文本格式"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="上架链接数量" prop="linkNumber">
                    <template slot-scope="scope">
                        <el-input v-model.number="uploadData[scope.row.store_id]['linkNumber']" placeholder=""></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="推广费用(RMB)" prop="fee">
                    <template slot-scope="scope">
                        <el-input v-model.number="uploadData[scope.row.store_id]['fee']" placeholder="请用人民币表示"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="曝光量" prop="views">
                    <template slot-scope="scope">
                        <el-input v-model.number="uploadData[scope.row.store_id]['views']" placeholder=""></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="页面访问量" prop="pv">
                    <template slot-scope="scope">
                        <el-input v-model.number="uploadData[scope.row.store_id]['pv']" placeholder=""></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="访问客户数" prop="uv">
                    <template slot-scope="scope">
                        <el-input v-model.number="uploadData[scope.row.store_id]['uv']" placeholder=""></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="累计收藏" prop="collection">
                    <template slot-scope="scope">
                        <el-input v-model.number="uploadData[scope.row.store_id]['collection']" placeholder=""></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="订单量" prop="orderNumber">
                    <template slot-scope="scope">
                        <el-input v-model.number="uploadData[scope.row.store_id]['orderNumber']" placeholder=""></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="销售数量" prop="saleNumber">
                    <template slot-scope="scope">
                        <el-input v-model.number="uploadData[scope.row.store_id]['saleNumber']" placeholder=""></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="刷单数量" prop="scalp">
                    <template slot-scope="scope">
                        <el-input v-model.number="uploadData[scope.row.store_id]['scalp']" placeholder=""></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="累计销量" prop="totalSale">
                    <template slot-scope="scope">
                        <el-input v-model.number="uploadData[scope.row.store_id]['totalSale']" placeholder=""></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="主要国家" prop="contry">
                    <template slot-scope="scope">
                        <el-input v-model.number="uploadData[scope.row.store_id]['contry']" placeholder=""></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="remark">
                    <template slot-scope="scope">
                        <el-input v-model="uploadData[scope.row.store_id]['remark']" placeholder="普通文本"></el-input>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import { getProducts } from "api/product";
import { findStores } from "api/store";
import { mapGetters } from "vuex";
import { formatTime, formatWeek } from "common/js/util";
import { upload } from "api/productShelves";
export default {
  data() {
    return {
      product: null,
      date: null,
      uploadDate: null,
      selectedStores: null,
      stores: [],
      type: 0,
      jmProducts: [],
      formType: [],
      uploadData: {}
    };
  },
  created() {
    this._getProduct();
    this._getStores(this.platform);
  },
  computed: {
    dateType() {
      return this.type == 0 ? "week" : "month";
    },
    ...mapGetters(["id", "platform"])
  },
  methods: {
    _getProduct() {
      getProducts().then(res => {
        if (res.code == 1) {
          if (res.data.length == 0) {
            return;
          }
          this.jmProducts = res.data;
        }
      });
    },
    _getStores(platform) {
      findStores({ platform }).then(res => {
        if (res.code == 1) {
          this.stores = res.data;
        }
      });
    },
    changeType() {
      this.date = null;
    },
    changeStore() {
      this.formType = this.selectedStores.map(store => {
        // 店铺id|店铺名字
        let storeArr = store.split("|");
        this.uploadData[storeArr[0]] = { store_id: Number(storeArr[0]) };
        return {
          store_id: storeArr[0],
          store: storeArr[1],
          price: null,
          pv: null,
          uv: null,
          views: null, //曝光量
          fee: null,
          collection: null,
          remark: null, //备注
          linkNumber: null,
          orderNumber: null,
          saleNumber: null,
          scalp: null, //刷单量
          contry: null,
          totalSale: null
        };
      });
    },
    checkDataByDate(value) {
      this.uploadDate =
        this.type == 0
          ? formatWeek(value)
          : Number(formatTime(this.date.getTime(), "yyyyMM"));
    },
    submit() {
      if (!this.product) {
        this.$message.info("请选择产品");
        return;
      }
      if (!this.uploadDate) {
        this.$message.info("请选择时间");
        return;
      }
      if (!this.selectedStores) {
        this.$message.info("请选择店铺");
        return;
      }
      let data = Object.values(this.uploadData).map(item => {
        return {
          ...item,
          ...{
            product_id: this.product,
            [this.dateType]: this.uploadDate,
            platform_id: this.platform,
            admin_id: this.id
          }
        };
      });
      upload({ data, type: this.type }).then(res => {
        if (res.code == 1) {
          this.$message.success("上传成功");
        } else {
          console.log(res.msg);
          this.$message.error("上传失败,请刷新重试");
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.ProdutShelvesUpload {
  margin-top: 20px;
  .search-box {
    text-align: left;
  }
}
</style>

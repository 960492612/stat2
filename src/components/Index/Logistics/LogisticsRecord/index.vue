<template>
  <div class="logisticsReocrd">
    <div class="order">
      <h3>订单表数据</h3>
      <ul>
        <li class="wrap header">
          <div class="item">日期</div>
          <div class="item">订单数</div>
          <div class="item">
            操作
          </div>
        </li>
        <li v-for="(item, index) in order" :key="item.id" class="wrap">
          <div class="item">{{format(item.date)}}</div>
          <div class="item">{{item.count}}</div>
          <div class="item">
            <el-button type="danger" size="mini" @click="deleteOrder(item.date, index)">删除</el-button>
          </div>
        </li>
      </ul>
    </div>
    <div class="product">
      <h3>产品表数据</h3>
      <ul>
        <li class="wrap header">
          <div class="item">日期</div>
          <div class="item">产品数</div>
          <div class="item">
            操作
          </div>
        </li>
        <li v-for="(item, index) in product" :key="item.id" class="wrap">
          <div class="item">{{format(item.date)}}</div>
          <div class="item">{{item.count}}</div>
          <div class="item">
            <el-button type="danger" size="mini" @click="deleteProduct(item.date, index)">删除</el-button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import {
  getCountOrderByDate,
  getCountProductByDate,
  deleteLogisticProduct,
  deleteLogisticOrder
} from "api/logistics";
export default {
  data() {
    return {
      product: [],
      order: []
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this._getCountOrderByDate();
      this._getCountProductByDate();
    },
    _getCountOrderByDate() {
      getCountOrderByDate().then(res => {
        this.order = res.data;
      });
    },
    _getCountProductByDate() {
      getCountProductByDate().then(res => {
        this.product = res.data;
      });
    },
    format(date) {
      date = date + "";
      return `${date.substr(0, 4)}年${date.substr(4, 2)}月`;
    },
    deleteOrder(date, index) {
      this.$confirm("此操作将永久删除该月份的数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteLogisticOrder({ date }).then(res => {
            if (res.code == 1) {
              this.$message.success("删除成功");
              this.order.splice(index, 1);
            } else {
              this.$message.error("删除失败");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    deleteProduct(date) {
      this.$confirm("此操作将永久删除该月份的数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteLogisticProduct({ date }).then(res => {
            if (res.code == 1) {
              this.$message.success("删除成功");
              this.order.splice(index, 1);
            } else {
              this.$message.error("删除失败");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.logisticsReocrd {
  margin-top: 20px;
  overflow: hidden;
  display: flex;
  h3 {
    line-height: 24px;
    text-align: left;
    font-weight: bold;
  }
  .order,
  .product {
    // float: left;
    flex: 1;
    padding: 20px;
    position: relative;
    box-sizing: border-box;
    // width: 40%;
    height: 500px;
    overflow-y: scroll;
    .wrap {
      display: flex;
      border-bottom: 1px solid #eee;
      .item {
        flex: 1;
        height: 44px;
        line-height: 44px;
      }
    }
    .header {
      height: 60px;
      .item {
        line-height: 60px;
      }
    }
  }
  .order {
    // &:after{
    //   position: absolute;
    //   right: 50px;
    //   content: '';
    //   width: 1px;
    //   height: 100%;
    //   background: #eee;
    // }
    border-right: 1px solid #eee;
  }

}
</style>


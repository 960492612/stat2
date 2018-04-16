<template>
  <div class="table">

    <el-table :data="datas" :show-summary="true" max-height="600" :summary-method="summaryMethod" >
      <el-table-column label="平台" prop="platform" align="center" width="100">
      </el-table-column>
      <el-table-column label="店铺" prop="store" align="center" width="100">
      </el-table-column>
      <el-table-column label="平台售价" prop="price" width="120" align="center">
      </el-table-column>
      <el-table-column label="上架链接数量" prop="linkNumber" width="120" align="center">
      </el-table-column>
      <el-table-column label="推广费用(RMB)" prop="fee" width="120" align="center">
      </el-table-column>
      <el-table-column label="曝光量" prop="views" width="100" align="center">
      </el-table-column>
      <el-table-column label="页面访问量" prop="pv" width="100" align="center">
      </el-table-column>
      <el-table-column label="访问客户数" prop="uv" width="100" align="center">
      </el-table-column>
      <el-table-column label="累计收藏" prop="collection" width="100" align="center">
      </el-table-column>
      <el-table-column label="订单量" prop="orderNumber" width="100" align="center">
      </el-table-column>
      <el-table-column label="转化率" prop="transform" width="100" align="center">
        <template slot-scope="scope">
          <el-popover trigger="click" placement="right">
            <p style="maxWidth:350px;">
              {{scope.row.transformType}}
            </p>
            <p slot="reference" :title="$t('statis.tip')" class="transformText">{{transform(scope.row)}}</p>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="销售数量" prop="saleNumber" width="100" align="center">
      </el-table-column>
      <el-table-column label="累计销量" prop="totalSale" width="100" align="center">
      </el-table-column>
      <el-table-column label="国家" prop="contry" width="100" align="center">
      </el-table-column>
      <el-table-column label="刷单数量" prop="scalp" width="100" align="center">
      </el-table-column>
      <el-table-column label="备注" prop="remark" align="center">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    datas: {
      type: Array,
      default: () => []
    }
  },
  computed: {},
  methods: {
    transform(row) {
      return row.transform.toFixed(2) + "%";
    },
    summaryMethod(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
          return;
        }
        if (column.property == "price" || column.property == "transform" || column.property == "remark") {
          return
        }
        const values = data.map(item => {
          return Number(item[column.property]);
        });
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          // sums[index] += " 次";
        } else {
          sums[index] = "";
        }
      });

      return sums;
    }
  }
};
</script>
<style lang="scss" scoped>
.table {
  margin-top: 20px;
}

.transformText {
  cursor: pointer;
  color: rgb(238, 98, 98);
}
</style>

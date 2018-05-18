<template>
    <div class="table">
        <el-table :data="data" @row-click="rowClick" ref="table" show-summary :summary-method="getSummaries">
            <div slot="empty">
                <i class="el-icon-loading" v-show="loadStatus == 1"></i> {{loadingText}}</div>

            <el-table-column label="发运仓库" prop="发运仓库" width="300" class-name="column"></el-table-column>
            <el-table-column :label="item" :prop="item" width="220" class-name="column" v-for="(item, index) in platforms" :key="index" align="center"></el-table-column>
            <el-table-column label="合计" prop="发运仓库" :formatter="getSumByWare" class-name="column" align="center"></el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    loadStatus: {
      type: Number,
      default: -1
    },
    platforms: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    loadingText() {
      return this.loadStatus == 1
        ? this.$t("data.loading")
        : this.$t("data.none");
    }
  },
  methods: {
    rowClick(row) {
      // this.$refs.table.toggleRowExpansion(row);
    },

    getSumByWare(row) {
      let ret = 0;
      for (let key in row) {
        if (!isNaN(row[key])) {
          ret += Number(row[key]);
        }
      }
      return ret;
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
          return;
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
          // sums[index] = "";
        }
      });
      sums[sums.length] = sums.reduce((pre, cur) => {
        const value = Number(cur);
        if (!isNaN(value)) {
          return pre + cur;
        } else {
          return pre;
        }
      }, 0);
      return sums;
    }
  }
};
</script>

<style>
</style>

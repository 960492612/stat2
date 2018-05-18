<template>
    <div class="table">
        <el-table :data="data" ref="table" height="750" show-summary :cell-class-name="keyShow">
            <div slot="empty">
                <i class="el-icon-loading" v-show="loadStatus == 1"></i> {{loadingText}}</div>

            <el-table-column label="SKU" prop="产品代码" width="200" class-name="column"></el-table-column>
            <el-table-column label="产品名称" prop="产品名称" width="350" class-name="column"></el-table-column>
            <el-table-column label="品类" prop="品类" width="200" class-name="column" :filters="type" filter-placement="bottom-end" :filter-method="filterHandler"></el-table-column>
            <el-table-column :label="item" :prop="item" width="220" class-name="column" v-for="(item, index) in months" :key="index" align="center"></el-table-column>
            <el-table-column label="环比" width="230" :formatter="getHuanBi" class-name="column" align="center"></el-table-column>

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
    months: {
      type: Array,
      default: () => []
    },
    type: {
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
    getHuanBi(row, column, value) {
      let length = this.months.length;
      if (length <= 1) {
        return "";
      }
      let result =
        (row[this.months[length - 1]] - row[this.months[length - 2]]) /
        row[this.months[length - 2]] *
        100;

      return result.toFixed(2) + "%";
    },
    keyShow(item) {
      if (item.columnIndex != Object.keys(item.row).length - 3) return "";
      let length = this.months.length;
      if (length <= 1) {
        return "";
      }
      let result =
        (item.row[this.months[length - 1] + ""] -
          item.row[this.months[length - 2] + ""]) /
        item.row[this.months[length - 2] + ""] *
        100;
      if (result >= 10) {
        return "keyShow";
      } else {
        return "";
      }
    },

    filterHandler(value, row, column) {
      const property = column["property"];
      // console.log(value);
      return row[property] == value;
    }
  }
};
</script>

<style>
</style>

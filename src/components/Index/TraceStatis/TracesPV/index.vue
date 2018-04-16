<template>
  <div class="pv" v-loading="loading">
    <label for="">选择推广员：</label>
    <el-select v-model="selectedAdmin" placeholder="可输入进行搜索" filterable clearable  :loading="getAdminOptions" :disabled="role != 6">
      <el-option v-for="item in admins" :key="item.id" :value="item.id" :label="item.name">{{item.name}}</el-option>
    </el-select>
    <label for="">选择起始日期：</label>
    <el-date-picker v-model="base" placeholder="选择起始日期" @change="_setBaseDate"></el-date-picker>
    <div class="echart-wrapper" ref="echart"></div>
    <summary-bottom :datas="datas" v-if="datas.length" :type="type"></summary-bottom>
  </div>

</template>
<script>
import { formatTime } from "common/js/util";
import SummaryBottom from "components/SummaryBottom";
import { statisInfoMixin } from "common/js/mixin";
export default {
  mixins: [statisInfoMixin],
  data() {
    return {
      type: "pv"
    };
  },
  methods: {
    setSeries(data) {
      let ret = [];
      this.datas = [];
      for (let i in data) {
        this.legends.push(data[i].key);
        let countByDay = {};
        // 先按日期排序一波
        this.sortByDate(data[i].datas);
        data[i].datas.forEach(item => {
          let date = formatTime(item.time);
          if (countByDay[date] === undefined) {
            countByDay[date] = 1;
          } else {
            countByDay[date]++;
          }
        });
        // 传递到底部的组件

        this.datas.push({ key: data[i].key, data: countByDay });
        // data[i][count] =
        let xAxisJson = {};
        this.xAxis.forEach(item => {
          xAxisJson[item] = 0;
        });
        // 合并数据
        let serieData = { ...xAxisJson, ...countByDay };
        let serie = {
          type: "line",
          showSymbol: true,
          // stack: "访问数",
          smooth: true,
          name: data[i].key,
          // stack: 'tiled',
          data: Object.values(serieData)
        };
        ret.push(serie);
      }
      return ret;
    }
  },
  components: {
    SummaryBottom
  }
};
</script>
<style lang="scss" scoped>
.pv {
  margin-top: 20px;
  text-align: left;
  .echart-wrapper {
    height: 500px;
  }
}
</style>

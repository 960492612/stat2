<template>
  <div class="uv" v-loading="loading">
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
// 大量代码移至mixin中
export default {
  mixins: [statisInfoMixin],
  data() {
    return {
      type: "uv"
    };
  },
  methods: {
    setSeries(data) {
      let ret = [];
      this.datas = [];
      for (let i in data) {
        this.legends.push(data[i].key);

        let itemsByDate = {};
        // 先按日期排序一波
        this.sortByDate(data[i].datas);
        // 先将所有同日期数据归并一起
        data[i].datas.forEach(item => {
          let date = formatTime(item.time);
          if (itemsByDate[date] === undefined) {
            itemsByDate[date] = { date: date, datas: [item] };
          } else {
            itemsByDate[date].datas.push(item);
          }
        });
        // 分日期算出有多少个不同的agent,即uv数据
        for (let i in itemsByDate) {
          let countByAgent = {};
          itemsByDate[i].count = 0;
          itemsByDate[i].datas.forEach(item => {
            if (countByAgent[item.agent_token] === undefined) {
              countByAgent[item.agent_token] = 1;
              itemsByDate[i].count++;
            }
          });
        }

        // 重新构建合适的json对象
        let countByDay = {};
        for (let key in itemsByDate) {
          countByDay[itemsByDate[key].date] = itemsByDate[key].count;
        }
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
          smooth: true,
          // stack: "访问数",
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
.uv {
  margin-top: 20px;
  text-align: left;
  .echart-wrapper {
    height: 500px;
  }
}
</style>

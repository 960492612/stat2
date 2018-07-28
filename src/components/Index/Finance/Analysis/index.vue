<template>
    <div>
        <search @search="search" :xlsName="xlsName" :fields="fields" :result="result"/>
        <el-tabs v-model="activeName"  type="border-card" class="tabs">
          <el-tab-pane label="资金汇总" name="first">
              <zijin-total ref="first" @resultChange="resultChange"/>
          </el-tab-pane>
          <el-tab-pane label="放款汇总(匹配)" name="two">
              <fangkuan-match ref="two" @resultChange="resultChange"/>
          </el-tab-pane>
          <el-tab-pane label="放款汇总(跨月)" name="three">
              <fangkuan-no-match ref="three" @resultChange="resultChange"/>
          </el-tab-pane>
          <el-tab-pane label="提现汇总" name="four">
              <null-total ref="four" @resultChange="resultChange"/>
          </el-tab-pane>
          <el-tab-pane label="退款汇总" name="five">
              <tuikuan ref="five" @resultChange="resultChange"/>
          </el-tab-pane>
          <el-tab-pane label="运费汇总" name="six">
              <yunfei ref="six" @resultChange="resultChange"/>
          </el-tab-pane>
          <el-tab-pane label="放款有资金无" name="seven">
              <no-match-in-zijin ref="seven" @resultChange="resultChange"/>
          </el-tab-pane>
          <el-tab-pane label="放款无资金有" name="eight">
              <no-match-in-fangkuan ref="eight" @resultChange="resultChange"/>
          </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import Search from '../Base/search'
import ZijinTotal from './tables/zijin_total'
import FangkuanMatch from './tables/fangkuan_match'
import NullTotal from './tables/null_total'
import FangkuanNoMatch from './tables/fangkuan_no_match'
import Tuikuan from './tables/tuikuan'
import Yunfei from './tables/yunfei'
import NoMatchInZijin from './tables/noMatchInZijin'
import NoMatchInFangkuan from './tables/noMatchInFangkuan'
export default {
    data(){
        return {
            xlsName: '',
            fields: {},
            result: [],
            activeName: 'first'
        }
    },
    components:{
        Search,
        ZijinTotal,
        FangkuanMatch,
        NullTotal,
        FangkuanNoMatch,
        Tuikuan,
        Yunfei,
        NoMatchInZijin,
        NoMatchInFangkuan
    },
    
    methods:{
        resultChange(data){
            this.xlsName = data.xlsName
            this.fields = data.fields
            this.result = data.result
        },
        search(time){
            // console.log(time);
            
            // 调用组件中的加载数据方法
            this.$refs[this.activeName].loadData(time)
        }
    }
}
</script>

<style>

</style>

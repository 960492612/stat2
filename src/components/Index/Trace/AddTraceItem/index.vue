<template>
  <div class="AddTrace" v-loading="working" element-loading-text="正在努力添加.." element-loading-spinner="el-icon-loading">
    <el-form :model="data" status-icon label-position="right" label-width="100px" :rules="rules" ref="form" class="form">
      
      <el-form-item label="选择渠道" prop="channel">
        <el-select v-model="selectedTopChannel" :placeholder="$t('search.placeholder.stc')" collapse-tags style="width:49%;float:left;" :loading="!topChannels" class="select" @change="changeTopChannel">
          <el-option v-for="(item, index) in topChannels" :key="index" :value="item.id" :label="item.name">{{item.name}}</el-option>
        </el-select>
        <el-select v-model="data.channel" :placeholder="$t('search.placeholder.ssc')" style="width:50%;float:left;margin-left:1%;" collapse-tags  :loading="!subChannels" :loading-text="selectedTopChannel&&selectedTopChannel.length>0? $t('search.select.loading'):$t('search.select.pstc')" :title="$t('search.select.title')">
          
            <el-option v-for="_item in subChannels" :key="_item.id" :label="_item.name" :value="_item.id">
              <span style="float: left">{{ _item.name }}</span>
              <span style="float: right; color: #8492a6;marginRight:15px; font-size: 13px">{{ _item.desc }}</span>
            </el-option>
          
        </el-select>
      </el-form-item>
      <el-form-item label="域名" prop="domain">
        <el-select v-model="data.domain" placeholder="" style="width:100%;">
          <el-option v-for="(item, index) in domains" :key="index" :value="item.domain" :label="item.domain">
            <span style="float: left">{{ item.domain }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.desc }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input v-model="data.desc" placeholder="选填"></el-input>
      </el-form-item>
      <el-form-item align="left">
        <el-button type="primary" @click="submit">生成追踪链接</el-button>
      </el-form-item>
    </el-form>
    <div class="result" v-show="result != ''">
      <span>以下链接用于进行实际推广：</span>
      <el-button @click="copyToClip" size="small"  ref="copy">复制到剪切板</el-button>
      <p v-text="result" class="resultText"></p>
    </div>
  </div>
</template>
<script>
import { addTraceItem } from "api/trace";
import {
  getChannelsByOwner,
  getTopChannelsByOwner,
  getSubChannelsByOwnerAndId
} from "api/channel";
import { debounce } from "common/js/util";
import copy from 'copy-to-clipboard';
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      data: {
        group_id: null,
        channel: null,
        domain: null,
        desc: null
        // hash: null,
      },
      rules: {
        channel: [{ required: true, message: "不能为空", trigger: "blur" }],
        domain: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      domains: [
        { domain: "www.zastone.com", desc: "美国" },
        { domain: "www.zastone.com.cn", desc: "国内" },
        { domain: "www.meisort.com", desc: "美国" },
        { domain: "www.zastone.net", desc: "俄罗斯" }
      ],
      selectedTopChannel:null,
      selectedSubChannel: null,
      topChannels: [],
      subChannels:[],
      working: false,
      result: "",
      // isEdit: false
    };
  },
  created() {
    if (this.$route.params.data) {
      this.data.group_id = this.$route.params.data.id;
      this._getTopChannelsByOwner()
    }
  },
  computed: {
    ...mapGetters(["id"])
  },
  methods: {
    _getTopChannelsByOwner() {
      getTopChannelsByOwner(this.id, 0).then(res => {
        if (res.code == 1) {
          this.topChannels = res.data;
        }
      });
    },
    changeSubChannel(value){

    },
    // 查找对应的次级渠道
    changeTopChannel(value) {
      if (!value || value.length == 0) {
        return;
      }
      // value是数组
      getSubChannelsByOwnerAndId(this.id, [value]).then(res => {
        if(res.code == 1){
          this.subChannels = res.data[0].children;
        }
      });
    },
    
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
         this._addTraceItem();
        }
      });
    },
    _addTraceItem() {
      addTraceItem(this.data).then(res => {
        if (res.code == 1) {
          this.result = this.makeResult(res.data);
          this.$message({
            message: "注册成功",
            type: "success"
          });
        } else {
          this.$message("注册失败");
        }
      });
    },
    
    // 短链接
    makeResult(hash) {
      // return `http://localhost:3000/proxy.html#${hash}`
      return `http://${this.data.domain}/statis/proxy.html#${hash}`;
    },
    copyToClip() {
      copy(this.result)
      // document.execCommand('Copy')
      this.$message("复制成功");
    }
  }
};
</script>
<style lang="scss" scoped>
.AddTrace {
  margin-top: 20px;
  width: 50%;
  .form {
    border-bottom: 1px solid #eee;
  }
  .rate {
    margin-top: 10px;
    width: 140px;
  }
  .result {
    padding-top: 15px;
    text-align: left;
    padding-left: 55px;
    font-size: 14px;
  }
  .resultText {
    margin-top: 20px;
  }
}
</style>

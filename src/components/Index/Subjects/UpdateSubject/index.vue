<template>
  <div class="updateSubject">
    <el-form :model="data" :rules="rules" label-position="left" label-width="130px" class="form" ref="form" status-icon>
      <el-form-item :label="$t('statis.label.content')" prop="content">
        <el-input v-model="data.content" :placeholder="$t('subject.placeholder.content')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('statis.label.product')" prop="product">
        <el-select v-model="data.product" filterable :placeholder="$t('search.label.sp')" style="width:100%">
          <el-option v-for="(item, index) in jmProducts" :key="index" :value="item.id" :label="item.name" v-if="jmProducts">
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.desc }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 渠道 -->
      <el-form-item :label="$t('statis.label.channel')" prop="channels" align="left">
        <el-select v-model="selectedTopChannels" :placeholder="$t('search.placeholder.stc')" filterable multiple style="width:49%" :loading="!topChannels" disabled>
          <el-option v-for="(item, index) in topChannels" :key="index" :value="item.id" :label="item.name">{{item.name}}</el-option>
        </el-select>
        <!-- 次级 -->
        <el-select v-model="data.channels" :placeholder="$t('search.placeholder.ssc')" style="width:50%" multiple disabled filterable>
          <el-option-group v-for="item in subChannels" :key="item.id" :value="item.name" :label="item.name" v-if="subChannels">
            <el-option v-for="_item in item.children" :key="_item.id" :label="_item.name" :value="_item.name">
              <span style="float: left">{{ _item.name }}</span>
              <span style="float: right; color: #8492a6;marginRight:15px; font-size: 13px">{{ _item.desc }}</span>
            </el-option>
          </el-option-group>
        </el-select>
        <el-input v-model="data.link[item]" :placeholder="$t('subject.placeholder.link1')+item+$t('subject.placeholder.link2')" v-for="(item, index) in data.channels" :key="index" class="linkText" clearable prefix-icon="el-icon-share"></el-input>
      </el-form-item>

      <el-form-item :label="$t('subject.label.time')" prop="time">
        <el-date-picker :placeholder="$t('subject.placeholder.st')" v-model="data.time" style="width: 100%;"></el-date-picker>
      </el-form-item>
      <el-form-item align="left">
        <submit :submitAbled="submitAbled" @click="submit"></submit>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// import RegisterSubject from "../RegisterSubject";
import { editSubject } from "api/subject";
import {
  getChannelsByOwner,
  getTopChannelsByOwner,
  getSubChannelsByOwnerAndId
} from "api/channel";
import { debounce } from "common/js/util";
import Submit from "base/Submit";
import { mapGetters, mapActions } from "vuex";
import { getProducts } from "api/product";
export default {
  data() {
    return {
      data: {},
      sid: 0,
      rules: {
        content: [
          { required: true, message: this.$t("data.empty"), trigger: "blur" }
        ],
        product: [
          { required: true, message: this.$t("data.empty"), trigger: "blur" }
        ],
        channels: [
          { required: true, message: this.$t("data.empty"), trigger: "blur" }
        ],
        time: [
          { required: true, message: this.$t("data.empty"), trigger: "blur" }
        ]
      },
      selectedTopChannels: null,
      topChannels: null,
      jmProducts: null,
      subChannels: null,
      submitAbled: true
    };
  },
  created() {
    
  },
  activated() {
    if (!this.$route.params.hasOwnProperty("content")) {
      this.$router.push({ name: "Subjects" });
      return;
    }
    let subject = this.$route.params;
    this.data = this.generatorData(subject);
    this.topChannels = this.data.topChannels;
    this.selectedTopChannels = this.data.topChannels.map(item => {
      return item.id;
    });
    this.sid = subject.sid
  },
  mounted() {
    this._getProduct();
    this._getChannels();
  },
  computed:{
    ...mapGetters(['id'])
  },
  components: {
    Submit
  },
  methods: {
    submit() {
      this._editSubject()
    },
    makeSubChannels(channels) {
      return channels.map(item => {
        return item.channel;
      });
    },
    generatorData(data) {
      let ret = {
        content: data.content,
        // recentRecordTime: data.recentRecordTime,
        time: new Date(Number(data.time)),
        product: data.pid,
        channels: [],
        link: {},
        topChannels: null
      };
      // 暂存顶级渠道
      let topChannels = [];
      data.channels.forEach(item => {
        topChannels.push({ id: item.pCid, name: item.parentChannel });
        ret.channels.push(item.channels);
        ret.link[item.channels] = item.link;
      });
      ret.topChannels = unique(topChannels);
      return ret;
    },
    _editSubject() {
      this.$confirm(
        this.$t("subject.edit.confirm"),
        this.$t("product.delete.tip"),
        {
          confirmButtonText: this.$t("product.delete.sure"),
          cancelButtonText: this.$t("product.delete.cancel"),
          type: "warning"
        }
      )
        .then(() => {
          console.log(this.generaterSubmitData(this.data));
          editSubject(this.generaterSubmitData(this.data)).then(res => {
            if (res.code == 1) {
              this.$message({
                type: "success",
                message: res.msg,
                onClose: () => {
                  this.$router.push({ name: "Subjects" });
                }
              });
            } else {
              this.$message.error(res.msg);
              this.submitAbled = true;
            }
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            type: "info",
            message: this.$t("product.delete.canceled")
          });
        });
    },
    _getProduct() {
      getProducts().then(res => {
        if (res.code == 1) {
          if (res.data.length == 0) {
            this.loadStatus = 0;
            return;
          }
          this.jmProducts = res.data;
        } else {
          this.loadStatus = 0;
        }
      });
    },
    _getChannels() {
      getChannelsByOwner(this.id).then(res => {
        if (res.code == 1) {
          if (res.data.length == 0) {
            this.loadStatus = 0;
            return;
          }
          this.subChannels = res.data;
          // this.setChannels(res.data);
        } else {
          this.loadStatus = 0;
        }
      });
    },
    generaterSubmitData(data) {
      let ret = [];
      data.channels.forEach(item => {
        // 到次级渠道的选项组里找
        let channels = null;
        let id = null;
        for (let i in this.subChannels) {
          for (let j in this.subChannels[i].children) {
            if (this.subChannels[i].children[j].name == item) {
              channels = this.subChannels[i].children[j].id;
              break;
            }
          }
        }
        this.$route.params.channels.forEach(i=>{
          if(i.channels == item){
            id = i.id
          }
        })

        
        if (!channels) {
          this.$message.error(this.$t("subject.error.channel"));
          return;
        }
        ret.push({
          id,
          content: data.content,
          pid: data.product,
          time: data.time.getTime(),
          channels,
          link: data.link[item],
          aid: this.id,
          sid: this.sid
        });
      });
      return ret;
    }
  }
};
function isEmpty(obj) {
  for (var key in obj) {
    return false;
  }
  return true;
}
function unique(arr) {
  let ret = [];
  let obj = {};
  for (let i in arr) {
    if (!obj[arr[i].id]) {
      ret.push(arr[i]);
      obj[arr[i].id] = 1;
    }
  }
  return ret;
}
</script>
<style lang="scss" scoped>
.updateSubject {
  background: #fff;
  width: 100%;
  margin-top: 20px;
  margin-left: 20px;
  .form {
    width: 1000px;
    .linkText {
      margin-top: 10px;
    }
  }
}
</style>


<template>
  <div class="registerSubject">
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
        <el-select v-model="selectedTopChannels" :placeholder="$t('search.placeholder.stc')" filterable multiple style="width:49%" :loading="!topChannels">
          <el-option v-for="(item, index) in topChannels" :key="index" :value="item.id" :label="item.name">{{item.name}}</el-option>
        </el-select>
        <!-- 次级 -->
        <el-select v-model="data.channels" :placeholder="$t('search.placeholder.ssc')" style="width:50%" multiple @remove-tag="removeSubTag" filterable :loading="!subChannels" :loading-text="selectedTopChannels&&selectedTopChannels.length>0?$t('search.select.loading'):$t('search.select.pstc')">
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
import { addSubject } from "api/subject";
import { getProducts } from "api/product";
import {
  getChannelsByOwner,
  getTopChannelsByOwner,
  getSubChannelsByOwnerAndId
} from "api/channel";
import { mapGetters, mapActions } from "vuex";
import Submit from "base/Submit";
import { debounce } from "common/js/util";
export default {
  name: 'RegisterSubject',
  data() {
    return {
      data: {
        content: null,
        product: null,
        time: null,
        channels: [],
        link: {}
      },
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
  mounted() {
    this._getProduct();
  },
  created() {
    this._getTopChannelsByOwner();
    
  },
  activated() {
    this._getTopChannelsByOwner();
  },
  computed: {
    ...mapGetters(["id"])
  },
  methods: {
    removeSubTag(tag) {
      delete this.data.link[tag.value];
    },
    _getTopChannelsByOwner() {
      getTopChannelsByOwner(this.id, 0).then(res => {
        if (res.code == 1) {
          this.topChannels = res.data;
        }
      });
    },
    // 调用的方法
    searchSubChannelsMethod(value) {
      (this._debounce && this._debounce(value)) ||
        (this._debounce = this.searchDebounce());
    },
    // 加节流
    searchDebounce() {
      return debounce(value => {
        this.changeTopChannels(value);
      }, 200);
    },
    // 查找对应的次级渠道
    changeTopChannels(value) {
      if (!value || value.length == 0) {
        return;
      }
      // value是数组
      getSubChannelsByOwnerAndId(this.id, value).then(res => {
        this.subChannels = res.data;
      });
    },
    submit() {
      this.submitAbled &&
        this.$refs.form.validate(valid => {
          if (valid) {
            this.submitAbled = false;
            this._addSubject();
          }
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
    _addSubject() {
      // console.log(this.generaterData(this.data));
      addSubject(this.generaterData(this.data)).then(res => {
        if (res.code == 1) {
          this.$message({
            type: "success",
            message: this.$t("subject.add.success"),
            onClose: () => {
              this.$router.push({ name: "Subjects" });
            }
          });
        } else {
          this.$message.error(this.$t("subject.add.error"));
          this.submitAbled = true;
        }
      });
    },
    
    generaterData(data) {
      let ret = [];
      data.channels.forEach(item => {
        // 到次级渠道的选项组里找
        let channels = null;
        for (let i in this.subChannels) {
          for (let j in this.subChannels[i].children) {
            if (this.subChannels[i].children[j].name == item) {
              channels = this.subChannels[i].children[j].id;
              break;
            }
          }
        }
        if (!channels) {
          this.$message.error(this.$t("subject.error.channel"));
          return;
        }
        ret.push({
          content: data.content,
          pid: data.product,
          // recentRecordTime: this.propData.recentRecordTime,
          time: data.time.getTime(),
          channels: channels,
          link: data.link[item],
          aid: this.id,
          sid: this.sid
        });
      });
      return ret;
    }
    // ...mapActions(["setChannels"])
  },
  components: {
    Submit
  },
  watch: {
    selectedTopChannels(newVal) {
      this.searchSubChannelsMethod(newVal);
    }
  }
};
</script>
<style lang="scss" scoped>
.registerSubject {
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



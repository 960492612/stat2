<template>
  <div class="addChannels" v-loading="working" :element-loading-text="$t('channel.loading.add')" element-loading-spinner="el-icon-loading">
    <el-form :model="data" status-icon label-position="right" label-width="140px" :rules="rules" ref="form" class="form">
      <el-form-item :label="$t('channel.add.label.st')" prop="pid">
        <el-select v-model="data.pid" :placeholder="$t('channel.add.placeholder.pid')" style="width:100%;" :disabled="pidSeclectAbled">
          <el-option :key="0" :value="0" :label="$t('channel.add.label.tc')">{{$t('channel.add.label.tc')}}</el-option>
          <el-option v-for="item in topChannels" :key="item.id" :value="item.id" :label="item.name" v-if="topChannels">
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.desc }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('channel.add.label.name')" prop="name">
        <el-input v-model="data.name" :placeholder="$t('channel.add.placeholder.name')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('channel.add.label.fans')" prop="fans">
        <el-input v-model="data.fans" :placeholder="$t('channel.add.placeholder.fans')" type="fans"></el-input>
      </el-form-item>
      <el-form-item :label="$t('channel.add.label.input')" prop="input">
        <el-input v-model="data.input" type="input" :placeholder="$t('channel.add.placeholder.input')" :disabled="pidSeclectAbled"></el-input>
      </el-form-item>
      <el-form-item :label="$t('channel.add.label.desc')" prop="desc">
        <el-input v-model="data.desc" :placeholder="$t('channel.add.placeholder.desc')"></el-input>
      </el-form-item>

      <el-form-item align="left">
        <submit :submitAbled="submitAbled" @click="submit"></submit>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
// import { debounce } from "common/js/util";
import { addChannels, editChannels, getTopChannelsByOwner } from "api/channel";
import { mapGetters } from "vuex";
import Submit from "base/Submit";
export default {
  data() {
    var checkInteger = (rule, value, callback) => {
      if (!Number.isInteger(Number(value))) {
        callback(new Error("请输入整数数字值"));
      } else {
        callback();
      }
    };
    var checkNumber = (rule, value, callback) => {
      if (Number.isNaN(Number(value))) {
        callback(new Error("请输入数字值"));
      } else {
        callback();
      }
    };
    return {
      data: {
        pid: 0,
        name: null,
        input: null,
        desc: null,
        fans: null
      },
      rules: {
        name: [
          { required: true, message: this.$t("data.empty"), trigger: "blur" }
        ],
        input: [
          {
            validator: checkNumber,
            trigger: "blur"
          }
        ],
        fans: [
          {
            validator: checkInteger,
            trigger: "blur"
          }
        ]
      },
      topChannels: null,
      working: false,
      result: "",
      isEdit: false,
      submitAbled: true
    };
  },
  created() {
    if (this.$route.params.id) {
      this.isEdit = true;
      this.data = { ...this.data, ...this.$route.params };
    }
    this.$route.params.pid && (this.data.pid = this.$route.params.pid);
    this._getTopChannelsByOwner();
  },
  computed: {
    pidSeclectAbled() {
      if (this.$route.params.id) {
        return this.$route.params.pid == 0;
      }
      return false;
    },
    ...mapGetters(["id"])
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.isEdit ? this._editChannels() : this._addChannels();
        }
      });
    },
    _getTopChannelsByOwner() {
      getTopChannelsByOwner(this.id, 0).then(res => {
        if (res.code == 1) {
          this.topChannels = res.data;
        }
      });
    },
    _addChannels() {
      // let mid = this.$route.params.mid;
      let id = this.$route.params.id;
      this.submitAbled = false;
      addChannels({ ...this.data, ...{ owner: this.id } }).then(res => {
        if (res.code == 1) {
          this.$message({
            message: this.$t("channel.add.message.success"),
            type: "success",
            onClose: () => {
              this.$router.push({ name: "Channels" });
            }
          });
        } else {
          this.$message(this.$t("channel.add.message.error"));
          this.submitAbled = true;
        }
      });
    },
    _editChannels() {
      let id = this.$route.params.id;
      this.submitAbled = false;
      editChannels(this.data).then(res => {
        if (res.code == 1) {
          this.$message({
            message: this.$t("channel.edit.message.success"),
            type: "success",
            onClose: () => {
              this.$router.push({ name: "Channels" });
            }
          });
        } else {
          this.$message(this.$t("channel.edit.message.error"));
        }
      });
    }
  },
  components: {
    Submit
  }
};
</script>
<style lang="scss" scoped>
.addChannels {
  margin-top: 20px;
  width: 50%;
  .form {
    // border-bottom: 1px solid #eee;
  }
}
</style>

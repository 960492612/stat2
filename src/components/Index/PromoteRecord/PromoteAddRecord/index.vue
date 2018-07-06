<template>
  <div>
    <div class="search-box">
      <div>
        <label for="">时间：</label>
        <el-date-picker v-model="date" format="yyyy 第 WW 周" type="week" placeholder="选择时间段" size="medium" @change="checkDataByDateAndChannel"></el-date-picker>
      </div>

      <div>
        <!-- 渠道 -->
        <label for="">顶级渠道：</label>
        <el-select v-model="selectedTopChannels" :placeholder="$t('search.placeholder.stc')" filterable multiple style="width:400px;" :loading="!topChannels" size="medium">
          <el-option v-for="(item, index) in topChannels" :key="index" :value="item.id" :label="item.name">{{item.name}}</el-option>
        </el-select>
      </div>
      <div>
        <!-- 次级 -->
        <label for="">次级渠道：</label>
        <el-select v-model="selectedSubchannels" :placeholder="$t('search.placeholder.ssc')" style="width:400px;" multiple size="medium" filterable @change="checkDataByDateAndChannel" :loading="!subChannels" :loading-text="selectedTopChannels&&selectedTopChannels.length>0?$t('search.select.loading'):$t('search.select.pstc')">
          <el-option-group v-for="item in subChannels" :key="item.id" :value="item.name" :label="item.name" v-if="subChannels">
            <el-option v-for="_item in item.children" :key="_item.id" :label="_item.name" :value="_item.id+'|'+_item.name">
              <span style="float: left">{{ _item.name }}</span>
              <span style="float: right; color: #8492a6;marginRight:15px; font-size: 13px">{{ _item.desc }}</span>
            </el-option>
          </el-option-group>
        </el-select>
      </div>
      <div>
        <label for="">备注：</label>
        <el-input v-model="comment" placeholder="" :rows="5" type="textarea" style="width:400px;"></el-input>
      </div>
      <div style="width:250px;margin-left: 94px;">
        <submit :submitAbled="submitAbled" @click="submit"></submit>
      </div>
    </div>
    <div class="table">
      <el-table :data="selectedSubChannelsInfo">
        <el-table-column label="渠道" prop="name" header-align="center">
        </el-table-column>
        <el-table-column label="展现量">
          <template slot-scope="scope">
            <el-input v-model.number="uploadData[scope.row.id]['showCount']" placeholder="填入整数"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="阅读量">
          <template slot-scope="scope">
            <el-input v-model.number="uploadData[scope.row.id]['readCount']" placeholder="填入整数"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="互动量">
          <template slot-scope="scope">
            <el-input v-model.number="uploadData[scope.row.id]['activeCount']" placeholder="填入整数"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="文章数">
          <template slot-scope="scope">
            <el-input v-model.number="uploadData[scope.row.id]['articleCount']" placeholder="填入整数"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import {
  getChannelsByOwner,
  getTopChannelsByOwner,
  getSubChannelsByOwnerAndId
} from "api/channel";
import { mapGetters, mapActions } from "vuex";
import { debounce, formatWeek, getWeekDates } from "common/js/util";
import Submit from "base/Submit";
import { addRecords, checkDataByDateAndChannel } from "api/recordByChannel";
// import { formatTime, formatWeek } from "common/js/util";
export default {
  data() {
    return {
      date: new Date(),
      // uploadDate:
      selectedTopChannels: null,
      selectedSubchannels: null,
      topChannels: null,
      subChannels: null,
      uploadData: {},
      submitAbled: true,
      comment: ''
    };
  },
  computed: {
    selectedSubChannelsInfo() {
      return (
        this.selectedSubchannels &&
        this.selectedSubchannels.map(contact => {
          let temp = contact.split("|");
          this.$set(this.uploadData, temp[0], {
            channel_id: temp[0],
            time: this.uploadDate
          });
          return {
            id: temp[0],
            name: temp[1]
          };
        })
      );
    },
    uploadDate() {
      return formatWeek(this.date);
    },
    ...mapGetters(["id"])
  },
  created() {
    this._getTopChannelsByOwner();
    if(this.$route.params.time){
      this.date = new Date(getWeekDates(this.$route.params.time).split('至')[1])
    }
  },
  activated() {
    this._getTopChannelsByOwner();
  },
  components: {
    Submit
  },
  methods: {
    checkDataByDateAndChannel(value) {
      // 最后一个
      if (value && value.length > 0) {
        let temp = value[value.length - 1].split("|")
        checkDataByDateAndChannel({
          date: this.uploadDate,
          channel: temp[0]
        }).then(res => {
          if(res.code == 1){
            this.$message.info("该时间段下"+temp[1]+"渠道的记录已存在");
            this.selectedSubchannels.splice(-1, 1)
          }
        });
      }
    },
    // removeSubTag(tag) {
    //   delete this.data.link[tag.value];
    // },
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
    // genarateUpload() {},
    submit() {
      if (!this.date) {
        this.$message.error("请选择时间");
        return;
      }
      let data = Object.values(this.uploadData);
      if (data.length <= 0) {
        this.$message.error("请选择次级渠道");
        return;
      }
      this.submitAbled = false;
      addRecords({ data, comment: this.comment })
        .then(res => {
          if (res.code == 1) {
            this.$message.success("上传成功");
            this.selectedSubchannels = []
            console.log(res.msg);
          } else {
            if (res.msg.name == "SequelizeUniqueConstraintError") {
              this.$message.info(
                "所选渠道已做数据记录， 如需更改，请前往修改页面"
              );
            } else {
              this.$message.error("上传失败");
            }
            // console.log(res.msg);
          }
          this.submitAbled = true;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  watch: {
    selectedTopChannels(newVal) {
      this.searchSubChannelsMethod(newVal);
    }
  }
};
</script>
<style lang="scss">
.search-box {
  text-align: left;

  > div {
    margin-top: 10px;
    > label {
      display: inline-block;
      width: 90px;
      text-align: right;
    }
  }
}
</style>

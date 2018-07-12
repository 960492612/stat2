<template>
  <div style="margin-top: 20px;">
    <div class="search-box" v-if="!isPromoter">

    </div>
    <el-table :data="data">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.children" style="width:100%;background:#eee;" :show-header="true">
            <el-table-column prop="channel_name" label="渠道" width="300" class-name="expend-column" header-align="center">
            </el-table-column>
            <el-table-column prop="articleCount" label="文章数" class-name="expend-column" width="120" header-align="center">
            </el-table-column>
            <el-table-column prop="showCount" label="展现量" class-name="expend-column-desc" header-align="center" width="120">
            </el-table-column>
            <el-table-column prop="readCount" label="阅读量" class-name="expend-column" width="120" header-align="center">
            </el-table-column>
            <el-table-column prop="activeCount" label="互动量" width="120" class-name="expend-column" header-align="center">
            </el-table-column>
            <el-table-column prop="channel_fans" label="粉丝数" class-name="expend-column" header-align="center">
            </el-table-column>

            <el-table-column prop="oper" :label="$t('oper.oper')" class-name="expend-column" width="240" header-align="center">
              <template slot-scope="scope">
                <el-button @click.native.prevent="editRow(scope.row)" type="text" size="mini" class="btn">
                  {{$t('oper.edit')}}
                </el-button>
                <el-button @click.native.prevent="deleteById(scope.row)" type="text" size="mini" class="btn">
                  {{$t('oper.delete')}}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column label="时间" prop="time" header-align="center" width="200">
        <template slot-scope="scope">
          <el-popover trigger="click" placement="right">
            <p style="maxWidth:350px;">
              {{weekFormater(scope.row.time)}}
            </p>
            <p slot="reference" :title="$t('statis.tip')" style="cursor:pointer;">{{_getWeekDates(scope.row.time)}}</p>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="articleCount" label="总文章数" class-name="expend-column" width="120" header-align="center">
      </el-table-column>
      <el-table-column prop="showCount" label="总展现量" class-name="expend-column-desc" header-align="center" width="120">
      </el-table-column>
      <el-table-column prop="readCount" label="总阅读量" class-name="expend-column" width="120" header-align="center">
      </el-table-column>
      <el-table-column prop="activeCount" label="总互动量" width="120" class-name="expend-column" header-align="center">
      </el-table-column>
      <el-table-column prop="comment" label="评论" class-name="expend-column" header-align="center">
      </el-table-column>
      <el-table-column prop="oper" :label="$t('oper.oper')" class-name="column" width="200" align="center" header-align="center">
        <template slot-scope="scope">
          <el-button @click.native.prevent.stop="addPlatform(scope.row)" type="info" size="mini" class="btn" plain v-if="isPromoter">
            添加渠道
          </el-button>
          <el-button @click.native.prevent.stop="deleteByTime(scope.row)" type="danger" size="mini" class="btn" plain v-if="isPromoter">
            {{$t('oper.delete')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改数据" :visible.sync="isShowEditBox" width="">

      <edit-form :record="editingData" @close="closeEditBox" />
    </el-dialog>
  </div>
</template>
<script>
import { getRecordList, deleteRecord } from "api/recordByChannel";
import { mapGetters, mapActions } from "vuex";
import { numberToWeekStr, getWeekDates_s_2_f } from "common/js/util";
import { roles } from "common/js/config";
import EditForm from "../common/editForm";
export default {
  data() {
    return {
      data: null,
      editingData: null,
      isShowEditBox: false
    };
  },
  computed: {
    isPromoter() {
      return this.role == roles["推广员"];
    },
    ...mapGetters(["id", "role"])
  },
  created() {
    this.init();
  },
  components: {
    EditForm
  },
  methods: {
    init() {
      this.getRecordList();
    },
    getRecordList() {
      getRecordList({ channel_owner_id: this.id }).then(res => {
        if (res.code == 1) {
          this.data = res.data;
        }
        // console.log(res.data)
      });
    },
    addPlatform(row) {
      this.$router.push({
        name: "PromoteAddRecord",
        params: { time: row.time }
      });
    },
    weekFormater(value) {
      return numberToWeekStr(value);
    },
    _getWeekDates(week) {
      return getWeekDates_s_2_f(week);
    },
    editRow(row) {
      this.isShowEditBox = true;
      this.editingData = row;
      // this.$message.info("暂未开发完毕");
    },
    deleteById(row) {
      this.$confirm(
        "删除该渠道的记录数据？",
        this.$t("product.delete.tip"),
        {
          confirmButtonText: this.$t("product.delete.sure"),
          cancelButtonText: this.$t("product.delete.cancel"),
          type: "warning"
        }
      ).then(() => {
        deleteRecord({ id: row.id }).then(res => {
          if (res.code == 1) {
            this.$message.success("删除成功");
            this.init();
          } else {
            this.$message.error("删除失败");
          }
        });
      });
    },
    deleteByTime(row) {
      // this.$message.info("暂未开发完毕");
      this.$confirm(
        "删除该时间段的全部记录？",
        this.$t("product.delete.tip"),
        {
          confirmButtonText: this.$t("product.delete.sure"),
          cancelButtonText: this.$t("product.delete.cancel"),
          type: "warning"
        }
      ).then(() => {
        deleteRecord({ time: row.time }).then(res => {
          if (res.code == 1) {
            this.$message.success("删除成功");
            this.init();
          } else {
            this.$message.error("删除失败");
          }
        });
      });
    },
    closeEditBox() {
      this.isShowEditBox = false;
    }
  }
};
</script>
<style lang="scss">
.el-table__expanded-cell[class*="cell"] {
  padding-left: 0;
}
.expend-column {
  // width: 120px;
}
</style>

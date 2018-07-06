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
                        <el-table-column prop="articleCount" label="文章数" class-name="expend-column" width="" header-align="center">
                        </el-table-column>
                        <el-table-column prop="showCount" label="展现量" class-name="expend-column-desc" header-align="center">
                        </el-table-column>
                        <el-table-column prop="readCount" label="阅读量" class-name="expend-column" width="" header-align="center">
                        </el-table-column>
                        <el-table-column prop="activeCount" label="互动量" width="" class-name="expend-column" header-align="center">
                        </el-table-column>
                        <el-table-column prop="channel_fans" label="粉丝数" width="" class-name="expend-column" header-align="center">
                        </el-table-column>

                        <el-table-column prop="oper" :label="$t('oper.oper')" class-name="expend-column" width="240" header-align="center">
                            <template slot-scope="scope">
                                <el-button @click.native.prevent="editRow(scope.row)" type="text" size="mini" class="btn">
                                    {{$t('oper.edit')}}
                                </el-button>
                                <el-button @click.native.prevent="deleteRow(scope.row, scope.$index)" type="text" size="mini" class="btn">
                                    {{$t('oper.delete')}}
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="时间" prop="time" header-align="center" :formatter="timeFormatter"></el-table-column>
            <el-table-column prop="articleCount" label="总文章数" class-name="expend-column" width="" header-align="center">
            </el-table-column>
            <el-table-column prop="showCount" label="总展现量" class-name="expend-column-desc" header-align="center">
            </el-table-column>
            <el-table-column prop="readCount" label="总阅读量" class-name="expend-column" width="" header-align="center">
            </el-table-column>
            <el-table-column prop="activeCount" label="总互动量" width="" class-name="expend-column" header-align="center">
            </el-table-column>
            <el-table-column prop="comment" label="评论" width="" class-name="expend-column" header-align="center">
            </el-table-column>
            <el-table-column prop="oper" :label="$t('oper.oper')" class-name="column" width="200" align="center" header-align="center">
                <template slot-scope="scope">
                    <el-button @click.native.prevent.stop="addPlatform(scope.row)" type="info" size="mini" class="btn" plain v-if="isPromoter">
                        添加渠道
                    </el-button>
                    <el-button @click.native.prevent.stop="deleteTopRow(scope.row, 1)" type="danger" size="mini" class="btn" plain v-if="isPromoter">
                        {{$t('oper.delete')}}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { getRecordList } from "api/recordByChannel";
import { mapGetters, mapActions } from "vuex";
import { numberToWeekStr } from "common/js/util";
import { roles } from "common/js/config";
export default {
  data() {
    return {
      data: null
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
    timeFormatter(row) {
      return numberToWeekStr(row.time);
    },
    editRow(row){
        this.$message.info('暂未开发完毕')
    },
    deleteRow(row){
        this.$message.info('暂未开发完毕')
    },
    deleteTopRow(row){
        this.$message.info('暂未开发完毕')
    }
  }
};
</script>

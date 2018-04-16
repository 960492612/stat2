<template>
	<div>
		<div class="channels-list">
			<div class="selectAdmin" v-if="!isPromoter">
				<el-select v-model="selectedAdmin" placeholder="选择推广员" filterable clearable @change="changeAdminMethod">
					<el-option v-for="item in admins" :key="item.id" :value="item.id" :label="item.name">{{item.name}}</el-option>
				</el-select>
			</div>
			<el-table :data="tableData" style="width:100%;" :highlight-current-row="true" @row-click="rowClick" ref="table">
				<el-table-column type="expand">
					<template slot-scope="props">
						<el-table :data="props.row.children" style="width:100%;background:#eee;" :show-header="false">
							<el-table-column prop="name" :label="$t('channel.label.name')" width="300" class-name="expend-column">
							</el-table-column>
							<el-table-column prop="desc" :label="$t('channel.label.desc')" class-name="expend-column-desc">
							</el-table-column>
							<el-table-column prop="fans" :label="$t('channel.label.fans')" class-name="expend-column" width="180">
							</el-table-column>
							<el-table-column prop="input" :label="$t('channel.label.input')" width="150" class-name="expend-column">
							</el-table-column>
							<el-table-column prop="oper" :label="$t('oper.oper')" class-name="expend-column" width="240" v-if="isPromoter">
								<template slot-scope="scope">
									<el-button @click.native.prevent="editRow(scope.row)" type="text" size="mini" class="btn">
										{{$t('oper.edit')}}
									</el-button>
									<el-button @click.native.prevent="stopRow(scope.$index)" type="text" size="mini" class="btn">
										{{$t('oper.stop')}}
									</el-button>
									<el-button @click.native.prevent="deleteRow(scope.row, scope.$index)" type="text" size="mini" class="btn">
										{{$t('oper.delete')}}
									</el-button>
								</template>
							</el-table-column>
						</el-table>
					</template>
				</el-table-column>
				<el-table-column prop="name" :label="$t('channel.label.name')" width="300" class-name="column">
				</el-table-column>
				<el-table-column prop="desc" :label="$t('channel.label.desc')" class-name="column">
				</el-table-column>
				<el-table-column prop="fans" :label="$t('channel.label.fans')" class-name="column" width="180" align="center">
				</el-table-column>
				<el-table-column prop="input" :label="$t('channel.label.input')" width="180" class-name="column" align="center">
				</el-table-column>
				<el-table-column prop="oper" :label="$t('oper.oper')" class-name="column" width="320" v-if="isPromoter">
					<template slot-scope="scope">
						<el-button @click.native.prevent.stop="addChildren(scope.row)" type="primary" size="mini" class="btn" plain>
							{{$t('channel.oper.addChildren')}}
						</el-button>
						<el-button @click.native.prevent.stop="editRow(scope.row)" type="primary" size="mini" class="btn" plain>
							{{$t('oper.edit')}}
						</el-button>
						<el-button @click.native.prevent.stop="deleteRow(scope.row, scope.$index)" type="danger" size="mini" class="btn" plain>
							{{$t('oper.delete')}}
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

	</div>
</template>
<script>
import { getChannelsByOwner, deleteChannel } from "api/channel";
import { getAdmins } from "api/account";
import { roles } from "common/js/config";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "Result",
  data() {
    return {
      tableData: [],
      loadStatus: 1,
      admins: [],
      selectedAdmin: null
    };
  },
  created() {
    if (this.isPromoter) {
      this._getChannels(this.id);
    } else {
      this._getAdmins();
    }
  },
  computed: {
    loadingText() {
      return this.loadStatus == 1
        ? this.$t("data.loading")
        : this.$t("data.none");
    },
    isPromoter() {
      return this.role == roles["推广员"];
    },
    ...mapGetters(["id", "role"])
  },
  methods: {
    _getAdmins() {
      getAdmins({ role: roles["推广员"] }).then(res => {
        if (res.code == 1) {
          this.admins = res.data;
        }
      });
    },
    changeAdminMethod() {
      this._getChannels(this.selectedAdmin);
    },					
    _getChannels(id) {
      getChannelsByOwner(id).then(res => {
        if (res.code == 1) {
          if (res.data.length == 0) {
            this.loadStatus = 0;
            return;
          }
          this.tableData = this.sortChannels(res.data);
        } else {
          this.loadStatus = 0;
        }
      });
    },
    sortChannels(data) {
      data.forEach(item => {
        item.children.sort((a, b) => {
          return a.id - b.id;
        });
      });
      return data;
    },
    addChildren(row) {
      this.$router.push({ name: "AddChannels", params: { pid: row.id } });
    },
    editRow(row) {
      this.$router.push({
        name: "UpdateChannels",
        params: row
      });
    },
    deleteRow(row, index) {
      this.$confirm(
        this.$t("channel.delete.confirm"),
        this.$t("product.delete.tip"),
        {
          confirmButtonText: this.$t("channel.delete.sure"),
          cancelButtonText: this.$t("channel.delete.cancel"),
          type: "warning"
        }
      )
        .then(() => {
          deleteChannel({ id: row.id }).then(res => {
            if (res.code == 1) {
              this.$message({
                type: "success",
                message: this.$t("channel.delete.success")
              });
              this._getChannels(this.id);
              // this.tableData.splice(index, 1);
            } else {
              this.$message.error(this.$t("channel.delete.error"));
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("channel.delete.canceled")
          });
        });
    },
    rowClick(row) {
      this.$refs.table.toggleRowExpansion(row);
    }
  }
  // watch: {
  //   // 确保更新
  //   $route() {
  //     this._getChannels();
  //   }
  // }
};
</script>
<style lang="scss">
.channels-list {
  margin-top: 20px;
  text-align: left;
  .el-table__expanded-cell[class*="cell"] {
    padding: 10px 40px 10px 50px;
    // background: rgba(30, 179, 216, 0.233);
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background: #fff;
  }
  .el-table__expanded-cell:hover {
    background: #fff !important;
  }
  .column {
    font-weight: bold;
    padding: 5px;
    font-size: 15px;
    .cell {
      font-weight: bold;
    }
  }
  .expend-column {
    padding: 3px 5px;
    color: #666;
    // background: rgba(30, 179, 216, 0.233);
  }
  .expend-column-desc {
    padding: 3px 5px;
    font-size: 12px;
    color: rgb(159, 163, 163);
  }
  .btn {
    margin-right: 0px;
    margin-left: 0px;
    padding: 7px 15px;
  }
  .second-content {
    li {
      height: 30px;
      line-height: 30px;
      border-bottom: 1px solid #eee;
      span {
        padding-left: 10px;
        display: inline-block;
        width: 166px;
      }
    }
  }
}
</style>

<template>
  <div>
    <div class="account-list">
      <el-table :data="tableData" style="width:500px;" :row-class-name="currentUser">
        <div slot="empty">
          <i class="el-icon-loading" v-show="loadStatus == 1"></i> {{loadingText}}</div>
        <el-table-column prop="name" label="用户名" width="100" align="center">
        </el-table-column>
        <el-table-column prop="role" label="操作角色" width="150" align="center">
        </el-table-column>
        <el-table-column prop="department" label="部门" width="120" align="center">
        </el-table-column>
        <el-table-column prop="oper" label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click.native.prevent="editRow(scope.row)" type="text">
              修改权限
            </el-button>
            <el-button @click.native.prevent="deleteRow(scope.row, scope.$index)" type="text">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { getAllUsers, addUser, deleteUser } from "api/account";
export default {
  data() {
    return {
      tableData: [],
      loadStatus: 1,
      platforms: []
    };
  },
  computed: {
    loadingText() {
      return this.loadStatus == 1 ? "加载中" : "暂无数据";
    },
    ...mapGetters(["id", "role", "loginName", "department"])
  },
  created() {   
      this._getAllUsers();
    
  },
  methods: {
    _getAllUsers() {
      getAllUsers().then(res => {
        if (res.code == 1) {
          this.tableData = res.data;
        }
      });
    },
    editRow(item) {
      this.$router.push({
        name: "EditRole",
        params: item
      });
    },
    deleteRow(item, index) {
      if (item.role != this.role && this.role != 1) {
        this.$message.error("该账户您无权删除！");
        return;
      }
      this.$confirm(
        "此操作将永久删除该用户以及该用户所有的推广记录, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "error"
        }
      )
        .then(() => {
          deleteUser({ id: item.id, role: this.role }).then(res => {
            if (res.code == 1) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.tableData.splice(index, 1);
            } else {
              this.$message.error("删除失败");
            }
          });
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    currentUser({ row }) {
      if (row.id == this.id) {
        return "current";
      }
    }
  }
};
</script>
<style lang="scss">
.account-list {
  margin-top: 20px;
  .current {
    background: #f0f9eb;
  }
}
</style>



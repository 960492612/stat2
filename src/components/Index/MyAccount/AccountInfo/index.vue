<template>
  <div>
    <div class="account-list">

      <el-form :model="data" class="form" label-position="left" label-width="80px" :rules="rules" ref="form">
        <el-form-item label="用户名:" prop="name" class="label">
          <span class="text" v-show="!showEditInput">{{account.name}}</span>
          <el-input v-model="data.name" placeholder="输入新用户名" size="mini" v-show="showEditInput" class="input"></el-input>
          <el-button type="text" size="mini" class="editBtn" @click="intoEdit" v-show="!showEditInput">修改</el-button>
          <el-button type="text" size="mini" class="editBtn" @click="editName" v-show="showEditInput">
            确定
            <i class="el-icon-loading" v-show="nameEditing"></i>
          </el-button>
          <el-button type="text" size="mini" class="editBtn" @click="cancle" v-show="showEditInput">取消</el-button>
        </el-form-item>
        <el-form-item label="角色名:" prop="role" class="label">
          <span class="text">{{account.role}}</span>
        </el-form-item>
        <el-form-item label="部门:" prop="department" class="label">
          <span class="text">{{account.department}}</span>
        </el-form-item>
        <el-form-item label="经营平台:" prop="platform" class="label">
          <span class="text">{{account.platform?account.platform:'无'}}</span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { roles } from "common/js/config";
import { getAllUsers, editUserName } from "api/account";
import { debounce } from "common/js/util";
import { hasUser } from "api/account";
export default {
  data() {
    var _hasKey = (rule, value, callback) => {
      if (value == this.loginName) {
        callback();
      } else {
        this._debounce(value, callback);
      }
    };
    return {
      account: {},
      loadStatus: 1,
      data: {},
      showEditInput: false,
      nameEditing: false,
      rules: {
        name: [
          { message: "不能为空", trigger: "change" },
          { validator: _hasKey, trigger: "change" }
        ]
      }
    };
  },
  computed: {
    loadingText() {
      return this.loadStatus == 1 ? "加载中" : "暂无数据";
    },
    ...mapGetters(["id", "loginName"])
  },
  created() {
    this._getAllUsers();
    this._debounce = this._hasKey();
  },
  methods: {
    _hasKey() {
      return debounce((value, callback) => {
        hasUser(value).then(res => {
          if (res.code == 1) {
            callback(new Error("已存在该用户名"));
          } else {
            callback();
          }
        });
      }, 300);
    },
    _getAllUsers() {
      getAllUsers({ id: this.id }).then(res => {
        if (res.code == 1) {
          this.account = res.data[0];
        }
      });
    },
    intoEdit() {
      this.showEditInput = true;
    },
    editName() {
      this.nameEditing = true;
      this.$refs.form.validate(valid => {
        if (valid) {
          editUserName({ id: this.id, newName: this.data.name }).then(res => {
            if (res.code == 1) {
              this.$message.success("修改成功");
            } else {
              this.$message.error("修改失败");
            }
            this.nameEditing = false;
            this.showEditInput = false;
          });
        }else{
          this.nameEditing = false;
        }
      });
    },
    cancle() {
      this.showEditInput = false;
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
  .form {
    margin-left: 20px;
    text-align: left;
    .label {
      height: 30px;
      
      .el-form-item__label {
        font-size: 16px;
        width: 200px;
      }
    }
    .input {
      float: left;
      width: 200px;
    }
    .text {
      padding-left: 10px;
      font-size: 15px;
      text-decoration: underline;
    }
    .editBtn {
      margin-left: 15px;
    }
  }
}
</style>



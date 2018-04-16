<template>
  <div class="addUser" v-loading="working" element-loading-text="正在努力添加.." element-loading-spinner="el-icon-loading">
    <el-form :model="data" status-icon label-position="right" label-width="80px" :rules="rules" ref="form" class="form">
      <el-form-item label="用户名:" prop="name" align="left">
        <el-input v-model="data.name" placeholder="填写唯一的用户名" style="width:50%;"></el-input>
      </el-form-item>
      <el-form-item label="角色:" prop="role" align="left">
        <el-select v-model="data.role" placeholder="选择角色" style="width:50%;">
          <el-option v-for="item in pls" :key="item.id" :label="item.name" :value="item.id">{{item.name}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="路由权限:" prop="tickets" align="left">
        <el-checkbox-group v-model="data.tickets">
          <el-checkbox label="item" v-for="(item, index) in tickets" :key="index"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="部门:" prop="department" align="left">
        <el-select v-model="data.department" placeholder="选择部门" style="width:50%;">
          <el-option v-for="item in departments" :key="item.id" :label="item.name" :value="item.id">{{item.name}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属销售平台:" prop="department" align="left">
        <el-select v-model="data.platform" placeholder="没有所属的销售平台则不填" style="width:50%;">
          <el-option v-for="item in platforms" :key="item.id" :label="item.name" :value="item.id">{{item.name}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item align="left">
        <submit :submitAbled="submitAbled" @click="submit"></submit>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import { debounce } from "common/js/util";
import { getPlatforms } from "api/store";
import { hasUser, addUser, getDepartments } from "api/account";
import { mapGetters } from "vuex";
import Submit from "base/Submit";
import { roles } from "common/js/config";
export default {
  data() {
    var _hasKey = (rule, value, callback) => {
      this._debounce(value, callback);
    };
    return {
      data: {
        name: null,
        role: null,
        ticket:null,
        department: null,
        platform: null
      },
      rules: {
        name: [
          { required: true, message: "不能为空", trigger: "blur" },
          { validator: _hasKey, trigger: "change" }
        ],
        role: [{ required: true, message: "不能为空", trigger: "blur" }],
        pid: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      // pls: [{ id: 1, name: "推广员" }, { id: 5, name: "管理员" }],
      platforms: [],
      departments: [],
      working: false,
      submitAbled: true
    };
  },
  created() {
    if (this.role != 1) {
      this.$message.info("您无权添加账户");
      this.$router.push({ name: "Accounts" });
      return;
    }
    this._debounce = this._hasKey();
    this._getPlatforms();
  },
  computed: {
    pls() {
      let ret = [];
      for (let i in roles) {
        ret.push({
          id: i,
          name: roles[i]
        });
      }
      return ret;
    },
    ...mapGetters(["id", "role"])
  },
  mounted() {},
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
    _getPlatforms() {
      getPlatforms().then(res => {
        if (res.code == 1) {
          this.platforms = res.data;
        }
      });
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this._addUser();
        }
      });
    },
    _addUser() {
      addUser({ ...this.data, ...{ role: this.role } }).then(res => {
        if (res.code == 1) {
          this.$message({
            message: `添加成功，默认密码是${res.data.default_pwd}`,
            type: "success",
            onClose: () => {
              this.$router.push({ name: "Accounts" });
            }
          });
        } else {
          this.$message("添加失败");
          this.submitAbled = true;
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
.addProduct {
  margin-top: 20px;
  width: 50%;
}
</style>

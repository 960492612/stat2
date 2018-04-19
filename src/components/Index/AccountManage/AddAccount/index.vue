<template>
  <div class="addUser" v-loading="working" element-loading-text="正在努力添加.." element-loading-spinner="el-icon-loading">
    <el-form :model="data" status-icon label-position="right" label-width="80px" :rules="rules" ref="form" class="form">
      <el-form-item label="用户名:" prop="name" align="left">
        <el-input v-model="data.name" placeholder="填写唯一的用户名" style="width:50%;"></el-input>
      </el-form-item>
      <el-form-item label="角色:" prop="role" align="left">
        <el-select v-model="data.role" placeholder="选择角色(路由权限不建议手动选择)" style="width:50%;" @change="changeRole">
          <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id">{{item.name}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="路由权限:" prop="tickets" align="left" style="width:50%;">
        <el-checkbox-group v-model="data.tickets">
          <el-checkbox  v-for="(item, index) in tickets" :key="item" :label="item" class="checkbox">{{index}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="部门:" prop="department" align="left">
        <el-select v-model="data.department" placeholder="选择部门" style="width:50%;">
          <el-option v-for="item in departments" :key="item.id" :label="item.name" :value="item.id">{{item.name}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="销售平台:" prop="department" align="left">
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
import { hasUser, addUser, getDepartments, getTickets } from "api/account";
import { mapGetters } from "vuex";
import Submit from "base/Submit";
import { roles , roleDefaultTickets} from "common/js/config";
export default {
  data() {
    var _hasKey = (rule, value, callback) => {
      this._debounce(value, callback);
    };
    return {
      data: {
        name: null,
        role: null,
        tickets: [],
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
      tickets: {},
      departments: [],
      working: false,
      submitAbled: true
    };
  },
  created() {
    this._debounce = this._hasKey();
    this._getPlatforms();
    this._getTickets();
    this._getDepartments()
  },
  computed: {
    roles() {
      let ret = [];
      for (let i in roles) {
        ret.push({
          id: roles[i],
          name: i
        });
      }
      return ret;
    },
    ...mapGetters(["id"])
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
    _getDepartments() {
      getDepartments().then(res => {
        if (res.code == 1) {
          this.departments = res.data;
        }
      });
    },
    _getTickets() {
      getTickets().then(res => {
        if (res.code == 1) {
          this.tickets = res.data;
        }
      });
    },
    // 根据角色默认给权限
    changeRole(value){
      this.data.tickets = roleDefaultTickets[value]
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this._addUser();
        }
      });
    },
    _addUser() {
      addUser(this.data).then(res => {
        if (res.code == 1) {
          this.$message({
            message: `添加成功，默认密码是${res.data.default_pwd}`,
            type: "success",
            onClose: () => {
              this.$router.push({ name: "AccountsList" });
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
.addUser {
  margin-top: 20px;
  width: 50%;
  .checkbox{
    width: 40%;
    &:nth-of-type(1){
      margin-left: 30px;
    }
  }
}
</style>

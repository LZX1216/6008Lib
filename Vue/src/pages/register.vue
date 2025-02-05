<template>
  <div>
    <el-card class="box-card">
      <h2>注册</h2>
      <el-form
          :model="registerForm"
          status-icon
          :rules="rules"
          ref="registerFormref"
          label-width="80px"
          class="registerForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
              type="password"
              v-model="registerForm.password"
              autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="pass">
          <el-input
              type="password"
              v-model="registerForm.pass"
              autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="btnGroup">
        <el-button type="primary"
                   @click="submitForm('registerFormref')"
        >提交
        </el-button
        >
        <el-button
            @click="resetForm('registerFormref')">重置
        </el-button>
        <el-button
            @click="goBack">返回
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>

import {hashSHA256} from "@/utils/CryptoHelper.js";
import {ref} from "vue";

const hashedPassword = ref("");
export default {
  data() {
    // var validatePass = (rule, value, callback) => {
    //   if (value === "") {
    //     callback(new Error("请输入密码"));
    //   } else {
    //     if (this.registerForm.password=== '') {
    //       if (!registerFormref.value) return
    //       registerFormref.value.validateField('checkPass')
    //     }
    //     callback();
    //   }
    // };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      registerForm: {
        username: "",
        password: "",
        pass: "",

      },
      rules: {
        username: [
          {required: true, message: "用户名不能为空！", trigger: "blur"},
        ],
        password: [{required: true, message: "密码不能为空！", trigger: "blur"}],
        pass: [
          {required: true, validator: validatePass2, trigger: "blur"},
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          hashedPassword.value = await hashSHA256(this.registerForm.password);
          let _this = this;
          this.axios({
            url: 'http://localhost:8080/register',
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            data: {
              username: this.registerForm.username,
              password: hashedPassword.value,
            },
          }).then((res) => {
            if (res.data.code === '0') {
              // 显示后端响应的成功信息
              this.$message({
                message: res.data.msg,
                type: "success",
              });
            } else {
              this.$message({
                message: res.data.msg,
                type: "warning",
              });
            }
            console.log(res);
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 240px);
  padding: 40px 20px;
}

.register-card {
  width: 400px;
}

/* 设置登录面板居中，宽度为400px */
.box-card {
  margin: auto auto;
  width: 400px;
}

/* 设置登录面板中的表单居中 */
.login-from {
  margin: auto auto;
}
</style>
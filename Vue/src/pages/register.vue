<template>
  <div class="register-container">
    <el-card class="register-card">
      <template #header>
        <h2>Register</h2>
      </template>

      <el-form
        ref="registerForm"
        :model="registerForm"
        :rules="rules"
        label-width="150px"
        @submit.native.prevent="handleRegister"
      >
        <el-form-item label="Username" prop="username">
          <el-input v-model="registerForm.username" @keyup.enter="handleRegister" placeholder="Please enter username" />
        </el-form-item>

        <el-form-item label="Password" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            @keyup.enter="handleRegister"
            placeholder="Please enter password"
            show-password
          />
        </el-form-item>

        <el-form-item label="Confirm Password" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            @keyup.enter="handleRegister"
            placeholder="Please confirm password"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleRegister">Register</el-button>
          <el-button @click="resetForm">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { hashSHA256 } from "@/utils/CryptoHelper.js";

export default {
  name: 'Register',
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please confirm your password"));
      } else if (value !== this.registerForm.password) {
        callback(new Error("The two passwords do not match!"));
      } else {
        callback();
      }
    };
    return {
      registerForm: {
        username: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        username: [
          { required: true, message: 'Please enter username', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Please enter password', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async handleRegister() {
      this.$refs.registerForm.validate(async (valid) => {
        if (valid) {
          const hashedPassword = await hashSHA256(this.registerForm.password);
          try {
            const response = await this.axios({
              url: 'http://localhost:8080/register',
              method: "post",
              headers: {
                "Content-Type": "application/json",
              },
              data: {
                username: this.registerForm.username,
                password: hashedPassword,
              },
            });
            if (response.data.code === '0') {
              ElMessage.success(response.data.msg);
              this.$router.push('/login');
            } else {
              ElMessage.warning(response.data.msg);
            }
          } catch (error) {
            console.error('Registration failed:', error);
            ElMessage.error('Registration failed. Please try again.');
          }
        }
      });
    },
    resetForm() {
      this.$refs.registerForm.resetFields();
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 240px); /* Subtract header and footer height */
  padding: 40px 20px;
}

.register-card {
  width: 500px;
}

:deep(.el-form-item__content) {
  display: flex;
  justify-content: flex-start;
}

:deep(.el-button) {
  width: 120px;
  margin-right: 20px;
}
</style>

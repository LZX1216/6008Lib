<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h2>Login</h2>
      </template>
      
      <el-form 
        ref="loginForm"
        :model="loginForm"
        :rules="rules"
        label-width="100px"
        @submit.native.prevent="handleLogin"
      >
        <el-form-item label="Username" prop="username">
          <el-input v-model="loginForm.username" @keyup.enter="handleLogin" placeholder="Please enter username" />
        </el-form-item>

        <el-form-item label="Password" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            @keyup.enter="handleLogin"
            placeholder="Please enter password"
            show-password
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleLogin">Login</el-button>
          <el-button @click="resetForm">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { auth } from '@/utils/auth.js'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: 'Please enter username', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Please enter password', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // Default user and admin accounts
          const testUsers = [
            { username: 'admin', password: 'admin123', role: 'admin' },
            { username: 'user', password: 'user123', role: 'user' }
          ];

          const user = testUsers.find(u => u.username === this.loginForm.username && u.password === this.loginForm.password);

          if (user) {
            // Login successfully
            ElMessage.success('Login successfully');
            auth.loginstate(); // Update login status
            auth.userInfo = user; // Set user information
            sessionStorage.setItem('userInfo', JSON.stringify(user)); // Store user info in session storage
            if (user.role === 'admin') {
              this.$router.push('/admin/overview');
            } else {
              this.$router.push('/user');
            }
          } else {
            // Login failed
            ElMessage.error('Incorrect username or password');
          }
        }
      })
    },
    resetForm() {
      this.$refs.loginForm.resetFields();
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 240px); /* Subtract header and footer height */
  padding: 40px 20px;
}

.login-card {
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

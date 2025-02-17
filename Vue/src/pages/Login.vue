<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="login-header">
        <h2>Welcome Back</h2>
        <p>Please sign in to your account</p>
      </div>

      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="rules"
        @submit.native.prevent="handleLogin"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="Username"
            prefix-icon="el-icon-user"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="Password"
            prefix-icon="el-icon-lock"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleLogin" class="login-button">
            Sign In
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer">
        <a href="#" @click.prevent="showForgotPasswordMessage">Forgot password?</a>
        <span class="divider">   |   </span>
        <span>Don't have an account?      </span>
        <router-link to="/register">Sign up</router-link>
      </div>
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
    },
    showForgotPasswordMessage() {
      ElMessage({
        message: 'Please contact the administrator',
        type: 'info',
        duration: 3000
      })
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-image: url('https://images.pexels.com/photos/1290141/pexels-photo-1290141.jpeg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.login-card {
  width: 100%;
  max-width: 500px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.9);
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 7px 14px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #333;
  font-size: 28px;
  margin-bottom: 10px;
}

.login-header p {
  color: #666;
  font-size: 16px;
}

.el-form-item {
  margin-bottom: 25px;
}

.el-input {
  transition: all 0.3s ease;
}

.el-input:hover, .el-input:focus {
  transform: translateY(-2px);
}

.login-button {
  width: 100%;
  padding: 12px 20px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  font-size: 14px;
  flex-wrap: wrap;
}

.login-footer a,
.login-footer span,
.login-footer .divider {
  margin: 0 8px;
  color: #606266;
}

.login-footer a {
  color: #409EFF;
  text-decoration: none;
  transition: all 0.3s ease;
}

.login-footer a:hover {
  color: #66b1ff;
}

.login-footer .divider {
  color: #DCDFE6;
}

@media (max-width: 480px) {
  .login-card {
    padding: 20px;
  }

  .login-header h2 {
    font-size: 24px;
  }

  .login-header p {
    font-size: 14px;
  }

  .el-form-item {
    margin-bottom: 20px;
  }

  .login-button {
    padding: 10px 16px;
    font-size: 14px;
  }

  .login-footer {
    flex-direction: column;
    align-items: center;
  }

  .login-footer a,
  .login-footer span,
  .login-footer .divider {
    margin: 5px 0;
  }

  .login-footer .divider {
    display: none;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.login-card {
  animation: fadeIn 0.5s ease-out;
}

.el-form-item {
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards;
}

.el-form-item:nth-child(1) { animation-delay: 0.2s; }
.el-form-item:nth-child(2) { animation-delay: 0.4s; }
.el-form-item:nth-child(3) { animation-delay: 0.6s; }

.login-footer {
  opacity: 0;
  animation: fadeIn 0.5s ease-out 0.8s forwards;
}
</style>

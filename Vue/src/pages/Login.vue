<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="login-header">
        <h2>{{ $t('login.welcomeBack') }}</h2>
        <p>{{ $t('login.pleaseSignIn') }}</p>
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
              :placeholder="$t('login.usernamePlaceholder')"
              prefix-icon="el-icon-user"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
              v-model="loginForm.password"
              type="password"
              :placeholder="$t('login.passwordPlaceholder')"
              prefix-icon="el-icon-lock"
              show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleLogin" class="login-button">
            {{ $t('login.signIn') }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer">
        <a href="#" @click.prevent="showForgotPasswordMessage">
          {{ $t('login.forgotPassword') }}
        </a>
        <span class="divider">   |   </span>
        <span>{{ $t('login.dontHaveAccount') }}      </span>
        <router-link to="/register">{{ $t('login.signUp') }}</router-link>
      </div>
    </el-card>
  </div>
</template>

<script>
import {ElMessage} from 'element-plus'
import {auth} from '@/utils/auth.js'
import {hashSHA256} from "@/utils/CryptoHelper.js";
import {ref} from "vue";
const hashedPassword = ref("");

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
          {required: true, message: this.$t('login.usernameRequired'), trigger: 'blur'}
        ],
        password: [
          {required: true, message: this.$t('login.passwordRequired'), trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // handleLogin() {
    //   this.$refs.loginForm.validate((valid) => {
    //     if (valid) {
    //       // Default user and admin accounts
    //       const testUsers = [
    //         { username: 'admin', password: 'admin123', role: 'admin' },
    //         { username: 'user', password: 'user123', role: 'user' },
    //         { username: 'superadmin', password: 'superadmin123', role: 'superadmin'}
    //       ];
    //
    //       const user = testUsers.find(u => u.username === this.loginForm.username && u.password === this.loginForm.password);
    //
    //       if (user) {
    //         // Login successfully
    //         ElMessage.success(this.$t('login.loginSuccess'));
    //         auth.loginstate(user); // Update login status
    //         sessionStorage.setItem('userInfo', JSON.stringify(user)); // Store user info in session storage
    //         if (user.role === 'admin' || user.role === 'superadmin') {
    //           this.$router.push('/admin/overview');
    //         } else {
    //           this.$router.push('/user');
    //         }
    //       } else {
    //         // Login failed
    //         ElMessage.error(this.$t('login.loginFailed'));
    //       }
    //     }
    //   })
    // },

    handleLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          hashedPassword.value = await hashSHA256(this.loginForm.password);
          this.axios({
            url: 'http://localhost:8080/login',
            method: 'POST',
            headers: {                            // 请求头
              "Content-Type": "application/json",
            },
            data: {
              username: this.loginForm.username,
              password: hashedPassword.value
            }
          }).then(res => {
            if (res.data.code === 1) {
              // this.$message.success(res.data.msg);
              ElMessage.success(this.$t('login.loginSuccess'));
              if (res.data.data.role === 1 || res.data.data.role === 2) {
                this.$router.push({path: '/admin/Overview'});
              } else {
                this.$router.push({path: '/user'});
              }
              // this.$router.push("/");
              sessionStorage.setItem("userInfo", JSON.stringify(res.data.data));
              console.log("Stored userInfo:", sessionStorage.getItem("userInfo"));
              auth.loginstate(res.data.data)
            } else {
              // this.$message.error(res.data.msg);
              ElMessage.error(this.$t('login.loginFailed'));
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    resetForm() {
      this.$refs.loginForm.resetFields();
    },
    showForgotPasswordMessage() {
      ElMessage({
        message: this.$t('login.contactAdmin'),
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
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-card {
  animation: fadeIn 0.5s ease-out;
}

.el-form-item {
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards;
}

.el-form-item:nth-child(1) {
  animation-delay: 0.2s;
}

.el-form-item:nth-child(2) {
  animation-delay: 0.4s;
}

.el-form-item:nth-child(3) {
  animation-delay: 0.6s;
}

.login-footer {
  opacity: 0;
  animation: fadeIn 0.5s ease-out 0.8s forwards;
}
</style>

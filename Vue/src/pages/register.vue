<template>
  <div class="register-container">
    <el-card class="register-card">
      <div class="register-header">
        <h2>Create an Account</h2>
        <p>Join our community today</p>
      </div>

      <el-form
        ref="registerForm"
        :model="registerForm"
        :rules="rules"
        label-width="0"
        @submit.native.prevent="handleRegister"
        @keyup.enter="handleRegister"
      >
        <el-form-item prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="Username"
            prefix-icon="el-icon-user"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="Password"
            prefix-icon="el-icon-lock"
            show-password
          />
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="Confirm Password"
            prefix-icon="el-icon-lock"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleRegister" class="register-button">
            Register
          </el-button>
        </el-form-item>
      </el-form>

      <div class="register-footer">
        <span>Already have an account?</span>
        <router-link to="/login">Sign in</router-link>
      </div>
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
  min-height: 100vh;
  padding: 20px;
  background-image: url('https://images.pexels.com/photos/1290141/pexels-photo-1290141.jpeg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.register-card {
  width: 100%;
  max-width: 500px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.9);
}

.register-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 7px 14px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h2 {
  color: #333;
  font-size: 28px;
  margin-bottom: 10px;
}

.register-header p {
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

.register-button {
  width: 100%;
  padding: 12px 20px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.register-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.register-footer {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
}

.register-footer a {
  color: #409EFF;
  text-decoration: none;
  margin-left: 5px;
  transition: all 0.3s ease;
}

.register-footer a:hover {
  color: #66b1ff;
}

@media (max-width: 480px) {
  .register-card {
    padding: 20px;
  }

  .register-header h2 {
    font-size: 24px;
  }

  .register-header p {
    font-size: 14px;
  }

  .el-form-item {
    margin-bottom: 20px;
  }

  .register-button {
    padding: 10px 16px;
    font-size: 14px;
  }

  .register-footer {
    font-size: 12px;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.register-card {
  animation: fadeIn 0.5s ease-out;
}

.el-form-item {
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards;
}

.el-form-item:nth-child(1) { animation-delay: 0.2s; }
.el-form-item:nth-child(2) { animation-delay: 0.4s; }
.el-form-item:nth-child(3) { animation-delay: 0.6s; }
.el-form-item:nth-child(4) { animation-delay: 0.8s; }

.register-footer {
  opacity: 0;
  animation: fadeIn 0.5s ease-out 1s forwards;
}
</style>

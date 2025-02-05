<template>
  <div class="contact-us">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="contact-form">
          <template #header>
            <div class="card-header">
              <h2>联系我们</h2>
            </div>
          </template>
          
          <el-form 
            ref="contactForm"
            :model="form"
            :rules="rules"
            label-width="80px"
          >
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
            
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" />
            </el-form-item>
            
            <el-form-item label="主题" prop="subject">
              <el-select v-model="form.subject" placeholder="请选择咨询主题">
                <el-option
                  v-for="item in subjects"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            
            <el-form-item label="消息" prop="message">
              <el-input
                v-model="form.message"
                type="textarea"
                :rows="4"
                placeholder="请详细描述您的问题或建议..."
              />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="submitForm">提交</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="contact-info">
          <template #header>
            <div class="card-header">
              <h3>联系方式</h3>
            </div>
          </template>
          
          <div class="info-item">
            <el-icon><Location /></el-icon>
            <span>地址：新加坡南洋理工大学</span>
          </div>
          
          <div class="info-item">
            <el-icon><Phone /></el-icon>
            <span>电话：+65 1234 5678</span>
          </div>
          
          <div class="info-item">
            <el-icon><Message /></el-icon>
            <span>邮箱：library@example.com</span>
          </div>

          <div class="opening-hours">
            <h3>开放时间</h3>
            <p>周一至周五：8:00 - 22:00</p>
            <p>周六至周日：9:00 - 21:00</p>
            <p>法定节假日：9:00 - 17:00</p>
          </div>

          <div class="map">
            <!-- 这里可以添加地图组件 -->
            <div class="map-placeholder">
              地图加载中...
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Location, Phone, Message } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'ContactUs',
  components: {
    Location,
    Phone,
    Message
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        subject: '',
        message: ''
      },
      subjects: [
        { value: 'general', label: '一般咨询' },
        { value: 'borrow', label: '借阅相关' },
        { value: 'technical', label: '技术支持' },
        { value: 'suggestion', label: '建议反馈' },
        { value: 'other', label: '其他' }
      ],
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        subject: [
          { required: true, message: '请选择咨询主题', trigger: 'change' }
        ],
        message: [
          { required: true, message: '请输入消息内容', trigger: 'blur' },
          { min: 10, message: '消息内容不能少于10个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.contactForm.validate((valid) => {
        if (valid) {
          // 这里添加提交表单的逻辑
          ElMessage.success('消息已发送，我们会尽快回复您！')
          this.resetForm()
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$refs.contactForm.resetFields()
    }
  }
}
</script>

<style scoped>
.contact-us {
  padding: 20px;
}

.contact-form {
  margin-bottom: 20px;
}

.contact-info {
  height: 100%;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  color: #606266;
}

.opening-hours {
  margin: 20px 0;
  padding-top: 20px;
  border-top: 1px solid #EBEEF5;
}

.opening-hours h3 {
  margin-bottom: 10px;
  font-size: 16px;
}

.opening-hours p {
  margin: 5px 0;
  color: #606266;
}

.map {
  margin-top: 20px;
}

.map-placeholder {
  height: 200px;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  border-radius: 4px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-icon {
  color: #409EFF;
}
</style> 
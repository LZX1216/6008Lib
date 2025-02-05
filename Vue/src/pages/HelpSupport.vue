<template>
  <div class="help-support">
    <el-card class="faq-section">
      <template #header>
        <div class="section-header">
          <h2>常见问题</h2>
        </div>
      </template>
      
      <el-collapse v-model="activeNames">
        <el-collapse-item 
          v-for="faq in faqs" 
          :key="faq.id" 
          :title="faq.question"
          :name="faq.id"
        >
          <div class="faq-answer">{{ faq.answer }}</div>
        </el-collapse-item>
      </el-collapse>
    </el-card>

    <!-- 图书采购申请 -->
    <el-card class="purchase-request-section">
      <template #header>
        <div class="section-header">
          <h2>图书采购申请</h2>
          <el-button type="primary" @click="showRequestForm">
            提交采购申请
          </el-button>
        </div>
      </template>

      <!-- 采购申请列表 -->
      <el-table :data="purchaseRequests" style="width: 100%">
        <el-table-column prop="title" label="书名" />
        <el-table-column prop="author" label="作者" />
        <el-table-column prop="isbn" label="ISBN" width="120" />
        <el-table-column prop="requestDate" label="申请日期" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 联系表单 -->
    <el-card class="contact-form">
      <template #header>
        <div class="section-header">
          <h2>联系我们</h2>
        </div>
      </template>

      <el-form 
        ref="contactForm"
        :model="contactForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="contactForm.name" />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="contactForm.email" />
        </el-form-item>
        
        <el-form-item label="主题" prop="subject">
          <el-select v-model="contactForm.subject" placeholder="请选择咨询主题">
            <el-option label="借阅问题" value="borrow" />
            <el-option label="账户问题" value="account" />
            <el-option label="技术支持" value="technical" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="消息" prop="message">
          <el-input
            v-model="contactForm.message"
            type="textarea"
            :rows="4"
            placeholder="请详细描述您的问题..."
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 采购申请表单对话框 -->
    <el-dialog
      v-model="requestDialogVisible"
      title="图书采购申请"
      width="50%"
    >
      <el-form 
        ref="requestForm"
        :model="newRequest"
        :rules="requestRules"
        label-width="100px"
      >
        <el-form-item label="书名" prop="title">
          <el-input v-model="newRequest.title" />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="newRequest.author" />
        </el-form-item>
        <el-form-item label="ISBN" prop="isbn">
          <el-input v-model="newRequest.isbn" />
        </el-form-item>
        <el-form-item label="出版社" prop="publisher">
          <el-input v-model="newRequest.publisher" />
        </el-form-item>
        <el-form-item label="出版年份" prop="publishYear">
          <el-date-picker
            v-model="newRequest.publishYear"
            type="year"
            placeholder="选择年份"
          />
        </el-form-item>
        <el-form-item label="推荐理由" prop="reason">
          <el-input
            v-model="newRequest.reason"
            type="textarea"
            :rows="4"
            placeholder="请说明推荐这本书的理由..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="requestDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitRequest">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Location, Phone, Message } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { auth } from '@/utils/auth.js'

export default {
  name: 'HelpSupport',
  components: {
    Location,
    Phone,
    Message
  },
  data() {
    return {
      activeNames: ['1'],
      contactForm: {
        name: '',
        email: '',
        subject: '',
        message: ''
      },
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
      },
      faqs: [
        {
          id: '1',
          question: '如何借阅图书？',
          answer: '登录账号后，可以在图书详情页面点击"借阅"按钮进行借阅。每人最多可同时借阅5本图书，借阅期限为30天。'
        },
        {
          id: '2',
          question: '如何续借图书？',
          answer: '在"我的借阅"页面中，对于未逾期的图书可以进行续借操作。每本图书最多可续借2次，每次续借30天。'
        },
        {
          id: '3',
          question: '忘记还书会怎样？',
          answer: '逾期未还将产生罚金，每天每本书0.5元。同时会影响您的信用评分，可能会限制后续借阅权限。'
        }
      ],
      teamMembers: [
        { id: 1, name: '张馆长', avatar: '/avatars/1.jpg' },
        { id: 2, name: '李主任', avatar: '/avatars/2.jpg' },
        { id: 3, name: '王老师', avatar: '/avatars/3.jpg' }
      ],
      purchaseRequests: [
        {
          title: '深度学习实战',
          author: '张三',
          isbn: '9787111111111',
          requestDate: '2024-03-15',
          status: 'pending'
        }
      ],
      requestDialogVisible: false,
      newRequest: {
        title: '',
        author: '',
        isbn: '',
        publisher: '',
        publishYear: '',
        reason: ''
      },
      requestRules: {
        title: [
          { required: true, message: '请输入书名', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '请输入作者', trigger: 'blur' }
        ],
        isbn: [
          { required: true, message: '请输入ISBN', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '请输入推荐理由', trigger: 'blur' },
          { min: 20, message: '推荐理由不能少于20个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async submitForm() {
      try {
        await this.$refs.contactForm.validate()
        // 调用API发送消息
        // await sendContactMessage(this.contactForm)
        ElMessage.success('消息已发送，我们会尽快回复您！')
        this.resetForm()
      } catch (error) {
        console.error(error)
      }
    },
    resetForm() {
      this.$refs.contactForm.resetFields()
    },
    getStatusType(status) {
      const types = {
        pending: 'warning',
        approved: 'success',
        rejected: 'danger',
        purchased: 'info'
      }
      return types[status] || 'info'
    },
    getStatusText(status) {
      const texts = {
        pending: '待审核',
        approved: '已通过',
        rejected: '已拒绝',
        purchased: '已采购'
      }
      return texts[status] || status
    },
    showRequestForm() {
      if (!auth.isLoggedIn) {
        ElMessage.warning('请先登录')
        this.$router.push('/login')
        return
      }
      this.requestDialogVisible = true
    },
    submitRequest() {
      this.$refs.requestForm.validate((valid) => {
        if (valid) {
          // 这里添加提交采购申请的API调用
          ElMessage.success('采购申请提交成功')
          this.requestDialogVisible = false
          this.newRequest = {
            title: '',
            author: '',
            isbn: '',
            publisher: '',
            publishYear: '',
            reason: ''
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.help-support {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h2 {
  margin: 0;
}

.faq-section {
  margin-bottom: 20px;
}

.faq-answer {
  color: #606266;
  line-height: 1.6;
}

.contact-form {
  margin-top: 20px;
}

.contact-info {
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  color: #606266;
}

.opening-hours {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.opening-hours h3 {
  font-size: 16px;
  margin-bottom: 10px;
}

.opening-hours p {
  color: #606266;
  margin: 5px 0;
}

.about-team {
  margin-top: 20px;
}

.team-intro {
  color: #606266;
  line-height: 1.6;
  margin-bottom: 20px;
}

.team-members h3 {
  font-size: 16px;
  margin-bottom: 15px;
}

.purchase-request-section {
  margin-bottom: 20px;
}

.el-collapse-item {
  margin-bottom: 10px;
}
</style> 
<template>
  <div class="help-support">
    <el-card class="faq-section">
      <template #header>
        <div class="section-header">
          <h2>Frequently Asked Questions</h2>
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

    <!-- Book Purchase Request -->
    <el-card class="purchase-request-section">
      <template #header>
        <div class="section-header">
          <h2>Book Purchase Request</h2>
          <el-button type="primary" @click="showPurchaseRequestDialog">
            Submit Purchase Request
          </el-button>
        </div>
      </template>

      <!-- Purchase Request List -->
      <el-table :data="purchaseRequests" style="width: 100%">
        <el-table-column prop="title" label="Title" />
        <el-table-column prop="author" label="Author" />
        <el-table-column prop="isbn" label="ISBN" width="120" />
        <el-table-column prop="requestDate" label="Request Date" width="120" />
        <el-table-column prop="status" label="Status" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Contact Form -->
    <el-card class="contact-form">
      <template #header>
        <div class="section-header">
          <h2>Contact Us</h2>
        </div>
      </template>

      <el-form
        ref="contactForm"
        :model="contactForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="Name" prop="name">
          <el-input v-model="contactForm.name" />
        </el-form-item>

        <el-form-item label="Email" prop="email">
          <el-input v-model="contactForm.email" />
        </el-form-item>

        <el-form-item label="Subject" prop="subject">
          <el-select v-model="contactForm.subject" placeholder="Please select a subject">
            <el-option label="Borrowing Issues" value="borrow" />
            <el-option label="Account Issues" value="account" />
            <el-option label="Technical Support" value="technical" />
            <el-option label="Other" value="other" />
          </el-select>
        </el-form-item>

        <el-form-item label="Message" prop="message">
          <el-input
            v-model="contactForm.message"
            type="textarea"
            :rows="4"
            placeholder="Please describe your issue in detail..."
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitForm">Submit</el-button>
          <el-button @click="resetForm">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Purchase Request Form Dialog -->
    <el-dialog
      v-model="purchaseRequestDialogVisible"
      title="Submit Purchase Request"
      width="50%"
    >
      <el-form
        ref="form"
        :model="purchaseRequest"
        :rules="requestRules"
        label-width="100px"
      >
        <el-form-item label="Title" prop="title">
          <el-input v-model="purchaseRequest.title" />
        </el-form-item>
        <el-form-item label="Author" prop="author">
          <el-input v-model="purchaseRequest.author" />
        </el-form-item>
        <el-form-item label="Publisher" prop="publisher">
          <el-input v-model="purchaseRequest.publisher" />
        </el-form-item>
        <el-form-item label="ISBN" prop="isbn">
          <el-input v-model="purchaseRequest.isbn" />
        </el-form-item>
        <el-form-item label="Publish Date" prop="publishDate">
          <el-input v-model="purchaseRequest.publishDate" />
        </el-form-item>
        <el-form-item label="Reason" prop="reason">
          <el-input
            v-model="purchaseRequest.reason"
            type="textarea"
            :rows="4"
            placeholder="Please explain why you recommend this book..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="purchaseRequestDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitRequest">Submit Request</el-button>
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
          { required: true, message: 'Please enter your name', trigger: 'blur' },
          { min: 2, max: 20, message: 'Length should be 2 to 20 characters', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Please enter your email address', trigger: 'blur' },
          { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' }
        ],
        subject: [
          { required: true, message: 'Please select a subject', trigger: 'change' }
        ],
        message: [
          { required: true, message: 'Please enter your message', trigger: 'blur' },
          { min: 10, message: 'Message must be at least 10 characters', trigger: 'blur' }
        ]
      },
      faqs: [
        {
          id: '1',
          question: 'How to borrow books?',
          answer: 'After logging in, you can click the "Borrow" button on the book details page to borrow. Each person can borrow up to 5 books at a time, with a loan period of 30 days.'
        },
        {
          id: '2',
          question: 'How to renew books?',
          answer: 'On the "My Borrowings" page, you can renew books that are not overdue. Each book can be renewed up to 2 times, with each renewal extending the loan period by 30 days.'
        },
        {
          id: '3',
          question: 'What happens if I forget to return a book?',
          answer: 'Overdue books will incur a fine of 0.5 yuan per book per day. It will also affect your credit score and may restrict your future borrowing privileges.'
        }
      ],
      teamMembers: [
        { id: 1, name: 'Director Zhang', avatar: '/avatars/1.jpg' },
        { id: 2, name: 'Deputy Director Li', avatar: '/avatars/2.jpg' },
        { id: 3, name: 'Teacher Wang', avatar: '/avatars/3.jpg' }
      ],
      purchaseRequests: [
        {
          title: 'Deep Learning in Action',
          author: 'Zhang San',
          isbn: '9787111111111',
          requestDate: '2024-03-15',
          status: 'pending'
        }
      ],
      purchaseRequestDialogVisible: false,
      purchaseRequest: {
        title: '',
        author: '',
        publisher: '',
        isbn: '',
        publishDate: '',
        reason: ''
      },
      requestRules: {
        title: [
          { required: true, message: 'Please enter the book title', trigger: 'blur' }
        ],
        author: [
          { required: true, message: 'Please enter the author', trigger: 'blur' }
        ],
        isbn: [
          { required: true, message: 'Please enter the ISBN', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: 'Please enter the reason for recommendation', trigger: 'blur' },
          { min: 20, message: 'The reason should be at least 20 characters', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async submitForm() {
      try {
        await this.$refs.contactForm.validate()
        // Call API to send message
        // await sendContactMessage(this.contactForm)
        ElMessage.success('Message sent, we will get back to you as soon as possible!')
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
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected',
        purchased: 'Purchased'
      }
      return texts[status] || status
    },
    showPurchaseRequestDialog() {
      if (!auth.isLoggedIn) {
        ElMessage.warning('Please log in first')
        this.$router.push('/login')
        return
      }
      this.purchaseRequestDialogVisible = true
    },
    submitRequest() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 这里添加提交采购申请的API调用
          ElMessage.success('Purchase request submitted successfully')
          this.purchaseRequestDialogVisible = false
          this.purchaseRequest = {
            title: '',
            author: '',
            publisher: '',
            isbn: '',
            publishDate: '',
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
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

.opening-hours h3 {
  font-size: 16px;
  margin-bottom: 10px;
}

.opening-hours p {
  color: #606266;
  margin: 5px 0;
}

.team-members h3 {
  font-size: 16px;
  margin-bottom: 15px;
}

.purchase-request-section {
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .help-support {
    padding: 15px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .section-header h2 {
    margin-bottom: 10px;
  }

  .el-form-item {
    margin-bottom: 15px;
  }

  .el-form-item__label {
    float: none;
    display: block;
    text-align: left;
    margin-bottom: 5px;
  }

  .el-form-item__content {
    margin-left: 0 !important;
  }

  .el-button {
    display: block;
    width: 100%;
    margin-bottom: 10px;
  }

  .el-button + .el-button {
    margin-left: 0;
  }

  .el-table {
    font-size: 12px;
  }

  .el-table .cell {
    padding-left: 5px;
    padding-right: 5px;
  }
}

@media (max-width: 480px) {
  .help-support {
    padding: 10px;
  }

  .section-header h2 {
    font-size: 18px;
  }

  .faq-answer,
  .el-form-item__label,
  .el-form-item__content,
  .el-input__inner,
  .el-textarea__inner {
    font-size: 14px;
  }

  .el-table {
    font-size: 11px;
  }
}

:deep(.el-dialog) {
  width: 90% !important;
  max-width: none !important;
}

@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 95% !important;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.help-support {
  animation: fadeIn 0.8s ease-out;
}

.faq-section {
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.el-collapse-item {
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards;
}

.el-collapse-item:nth-child(1) { animation-delay: 0.4s; }
.el-collapse-item:nth-child(2) { animation-delay: 0.6s; }
.el-collapse-item:nth-child(3) { animation-delay: 0.8s; }

.purchase-request-section {
  animation: fadeInUp 0.8s ease-out 1s both;
}

.el-table {
  opacity: 0;
  animation: fadeIn 0.8s ease-out 1.2s forwards;
}

.contact-form {
  animation: fadeInUp 0.8s ease-out 1.4s both;
}

.el-form-item {
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards;
}

.el-form-item:nth-child(1) { animation-delay: 1.6s; }
.el-form-item:nth-child(2) { animation-delay: 1.8s; }
.el-form-item:nth-child(3) { animation-delay: 2s; }
.el-form-item:nth-child(4) { animation-delay: 2.2s; }
.el-form-item:nth-child(5) { animation-delay: 2.4s; }

.el-button {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.el-collapse-item__header,
.el-table__row,
.el-form-item {
  transition: background-color 0.3s ease;
}

.el-collapse-item__header:hover,
.el-table__row:hover,
.el-form-item:hover {
  background-color: #f5f7fa;
}

@media (max-width: 768px) {
  .help-support,
  .faq-section,
  .el-collapse-item,
  .purchase-request-section,
  .el-table,
  .contact-form,
  .el-form-item {
    animation-name: fadeIn;
    animation-duration: 0.5s;
    animation-delay: 0s;
  }
}
</style> 
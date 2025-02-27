<template>
  <div class="help-support">
    <el-card class="faq-section">
      <template #header>
        <div class="section-header">
          <h2 class="section-title">{{ $t('helpSupport.faqTitle') }}</h2>
        </div>
      </template>

      <el-collapse v-model="activeNames">
        <el-collapse-item
          v-for="faq in faqs"
          :key="faq.id"
          :title="$t(faq.Question)"
          :name="faq.id"
          class="custom-collapse-item"
        >
          <template #title>
            <span class="question-title">{{ $t(faq.Question) }}</span>
          </template>
          <div class="faq-answer">{{ $t(faq.Answer) }}</div>
        </el-collapse-item>
      </el-collapse>
    </el-card>

    <!-- Book Purchase Request -->
    <el-card class="purchase-request-section">
      <template #header>
        <div class="section-header">
          <h2>{{ $t('helpSupport.purchaseRequestTitle') }}</h2>
          <el-button type="primary" @click="showPurchaseRequestDialog">
            {{ $t('helpSupport.submitPurchaseRequest') }}
          </el-button>
        </div>
      </template>

      <!-- Purchase Request List -->
      <el-table :data="purchaseRequests" style="width: 100%">
        <el-table-column prop="title" :label="$t('book.title')" />
        <el-table-column prop="author" :label="$t('book.author')" />
        <el-table-column prop="isbn" :label="$t('book.isbn')" width="120" />
        <el-table-column prop="requestDate" :label="$t('helpSupport.requestDate')" width="120" />
        <el-table-column prop="status" :label="$t('helpSupport.status')" width="100">
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
          <h2>{{ $t('helpSupport.contactUsTitle') }}</h2>
        </div>
      </template>

      <el-form
        ref="contactForm"
        :model="contactForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item :label="$t('helpSupport.name')" prop="name">
          <el-input v-model="contactForm.name" />
        </el-form-item>

        <el-form-item :label="$t('helpSupport.email')" prop="email">
          <el-input v-model="contactForm.email" />
        </el-form-item>

        <el-form-item :label="$t('helpSupport.subject')" prop="subject">
          <el-select v-model="contactForm.subject" :placeholder="$t('helpSupport.selectSubject')">
            <el-option :label="$t('helpSupport.borrowingIssues')" value="borrow" />
            <el-option :label="$t('helpSupport.accountIssues')" value="account" />
            <el-option :label="$t('helpSupport.technicalSupport')" value="technical" />
            <el-option :label="$t('helpSupport.other')" value="other" />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('helpSupport.message')" prop="message">
          <el-input
            v-model="contactForm.message"
            type="textarea"
            :rows="4"
            :placeholder="$t('helpSupport.describeIssue')"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">{{ $t('helpSupport.submit') }}</el-button>
          <el-button @click="resetForm">{{ $t('helpSupport.reset') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Purchase Request Form Dialog -->
    <el-dialog
      v-model="purchaseRequestDialogVisible"
      :title="$t('helpSupport.submitPurchaseRequestTitle')"
      width="50%"
    >
      <el-form
        ref="form"
        :model="purchaseRequest"
        :rules="requestRules"
        label-width="100px"
      >
        <el-form-item :label="$t('book.title')" prop="title">
          <el-input v-model="purchaseRequest.title" />
        </el-form-item>
        <el-form-item :label="$t('book.author')" prop="author">
          <el-input v-model="purchaseRequest.author" />
        </el-form-item>
        <el-form-item :label="$t('book.publisher')" prop="publisher">
          <el-input v-model="purchaseRequest.publisher" />
        </el-form-item>
        <el-form-item :label="$t('book.isbn')" prop="isbn">
          <el-input v-model="purchaseRequest.isbn" />
        </el-form-item>
        <el-form-item :label="$t('book.publishDate')" prop="publishDate">
          <el-input v-model="purchaseRequest.publishDate" />
        </el-form-item>
        <el-form-item :label="$t('helpSupport.reason')" prop="reason">
          <el-input
            v-model="purchaseRequest.reason"
            type="textarea"
            :rows="4"
            :placeholder="$t('helpSupport.explainReason')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="purchaseRequestDialogVisible = false">{{ $t('helpSupport.cancel') }}</el-button>
          <el-button type="primary" @click="submitRequest">{{ $t('helpSupport.submitRequest') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { auth } from '@/utils/auth.js'

export default {
  name: 'HelpSupport',
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
          { required: true, message: this.$t('helpSupport.nameRequired'), trigger: 'blur' },
          { min: 2, max: 20, message: this.$t('helpSupport.nameLength'), trigger: 'blur' }
        ],
        email: [
          { required: true, message: this.$t('helpSupport.emailRequired'), trigger: 'blur' },
          { type: 'email', message: this.$t('helpSupport.validEmail'), trigger: 'blur' }
        ],
        subject: [
          { required: true, message: this.$t('helpSupport.selectSubjectRequired'), trigger: 'change' }
        ],
        message: [
          { required: true, message: this.$t('helpSupport.messageRequired'), trigger: 'blur' },
          { min: 10, message: this.$t('helpSupport.messageMinLength'), trigger: 'blur' }
        ]
      },
      faqs: [
        {
          id: '1',
          Question: 'helpSupport.faq1Question',
          Answer: 'helpSupport.faq1Answer'
        },
        {
          id: '2',
          Question: 'helpSupport.faq2Question',
          Answer: 'helpSupport.faq2Answer'
        },
        {
          id: '3',
          Question: 'helpSupport.faq3Question',
          Answer: 'helpSupport.faq3Answer'
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
          requestDate: '2025-03-15',
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
          { required: true, message: this.$t('helpSupport.titleRequired'), trigger: 'blur' }
        ],
        author: [
          { required: true, message: this.$t('helpSupport.authorRequired'), trigger: 'blur' }
        ],
        isbn: [
          { required: true, message: this.$t('helpSupport.isbnRequired'), trigger: 'blur' }
        ],
        reason: [
          { required: true, message: this.$t('helpSupport.reasonRequired'), trigger: 'blur' },
          { min: 20, message: this.$t('helpSupport.reasonMinLength'), trigger: 'blur' }
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
        ElMessage.success(this.$t('helpSupport.messageSent'))
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
        pending: this.$t('helpSupport.pending'),
        approved: this.$t('helpSupport.approved'),
        rejected: this.$t('helpSupport.rejected'),
        purchased: this.$t('helpSupport.purchased')
      }
      return texts[status] || status
    },
    showPurchaseRequestDialog() {
      if (!auth.isLoggedIn) {
        ElMessage.warning(this.$t('helpSupport.pleaseLogin'))
        this.$router.push('/login')
        return
      }
      this.purchaseRequestDialogVisible = true
    },
    submitRequest() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 这里添加提交采购申请的API调用
          ElMessage.success(this.$t('helpSupport.purchaseRequestSubmitted'))
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
  margin-bottom: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.faq-section:hover {
  transform: translateY(-2px);
}

.section-title {
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
  padding-left: 8px;
  border-left: 4px solid #409eff;
}

.question-title {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.05rem;
}

.faq-answer {
  color: #5a6c7d;
  line-height: 1.7;
  padding: 16px 24px;
  background: #f8fafc;
  border-radius: 0 0 8px 8px;
  border-left: 3px solid #409eff;
  margin: 8px 0;
  animation: answerReveal 0.3s ease-out;
}

.faq-collapse {
  --el-collapse-border-color: transparent;
}

.custom-collapse-item {
  margin: 8px 0;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.custom-collapse-item:hover {
  box-shadow: 0 2px 8px rgba(32, 160, 255, 0.15);
}

:deep(.el-collapse-item__header) {
  padding: 16px 24px;
  background: #fff !important;
  border-radius: 8px !important;
  transition: background 0.3s ease;
}

:deep(.el-collapse-item__header):hover {
  background: #f8fafc !important;
}

:deep(.el-collapse-item__arrow) {
  margin-right: 12px;
  font-weight: 700;
  color: #409eff;
}

.contact-form {
  margin-top: 20px;
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

  :deep(.el-dialog) {
    width: 90% !important;
  }

  .el-form-item__label,
  .el-form-item__content,
  .el-input__inner,
  .el-textarea__inner {
    font-size: 14px;
  }

  .el-form-item {
    margin-bottom: 10px;
  }

  .el-button {
    display: block;
    width: 100%;
    margin-bottom: 10px;
  }

  .el-textarea__inner {
    height: 80px;
  }

  .section-title {
    font-size: 1.3rem;
  }
  
  .question-title {
    font-size: 1rem;
  }
  
  :deep(.el-collapse-item__header) {
    padding: 12px 16px;
  }
  
  .faq-answer {
    padding: 12px 16px;
    font-size: 0.95rem;
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

  :deep(.el-dialog) {
    width: 95% !important;
  }
}

@keyframes answerReveal {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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
  animation: fadeIn 0.6s ease-out;
}

.faq-section {
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.el-collapse-item {
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards;
}

.el-collapse-item:nth-child(1) { animation-delay: 0.3s; }
.el-collapse-item:nth-child(2) { animation-delay: 0.4s; }
.el-collapse-item:nth-child(3) { animation-delay: 0.5s; }

.purchase-request-section {
  animation: fadeInUp 0.6s ease-out 0.8s both;
}

.el-table {
  opacity: 0;
  animation: fadeIn 0.6s ease-out 1s forwards;
}

.contact-form {
  animation: fadeInUp 0.6s ease-out 1.2s both;
}

.animated-form-item {
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards;
}

.animated-form-item:nth-child(1) { animation-delay: 0.2s; }
.animated-form-item:nth-child(2) { animation-delay: 0.3s; }
.animated-form-item:nth-child(3) { animation-delay: 0.4s; }
.animated-form-item:nth-child(4) { animation-delay: 0.5s; }
.animated-form-item:nth-child(5) { animation-delay: 0.6s; }
.animated-form-item:nth-child(6) { animation-delay: 0.7s; }

@media (max-width: 768px) {
  .help-support,
  .faq-section,
  .el-collapse-item,
  .purchase-request-section,
  .el-table,
  .contact-form,
  .animated-form-item {
    animation-name: fadeIn;
    animation-duration: 0.5s;
    animation-delay: 0s;
  }
}
</style>
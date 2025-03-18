<template>
  <div class="paper-detail">
    <el-row :gutter="20">
      <!-- Left side paper information -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card class="paper-card">
          <div class="paper-actions">
            <el-button type="primary" @click="downloadPaper">
              {{ $t('paperDetail.download') }}
            </el-button>
            <el-button type="primary" @click="addToReadingList">
              {{ $t('paperDetail.addToList') }}
            </el-button>
          </div>
          <div class="rating">
            <el-rate v-model="paper.rating" disabled show-score/>
          </div>
        </el-card>

        <!-- Similar Papers Section -->
        <el-card class="similar-papers-card">
          <template #header>
            <div class="similar-papers-header">
              <h3>{{ $t('paperDetail.similarPapersTitle') }}</h3>
            </div>
          </template>
          <div class="similar-papers-list">
            <div
              v-for="similarPaper in similarPapers"
              :key="similarPaper.id"
              class="similar-paper-item"
              @click="goToPaperDetail(similarPaper.id)"
              style="cursor: pointer;"
            >
              <div class="similar-paper-info">
                <p class="similar-paper-title">{{ similarPaper.title }}</p>
                <p class="similar-paper-authors">{{ similarPaper.authors }}</p>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- Right side detailed information -->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <el-card class="paper-info-card">
          <h1 class="paper-title">{{ paper.title }}</h1>
          <div class="paper-meta">
            <p class="authors"><i class="el-icon-user"></i> {{ $t('paper.authors') }}: {{ paper.authors }}</p>
            <p class="conference"><i class="el-icon-office-building"></i> {{ $t('paper.conference') }}: {{ paper.conference }}</p>
            <p class="doi"><i class="el-icon-document"></i> {{ $t('paper.doi') }}: {{ paper.doi }}</p>
            <p class="publication-year"><i class="el-icon-date"></i> {{ $t('paper.publicationYear') }}: {{ paper.publicationYear }}</p>
            <p class="field"><i class="el-icon-collection-tag"></i> {{ $t('paper.field') }}: {{ paper.field }}</p>
          </div>

          <el-divider></el-divider>

          <div class="paper-abstract">
            <h3>{{ $t('paperDetail.abstractTitle') }}</h3>
            <p>{{ paper.abstract }}</p>
          </div>

          <el-divider></el-divider>

          <div class="paper-metrics">
            <h3>{{ $t('paperDetail.metricsTitle') }}</h3>
            <el-descriptions :column="2" border>
              <el-descriptions-item
                :label="$t('paper.citationCount')"
              >{{ paper.citationCount }}</el-descriptions-item>
              <el-descriptions-item
                :label="$t('paper.referenceCount')"
              >{{ paper.referenceCount }}</el-descriptions-item>
              <el-descriptions-item
                :label="$t('paper.downloads')"
              >{{ paper.downloads }}</el-descriptions-item>
              <el-descriptions-item
                :label="$t('paper.views')"
              >{{ paper.views }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>

        <!-- Comments section -->
        <el-card class="comments-card">
          <template #header>
            <div class="comments-header">
              <h3>{{ $t('paperDetail.commentsTitle') }}</h3>
              <el-button type="primary"  @click="showCommentDialog">
                {{ $t('paperDetail.writeCommentTitle') }}
              </el-button>
            </div>
          </template>

          <div class="comments-list">
            <div v-for="comment in comments" :key="comment.id" class="comment-item">
              <div class="comment-header">
                <el-avatar :size="32">{{ comment.username.charAt(0) }}</el-avatar>
                <span class="username">{{ comment.username }}</span>
                <span class="comment-date">{{ comment.date }}</span>
              </div>
              <div class="comment-rating">
                <el-rate v-model="comment.rating" disabled />
              </div>
              <p class="comment-content">{{ comment.content }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Comment dialog -->
    <el-dialog
      v-model="commentDialogVisible"
      :title="$t('paperDetail.writeCommentTitle')"
      width="50%"
    >
      <el-form :model="newComment" ref="commentForm" :rules="commentRules">
        <el-form-item
          :label="$t('paper.rating')"
          prop="rating"
        >
          <el-rate v-model="newComment.rating" />
        </el-form-item>
        <el-form-item
          :label="$t('paper.comment')"
          prop="content"
        >
          <el-input
            v-model="newComment.content"
            type="textarea"
            :rows="4"
            :placeholder="$t('paperDetail.commentPlaceholder')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="commentDialogVisible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="submitComment">{{ $t('common.submit') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';
import { auth } from '@/utils/auth.js';

export default {
  name: 'PaperDetail',
  data() {
    return {
      paper: {
        id: 1,
        title: 'Attention Is All You Need',
        authors: 'Vaswani, Ashish; Shazeer, Noam; Parmar, Niki',
        conference: 'Neural Information Processing Systems (NIPS)',
        doi: '10.48550/arXiv.1706.03762',
        publicationYear: 2017,
        field: 'Artificial Intelligence',
        rating: 4.8,
        abstract: 'We introduce a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
        citationCount: 12345,
        referenceCount: 500,
        downloads: 100000,
        views: 500000
      },
      similarPapers: [ // 相似论文
        {
          id: 2,
          title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
          authors: 'Devlin, Jacob; Chang, Ming-Wei; Lee, Kenton',
        }
      ],
      comments: [
        {
          id: 1,
          username: 'Researcher A',
          date: '2025-03-15',
          rating: 5,
          content: 'Seminal work in transformer architectures. Great contribution to NLP field.'
        }
      ],
      commentDialogVisible: false,
      newComment: {
        rating: 0,
        content: ''
      },
      commentRules: {
        rating: [
          { required: true, message: this.$t('paperDetail.ratingRequired'), trigger: 'change' }
        ],
        content: [
          { required: true, message: this.$t('paperDetail.commentRequired'), trigger: 'blur' },
          { min: 10, message: this.$t('paperDetail.commentMinLength'), trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    downloadPaper() {
      if (!auth.isLoggedIn) {
        ElMessage.warning(this.$t('common.loginRequired'));
        this.$router.push('/login');
        return;
      }
      ElMessage.success(this.$t('paperDetail.downloadSuccess'));
    },
    addToReadingList() {
      if (!auth.isLoggedIn) {
        ElMessage.warning(this.$t('common.loginRequired'));
        this.$router.push('/login');
        return;
      }
      ElMessage.success(this.$t('paperDetail.addToReadingListSuccess'));
    },
    goToPaperDetail(paperId) {
      this.$router.push(`/paper/${paperId}`);
    },
    showCommentDialog() {
      if (!auth.isLoggedIn) {
        ElMessage.warning(this.$t('common.loginRequired'));
        this.$router.push('/login');
        return;
      }
      this.commentDialogVisible = true;
    },
    submitComment() {
      this.$refs.commentForm.validate((valid) => {
        if (valid) {
          // Add API call to submit the comment here
          ElMessage.success(this.$t('paperDetail.commentSubmitSuccess'));
          this.commentDialogVisible = false;
          this.newComment = {
            rating: 0,
            content: ''
          };
        }
      });
    },
    async fetchPaperDetails(paperId) {
    try {
      this.paper = await getPaperById(paperId);
      this.similarPapers = await getSimilarPapers(paperId);
    } catch (error) {
      this.$router.push('/404');
    }
  }
  },
  created() {

},
};
</script>

<style scoped>
.paper-detail {
  padding: 20px;
  animation: fadeIn 0.8s ease-out;
}

.paper-card {
  text-align: center;
  animation: slideInUp 0.8s ease-out 0.2s both;
}

.paper-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.paper-actions .el-button {
  border: none;
  color: white;
  font-size: 16px;
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.paper-actions .el-button:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.rating {
  display: flex;
  align-items: center;
  margin: 15px 0;
  justify-content: center;
}

.rating span {
  font-size: 1.2rem;
  margin-right: 10px;
  color: #4a5568;
}

.el-rate {
  font-size: 24px;
  color: #ff9900;
}

.el-rate .el-rate__icon {
  margin-right: 5px;
}

.el-rate .el-rate__icon.is-active {
  color: #ff9900;
}

.el-rate .el-rate__icon.is-active {
  color: #ff9900;
}

.similar-papers-card {
  margin-top: 20px;
  margin-bottom: 20px;
  animation: slideInUp 0.8s ease-out 0.2s both;
}

.similar-papers-header h3 {
  font-size: 1.5rem;
  color: #303133;
  margin-bottom: 10px;
}

.similar-papers-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.similar-paper-item {
  display: flex;
  align-items: center;
}

.similar-paper-info {
  display: flex;
  flex-direction: column;
}

.similar-paper-title {
  font-size: 1rem;
  color: #303133;
  margin: 0;
}

.similar-paper-author {
  font-size: 0.9rem;
  color: #606266;
  margin: 0;
}

.paper-info-card {
  margin-bottom: 20px;
  animation: slideInUp 0.8s ease-out 0.4s both;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.paper-title {
  font-size: 2.2rem;
  color: #1a365d;
  margin-bottom: 25px;
  position: relative;
  padding-bottom: 10px;
}

.paper-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: #409eff;
  border-radius: 2px;
}

.paper-meta {
  color: #4a5568;
  line-height: 1.8;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
}

.paper-meta p {
  margin: 12px 0;
  display: flex;
  align-items: center;
  font-size: 1.05rem;
}

.paper-meta i {
  margin-right: 12px;
  font-size: 1.2rem;
  color: #409eff;
  min-width: 24px;
  text-align: center;
}

.paper-abstract {
  margin: 20px 0;
}

.paper-abstract h3 {
  font-size: 1.5rem;
  color: #303133;
  margin-bottom: 10px;
  font-weight: bold;
}

.paper-status h3 {
  font-size: 1.5rem;
  color: #303133;
  margin-bottom: 10px;
  font-weight: bold;
}

.paper-status .el-descriptions {
  animation: fadeIn 0.8s ease-out;
}

.paper-status .el-descriptions__body {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.paper-status .el-descriptions__label {
  background-color: #f5f7fa;
  font-weight: bold;
  padding: 12px 15px;
}

.paper-status .el-descriptions__content {
  padding: 12px 15px;
}

.paper-status .el-descriptions__label,
.paper-status .el-descriptions__content {
  transition: background-color 0.3s ease;
}

.paper-status .el-descriptions__row:hover .el-descriptions__label,
.paper-status .el-descriptions__row:hover .el-descriptions__content {
  background-color: #ecf5ff;
}

.comments-card {
  margin-top: 20px;
  animation: fadeInUp 0.8s ease-out;
}

.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.comments-header h3 {
  font-size: 1.5rem;
  color: #303133;
  margin-bottom: 10px;
  font-weight: bold;
}

.comments-list {
  max-height: 400px;
  overflow-y: auto;
}

.comment-item {
  padding: 15px;
  border-bottom: 1px solid #ebeef5;
  transition: background-color 0.3s ease;
  animation: fadeIn 0.5s ease-out;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-item:hover {
  background-color: #f5f7fa;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.comment-header .el-avatar {
  margin-right: 10px;
}

.username {
  font-weight: bold;
  margin-right: 10px;
}

.comment-date {
  color: #909399;
  font-size: 0.9rem;
}

.comment-rating {
  margin-bottom: 5px;
}

.comment-content {
  color: #606266;
  line-height: 1.5;
}

@keyframes slideInUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
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

@media (max-width: 768px) {
  .similar-paper-item {
    flex-direction: column;
    text-align: center;
  }

  .similar-paper-info {
    text-align: center;
  }
}

@media (max-width: 480px) {
  .similar-papers-header h3 {
    font-size: 1.2rem;
  }

  .similar-paper-title {
    font-size: 0.95rem;
  }

  .similar-paper-author {
    font-size: 0.85rem;
  }
}

:deep(.el-descriptions__body) {
  background-color: #f8fafc !important;
}

:deep(.el-descriptions__label) {
  font-weight: 600;
  color: #2d3748 !important;
  background-color: #e2e8f0 !important;
}

:deep(.el-descriptions__content) {
  color: #4a5568 !important;
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid #e2e8f0;
}

:deep(.el-dialog__title) {
  color: #1a365d;
  font-weight: 600;
}
</style>
<template>
  <div class="book-detail">
    <el-row :gutter="20">
      <!-- Left side book information -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card class="book-cover-card">
          <img :src="book.cover" class="book-cover" alt="Book cover" />
          <div class="book-actions">
            <el-button type="primary" :disabled="!book.available" @click="borrowBook">
              {{ book.available ? $t('bookDetail.borrow') : $t('bookDetail.unavailable') }}
            </el-button>
            <el-button type="primary" @click="addToWishlist">
              {{$t('bookDetail.addToList')}}
            </el-button>
          </div>
          <div class="rating">
            <el-rate v-model="book.rating" disabled show-score/>
          </div>
        </el-card>

        <!-- Similar Books Section -->
        <el-card class="similar-books-card">
          <template #header>
            <div class="similar-books-header">
              <h3>{{ $t('bookDetail.similarBooksTitle') }}</h3>
            </div>
          </template>
          <div class="similar-books-list">
            <div
              v-for="similarBook in similarBooks"
              :key="similarBook.id"
              class="similar-book-item"
              @click="goToBookDetail(similarBook.id)"
              style="cursor: pointer;"
            >
              <img :src="similarBook.cover" class="similar-book-cover" alt="Similar Book Cover" />
              <div class="similar-book-info">
                <p class="similar-book-title">{{ similarBook.title }}</p>
                <p class="similar-book-author">{{ similarBook.author }}</p>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- Right side detailed information -->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <el-card class="book-info-card">
          <h1 class="book-title">{{ book.title }}</h1>
          <div class="book-meta">
            <p class="author"><i class="el-icon-user"></i> {{ $t('book.author') }}: {{ book.author }}</p>
            <p class="publisher"><i class="el-icon-office-building"></i> {{ $t('book.publisher') }}: {{ book.publisher }}</p>
            <p class="isbn"><i class="el-icon-document"></i> {{ $t('book.isbn') }}: {{ book.isbn }}</p>
            <p class="publish-date"><i class="el-icon-date"></i> {{ $t('book.publishDate') }}: {{ book.publishDate }}</p>
            <p class="category"><i class="el-icon-collection-tag"></i> {{ $t('book.category') }}: {{ book.category }}</p>
          </div>

          <el-divider></el-divider>

          <div class="book-description">
            <h3>{{ $t('bookDetail.descriptionTitle') }}</h3>
            <p>{{ book.description }}</p>
          </div>

          <el-divider></el-divider>

          <div class="book-status">
            <h3>{{ $t('bookDetail.libraryInfoTitle') }}</h3>
            <el-descriptions :column="2" border>
              <el-descriptions-item
                :label="$t('book.location')"
              >{{ book.location }}</el-descriptions-item>
              <el-descriptions-item
                :label="$t('book.callNumber')"
              >{{ book.callNumber }}</el-descriptions-item>
              <el-descriptions-item
                :label="$t('book.availableCopies')"
              >{{ book.availableCopies }}</el-descriptions-item>
              <el-descriptions-item
                :label="$t('book.totalCopies')"
              >{{ book.totalCopies }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>

        <!-- Comments section -->
        <el-card class="comments-card">
          <template #header>
            <div class="comments-header">
              <h3>{{ $t('bookDetail.commentsTitle') }}</h3>
              <el-button type="primary"  @click="showCommentDialog">
                {{ $t('bookDetail.writeCommentTitle') }}
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
      :title="$t('bookDetail.writeCommentTitle')"
      width="50%"
    >
      <el-form :model="newComment" ref="commentForm" :rules="commentRules">
        <el-form-item
          :label="$t('book.rating')"
          prop="rating"
        >
          <el-rate v-model="newComment.rating" />
        </el-form-item>
        <el-form-item
          :label="$t('book.comment')"
          prop="content"
        >
          <el-input
            v-model="newComment.content"
            type="textarea"
            :rows="4"
            :placeholder="$t('bookDetail.commentPlaceholder')"
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
import { ElMessage, ElMessageBox } from 'element-plus';
import { auth } from '@/utils/auth.js';

export default {
  name: 'BookDetail',
  data() {
    return {
      book: {
        id: 1,
        title: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
        publisher: 'The MIT Press',
        isbn: '9780262033848',
        publishDate: '2000-01-01',
        category: 'Algorithms',
        cover: 'https://m.media-amazon.com/images/I/61Mw06x2XcL._AC_UL320_.jpg',
        rating: 4.5,
        description: 'A comprehensive introduction to the modern study of computer algorithms. It presents many algorithms and covers them in considerable depth, yet makes their design and analysis accessible to all levels of readers.',
        location: 'Computer Science Section',
        callNumber: 'QA76.6.I5858',
        availableCopies: 3,
        totalCopies: 5,
        available: true
      },
      similarBooks: [
        {
          id: 1,
          title: "Algorithm Design",
          author: "Jon Kleinberg, Éva Tardos",
          cover: 'https://m.media-amazon.com/images/I/81onzAm2kgL._SY342_.jpg'
        },
        {
          id: 2,
          title: "Data Structures and Algorithm Analysis in C++",
          author: "Mark Allen Weiss",
          cover: 'https://m.media-amazon.com/images/I/51+Z+1yBhJL._SX342_SY445_.jpg'
        }
      ],
      comments: [
        {
          id: 1,
          username: 'Reader A',
          date: '2024-03-15',
          rating: 5,
          content: 'This book is a must-have for any computer science student. The explanations are clear and detailed.'
        },
        {
          id: 2,
          username: 'Reader B',
          date: '2024-03-14',
          rating: 4,
          content: 'Great resource for understanding complex algorithms. Highly recommended!'
        }
      ],
      commentDialogVisible: false,
      newComment: {
        rating: 0,
        content: ''
      },
      commentRules: {
        rating: [
          { required: true, message: this.$t('bookDetail.ratingRequired'), trigger: 'change' }
        ],
        content: [
          { required: true, message: this.$t('bookDetail.commentRequired'), trigger: 'blur' },
          { min: 10, message: this.$t('bookDetail.commentMinLength'), trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    async borrowBook() {
      if (!auth.isLoggedIn) {
        ElMessage.warning(this.$t('common.loginRequired'));
        this.$router.push('/login');
        return;
      }

      try {
        await ElMessageBox.confirm(
          this.$t('bookDetail.borrowConfirm'),
          this.$t('bookDetail.borrowConfirmationTitle'),
          {
            confirmButtonText: this.$t('common.confirm'),
            cancelButtonText: this.$t('common.cancel'),
            type: 'info'
          }
        );
        // 这里添加借阅的API调用
        ElMessage.success(this.$t('bookDetail.borrowSuccess'));
      } catch {
        ElMessage.info(this.$t('bookDetail.borrowCancel'));
      }
    },
    addToWishlist() {
      if (!auth.isLoggedIn) {
        ElMessage.warning(this.$t('common.loginRequired'));
        this.$router.push('/login');
        return;
      }
      ElMessage.success(this.$t('bookDetail.addToWishlistSuccess'));
    },
    goToBookDetail(bookId) {
      this.$router.push(`/book/${bookId}`);
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
          ElMessage.success(this.$t('bookDetail.commentSubmitSuccess'));
          this.commentDialogVisible = false;
          this.newComment = {
            rating: 0,
            content: ''
          };
        }
      });
    }
  },
  created() {
    // Add API call to fetch book details here
    const bookId = this.$route.params.id;
    // fetchBookDetails(bookId);
  }
};
</script>

<style scoped>
.book-detail {
  padding: 20px;
  animation: fadeIn 0.8s ease-out;
}

.book-cover-card {
  text-align: center;
  animation: slideInUp 0.8s ease-out 0.2s both;
}

.book-cover {
  width: 100%;
  max-width: 300px;
  height: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.book-cover:hover {
  transform: scale(1.05);
}

.book-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.book-actions .el-button {
  border: none;
  color: white;
  font-size: 16px;
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.book-actions .el-button:hover {
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

.similar-books-card {
  margin-top: 20px;
  margin-bottom: 20px;
  animation: slideInUp 0.8s ease-out 0.2s both;
}

.similar-books-header h3 {
  font-size: 1.5rem;
  color: #303133;
  margin-bottom: 10px;
}

.similar-books-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.similar-book-item {
  display: flex;
  align-items: center;
}

.similar-book-cover {
  width: 60px;
  height: 80px;
  object-fit: cover;
  margin-right: 10px;
  border-radius: 4px;
}

.similar-book-info {
  display: flex;
  flex-direction: column;
}

.similar-book-title {
  font-size: 1rem;
  color: #303133;
  margin: 0;
}

.similar-book-author {
  font-size: 0.9rem;
  color: #606266;
  margin: 0;
}

.book-info-card {
  margin-bottom: 20px;
  animation: slideInUp 0.8s ease-out 0.4s both;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.book-title {
  font-size: 2.2rem;
  color: #1a365d;
  margin-bottom: 25px;
  position: relative;
  padding-bottom: 10px;
}

.book-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: #409eff;
  border-radius: 2px;
}

.book-meta {
  color: #4a5568;
  line-height: 1.8;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
}

.book-meta p {
  margin: 12px 0;
  display: flex;
  align-items: center;
  font-size: 1.05rem;
}

.book-meta i {
  margin-right: 12px;
  font-size: 1.2rem;
  color: #409eff;
  min-width: 24px;
  text-align: center;
}

.book-description {
  margin: 20px 0;
}

.book-description h3 {
  font-size: 1.5rem;
  color: #303133;
  margin-bottom: 10px;
  font-weight: bold;
}

.book-status h3 {
  font-size: 1.5rem;
  color: #303133;
  margin-bottom: 10px;
  font-weight: bold;
}

.book-status .el-descriptions {
  animation: fadeIn 0.8s ease-out;
}

.book-status .el-descriptions__body {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.book-status .el-descriptions__label {
  background-color: #f5f7fa;
  font-weight: bold;
  padding: 12px 15px;
}

.book-status .el-descriptions__content {
  padding: 12px 15px;
}

.book-status .el-descriptions__label,
.book-status .el-descriptions__content {
  transition: background-color 0.3s ease;
}

.book-status .el-descriptions__row:hover .el-descriptions__label,
.book-status .el-descriptions__row:hover .el-descriptions__content {
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
  .similar-book-item {
    flex-direction: column;
    text-align: center;
  }

  .similar-book-cover {
    width: 100%;
    max-width: 150px;
    height: auto;
    margin: 0 auto 10px;
  }

  .similar-book-info {
    text-align: center;
  }
}

@media (max-width: 480px) {
  .similar-books-header h3 {
    font-size: 1.2rem;
  }

  .similar-book-title {
    font-size: 0.95rem;
  }

  .similar-book-author {
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
<template>
  <div class="book-detail">
    <el-row :gutter="20">
      <!-- Left side book information -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card class="book-cover-card">
          <img :src="book.cover" class="book-cover" alt="Book cover" />
          <div class="book-actions">
            <el-button type="primary" :disabled="!book.available" @click="borrowBook">
              {{ book.available ? 'Borrow' : 'Borrowed' }}
            </el-button>
            <el-button type="info" @click="addToWishlist">
              Add to Wishlist
            </el-button>
          </div>
        </el-card>
      </el-col>

      <!-- Right side detailed information -->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <el-card class="book-info-card">
          <h1 class="book-title">{{ book.title }}</h1>
          <div class="book-meta">
            <p class="author"><i class="el-icon-user"></i> Author: {{ book.author }}</p>
            <p class="publisher"><i class="el-icon-office-building"></i> Publisher: {{ book.publisher }}</p>
            <p class="isbn"><i class="el-icon-document"></i> ISBN: {{ book.isbn }}</p>
            <p class="publish-date"><i class="el-icon-date"></i> Publication Date: {{ book.publishDate }}</p>
            <p class="category"><i class="el-icon-collection-tag"></i> Category: {{ book.category }}</p>
            <div class="rating">
              <span>Rating: </span>
              <el-rate v-model="book.rating" disabled show-score />
            </div>
          </div>

          <el-divider></el-divider>

          <div class="book-description">
            <h3>Book Description</h3>
            <p>{{ book.description }}</p>
          </div>

          <el-divider></el-divider>

          <div class="book-status">
            <h3>Library Information</h3>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="Location">{{ book.location }}</el-descriptions-item>
              <el-descriptions-item label="Call Number">{{ book.callNumber }}</el-descriptions-item>
              <el-descriptions-item label="Available Copies">{{ book.availableCopies }}</el-descriptions-item>
              <el-descriptions-item label="Total Copies">{{ book.totalCopies }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>

        <!-- Comments section -->
        <el-card class="comments-card">
          <template #header>
            <div class="comments-header">
              <h3>Reader Comments</h3>
              <el-button type="primary" size="small" @click="showCommentDialog">
                Write a Comment
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
      title="Write a Comment"
      width="50%"
    >
      <el-form :model="newComment" ref="commentForm" :rules="commentRules">
        <el-form-item label="Rating" prop="rating">
          <el-rate v-model="newComment.rating" />
        </el-form-item>
        <el-form-item label="Comment" prop="content">
          <el-input
            v-model="newComment.content"
            type="textarea"
            :rows="4"
            placeholder="Please share your thoughts about the book..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="commentDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitComment">Submit</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus'
import { auth } from '@/utils/auth.js'

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
          { required: true, message: 'Please provide a rating', trigger: 'change' }
        ],
        content: [
          { required: true, message: 'Please enter your comment', trigger: 'blur' },
          { min: 10, message: 'Comment must be at least 10 characters', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async borrowBook() {
      if (!auth.isLoggedIn) {
        ElMessage.warning('Please log in first')
        this.$router.push('/login')
        return
      }

      try {
        await ElMessageBox.confirm(
          'Are you sure you want to borrow this book?',
          'Borrow Confirmation',
          {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'info'
          }
        )
        // 这里添加借阅的API调用
        ElMessage.success('Borrowed successfully')
      } catch {
        ElMessage.info('Borrowing cancelled')
      }
    },
    addToWishlist() {
      if (!auth.isLoggedIn) {
        ElMessage.warning('Please log in first')
        this.$router.push('/login')
        return
      }
      ElMessage.success('Added to your wishlist')
    },
    showCommentDialog() {
      if (!auth.isLoggedIn) {
        ElMessage.warning('Please log in first')
        this.$router.push('/login')
        return
      }
      this.commentDialogVisible = true
    },
    submitComment() {
      this.$refs.commentForm.validate((valid) => {
        if (valid) {
          // Add API call to submit the comment here
          ElMessage.success('Comment submitted successfully')
          this.commentDialogVisible = false
          this.newComment = {
            rating: 0,
            content: ''
          }
        }
      })
    }
  },
  created() {
    // Add API call to fetch book details here
    const bookId = this.$route.params.id
    // fetchBookDetails(bookId)
  }
}
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

.book-info-card {
  margin-bottom: 20px;
  animation: slideInUp 0.8s ease-out 0.4s both;
}

.book-title {
  font-size: 2rem;
  color: #303133;
  margin-bottom: 20px;
}

.book-meta {
  color: #606266;
  line-height: 1.8;
}

.book-meta p {
  margin: 10px 0;
}

.book-meta i {
  margin-right: 8px;
}

.book-description {
  margin: 20px 0;
}

.book-description h3 {
  font-size: 1.5rem;
  color: #303133;
  margin-bottom: 10px;
}

.book-status h3 {
  font-size: 1.5rem;
  color: #303133;
  margin-bottom: 10px;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .book-status .el-descriptions__label,
  .book-status .el-descriptions__content {
    padding: 8px 10px;
  }

  .comments-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .comments-header h3 {
    margin-bottom: 10px;
  }

  .comment-item {
    padding: 10px;
  }

  .comment-header {
    flex-wrap: wrap;
  }

  .username, .comment-date {
    width: 100%;
    margin-bottom: 5px;
  }
}


.comment-item:nth-child(1) { animation-delay: 0.1s; }
.comment-item:nth-child(2) { animation-delay: 0.2s; }
.comment-item:nth-child(3) { animation-delay: 0.3s; }
.comment-item:nth-child(4) { animation-delay: 0.4s; }
.comment-item:nth-child(5) { animation-delay: 0.5s; }
</style> 
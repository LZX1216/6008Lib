<template>
  <div class="book-detail">
    <el-row :gutter="20">
      <!-- Left side book information -->
      <el-col :span="8">
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
      <el-col :span="16">
        <el-card class="book-info-card">
          <h1>{{ book.title }}</h1>
          <div class="book-meta">
            <p class="author">Author: {{ book.author }}</p>
            <p class="publisher">Publisher: {{ book.publisher }}</p>
            <p class="isbn">ISBN: {{ book.isbn }}</p>
            <p class="publish-date">Publication Date: {{ book.publishDate }}</p>
            <p class="category">Category: {{ book.category }}</p>
            <div class="rating">
              <span>Rating: </span>
              <el-rate v-model="book.rating" disabled show-score />
            </div>
          </div>

          <el-divider />

          <div class="book-description">
            <h3>Book Description</h3>
            <p>{{ book.description }}</p>
          </div>

          <el-divider />

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
        title: 'The Three-Body Problem',
        author: 'Cixin Liu',
        publisher: 'Chongqing Publishing House',
        isbn: '9787536692930',
        publishDate: '2008-01-01',
        category: 'Science Fiction',
        cover: 'https://img3.doubanio.com/view/subject/m/public/s29517429.jpg',
        rating: 4.8,
        description: 'During the Cultural Revolution, a chance event leads Ye Wenjie, a female professor of astrophysics at Nanjing University, to become an observer at the military\'s top-secret radar base "Red Coast Project", thus unveiling the three-hundred-year entanglement between Earth civilization and the Three-Body civilization.',
        location: 'Science Fiction Section',
        callNumber: 'I247.55/L783',
        availableCopies: 2,
        totalCopies: 5,
        available: true
      },
      comments: [
        {
          id: 1,
          username: 'Reader A',
          date: '2024-03-15',
          rating: 5,
          content: 'A fascinating sci-fi novel that makes you think deeply.'
        },
        {
          id: 2,
          username: 'Reader B',
          date: '2024-03-14',
          rating: 4,
          content: 'Ingenious concept with a tight plot.'
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
}

.book-cover-card {
  text-align: center;
}

.book-cover {
  width: 100%;
  max-width: 300px;
  height: auto;
}

.book-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.book-info-card {
  margin-bottom: 20px;
}

.book-meta {
  color: #666;
  line-height: 1.8;
}

.book-description {
  margin: 20px 0;
}

.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-item {
  padding: 15px 0;
  border-bottom: 1px solid #EBEEF5;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.username {
  font-weight: bold;
}

.comment-date {
  color: #999;
  font-size: 12px;
}

.comment-rating {
  margin: 5px 0;
}

.comment-content {
  margin: 10px 0;
  color: #666;
}
</style> 
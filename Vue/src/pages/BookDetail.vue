<template>
  <div class="book-detail">
    <el-row :gutter="24">
      <!-- Left side book information -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <div class="book-cover-container">
          <img :src="book.cover" class="book-cover" alt="Book cover" />
          <div class="book-actions">
            <el-button type="primary" :disabled="!book.available" @click="borrowBook">
              {{ book.available ? $t('bookDetail.borrow') : $t('bookDetail.unavailable') }}
            </el-button>
            <el-button type="default" @click="addToWishlist">
              {{$t('bookDetail.addToList')}}
            </el-button>
          </div>
          <div class="rating">
            <el-rate v-model="book.rating" disabled show-score/>
          </div>
        </div>

        <!-- Similar Books Section -->
        <div class="similar-books-card">
          <div class="card-header">
            <h3>{{ $t('bookDetail.similarBooksTitle') }}</h3>
          </div>

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
          </div>
      </el-col>

      <!-- Right side detailed information -->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <div class="book-info-card">
          <h1 class="book-title">{{ book.title }}</h1>
          <div class="book-meta">
            <p class="author"><i class="el-icon-user"></i> {{ $t('book.author') }}: {{ book.author }}</p>
            <p class="publisher"><i class="el-icon-office-building"></i> {{ $t('book.publisher') }}: {{ book.publisher }}</p>
            <p class="isbn"><i class="el-icon-document"></i> {{ $t('book.isbn') }}: {{ book.isbn }}</p>
            <p class="publish-date"><i class="el-icon-date"></i> {{ $t('book.publishDate') }}: {{ book.publishDate }}</p>
            <p class="category"><i class="el-icon-collection-tag"></i> {{ $t('book.category') }}: {{ book.category }}</p>
          </div>

          <div class="section-divider"></div>

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
        </div>

        <!-- Comments section -->
        <div class="comments-card">
          <div class="card-header">
            <h3>{{ $t('bookDetail.commentsTitle') }}</h3>
            <el-button type="primary" plain @click="showCommentDialog">
              {{ $t('bookDetail.writeCommentTitle') }}
            </el-button>
          </div>

          <div class="comments-list">
            <div v-for="comment in comments" :key="comment.id" class="comment-item">
              <div class="comment-header">
                <el-avatar :size="36">{{ comment.username.charAt(0) }}</el-avatar>
                <div class="comment-user-info">
                  <span class="username">{{ comment.username }}</span>
                  <span class="comment-date">{{ comment.date }}</span>
                </div>
              </div>
              <div class="comment-rating">
                <el-rate v-model="comment.rating" disabled />
              </div>
              <p class="comment-content">{{ comment.content }}</p>
            </div>
          </div>
        </div>
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
import axios from "axios";

export default {
  name: 'BookDetail',
  data() {
    return {
      book: {
        // id: 1,
        // title: 'Introduction to Algorithms',
        // author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
        // publisher: 'The MIT Press',
        // isbn: '9780262033848',
        // publishDate: '2000-01-01',
        // category: 'Algorithms',
        // cover: 'https://m.media-amazon.com/images/I/61Mw06x2XcL._AC_UL320_.jpg',
        // rating: 4.5,
        // description: 'A comprehensive introduction to the modern study of computer algorithms. It presents many algorithms and covers them in considerable depth, yet makes their design and analysis accessible to all levels of readers.',
        // location: 'Computer Science Section',
        // callNumber: 'QA76.6.I5858',
        // availableCopies: 3,
        // totalCopies: 5,
        // available: true
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
        // {
        //   id: 1,
        //   username: 'Reader A',
        //   date: '2025-03-15',
        //   rating: 5,
        //   content: 'This book is a must-have for any computer science student. The explanations are clear and detailed.'
        // },
        // {
        //   id: 2,
        //   username: 'Reader B',
        //   date: '2025-03-14',
        //   rating: 4,
        //   content: 'Great resource for understanding complex algorithms. Highly recommended!'
        // }
      ],
      commentDialogVisible: false,
      newComment: {
        rating: 0,
        content: ''
      },
      commentRules: {
        rating: [
          {required: true, message: this.$t('bookDetail.ratingRequired'), trigger: 'change'}
        ],
        content: [
          {required: true, message: this.$t('bookDetail.commentRequired'), trigger: 'blur'},
          {min: 10, message: this.$t('bookDetail.commentMinLength'), trigger: 'blur'}
        ]
      }
    };
  },
  created() {
    // Add API call to fetch book details here
    const bookId = this.$route.params.id;
    // fetchBookDetails(bookId);
    // Add API call to fetch book details here
    this.fetchBookDetails(bookId)
    this.fetchCommentDetails(bookId)
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
    // submitComment() {
    //   this.$refs.commentForm.validate((valid) => {
    //     if (valid) {
    //       // Add API call to submit the comment here
    //       ElMessage.success(this.$t('bookDetail.commentSubmitSuccess'));
    //       this.commentDialogVisible = false;
    //       this.newComment = {
    //         rating: 0,
    //         content: ''
    //       };
    //     }
    //   });
    // }
    submitComment() {
      if (!auth.isLoggedIn) {
        ElMessage.warning(this.$t('common.loginRequired'));
        this.$router.push('/login')
        return
      }
      this.$refs.commentForm.validate(async (valid) => {

        if (valid) {
          const bookId = this.$route.params.id
          const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
          const token = userInfo.token
          console.log(userInfo)
          console.log(userInfo.id)
          console.log(token)
          await this.axios({
            url: 'http://localhost:8080/book/submitComment',
            method: 'POST',
            headers: {
              "token": token,// 请求头
              "Content-Type": "application/json",

            },
            data: {
              bookId: bookId,
              content: this.newComment.content,
              rating: this.newComment.rating,
              create_User: userInfo.id,
              update_User: userInfo.id,


            }
          })
          console.log(token)

          this.fetchBookDetails(bookId)
          this.fetchCommentDetails(bookId)
          // Add API call to submit the comment here
          ElMessage.success(this.$t('bookDetail.commentSubmitSuccess'));
          this.commentDialogVisible = false
          this.newComment = {
            rating: 0,
            content: ''
          }
        }
      })
    },
    fetchBookDetails(bookId) {
      axios.get(`http://localhost:8080/book/id/${bookId}`) // Make sure this URL is correct
          .then(response => {
            this.book = response.data; // Assuming the returned data is an array of books
          })
          .catch(error => {
            console.error('Failed to books:', error);
          });

    },
    fetchCommentDetails(bookId) {
      axios.get(`http://localhost:8080/book/comment/${bookId}`) // Make sure this URL is correct
          .then(response => {
            this.comments = response.data; // Assuming the returned data is an array of books
          })
          .catch(error => {
            console.error('Failed to books:', error);
          });


    },
  }
}
</script>

<style scoped>
.book-detail {
  padding: 30px 20px;
  max-width: 1400px;
  margin: 0 auto;
  color: #333;
  font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
}

/* Book Cover Section */
.book-cover-container {
  background-color: #fff;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.book-cover-container:hover {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.book-cover {
  width: 100%;
  max-width: 260px;
  height: auto;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  margin: 0 auto 24px;
  display: block;
  transition: transform 0.4s ease;
}

.book-cover:hover {
  transform: scale(1.03);
}

.book-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  justify-content: center;
}

.book-actions .el-button {
  flex: 1;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
  max-width: 45%;
}

.book-actions .el-button--primary {
  background: linear-gradient(135deg, #4771d0, #3756a4);
  border: none;
  box-shadow: 0 4px 10px rgba(71, 113, 208, 0.3);
}

.book-actions .el-button--primary:hover {
  background: linear-gradient(135deg, #5080e0, #4265b3);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(71, 113, 208, 0.4);
}

.book-actions .el-button--default {
  border: 1px solid #e0e0e0;
  color: #666;
  background: #fff;
}

.book-actions .el-button--default:hover {
  border-color: #4771d0;
  color: #4771d0;
  background: #f8faff;
}

.rating {
  margin: 20px 0;
  text-align: center;
}

.similar-books-card {
  background-color: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.card-header h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.similar-books-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.similar-book-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 10px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.similar-book-item:hover {
  background-color: #f8faff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateX(4px);
}

.similar-book-cover {
  width: 70px;
  height: 100px;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-right: 16px;
}

.similar-book-info {
  flex: 1;
}

.similar-book-title {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  margin: 0 0 6px;
}

.similar-book-author {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

/* Book Info Section */
.book-info-card {
  background-color: #fff;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
}

.book-title {
  font-size: 2rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 24px;
  line-height: 1.3;
  letter-spacing: -0.5px;
}

.book-meta {
  background-color: #f8faff;
  border-radius: 12px;
  padding: 20px;
}

.book-meta p {
  margin: 12px 0;
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: #444;
}

.book-meta i {
  margin-right: 12px;
  color: #4771d0;
  font-size: 1.1rem;
}

.section-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #e0e0e0, transparent);
  margin: 30px 0;
}

.book-description h3, .book-status h3 {
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.book-description p {
  font-size: 1.05rem;
  line-height: 1.7;
  color: #444;
}

/* Library Info */
:deep(.el-descriptions__body) {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

:deep(.el-descriptions__label) {
  background-color: #f5f7fa;
  padding: 14px 16px;
  font-weight: 500;
  color: #444;
}

:deep(.el-descriptions__content) {
  padding: 14px 16px;
  color: #666;
}

/* Comments Section */
.comments-card {
  background-color: #fff;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
}

.comments-list {
  max-height: 500px;
  overflow-y: auto;
  padding-right: 8px;
}

.comments-list::-webkit-scrollbar {
  width: 6px;
}

.comments-list::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 10px;
}

.comments-list::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 10px;
}

.comment-item {
  padding: 18px;
  margin-bottom: 16px;
  border-radius: 12px;
  background-color: #f8faff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.comment-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.comment-user-info {
  display: flex;
  flex-direction: column;
  margin-left: 12px;
}

.username {
  font-weight: 600;
  color: #333;
  font-size: 1rem;
}

.comment-date {
  color: #888;
  font-size: 0.85rem;
}

.comment-rating {
  margin: 10px 0;
}

.comment-content {
  color: #444;
  line-height: 1.6;
  font-size: 1rem;
  margin-top: 10px;
}

/* Dialog */
:deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  background-color: #f8faff;
  padding: 20px 24px;
}

:deep(.el-dialog__title) {
  font-weight: 600;
  color: #333;
}

:deep(.el-dialog__body) {
  padding: 24px;
}

:deep(.el-textarea__inner) {
  border-radius: 8px;
  padding: 12px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .book-detail {
    padding: 20px 16px;
  }

  .book-cover-container, .book-info-card, .comments-card, .similar-books-card {
    padding: 20px;
    border-radius: 14px;
  }

  .book-title {
    font-size: 1.6rem;
  }

  .book-actions {
    flex-direction: column;
    gap: 10px;
  }

  .book-actions .el-button {
    max-width: 100%;
  }

  .comment-item {
    padding: 15px;
  }
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.book-cover-container, .book-info-card, .comments-card, .similar-books-card {
  animation: fadeIn 0.6s ease-out;
}

.comment-item {
  animation: fadeIn 0.4s ease-out;
}
</style>
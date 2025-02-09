<template>
  <div class="book-detail">
    <el-row :gutter="20">
      <!-- 左侧图书信息 -->
      <el-col :span="8">
        <el-card class="book-cover-card">
          <img :src="book.cover" class="book-cover" alt="书籍封面" />
          <div class="book-actions">
            <el-button type="primary" :disabled="!book.available" @click="borrowBook">
              {{ book.available ? '借阅' : '已借出' }}
            </el-button>
            <el-button type="info" @click="addToWishlist">
              加入书单
            </el-button>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧详细信息 -->
      <el-col :span="16">
        <el-card class="book-info-card">
          <h1>{{ book.title }}</h1>
          <div class="book-meta">
            <p class="author">作者：{{ book.author }}</p>
            <p class="publisher">出版社：{{ book.publisher }}</p>
            <p class="isbn">ISBN：{{ book.isbn }}</p>
            <p class="publish-date">出版日期：{{ book.publishDate }}</p>
            <p class="category">分类：{{ book.category }}</p>
            <div class="rating">
              <span>评分：</span>
              <el-rate v-model="book.rating" disabled show-score />
            </div>
          </div>

          <el-divider />

          <div class="book-description">
            <h3>内容简介</h3>
            <p>{{ book.description }}</p>
          </div>

          <el-divider />

          <div class="book-status">
            <h3>馆藏信息</h3>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="馆藏位置">{{ book.location }}</el-descriptions-item>
              <el-descriptions-item label="索书号">{{ book.callNumber }}</el-descriptions-item>
              <el-descriptions-item label="在馆数量">{{ book.availableCopies }}</el-descriptions-item>
              <el-descriptions-item label="总藏书量">{{ book.totalCopies }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>

        <!-- 评论区 -->
        <el-card class="comments-card">
          <template #header>
            <div class="comments-header">
              <h3>读者评论</h3>
              <el-button type="primary" size="small" @click="showCommentDialog">
                写评论
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

    <!-- 评论对话框 -->
    <el-dialog
      v-model="commentDialogVisible"
      title="写评论"
      width="50%"
    >
      <el-form :model="newComment" ref="commentForm" :rules="commentRules">
        <el-form-item label="评分" prop="rating">
          <el-rate v-model="newComment.rating" />
        </el-form-item>
        <el-form-item label="评论内容" prop="content">
          <el-input
            v-model="newComment.content"
            type="textarea"
            :rows="4"
            placeholder="请分享您的读书感受..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="commentDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitComment">提交</el-button>
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
        title: '三体',
        author: '刘慈欣',
        publisher: '重庆出版社',
        isbn: '9787536692930',
        publishDate: '2008-01-01',
        category: '科幻小说',
        cover: 'https://img3.doubanio.com/view/subject/m/public/s29517429.jpg',
        rating: 4.8,
        description: '文化大革命期间，一次偶然的机会，南京大学天体物理系女教授叶文洁成为了军方绝密雷达基地"红岸工程"的观察员，由此揭开了地球文明与三体文明三百年的恩怨情仇。',
        location: '科幻小说区',
        callNumber: 'I247.55/L783',
        availableCopies: 2,
        totalCopies: 5,
        available: true
      },
      comments: [
        {
          id: 1,
          username: '读者A',
          date: '2024-03-15',
          rating: 5,
          content: '非常精彩的科幻小说，让人深思。'
        },
        {
          id: 2,
          username: '读者B',
          date: '2024-03-14',
          rating: 4,
          content: '构思巧妙，情节紧凑。'
        }
      ],
      commentDialogVisible: false,
      newComment: {
        rating: 0,
        content: ''
      },
      commentRules: {
        rating: [
          { required: true, message: '请给出评分', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入评论内容', trigger: 'blur' },
          { min: 10, message: '评论内容不能少于10个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async borrowBook() {
      if (!auth.isLoggedIn) {
        ElMessage.warning('请先登录')
        this.$router.push('/login')
        return
      }

      try {
        await ElMessageBox.confirm(
          '确定要借阅这本书吗？',
          '借阅确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }
        )
        // 这里添加借阅的API调用
        ElMessage.success('借阅成功')
      } catch {
        ElMessage.info('已取消借阅')
      }
    },
    addToWishlist() {
      if (!auth.isLoggedIn) {
        ElMessage.warning('请先登录')
        this.$router.push('/login')
        return
      }
      ElMessage.success('已添加到书单')
    },
    showCommentDialog() {
      if (!auth.isLoggedIn) {
        ElMessage.warning('请先登录')
        this.$router.push('/login')
        return
      }
      this.commentDialogVisible = true
    },
    submitComment() {
      this.$refs.commentForm.validate((valid) => {
        if (valid) {
          // 这里添加提交评论的API调用
          ElMessage.success('评论提交成功')
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
    // 这里添加获取图书详情的API调用
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
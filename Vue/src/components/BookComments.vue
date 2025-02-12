<template>
  <div class="book-comments">
    <!-- Rating Statistics -->
    <div class="rating-stats">
      <div class="average-rating">
        <h3>Overall Rating</h3>
        <div class="rating-number">{{ averageRating }}</div>
        <el-rate
          v-model="averageRating"
          disabled
          show-score
          text-color="#ff9900"
        />
        <div class="total-ratings">{{ totalRatings }} ratings</div>
      </div>
      <div class="rating-distribution">
        <div v-for="(count, stars) in ratingDistribution"
          :key="stars"
          class="rating-bar"
        >
          <span class="stars">{{ stars }} stars</span>
          <el-progress 
            :percentage="(count / totalRatings) * 100"
            :stroke-width="12"
            :show-text="false"
          />
          <span class="count">{{ count }}</span>
        </div>
      </div>
    </div>

    <!-- Comment Input -->
    <div v-if="auth.isLoggedIn" class="comment-input">
      <h3>Write a Comment</h3>
      <el-form :model="commentForm" ref="commentForm" :rules="rules">
        <el-form-item prop="rating">
          <el-rate
            v-model="commentForm.rating"
            show-text
            :texts="['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent']"
          />
        </el-form-item>
        <el-form-item prop="content">
          <el-input
            v-model="commentForm.content"
            type="textarea"
            :rows="4"
            placeholder="Share your thoughts about the book..."
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitComment">
            Post Comment
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-else class="login-tip">
      <el-alert
        title="Please log in to post a comment"
        type="info"
        :closable="false"
      >
        <template #default>
          <router-link to="/login">Go to Login</router-link>
        </template>
      </el-alert>
    </div>

    <!-- Comments List -->
    <div class="comments-list">
      <h3>All Comments ({{ comments.length }})</h3>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="Latest" name="latest">
          <div v-if="comments.length === 0" class="no-comments">
            No comments yet. Be the first to comment!
          </div>
          <div v-else>
            <div v-for="comment in sortedComments"
              :key="comment.id"
              class="comment-item"
            >
              <div class="comment-header">
                <el-avatar :src="comment.userAvatar" :size="40">
                  {{ comment.username.charAt(0) }}
                </el-avatar>
                <div class="comment-info">
                  <div class="username">{{ comment.username }}</div>
                  <el-rate
                    v-model="comment.rating"
                    disabled
                    :size="12"
                  />
                </div>
                <div class="comment-time">{{ formatDate(comment.createTime) }}</div>
              </div>
              <div class="comment-content">{{ comment.content }}</div>
              <div class="comment-actions">
                <el-button
                  type="text"
                  size="small"
                  @click="likeComment(comment)"
                >
                  <el-icon><ThumbsUp /></el-icon>
                  {{ comment.likes }}
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="replyComment(comment)"
                >
                  Reply
                </el-button>
                <el-button
                  v-if="canDelete(comment)"
                  type="text"
                  size="small"
                  @click="deleteComment(comment)"
                >
                  Delete
                </el-button>
              </div>
              <!-- Replies List -->
              <div v-if="comment.replies && comment.replies.length > 0"
                class="replies"
              >
                <div v-for="reply in comment.replies"
                  :key="reply.id"
                  class="reply-item"
                >
                  <div class="reply-header">
                    <el-avatar :src="reply.userAvatar" :size="30">
                      {{ reply.username.charAt(0) }}
                    </el-avatar>
                    <div class="reply-info">
                      <span class="username">{{ reply.username }}</span>
                      <span class="reply-to">replied to</span>
                      <span class="username">{{ reply.replyTo }}</span>
                    </div>
                    <div class="reply-time">{{ formatDate(reply.createTime) }}</div>
                  </div>
                  <div class="reply-content">{{ reply.content }}</div>
                </div>
              </div>
              <!-- Reply Input -->
              <div v-if="showReplyInput === comment.id" class="reply-input">
                <el-input
                  v-model="replyContent"
                  type="textarea"
                  :rows="2"
                  placeholder="Write your reply..."
                >
                  <template #append>
                    <el-button @click="submitReply(comment)">Reply</el-button>
                  </template>
                </el-input>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Most Popular" name="hot">
          <!-- Comments list sorted by likes -->
        </el-tab-pane>
      </el-tabs>

      <!-- Pagination -->
      <div class="pagination">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          @update:current-page="currentPage = $event"
          @update:page-size="pageSize = $event"
          :total="total"
          layout="prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus'
import { ThumbsUp } from '@element-plus/icons-vue'
import { auth } from '@/utils/auth.js'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export default {
  name: 'BookComments',
  components: {
    ThumbsUp
  },
  props: {
    bookId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      auth,
      averageRating: 4.5,
      totalRatings: 128,
      ratingDistribution: {
        5: 80,
        4: 30,
        3: 10,
        2: 5,
        1: 3
      },
      commentForm: {
        rating: 5,
        content: ''
      },
      rules: {
        rating: [
          { required: true, message: 'Please select a rating', trigger: 'change' }
        ],
        content: [
          { required: true, message: 'Please enter comment content', trigger: 'blur' },
          { min: 10, message: 'Comment content must be at least 10 characters', trigger: 'blur' }
        ]
      },
      activeTab: 'latest',
      comments: [
        {
          id: 1,
          username: 'Reader A',
          userAvatar: '/avatars/1.jpg',
          rating: 5,
          content: 'This book is really great! Highly recommended!',
          createTime: '2024-03-15 14:30:00',
          likes: 12,
          replies: [
            {
              id: 101,
              username: 'Reader B',
              userAvatar: '/avatars/2.jpg',
              replyTo: 'Reader A',
              content: 'I agree, I like this book too',
              createTime: '2024-03-15 15:00:00'
            }
          ]
        }
      ],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      showReplyInput: null,
      replyContent: ''
    }
  },
  computed: {
    sortedComments() {
      if (this.activeTab === 'latest') {
        return [...this.comments].sort((a, b) => 
          new Date(b.createTime) - new Date(a.createTime)
        )
      } else {
        return [...this.comments].sort((a, b) => b.likes - a.likes)
      }
    }
  },
  methods: {
    async submitComment() {
      try {
        await this.$refs.commentForm.validate()
        // Call API to post comment
        // await addCommentApi({
        //   bookId: this.bookId,
        //   ...this.commentForm
        // })
        ElMessage.success('Comment posted successfully')
        this.commentForm.content = ''
        this.fetchComments()
      } catch (error) {
        console.error(error)
      }
    },
    async likeComment(comment) {
      if (!auth.isLoggedIn) {
        ElMessage.warning('Please log in first')
        return
      }
      // Call API to like
      // await likeCommentApi(comment.id)
      comment.likes++
    },
    replyComment(comment) {
      if (!auth.isLoggedIn) {
        ElMessage.warning('Please log in first')
        return
      }
      this.showReplyInput = comment.id
    },
    async submitReply(comment) {
      if (!this.replyContent.trim()) {
        ElMessage.warning('Please enter reply content')
        return
      }
      // Call API to post reply
      // await addReplyApi({
      //   commentId: comment.id,
      //   content: this.replyContent
      // })
      ElMessage.success('Reply submitted successfully')
      this.showReplyInput = null
      this.replyContent = ''
      this.fetchComments()
    },
    async deleteComment(comment) {
      try {
        await ElMessageBox.confirm(
          'Are you sure you want to delete this comment?',
          'Prompt',
          {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        )
        // Call API to delete comment
        // await deleteCommentApi(comment.id)
        ElMessage.success('Deleted successfully')
        this.fetchComments()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('Delete failed')
        }
      }
    },
    canDelete(comment) {
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      return userInfo && (
        userInfo.id === comment.userId ||
        userInfo.role === 'admin'
      )
    },
    formatDate(date) {
      return dayjs(date).fromNow()
    },
    handlePageChange(val) {
      this.currentPage = val
      this.fetchComments()
    },
    fetchComments() {
      // Implement logic to fetch comment list
      console.log('Fetching comment list')
    }
  },
  created() {
    this.fetchComments()
  }
}
</script>

<style scoped>
.book-comments {
  padding: 20px;
}

.rating-stats {
  display: flex;
  gap: 40px;
  margin-bottom: 30px;
}

.average-rating {
  text-align: center;
}

.rating-number {
  font-size: 36px;
  font-weight: bold;
  color: #ff9900;
  margin: 10px 0;
}

.total-ratings {
  color: #909399;
  font-size: 14px;
}

.rating-distribution {
  flex: 1;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.stars {
  width: 40px;
  text-align: right;
}

.count {
  width: 40px;
  color: #909399;
}

.comment-input {
  margin: 30px 0;
}

.comments-list {
  margin-top: 30px;
}

.comment-item {
  padding: 20px 0;
  border-bottom: 1px solid #ebeef5;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.comment-info {
  flex: 1;
}

.username {
  font-weight: bold;
  margin-bottom: 5px;
}

.comment-time {
  color: #909399;
  font-size: 12px;
}

.comment-content {
  margin: 10px 0;
  line-height: 1.6;
}

.comment-actions {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.replies {
  margin: 15px 0 15px 50px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 4px;
}

.reply-item {
  margin-bottom: 15px;
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.reply-info {
  flex: 1;
}

.reply-to {
  color: #909399;
  margin: 0 5px;
}

.reply-content {
  margin-left: 38px;
  color: #606266;
}

.reply-input {
  margin: 15px 0 15px 50px;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

.login-tip {
  margin: 20px 0;
}
</style> 
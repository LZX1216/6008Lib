<template>
  <div class="book-comments">
    <!-- 评分统计 -->
    <div class="rating-stats">
      <div class="average-rating">
        <h3>总体评分</h3>
        <div class="rating-number">{{ averageRating }}</div>
        <el-rate
          v-model="averageRating"
          disabled
          show-score
          text-color="#ff9900"
        />
        <div class="total-ratings">{{ totalRatings }}人评分</div>
      </div>
      <div class="rating-distribution">
        <div v-for="(count, stars) in ratingDistribution" 
          :key="stars" 
          class="rating-bar"
        >
          <span class="stars">{{ stars }}星</span>
          <el-progress 
            :percentage="(count / totalRatings) * 100"
            :stroke-width="12"
            :show-text="false"
          />
          <span class="count">{{ count }}</span>
        </div>
      </div>
    </div>

    <!-- 评论输入 -->
    <div v-if="auth.isLoggedIn" class="comment-input">
      <h3>写评论</h3>
      <el-form :model="commentForm" ref="commentForm" :rules="rules">
        <el-form-item prop="rating">
          <el-rate
            v-model="commentForm.rating"
            show-text
            :texts="['很差', '较差', '一般', '较好', '很好']"
          />
        </el-form-item>
        <el-form-item prop="content">
          <el-input
            v-model="commentForm.content"
            type="textarea"
            :rows="4"
            placeholder="分享您的读书感受..."
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitComment">
            发表评论
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-else class="login-tip">
      <el-alert
        title="请登录后发表评论"
        type="info"
        :closable="false"
      >
        <template #default>
          <router-link to="/login">去登录</router-link>
        </template>
      </el-alert>
    </div>

    <!-- 评论列表 -->
    <div class="comments-list">
      <h3>全部评论 ({{ comments.length }})</h3>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="最新" name="latest">
          <div v-if="comments.length === 0" class="no-comments">
            暂无评论，快来发表第一条评论吧！
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
                  回复
                </el-button>
                <el-button 
                  v-if="canDelete(comment)"
                  type="text" 
                  size="small"
                  @click="deleteComment(comment)"
                >
                  删除
                </el-button>
              </div>
              <!-- 回复列表 -->
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
                      <span class="reply-to">回复</span>
                      <span class="username">{{ reply.replyTo }}</span>
                    </div>
                    <div class="reply-time">{{ formatDate(reply.createTime) }}</div>
                  </div>
                  <div class="reply-content">{{ reply.content }}</div>
                </div>
              </div>
              <!-- 回复输入框 -->
              <div v-if="showReplyInput === comment.id" class="reply-input">
                <el-input
                  v-model="replyContent"
                  type="textarea"
                  :rows="2"
                  placeholder="写下你的回复..."
                >
                  <template #append>
                    <el-button @click="submitReply(comment)">回复</el-button>
                  </template>
                </el-input>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="最热" name="hot">
          <!-- 按点赞数排序的评论列表 -->
        </el-tab-pane>
      </el-tabs>

      <!-- 分页 -->
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
import { ref } from 'vue'
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
          { required: true, message: '请选择评分', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入评论内容', trigger: 'blur' },
          { min: 10, message: '评论内容不能少于10个字符', trigger: 'blur' }
        ]
      },
      activeTab: 'latest',
      comments: [
        {
          id: 1,
          username: '读者A',
          userAvatar: '/avatars/1.jpg',
          rating: 5,
          content: '这本书真的很棒！强烈推荐！',
          createTime: '2024-03-15 14:30:00',
          likes: 12,
          replies: [
            {
              id: 101,
              username: '读者B',
              userAvatar: '/avatars/2.jpg',
              replyTo: '读者A',
              content: '同意，我也很喜欢这本书',
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
        // 调用API发表评论
        // await addCommentApi({
        //   bookId: this.bookId,
        //   ...this.commentForm
        // })
        ElMessage.success('评论发表成功')
        this.commentForm.content = ''
        this.fetchComments()
      } catch (error) {
        console.error(error)
      }
    },
    async likeComment(comment) {
      if (!auth.isLoggedIn) {
        ElMessage.warning('请先登录')
        return
      }
      // 调用API点赞
      // await likeCommentApi(comment.id)
      comment.likes++
    },
    replyComment(comment) {
      if (!auth.isLoggedIn) {
        ElMessage.warning('请先登录')
        return
      }
      this.showReplyInput = comment.id
    },
    async submitReply(comment) {
      if (!this.replyContent.trim()) {
        ElMessage.warning('请输入回复内容')
        return
      }
      // 调用API发表回复
      // await addReplyApi({
      //   commentId: comment.id,
      //   content: this.replyContent
      // })
      ElMessage.success('回复成功')
      this.showReplyInput = null
      this.replyContent = ''
      this.fetchComments()
    },
    async deleteComment(comment) {
      try {
        await ElMessageBox.confirm(
          '确定要删除这条评论吗？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        // 调用API删除评论
        // await deleteCommentApi(comment.id)
        ElMessage.success('删除成功')
        this.fetchComments()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('删除失败')
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
      // 实现获取评论列表的逻辑
      console.log('获取评论列表')
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
<template>
  <div class="user-center">
    <el-row :gutter="20">
      <!-- 左侧用户信息卡片 -->
      <el-col :span="6">
        <el-card class="user-info-card">
          <div class="user-avatar">
            <el-avatar :size="100">{{ userInfo.username.charAt(0).toUpperCase() }}</el-avatar>
          </div>
          <h2>{{ userInfo.username }}</h2>
          <p class="user-role">{{ userInfo.role === 'admin' ? '管理员' : '普通用户' }}</p>
          <el-divider />
          <div class="user-stats">
            <div class="stat-item">
              <h3>{{ borrowStats.current }}</h3>
              <p>当前借阅</p>
            </div>
            <div class="stat-item">
              <h3>{{ borrowStats.history }}</h3>
              <p>历史借阅</p>
            </div>
            <div class="stat-item">
              <h3>{{ borrowStats.overdue }}</h3>
              <p>逾期次数</p>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧内容区 -->
      <el-col :span="18">
        <!-- 借阅记录 -->
        <el-card class="content-card">
          <template #header>
            <div class="card-header">
              <h3>借阅记录</h3>
              <el-radio-group v-model="borrowFilter" size="small">
                <el-radio-button label="all">全部</el-radio-button>
                <el-radio-button label="current">当前借阅</el-radio-button>
                <el-radio-button label="history">历史记录</el-radio-button>
              </el-radio-group>
            </div>
          </template>

          <el-table :data="filteredBorrows" style="width: 100%">
            <el-table-column prop="bookTitle" label="书名" />
            <el-table-column prop="borrowDate" label="借阅日期" width="120" />
            <el-table-column prop="dueDate" label="应还日期" width="120" />
            <el-table-column prop="returnDate" label="实际归还日期" width="120" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="getBorrowStatusType(scope.row.status)">
                  {{ getBorrowStatusText(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button 
                  v-if="scope.row.status === 'borrowing'"
                  type="primary" 
                  size="small"
                  @click="renewBook(scope.row)"
                >
                  续借
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- 我的书单 -->
        <el-card class="content-card">
          <template #header>
            <div class="card-header">
              <h3>我的书单</h3>
              <el-button type="primary" size="small">添加图书</el-button>
            </div>
          </template>

          <el-table :data="wishlist" style="width: 100%">
            <el-table-column prop="bookTitle" label="书名" />
            <el-table-column prop="author" label="作者" />
            <el-table-column prop="addDate" label="添加日期" width="120" />
            <el-table-column prop="available" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.available ? 'success' : 'info'">
                  {{ scope.row.available ? '可借阅' : '已借出' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button 
                  type="primary" 
                  size="small"
                  :disabled="!scope.row.available"
                  @click="borrowBook(scope.row)"
                >
                  借阅
                </el-button>
                <el-button 
                  type="danger" 
                  size="small"
                  @click="removeFromWishlist(scope.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus'
import { auth } from '@/utils/auth.js'

export default {
  name: 'UserCenter',
  data() {
    return {
      userInfo: auth.userInfo || {},
      borrowFilter: 'all',
      borrowStats: {
        current: 2,
        history: 15,
        overdue: 0
      },
      borrows: [
        {
          id: 1,
          bookTitle: '三体',
          borrowDate: '2024-03-01',
          dueDate: '2024-04-01',
          returnDate: null,
          status: 'borrowing'
        },
        {
          id: 2,
          bookTitle: '百年孤独',
          borrowDate: '2024-02-15',
          dueDate: '2024-03-15',
          returnDate: '2024-03-10',
          status: 'returned'
        }
      ],
      wishlist: [
        {
          id: 1,
          bookTitle: '人类简史',
          author: '尤瓦尔·赫拉利',
          addDate: '2024-03-15',
          available: true
        },
        {
          id: 2,
          bookTitle: '置身事内',
          author: '兰小欢',
          addDate: '2024-03-10',
          available: false
        }
      ]
    }
  },
  computed: {
    filteredBorrows() {
      if (this.borrowFilter === 'current') {
        return this.borrows.filter(b => b.status === 'borrowing')
      }
      if (this.borrowFilter === 'history') {
        return this.borrows.filter(b => b.status === 'returned')
      }
      return this.borrows
    }
  },
  methods: {
    getBorrowStatusType(status) {
      const types = {
        borrowing: 'primary',
        returned: 'success',
        overdue: 'danger'
      }
      return types[status] || 'info'
    },
    getBorrowStatusText(status) {
      const texts = {
        borrowing: '借阅中',
        returned: '已归还',
        overdue: '已逾期'
      }
      return texts[status] || status
    },
    async renewBook(book) {
      try {
        await ElMessageBox.confirm(
          '确定要续借这本书吗？',
          '续借确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        // 这里添加续借的API调用
        ElMessage.success('续借成功')
      } catch {
        ElMessage.info('已取消续借')
      }
    },
    async borrowBook(book) {
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
    async removeFromWishlist(book) {
      try {
        await ElMessageBox.confirm(
          '确定要从书单中删除这本书吗？',
          '删除确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        // 这里添加删除的API调用
        ElMessage.success('已从书单中删除')
      } catch {
        ElMessage.info('已取消删除')
      }
    }
  }
}
</script>

<style scoped>
.user-center {
  padding: 20px;
}

.user-info-card {
  text-align: center;
}

.user-avatar {
  margin: 20px 0;
}

.user-role {
  color: #666;
  margin: 10px 0;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.stat-item {
  text-align: center;
}

.stat-item h3 {
  color: #409EFF;
  margin: 0;
}

.stat-item p {
  color: #666;
  font-size: 14px;
  margin: 5px 0;
}

.content-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
}
</style>
<template>
  <div class="user-center">
    <el-row :gutter="20">
      <!-- Left side user info card -->
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6">
        <transition name="fade-slide-down">

          <el-card class="user-info-card" v-if="userInfo.username">
            <div class="user-avatar">
              <el-avatar :size="100">{{ userInfo.username.charAt(0).toUpperCase() }}</el-avatar>
            </div>
            <h2>{{ userInfo.username }}</h2>
            <p class="user-role">{{ userInfo.role === 'admin' ? 'Administrator' : 'Regular User' }}</p>
            <el-divider />
            <div class="user-stats">
              <div class="stat-item">
                <h3>{{ borrowStats.current }}</h3>
                <p>Current Borrowings</p>
              </div>
              <div class="stat-item">
                <h3>{{ borrowStats.history }}</h3>
                <p>Borrowing History</p>
              </div>
              <div class="stat-item">
                <h3>{{ borrowStats.overdue }}</h3>
                <p>Overdue Count</p>
              </div>
            </div>
          </el-card>

        </transition>
      </el-col>

      <!-- Right side content area -->
      <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="18">
        <!-- Borrowing records -->
        <transition name="fade-slide-up">
          <el-card class="content-card">
            <template #header>
              <div class="card-header">
                <h3>Borrowing Records</h3>
              </div>
            </template>

            <el-table :data="borrows" style="width: 100%">
              <el-table-column prop="bookTitle" label="Book Title"/>
              <el-table-column prop="borrowDate" label="Borrow Date" width="120" />
              <el-table-column prop="dueDate" label="Due Date" width="120" />
              <el-table-column prop="returnDate" label="Actual Return Date" width="180" />
              <el-table-column prop="status" label="Status" width="120">
                <template #default="scope">
                  <el-tag :type="getBorrowStatusType(scope.row.status)">
                    {{ getBorrowStatusText(scope.row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </transition>

        <!-- My Wishlist -->
        <transition name="fade-slide-up">
          <el-card class="content-card">
            <template #header>
              <div class="card-header">
                <h3>My Wishlist</h3>
                <el-button type="primary" size="small">Add Book</el-button>
              </div>
            </template>

            <el-table :data="wishlist" style="width: 100%">
              <el-table-column prop="bookTitle" label="Book Title" />
              <el-table-column prop="author" label="Author" />
              <el-table-column prop="addDate" label="Date Added" width="120" />
              <el-table-column label="Actions" width="150">
                <template #default="scope">
                  <el-button
                    type="danger"
                    size="small"
                    @click="removeFromWishlist(scope.row)"
                  >
                    Remove
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </transition>
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
      borrowStats: {
        current: 2,
        history: 15,
        overdue: 0
      },
      borrows: [
        {
          id: 1,
          bookTitle: 'The Three-Body Problem',
          borrowDate: '2024-03-01',
          dueDate: '2024-04-01',
          returnDate: null,
          status: 'borrowing'
        },
        {
          id: 2,
          bookTitle: 'One Hundred Years of Solitude',
          borrowDate: '2024-02-15',
          dueDate: '2024-03-15',
          returnDate: '2024-03-10',
          status: 'returned'
        }
      ],
      wishlist: [
        {
          id: 1,
          bookTitle: 'Sapiens: A Brief History of Humankind',
          author: 'Yuval Noah Harari',
          addDate: '2024-03-15',
          available: true
        },
        {
          id: 2,
          bookTitle: 'Thinking, Fast and Slow',
          author: 'Daniel Kahneman',
          addDate: '2024-03-10',
          available: false
        }
      ],
      isLoading: true
    }
  },
  mounted() {
    const storedUserInfo = sessionStorage.getItem('userInfo');
        if (storedUserInfo) {
          this.userInfo = JSON.parse(storedUserInfo);
        } else {
          this.$router.push('/login');
        }
  },
  methods: {
    getBorrowStatusType(status) {
      const types = {
        borrowing: 'primary',
        returned: 'success'
      }
      return types[status] || 'info'
    },
    getBorrowStatusText(status) {
      const texts = {
        borrowing: 'Borrowing',
        returned: 'Returned'
      }
      return texts[status] || status
    },
    async renewBook(book) {
      try {
        await ElMessageBox.confirm(
          'Are you sure you want to renew this book?',
          'Renew Confirmation',
          {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        )
        // Add API call for book renewal here
        ElMessage.success('Renewal successful')
      } catch {
        ElMessage.info('Renewal cancelled')
      }
    },
    async borrowBook(book) {
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
        // Add API call for borrowing book here
        ElMessage.success('Book borrowed successfully')
      } catch {
        ElMessage.info('Borrowing cancelled')
      }
    },
    async removeFromWishlist(book) {
      try {
        await ElMessageBox.confirm(
          'Are you sure you want to remove this book from your wishlist?',
          'Remove Confirmation',
          {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        )
        // Add API call for removing from wishlist here
        ElMessage.success('Removed from wishlist')
      } catch {
        ElMessage.info('Removal cancelled')
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
  transition: all 0.3s ease;
}


.user-info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  margin: 20px 0;
  transition: transform 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
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
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-3px);
}

.stat-item h3 {
  color: #409EFF;
  margin: 0;
}

.stat-item p {
  color: #666;
  font-size: 14px;
}

.content-card {
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.content-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
}

/* Animations */
.fade-slide-down-enter-active,
.fade-slide-down-leave-active,
.fade-slide-right-enter-active,
.fade-slide-right-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-down-enter-from,
.fade-slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-slide-right-enter-from,
.fade-slide-right-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

@media (max-width: 768px) {
  .user-stats {
    flex-direction: column;
  }

  .stat-item {
    margin-bottom: 15px;
  }
}

.fade-slide-up-enter-active,
.fade-slide-up-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-up-enter-from,
.fade-slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
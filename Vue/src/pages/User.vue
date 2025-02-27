<template>
  <div class="user-center">
    <el-row :gutter="20">
      <!-- Left side user info card -->
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6">
        <transition name="fade-slide-down">
          <el-card class="user-info-card" v-if="userInfo.username">
            <div class="user-avatar">
              <el-avatar :size="100" class="custom-avatar">{{ userInfo.username.charAt(0).toUpperCase() }}</el-avatar>
            </div>
            <h2>{{ userInfo.username }}</h2>
            <p class="user-role">{{ $t(userInfo.role === 'admin' ? 'userCenter.roleAdmin' : userInfo.role === 'superadmin' ? 'userCenter.roleSuperAdmin' : 'userCenter.roleUser') }}</p>
            <el-divider />
            <div class="user-stats">
              <div class="stat-item">
                <h3>{{ borrowStats.current }}</h3>
                <p>{{ $t('userCenter.currentBorrowings') }}</p>
              </div>
              <div class="stat-item">
                <h3>{{ borrowStats.history }}</h3>
                <p>{{ $t('userCenter.borrowingHistory') }}</p>
              </div>
              <div class="stat-item">
                <h3>{{ borrowStats.overdue }}</h3>
                <p>{{ $t('userCenter.overdueCount') }}</p>
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
                <h3>{{ $t('userCenter.borrowingRecordsTitle') }}</h3>
              </div>
            </template>
            <el-table :data="borrows" style="width: 100%" :default-sort="{ prop: 'borrowDate', order: 'descending' }" @sort-change="handleSortChange">
              <el-table-column prop="bookTitle" :label="$t('book.title')" sortable>
                <template #default="scope">
                  <span class="clickable-text" @click="goToBookDetail(scope.row.id)">{{ scope.row.bookTitle }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="borrowDate" :label="$t('userCenter.borrowDate')" width="150" sortable />
              <el-table-column prop="dueDate" :label="$t('userCenter.dueDate')" width="150" sortable />
              <el-table-column prop="returnDate" :label="$t('userCenter.actualReturnDate')" width="200" sortable />
              <el-table-column prop="status" :label="$t('userCenter.status')" width="120" sortable>
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
                <h3>{{ $t('userCenter.myWishlistTitle') }}</h3>
              </div>
            </template>
            <el-table :data="wishlist" style="width: 100%" :sort-by="sortByField" :default-sort="{ prop: 'addDate', order: 'descending' }" @sort-change="handleSortChange">
              <el-table-column prop="bookTitle" :label="$t('book.title')" sortable>
                <template #default="scope">
                  <span class="clickable-text" @click="goToBookDetail(scope.row.id)">{{ scope.row.bookTitle }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="author" :label="$t('book.author')" width="250" sortable />
              <el-table-column prop="addDate" :label="$t('userCenter.dateAdded')" width="150" sortable />
              <el-table-column :label="$t('userCenter.actions')" width="180">
                <template #default="scope">
                  <el-button
                    type="primary"
                    size="small"
                    @click="borrowBookFromWishlist(scope.row)"
                    :disabled="!scope.row.available"
                  >
                    {{ $t('userCenter.borrow') }}
                  </el-button>
                  <el-button
                    type="danger"
                    size="small"
                    @click="removeFromWishlist(scope.row)"
                  >
                    {{ $t('userCenter.remove') }}
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
          borrowDate: '2025-03-01',
          dueDate: '2025-04-01',
          returnDate: null,
          status: 'borrowing'
        },
        {
          id: 2,
          bookTitle: 'One Hundred Years of Solitude',
          borrowDate: '2025-02-15',
          dueDate: '2025-03-15',
          returnDate: '2025-03-10',
          status: 'returned'
        }
      ],
      wishlist: [
        {
          id: 1,
          bookTitle: 'Clean Code: A Handbook of Agile Software Craftsmanship',
          author: 'Robert C. Martin',
          addDate: '2025-01-05',
          available: true
        },
        {
          id: 2,
          bookTitle: 'Design Patterns: Elements of Reusable Object-Oriented Software',
          author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
          addDate: '2025-02-10',
          available: true
        },
        {
          id: 3,
          bookTitle: 'The Mythical Man - Month: Essays on Software Engineering',
          author: 'Frederick P. Brooks Jr.',
          addDate: '2025-03-15',
          available: false
        },
        {
          id: 4,
          bookTitle: 'Code Complete: A Practical Handbook of Software Construction',
          author: 'Steve McConnell',
          addDate: '2025-04-20',
          available: true
        }
      ],
      isLoading: true,
      sortByField: null
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
        returned:'success'
      }
      return types[status] || 'info'
    },
    getBorrowStatusText(status) {
      const texts = {
        borrowing: this.$t('userCenter.borrowingStatus'),
        returned: this.$t('userCenter.returnedStatus')
      }
      return texts[status] || status
    },
    async renewBook(book) {
      try {
        await ElMessageBox.confirm(
          this.$t('userCenter.renewConfirmMessage'),
          this.$t('userCenter.renewConfirmationTitle'),
          {
            confirmButtonText: this.$t('common.confirm'),
            cancelButtonText: this.$t('common.cancel'),
            type: 'warning'
          }
        )
        // Add API call for book renewal here
        ElMessage.success(this.$t('userCenter.renewalSuccess'))
      } catch {
        ElMessage.info(this.$t('userCenter.renewalCancelled'))
      }
    },
    async borrowBook(book) {
      try {
        await ElMessageBox.confirm(
          this.$t('userCenter.borrowConfirmMessage'),
          this.$t('userCenter.borrowConfirmationTitle'),
          {
            confirmButtonText: this.$t('common.confirm'),
            cancelButtonText: this.$t('common.cancel'),
            type: 'info'
          }
        )
        // Add API call for borrowing book here
        ElMessage.success(this.$t('userCenter.bookBorrowedSuccessfully'))
      } catch {
        ElMessage.info(this.$t('userCenter.borrowingCancelled'))
      }
    },
    async borrowBookFromWishlist(book) {
      if (!book.available) {
        ElMessage.warning(this.$t('userCenter.bookNotAvailable'));
        return;
      }
      try {
        await ElMessageBox.confirm(
          this.$t('userCenter.borrowFromWishlistConfirmMessage'),
          this.$t('userCenter.borrowConfirmationTitle'),
          {
            confirmButtonText: this.$t('common.confirm'),
            cancelButtonText: this.$t('common.cancel'),
            type: 'info'
          }
        );
        // Add API call for borrowing book here
        ElMessage.success(this.$t('userCenter.bookBorrowedSuccessfully'));
        // Remove the book from wishlist after borrowing
        this.wishlist = this.wishlist.filter(item => item.id!== book.id);
      } catch {
        ElMessage.info(this.$t('userCenter.borrowingCancelled'));
      }
    },
    async removeFromWishlist(book) {
      try {
        await ElMessageBox.confirm(
          this.$t('userCenter.removeFromWishlistConfirmMessage'),
          this.$t('userCenter.removeConfirmationTitle'),
          {
            confirmButtonText: this.$t('common.confirm'),
            cancelButtonText: this.$t('common.cancel'),
            type: 'warning'
          }
        )
        // Add API call for removing from wishlist here
        this.wishlist = this.wishlist.filter(item => item.id!== book.id);
        ElMessage.success(this.$t('userCenter.removedFromWishlist'))
      } catch {
        ElMessage.info(this.$t('userCenter.removalCancelled'))
      }
    },
    handleSortChange({ prop, order }) {
      if (order === 'ascending') {
        this.wishlist.sort((a, b) => {
          if (prop === 'addDate') {
            return new Date(a[prop]) - new Date(b[prop]);
          }
          return a[prop] > b[prop]? 1 : -1;
        });
      } else if (order === 'descending') {
        this.wishlist.sort((a, b) => {
          if (prop === 'addDate') {
            return new Date(b[prop]) - new Date(a[prop]);
          }
          return a[prop] < b[prop]? 1 : -1;
        });
      }
      this.sortByField = prop;
    },
    goToBookDetail(bookId) {
      this.$router.push(`/book/${bookId}`);
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
  margin-bottom: 20px;
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

.custom-avatar {
  font-size: 32px;
  background: linear-gradient(135deg, #409EFF, #FF4D4D);
  color: #fff;
  font-weight: bold;
}

.user-role {
  color: #666;
  font-size: 14px;
  margin: 0;
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

.clickable-text {
  cursor: pointer;
  color: inherit;
  text-decoration: none;
}

.clickable-text:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .user-stats {
    flex-direction: column;
  }

  .stat-item {
    margin-bottom: 15px;
  }
}
</style>
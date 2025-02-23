<template>
  <div class="borrow-management">
    <div class="page-header">
      <h2>{{ $t('adminBorrowManagement.borrowManagement') }}</h2>
    </div>

    <!-- Search and Filter -->
    <div class="search-section">
      <el-input
        v-model="searchQuery"
        :placeholder="$t('adminBorrowManagement.searchBooksOrUsers')"
        class="search-input"
        @keyup.enter="searchBorrows"
      >
        <template #append>
          <el-button @click="searchBorrows">
            <el-icon><Search /></el-icon>
          </el-button>
        </template>
      </el-input>

      <el-select v-model="filterStatus" :placeholder="$t('adminBorrowManagement.borrowStatus')" clearable class="filterStatus">
        <el-option :label="$t('adminBorrowManagement.all')" value="" />
        <el-option :label="$t('adminBorrowManagement.borrowing')" value="borrowing" />
        <el-option :label="$t('adminBorrowManagement.returned')" value="returned" />
        <el-option :label="$t('adminBorrowManagement.overdue')" value="overdue" />
      </el-select>

      <el-date-picker
          class="dateRange"
        v-model="dateRange"
        type="daterange"
        range-separator="to"
        :start-placeholder="$t('adminBorrowManagement.startDate')"
        :end-placeholder="$t('adminBorrowManagement.endDate')"
      />
    </div>

    <!-- Borrow List -->
    <el-table :data="borrows" style="width: 100%" default-sort="{prop: 'id', order: 'descending'}" @sort-change="handleSortChange">
      <el-table-column prop="id" :label="$t('adminBorrowManagement.borrowId')" width="140" sortable/>
      <el-table-column prop="bookTitle" :label="$t('adminBorrowManagement.book')" sortable/>
      <el-table-column prop="username" :label="$t('adminBorrowManagement.borrower')" sortable/>
      <el-table-column prop="borrowDate" :label="$t('adminBorrowManagement.borrowDate')" sortable/>
      <el-table-column prop="dueDate" :label="$t('adminBorrowManagement.dueDate')" sortable/>
      <el-table-column prop="returnDate" :label="$t('adminBorrowManagement.actualReturnDate')" sortable/>
      <el-table-column :label="$t('adminBorrowManagement.status')" sortable>
        <template #default="scope">
          <el-tag :type="getBorrowStatusType(scope.row.status)">
            {{ getBorrowStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('adminBorrowManagement.actions')" width="200">
        <template #default="scope">
          <el-button
            v-if="scope.row.status === 'borrowing'"
            type="success"
            size="small"
            @click="confirmReturn(scope.row)"
          >
            {{ $t('adminBorrowManagement.confirmReturn') }}
          </el-button>
          <el-button
            v-if="scope.row.status === 'overdue'"
            type="warning"
            size="small"
            @click="handleOverdue(scope.row)"
          >
            {{ $t('adminBorrowManagement.handleOverdue') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div class="pagination">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        @update:current-page="currentPage = $event"
        @update:page-size="pageSize = $event"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- Handle Overdue Dialog -->
    <el-dialog
      :title="$t('adminBorrowManagement.handleOverdue')"
      v-model="overdueDialogVisible"
      width="40%"
    >
      <div v-if="selectedBorrow" class="overdue-form">
        <p>{{ $t('adminBorrowManagement.borrowInformation') }}:</p>
        <el-descriptions :column="1">
          <el-descriptions-item :label="$t('adminBorrowManagement.book')">{{ selectedBorrow.bookTitle }}</el-descriptions-item>
          <el-descriptions-item :label="$t('adminBorrowManagement.borrower')">{{ selectedBorrow.username }}</el-descriptions-item>
          <el-descriptions-item :label="$t('adminBorrowManagement.dueDate')">{{ selectedBorrow.dueDate }}</el-descriptions-item>
          <el-descriptions-item :label="$t('adminBorrowManagement.overdueDays')">{{ calculateOverdueDays(selectedBorrow) }} days</el-descriptions-item>
        </el-descriptions>

        <el-form :model="overdueForm" label-width="100px" class="overdue-handle-form">
          <el-form-item :label="$t('adminBorrowManagement.handleMethod')">
            <el-radio-group v-model="overdueForm.handleMethod">
              <el-radio :label="'fine'">{{ $t('adminBorrowManagement.fine') }}</el-radio>
              <el-radio :label="'warning'">{{ $t('adminBorrowManagement.warning') }}</el-radio>
              <el-radio :label="'blacklist'">{{ $t('adminBorrowManagement.addToBlacklist') }}</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            :label="$t('adminBorrowManagement.fineAmount')"
            v-if="overdueForm.handleMethod === 'fine'"
          >
            <el-input-number
              v-model="overdueForm.fineAmount"
              :min="0"
              :precision="2"
            />
          </el-form-item>

          <el-form-item :label="$t('adminBorrowManagement.remarks')">
            <el-input
              v-model="overdueForm.remarks"
              type="textarea"
              :rows="3"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="overdueDialogVisible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="submitOverdueHandle">
            {{ $t('common.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'AdminBorrowManagement',
  components: {
    Search
  },
  data() {
    return {
      searchQuery: '',
      filterStatus: '',
      dateRange: [],
      borrows: [
        {
          id: 1,
          bookTitle: 'The Three-Body Problem',
          username: 'user1',
          borrowDate: '2024-02-01',
          dueDate: '2024-03-01',
          returnDate: null,
          status: 'borrowing'
        }
      ],
      currentPage: 1,
      pageSize: 10,
      total: 100,
      overdueDialogVisible: false,
      selectedBorrow: null,
      overdueForm: {
        handleMethod: 'fine',
        fineAmount: 0,
        remarks: ''
      }
    }
  },
  methods: {
    searchBorrows() {
      // 实现搜索逻辑
      console.log('Searching:', this.searchQuery)
    },
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
        borrowing: this.$t('adminBorrowManagement.borrowing'),
        returned: this.$t('adminBorrowManagement.returned'),
        overdue: this.$t('adminBorrowManagement.overdue')
      }
      return texts[status] || status
    },
    async confirmReturn(borrow) {
      try {
        await ElMessageBox.confirm(
          this.$t('adminBorrowManagement.confirmReturnMessage'),
          this.$t('adminBorrowManagement.confirm'),
          {
            confirmButtonText: this.$t('common.confirm'),
            cancelButtonText: this.$t('common.cancel'),
            type: 'info'
          }
        )
        // Call API
        // await confirmReturnApi(borrow.id)
        borrow.status = 'returned'
        borrow.returnDate = new Date().toISOString().split('T')[0]
        ElMessage.success(this.$t('adminBorrowManagement.returnConfirmedSuccessfully'))
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error(this.$t('adminBorrowManagement.failedToConfirmReturn'))
        }
      }
    },
    handleOverdue(borrow) {
      this.selectedBorrow = borrow
      this.overdueDialogVisible = true
    },
    calculateOverdueDays(borrow) {
      const dueDate = new Date(borrow.dueDate)
      const today = new Date()
      const diffTime = Math.abs(today - dueDate)
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    },
    async submitOverdueHandle() {
      try {
        // Call API
        // await handleOverdueApi({
        //   borrowId: this.selectedBorrow.id,
        //   ...this.overdueForm
        // })
        ElMessage.success(this.$t('adminBorrowManagement.handledSuccessfully'))
        this.overdueDialogVisible = false
        this.fetchBorrows()
      } catch (error) {
        ElMessage.error(this.$t('adminBorrowManagement.failedToHandle'))
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchBorrows()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchBorrows()
    },
    handleSortChange(tableName, {prop, order}) {
      const data = this[tableName];
      if (order === 'ascending') {
        data.sort((a, b) => {
          if (prop === 'publishDate' || prop === 'requestDate') {
            return new Date(a[prop]) - new Date(b[prop]);
          }
          return a[prop] > b[prop] ? 1 : -1;
        });
      } else if (order === 'descending') {
        data.sort((a, b) => {
          if (prop === 'publishDate' || prop === 'requestDate') {
            return new Date(b[prop]) - new Date(a[prop]);
          }
          return a[prop] < b[prop] ? 1 : -1;
        });
      }
      this[tableName] = [...data];
    },
    fetchBorrows() {
      // Implement logic to fetch borrow list
      console.log('Fetching borrow list')
    }
  },
  created() {
    this.fetchBorrows()
  }
}
</script>

<style scoped>
.borrow-management {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-section {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  align-items: center;
}

.search-input {
  flex-grow: 1;
}

.filterStatus {
  width: 200px;
}

.dateRange {
  width: 300px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.overdue-form {
  padding: 20px;
}

.overdue-handle-form {
  margin-top: 20px;
}

</style> 
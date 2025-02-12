<template>
  <div class="borrow-management">
    <div class="page-header">
      <h2>Borrow Management</h2>
    </div>

    <!-- Search and Filter -->
    <div class="search-section">
      <el-input
        v-model="searchQuery"
        placeholder="Search books or users..."
        class="search-input"
      >
        <template #append>
          <el-button @click="searchBorrows">
            <el-icon><Search /></el-icon>
          </el-button>
        </template>
      </el-input>

      <el-select v-model="filterStatus" placeholder="Borrow Status" clearable >
        <el-option label="All" value="" />
        <el-option label="Borrowing" value="borrowing" />
        <el-option label="Returned" value="returned" />
        <el-option label="Overdue" value="overdue" />
      </el-select>

      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="to"
        start-placeholder="Start Date"
        end-placeholder="End Date"
      />
    </div>

    <!-- Borrow List -->
    <el-table :data="borrows" style="width: 100%">
      <el-table-column prop="id" label="Borrow ID" width="100" />
      <el-table-column prop="bookTitle" label="Book" />
      <el-table-column prop="username" label="Borrower" />
      <el-table-column prop="borrowDate" label="Borrow Date" />
      <el-table-column prop="dueDate" label="Due Date" />
      <el-table-column prop="returnDate" label="Actual Return Date" />
      <el-table-column label="Status">
        <template #default="scope">
          <el-tag :type="getBorrowStatusType(scope.row.status)">
            {{ getBorrowStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="200">
        <template #default="scope">
          <el-button
            v-if="scope.row.status === 'borrowing'"
            type="success"
            size="small"
            @click="confirmReturn(scope.row)"
          >
            Confirm Return
          </el-button>
          <el-button
            v-if="scope.row.status === 'overdue'"
            type="warning"
            size="small"
            @click="handleOverdue(scope.row)"
          >
            Handle Overdue
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
      title="Handle Overdue"
      v-model="overdueDialogVisible"
      width="40%"
    >
      <div v-if="selectedBorrow" class="overdue-form">
        <p>Borrow Information:</p>
        <el-descriptions :column="1">
          <el-descriptions-item label="Book">{{ selectedBorrow.bookTitle }}</el-descriptions-item>
          <el-descriptions-item label="Borrower">{{ selectedBorrow.username }}</el-descriptions-item>
          <el-descriptions-item label="Due Date">{{ selectedBorrow.dueDate }}</el-descriptions-item>
          <el-descriptions-item label="Overdue Days">{{ calculateOverdueDays(selectedBorrow) }} days</el-descriptions-item>
        </el-descriptions>

        <el-form :model="overdueForm" label-width="100px" class="overdue-handle-form">
          <el-form-item label="Handle Method">
            <el-radio-group v-model="overdueForm.handleMethod">
              <el-radio label="fine">Fine</el-radio>
              <el-radio label="warning">Warning</el-radio>
              <el-radio label="blacklist">Add to Blacklist</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            label="Fine Amount"
            v-if="overdueForm.handleMethod === 'fine'"
          >
            <el-input-number
              v-model="overdueForm.fineAmount"
              :min="0"
              :precision="2"
            />
          </el-form-item>

          <el-form-item label="Remarks">
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
          <el-button @click="overdueDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitOverdueHandle">
            Confirm
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
        borrowing: 'Borrowing',
        returned: 'Returned',
        overdue: 'Overdue'
      }
      return texts[status] || status
    },
    async confirmReturn(borrow) {
      try {
        await ElMessageBox.confirm(
          'Are you sure the book has been returned?',
          'Confirm',
          {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'info'
          }
        )
        // Call API
        // await confirmReturnApi(borrow.id)
        borrow.status = 'returned'
        borrow.returnDate = new Date().toISOString().split('T')[0]
        ElMessage.success('Return confirmed successfully')
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('Failed to confirm return')
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
        ElMessage.success('Handled successfully')
        this.overdueDialogVisible = false
        this.fetchBorrows()
      } catch (error) {
        ElMessage.error('Failed to handle')
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
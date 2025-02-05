<template>
  <div class="borrow-management">
    <div class="page-header">
      <h2>借阅管理</h2>
    </div>

    <!-- 搜索和筛选 -->
    <div class="search-section">
      <el-input
        v-model="searchQuery"
        placeholder="搜索图书或用户..."
        class="search-input"
      >
        <template #append>
          <el-button @click="searchBorrows">
            <el-icon><Search /></el-icon>
          </el-button>
        </template>
      </el-input>

      <el-select v-model="filterStatus" placeholder="借阅状态" clearable>
        <el-option label="全部" value="" />
        <el-option label="借阅中" value="borrowing" />
        <el-option label="已归还" value="returned" />
        <el-option label="已逾期" value="overdue" />
      </el-select>

      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
    </div>

    <!-- 借阅列表 -->
    <el-table :data="borrows" style="width: 100%">
      <el-table-column prop="id" label="借阅ID" width="80" />
      <el-table-column prop="bookTitle" label="图书" />
      <el-table-column prop="username" label="借阅人" />
      <el-table-column prop="borrowDate" label="借阅日期" />
      <el-table-column prop="dueDate" label="应还日期" />
      <el-table-column prop="returnDate" label="实际归还日期" />
      <el-table-column label="状态">
        <template #default="scope">
          <el-tag :type="getBorrowStatusType(scope.row.status)">
            {{ getBorrowStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button 
            v-if="scope.row.status === 'borrowing'"
            type="success" 
            size="small" 
            @click="confirmReturn(scope.row)"
          >
            确认归还
          </el-button>
          <el-button 
            v-if="scope.row.status === 'overdue'"
            type="warning" 
            size="small" 
            @click="handleOverdue(scope.row)"
          >
            处理逾期
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
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

    <!-- 处理逾期对话框 -->
    <el-dialog
      title="处理逾期"
      v-model="overdueDialogVisible"
      width="40%"
    >
      <div v-if="selectedBorrow" class="overdue-form">
        <p>借阅信息：</p>
        <el-descriptions :column="1">
          <el-descriptions-item label="图书">{{ selectedBorrow.bookTitle }}</el-descriptions-item>
          <el-descriptions-item label="借阅人">{{ selectedBorrow.username }}</el-descriptions-item>
          <el-descriptions-item label="应还日期">{{ selectedBorrow.dueDate }}</el-descriptions-item>
          <el-descriptions-item label="逾期天数">{{ calculateOverdueDays(selectedBorrow) }}天</el-descriptions-item>
        </el-descriptions>

        <el-form :model="overdueForm" label-width="100px" class="overdue-handle-form">
          <el-form-item label="处理方式">
            <el-radio-group v-model="overdueForm.handleMethod">
              <el-radio label="fine">罚款</el-radio>
              <el-radio label="warning">警告</el-radio>
              <el-radio label="blacklist">加入黑名单</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item 
            label="罚款金额" 
            v-if="overdueForm.handleMethod === 'fine'"
          >
            <el-input-number 
              v-model="overdueForm.fineAmount" 
              :min="0"
              :precision="2"
            />
          </el-form-item>

          <el-form-item label="备注">
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
          <el-button @click="overdueDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitOverdueHandle">
            确定
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
          bookTitle: '三体',
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
      console.log('搜索:', this.searchQuery)
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
        borrowing: '借阅中',
        returned: '已归还',
        overdue: '已逾期'
      }
      return texts[status] || status
    },
    async confirmReturn(borrow) {
      try {
        await ElMessageBox.confirm(
          '确认图书已归还？',
          '确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }
        )
        // 调用API
        // await confirmReturnApi(borrow.id)
        borrow.status = 'returned'
        borrow.returnDate = new Date().toISOString().split('T')[0]
        ElMessage.success('确认归还成功')
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('确认归还失败')
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
        // 调用API
        // await handleOverdueApi({
        //   borrowId: this.selectedBorrow.id,
        //   ...this.overdueForm
        // })
        ElMessage.success('处理成功')
        this.overdueDialogVisible = false
        this.fetchBorrows()
      } catch (error) {
        ElMessage.error('处理失败')
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
      // 实现获取借阅列表的逻辑
      console.log('获取借阅列表')
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
}

.search-input {
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
<template>
  <div class="borrow-management">
    <div class="page-header">
      <h2>{{ $t('adminBorrowManagement.borrowManagement') }}</h2>
      <div>
        <el-button type="primary" @click="showAddBorrowDialog">
          {{ $t('adminBorrowManagement.addBorrowRecord') }}
        </el-button>
      </div>
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
          <el-tag :type="getBorrowStatusType(getCalculatedStatus(scope.row))">
            {{ getBorrowStatusText(getCalculatedStatus(scope.row)) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('adminBorrowManagement.actions')" width="400">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="showEditBorrowDialog(scope.row)"
          >
            {{ $t('adminBorrowManagement.editRecord') }}
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="deleteBorrow(scope.row)"
          >
            {{ $t('adminBorrowManagement.deleteRecord') }}
          </el-button>
          <el-button
            v-if="getCalculatedStatus(scope.row) === 'overdue'"
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

    <!-- Add Borrow Dialog -->
    <el-dialog
      :title="$t('adminBorrowManagement.addBorrowRecord')"
      v-model="addBorrowDialogVisible"
      width="50%"
    >
      <el-form :model="addBorrowForm" :rules="addBorrowRules" ref="addBorrowFormRef" label-width="150px">
        <el-form-item :label="$t('adminBorrowManagement.book')" prop="bookTitle">
          <el-input v-model="addBorrowForm.bookTitle" />
        </el-form-item>
        <el-form-item :label="$t('adminBorrowManagement.borrower')" prop="username">
          <el-input v-model="addBorrowForm.username" />
        </el-form-item>
        <el-form-item :label="$t('adminBorrowManagement.borrowDate')" prop="borrowDate">
          <el-date-picker
            v-model="addBorrowForm.borrowDate"
            type="date"
            :placeholder="$t('adminBorrowManagement.borrowDate')"
          />
        </el-form-item>
        <el-form-item :label="$t('adminBorrowManagement.dueDate')" prop="dueDate">
          <el-date-picker
            v-model="addBorrowForm.dueDate"
            type="date"
            :placeholder="$t('adminBorrowManagement.dueDate')"
          />
        </el-form-item>
        <el-form-item :label="$t('adminBorrowManagement.returnDate')" prop="returnDate">
          <el-date-picker
            v-model="addBorrowForm.returnDate"
            type="date"
            :placeholder="$t('adminBorrowManagement.returnDate')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addBorrowDialogVisible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="submitAddBorrowForm">
            {{ $t('common.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Edit Borrow Dialog -->
    <el-dialog
      :title="$t('adminBorrowManagement.editRecord')"
      v-model="editBorrowDialogVisible"
      width="50%"
    >
      <el-form :model="editBorrowForm" :rules="editBorrowRules" ref="editBorrowFormRef" label-width="150px">
        <el-form-item :label="$t('adminBorrowManagement.book')" prop="bookTitle">
          <el-input v-model="editBorrowForm.bookTitle" />
        </el-form-item>
        <el-form-item :label="$t('adminBorrowManagement.borrower')" prop="username">
          <el-input v-model="editBorrowForm.username" />
        </el-form-item>
        <el-form-item :label="$t('adminBorrowManagement.borrowDate')" prop="borrowDate">
          <el-date-picker
            v-model="editBorrowForm.borrowDate"
            type="date"
            :placeholder="$t('adminBorrowManagement.borrowDate')"
          />
        </el-form-item>
        <el-form-item :label="$t('adminBorrowManagement.dueDate')" prop="dueDate">
          <el-date-picker
            v-model="editBorrowForm.dueDate"
            type="date"
            :placeholder="$t('adminBorrowManagement.dueDate')"
          />
        </el-form-item>
        <el-form-item :label="$t('adminBorrowManagement.returnDate')" prop="returnDate">
          <el-date-picker
            v-model="editBorrowForm.returnDate"
            type="date"
            :placeholder="$t('adminBorrowManagement.returnDate')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editBorrowDialogVisible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="submitEditBorrowForm">
            {{ $t('common.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Handle Overdue Dialog -->
    <el-dialog
      :title="$t('adminBorrowManagement.handleOverdue')"
      v-model="overdueDialogVisible"
      width="40%"
    >
    <div v-if="selectedBorrow" class="overdue-form">
        <el-form :model="selectedBorrow" label-width="150px">
          <el-form-item :label="$t('adminBorrowManagement.book')">
            {{ selectedBorrow.bookTitle }}
          </el-form-item>
          <el-form-item :label="$t('adminBorrowManagement.borrower')">
            {{ selectedBorrow.username }}
          </el-form-item>
          <el-form-item :label="$t('adminBorrowManagement.dueDate')">
            {{ selectedBorrow.dueDate }}
          </el-form-item>
          <el-form-item :label="$t('adminBorrowManagement.overdueDays')">
            {{ calculateOverdueDays(selectedBorrow) }}
          </el-form-item>
          <el-form-item :label="$t('adminBorrowManagement.status')">
            <el-tag :type="getBorrowStatusType(getCalculatedStatus(selectedBorrow))">
              {{ getBorrowStatusText(getCalculatedStatus(selectedBorrow)) }}
            </el-tag>
          </el-form-item>
        </el-form>

        <el-form :model="overdueForm" label-width="150px" class="overdue-handle-form">
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
          bookTitle: 'Introduction to Algorithms',
          username: 'user1',
          borrowDate: '2025-01-01',
          dueDate: '2025-02-01',
          returnDate: '2025-01-15',
        },
        {
          id: 2,
          bookTitle: 'Artificial Intelligence: A Modern Approach',
          username: 'user2',
          borrowDate: '2025-02-15',
          dueDate: '2025-05-15',
          returnDate: null,
        },
        {
          id: 3,
          bookTitle: 'Computer Networks',
          username: 'user3',
          borrowDate: '2025-01-01',
          dueDate: '2025-02-01',
          returnDate: null,
        }
      ],
      currentPage: 1,
      pageSize: 10,
      total: 100,
      overdueDialogVisible: false,
      selectedBorrow: null,
      addBorrowDialogVisible: false,
      addBorrowForm: {
        bookTitle: '',
        username: '',
        borrowDate: '',
        dueDate: '',
        returnDate: ''
      },
      addBorrowRules: {
        bookTitle: [
          { required: true, message: this.$t('adminBorrowManagement.pleaseEnterBookTitle'), trigger: 'blur' }
        ],
        username: [
          { required: true, message: this.$t('adminBorrowManagement.pleaseEnterUsername'), trigger: 'blur' }
        ],
        borrowDate: [
          { required: true, message: this.$t('adminBorrowManagement.pleaseSelectBorrowDate'), trigger: 'change' }
        ],
        dueDate: [
          { required: true, message: this.$t('adminBorrowManagement.pleaseSelectDueDate'), trigger: 'change' }
        ],
        returnDate: [
          { required: false, message: this.$t('adminBorrowManagement.pleaseSelectReturnDate'), trigger: 'change' }
        ]
      },
      editBorrowDialogVisible: false,
      editBorrowForm: {
        id: null,
        bookTitle: '',
        username: '',
        borrowDate: '',
        dueDate: '',
        returnDate: ''
      },
      editBorrowRules: {
        bookTitle: [
          { required: true, message: this.$t('adminBorrowManagement.pleaseEnterBookTitle'), trigger: 'blur' }
        ],
        username: [
          { required: true, message: this.$t('adminBorrowManagement.pleaseEnterUsername'), trigger: 'blur' }
        ],
        borrowDate: [
          { required: true, message: this.$t('adminBorrowManagement.pleaseSelectBorrowDate'), trigger: 'change' }
        ],
        dueDate: [
          { required: true, message: this.$t('adminBorrowManagement.pleaseSelectDueDate'), trigger: 'change' }
        ],
        returnDate: [
          { required: false, message: this.$t('adminBorrowManagement.pleaseSelectReturnDate'), trigger: 'change' }
        ]
      },
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
    getCalculatedStatus(borrow) {
      const today = new Date();
      const dueDate = new Date(borrow.dueDate);
      const returnDate = borrow.returnDate? new Date(borrow.returnDate) : null;

      if (returnDate) {
        return returnDate <= dueDate? 'returned' : 'overdue';
      } else {
        return today <= dueDate? 'borrowing' : 'overdue';
      }
    },
    showAddBorrowDialog() {
      this.addBorrowForm = {
        bookTitle: '',
        username: '',
        borrowDate: '',
        dueDate: ''
      }
      this.addBorrowDialogVisible = true
    },
    async submitAddBorrowForm() {
      try {
        await this.$refs.addBorrowFormRef.validate()
        // Call API
        // const newBorrow = await addBorrowApi(this.addBorrowForm)
        const newBorrow = {
          id: this.borrows.length + 1,
          ...this.addBorrowForm,
          returnDate: null,
          status: 'borrowing'
        }
        this.borrows.push(newBorrow)
        ElMessage.success(this.$t('adminBorrowManagement.borrowRecordAddedSuccessfully'))
        this.addBorrowDialogVisible = false
        this.fetchBorrows()
      } catch (error) {
        console.error(error)
      }
    },
    showEditBorrowDialog(borrow) {
      this.editBorrowForm = {
        id: borrow.id,
        bookTitle: borrow.bookTitle,
        username: borrow.username,
        borrowDate: borrow.borrowDate,
        dueDate: borrow.dueDate,
        status: borrow.status
      }
      this.editBorrowDialogVisible = true
    },
    async submitEditBorrowForm() {
      try {
        await this.$refs.editBorrowFormRef.validate()
        // Call API
        // await editBorrowApi(this.editBorrowForm)
        const index = this.borrows.findIndex(item => item.id === this.editBorrowForm.id)
        if (index!== -1) {
          this.borrows[index] = { ...this.editBorrowForm }
        }
        ElMessage.success(this.$t('adminBorrowManagement.borrowRecordUpdatedSuccessfully'))
        this.editBorrowDialogVisible = false
        this.fetchBorrows()
      } catch (error) {
        console.error(error)
      }
    },
    async deleteBorrow(borrow) {
      try {
        await ElMessageBox.confirm(
          this.$t('adminBorrowManagement.confirmDeleteRecord'),
          this.$t('adminBorrowManagement.warning'),
          {
            confirmButtonText: this.$t('common.confirm'),
            cancelButtonText: this.$t('common.cancel'),
            type: 'warning'
          }
        )
        // Call API
        // await deleteBorrowApi(borrow.id)
        const index = this.borrows.findIndex(item => item.id === borrow.id)
        if (index!== -1) {
          this.borrows.splice(index, 1)
        }
        ElMessage.success(this.$t('adminBorrowManagement.borrowRecordDeletedSuccessfully'))
        this.fetchBorrows()
      } catch (error) {
        if (error!== 'cancel') {
          ElMessage.error(this.$t('adminBorrowManagement.failedToDeleteRecord'))
        }
      }
    },
    handleOverdue(borrow) {
      this.selectedBorrow = borrow
      this.overdueDialogVisible = true
    },
    calculateOverdueDays(borrow) {
      const dueDate = new Date(borrow.dueDate);
      const returnDate = borrow.returnDate? new Date(borrow.returnDate) : null;
      if (!returnDate) {
        return this.$t('adminBorrowManagement.pleaseFillReturnDate');
      }
      const diffTime = Math.abs(returnDate - dueDate);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + ' days';
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
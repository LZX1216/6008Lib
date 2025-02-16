<template>
  <div class="book-management">
    <div class="page-header">
      <h2>Book Management</h2>
      <div>
        <el-button type="primary" @click="showAddBookDialog">
          Add New Book
        </el-button>
        <el-button type="info" @click="showPurchaseRequestsDialog">
          View Purchase Requests
        </el-button>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="search-section">
      <el-input
        v-model="searchQuery"
        placeholder="Search books..."
        class="search-input"
      >
        <template #append>
          <el-button @click="searchBooks">
            <el-icon><Search /></el-icon>
          </el-button>
        </template>
      </el-input>

      <el-select v-model="filterStatus" placeholder="Borrow Status" clearable style="width: 150px;">
        <el-option label="All" value="" />
        <el-option label="Available" value="available" />
        <el-option label="Borrowed" value="borrowed" />
      </el-select>
    </div>

    <!-- Book List -->
    <el-table :data="books" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="Title" />
      <el-table-column prop="author" label="Author" />
      <el-table-column prop="isbn" label="ISBN" />
      <el-table-column prop="publishDate" label="Publish Date" />
      <el-table-column label="Status">
        <template #default="scope">
          <el-tag :type="scope.row.available ? 'success' : 'danger'">
            {{ scope.row.available ? 'Available' : 'Borrowed' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="200">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="editBook(scope.row)"
          >
            Edit
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="deleteBook(scope.row)"
          >
            Delete
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

    <!-- Add/Edit Book Dialog -->
    <el-dialog
      :title="dialogType === 'add' ? 'Add New Book' : 'Edit Book'"
      v-model="dialogVisible"
      width="50%"
    >
      <el-form :model="bookForm" :rules="rules" ref="bookForm" label-width="100px">
        <el-form-item label="Title" prop="title">
          <el-input v-model="bookForm.title" />
        </el-form-item>
        <el-form-item label="Author" prop="author">
          <el-input v-model="bookForm.author" />
        </el-form-item>
        <el-form-item label="ISBN" prop="isbn">
          <el-input v-model="bookForm.isbn" />
        </el-form-item>
        <el-form-item label="Publish Date" prop="publishDate">
          <el-date-picker
            v-model="bookForm.publishDate"
            type="date"
            placeholder="Select date"
          />
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input
            v-model="bookForm.description"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
        <el-form-item label="Cover Image" prop="cover">
          <el-upload
            class="cover-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleCoverSuccess"
            :before-upload="beforeCoverUpload"
          >
            <img v-if="bookForm.cover" :src="bookForm.cover" class="cover" />
            <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitBookForm">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Purchase Requests Dialog -->
    <el-dialog
      title="Purchase Requests"
      v-model="purchaseRequestsDialogVisible"
      width="70%"
    >
      <el-table :data="purchaseRequests" style="width: 100%">
        <el-table-column prop="title" label="Title" />
        <el-table-column prop="author" label="Author" />
        <el-table-column prop="isbn" label="ISBN" width="160" />
        <el-table-column prop="requestDate" label="Request Date" width="160" />
        <el-table-column prop="status" label="Status" width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="200">
          <template #default="scope">
            <el-button
              size="small"
              @click="handleApprove(scope.row)"
              :disabled="scope.row.status !== 'Pending'"
            >
              Approve
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleReject(scope.row)"
              :disabled="scope.row.status !== 'Pending'"
            >
              Reject
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'AdminBookManagement',
  components: {
    Search,
    Plus
  },
  data() {
    return {
      searchQuery: '',
      filterStatus: '',
      books: [
        {
          id: 1,
          title: 'The Three-Body Problem',
          author: 'Cixin Liu',
          isbn: '9787536692930',
          publishDate: '2008-01-01',
          available: true
        }
      ],
      currentPage: 1,
      pageSize: 10,
      total: 100,
      dialogVisible: false,
      dialogType: 'add',
      bookForm: {
        title: '',
        author: '',
        isbn: '',
        publishDate: '',
        description: '',
        cover: ''
      },
      rules: {
        title: [
          { required: true, message: 'Please enter the title', trigger: 'blur' }
        ],
        author: [
          { required: true, message: 'Please enter the author', trigger: 'blur' }
        ],
        isbn: [
          { required: true, message: 'Please enter the ISBN', trigger: 'blur' }
        ]
      },
      purchaseRequestsDialogVisible: false,
      purchaseRequests: [
        {
          id: 1,
          title: 'Database System Concepts',
          author: 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan',
          isbn: '9780073523323',
          requestDate: '2024-03-15',
          status: 'Pending'
        }
      ]
    }
  },
  methods: {
    searchBooks() {
      // Implement search logic
      console.log('Searching:', this.searchQuery)
    },
    showAddBookDialog() {
      this.dialogType = 'add'
      this.bookForm = {
        title: '',
        author: '',
        isbn: '',
        publishDate: '',
        description: '',
        cover: ''
      }
      this.dialogVisible = true
    },
    editBook(book) {
      this.dialogType = 'edit'
      this.bookForm = { ...book }
      this.dialogVisible = true
    },
    async deleteBook(book) {
      try {
        await ElMessageBox.confirm(
          'Are you sure you want to delete this book?',
          'Warning',
          {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        )
        // Call delete API
        // await deleteBookApi(book.id)
        ElMessage.success('Deleted successfully')
        // Refresh list
        this.fetchBooks()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('Failed to delete')
        }
      }
    },
    async submitBookForm() {
      try {
        await this.$refs.bookForm.validate()
        if (this.dialogType === 'add') {
          // await addBookApi(this.bookForm)
          ElMessage.success('Added successfully')
        } else {
          // await updateBookApi(this.bookForm)
          ElMessage.success('Updated successfully')
        }
        this.dialogVisible = false
        this.fetchBooks()
      } catch (error) {
        console.error(error)
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchBooks()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchBooks()
    },
    handleCoverSuccess(res, file) {
      this.bookForm.cover = URL.createObjectURL(file.raw)
    },
    beforeCoverUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        ElMessage.error('Cover image can only be in JPG format!')
      }
      if (!isLt2M) {
        ElMessage.error('Cover image size cannot exceed 2MB!')
      }
      return isJPG && isLt2M
    },
    fetchBooks() {
      // Implement logic to fetch book list
      console.log('Fetching book list')
    },
    showPurchaseRequestsDialog() {
      this.purchaseRequestsDialogVisible = true
      this.fetchPurchaseRequests()
    },
    getStatusType(status) {
      const types = {
        Pending: 'warning',
        Approved: 'success',
        Rejected: 'danger'
      }
      return types[status] || 'info'
    },
    async handleApprove(request) {
      try {
        await ElMessageBox.confirm(
          `Are you sure you want to approve the purchase request for "${request.title}"?`,
          'Confirm Approval',
          {
            confirmButtonText: 'Approve',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        )
        request.status = 'Approved'
        ElMessage.success('Purchase request approved successfully')
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('Failed to approve purchase request')
        }
      }
    },
    async handleReject(request) {
      try {
        await ElMessageBox.confirm(
          `Are you sure you want to reject the purchase request for "${request.title}"?`,
          'Confirm Rejection',
          {
            confirmButtonText: 'Reject',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        )
        request.status = 'Rejected'
        ElMessage.success('Purchase request rejected successfully')
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('Failed to reject purchase request')
        }
      }
    },
    fetchPurchaseRequests() {
      console.log('Fetching purchase requests')
    }
  },
  created() {
    this.fetchBooks()
  },

}
</script>

<style scoped>
.book-management {
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
  flex-grow: 1;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.cover-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}

.cover-uploader:hover {
  border-color: #409EFF;
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.cover {
  width: 178px;
  height: 178px;
  display: block;
}
</style> 
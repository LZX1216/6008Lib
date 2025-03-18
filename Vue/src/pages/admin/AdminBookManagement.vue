<template>
  <div class="book-management">
    <div class="page-header">
      <h2>{{ $t('adminBookManagement.bookManagement') }}</h2>
      <div>
        <el-button type="primary" @click="showAddBookDialog">
          {{ $t('adminBookManagement.addNewBook') }}
        </el-button>
        <el-button type="info" @click="showPurchaseRequestsDialog">
          {{ $t('adminBookManagement.viewPurchaseRequests') }}
        </el-button>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="search-section">
      <el-input
        v-model="searchQuery"
        :placeholder="$t('adminBookManagement.searchBooks')"
        class="search-input"
        @keyup.enter="searchBooks"
      >
        <template #append>
          <el-button @click="searchBooks">
            <el-icon><Search /></el-icon>
          </el-button>
        </template>
      </el-input>

      <el-select v-model="filterStatus" :placeholder="$t('adminBookManagement.borrowStatus')" clearable style="width: 150px;">
        <el-option :label="$t('adminBookManagement.all')" value="" />
        <el-option :label="$t('adminBookManagement.available')" value="available" />
        <el-option :label="$t('adminBookManagement.borrowed')" value="borrowed" />
      </el-select>
    </div>

    <!-- Book List -->
    <el-table :data="books" style="width: 100%" default-sort="{ prop: 'id', order: 'descending' }" @sort-change="handleSortChange">
      <el-table-column prop="id" :label="$t('book.id')" width="80" sortable/>
      <el-table-column prop="title" :label="$t('book.title')" sortable/>
      <el-table-column prop="author" :label="$t('book.author')" sortable/>
      <el-table-column prop="isbn" :label="$t('book.isbn')" sortable/>
      <el-table-column prop="publishDate" :label="$t('book.publishDate')" sortable/>
      <el-table-column :label="$t('adminBookManagement.status')" sortable>
        <template #default="scope">
          <el-tag :type="scope.row.available ? 'success' : 'danger'">
            {{ scope.row.available ? $t('adminBookManagement.available') : $t('adminBookManagement.borrowed') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('adminBookManagement.actions')" width="200">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="editBook(scope.row)"
          >
            {{ $t('adminBookManagement.edit') }}
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="deleteBook(scope.row)"
          >
            {{ $t('adminBookManagement.delete') }}
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
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- Add/Edit Book Dialog -->
    <el-dialog
      :title="dialogType === 'add' ? $t('adminBookManagement.addNewBook') : $t('adminBookManagement.editBook')"
      v-model="dialogVisible"
      width="50%"
    >
      <div class="dialog-content">
        <div class="form-content">
          <el-form :model="bookForm" :rules="rules" ref="bookForm" label-width="150px">
            <el-form-item :label="$t('book.title')" prop="title">
              <el-input v-model="bookForm.title" />
            </el-form-item>
            <el-form-item :label="$t('book.author')" prop="author">
              <el-input v-model="bookForm.author" />
            </el-form-item>
            <el-form-item :label="$t('book.publisher')" prop="publisher">
              <el-input v-model="bookForm.publisher" />
            </el-form-item>
            <el-form-item :label="$t('book.isbn')" prop="isbn">
              <el-input v-model="bookForm.isbn" />
            </el-form-item>
            <el-form-item :label="$t('book.publishDate')" prop="publishDate">
              <el-date-picker
                v-model="bookForm.publishDate"
                type="date"
                :placeholder="$t('adminBookManagement.selectDate')"
              />
            </el-form-item>
            <el-form-item :label="$t('book.category')" prop="category">
              <el-input v-model="bookForm.category" />
            </el-form-item>
            <el-form-item :label="$t('book.description')" prop="description">
              <el-input
                v-model="bookForm.description"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item :label="$t('book.location')" prop="location">
              <el-input v-model="bookForm.location" />
            </el-form-item>
            <el-form-item :label="$t('book.callNumber')" prop="callNumber">
              <el-input v-model="bookForm.callNumber" />
            </el-form-item>
            <el-form-item :label="$t('book.availableCopies')" prop="availableCopies">
              <el-input v-model.number="bookForm.availableCopies" type="number" />
            </el-form-item>
            <el-form-item :label="$t('book.totalCopies')" prop="totalCopies">
              <el-input v-model.number="bookForm.totalCopies" type="number" />
            </el-form-item>
            <el-form-item :label="$t('adminBookManagement.available')" prop="available">
              <el-switch v-model="bookForm.available" />
            </el-form-item>
            <el-form-item :label="$t('book.cover')" prop="cover">
              <el-input v-model="bookForm.cover" :placeholder="$t('adminBookManagement.enterCoverImageUrl')" />
            </el-form-item>
          </el-form>
        </div>
        <div class="cover-preview" v-if="bookForm.cover">
          <img :src="bookForm.cover" alt="$t('book.cover')">
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="submitBookForm">
            {{ $t('common.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Purchase Requests Dialog -->
    <el-dialog
      :title="$t('adminBookManagement.purchaseRequests')"
      v-model="purchaseRequestsDialogVisible"
      width="70%"
    >
      <el-table :data="paginatedPurchaseRequests" style="width: 100%" default-sort="{ prop: 'id', order: 'descending' }" @sort-change="handleSortChange">
        <el-table-column prop="title" :label="$t('book.title')" sortable/>
        <el-table-column prop="author" :label="$t('book.author')" sortable/>
        <el-table-column prop="publisher" :label="$t('book.publisher')" sortable/>
        <el-table-column prop="isbn" :label="$t('book.isbn')" sortable/>
        <el-table-column prop="publishDate" :label="$t('book.publishDate')" sortable/>
        <el-table-column prop="reason" :label="$t('helpSupport.reason')" sortable/>
        <el-table-column prop="requestDate" :label="$t('adminBookManagement.requestDate')" width="160" sortable/>
        <el-table-column prop="status" :label="$t('adminBookManagement.status')" width="120" sortable>
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ $t(`adminBookManagement.${scope.row.status.toLowerCase()}`) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('adminBookManagement.actions')" width="200">
          <template #default="scope">
            <el-button
              size="small"
              @click="handleApprove(scope.row)"
              :disabled="scope.row.status !== 'Pending'"
            >
              {{ $t('adminBookManagement.approve') }}
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleReject(scope.row)"
              :disabled="scope.row.status !== 'Pending'"
            >
              {{ $t('adminBookManagement.reject') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          :current-page="purchaseCurrentPage"
          :page-size="purchasePageSize"
          @update:current-page="handlePurchaseCurrentChange"
          @update:page-size="handlePurchaseSizeChange"
          :total="purchaseTotal"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
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
          title: 'Introduction to Algorithms',
          author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
          publisher: 'The MIT Press',
          isbn: '9780262033848',
          publishDate: '2000-01-01',
          category: 'Algorithms',
          cover: 'https://m.media-amazon.com/images/I/61Mw06x2XcL._AC_UL320_.jpg',
          description: 'A comprehensive introduction to the modern study of computer algorithms. It presents many algorithms and covers them in considerable depth, yet makes their design and analysis accessible to all levels of readers.',
          location: 'Computer Science Section',
          callNumber: 'QA76.6.I5858',
          availableCopies: 3,
          totalCopies: 5,
          available: true
        },
        {
          id: 2,
          title: "Artificial Intelligence: A Modern Approach",
          author: "Stuart Russell, Peter Norvig",
          publisher: "Pearson",
          isbn: "9780136042594",
          publishDate: "2009-12-11",
          category: "Artificial Intelligence",
          cover: "https://m.media-amazon.com/images/I/81CDIGTNNFL._AC_UL320_.jpg",
          description: "Artificial Intelligence: A Modern Approach, 3e offers the most comprehensive, up-to-date introduction to the theory and practice of artificial intelligence. Number one in its field, this textbook is ideal for one or two-semester, undergraduate or graduate-level courses in Artificial Intelligence.",
          location: "Computer Science Section",
          callNumber: "Q335.R87",
          availableCopies: 2,
          totalCopies: 3,
          available: true
        },
        {
          id: 3,
          title: "Computer Networks",
          author: "Andrew S. Tanenbaum, David J. Wetherall",
          publisher: "Pearson",
          isbn: "9780132126953",
          publishDate: "2010-07-31",
          category: "Networking",
          cover: "https://m.media-amazon.com/images/I/71pIJGRBg7L._AC_UL320_.jpg",
          description: "Computer Networks, 5/e is appropriate for Computer Networking or Introduction to Networking courses at both the undergraduate and graduate level in Computer Science, Electrical Engineering, CIS, MIS, and Business Departments.",
          location: "Computer Science Section",
          callNumber: "TK5105.5.T36",
          availableCopies: 1,
          totalCopies: 2,
          available: false
        },
      ],
      currentPage: 1,
      pageSize: 10,
      total: 100,
      dialogVisible: false,
      dialogType: 'add',
      bookForm: {
        title: '',
        author: '',
        publisher: '',
        isbn: '',
        publishDate: '',
        category: '',
        cover: '',
        description: '',
        location: '',
        callNumber: '',
        availableCopies: 0,
        totalCopies: 0,
        available: true
      },
      rules: {
        title: [
          { required: true, message: this.$t('adminBookManagement.pleaseEnterTitle'), trigger: 'blur' }
        ],
        author: [
          { required: true, message: this.$t('adminBookManagement.pleaseEnterAuthor'), trigger: 'blur' }
        ],
        isbn: [
          { required: true, message: this.$t('adminBookManagement.pleaseEnterIsbn'), trigger: 'blur' }
        ]
      },
      purchaseRequestsDialogVisible: false,
      allpurchaseRequests: [
        {
          id: 1,
          title: 'Database System Concepts',
          author: 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan',
          publisher: 'McGraw-Hill Education',
          isbn: '9780073523323',
          publishDate: '2013-01-01',
          reason: 'It\'s a good book!',
          requestDate: '2025-03-15',
          status: 'Pending'
        },
        {
          id: 2,
          title: 'Clean Code',
          author: 'Robert C. Martin',
          publisher: 'Pearson',
          isbn: '9780132350884',
          publishDate: '2008-08-01',
          reason: 'Need for code quality training',
          requestDate: '2025-03-16',
          status: 'Pending'
        }
      ],
      purchaseRequests: [],
      purchaseCurrentPage: 1,
      purchasePageSize: 10,
      purchaseTotal: 0
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
        publisher: '',
        isbn: '',
        publishDate: '',
        category: '',
        cover: '',
        description: '',
        location: '',
        callNumber: '',
        availableCopies: 0,
        totalCopies: 0,
        available: true
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
          this.$t('adminBookManagement.confirmDeleteBook'),
          this.$t('adminBookManagement.warning'),
          {
            confirmButtonText: this.$t('common.confirm'),
            cancelButtonText: this.$t('common.cancel'),
            type: 'warning'
          }
        )
        // Call delete API
        // await deleteBookApi(book.id)
        ElMessage.success(this.$t('adminBookManagement.deletedSuccessfully'))
        // Refresh list
        this.fetchBooks()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error(this.$t('adminBookManagement.failedToDelete'))
        }
      }
    },
    async submitBookForm() {
      try {
        await this.$refs.bookForm.validate()
        if (this.dialogType === 'add') {
          // await addBookApi(this.bookForm)
          ElMessage.success(this.$t('adminBookManagement.addedSuccessfully'))
        } else {
          // await updateBookApi(this.bookForm)
          ElMessage.success(this.$t('adminBookManagement.updatedSuccessfully'))
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
    handlePurchaseSizeChange(val) {
      this.purchasePageSize = val;
      this.purchaseCurrentPage = 1; // 切换页大小后回到第一页
      this.fetchPurchaseRequests();
    },
    handlePurchaseCurrentChange(val) {
      this.purchaseCurrentPage = val;
      this.fetchPurchaseRequests();
    },
    handleSortChange(tableType, { prop, order }) {
      let dataArray = tableType === 'books' ? this.books : this.allPurchaseRequests;
      if (order === 'ascending') {
        dataArray.sort((a, b) => {
          if (['publishDate', 'requestDate'].includes(prop)) {
            return new Date(a[prop]) - new Date(b[prop]);
          }
          return a[prop] > b[prop] ? 1 : -1;
        });
      } else if (order === 'descending') {
        dataArray.sort((a, b) => {
          if (['publishDate', 'requestDate'].includes(prop)) {
            return new Date(b[prop]) - new Date(a[prop]);
          }
          return a[prop] < b[prop] ? 1 : -1;
        });
      }
      if (tableType === 'purchaseRequests') {
        this.allPurchaseRequests = [...dataArray];
        this.purchaseCurrentPage = 1; // 排序后重置页码
      }
      this.fetchPurchaseRequests(); // 重新分页
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
          this.$t('adminBookManagement.confirmApproveRequest', { title: request.title }),
          this.$t('adminBookManagement.confirmApproval'),
          {
            confirmButtonText: this.$t('common.approve'),
            cancelButtonText: this.$t('common.cancel'),
            type: 'warning'
          }
        )
        request.status = 'Approved'
        ElMessage.success(this.$t('adminBookManagement.purchaseRequestApproved'))
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error(this.$t('adminBookManagement.failedToApproveRequest'))
        }
      }
    },
    async handleReject(request) {
      try {
        await ElMessageBox.confirm(
          this.$t('adminBookManagement.confirmRejectRequest', { title: request.title }),
          this.$t('adminBookManagement.confirmRejection'),
          {
            confirmButtonText: this.$t('adminBookManagement.reject'),
            cancelButtonText: this.$t('common.cancel'),
            type: 'warning'
          }
        )
        request.status = 'Rejected'
        ElMessage.success(this.$t('adminBookManagement.purchaseRequestRejected'))
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error(this.$t('adminBookManagement.failedToRejectRequest'))
        }
      }
    },
    fetchPurchaseRequests() {
    this.purchaseRequests = this.paginatedPurchaseRequests;
    this.purchaseTotal = this.allPurchaseRequests.length;
  }

  },
  created() {
    this.fetchBooks()
  }
}
</script>

<style scoped>
.book-management {
  padding: 20px;
  min-height: 0;
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

.dialog-content {
  display: flex;
  gap: 20px;
}

.form-content {
  flex: 1;
}

.cover-preview {
  width: 200px;
  height: auto;
}

.cover-preview img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.el-dialog__body .pagination {
  margin: 15px 0;
  padding: 0 20px;
}
</style> 
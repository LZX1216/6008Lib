<template>
  <div class="book-management">
    <div class="page-header">
      <h2>图书管理</h2>
      <el-button type="primary" @click="showAddBookDialog">
        添加新图书
      </el-button>
    </div>

    <!-- 搜索和筛选 -->
    <div class="search-section">
      <el-input
        v-model="searchQuery"
        placeholder="搜索图书..."
        class="search-input"
      >
        <template #append>
          <el-button @click="searchBooks">
            <el-icon><Search /></el-icon>
          </el-button>
        </template>
      </el-input>

      <el-select v-model="filterStatus" placeholder="借阅状态" clearable>
        <el-option label="全部" value="" />
        <el-option label="可借阅" value="available" />
        <el-option label="已借出" value="borrowed" />
      </el-select>
    </div>

    <!-- 图书列表 -->
    <el-table :data="books" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="书名" />
      <el-table-column prop="author" label="作者" />
      <el-table-column prop="isbn" label="ISBN" />
      <el-table-column prop="publishDate" label="出版日期" />
      <el-table-column label="状态">
        <template #default="scope">
          <el-tag :type="scope.row.available ? 'success' : 'danger'">
            {{ scope.row.available ? '可借阅' : '已借出' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button 
            type="primary" 
            size="small" 
            @click="editBook(scope.row)"
          >
            编辑
          </el-button>
          <el-button 
            type="danger" 
            size="small" 
            @click="deleteBook(scope.row)"
          >
            删除
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

    <!-- 添加/编辑图书对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '添加新图书' : '编辑图书'"
      v-model="dialogVisible"
      width="50%"
    >
      <el-form :model="bookForm" :rules="rules" ref="bookForm" label-width="100px">
        <el-form-item label="书名" prop="title">
          <el-input v-model="bookForm.title" />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="bookForm.author" />
        </el-form-item>
        <el-form-item label="ISBN" prop="isbn">
          <el-input v-model="bookForm.isbn" />
        </el-form-item>
        <el-form-item label="出版日期" prop="publishDate">
          <el-date-picker
            v-model="bookForm.publishDate"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="简介" prop="description">
          <el-input
            v-model="bookForm.description"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
        <el-form-item label="封面图片" prop="cover">
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
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitBookForm">
            确定
          </el-button>
        </span>
      </template>
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
          title: '三体',
          author: '刘慈欣',
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
          { required: true, message: '请输入书名', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '请输入作者', trigger: 'blur' }
        ],
        isbn: [
          { required: true, message: '请输入ISBN', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    searchBooks() {
      // 实现搜索逻辑
      console.log('搜索:', this.searchQuery)
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
          '确定要删除这本书吗？',
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        // 调用删除API
        // await deleteBookApi(book.id)
        ElMessage.success('删除成功')
        // 刷新列表
        this.fetchBooks()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('删除失败')
        }
      }
    },
    async submitBookForm() {
      try {
        await this.$refs.bookForm.validate()
        if (this.dialogType === 'add') {
          // await addBookApi(this.bookForm)
          ElMessage.success('添加成功')
        } else {
          // await updateBookApi(this.bookForm)
          ElMessage.success('更新成功')
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
        ElMessage.error('上传封面图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        ElMessage.error('上传封面图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    fetchBooks() {
      // 实现获取图书列表的逻辑
      console.log('获取图书列表')
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
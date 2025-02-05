<template>
  <div class="search-results">
    <div class="search-header">
      <h2>搜索结果: "{{ searchQuery }}"</h2>
      
      <!-- 筛选器 -->
      <div class="filters">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-select v-model="filters.genre" placeholder="选择类型" clearable>
              <el-option
                v-for="item in genres"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="filters.language" placeholder="选择语言" clearable>
              <el-option
                v-for="item in languages"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="filters.availability" placeholder="借阅状态" clearable>
              <el-option label="可借阅" value="available" />
              <el-option label="已借出" value="borrowed" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="sortBy" placeholder="排序方式">
              <el-option label="相关度" value="relevance" />
              <el-option label="出版日期" value="date" />
              <el-option label="评分" value="rating" />
            </el-select>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 搜索结果列表 -->
    <div class="results-list">
      <el-empty v-if="books.length === 0" description="未找到相关图书" />
      
      <el-card v-for="book in books" :key="book.id" class="book-item">
        <el-row :gutter="20">
          <el-col :span="4">
            <img :src="book.cover" class="book-cover" @click="viewBookDetails(book.id)" />
          </el-col>
          <el-col :span="16">
            <div class="book-info">
              <h3 class="book-title" @click="viewBookDetails(book.id)">
                {{ book.title }}
              </h3>
              <p class="book-author">作者: {{ book.author }}</p>
              <p class="book-meta">
                ISBN: {{ book.isbn }} | 出版日期: {{ book.publishDate }}
              </p>
              <div class="book-tags">
                <el-tag 
                  v-for="tag in book.tags" 
                  :key="tag"
                  size="small"
                  class="tag"
                >
                  {{ tag }}
                </el-tag>
              </div>
              <p class="book-description">{{ book.description }}</p>
              <div class="book-rating">
                <el-rate
                  v-model="book.rating"
                  disabled
                  show-score
                  text-color="#ff9900"
                />
                <span class="rating-count">({{ book.ratingCount }}人评分)</span>
              </div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="book-actions">
              <el-tag :type="book.available ? 'success' : 'danger'" class="status-tag">
                {{ book.available ? '可借阅' : '已借出' }}
              </el-tag>
              <el-button 
                type="primary" 
                :disabled="!book.available || !auth.isLoggedIn"
                @click="borrowBook(book.id)"
              >
                借阅
              </el-button>
              <el-button 
                type="info" 
                plain
                :disabled="!auth.isLoggedIn"
                @click="addToWishlist(book.id)"
              >
                加入书单
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        @update:current-page="currentPage = $event"
        @update:page-size="pageSize = $event"
        :total="total"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { auth } from '@/utils/auth.js'
import { ElMessage } from 'element-plus'

export default {
  name: 'SearchResults',
  data() {
    return {
      searchQuery: '',
      books: [
        {
          id: 1,
          title: '三体',
          author: '刘慈欣',
          cover: '/book-covers/1.jpg',
          isbn: '9787536692930',
          publishDate: '2008-01-01',
          description: '文化大革命期间，一次偶然的机会...',
          available: true,
          rating: 4.5,
          ratingCount: 1000,
          tags: ['科幻', '人类文明']
        },
        // 更多图书...
      ],
      filters: {
        genre: '',
        language: '',
        availability: ''
      },
      genres: [
        { value: 'fiction', label: '小说' },
        { value: 'science', label: '科学' },
        { value: 'history', label: '历史' }
      ],
      languages: [
        { value: 'zh', label: '中文' },
        { value: 'en', label: '英文' }
      ],
      sortBy: 'relevance',
      currentPage: 1,
      pageSize: 10,
      total: 100
    }
  },
  computed: {
    auth() {
      return auth
    }
  },
  methods: {
    viewBookDetails(bookId) {
      this.$router.push(`/book/${bookId}`)
    },
    async borrowBook(bookId) {
      try {
        // 调用借阅API
        ElMessage.success('借阅成功！')
      } catch (error) {
        ElMessage.error('借阅失败，请稍后重试')
      }
    },
    addToWishlist(bookId) {
      ElMessage.success('已添加到书单')
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchBooks()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchBooks()
    },
    fetchBooks() {
      // 调用API获取图书列表
      console.log('获取图书列表', {
        page: this.currentPage,
        pageSize: this.pageSize,
        filters: this.filters,
        sortBy: this.sortBy
      })
    }
  },
  created() {
    this.searchQuery = this.$route.query.search || ''
    this.fetchBooks()
  },
  watch: {
    filters: {
      deep: true,
      handler() {
        this.fetchBooks()
      }
    },
    sortBy() {
      this.fetchBooks()
    }
  }
}
</script>

<style scoped>
.search-results {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.search-header {
  margin-bottom: 30px;
}

.filters {
  margin: 20px 0;
}

.book-item {
  margin-bottom: 20px;
}

.book-cover {
  width: 100%;
  height: 150px;
  object-fit: cover;
  cursor: pointer;
}

.book-info {
  padding: 0 20px;
}

.book-title {
  margin: 0;
  cursor: pointer;
  color: #409EFF;
}

.book-title:hover {
  text-decoration: underline;
}

.book-author {
  margin: 5px 0;
  color: #666;
}

.book-meta {
  font-size: 14px;
  color: #999;
}

.book-tags {
  margin: 10px 0;
}

.tag {
  margin-right: 8px;
}

.book-description {
  margin: 10px 0;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.status-tag {
  margin-bottom: 10px;
}

.rating-count {
  font-size: 14px;
  color: #666;
  margin-left: 8px;
}

.pagination {
  margin-top: 30px;
  text-align: center;
}
</style> 
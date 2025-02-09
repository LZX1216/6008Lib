<template>
  <div class="book-list">
    <div class="page-header">
      <h2>图书列表</h2>
      
      <!-- 搜索和筛选 -->
      <div class="search-section">
        <el-input
          v-model="searchQuery"
          placeholder="搜索书名、作者、ISBN..."
          class="search-input"
          style="width: 100%;"
        >
          <template #append>
            <el-button @click="searchBooks">搜索</el-button>
          </template>
        </el-input>
      </div>

      <div class="filter-section">
        <el-select v-model="selectedGenres" multiple placeholder="选择类别" style="width: 150px;">
          <el-option
            v-for="genre in genres"
            :key="genre.value"
            :label="genre.label"
            :value="genre.value"
          />
        </el-select>

        <el-select v-model="borrowStatus" placeholder="借阅状态" style="width: 150px;">
          <el-option label="全部" value="" />
          <el-option label="可借阅" value="available" />
          <el-option label="已借出" value="borrowed" />
        </el-select>

        <el-button type="default" @click="resetFilters">重置</el-button>
      </div>
    </div>

    <!-- 内容区域容器 -->
    <div class="content-container">
      <!-- 卡片视图 -->
      <div v-if="displayMode === 'card'" class="book-grid">
        <el-card 
          v-for="book in filteredBooks" 
          :key="book.id"
          :body-style="{ padding: '0px' }" 
          class="book-card"
        >
          <img :src="book.cover" class="book-cover"/>
          <div class="book-info">
            <h3>{{ book.title }}</h3>
            <p>{{ book.author }}</p>
            <div class="book-rating">
              <el-rate
                v-model="book.rating"
                disabled
                show-score
                text-color="#ff9900"
              />
            </div>
            <el-button 
              type="primary" 
              size="small" 
              @click="viewBookDetails(book.id)"
            >
              查看详情
            </el-button>
          </div>
        </el-card>
      </div>

      <!-- 列表视图 -->
      <el-table v-else :data="filteredBooks">
        <el-table-column label="封面" width="100">
          <template #default="scope">
            <img :src="scope.row.cover" class="table-book-cover"/>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="书名" />
        <el-table-column prop="author" label="作者" width="200" />
        <el-table-column prop="isbn" label="ISBN" width="150" />
        <el-table-column prop="genre" label="类别" width="150" />
        <el-table-column prop="rating" label="评分" width="250">
          <template #default="scope">
            <el-rate v-model="scope.row.rating" disabled show-score />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button 
              type="primary" 
              size="small"
              @click="viewBookDetails(scope.row.id)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          :page-sizes="[10, 20, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { Search } from '@element-plus/icons-vue'

export default {
  name: 'BookList',
  components: {
    Search
  },
  data() {
    return {
      searchQuery: '',
      selectedGenres: [],
      borrowStatus: '',
      languages: [
        { value: 'en', label: '英语' },
        { value: 'zh', label: '中文' },
        { value: 'es', label: '西班牙语' },
        { value: 'fr', label: '法语' }
      ],
      genres: [
        { value: 'fiction', label: '小说' },
        { value: 'science', label: '科学' },
        { value: 'history', label: '历史' },
        { value: 'philosophy', label: '哲学' }
      ],
      books: [
        {
          id: 1,
          title: "人类简史",
          author: "尤瓦尔·赫拉利",
          cover: '/book-covers/1.jpg',
          rating: 4.7
        },
        {
          id: 2,
          title: "1984",
          author: "乔治·奥威尔",
          cover: '/book-covers/2.jpg',
          rating: 4.8
        },
        {
          id: 3,
          title: '三体',
          author: '刘慈欣',
          cover: '/book-covers/3.jpg',
          rating: 4.8,
          isbn: '9787536692930',
          genre: '科幻'
        },
        {
          id: 4,
          title: '百年孤独',
          author: '加西亚·马尔克斯', 
          cover: '/book-covers/4.jpg',
          rating: 4.9,
          isbn: '9787544253994',
          genre: '文学'
        },
        {
          id: 5,
          title: '活着',
          author: '余华',
          cover: '/book-covers/5.jpg',
          rating: 4.9,
          isbn: '9787506365437',
          genre: '文学'
        },
        {
          id: 6,
          title: '动物农场',
          author: '乔治·奥威尔',
          cover: '/book-covers/6.jpg',
          rating: 4.7,
          isbn: '9787532751464',
          genre: '寓言'
        },
        {
          id: 7,
          title: '围城',
          author: '钱钟书',
          cover: '/book-covers/7.jpg',
          rating: 4.8,
          isbn: '9787020090006',
          genre: '文学'
        },
        {
          id: 8,
          title: '平凡的世界',
          author: '路遥',
          cover: '/book-covers/8.jpg',
          rating: 4.9,
          isbn: '9787530216781',
          genre: '文学'
        },
        {
          id: 9,
          title: '追风筝的人',
          author: '卡勒德·胡赛尼',
          cover: '/book-covers/9.jpg',
          rating: 4.8,
          isbn: '9787208061644',
          genre: '文学'
        },
        {
          id: 10,
          title: '月亮与六便士',
          author: '威廉·萨默塞特·毛姆',
          cover: '/book-covers/10.jpg',
          rating: 4.7,
          isbn: '9787544277617',
          genre: '文学'
        }
      ],
      currentPage: 1,
      pageSize: 10,
      total: 100,
      displayMode: 'card'
    }
  },
  computed: {
    filteredBooks() {
      return this.books.filter(book => {
        const matchesSearch = book.title.includes(this.searchQuery) || book.author.includes(this.searchQuery);
        const matchesGenre = this.selectedGenres.length ? this.selectedGenres.includes(book.genre) : true;
        const matchesStatus = this.borrowStatus ? (this.borrowStatus === 'available' ? book.available : !book.available) : true;
        return matchesSearch && matchesGenre && matchesStatus;
      });
    }
  },
  methods: {
    searchBooks() {
      console.log('搜索:', this.searchQuery);
    },
    resetFilters() {
      this.searchQuery = '';
      this.selectedGenres = [];
      this.borrowStatus = '';
    },
    viewBookDetails(bookId) {
      this.$router.push(`/book/${bookId}`);
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    }
  }
}
</script>

<style scoped>
.book-list {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.search-section {
  width: 100%;
  padding: 40px 20px;
  background-color: #f5f7fa;
  margin-bottom: 40px;
  box-sizing: border-box;
  text-align: center;
}

.search-input {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

@media screen and (min-width: 1240px) {
  .search-input {
    width: 1200px;
  }
}

.search-input :deep(.el-input__wrapper) {
  height: 60px;
}

.search-input :deep(.el-input__inner) {
  font-size: 18px;
}

.search-input :deep(.el-input-group__append) button {
  height: 60px;
  width: 60px;
  font-size: 20px;
}

.filter-section {
  max-width: 1200px;
  margin: 20px auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.filter-group {
  display: flex;
  gap: 20px;
}

.filter-select {
  width: 200px;
}

.display-mode {
  margin-left: auto;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.book-card {
  width: 100%;
  margin: 0;
  cursor: pointer;
  transition: transform 0.3s;
}

.book-card:hover {
  transform: translateY(-5px);
}

.book-cover {
  width: 100%;
  aspect-ratio: 37/52;
  object-fit: cover;
}

.book-info {
  padding: 14px;
}

.book-info h3 {
  margin: 0;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-info p {
  color: #666;
  font-size: 14px;
  margin: 5px 0;
}

.book-rating {
  margin: 10px 0;
}

.el-table {
  width: 100%;
}

.table-book-cover {
  width: 80px;
  aspect-ratio: 37/52;
  object-fit: cover;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style> 
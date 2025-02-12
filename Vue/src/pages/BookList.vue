<template>
  <div class="book-list">
    <div class="page-header">
      <h2>Book List</h2>
      
      <!-- Search and Filter -->
      <div class="search-section">
        <el-input
          v-model="searchQuery"
          placeholder="Search by title, author, ISBN..."
          class="search-input"
          style="width: 100%;"
        >
          <template #append>
            <el-button @click="searchBooks">Search</el-button>
          </template>
        </el-input>
      </div>

      <div class="filter-section">
        <el-select v-model="selectedGenres" multiple placeholder="Select genres" style="width: 150px;">
          <el-option
            v-for="genre in genres"
            :key="genre.value"
            :label="genre.label"
            :value="genre.value"
          />
        </el-select>

        <el-select v-model="borrowStatus" placeholder="Borrow status" style="width: 150px;">
          <el-option label="All" value="" />
          <el-option label="Available" value="available" />
          <el-option label="Borrowed" value="borrowed" />
        </el-select>

        <el-button @click="resetFilters">重置</el-button>
      </div>
    </div>

    <!-- Content container -->
    <div class="content-container">
      <!-- Card view -->
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
              View Details
            </el-button>
          </div>
        </el-card>
      </div>

      <!-- List view -->
      <el-table v-else :data="filteredBooks">
        <el-table-column label="封面" width="100">
          <template #default="scope">
            <img :src="scope.row.cover" class="table-book-cover"/>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="Title" />
        <el-table-column prop="author" label="Author" width="200" />
        <el-table-column prop="isbn" label="ISBN" width="150" />
        <el-table-column prop="genre" label="Genre" width="150" />
        <el-table-column prop="rating" label="Rating" width="250">
          <template #default="scope">
            <el-rate v-model="scope.row.rating" disabled show-score />
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="120">
          <template #default="scope">
            <el-button 
              type="primary" 
              size="small"
              @click="viewBookDetails(scope.row.id)"
            >
              View Details
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
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
        { value: 'en', label: 'English' },
        { value: 'zh', label: 'Chinese' },
        { value: 'es', label: 'Spanish' },
        { value: 'fr', label: 'French' }
      ],
      genres: [
        { value: 'fiction', label: 'Fiction' },
        { value: 'science', label: 'Science' },
        { value: 'history', label: 'History' },
        { value: 'philosophy', label: 'Philosophy' }
      ],
      books: [
        {
          id: 1,
          title: "Sapiens: A Brief History of Humankind",
          author: "Yuval Noah Harari",
          cover: '/book-covers/1.jpg',
          rating: 4.7
        },
        {
          id: 2,
          title: "1984",
          author: "George Orwell",
          cover: '/book-covers/2.jpg',
          rating: 4.8
        },
        {
          id: 3,
          title: 'The Three-Body Problem',
          author: 'Cixin Liu',
          cover: '/book-covers/3.jpg',
          rating: 4.8,
          isbn: '9787536692930',
          genre: 'Science Fiction'
        },
        {
          id: 4,
          title: 'One Hundred Years of Solitude',
          author: 'Gabriel García Márquez',
          cover: '/book-covers/4.jpg',
          rating: 4.9,
          isbn: '9787544253994',
          genre: 'Literature'
        },
        {
          id: 5,
          title: 'To Live',
          author: 'Yu Hua',
          cover: '/book-covers/5.jpg',
          rating: 4.9,
          isbn: '9787506365437',
          genre: 'Literature'
        },
        {
          id: 6,
          title: 'Animal Farm',
          author: 'George Orwell',
          cover: '/book-covers/6.jpg',
          rating: 4.7,
          isbn: '9787532751464',
          genre: 'Allegory'
        },
        {
          id: 7,
          title: 'Fortress Besieged',
          author: 'Qian Zhongshu',
          cover: '/book-covers/7.jpg',
          rating: 4.8,
          isbn: '9787020090006',
          genre: 'Literature'
        },
        {
          id: 8,
          title: 'Ordinary World',
          author: 'Lu Yao',
          cover: '/book-covers/8.jpg',
          rating: 4.9,
          isbn: '9787530216781',
          genre: 'Literature'
        },
        {
          id: 9,
          title: 'The Kite Runner',
          author: 'Khaled Hosseini',
          cover: '/book-covers/9.jpg',
          rating: 4.8,
          isbn: '9787208061644',
          genre: 'Literature'
        },
        {
          id: 10,
          title: 'The Moon and Sixpence',
          author: 'W. Somerset Maugham',
          cover: '/book-covers/10.jpg',
          rating: 4.7,
          isbn: '9787544277617',
          genre: 'Literature'
        },
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
      console.log('Search:', this.searchQuery);
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

.search-input :deep() {
  height: 60px;
}

.search-input :deep() {
  font-size: 18px;
}

.search-input :deep() button {
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
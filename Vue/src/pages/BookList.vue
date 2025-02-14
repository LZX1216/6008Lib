<template>
  <div class="book-list">
    <!-- Title -->
    <div class="header-section">
      <h2 class="page-title">Book List</h2>
    </div>

    <!-- Search bar -->
    <div class="search-section">
      <div class="search-container">
        <el-select v-model="selectedFilter" placeholder="Filter by" style="width: 120px;">
          <el-option label="Title" value="title" />
          <el-option label="Author" value="author" />
          <el-option label="ISBN" value="isbn" />
        </el-select>

        <el-input
          v-model="searchQuery"
          placeholder="Search books..."
          class="search-input"
          clearable
          @clear="clearSearch"
          style="flex: 1; max-width: 500px; margin: 0 10px;"
        >
          <template #append>
            <el-button type="primary" @click="searchBooks">Search</el-button>
          </template>
        </el-input>
      </div>
    </div>

    <!-- Search and filter -->
    <div class="filter-section">
      <div class="filter-group">
        <el-select v-model="selectedGenres" multiple placeholder="Genres" style="width: 180px;">
          <el-option
            v-for="genre in genres"
            :key="genre.value"
            :label="genre.label"
            :value="genre.value"
          />
        </el-select>

        <el-select v-model="selectedLanguage" placeholder="Language" style="width: 120px; margin-left: 10px;">
          <el-option label="English" value="en" />
          <el-option label="Chinese" value="zh" />
        </el-select>

        <div class="sort-buttons">
          <el-button 
            v-for="sort in sortOptions" 
            :key="sort.key"
            @click="toggleSort(sort.key)"
            :type="sortOption === sort.key ? 'primary' : ''"
            class="sort-button"
          >
            {{ sort.label }}
            <i :class="sortIcon(sort.key)" :style="sortStyle(sort.key)"></i>
          </el-button>
        </div>

        <el-button @click="resetFilters" style="margin-left: 10px;">Reset All</el-button>
      </div>

      <div class="view-toggle">
        <el-button-group>
          <el-button
            :type="displayMode === 'card' ? 'primary' : ''"
            @click="displayMode = 'card'"
          >
            <i class="el-icon-picture-outline"></i>
          </el-button>
          <el-button
            :type="displayMode === 'list' ? 'primary' : ''"
            @click="displayMode = 'list'"
          >
            <i class="el-icon-menu"></i>
          </el-button>
        </el-button-group>
      </div>
    </div>

    <!-- Content container -->
    <div class="content-container">
      <!-- Card view -->
      <div v-if="displayMode === 'card' && filteredBooks.length" class="book-grid">
        <el-card v-for="book in filteredBooks" :key="book.id" class="book-card">
          <div class="book-cover-container">
            <img :src="book.cover" class="book-cover" />
          </div>
          <div class="book-info">
            <h3 class="book-title">{{ book.title }}</h3>
            <p class="book-author">{{ book.author }}</p>
            <div class="book-actions">
              <div class="book-rating">
                <el-rate v-model="book.rating" disabled show-score text-color="#ff9900" />
              </div>
              <el-button type="primary" size="small" @click="viewBookDetails(book.id)">
                View Details
              </el-button>
            </div>
          </div>
        </el-card>
      </div>

      <!-- List view -->
      <el-table v-else-if="displayMode === 'list' && filteredBooks.length" :data="filteredBooks">
        <el-table-column label="Cover" width="100">
          <template #default="scope">
            <img :src="scope.row.cover" class="table-book-cover"/>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="Title" />
        <el-table-column prop="author" label="Author" width="200" />
        <el-table-column prop="isbn" label="ISBN" width="150" />
        <el-table-column prop="genre" label="Genre" width="150" />
        <el-table-column label="Rating" width="200">
          <template #default="scope">
            <el-rate
              v-model="scope.row.rating"
              disabled
              show-score
              text-color="#ff9900"
            />
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="pagination-container">
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
import { PictureFilled, Menu } from '@element-plus/icons-vue';


export default {
  name: 'BookList',
  components: {
    Search
  },
  data() {
    return {
      searchQuery: '',
      selectedFilter: 'title',
      selectedGenres: [],
      selectedLanguage: '',
      sortOption: '',
      sortOrder: 'asc', // Default sort order
      learningProgress: 0,
      genres: [
        { value: 'fiction', label: 'Fiction' },
        { value: 'science', label: 'Science' },
        { value: 'history', label: 'History' },
        { value: 'philosophy', label: 'Philosophy' }
      ],
      sortOptions: [
        { key: 'releaseTime', label: 'Release Time' },
        { key: 'rating', label: 'Rating' },
        { key: 'comments', label: 'Comments' },
        { key: 'borrows', label: 'Borrows' }
      ],
      books: [
      {
        id: 1,
        title: "Introduction to Algorithms",
        author: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
        cover: "https://m.media-amazon.com/images/I/61Mw06x2XcL._AC_UL320_.jpg",
        rating: 4.5,
        isbn: "9780262033848",
        genre: "Algorithms"
      },
      {
        id: 2,
        title: "Artificial Intelligence: A Modern Approach",
        author: "Stuart Russell, Peter Norvig",
        cover: "https://m.media-amazon.com/images/I/81CDIGTNNFL._AC_UL320_.jpg",
        rating: 4.6,
        isbn: "9780136042594",
        genre: "Artificial Intelligence"
      },
      {
        id: 3,
        title: "Computer Networks",
        author: "Andrew S. Tanenbaum, David J. Wetherall",
        cover: "https://m.media-amazon.com/images/I/71pIJGRBg7L._AC_UL320_.jpg",
        rating: 4.4,
        isbn: "9780132126953",
        genre: "Networking"
      },
      {
        id: 4,
        title: "Database System Concepts",
        author: "Abraham Silberschatz, Henry F. Korth, S. Sudarshan",
        cover: "https://m.media-amazon.com/images/I/81B3Cv13cYL._AC_UL320_.jpg",
        rating: 4.3,
        isbn: "9780073523323",
        genre: "Databases"
      },
      {
        id: 5,
        title: "Operating System Concepts",
        author: "Abraham Silberschatz, Peter B. Galvin, Greg Gagne",
        cover: "https://m.media-amazon.com/images/I/81SwKCia7VL._AC_UL320_.jpg",
        rating: 4.5,
        isbn: "9781118063330",
        genre: "Operating Systems"
      },
      {
        id: 6,
        title: "Compilers: Principles, Techniques, and Tools",
        author: "Alfred V. Aho, Monica S. Lam, Ravi Sethi, Jeffrey D. Ullman",
        cover: "https://m.media-amazon.com/images/I/71MvtEJneKL._AC_UL320_.jpg",
        rating: 4.4,
        isbn: "9780321486813",
        genre: "Compilers"
      },
      {
        id: 7,
        title: "Computer Architecture: A Quantitative Approach",
        author: "John L. Hennessy, David A. Patterson",
        cover: "https://m.media-amazon.com/images/I/71zrCDfb73S._AC_UL320_.jpg",
        rating: 4.7,
        isbn: "9780123838728",
        genre: "Computer Architecture"
      },
      {
        id: 8,
        title: "The Elements of Computing Systems: Building a Modern Computer from First Principles",
        author: "Noam Nisan, Shimon Schocken",
        cover: "https://m.media-amazon.com/images/I/71tRTKR3NOL._AC_UL320_.jpg",
        rating: 4.6,
        isbn: "9780262640688",
        genre: "Computer Systems"
      },
      {
        id: 9,
        title: "Clean Code: A Handbook of Agile Software Craftsmanship",
        author: "Robert C. Martin",
        cover: "https://m.media-amazon.com/images/I/51E2055ZGUL._AC_UL320_.jpg",
        rating: 4.7,
        isbn: "9780132350885",
        genre: "Software Engineering"
      },
      {
        id: 10,
        title: "Design Patterns: Elements of Reusable Object-Oriented Software",
        author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
        cover: "https://m.media-amazon.com/images/I/81IGFC6oFmL._AC_UL320_.jpg",
        rating: 4.6,
        isbn: "9780201633610",
        genre: "Software Design"
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
        return matchesSearch && matchesGenre;
      });
    }
  },
  methods: {
    searchBooks() {
      console.log('Search:', this.searchQuery);
    },
    clearSearch() {
      this.searchQuery = '';
    },
    resetFilters() {
      this.searchQuery = '';
      this.selectedGenres = [];
      this.selectedLanguage = '';
    },
    toggleSort(option) {
      if (this.sortOption === option) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortOption = option;
        this.sortOrder = 'asc';
      }
    },
    sortIcon(key) {
      return this.sortOption === key 
        ? (this.sortOrder === 'asc' ? 'el-icon-top' : 'el-icon-bottom')
        : 'el-icon-bottom'
    },
    sortStyle(key) {
      return {
        color: this.sortOption === key 
          ? (this.sortOrder === 'asc' ? '#409EFF' : '#F56C6C')
          : '#C0C4CC',
        marginLeft: '5px'
      }
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
  padding: 24px;
  background-color: #f0f2f5;
  min-height: 100vh;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.header-section {
  margin-bottom: 24px;
}

.page-title {
  color: #303133;
  font-size: 28px;
  font-weight: 700;
  border-bottom: 3px solid #409EFF;
  padding-bottom: 12px;
  display: inline-block;
}

.search-section {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.search-container {
  display: flex;
  align-items: center;
  max-width: 800px;
}

.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 16px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 15px;
}

.sort-button {
  padding: 8px 15px;
  border-radius: 6px;
  transition: all 0.3s;
}

.sort-button:hover {
  background-color: #f0f2f5;
}

.view-toggle {
  display: flex;
  gap: 8px;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.book-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 8px !important;
  overflow: hidden;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}

.book-cover-container {
  width: 100%;
  box-sizing: border-box;
  height: 270px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.book-cover {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.book-title, .book-author {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  width: 100%;
}


.book-title {
  font-size: 16px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.book-author {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.book-actions {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 80px;
}

.book-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  padding: 16px;
}

.book-info h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 10px;
}

.book-info p {
  font-size: 16px;
  color: #606266;
  margin: 0 0 10px;
}

.book-rating {
  margin-bottom: 8px;
}

.pagination-container {
  padding: 20px;
  background: #fff;
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.el-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.table-book-cover {
  width: 100%;
  height: auto;
  max-height: 100px;
  object-fit: cover;
  border-radius: 4px;
  object-fit: contain;
  border-radius: 8px 8px 0 0;
}
</style>
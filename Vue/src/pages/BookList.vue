<template>
  <div class="book-list">
    <!-- Title -->
    <div class="header-section">
      <h2 class="page-title">Books</h2>
    </div>

    <!-- Search bar & View control -->
    <div class="search-section">
      <el-select 
        v-model="selectedFilter" 
        placeholder="Filter by"
        class="filter-select"
        @change="updatePlaceholder"
      >
          <el-option label="Title" value="title" />
          <el-option label="Author" value="author" />
          <el-option label="ISBN" value="isbn" />
        </el-select>

        <el-input
          v-model="searchQuery"
          :placeholder="inputPlaceholder"
          class="search-input"
          clearable
          @clear="clearSearch"
        >
          <template #append>
            <el-button 
              type="primary" 
              class="search-btn"
              @click="searchBooks"
            >
            <svg
      t="1739607142653"
      class="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="9530"
      width="20"
      height="20"
    >
      <path
        d="M998.059 876.893L799.245 678.079c47.386-69.553 75.115-153.559 75.115-244.06C874.36 194.305 680.018 0.005 440.341 0.005 200.648 0.005 6.332 194.305 6.332 434.019c0 239.715 194.315 434.015 434.009 434.015 84.01 0 162.395-23.937 228.848-65.271 0.646 0.71 1.219 1.462 1.896 2.14l199.481 199.481c29.669 29.658 82.246 25.166 117.457-10.034 35.202-35.211 39.694-87.788 10.036-117.457zM93.135 434.02c0-191.46 155.756-347.211 347.206-347.211 191.455 0 347.216 155.751 347.216 347.211S631.796 781.231 440.341 781.231c-191.449 0-347.206-155.752-347.206-347.211z"
        fill="#ffffff"
        p-id="9531"
      ></path>
    </svg>
            </el-button>
          </template>
        </el-input>

        <!-- View Control -->
        <div class="view-controls">
          <el-button-group>
    <el-button
      :type="displayMode === 'card' ? 'primary' : ''"
      @click="displayMode = 'card'"
      class="view-btn"
    >
      <IconCardList :color="displayMode === 'card' ? '#fff' : '#090909'" />
    </el-button>
    <el-button
      :type="displayMode === 'list' ? 'primary' : ''"
      @click="displayMode = 'list'"
      class="view-btn"
    >
      <IconCardList :color="displayMode === 'list' ? '#fff' : '#090909'" />
    </el-button>
  </el-button-group>
        </div>

    </div>

    <div class="main-container">
      <!-- Sidebar -->
      <div class="filter-sidebar">
        <h3 class="filter-title">🔍 Advanced Filters</h3>
        <!-- Rating Filter -->
        <div class="filter-group">
          <h4>Rating Range</h4>
          <el-slider 
            v-model="ratingRange" 
            range 
            :marks="{0: '0', 5: '5'}"
            :min="0"
            :max="5"
            :step="0.1"
            :format-tooltip="formatRating"
          />
        </div>
        
        <!-- Year Filter -->
        <div class="filter-group">
          <h4>Publication Year</h4>
          <el-slider 
            v-model="yearRange" 
            range 
            :marks="{1990: '1990', 2025: '2025'}"
            :min="1990" 
            :max="2025"
            :step="1"
            :format-tooltip="formatYear"
          />
        </div>

        <!-- Language Tags -->
        <div class="filter-group">
            <h4>Popular Tags</h4>
            <div class="tag-container">
              <el-tag 
                v-for="language in languages"
                :key="language.value"
                :type="selectedLanguages.includes(language.value) ? 'primary' : 'info'"
                @click="toggleLanguage(language.value)"
                class="sidebar-tag"
              >
                {{ language.label }}
              </el-tag>
            </div>
        </div>

        
        <!-- Genre Tags -->
          <div class="filter-group">
            <h4>Popular Tags</h4>
            <div class="tag-container">
              <el-tag 
                v-for="genre in genres"
                :key="genre.value"
                :type="selectedGenres.includes(genre.value) ? 'primary' : 'info'"
                @click="toggleGenre(genre.value)"
                class="sidebar-tag"
              >
                {{ genre.label }}
              </el-tag>
            </div>
        </div>
        <el-button 
          @click="resetFilters" 
          class="reset-btn"
        >
          Reset All
        </el-button>
      </div>

    <!-- Content container -->
    <div class="content-container">
      <!-- Card view -->
      <div v-if="displayMode === 'card' && filteredBooks.length" class="book-grid">
        <el-card 
          v-for="book in filteredBooks" 
          :key="book.id" 
          class="book-card"
        >
          <div class="book-cover-container">
            <img :src="book.cover" class="book-cover" />
          </div>
          <div class="book-info">
            <h3 class="book-title">{{ book.title }}</h3>
            <p class="book-author">{{ book.author }}</p>
            <div class="book-rating">
                <el-rate v-model="book.rating" disabled show-score text-color="#ff9900" />
            </div>

              
              <el-button-group class="book-actions">
              <el-button type="primary" size="small" @click="addToList(book.id)">
                Add to list
              </el-button>
              <el-button type="primary" size="small" @click="viewBookDetails(book.id)">
                View Details
              </el-button>
            </el-button-group>

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
  </div>
</template>

<script>
import { Search } from '@element-plus/icons-vue'
import IconCardList from '@/components/IconCardList.vue';


export default {
  name: 'BookList',
  components: {
    Search,
    IconCardList
  },
  data() {
    return {
      ratingRange: [0, 5],
      yearRange: [1990, 2025],
      searchQuery: '',
      selectedFilter: 'title',
      selectedGenres: [],
      selectedLanguages: [],
      sortOption: '',
      sortOrder: 'asc', // Default sort order
      learningProgress: 0,
      languages: [
        {value: 'Chinese', label: 'Chinese' },
        {value: 'English', label: 'English' },
        {value: 'Spanish', label: 'Spanish' }
      ],
      genres: [
        { value: 'Algorithms', label: 'Algorithms' },
        { value: 'Artificial Intelligence', label: 'Artificial Intelligence' },
        { value: 'Networking', label: 'Networking' },
        { value: 'Databases', label: 'Databases' },
        { value: 'Operating Systems', label: 'Operating Systems' },
        { value: 'Computer Architecture', label: 'Computer Architecture' },
        { value: 'Software Engineering', label: 'Software Engineering' },
        { value: 'Software Design', label: 'Software Design' },
        { value: 'Compilers', label: 'Compilers' }
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
        publishYear: "2000",
        language: "English",
        genre: "Algorithms"
      },
      {
        id: 2,
        title: "Artificial Intelligence: A Modern Approach",
        author: "Stuart Russell, Peter Norvig",
        cover: "https://m.media-amazon.com/images/I/81CDIGTNNFL._AC_UL320_.jpg",
        rating: 4.6,
        isbn: "9780136042594",
        publishYear: "2004",
        language: "English",
        genre: "Artificial Intelligence"
      },
      {
        id: 3,
        title: "Computer Networks",
        author: "Andrew S. Tanenbaum, David J. Wetherall",
        cover: "https://m.media-amazon.com/images/I/71pIJGRBg7L._AC_UL320_.jpg",
        rating: 4.4,
        isbn: "9780132126953",
        publishYear: "2005",
        language: "English",
        genre: "Networking"
      },
      {
        id: 4,
        title: "Database System Concepts",
        author: "Abraham Silberschatz, Henry F. Korth, S. Sudarshan",
        cover: "https://m.media-amazon.com/images/I/81B3Cv13cYL._AC_UL320_.jpg",
        rating: 4.3,
        isbn: "9780073523323",
        publishYear: "2013",
        language: "English",
        genre: "Databases"
      },
      {
        id: 5,
        title: "Operating System Concepts",
        author: "Abraham Silberschatz, Peter B. Galvin, Greg Gagne",
        cover: "https://m.media-amazon.com/images/I/81SwKCia7VL._AC_UL320_.jpg",
        rating: 4.5,
        isbn: "9781118063330",
        publishYear: "2017",
        language: "English",
        genre: "Operating Systems"
      },
      {
        id: 6,
        title: "Compilers: Principles, Techniques, and Tools",
        author: "Alfred V. Aho, Monica S. Lam, Ravi Sethi, Jeffrey D. Ullman",
        cover: "https://m.media-amazon.com/images/I/71MvtEJneKL._AC_UL320_.jpg",
        rating: 4.4,
        isbn: "9780321486813",
        publishYear: "2011",
        language: "English",
        genre: "Compilers"
      },
      {
        id: 7,
        title: "Computer Architecture: A Quantitative Approach",
        author: "John L. Hennessy, David A. Patterson",
        cover: "https://m.media-amazon.com/images/I/71zrCDfb73S._AC_UL320_.jpg",
        rating: 4.7,
        isbn: "9780123838728",
        publishYear: "2020",
        language: "English",
        genre: "Computer Architecture"
      },
      {
        id: 8,
        title: "The Elements of Computing Systems: Building a Modern Computer from First Principles",
        author: "Noam Nisan, Shimon Schocken",
        cover: "https://m.media-amazon.com/images/I/71tRTKR3NOL._AC_UL320_.jpg",
        rating: 4.6,
        isbn: "9780262640688",
        publishYear: "2016",
        language: "English",
        genre: "Computer Systems"
      },
      {
        id: 9,
        title: "Clean Code: A Handbook of Agile Software Craftsmanship",
        author: "Robert C. Martin",
        cover: "https://m.media-amazon.com/images/I/51E2055ZGUL._AC_UL320_.jpg",
        rating: 4.7,
        isbn: "9780132350885",
        publishYear: "2005",
        language: "Chinese",
        genre: "Software Engineering"
      },
      {
        id: 10,
        title: "Design Patterns: Elements of Reusable Object-Oriented Software",
        author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
        cover: "https://m.media-amazon.com/images/I/81IGFC6oFmL._AC_UL320_.jpg",
        rating: 4.6,
        isbn: "9780201633610",
        publishYear: "2018",
        language: "Spanish",
        genre: "Software Design"
      },
      ].map(book => ({
        ...book,
      })),
      searchFieldMap: {
        title: ['title'],
        author: ['author'],
        isbn: ['isbn']
      },
      currentPage: 1,
      pageSize: 10,
      total: 100,
      displayMode: 'card',
      inputPlaceholder: 'Search books...'
    }
  },
  computed: {
    filteredBooks() {
      return this.books.filter(book => {
        const matchesRating = book.rating >= this.ratingRange[0] && 
                            book.rating <= this.ratingRange[1];
        const matchesYear = book.publishYear >= this.yearRange[0] && 
                          book.publishYear <= this.yearRange[1];
        const matchesLanguage = this.selectedLanguages.length ? 
                          this.selectedLanguages.includes(book.language) : true;
        const matchesGenre = this.selectedGenres.length ? 
                          this.selectedGenres.includes(book.genre) : true;
        const searchFields = this.searchFieldMap[this.selectedFilter] || ['title'];
        const matchesSearch = this.searchQuery === '' || 
                            searchFields.some(field => 
                              String(book[field]).toLowerCase()
                              .includes(this.searchQuery.toLowerCase()));
        
        return matchesRating && matchesYear && matchesLanguage && matchesGenre && matchesSearch;
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
      this.selectedLanguage = [];
    },
    toggleSort(option) {
      if (this.sortOption === option) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortOption = option;
        this.sortOrder = 'asc';
      }
    },
    toggleLanguage(language) {
      if (this.selectedLanguages.includes(language)) {
        this.selectedLanguages = this.selectedLanguages.filter(l => l !== language)
      } else {
        this.selectedLanguages = [...this.selectedLanguages, language]
      }
    },
    toggleGenre(genre) {
      if (this.selectedGenres.includes(genre)) {
        this.selectedGenres = this.selectedGenres.filter(g => g !== genre)
      } else {
        this.selectedGenres = [...this.selectedGenres, genre]
      }
    },
    formatYear(value) {
      return `${value}`
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
    },
    updatePlaceholder() {
      switch (this.selectedFilter) {
        case 'title':
          this.inputPlaceholder = 'Search by title...';
          break;
        case 'author':
          this.inputPlaceholder = 'Search by author...';
          break;
        case 'isbn':
          this.inputPlaceholder = 'Search by ISBN...';
          break;
        default:
          this.inputPlaceholder = 'Search books...';
      }
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
  margin-bottom: 20px;
}

.page-title {
  color: #303133;
  font-size: 28px;
  font-weight: 700;
  border-bottom: 3px solid #409EFF;
  padding-bottom: 12px;
  display: inline-block;
}

.main-container {
  display: flex;
  gap: 2rem;
  margin: 0 auto;
}

.filter-sidebar {
  width: 280px;
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: var(--el-box-shadow-light);
  margin-right: 2rem;
}

.full-width-select {
  width: 100%;
  margin: 0.8rem 0;
}

.search-section {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
  background: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);
}

.search-container {
  flex: 1;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-select {
  width: 160px;
}

.search-input {
  flex: 1;
  height: 60px;
  font-size: large;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-right: 20px;
}

.search-input :deep(.el-input__inner) {
  transition: all 0.3s;
  background: rgba(248,250,252,0.8);
}

.search-input:hover :deep(.el-input__inner) {
  background: rgba(255,255,255,1);
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.search-input :deep(.el-input-group__append) {
  background-color: var(--el-color-primary);
  border-radius: 0 8px 8px 0;
}

.search-btn {
  background: var(--gradient-primary);
  border: none;
}

.search-section {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(0,0,0,0.05);
}

.filter-title {
  color: #2c3e50;
  font-size: 18px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f2f5;
}

.tag-filter .el-tag {
  margin: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.sort-btn {
  padding: 0.6rem 1rem;
  border-radius: 8px;
}

.view-btn {
  padding: 0.6rem;
  border-radius: 8px;
  width: 50px;
  height: 50px;
}

.reset-btn {
  width: 100%;
  margin-top: 1rem;
  background: linear-gradient(135deg, #f8f9fa, #ffffff);
  border-color: var(--el-border-color);
  color: var(--el-text-color-regular);
}

.reset-btn:hover {
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}

.view-controls {
  margin-left: auto;
  display: flex;
  gap: 0.5rem;
}


.filter-select {
  width: 100px;
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
  margin-bottom: 1.5rem;
}

.filter-group h4 {
  color: var(--el-text-color-primary);
  font-size: 14px;
  margin-bottom: 0.8rem;
  font-weight: 600;
}

.sidebar-tag {
  width: 100%;
  justify-content: flex-start;
  border-radius: 6px;
  padding: 10px 16px;
  margin: 2px 0;
  transition: all 0.2s;
  border: 1px solid var(--el-border-color);
}

.sidebar-tag.primary {
  background-color: var(--el-color-primary-light-9);
  border-color: var(--el-color-primary-light-7);
  color: var(--el-color-primary);
}

.sidebar-tag.info {
  background-color: var(--el-fill-color-light);
  color: var(--el-text-color-regular);
}

.sidebar-tag:hover {
  transform: translateX(5px);
  box-shadow: var(--el-box-shadow-light);
}

.sidebar-tag:active {
  transform: scale(0.98);
}

.tag-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.view-toggle {
  display: flex;
  gap: 8px;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.book-card {
  position: relative;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), 
             box-shadow 0.3s ease;
}

.book-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(255,255,255,0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.book-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 12px 32px rgba(0,0,0,0.12);
}

.book-card:hover::before {
  opacity: 1;
}

.book-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(149,157,165,0.2);
  transform: scale(1.05);
}

.book-cover-container {
  width: 100%;
  box-sizing: border-box;
  height: 270px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 8px 8px 0 0;
  overflow: hidden;
}

.book-cover {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
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


  justify-content: space-between;

  height: 40px;
}

.book-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  align-items: center;
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
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(0,0,0,0.05);
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

.content-container {
  flex: 1;
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: var(--el-box-shadow-light);
}

.el-button--primary {
  background-color: #409EFF;
  border-color: #409EFF;
}

.el-button--primary:hover {
  background: var(--gradient-primary);
  opacity: 0.9;
}

.el-tag--primary {
  background-color: #ecf5ff;
  border-color: #d9ecff;
  color: #409EFF;
}

.el-select, .el-input, .el-button {
  height: 40px;
}

.el-input__wrapper {
  height: 100%;
  border-radius: 8px;
}

.el-select :deep(.el-input__inner) {
  height: 100%;
}

:deep(.el-slider__button) {
  width: 16px;
  height: 16px;
  border: 2px solid var(--el-color-primary);
}

:deep(.el-slider__bar) {
  background-color: var(--el-color-primary);
}

:deep(.el-slider__stop) {
  width: 4px;
  height: 4px;
}

.pagination-container {
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(0,0,0,0.05);
}

:deep(.el-pagination.is-background .btn-prev),
:deep(.el-pagination.is-background .btn-next),
:deep(.el-pagination.is-background .el-pager li) {
  transition: all 0.3s;
  border-radius: 8px;
  background: rgba(248,250,252,0.8);
  border: 1px solid rgba(0,0,0,0.05);
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background: var(--el-color-primary);
  box-shadow: 0 2px 8px rgba(64,158,255,0.2);
}

:root {
  --el-color-primary: #3b82f6;
  --el-color-primary-light-3: #60a5fa;
  --gradient-primary: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
}
</style>
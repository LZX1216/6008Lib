<template>
  <div class="book-list">
    <!-- Title -->
    <div class="header-section">
      <h2 class="page-title">{{ $t('bookList.pageTitle') }}</h2>
    </div>

    <!-- Search bar & View control -->
    <div class="search-section">
      <el-select
        v-model="selectedFilter"
        :placeholder="$t('bookList.filterBy')"
        class="filter-select"
        @change="updatePlaceholder"
      >
        <el-option :label="$t('book.title')" value="title"/>
        <el-option :label="$t('book.author')" value="author"/>
        <el-option :label="$t('book.isbn')" value="isbn"/>
      </el-select>

      <el-input
        v-model="searchQuery"
        :placeholder="inputPlaceholder"
        @keyup.enter="searchBooks"
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
            <el-icon><Search /></el-icon>
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
            <el-icon><Grid /></el-icon>
          </el-button>
          <el-button
            :type="displayMode === 'list' ? 'primary' : ''"
            @click="displayMode = 'list'"
            class="view-btn"
          >
            <el-icon><Memo /></el-icon>
          </el-button>
        </el-button-group>
      </div>
    </div>

    <div class="main-container">
      <!-- Sidebar -->
      <div class="filter-sidebar">
        <h3 class="filter-title">{{ $t('bookList.advancedFilters') }}</h3>

        <!-- Sort Options -->
        <div class="filter-group">
          <h4>{{ $t('bookList.sortBy') }}</h4>
          <el-select v-model="sortOption" :placeholder="$t('bookList.selectSortOption')">
            <el-option :label="$t('book.publicationYear')" value="publishYear" />
            <el-option :label="$t('book.rating')" value="rating" />
            <el-option :label="$t('book.commentCount')" value="commentCount" />
          </el-select>
          <el-select v-model="sortOrder" :placeholder="$t('bookList.order')">
            <el-option :label="$t('bookList.ascending')" value="asc" />
            <el-option :label="$t('bookList.descending')" value="desc" />
          </el-select>
        </div>

        <!-- Rating Filter -->
        <div class="filter-group">
          <h4>{{ $t('bookList.ratingRange') }}</h4>
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
          <h4>{{ $t('bookList.yearRange') }}</h4>
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

        <!-- Category Tags -->
        <div class="filter-group">
          <h4>{{ $t('bookList.popularTags') }}</h4>
          <div class="tag-container">
            <el-tag
              v-for="category in categories"
              :key="category.value"
              :type="selectedCategories.includes(category.value) ? 'primary' : 'info'"
              @click="toggleCategory(category.value)"
              class="sidebar-tag"
            >
              {{ category.label }}
            </el-tag>
          </div>
        </div>
        <el-button
          @click="resetFilters"
          class="reset-btn"
        >
          {{ $t('bookList.resetAll') }}
        </el-button>
      </div>

      <!-- Content container -->
      <div class="content-container">
        <!-- Card view -->
        <div v-if="displayMode === 'card' && filteredBooks.length" class="book-grid">
          <el-card
            v-for="book in sortedBooks"
            :key="book.id"
            class="book-card"
          >
            <div class="book-cover-container">
              <img :src="book.cover" class="book-cover" alt="" />
            </div>
            <div class="book-info">
              <h3 class="book-title" :title="book.title">{{ book.title }}</h3>
              <p class="book-author" :title="book.author">{{ book.author }}</p>
              <div class="book-rating">
                <el-rate v-model="book.rating" disabled show-score text-color="#ff9900" />
              </div>
              <el-button-group class="book-actions">
                <el-button type="primary" size="big" @click="addToList(book.id)">
                  <el-icon><Plus /></el-icon>
                  <span class="button - text">{{ $t('bookList.list') }}</span>
                </el-button>
                <el-button type="primary" size="big" @click="viewBookDetails(book.id)">
                  <el-icon><View /></el-icon>
                  <span class="button - text">{{ $t('bookList.detail') }}</span>
                </el-button>
              </el-button-group>
            </div>
          </el-card>
        </div>

        <!-- List view -->
        <el-table v-else-if="displayMode === 'list' && filteredBooks.length" :data="sortedBooks">
          <el-table-column :label="$t('book.cover')" width="100">
            <template #default="scope">
              <img :src="scope.row.cover" class="table-book-cover" alt="" />
            </template>
          </el-table-column>
          <el-table-column prop="title" :label="$t('book.title')" />
          <el-table-column prop="author" :label="$t('book.author')" width="200" />
          <el-table-column prop="isbn" :label="$t('book.isbn')" width="150" />
          <el-table-column prop="category" :label="$t('book.category')" width="150" />
          <el-table-column :label="$t('book.rating')" width="200">
            <template #default="scope">
              <el-rate
                v-model="scope.row.rating"
                disabled
                show-score
                text-color="#ff9900"
              />
            </template>
          </el-table-column>
          <el-table-column :label="$t('bookList.actions')" width="200">
            <template #default="scope">
              <el-button-group class="book-actions">
                <el-button type="primary" size="small" @click="addToList(scope.row.id)">
                  {{ $t('bookList.addToList') }}
                </el-button>
                <el-button type="primary" size="small" @click="viewBookDetails(scope.row.id)">
                  {{ $t('bookList.viewDetails') }}
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>

        <!-- Pagination -->
        <div class="pagination-container">
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
      </div>
    </div>
  </div>
</template>

<script>
import {Search} from '@element-plus/icons-vue'
import { Grid, Memo } from '@element-plus/icons-vue'
import { Plus, View } from '@element-plus/icons-vue'

export default {
  name: 'BookList',
  components: {
    Search,
    Grid,
    Memo,
    Plus,
    View
  },
  data() {
    return {
      ratingRange: [0, 5],
      yearRange: [1990, 2025],
      searchQuery: '',
      selectedFilter: 'title',
      selectedCategories: [],
      sortOption: 'rating',
      sortOrder: 'desc', // Default sort order
      categories: [
        {value: 'Algorithms', label: 'Algorithms'},
        {value: 'Artificial Intelligence', label: 'Artificial Intelligence'},
        {value: 'Networking', label: 'Networking'},
        {value: 'Databases', label: 'Databases'},
        {value: 'Operating Systems', label: 'Operating Systems'},
        {value: 'Computer Architecture', label: 'Computer Architecture'},
        {value: 'Software Engineering', label: 'Software Engineering'},
        {value: 'Software Design', label: 'Software Design'},
        {value: 'Compilers', label: 'Compilers'}
      ],
      sortOptions: [
        {key: 'releaseTime', label: 'Release Time'},
        {key: 'rating', label: 'Rating'},
        {key: 'comments', label: 'Comments'},
        {key: 'borrows', label: 'Borrows'}
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
          category: "Algorithms"
        },
        {
          id: 2,
          title: "Artificial Intelligence: A Modern Approach",
          author: "Stuart Russell, Peter Norvig",
          cover: "https://m.media-amazon.com/images/I/81CDIGTNNFL._AC_UL320_.jpg",
          rating: 4.6,
          isbn: "9780136042594",
          publishYear: "2004",
          category: "Artificial Intelligence"
        },
        {
          id: 3,
          title: "Computer Networks",
          author: "Andrew S. Tanenbaum, David J. Wetherall",
          cover: "https://m.media-amazon.com/images/I/71pIJGRBg7L._AC_UL320_.jpg",
          rating: 4.4,
          isbn: "9780132126953",
          publishYear: "2005",
          category: "Networking"
        },
        {
          id: 4,
          title: "Database System Concepts",
          author: "Abraham Silberschatz, Henry F. Korth, S. Sudarshan",
          cover: "https://m.media-amazon.com/images/I/81B3Cv13cYL._AC_UL320_.jpg",
          rating: 4.3,
          isbn: "9780073523323",
          publishYear: "2013",
          category: "Databases"
        },
        {
          id: 5,
          title: "Operating System Concepts",
          author: "Abraham Silberschatz, Peter B. Galvin, Greg Gagne",
          cover: "https://m.media-amazon.com/images/I/81SwKCia7VL._AC_UL320_.jpg",
          rating: 4.5,
          isbn: "9781118063330",
          publishYear: "2017",
          category: "Operating Systems"
        },
        {
          id: 6,
          title: "Compilers: Principles, Techniques, and Tools",
          author: "Alfred V. Aho, Monica S. Lam, Ravi Sethi, Jeffrey D. Ullman",
          cover: "https://m.media-amazon.com/images/I/71MvtEJneKL._AC_UL320_.jpg",
          rating: 4.4,
          isbn: "9780321486813",
          publishYear: "2011",
          category: "Compilers"
        },
        {
          id: 7,
          title: "Computer Architecture: A Quantitative Approach",
          author: "John L. Hennessy, David A. Patterson",
          cover: "https://m.media-amazon.com/images/I/71zrCDfb73S._AC_UL320_.jpg",
          rating: 4.7,
          isbn: "9780123838728",
          publishYear: "2020",
          category: "Computer Architecture"
        },
        {
          id: 8,
          title: "The Elements of Computing Systems: Building a Modern Computer from First Principles",
          author: "Noam Nisan, Shimon Schocken",
          cover: "https://m.media-amazon.com/images/I/71tRTKR3NOL._AC_UL320_.jpg",
          rating: 4.6,
          isbn: "9780262640688",
          publishYear: "2016",
          category: "Computer Systems"
        },
        {
          id: 9,
          title: "Clean Code: A Handbook of Agile Software Craftsmanship",
          author: "Robert C. Martin",
          cover: "https://m.media-amazon.com/images/I/51E2055ZGUL._AC_UL320_.jpg",
          rating: 4.7,
          isbn: "9780132350885",
          publishYear: "2005",
          category: "Software Engineering"
        },
        {
          id: 10,
          title: "Design Patterns: Elements of Reusable Object-Oriented Software",
          author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
          cover: "https://m.media-amazon.com/images/I/81IGFC6oFmL._AC_UL320_.jpg",
          rating: 4.6,
          isbn: "9780201633610",
          publishYear: "2018",
          category: "Software Design"
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
      inputPlaceholder: this.$t('search.searchBooks')
    }
  },
  computed: {
    filteredBooks() {
      return this.books.filter(book => {
        const matchesRating = book.rating >= this.ratingRange[0] &&
            book.rating <= this.ratingRange[1];
        const matchesYear = book.publishYear >= this.yearRange[0] &&
            book.publishYear <= this.yearRange[1];
        const matchesCategory = this.selectedCategories.length ?
            this.selectedCategories.includes(book.category) : true;
        const searchFields = this.searchFieldMap[this.selectedFilter] || ['title'];
        const matchesSearch = this.searchQuery === '' ||
            searchFields.some(field =>
                String(book[field]).toLowerCase()
                    .includes(this.searchQuery.toLowerCase()));

        return matchesRating && matchesYear && matchesCategory && matchesSearch;
      });
    },
    sortedBooks() {
      return this.filteredBooks.sort((a, b) => {
        let comparison = 0;
        if (this.sortOption === 'publishYear') {
          comparison = a.publishYear - b.publishYear;
        } else if (this.sortOption === 'rating') {
          comparison = a.rating - b.rating;
        } else if (this.sortOption === 'commentCount') {
          comparison = (a.commentCount || 0) - (b.commentCount || 0);
        }
        return this.sortOrder === 'asc' ? comparison : -comparison;
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
      this.selectedCategories = [];
      this.ratingRange = [0, 5];
      this.yearRange = [1990, 2025];
    },
    toggleSort(option) {
      if (this.sortOption === option) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortOption = option;
        this.sortOrder = 'asc';
      }
    },
    toggleCategory(category) {
      if (this.selectedCategories.includes(category)) {
        this.selectedCategories = this.selectedCategories.filter(c => c !== category)
      } else {
        this.selectedCategories = [...this.selectedCategories, category]
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
          this.inputPlaceholder = this.$t('search.searchByTitle');
          break;
        case 'author':
          this.inputPlaceholder = this.$t('search.searchByAuthor');
          break;
        case 'isbn':
          this.inputPlaceholder = this.$t('search.searchByISBN');
          break;
        default:
          this.inputPlaceholder = this.$t('search.searchBooks');
      }
    },
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
  font-size: 28px;
  color: #2c3e50;
  font-weight: 600;
  border-bottom: 3px solid #3b82f6;
  padding-bottom: 8px;
  display: inline-block;
}

.main-container {
  display: flex;
  gap: 24px;
}

.filter-sidebar {
  flex: 0 0 250px;
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.full-width-select {
  width: 100%;
  margin: 0.8rem 0;
}

.search-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f8fafc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-container {
  flex: 1;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-select {
  width: 120px;
}

.search-input {
  flex: 1;
}

.search-input :deep(.el-input__inner) {
  transition: all 0.3s;
  background: rgba(248, 250, 252, 0.8);
}

.search-input:hover :deep(.el-input__inner) {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-input :deep(.el-input-group__append) {
  background-color: var(--el-color-primary);
  border-radius: 0 8px 8px 0;
}

.search-btn {
  padding: 12px 20px;
}

.search-btn .el-icon {
    color: #ffffff;
}

.search-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 2px 12px rgba(59, 130, 246, 0.3);
}

.search-section {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(0, 0, 0, 0.05);
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
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.filter-group {
  margin-bottom: 20px;
}

.filter-group h4 {
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
}

.sidebar-tag {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 16px;
  padding: 4px 12px;
  font-size: 14px;
  border: none;
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
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sidebar-tag:active {
  transform: scale(0.98);
}

.sidebar-tag.el-tag--info {
  background-color: #f3f4f6;
  color: #4b5563;
}

.sidebar-tag.el-tag--info:hover {
  background-color: #e5e7eb;
  color: #1f2937;
}

.sidebar-tag.el-tag--primary {
  background-color: #3b82f6;
  color: white;
}

.sidebar-tag.el-tag--primary:hover {
  background-color: #2563eb;
}

.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
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
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
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
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.book-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.book-card:hover::before {
  opacity: 1;
}

.book-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(149, 157, 165, 0.2);
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

.book-title, .book-author {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  width: 100%;
  text-align: center;
}

.book-actions {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 15px;
}

.book-actions .el-button {
  flex: 1;
  margin: 0 5px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  width: 45px;
}

.book-actions .el-button:first-child {
  margin-left: 0;
}

.book-actions .el-button:last-child {
  margin-right: 0;
}

.book-actions .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.book-actions .el-button--primary {
  border: none;
}

.book-actions .el-button--default {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
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
  margin-top: 24px;
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.el-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.table-book-cover {
  width: 100%;
  height: auto;
  max-height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.content-container {
  flex: 1;
}

.el-button {
  transition: all 0.3s ease;
  height: 40px;
}

.el-button--default:hover {
  background-color: #e5e7eb;
  border-color: #d1d5db;
  color: #1f2937;
}

.el-button--primary {
  background-color: #409EFF;
  border-color: #409EFF;
}

.el-button--primary:hover {
  background-color: #2c6ecb;
  border-color: #2c6ecb;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transform: translateY(-2px);
}

.el-tag--primary {
  background-color: #ecf5ff;
  border-color: #d9ecff;
  color: #409EFF;
}

.el-select, .el-input {
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
  margin-top: 24px;
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: center;
}

:deep(.el-pagination) {
  font-weight: normal;
}

:deep(.el-pagination .el-select .el-input) {
  width: 110px;
}

:deep(.el-pagination .el-select .el-input .el-input__inner) {
  padding-right: 25px;
}

:deep(.el-pagination button:disabled) {
  background-color: #f8fafc;
}

:deep(.el-pager li) {
  background-color: #ffffff;

}

:deep(.el-pager li.active) {
  background-color: #3b82f6;
  color: #ffffff;
  border-color: #3b82f6;
}

:deep(.el-pagination.is-background .btn-prev),
:deep(.el-pagination.is-background .btn-next),
:deep(.el-pagination.is-background .el-pager li) {
  transition: all 0.3s;
  border-radius: 8px;
  background: rgba(248, 250, 252, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background: var(--el-color-primary);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

:root {
  --el-color-primary: #3b82f6;
  --el-color-primary-light-3: #60a5fa;
  --gradient-primary: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
}

:deep(.el-select__wrapper),
:deep(.el-input__wrapper) {
  height: 100%;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: none;
  background: rgba(248, 250, 252, 0.8);
}

:deep(.el-select__wrapper:hover),
:deep(.el-input__wrapper:hover) {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

:deep(.el-select .el-input__inner),
:deep(.el-input .el-input__inner) {
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 14px;
}

@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
  }

  .filter-sidebar {
    flex: none;
    width: 100%;
    margin-bottom: 24px;
  }

  .book-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  :deep(.el-pagination__total) {
    display: none;
  }

  :deep(.el-pagination__sizes) {
    display: none;
  }

  :deep(.el-pager li:not(.active)) {
    display: none;
  }

  :deep(.el-pager li.active) {
    display: inline-block;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.header-section {
  animation: fadeIn 0.8s ease-out;
}

.search-section {
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.main-container {
  animation: fadeIn 1s ease-out 0.4s both;
}

.filter-sidebar {
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

.content-container {
  animation: fadeInUp 0.8s ease-out 0.8s both;
}

.book-card, .el-table__row {
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards;
}

.book-card:nth-child(10n+1), .el-table__row:nth-child(10n+1) { animation-delay: 0.1s; }
.book-card:nth-child(10n+2), .el-table__row:nth-child(10n+2) { animation-delay: 0.2s; }
.book-card:nth-child(10n+3), .el-table__row:nth-child(10n+3) { animation-delay: 0.3s; }
.book-card:nth-child(10n+4), .el-table__row:nth-child(10n+4) { animation-delay: 0.4s; }
.book-card:nth-child(10n+5), .el-table__row:nth-child(10n+5) { animation-delay: 0.5s; }
.book-card:nth-child(10n+6), .el-table__row:nth-child(10n+6) { animation-delay: 0.6s; }
.book-card:nth-child(10n+7), .el-table__row:nth-child(10n+7) { animation-delay: 0.7s; }
.book-card:nth-child(10n+8), .el-table__row:nth-child(10n+8) { animation-delay: 0.8s; }
.book-card:nth-child(10n+9), .el-table__row:nth-child(10n+9) { animation-delay: 0.9s; }
.book-card:nth-child(10n), .el-table__row:nth-child(10n) { animation-delay: 1s; }

.book-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.el-table__row {
  transition: background-color 0.3s ease;
}

.el-table__row:hover {
  background-color: #f5f7fa;
}

.pagination-container {
  animation: fadeIn 0.8s ease-out 1.2s both;
}

@media (max-width: 768px) {
  .header-section,
  .search-section,
  .main-container,
  .filter-sidebar,
  .content-container,
  .book-card,
  .el-table__row,
  .pagination-container {
    animation-name: fadeIn;
    animation-duration: 0.5s;
    animation-delay: 0s;
  }
}

.button-text {
  margin-left: 8px; /* Add some space between icon and text */
}

@media (max-width: 768px) {
  .button-text {
    display: none; /* Hide text on small screens */
  }
}
</style>
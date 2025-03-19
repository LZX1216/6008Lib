<template>
  <div class="paper-list">
    <!-- Title -->
    <div class="header-section">
      <h2 class="page-title">{{ $t('paperList.pageTitle') }}</h2>
    </div>

    <!-- Search bar -->
    <div class="search-section">
      <el-select
        v-model="selectedFilter"
        :placeholder="$t('paperList.filterBy')"
        class="filter-select"
        @change="updatePlaceholder"
      >
        <el-option :label="$t('paper.title')" value="title"/>
        <el-option :label="$t('paper.authors')" value="authors"/>
        <el-option :label="$t('paper.doi')" value="doi"/>
      </el-select>

      <el-input
        v-model="searchQuery"
        :placeholder="inputPlaceholder"
        @keyup.enter="searchPapers"
        class="search-input"
        clearable
        @clear="clearSearch"
      >
        <template #append>
          <el-button
            type="primary"
            class="search-btn"
            @click="searchPapers"
          >
            <el-icon><Search /></el-icon>
          </el-button>
        </template>
      </el-input>
    </div>

    <div class="main-container">
      <!-- Sidebar -->
      <div class="filter-sidebar">
        <h3 class="filter-title">{{ $t('paperList.advancedFilters') }}</h3>

        <!-- Sort Options -->
        <div class="filter-group">
          <h4>{{ $t('paperList.sortBy') }}</h4>
          <el-select v-model="sortOption" :placeholder="$t('paperList.selectSortOption')">
            <el-option :label="$t('paper.publicationYear')" value="publicationYear" />
            <el-option :label="$t('paper.citationCount')" value="citationCount" />
            <el-option :label="$t('paper.rating')" value="rating" />
          </el-select>
          <el-select v-model="sortOrder" :placeholder="$t('paperList.order')">
            <el-option :label="$t('paperList.ascending')" value="asc" />
            <el-option :label="$t('paperList.descending')" value="desc" />
          </el-select>
        </div>

        <!-- Rating Filter -->
        <div class="filter-group">
          <h4>{{ $t('paperList.ratingRange') }} </h4>
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
          <h4>{{ $t('paperList.yearRange') }}</h4>
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

        <!-- Field Tags -->
        <div class="filter-group">
          <h4>{{ $t('paperList.popularFields') }}</h4>
          <div class="tag-container">
            <el-tag
              v-for="field in fields"
              :key="field.value"
              :type="selectedFields.includes(field.value) ? 'primary' : 'info'"
              @click="toggleField(field.value)"
              class="sidebar-tag"
            >
              {{ field.label }}
            </el-tag>
          </div>
        </div>

        <div class="filter-group">
          <h4>{{ $t('paperList.citationFilter') }}</h4>
          <div class="citation-filter">
            <el-input-number 
              v-model="citationFilter.min" 
              :min="0" 
              :placeholder="$t('paperList.minCitation')"
            />
            <span class="filter-separator">-</span>
            <el-input-number 
              v-model="citationFilter.max" 
              :min="citationFilter.min" 
              :placeholder="$t('paperList.maxCitation')"
            />
            <el-select 
              v-model="citationFilter.timeRange" 
              class="time-range-select"
            >
              <el-option
                v-for="item in [
                  { value: 'all', label: $t('paperList.allTime') },
                  { value: '1y', label: $t('paperList.last1Year') },
                  { value: '3y', label: $t('paperList.last3Years') },
                  { value: '5y', label: $t('paperList.last5Years') }
                ]"
                :key="item.value"
                v-bind="item"
              />
            </el-select>
          </div>
        </div>

        <el-button
          @click="resetFilters"
          class="reset-btn"
        >
          {{ $t('paperList.resetAll') }}
        </el-button>
      </div>

      <!-- Content container -->
      <div class="content-container">
        <!-- List view -->
        <el-table :data="sortedPapers" class="paper-table">
          <el-table-column :label="$t('paper.title')" prop="title" />
          <el-table-column :label="$t('paper.authors')" prop="authors" width="250" />
          <el-table-column :label="$t('paper.doi')" prop="doi" width="180" />
          <el-table-column :label="$t('paper.field')" prop="field" width="150" />
          <el-table-column :label="$t('paper.publicationYear')" prop="publicationYear" width="120" />
          <el-table-column :label="$t('paper.rating')" width="180">
            <template #default="scope">
              <el-rate
                v-model="scope.row.rating"
                disabled
                show-score
                text-color="#ff9900"
              />
            </template>
          </el-table-column>
          <el-table-column :label="$t('paperList.actions')" width="200">
            <template #default="scope">
              <el-button-group class="paper-actions">
                <el-button type="primary" size="small" @click="addToReadingList(scope.row.id)">
                  {{ $t('paperList.addToList') }}
                </el-button>
                <el-button type="primary" size="small" @click="viewPaperDetails(scope.row.id)">
                  {{ $t('paperList.viewDetails') }}
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
            @update:current-page="handleCurrentChange"
            @update:page-size="handleSizeChange"
            :total="total"
            :page-sizes="[10, 20, 50]"
            layout="total, sizes, prev, pager, next, jumper"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Search } from '@element-plus/icons-vue'
import { Plus, View } from '@element-plus/icons-vue'

export default {
  name: 'PaperList',
  components: {
    Search,
    Plus,
    View
  },
  data() {
    return {
      ratingRange: [0, 5],
      yearRange: [1990, 2025],
      searchQuery: '',
      selectedFilter: 'title',
      selectedFields: [],
      sortOption: 'publicationYear',
      sortOrder: 'desc',
      fields: [ // 替换category为field
        {value: 'Computer Science', label: 'Computer Science'},
        {value: 'Artificial Intelligence', label: 'Artificial Intelligence'},
        {value: 'Machine Learning', label: 'Machine Learning'},
        {value: 'Neuroscience', label: 'Neuroscience'},
        {value: 'Biotechnology', label: 'Biotechnology'}
      ],
      papers: [
        {
          id: 1,
          title: "Attention Is All You Need",
          authors: "Vaswani, Ashish; Shazeer, Noam; Parmar, Niki",
          doi: "10.48550/arXiv.1706.03762",
          publicationYear: 2017,
          field: "Computer Science",
          rating: 4.8,
          citationCount: 1234
        },
        {
          id: 2,
          title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
          authors: "Devlin, Jacob; Chang, Ming-Wei; Lee, Kenton",
          doi: "10.48550/arXiv.1810.04805",
          publicationYear: 2018,
          field: "Natural Language Processing",
          rating: 4.7,
          citationCount: 2345
        },
      ],
      searchFieldMap: {
        title: ['title'],
        authors: ['authors'],
        doi: ['doi']
      },
      currentPage: 1,
      pageSize: 10,
      total: 100,
      inputPlaceholder: this.$t('search.searchPapers'),
      sortOptions: [
        { value: 'citationCount', label: this.$t('paper.citationCount') },
        { value: 'citationRate', label: this.$t('paper.citationRate') }
      ],
      citationFilter: {
      min: 0,
      max: 5000,
      timeRange: 'all'
    },
    publicationDateRange: []
    }
  },
  computed: {
    filteredPapers() {
      return this.papers.filter(paper => {
        const matchesRating = paper.rating >= this.ratingRange[0] &&
                            paper.rating <= this.ratingRange[1];
        const matchesYear = paper.publicationYear >= this.yearRange[0] &&
                           paper.publicationYear <= this.yearRange[1];
        const matchesField = this.selectedFields.length ?
                           this.selectedFields.includes(paper.field) : true;
        const searchFields = this.searchFieldMap[this.selectedFilter] || ['title'];
        const matchesSearch = this.searchQuery === '' ||
                            searchFields.some(field =>
                              String(paper[field]).toLowerCase()
                               .includes(this.searchQuery.toLowerCase()));
        const citationTimeCondition = this.citationFilter.timeRange === 'all' || 
          paper.publicationYear >= (new Date().getFullYear() - parseInt(this.citationFilter.timeRange));
        const matchesCitation = paper.citationCount >= this.citationFilter.min && paper.citationCount <= this.citationFilter.max
      return matchesRating && matchesYear && matchesField && matchesSearch && citationTimeCondition && matchesCitation      });
    },
    sortedPapers() {
      return this.filteredPapers.sort((a, b) => {
        let comparison = 0;
        if (this.sortOption === 'publicationYear') {
          comparison = a.publicationYear - b.publicationYear;
        } else if (this.sortOption === 'citationCount') {
          comparison = (a.citationCount || 0) - (b.citationCount || 0);
        } else if (this.sortOption === 'rating') {
          comparison = a.rating - b.rating;
        }
        return this.sortOrder === 'asc' ? comparison : -comparison;
      });
    }
  },
  methods: {
    searchPapers() {
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
      this.citationFilter = {
        min: 0,
        max: 5000,
        timeRange: 'all'
      };
      this.publicationDateRange = []
    },
    toggleSort(option) {
      if (this.sortOption === option) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortOption = option;
        this.sortOrder = 'asc';
      }
    },
    toggleField(field) {
      if (this.selectedFields.includes(field)) {
        this.selectedFields = this.selectedFields.filter(f => f !== field)
      } else {
        this.selectedFields = [...this.selectedFields, field]
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
    formatRating(value) {
      return `${value}`
    },
    formatYear(value) {
      return `${value}`
    },
    viewPaperDetails(paperId) {
      this.$router.push(`/paper/${paperId}`);
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
        case 'doi':
          this.inputPlaceholder = this.$t('search.searchByDOI');
          break;
        default:
          this.inputPlaceholder = this.$t('search.searchPapers');
      }
    },
    addToReadingList(paperId) {
      console.log('Add to reading list:', paperId);
    },
  }
}
</script>

<style scoped>
.paper-list {
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

.citation-filter {
  display: grid;
  grid-template-columns: 1fr 24px 1fr 120px;
  gap: 8px;
  align-items: center;
}

.filter-separator {
  text-align: center;
  color: #999;
}

.time-range-select {
  width: 120px;
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

.paper-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.paper-actions {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 15px;
}

.paper-actions .el-button {
  flex: 1;
  margin: 0 5px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  width: 45px;
}

.paper-actions .el-button:first-child {
  margin-left: 0;
}

.paper-actions .el-button:last-child {
  margin-right: 0;
}

.paper-actions .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.paper-actions .el-button--primary {
  border: none;
}

.paper-actions .el-button--default {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
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

.table-paper-cover {
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

  .citation-filter {
    grid-template-columns: 1fr;
  }

  .filter-separator {
    display: none;
  }
    
  .el-input-number,
  .time-range-select {
    width: 100%;
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
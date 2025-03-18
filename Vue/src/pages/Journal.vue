<template>
    <div class="journal-container">
      <el-card class="header-section">
        <template #header>
          <div class="section-header">
            <h1 class="main-title">{{ $t('journal.title') }}</h1>
            <div class="search-filter">
              <el-input
                v-model="searchQuery"
                :placeholder="$t('journal.searchPlaceholder')"
                class="search-input"
                clearable
              >
                <template #prefix>
                  <el-icon><search /></el-icon>
                </template>
              </el-input>
              <el-select
                v-model="selectedPartition"
                :placeholder="$t('journal.filterPartition')"
                class="filter-select"
                clearable
              >
                <el-option
                  v-for="item in partitionOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
        </template>
      </el-card>
  
      <el-card class="journal-table-section">
        <el-table
          :data="filteredJournals"
          style="width: 100%"
          stripe
          @sort-change="handleSortChange"
        >
          <el-table-column
            prop="name"
            :label="$t('journal.journalName')"
            sortable="custom"
            min-width="220"
          >
            <template #default="scope">
              <el-link
                type="primary"
                :href="scope.row.website"
                target="_blank"
                class="journal-link"
              >
                {{ scope.row.name }}
              </el-link>
            </template>
          </el-table-column>
          
          <el-table-column
            prop="impactFactor"
            :label="$t('journal.impactFactor')"
            sortable="custom"
            width="200"
          />
          
          <el-table-column
            prop="partition"
            :label="$t('journal.partition')"
            width="120"
          >
            <template #default="scope">
              <el-tag effect="dark" :type="getPartitionColor(scope.row.partition)">
                {{ scope.row.partition }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column
            :label="$t('journal.submissionLink')"
            width="180"
          >
            <template #default="scope">
              <el-button
                type="success"
                size="small"
                @click="copySubmissionLink(scope.row.submissionUrl)"
              >
                <el-icon><document-copy /></el-icon>
                {{ $t('journal.copyLink') }}
              </el-button>
            </template>
          </el-table-column>
          
          <el-table-column
            prop="publisher"
            :label="$t('journal.publisher')"
            width="180"
          />
          
          <el-table-column
            prop="frequency"
            :label="$t('journal.frequency')"
            width="120"
          />
        </el-table>
      </el-card>
  
      <el-card class="disclaimer-section">
        <p class="disclaimer-text">
          {{ $t('journal.disclaimer') }}
        </p>
      </el-card>
    </div>
  </template>
  
  <script>
  import { ElMessage } from 'element-plus'
  import { Search, DocumentCopy } from '@element-plus/icons-vue'
  
  export default {
    name: 'Journal',
    components: {
      Search,
      DocumentCopy
    },
    data() {
      return {
        searchQuery: '',
        selectedPartition: '',
        sortProp: 'impactFactor',
        sortOrder: 'descending',
        journals: [
          {
            name: 'IEEE Transactions on Pattern Analysis and Machine Intelligence',
            impactFactor: '24.314',
            partition: 'Q1',
            publisher: 'IEEE',
            frequency: 'Monthly',
            website: 'https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=34',
            submissionUrl: 'https://mc.manuscriptcentral.com/tpami-cs'
          },
          {
            name: 'Journal of Machine Learning Research',
            impactFactor: '6.053',
            partition: 'Q1',
            publisher: 'JMLR',
            frequency: 'Quarterly',
            website: 'https://www.jmlr.org/',
            submissionUrl: 'https://jmlr.org/submit.html'
          },
          {
            name: 'ACM Transactions on Computer Systems',
            impactFactor: '3.789',
            partition: 'Q2',
            publisher: 'ACM',
            frequency: 'Bimonthly',
            website: 'https://dl.acm.org/journal/tocs',
            submissionUrl: 'https://mc.manuscriptcentral.com/tocs'
          }
        ],
        partitionOptions: [
          { value: 'Q1', label: 'JCR Q1' },
          { value: 'Q2', label: 'JCR Q2' },
          { value: 'Q3', label: 'JCR Q3' },
          { value: 'Q4', label: 'JCR Q4' }
        ]
      }
    },
    computed: {
      filteredJournals() {
        let result = this.journals.filter(journal => {
          const matchesSearch = journal.name.toLowerCase().includes(this.searchQuery.toLowerCase())
          const matchesPartition = this.selectedPartition ? 
            journal.partition === this.selectedPartition : true
          return matchesSearch && matchesPartition
        })
  
        if (this.sortProp) {
          result = result.sort((a, b) => {
            const valA = a[this.sortProp]
            const valB = b[this.sortProp]
            if (typeof valA === 'string') {
              return this.sortOrder === 'ascending' ? 
                valA.localeCompare(valB) : valB.localeCompare(valA)
            }
            return this.sortOrder === 'ascending' ? valA - valB : valB - valA
          })
        }
  
        return result
      }
    },
    methods: {
      getPartitionColor(partition) {
        const colors = {
          Q1: 'success',
          Q2: 'primary',
          Q3: 'warning',
          Q4: 'danger'
        }
        return colors[partition] || 'info'
      },
      handleSortChange({ prop, order }) {
        this.sortProp = prop
        this.sortOrder = order || 'descending'
      },
      copySubmissionLink(url) {
        navigator.clipboard.writeText(url)
          .then(() => {
            ElMessage.success(this.$t('journal.copySuccess'))
          })
          .catch(() => {
            ElMessage.error(this.$t('journal.copyError'))
          })
      }
    }
  }
  </script>
  
  <style scoped>
  .journal-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .header-section {
    margin-bottom: 24px;
    border-radius: 12px;
    animation: fadeInUp 0.6s ease-out;
  }
  
  .main-title {
    color: #2c3e50;
    font-size: 2rem;
    margin: 0;
    padding-bottom: 10px;
    border-bottom: 3px solid #409eff;
  }
  
  .search-filter {
    display: flex;
    gap: 20px;
    margin-top: 20px;
  }
  
  .search-input {
    max-width: 400px;
  }
  
  .filter-select {
    width: 200px;
  }
  
  .journal-table-section {
    animation: fadeInUp 0.6s ease-out 0.2s both;
  }
  
  .journal-link {
    font-weight: 600;
    font-size: 1rem;
  }
  
  .disclaimer-section {
    margin-top: 20px;
    background-color: #f8f9fa;
    animation: fadeInUp 0.6s ease-out 0.4s both;
  }
  
  .disclaimer-text {
    color: #6c757d;
    line-height: 1.6;
    margin: 0;
  }
  
  :deep(.el-table__row:hover) {
    background-color: #f8fafc !important;
  }
  
  :deep(.el-table th.el-table__cell) {
    background-color: #f8f9fa;
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
  
  @media (max-width: 768px) {
    .journal-container {
      padding: 15px;
    }
  
    .main-title {
      font-size: 1.5rem;
    }
  
    .search-filter {
      flex-direction: column;
      gap: 10px;
    }
  
    .search-input,
    .filter-select {
      width: 100%;
      max-width: none;
    }
  
    :deep(.el-table) {
      font-size: 14px;
    }
  
    .journal-link {
      font-size: 14px;
    }
  }
  
  @media (max-width: 480px) {
    .main-title {
      font-size: 1.3rem;
    }
  
    :deep(.el-table td),
    :deep(.el-table th) {
      padding: 8px 0;
    }
  
    :deep(.el-button) {
      font-size: 12px;
      padding: 8px 12px;
    }
  }
  </style>
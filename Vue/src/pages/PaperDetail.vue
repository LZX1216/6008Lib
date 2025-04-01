<template>
  <div class="paper-detail-container">
    <el-card class="modern-card">
      <div class="header-section">
        <h1 class="paper-title">
          {{ paper.title }}
          <div class="title-decoration"></div>
        </h1>
        <div class="stats-badge">
          <span class="citation-badge">
            <i class="el-icon-trophy"></i>
            {{ $t('paper.citedCount') }}: {{ paper.citationCount.toLocaleString() }} 
          </span>
          <span class="year-badge">
            <i class="el-icon-time"></i>
            {{ $t('paper.publicationYear') }}: {{ paper.publicationYear }}
          </span>
        </div>
      </div>

      <div class="author-section">
        <div class="author-header">
          <i class="el-icon-user-solid"></i>
          <h3>{{ $t('paper.authors') }}</h3>
        </div>
        <p class="author-list">{{ formattedAuthors }}</p>
      </div>

      <div class="info-grid">
        <div class="info-item doi-item">
          <label><i class="el-icon-link"></i> DOI：</label>
          <a :href="paper.doi" target="_blank" class="doi-link">
            {{ paper.doi }}
            <i class="el-icon-top-right"></i>
          </a>
        </div>

        <div class="divider"></div>

        <div class="action-buttons">
          <el-button 
            type="primary" 
            class="action-btn"
            @click="downloadPaper"
          >
            <i class="el-icon-download"></i>
            {{ $t('paperDetail.download') }}
          </el-button>
          
          <el-button 
            type="success" 
            class="action-btn"
            @click="addToReadingList"
          >
            <i class="el-icon-notebook-2"></i>
            {{ $t('paperDetail.addToList') }}
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';
import { auth } from '@/utils/auth.js';

export default {
  name: 'PaperDetail',
  computed: {
    formattedAuthors() {
      return this.paper.authors.replace(/,\s*/g, ' · ');
    }
  },
  data() {
    return {
      paper: {
        id: 1,
        title: 'PROTEIN MEASUREMENT WITH THE FOLIN PHENOL REAGENT',
        authors: 'Oliver H. Lowry, Nira J. Rosebrough, A. Farr, Rose J. Randall',
        publicationYear: '1951',
        citationCount: 319941,
        doi: 'https://doi.org/10.1016/s0021-9258(19)52451-6'
      },
    };
  },
  methods: {
    downloadPaper() {
      if (!auth.isLoggedIn) {
        ElMessage.warning(this.$t('common.loginRequired'));
        this.$router.push('/login');
        return;
      }
      ElMessage.success(this.$t('paperDetail.downloadSuccess'));
    },
    addToReadingList() {
      if (!auth.isLoggedIn) {
        ElMessage.warning(this.$t('common.loginRequired'));
        this.$router.push('/login');
        return;
      }
      ElMessage.success(this.$t('paperDetail.addToReadingListSuccess'));
    },
  },
};
</script>

<style lang="scss" scoped>
.paper-detail-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.modern-card {
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  border: none;
  overflow: hidden;
}

.header-section {
  position: relative;
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #f0f2f5;

  .paper-title {
    font-size: 2rem;
    color: #1a1a1a;
    line-height: 1.3;
    margin-bottom: 1.5rem;
    position: relative;

    .title-decoration {
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, #409EFF, #67C23A);
      border-radius: 2px;
    }
  }

  .stats-badge {
    display: flex;
    gap: 1rem;
    align-items: center;

    span {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.9rem;
      display: inline-flex;
      align-items: center;

      i {
        margin-right: 6px;
        font-size: 1.1rem;
      }
    }

    .citation-badge {
      background: rgba(64, 158, 255, 0.1);
      color: #409EFF;
      border: 1px solid rgba(64, 158, 255, 0.2);
    }

    .year-badge {
      background: rgba(103, 194, 58, 0.1);
      color: #67C23A;
      border: 1px solid rgba(103, 194, 58, 0.2);
    }
  }
}

.author-section {
  margin-bottom: 2rem;

  .author-header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;

    i {
      color: #409EFF;
      font-size: 1.4rem;
      margin-right: 8px;
    }

    h3 {
      margin: 0;
      color: #606266;
      font-weight: 500;
    }
  }

  .author-list {
    color: #303133;
    font-size: 1.1rem;
    line-height: 1.6;
    margin: 0;
  }
}

.info-grid {
  display: grid;
  gap: 1.5rem;

  .info-item {
    display: flex;
    align-items: center;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;

    label {
      color: #606266;
      font-weight: 500;
      min-width: 80px;
      margin-right: 1rem;

      i {
        margin-right: 8px;
      }
    }

    &.doi-item {
      background: rgba(64, 158, 255, 0.05);
      border: 1px solid rgba(64, 158, 255, 0.15);
    }
  }

  .doi-link {
    color: #409EFF;
    text-decoration: none;
    transition: all 0.3s;
    display: flex;
    align-items: center;

    &:hover {
      color: #1d7ef0;
      text-decoration: underline;

      .el-icon-top-right {
        transform: translate(2px, -2px);
      }
    }

    .el-icon-top-right {
      font-size: 0.8em;
      margin-left: 6px;
      transition: transform 0.2s;
    }
  }

  .divider {
    height: 1px;
    background: #e4e7ed;
    margin: 1rem 0;
  }

  .action-buttons {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;

    .action-btn {
      padding: 12px 24px;
      font-size: 1rem;
      border-radius: 8px;
      transition: all 0.3s;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

      i {
        margin-right: 8px;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
      }
    }
  }
}

@media (max-width: 768px) {
  .paper-detail-container {
    padding: 0 0.5rem;
  }

  .header-section .paper-title {
    font-size: 1.6rem;
  }

  .info-grid .action-buttons {
    flex-direction: column;
    
    .el-button {
      width: 100%;
    }
  }
}
</style>
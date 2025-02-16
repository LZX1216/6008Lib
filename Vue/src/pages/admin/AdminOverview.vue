<template>
  <div class="admin-overview">
    <!-- Statistic Cards -->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="6" v-for="(stat, index) in statsList" :key="index">
        <el-card class="stat-card animate__animated animate__fadeInUp" :style="{ animationDelay: `${index * 0.1}s` }">
          <template #header>
            <div class="card-header">
              <span>{{ stat.title }}</span>
              <el-tag :type="stat.tagType" size="small">{{ stat.tagText }}</el-tag>
            </div>
          </template>
          <div class="stat-value">
            <span class="number">{{ stat.value }}</span>
            <span class="trend" :class="{ 'up': stat.trend > 0, 'down': stat.trend < 0 }">
              {{ Math.abs(stat.trend) }}%
              <el-icon><component :is="stat.trend > 0 ? 'CaretTop' : 'CaretBottom'" /></el-icon>
            </span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Chart Area -->
    <el-row :gutter="20" class="charts-row">
      <!-- Borrowing Trend Chart -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card class="chart-card animate__animated animate__fadeInLeft">
          <template #header>
            <div class="card-header">
              <span>Borrowing Trend</span>
              <el-radio-group v-model="borrowChartPeriod" size="small">
                <el-radio-button label="week">Week</el-radio-button>
                <el-radio-button label="month">Month</el-radio-button>
                <el-radio-button label="year">Year</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container">
            Borrowing Trend Chart
          </div>
        </el-card>
      </el-col>

      <!-- Book Category Statistics -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card class="chart-card animate__animated animate__fadeInUp">
          <template #header>
            <div class="card-header">
              <span>Book Category Statistics</span>
            </div>
          </template>
          <div class="chart-container">
            Category Pie Chart
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Recent Activities -->
    <el-row :gutter="20">
      <el-col :xs="24">
        <el-card class="chart-card animate__animated animate__fadeInRight">
          <template #header>
            <div class="card-header">
              <span>Recent Activities</span>
            </div>
          </template>
          <div class="recent-activity">
            <el-timeline>
              <el-timeline-item
                v-for="activity in recentActivities"
                :key="activity.id"
                :timestamp="activity.time"
                :type="activity.type"
              >
                {{ activity.content }}
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { CaretTop, CaretBottom } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'AdminOverview',
  components: {
    CaretTop,
    CaretBottom
  },
  data() {
    return {
      borrowChartPeriod: 'month',
      stats: {
        totalBorrows: { value: 1234, trend: 15, title: 'Total Borrows', tagType: 'success', tagText: 'Active' },
        activeUsers: { value: 456, trend: 8, title: 'Active Users', tagType: 'warning', tagText: 'Growing' },
        newBooks: { value: 89, trend: -3, title: 'New Books', tagType: 'info', tagText: 'This Month' },
        overdueCount: { value: 12, trend: -5, title: 'Overdue Books', tagType: 'danger', tagText: 'Attention' }
      },
      recentActivities: [
        {
          id: 1,
          time: '2024-03-15 14:30',
          type: 'success',
          content: 'User Zhang San returned "Introduction to Algorithms"'
        },
        {
          id: 2,
          time: '2024-03-15 13:20',
          type: 'warning',
          content: 'New book "Artificial Intelligence: A Modern Approach" added to inventory'
        },
        {
          id: 3,
          time: '2024-03-15 11:45',
          type: 'danger',
          content: 'User Li Si\'s loan is overdue'
        }
      ]
    }
  },
  methods: {
    fetchOverviewData() {
      // Implement logic to fetch overview data
      console.log('Fetching overview data')
    },
  },
  computed: {
    statsList() {
      return Object.values(this.stats)
    }
  }
}
</script>

<style scoped>
.admin-overview {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.stat-card {
  margin-bottom: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-value {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.number {
  font-size: 24px;
  font-weight: bold;
}

.trend {
  font-size: 14px;
  color: #f56c6c;
  display: flex;
  align-items: center;
}

.trend.up {
  color: #67c23a;
}

.charts-row {
  margin: 10px 0;
}

.chart-card {
  margin-bottom: 10px;
}

.chart-container {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}

.recent-activity {
  height: 200px;
  display: flex;
  align-items: center;
  background: #f5f7fa;
}
</style>
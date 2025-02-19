<template>
  <div class="admin-overview">
    <!-- Statistic Cards -->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="6" v-for="(stat, index) in statsList" :key="index">
        <el-card class="stat-card animate__animated animate__fadeInUp" :style="{ animationDelay: `${index * 0.1}s` }">
          <template #header>
            <div class="card-header">
              <span>{{ $t(`adminOverview.${stat.titleKey}`) }}</span>
              <el-tag :type="stat.tagType" size="small">{{ $t(`adminOverview.${stat.tagTextKey}`) }}</el-tag>
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
              <span>{{ $t('adminOverview.borrowingTrend') }}</span>
              <el-radio-group v-model="borrowChartPeriod" size="small">
                <el-radio-button label="week">{{ $t('adminOverview.week') }}</el-radio-button>
                <el-radio-button label="month">{{ $t('adminOverview.month') }}</el-radio-button>
                <el-radio-button label="year">{{ $t('adminOverview.year') }}</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container">
            <canvas id="borrowingTrendChart"></canvas>
          </div>
        </el-card>
      </el-col>

      <!-- Book Category Statistics -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card class="chart-card animate__animated animate__fadeInUp">
          <template #header>
            <div class="card-header">
              <span>{{ $t('adminOverview.bookCategoryStatistics') }}</span>
            </div>
          </template>
          <div class="chart-container">
            <canvas id="bookCategoryChart"></canvas>
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
              <span>{{ $t('adminOverview.recentActivities') }}</span>
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
                {{ $t(`adminOverview.${activity.contentKey}`, { ...activity.params }) }}
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
import { ref, onMounted, watch, getCurrentInstance } from 'vue'
import Chart from 'chart.js/auto'

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
        totalBorrows: { value: 1234, trend: 15, titleKey: 'totalBorrows', tagType: 'success', tagTextKey: 'active' },
        activeUsers: { value: 456, trend: 8, titleKey: 'activeUsers', tagType: 'warning', tagTextKey: 'growing' },
        newBooks: { value: 89, trend: -3, titleKey: 'newBooks', tagType: 'info', tagTextKey: 'thisMonth' },
        overdueCount: { value: 12, trend: -5, titleKey: 'overdueBooks', tagType: 'danger', tagTextKey: 'attention' }
      },
      recentActivities: [
        {
          id: 1,
          time: '2024-03-15 14:30',
          type: 'success',
          contentKey: 'userReturnedBook',
          params: { user: 'Zhang San', book: 'Introduction to Algorithms' }
        },
        {
          id: 2,
          time: '2024-03-15 13:20',
          type: 'warning',
          contentKey: 'newBookAdded',
          params: { book: 'Artificial Intelligence: A Modern Approach' }
        },
        {
          id: 3,
          time: '2024-03-15 11:45',
          type: 'danger',
          contentKey: 'userLoanOverdue',
          params: { user: 'Li Si' }
        }
      ]
    }
  },
  setup() {
    const borrowingTrendChart = ref(null)
    const bookCategoryChart = ref(null)
    const instance = getCurrentInstance()

    const drawBorrowingTrendChart = (period) => {
      const ctx = document.getElementById('borrowingTrendChart').getContext('2d')
      if (borrowingTrendChart.value) {
        borrowingTrendChart.value.destroy()
      }

      let labels = []
      let data = []

      if (period === 'week') {
        labels = [
          instance.proxy.$t('adminOverview.mon'),
          instance.proxy.$t('adminOverview.tue'),
          instance.proxy.$t('adminOverview.wed'),
          instance.proxy.$t('adminOverview.thu'),
          instance.proxy.$t('adminOverview.fri'),
          instance.proxy.$t('adminOverview.sat'),
          instance.proxy.$t('adminOverview.sun')
        ]
        data = [10, 15, 20, 18, 22, 25, 12]
      } else if (period === 'month') {
        labels = [
          instance.proxy.$t('adminOverview.week1'),
          instance.proxy.$t('adminOverview.week2'),
          instance.proxy.$t('adminOverview.week3'),
          instance.proxy.$t('adminOverview.week4')
        ]
        data = [40, 45, 50, 55]
      } else if (period === 'year') {
        labels = [
          instance.proxy.$t('adminOverview.jan'),
          instance.proxy.$t('adminOverview.feb'),
          instance.proxy.$t('adminOverview.mar'),
          instance.proxy.$t('adminOverview.apr'),
          instance.proxy.$t('adminOverview.may'),
          instance.proxy.$t('adminOverview.jun'),
          instance.proxy.$t('adminOverview.jul'),
          instance.proxy.$t('adminOverview.aug'),
          instance.proxy.$t('adminOverview.sep'),
          instance.proxy.$t('adminOverview.oct'),
          instance.proxy.$t('adminOverview.nov'),
          instance.proxy.$t('adminOverview.dec')
        ]
        data = [100, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220]
      }

      borrowingTrendChart.value = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: instance.proxy.$t('adminOverview.borrowingTrend'),
            data: data,
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 0, 255, 0.1)',
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      })
    }

    const drawBookCategoryChart = () => {
      const ctx = document.getElementById('bookCategoryChart').getContext('2d')
      if (bookCategoryChart.value) {
        bookCategoryChart.value.destroy()
      }

      const labels = ['Artificial Intelligence', 'Software Engineering', 'Algorithms', 'Database']
      const data = [30, 40, 20, 10]

      bookCategoryChart.value = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      })
    }

    onMounted(() => {
      drawBorrowingTrendChart(instance.data.borrowChartPeriod)
      drawBookCategoryChart()
    })

    watch(() => instance.data.borrowChartPeriod, (newPeriod) => {
      drawBorrowingTrendChart(newPeriod)
    })

    return {}
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
  padding-left: 20px;
}

.recent-activity .el-timeline {
  width: 100%;
}
</style>
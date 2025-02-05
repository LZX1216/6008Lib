<template>
  <div class="admin-overview">
    <!-- 统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>总借阅量</span>
              <el-tag size="small">本月</el-tag>
            </div>
          </template>
          <div class="stat-value">
            <span class="number">{{ stats.totalBorrows }}</span>
            <span class="trend" :class="{ 'up': stats.borrowTrend > 0 }">
              {{ stats.borrowTrend }}%
              <el-icon><CaretTop /></el-icon>
            </span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>活跃用户</span>
              <el-tag size="small" type="success">本月</el-tag>
            </div>
          </template>
          <div class="stat-value">
            <span class="number">{{ stats.activeUsers }}</span>
            <span class="trend" :class="{ 'up': stats.userTrend > 0 }">
              {{ stats.userTrend }}%
              <el-icon><CaretTop /></el-icon>
            </span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>新增图书</span>
              <el-tag size="small" type="warning">本月</el-tag>
            </div>
          </template>
          <div class="stat-value">
            <span class="number">{{ stats.newBooks }}</span>
            <span class="trend" :class="{ 'up': stats.bookTrend > 0 }">
              {{ stats.bookTrend }}%
              <el-icon><CaretTop /></el-icon>
            </span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>逾期数</span>
              <el-tag size="small" type="danger">当前</el-tag>
            </div>
          </template>
          <div class="stat-value">
            <span class="number">{{ stats.overdueCount }}</span>
            <span class="trend" :class="{ 'down': stats.overdueTrend < 0 }">
              {{ stats.overdueTrend }}%
              <el-icon><CaretBottom /></el-icon>
            </span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>借阅趋势</span>
              <el-radio-group v-model="borrowChartPeriod" size="small">
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
                <el-radio-button label="year">年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <!-- 这里需要集成图表库，如 ECharts -->
          <div class="chart-container">
            借阅趋势图表
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>图书分类统计</span>
            </div>
          </template>
          <div class="chart-container">
            分类饼图
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近活动 -->
    <el-card class="recent-activity">
      <template #header>
        <div class="card-header">
          <span>最近活动</span>
        </div>
      </template>
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
    </el-card>
  </div>
</template>

<script>
import { CaretTop, CaretBottom } from '@element-plus/icons-vue'

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
        totalBorrows: 1234,
        borrowTrend: 15,
        activeUsers: 456,
        userTrend: 8,
        newBooks: 89,
        bookTrend: -3,
        overdueCount: 12,
        overdueTrend: -5
      },
      recentActivities: [
        {
          id: 1,
          time: '2024-03-15 14:30',
          type: 'success',
          content: '用户 张三 归还了《三体》'
        },
        {
          id: 2,
          time: '2024-03-15 13:20',
          type: 'warning',
          content: '新增图书《球状闪电》入库'
        },
        {
          id: 3,
          time: '2024-03-15 11:45',
          type: 'danger',
          content: '用户 李四 的借阅已逾期'
        }
      ]
    }
  },
  methods: {
    fetchOverviewData() {
      // 实现获取总览数据的逻辑
      console.log('获取总览数据')
    }
  },
  created() {
    this.fetchOverviewData()
  }
}
</script>

<style scoped>
.admin-overview {
  padding: 20px;
}

.stat-card {
  margin-bottom: 20px;
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
  margin: 20px 0;
}

.chart-card {
  margin-bottom: 20px;
}

.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}

.recent-activity {
  margin-top: 20px;
}
</style> 
<template>
  <div class="admin-overview">
    <!-- Statistic Cards -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>Total Borrows</span>
              <el-tag size="small">This Month</el-tag>
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
              <span>Active Users</span>
              <el-tag size="small" type="success">This Month</el-tag>
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
              <span>New Books</span>
              <el-tag size="small" type="warning">This Month</el-tag>
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
              <span>Overdue Count</span>
              <el-tag size="small" type="danger">Current</el-tag>
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

    <!-- Chart Area -->
    <el-row :gutter="20" class="charts-row">
      <!-- Borrowing Trend Chart -->
      <el-col :span="6">
        <el-card class="chart-card">
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
          <!-- Integration of chart library like ECharts is needed here -->
          <div class="chart-container">
            Borrowing Trend Chart
          </div>
        </el-card>
      </el-col>

      <!-- Book Category Statistics -->
      <el-col :span="6">
        <el-card class="chart-card">
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

    <!-- Recent Activities -->
      <el-col :span="12">
        <el-card class="chart-card">
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

    <!-- Purchase Requests -->
    <el-card class="purchase-requests">
      <template #header>
        <div class="card-header">
          <span>Purchase Requests</span>
        </div>
      </template>
      <el-table :data="purchaseRequests" style="width: 100%">
        <el-table-column prop="title" label="Title" />
        <el-table-column prop="author" label="Author" />
        <el-table-column prop="isbn" label="ISBN" width="120" />
        <el-table-column prop="requestDate" label="Request Date" width="120" />
        <el-table-column prop="status" label="Status" width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="200">
          <template #default="scope">
            <el-button
              size="small"
              @click="handleApprove(scope.row)"
              :disabled="scope.row.status !== 'Pending'"
            >
              Approve
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleReject(scope.row)"
              :disabled="scope.row.status !== 'Pending'"
            >
              Reject
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
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
          content: 'User Zhang San returned "The Three-Body Problem"'
        },
        {
          id: 2,
          time: '2024-03-15 13:20',
          type: 'warning',
          content: 'New book "Ball Lightning" added to inventory'
        },
        {
          id: 3,
          time: '2024-03-15 11:45',
          type: 'danger',
          content: 'User Li Si\'s loan is overdue'
        } ,
        {
          id: 4,
          time: '2024-03-15 10:00',
          type: 'info',
          content: 'User Wang Wu requested to borrow "The Dark Forest"'
        }
      ] ,
      purchaseRequests: [
        {
          id: 1,
          title: 'The Three-Body Problem',
          author: 'Cixin Liu',
          isbn: '9787229030933',
          requestDate: '2024-03-15',
          status: 'Pending'
        },
      ]
    }
  },
  methods: {
    fetchOverviewData() {
      // Implement logic to fetch overview data
      console.log('Fetching overview data')
    },

    getStatusType(status) {
      const types = {
        Pending: 'warning',
        Approved: 'success',
        Rejected: 'danger'
      }
      return types[status] || 'info'
    },

    async handleApprove(request) {
      try {
        await ElMessageBox.confirm(
          `Are you sure you want to approve the purchase request for "${request.title}"?`,
          'Confirm Approval',
          {
            confirmButtonText: 'Approve',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        )
        // Call an API to update the request status
        request.status = 'Approved'
        ElMessage.success('Purchase request approved successfully')
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('Failed to approve purchase request')
        }
      }
    },

    async handleReject(request) {
      try {
        await ElMessageBox.confirm(
          `Are you sure you want to reject the purchase request for "${request.title}"?`,
          'Confirm Rejection',
          {
            confirmButtonText: 'Reject',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        )
        // Call an API to update the request status
        request.status = 'Rejected'
        ElMessage.success('Purchase request rejected successfully')
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('Failed to reject purchase request')
        }
      }
    },

    fetchPurchaseRequests() {
      // Implement logic to fetch purchase requests
      console.log('Fetching purchase requests')
    }
  },
  created() {
    // Existing created hook...
    this.fetchPurchaseRequests()
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
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}

.recent-activity {
  height: 300px;
  display: flex;
  align-items: center;
  background: #f5f7fa;
}

.purchase-requests {
  margin-top: 10px;
  margin-bottom: 20px;
}


</style>
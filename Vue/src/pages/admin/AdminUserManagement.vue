<template>
  <div class="user-management">
    <div class="page-header">
      <h2>User Management</h2>
    </div>

    <!-- Search and Filter -->
    <div class="search-section">
      <el-input
        v-model="searchQuery"
        placeholder="Search users..."
        class="search-input"
        style="width: 400px;"
      >
        <template #append>
          <el-button @click="searchUsers">
            <el-icon><Search /></el-icon>
          </el-button>
        </template>
      </el-input>

      <el-select v-model="filterStatus" placeholder="User Status" clearable style="width: 150px;">
        <el-option label="All" value="" />
        <el-option label="Active" value="active" />
        <el-option label="Disabled" value="disabled" />
      </el-select>
    </div>

    <!-- User List -->
    <el-table :data="users" style="width: 100%">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="username" label="Username" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="status" label="Status">
        <template #default="scope">
          <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
            {{ scope.row.status === 'active' ? 'Active' : 'Disabled' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="currentBorrows" label="Current Borrows" />
      <el-table-column prop="totalBorrows" label="Total Borrows" />
      <el-table-column prop="overdueTimes" label="Overdue Times" />
      <el-table-column label="Actions" width="250">
        <template #default="scope">
          <el-button
            :type="scope.row.status === 'active' ? 'danger' : 'success'"
            size="small"
            @click="toggleUserStatus(scope.row)"
          >
            {{ scope.row.status === 'active' ? 'Disable' : 'Enable' }}
          </el-button>
          <el-button
            type="warning"
            size="small"
            @click="resetPassword(scope.row)"
          >
            Reset Password
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div class="pagination">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        @update:current-page="currentPage = $event"
        @update:page-size="pageSize = $event"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- User Details Dialog -->
    <el-dialog
      title="User Details"
      v-model="dialogVisible"
      width="50%"
    >
      <div v-if="selectedUser" class="user-details">
        <h3>Basic Information</h3>
        <el-descriptions :column="2">
          <el-descriptions-item label="Username">{{ selectedUser.username }}</el-descriptions-item>
          <el-descriptions-item label="Name">{{ selectedUser.name }}</el-descriptions-item>
          <el-descriptions-item label="Status">
            <el-tag :type="selectedUser.status === 'active' ? 'success' : 'danger'">
              {{ selectedUser.status === 'active' ? 'Active' : 'Disabled' }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <h3>Borrowing Statistics</h3>
        <el-descriptions :column="2">
          <el-descriptions-item label="Current Borrows">{{ selectedUser.currentBorrows }}</el-descriptions-item>
          <el-descriptions-item label="Total Borrows">{{ selectedUser.totalBorrows }}</el-descriptions-item>
          <el-descriptions-item label="Overdue Times">{{ selectedUser.overdueTimes }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'AdminUserManagement',
  components: {
    Search
  },
  data() {
    return {
      searchQuery: '',
      filterStatus: '',
      users: [
        {
          id: 1,
          username: 'user1',
          name: 'User One',
          status: 'active',
          currentBorrows: 2,
          totalBorrows: 10,
          overdueTimes: 1
        },
        {
          id: 2,
          username: 'user2',
          name: 'User Two',
          status: 'inactive',
          currentBorrows: 0,
          totalBorrows: 5,
          overdueTimes: 0
        }
      ],
      currentPage: 1,
      pageSize: 10,
      total: 100,
      dialogVisible: false,
      selectedUser: null
    }
  },
  methods: {
    searchUsers() {
      // Implement search logic
      console.log('Search:', this.searchQuery)
    },
    async toggleUserStatus(user) {
      try {
        const action = user.status === 'active' ? 'disable' : 'enable'
        await ElMessageBox.confirm(
          `Are you sure you want to ${action} this user?`,
          'Warning',
          {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        )
        // Call API
        // await toggleUserStatusApi(user.id)
        user.status = user.status === 'active' ? 'disabled' : 'active'
        ElMessage.success(`${action.charAt(0).toUpperCase() + action.slice(1)} successful`)
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error(`Failed to ${action}`)
        }
      }
    },
    async resetPassword(user) {
      try {
        await ElMessageBox.confirm(
          'Are you sure you want to reset this user\'s password?',
          'Warning',
          {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        )
        // Call API
        // const newPassword = await resetPasswordApi(user.id)
        ElMessage.success('Password reset successful, new password has been sent to the user\'s email')
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('Failed to reset password')
        }
      }
    },
    viewUserDetails(user) {
      this.selectedUser = user
      this.dialogVisible = true
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchUsers()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchUsers()
    },
    fetchUsers() {
      // Implement the logic of getting the user list
      console.log('Getting the user list')
    }
  },
  created() {
    this.fetchUsers()
  }
}
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-section {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.search-input {
  width: 400px;
  flex-grow: 1;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.user-details h3 {
  margin: 20px 0 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}
</style>
<template>
  <div class="user-management">
    <div class="page-header">
      <h2>{{ $t('adminUserManagement.userManagement') }}</h2>
    </div>

    <!-- Search and Filter -->
    <div class="search-section">
      <el-input
        v-model="searchQuery"
        :placeholder="$t('adminUserManagement.searchUsers')"
        class="search-input"
        style="width: 400px;"
      >
        <template #append>
          <el-button @click="searchUsers">
            <el-icon><Search /></el-icon>
          </el-button>
        </template>
      </el-input>

      <el-select v-model="filterStatus" :placeholder="$t('adminUserManagement.userStatus')" clearable style="width: 150px;">
        <el-option :label="$t('adminUserManagement.all')" value="" />
        <el-option :label="$t('adminUserManagement.active')" value="active" />
        <el-option :label="$t('adminUserManagement.disabled')" value="disabled" />
      </el-select>
    </div>

    <!-- User List -->
    <el-table :data="users" style="width: 100%" default-sort="{ prop: 'id', order: 'ascending' }" @sort-change="handleSortChange">
      <el-table-column prop="id" :label="$t('adminUserManagement.id')" width="80" sortable/>
      <el-table-column prop="username" :label="$t('adminUserManagement.username')" sortable/>
      <el-table-column prop="name" :label="$t('adminUserManagement.name')" width="150" sortable/>
      <el-table-column prop="role" :label="$t('adminUserManagement.role')" width="180" sortable>
        <template #default="scope">
          <el-tag
              :type="scope.row.role === 'admin' ? 'success' : scope.row.role === 'superadmin' ? 'danger' : 'info'">
            {{
              scope.row.role === 'admin' ? $t('adminUserManagement.administrator') : scope.row.role === 'superadmin' ? $t('adminUserManagement.superAdmin') : $t('adminUserManagement.user')
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="$t('adminUserManagement.status')" width="120" sortable>
        <template #default="scope">
          <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
            {{ scope.row.status === 'active' ? $t('adminUserManagement.active') : $t('adminUserManagement.disabled') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="currentBorrows" :label="$t('adminUserManagement.currentBorrows')" sortable/>
      <el-table-column prop="totalBorrows" :label="$t('adminUserManagement.totalBorrows')" sortable/>
      <el-table-column prop="overdueTimes" :label="$t('adminUserManagement.overdueTimes')" sortable/>
      <el-table-column :label="$t('adminUserManagement.actions')">
        <template #default="scope">
          <el-button
              :type="scope.row.status === 'active' ? 'danger' : 'success'"
              size="small"
              @click="toggleUserStatus(scope.row)"
          >
            {{ scope.row.status === 'active' ? $t('adminUserManagement.disable') : $t('adminUserManagement.enable') }}
          </el-button>
          <el-button
              type="warning"
              size="small"
              @click="resetPassword(scope.row)"
          >
            {{ $t('adminUserManagement.resetPassword') }}
          </el-button>
          <el-button
              v-if="currentUser.role === 'superadmin' && scope.row.role !== 'superadmin'"
              type="primary"
              size="small"
              @click="toggleAdminRole(scope.row)"
          >
            {{ scope.row.role === 'admin' ? $t('adminUserManagement.demote') : $t('adminUserManagement.promote') }}
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
      :title="$t('adminUserManagement.userDetails')"
      v-model="dialogVisible"
      width="50%"
    >
      <div v-if="selectedUser" class="user-details">
        <h3>{{ $t('adminUserManagement.basicInformation') }}</h3>
        <el-descriptions :column="2">
          <el-descriptions-item :label="$t('adminUserManagement.username')">{{ selectedUser.username }}</el-descriptions-item>
          <el-descriptions-item :label="$t('adminUserManagement.name')">{{ selectedUser.name }}</el-descriptions-item>
          <el-descriptions-item :label="$t('adminUserManagement.status')">
            <el-tag :type="selectedUser.status === 'active' ? 'success' : 'danger'">
              {{ selectedUser.status === 'active' ? $t('adminUserManagement.active') : $t('adminUserManagement.disabled') }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <h3>{{ $t('adminUserManagement.borrowingStatistics') }}</h3>
        <el-descriptions :column="2">
          <el-descriptions-item :label="$t('adminUserManagement.currentBorrows')">{{ selectedUser.currentBorrows }}</el-descriptions-item>
          <el-descriptions-item :label="$t('adminUserManagement.totalBorrows')">{{ selectedUser.totalBorrows }}</el-descriptions-item>
          <el-descriptions-item :label="$t('adminUserManagement.overdueTimes')">{{ selectedUser.overdueTimes }}</el-descriptions-item>
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
          role: 'user',
          status: 'active',
          currentBorrows: 2,
          totalBorrows: 10,
          overdueTimes: 1
        },
        {
          id: 2,
          username: 'user2',
          name: 'User Two',
          role: 'admin',
          status: 'inactive',
          currentBorrows: 0,
          totalBorrows: 5,
          overdueTimes: 0
        },
        {
          id: 3,
          username: 'user3',
          name: 'User Three',
          role: 'superadmin',
          status: 'active',
          currentBorrows: 1,
          totalBorrows: 3,
          overdueTimes: 0
        }
      ],
      currentPage: 1,
      pageSize: 10,
      total: 100,
      dialogVisible: false,
      selectedUser: null,
      currentUser: JSON.parse(sessionStorage.getItem('userInfo'))
    }
  },
  methods: {
    searchUsers() {
      // Implement search logic
      console.log('Search:', this.searchQuery)
    },
    async toggleUserStatus(user) {
      try {
        const action = user.status === 'active' ? $t('adminUserManagement.disable') : $t('adminUserManagement.enable')
        await ElMessageBox.confirm(
          this.$t('adminUserManagement.confirmAction', { action: action }),
          this.$t('adminUserManagement.warning'),
          {
            confirmButtonText: this.$t('common.confirm'),
            cancelButtonText: this.$t('common.cancel'),
            type: 'warning'
          }
        )
        // Call API
        // await toggleUserStatusApi(user.id)
        user.status = user.status === 'active' ? 'disabled' : 'active'
        ElMessage.success(this.$t('adminUserManagement.actionSuccess', { action: action.charAt(0).toUpperCase() + action.slice(1) }))
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error(this.$t('adminUserManagement.actionFailed', { action: action }))
        }
      }
    },
    async resetPassword(user) {
      try {
        await ElMessageBox.confirm(
          this.$t('adminUserManagement.confirmResetPassword'),
          this.$t('adminUserManagement.warning'),
          {
            confirmButtonText: this.$t('adminUserManagement.confirm'),
            cancelButtonText: this.$t('adminUserManagement.cancel'),
            type: 'warning'
          }
        )
        // Call API
        // const newPassword = await resetPasswordApi(user.id)
        ElMessage.success(this.$t('adminUserManagement.resetPasswordSuccess'))
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error(this.$t('adminUserManagement.resetPasswordFailed'))
        }
      }
    },
    async toggleAdminRole(user) {
      const newRole = user.role === 'admin' ? $t('adminUserManagement.user') : $t('adminUserManagement.administrator')
      if (user.role === 'admin') {
        user.role = 'user'
      } else {
        user.role = 'admin'
      }
      ElMessage.success(this.$t('adminUserManagement.roleUpdated', { role: newRole }))
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
    handleSortChange(tableName, { prop, order }) {
      const data = this[tableName];
      if (order === 'ascending') {
        data.sort((a, b) => {
          if (prop === 'publishDate' || prop === 'requestDate') {
            return new Date(a[prop]) - new Date(b[prop]);
          }
          return a[prop] > b[prop]? 1 : -1;
        });
      } else if (order === 'descending') {
        data.sort((a, b) => {
          if (prop === 'publishDate' || prop === 'requestDate') {
            return new Date(b[prop]) - new Date(a[prop]);
          }
          return a[prop] < b[prop]? 1 : -1;
        });
      }
      this[tableName] = [...data];
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
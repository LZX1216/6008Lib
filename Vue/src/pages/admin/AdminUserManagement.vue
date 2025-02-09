<template>
  <div class="user-management">
    <div class="page-header">
      <h2>用户管理</h2>
    </div>

    <!-- 搜索和筛选 -->
    <div class="search-section">
      <el-input
        v-model="searchQuery"
        placeholder="搜索用户..."
        class="search-input"
        style="width: 400px;"
      >
        <template #append>
          <el-button @click="searchUsers">
            <el-icon><Search /></el-icon>
          </el-button>
        </template>
      </el-input>

      <el-select v-model="filterStatus" placeholder="用户状态" clearable style="width: 150px;">
        <el-option label="全部" value="" />
        <el-option label="正常" value="active" />
        <el-option label="禁用" value="disabled" />
      </el-select>
    </div>

    <!-- 用户列表 -->
    <el-table :data="users" style="width: 100%">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
            {{ scope.row.status === 'active' ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="currentBorrows" label="当前借阅" />
      <el-table-column prop="totalBorrows" label="总借阅" />
      <el-table-column prop="overdueTimes" label="逾期次数" />
      <el-table-column label="操作" width="250">
        <template #default="scope">
          <el-button 
            :type="scope.row.status === 'active' ? 'danger' : 'success'"
            size="small" 
            @click="toggleUserStatus(scope.row)"
          >
            {{ scope.row.status === 'active' ? '禁用' : '启用' }}
          </el-button>
          <el-button 
            type="warning" 
            size="small" 
            @click="resetPassword(scope.row)"
          >
            重置密码
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
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

    <!-- 用户详情对话框 -->
    <el-dialog
      title="用户详情"
      v-model="dialogVisible"
      width="50%"
    >
      <div v-if="selectedUser" class="user-details">
        <h3>基本信息</h3>
        <el-descriptions :column="2">
          <el-descriptions-item label="用户名">{{ selectedUser.username }}</el-descriptions-item>
          <el-descriptions-item label="姓名">{{ selectedUser.name }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="selectedUser.status === 'active' ? 'success' : 'danger'">
              {{ selectedUser.status === 'active' ? '正常' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <h3>借阅统计</h3>
        <el-descriptions :column="2">
          <el-descriptions-item label="当前借阅">{{ selectedUser.currentBorrows }}</el-descriptions-item>
          <el-descriptions-item label="历史借阅">{{ selectedUser.totalBorrows }}</el-descriptions-item>
          <el-descriptions-item label="逾期次数">{{ selectedUser.overdueTimes }}</el-descriptions-item>
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
          name: '用户一',
          status: 'active',
          currentBorrows: 2,
          totalBorrows: 10,
          overdueTimes: 1
        },
        {
          id: 2,
          username: 'user2',
          name: '用户二',
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
      // 实现搜索逻辑
      console.log('搜索:', this.searchQuery)
    },
    async toggleUserStatus(user) {
      try {
        const action = user.status === 'active' ? '禁用' : '启用'
        await ElMessageBox.confirm(
          `确定要${action}该用户吗？`,
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        // 调用API
        // await toggleUserStatusApi(user.id)
        user.status = user.status === 'active' ? 'disabled' : 'active'
        ElMessage.success(`${action}成功`)
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error(`${action}失败`)
        }
      }
    },
    async resetPassword(user) {
      try {
        await ElMessageBox.confirm(
          '确定要重置该用户的密码吗？',
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        // 调用API
        // const newPassword = await resetPasswordApi(user.id)
        ElMessage.success('密码重置成功，新密码已发送至用户邮箱')
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('密码重置失败')
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
      // 实现获取用户列表的逻辑
      console.log('获取用户列表')
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
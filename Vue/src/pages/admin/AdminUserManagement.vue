<template>
  <div class="user-management">
    <div class="page-header">
      <h2>{{ $t('adminUserManagement.userManagement') }}</h2>
      <el-button type="primary" @click="showAddUserDialog">
        {{ $t('adminUserManagement.addNewUser') }}
      </el-button>
    </div>

    <!-- Search and Filter -->
    <div class="search-section">
      <el-input
        v-model="searchQuery"
        :placeholder="$t('adminUserManagement.searchUsers')"
        class="search-input"
        style="width: 400px;"
        @keyup.enter="searchUsers"
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
            :type="scope.row.role === '1' ?'success' : scope.row.role === '2' ? 'danger' : 'info'">
            {{
              scope.row.role ==='1'?$t('adminUserManagement.administrator') : scope.row.role ==='2'?$t('adminUserManagement.superAdmin') : $t('adminUserManagement.user')
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="$t('adminUserManagement.status')" width="120" sortable>
        <template #default="scope">
          <el-tag :type="scope.row.status === 'active'? 'success' : 'danger'">
            {{ scope.row.status === 'active'? $t('adminUserManagement.active') : $t('adminUserManagement.disabled') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="currentBorrows" :label="$t('adminUserManagement.currentBorrows')" sortable/>
      <el-table-column prop="totalBorrows" :label="$t('adminUserManagement.totalBorrows')" sortable/>
      <el-table-column prop="overdueTimes" :label="$t('adminUserManagement.overdueTimes')" sortable/>
      <el-table-column :label="$t('adminUserManagement.actions')" width="300">
        <template #default="scope">
          <el-button
            :type="scope.row.status === 'active'? 'danger' :'success'"
            size="small"
            @click="toggleUserStatus(scope.row)"
          >
            {{ scope.row.status === 'active'? $t('adminUserManagement.disable') : $t('adminUserManagement.enable') }}
          </el-button>
          <el-button
            type="warning"
            size="small"
            @click="resetPassword(scope.row)"
          >
            {{ $t('adminUserManagement.resetPassword') }}
          </el-button>
          <el-button
            v-if="currentUser.role ===2 && scope.row.role!=='2'"
            type="primary"
            size="small"
            @click="toggleAdminRole(scope.row)"
          >
            {{ scope.row.role === '1'? $t('adminUserManagement.demote') : $t('adminUserManagement.promote') }}
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

    <!-- Add User Dialog -->
    <el-dialog
      :title="$t('adminUserManagement.addNewUser')"
      v-model="addUserDialogVisible"
      width="50%"
    >
      <div class="dialog-content">
        <div class="form-content">
          <el-form :model="userForm" :rules="rules" ref="userForm" label-width="150px">
            <el-form-item :label="$t('adminUserManagement.username')" prop="username">
              <el-input v-model="userForm.username" />
            </el-form-item>
            <el-form-item :label="$t('adminUserManagement.name')" prop="name">
              <el-input v-model="userForm.name" />
            </el-form-item>
            <el-form-item :label="$t('adminUserManagement.role')" prop="role">
              <el-select v-model="userForm.role">
                <el-option label="User" value="user" />
                <el-option label="Administrator" value="admin" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('adminUserManagement.status')" prop="status">
              <el-select v-model="userForm.status">
                <el-option label="Active" value="active" />
                <el-option label="Disabled" value="disabled" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addUserDialogVisible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="submitUserForm">
            {{ $t('common.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from "axios";

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
          role: 0,
          status: 'active',
          currentBorrows: 2,
          totalBorrows: 10,
          overdueTimes: 1
        },
        {
          id: 2,
          username: 'user2',
          name: 'User Two',
          role: 1,
          status: 'inactive',
          currentBorrows: 0,
          totalBorrows: 5,
          overdueTimes: 0
        },
        {
          id: 3,
          username: 'user3',
          name: 'User Three',
          role:2,
          status: 'active',
          currentBorrows: 1,
          totalBorrows: 3,
          overdueTimes: 0
        }
      ],
      userForm: {
        username: '',
        name: '',
        role: 0,
        status: 'active',
        currentBorrows: 0,
        totalBorrows: 0,
        overdueTimes: 0
      },
      currentPage: 1,
      pageSize: 10,
      total: 100,
      addUserDialogVisible: false,
      currentUser: JSON.parse(sessionStorage.getItem('userInfo')),
      rules: {
        username: [
          { required: true, message: this.$t('adminUserManagement.pleaseEnterUsername'), trigger: 'blur' }
        ],
        name: [
          { required: true, message: this.$t('adminUserManagement.pleaseEnterName'), trigger: 'blur' }
        ],
        role: [
          { required: true, message: this.$t('adminUserManagement.pleaseSelectRole'), trigger: 'change' }
        ],
        status: [
          { required: true, message: this.$t('adminUserManagement.pleaseSelectStatus'), trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    showAddUserDialog() {
      this.dialogType = 'add'
      this.userForm = {
        username: '',
        name: '',
        role: 0,
        status: 'active'
      }
      this.addUserDialogVisible = true
    },
    searchUsers() {
      // Implement search logic
      console.log('Search:', this.searchQuery)
    },
    async toggleUserStatus(user) {
      try {
        const action = user.status === 'active'? $t('adminUserManagement.disable') : $t('adminUserManagement.enable')
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
        user.status = user.status === 'active'? 'disabled' : 'active'
        ElMessage.success(this.$t('adminUserManagement.actionSuccess', { action: action.charAt(0).toUpperCase() + action.slice(1) }))
      } catch (error) {
        if (error!== 'cancel') {
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
            confirmButtonText: this.$t('common.confirm'),
            cancelButtonText: this.$t('common.cancel'),
            type: 'warning'
          }
        )
        // Call API
        // const newPassword = await resetPasswordApi(user.id)
        ElMessage.success(this.$t('adminUserManagement.resetPasswordSuccess'))
      } catch (error) {
        if (error!== 'cancel') {
          ElMessage.error(this.$t('adminUserManagement.resetPasswordFailed'))
        }
      }
    },
    async toggleAdminRole(user) {
      const newRole = user.role === 1? $t('adminUserManagement.user') : $t('adminUserManagement.administrator')
      if (user.role === 1) {
        user.role = 0
      } else {
        user.role = 1
      }
      ElMessage.success(this.$t('adminUserManagement.roleUpdated', { role: newRole }))
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
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      const token = userInfo.token
      axios({
        url: 'http://localhost:8080/admin/user/page', method: "GET", headers: {
          "token": token,// 请求头
          "Content-Type": "application/json",
        },params:
            {
              page: this.currentPage,
              pageSize: this.pageSize,
            }
      }) // Make sure this URL is correct
          .then(response => {
            console.log(response)
            this.users = response.data.data.records; // Assuming the returned data is an array of books
            this.total = response.data.data.total;
            console.log(response.data.data.records);
            console.log(this.users);

          })
          .catch(error => {
            console.error('Failed to fetch users:', error);
          })




      // Implement the logic of getting the user list
      console.log('Getting the user list')
    },



    async submitUserForm() {
      try {
        await this.$refs.userForm.validate()
        // 调用添加用户的API
        // await addUserApi(this.userForm)
        ElMessage.success(this.$t('adminUserManagement.addedSuccessfully'))
        this.addUserDialogVisible = false
        this.fetchUsers()
      } catch (error) {
        console.error(error)
      }
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

.dialog-content {
  display: flex;
  gap: 20px;
}

.form-content {
  flex: 1;
}
</style>
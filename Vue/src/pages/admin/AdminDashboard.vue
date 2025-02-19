<template>
  <div class="admin-dashboard">
    <el-container>
      <!-- Sidebar -->
      <el-aside :width="isCollapse? '64px' : '220px'" class="sidebar">
        <div class="sidebar-header">
          <span v-if="!isCollapse">{{ $t('adminDashboard.title') }}</span>
          <el-icon class="toggle-sidebar" @click="toggleSidebar">
            <component :is="isCollapse? 'Expand' : 'Fold'" />
          </el-icon>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="admin-menu"
          :collapse="isCollapse"
          @select="handleMenuSelect"
        >
          <el-menu-item index="overview">
            <el-icon><DataLine /></el-icon>
            <span>{{ $t('adminDashboard.overview') }}</span>
          </el-menu-item>
          <el-menu-item index="books">
            <el-icon><Reading /></el-icon>
            <span>{{ $t('adminDashboard.bookManagement') }}</span>
          </el-menu-item>
          <el-menu-item index="users">
            <el-icon><User /></el-icon>
            <span>{{ $t('adminDashboard.userManagement') }}</span>
          </el-menu-item>
          <el-menu-item index="borrows">
            <el-icon><List /></el-icon>
            <span>{{ $t('adminDashboard.borrowManagement') }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- Main content area -->
      <el-main>
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { DataLine, Reading, User, List, Expand, Fold } from '@element-plus/icons-vue'

export default {
  name: 'AdminDashboard',
  components: {
    DataLine,
    Reading,
    User,
    List,
    Expand,
    Fold
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const activeMenu = ref('overview')
    const isCollapse = ref(false)

    const handleMenuSelect = (index) => {
      activeMenu.value = index
      router.push(`/admin/${index}`)
    }

    const toggleSidebar = () => {
      isCollapse.value = !isCollapse.value
    }

    const navigateTo = (route) => {
      router.push({ name: route })
    }

    onMounted(() => {
      const path = route.path.split('/').pop()
      if (['overview', 'books', 'users', 'borrows'].includes(path)) {
        activeMenu.value = path
      }
    })

    return {
      activeMenu,
      isCollapse,
      handleMenuSelect,
      toggleSidebar,
      navigateTo
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  height: 100vh;
}

.sidebar {
  background-color: #fff;
  transition: width 0.3s;
  overflow-x: hidden;
  border-right: 1px solid #e6e6e6;
}

.sidebar-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  color: #303133;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #e6e6e6;
}

.toggle-sidebar {
  cursor: pointer;
  font-size: 20px;
  color: #909399;
}

.admin-menu {
  border-right: none;
}

:deep(.el-menu) {
  border-right: none;
}

:deep(.el-menu-item) {
  color: #303133;
}

:deep(.el-menu-item.is-active) {
  color: #409EFF;
  background-color: #ecf5ff;
}

:deep(.el-menu-item:hover) {
  background-color: #f5f7fa;
}

.el-main {
  padding: 20px;
  background-color: #fff;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    z-index: 1000;
    height: 100vh;
  }

  .el-main {
    margin-left: 64px;
  }
}
</style>
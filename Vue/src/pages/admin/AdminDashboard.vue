<template>
  <div class="admin-dashboard">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu
          :default-active="activeMenu"
          class="admin-menu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="overview">
            <el-icon><DataLine /></el-icon>
            <span>总览</span>
          </el-menu-item>
          <el-menu-item index="books">
            <el-icon><Reading /></el-icon>
            <span>图书管理</span>
          </el-menu-item>
          <el-menu-item index="users">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="borrows">
            <el-icon><List /></el-icon>
            <span>借阅管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主要内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { DataLine, Reading, User, List } from '@element-plus/icons-vue'

export default {
  name: 'AdminDashboard',
  components: {
    DataLine,
    Reading,
    User,
    List
  },
  data() {
    return {
      activeMenu: 'overview'
    }
  },
  methods: {
    handleMenuSelect(index) {
      this.$router.push(`/admin/${index}`)
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  height: 100vh;
}

.admin-menu {
  height: 100%;
  border-right: solid 1px #e6e6e6;
}

.el-aside {
  background-color: #fff;
}

.el-main {
  padding: 20px;
  background-color: #f5f7fa;
}
</style> 
<template>
  <el-menu class="header-menu" mode="horizontal" :router="true" :default-active="activeIndex">
    <!-- Left menu items -->
    <el-menu-item index="/" class="logo-item">
      <router-link to="/" class="logo-link">
        <span class="logo-text">Library</span>
      </router-link>
    </el-menu-item>

    <el-menu-item index="/books">
      <router-link to="/books">{{ $t('nav.books') }}</router-link>
    </el-menu-item>

    <el-menu-item index="/about">
      <router-link to="/about">{{ $t('nav.about') }}</router-link>
    </el-menu-item>

    <el-menu-item index="/help">
      <router-link to="/help">{{ $t('nav.help') }}</router-link>
    </el-menu-item>

    <!-- Right menu items -->
    <div class="right-menu">
      <!-- Display login and register when not logged in -->
      <template v-if="!auth.isLoggedIn">
        <el-menu-item index="/login">
          <router-link to="/login">{{ $t('common.login') }}</router-link>
        </el-menu-item>
        <el-menu-item index="/register">
          <router-link to="/register">{{ $t('common.register') }}</router-link>
        </el-menu-item>
      </template>

      <!-- Display user info and logout when logged in -->
      <template v-else>
        <el-menu-item index="/user">
          <router-link to="/user">{{ $t('user.profile') }}</router-link>
        </el-menu-item>
        <!-- 修改此处，移除 @click 默认行为 -->
        <el-menu-item @click="logout">{{ $t('common.logout') }}</el-menu-item>
      </template>

      <!-- Language switch -->
      <div class="language-switch">
        <LanguageSwitch />
      </div>
    </div>
  </el-menu>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus'
import { auth } from "@/utils/auth.js"
import LanguageSwitch from '@/components/LanguageSwitch.vue'

export default {
  name: 'Header',
  components: {
    LanguageSwitch
  },
  computed: {
    activeIndex() {
      return this.$route.path
    },
    auth() {
      return auth
    }
  },
  methods: {
    async logout() {
      try {
        // 美化确认弹窗
        await ElMessageBox.confirm(
          'Are you sure you want to log out?',
          'Warning',
          {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            dangerouslyUseHTMLString: true,
            customClass: 'custom-confirm-box',
          }
        )
        ElMessage.success('Logged out successfully')
        sessionStorage.removeItem('userInfo')
        auth.logoutstate()
        this.$router.push('/')
      } catch {
        ElMessage.info('Logout cancelled')
      }
    }
  }
}
</script>

<style scoped>
.header-menu {
  display: flex;
  align-items: center;
  border-bottom: solid 1px #e6e6e6;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.logo-item {
  padding: 0 20px;
}

.logo-link {
  text-decoration: none;
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  transition: all 0.3s ease;
}

.right-menu {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.language-switch {
  margin-left: 20px;
  padding: 0 10px;
}

:deep(.el-menu-item) {
  height: 60px;
  line-height: 60px;
  transition: all 0.3s ease;
}

:deep(.el-menu-item:hover) {
  background-color: #ecf5ff;
}

:deep(.router-link-active) {
  color: var(--el-menu-active-color);
  font-weight: bold;
}

a {
  text-decoration: none;
  color: inherit;
}

/* 动画效果 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.el-menu-item {
  animation: fadeIn 0.5s ease-out;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-menu {
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .logo-item {
    padding: 0;
  }

  .logo-text {
    font-size: 20px;
  }

  .right-menu {
    width: 100%;
    justify-content: flex-end;
    margin-top: 10px;
  }

  :deep(.el-menu-item) {
    padding: 0 10px;
  }

  .language-switch {
    margin-left: 10px;
  }
}

.menu-toggle {
  display: none;
  font-size: 24px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  .el-menu {
    display: none;
    flex-direction: column;
    width: 100%;
  }

  .el-menu.show {
    display: flex;
  }

  :deep(.el-menu-item) {
    width: 100%;
    text-align: center;
  }
}

.custom-confirm-box .el-message-box__header {
  background-color: #f8f8f8;
  border-bottom: 1px solid #e6e6e6;
}

.custom-confirm-box .el-message-box__content {
  padding: 20px;
}

.custom-confirm-box .el-message-box__btns {
  padding: 20px;
  text-align: center;
}
</style>
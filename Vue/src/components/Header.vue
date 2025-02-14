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
        <el-button type="text" @click="logout">{{ $t('common.logout') }}</el-button>
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
        await ElMessageBox.confirm(
          'Are you sure you want to log out?',
          'Warning',
          {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning',
          }
        )
        ElMessage.success('Logged out successfully')
        sessionStorage.removeItem('userInfo')
        auth.logoutstate()
        this.$router.push('/')
        window.location.reload()
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
}

.logo-item {
  padding: 0 20px;
}

.logo-link {
  text-decoration: none;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
  color: #409EFF;
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
}

:deep(.router-link-active) {
  color: var(--el-menu-active-color);
}

a {
  text-decoration: none;
  color: inherit;
}
</style>
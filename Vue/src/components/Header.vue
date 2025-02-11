<template>
  <el-menu class="header-menu" mode="horizontal" :router="true" :default-active="activeIndex">
    <!-- 左侧菜单项 -->
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

    <!-- 右侧菜单项 -->
    <div class="right-menu">
      <!-- 未登录状态显示登录注册 -->
      <template v-if="!auth.isLoggedIn">
        <el-menu-item index="/login">
          <router-link to="/login">{{ $t('common.login') }}</router-link>
        </el-menu-item>
        <el-menu-item index="/register">
          <router-link to="/register">{{ $t('common.register') }}</router-link>
        </el-menu-item>
      </template>
      
      <!-- 登录状态显示用户信息和登出 -->
      <template v-else>
        <el-menu-item index="/user">
          <router-link to="/user">{{ $t('user.profile') }}</router-link>
        </el-menu-item>
        <el-menu-item index="/logout">
          <a @click="logout">{{ $t('common.logout') }}</a>
        </el-menu-item>
      </template>

      <!-- 语言切换 -->
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
          '您确定要退出登录吗？',
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
        ElMessage.success('退出成功')
        sessionStorage.removeItem('userInfo')
        auth.logoutstate()
        this.$router.push('/')
        window.location.reload()
      } catch {
        ElMessage.info('退出已取消')
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
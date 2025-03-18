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

    <el-menu-item index="/papers">
      <router-link to="/papers">{{ $t('nav.papers') }}</router-link>
    </el-menu-item>

    <el-menu-item index="/journal">
      <router-link to="/journal">{{ $t('nav.journal') }}</router-link>
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
        <el-menu-item @click="logout">{{ $t('common.logout') }}</el-menu-item>
      </template>

      <!-- Admin button -->
      <el-button
          v-if="auth.isLoggedIn && isAdminOrSuperadmin"
          @click="goToAdminOverview"
          type="primary"
      >
        {{ $t('nav.goToAdminOverview') }}
      </el-button>

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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Header',
  components: {
    LanguageSwitch
  },
  setup() {
    const router = useRouter()
    const currentUser = JSON.parse(sessionStorage.getItem('userInfo'))

    const isAdminOrSuperadmin = computed(() => {
      const userInfo = sessionStorage.getItem('userInfo')
      if (!userInfo) return false
      try {
        const user = JSON.parse(userInfo)
        return user.role === 'admin' || user.role === 'superadmin'
      } catch {
        return false
      }
    })

    const goToAdminOverview = () => {
      router.push('/admin/overview')
    }

    return {
      isAdminOrSuperadmin,
      goToAdminOverview
    }
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
          this.$t('logout.confirmMessage'),
          this.$t('logout.warningTitle'),
          {
            confirmButtonText: this.$t('common.confirm'),
            cancelButtonText: this.$t('common.cancel'),
            dangerouslyUseHTMLString: true,
            customClass: 'custom-confirm-box',
          }
        );
        ElMessage.success(this.$t('logout.successMessage'));
        sessionStorage.removeItem('userInfo');
        auth.logoutstate();
        this.$router.push('/');
      } catch {
        ElMessage.info(this.$t('logout.cancelMessage'));
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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.el-menu-item {
  animation: fadeIn 0.5s ease-out;
}

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
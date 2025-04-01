<template>
  <div class="header-container">
    <el-menu class="header-menu" mode="horizontal" :router="true" :default-active="activeIndex">
      <!-- Left menu items -->
      <el-menu-item index="/" class="logo-item">
        <router-link to="/" class="logo-link">
          <span class="logo-text">Library</span>
        </router-link>
      </el-menu-item>

      <div class="nav-links">
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
      </div>

      <!-- Right menu items -->
      <div class="right-menu">
        <!-- Display login and register when not logged in -->
        <template v-if="!auth.isLoggedIn">
          <el-menu-item index="/login" class="auth-link">
            <router-link to="/login">{{ $t('common.login') }}</router-link>
          </el-menu-item>
          <el-menu-item index="/register" class="auth-link register-link">
            <router-link to="/register">{{ $t('common.register') }}</router-link>
          </el-menu-item>
        </template>

        <!-- Display user info and logout when logged in -->
        <template v-else>
          <el-menu-item index="/user" class="auth-link">
            <router-link to="/user">
              <i class="el-icon-user"></i>
              {{ $t('user.profile') }}
            </router-link>
          </el-menu-item>
          <el-menu-item @click="logout" class="auth-link logout-link">
            <i class="el-icon-switch-button"></i>
            {{ $t('common.logout') }}
          </el-menu-item>
        </template>

        <!-- Admin button -->
        <el-button
            v-if="auth.isLoggedIn && isAdminOrSuperadmin"
            @click="goToAdminOverview"
            class="admin-button"
        >
          {{ $t('nav.goToAdminOverview') }}
        </el-button>

        <!-- Language switch -->
        <div class="language-switch">
          <LanguageSwitch />
        </div>
      </div>
    </el-menu>
  </div>
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
.header-container {
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-menu {
  display: flex;
  align-items: center;
  border: none;
  padding: 0 24px;
  height: 70px;
  background-color: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.header-menu:after {
  display: none;
}

.logo-item {
  padding: 0 20px 0 0;
  margin-right: 20px;
}

.logo-link {
  text-decoration: none;
}

.logo-text {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #4771d0, #3756a4);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: -0.5px;
  transition: all 0.3s ease;
}

.nav-links {
  display: flex;
  height: 100%;
}

.right-menu {
  margin-left: auto;
  display: flex;
  align-items: center;
  height: 100%;
}

.language-switch {
  margin-left: 20px;
  padding: 0 10px;
}

:deep(.el-menu-item) {
  height: 70px;
  line-height: 70px;
  font-size: 15px;
  padding: 0 16px;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
  color: #555;
}

:deep(.el-menu--horizontal > .el-menu-item.is-active) {
  border-bottom: 3px solid #4771d0;
  color: #4771d0;
  font-weight: 600;
}

:deep(.el-menu--horizontal > .el-menu-item:hover) {
  background-color: rgba(71, 113, 208, 0.04);
  color: #4771d0;
}

:deep(.el-menu--horizontal > .el-menu-item:not(.is-disabled):focus) {
  background-color: rgba(71, 113, 208, 0.04);
}

:deep(.router-link-active) {
  color: #4771d0;
  font-weight: 600;
}

.auth-link {
  display: flex;
  align-items: center;
}

.auth-link i {
  margin-right: 6px;
  font-size: 18px;
}

.register-link:deep(a) {
  font-weight: 600;
}

.logout-link {
  color: #f56c6c;
}

.admin-button {
  margin-left: 16px;
  height: 36px;
  padding: 0 20px;
  background: linear-gradient(135deg, #4771d0, #3756a4);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(71, 113, 208, 0.25);
}

.admin-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(71, 113, 208, 0.3);
  background: linear-gradient(135deg, #5080e0, #4265b3);
}

a {
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  height: 100%;
}

/* Animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

:deep(.el-menu-item) {
  animation: fadeIn 0.4s ease-out;
  animation-fill-mode: both;
}

:deep(.el-menu-item:nth-child(1)) { animation-delay: 0.05s; }
:deep(.el-menu-item:nth-child(2)) { animation-delay: 0.1s; }
:deep(.el-menu-item:nth-child(3)) { animation-delay: 0.15s; }
:deep(.el-menu-item:nth-child(4)) { animation-delay: 0.2s; }
:deep(.el-menu-item:nth-child(5)) { animation-delay: 0.25s; }

/* Dialog styling */
.custom-confirm-box:deep(.el-message-box__header) {
  background-color: #f8faff;
  padding: 16px 20px;
  border-bottom: 1px solid #eaeff8;
}

.custom-confirm-box:deep(.el-message-box__title) {
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.custom-confirm-box:deep(.el-message-box__content) {
  padding: 24px 20px;
  color: #555;
  font-size: 15px;
}

.custom-confirm-box:deep(.el-message-box__btns) {
  padding: 12px 20px 20px;
  text-align: right;
}

.custom-confirm-box:deep(.el-button--primary) {
  background: linear-gradient(135deg, #4771d0, #3756a4);
  border: none;
  box-shadow: 0 4px 10px rgba(71, 113, 208, 0.25);
}

.custom-confirm-box:deep(.el-button--default) {
  border-color: #dcdfe6;
  color: #606266;
}

/* Mobile Responsiveness */
@media (max-width: 992px) {
  .header-menu {
    padding: 0 16px;
  }

  :deep(.el-menu-item) {
    padding: 0 12px;
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .header-menu {
    flex-wrap: wrap;
    height: auto;
    padding: 12px 16px;
  }

  .nav-links {
    order: 3;
    width: 100%;
    margin-top: 12px;
    overflow-x: auto;
    flex-wrap: nowrap;
    justify-content: flex-start;
  }

  .nav-links::-webkit-scrollbar {
    height: 3px;
  }

  .nav-links::-webkit-scrollbar-thumb {
    background-color: #e0e0e0;
    border-radius: 3px;
  }

  .logo-item {
    padding: 0;
    margin-right: 0;
    height: 50px;
    line-height: 50px;
  }

  .logo-text {
    font-size: 20px;
  }

  .right-menu {
    height: 50px;
    margin-left: auto;
  }

  :deep(.el-menu-item) {
    height: 50px;
    line-height: 50px;
    padding: 0 10px;
  }

  .auth-link:deep(a) {
    font-size: 13px;
  }

  .admin-button {
    font-size: 13px;
    padding: 0 12px;
    height: 32px;
  }

  .language-switch {
    margin-left: 10px;
  }
}
</style>
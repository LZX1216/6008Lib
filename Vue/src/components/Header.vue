<template>
  <el-menu class="el-menu-demo" mode="horizontal" :router="true" :default-active="activeIndex">
    <!-- <div class="logo-container">
      <img src="@/assets/logo.png" alt="Library Logo" class="logo" />
      <span class="logo-text">图书馆</span>
    </div> -->
    <el-menu-item index="/">
      <router-link to="/">{{ $t('nav.home') }}</router-link>
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
    <el-menu-item index="/login" style='margin-left: auto;'>
      <router-link to="/login" v-if="!auth.isLoggedIn">{{ $t('common.login') }}</router-link>
      <router-link to="/user" v-else>{{ $t('user.profile') }}</router-link>
    </el-menu-item>
    <el-menu-item index="/register" style='margin-right: 0;width: fit-content'>
      <router-link to="/register" v-if="!auth.isLoggedIn">{{ $t('common.register') }}</router-link>
      <el-button plain @click="logout" v-else>{{ $t('common.logout') }}</el-button>
    </el-menu-item>
    <div class="language-switch-container">
      <language-switch />
    </div>
  </el-menu>
</template>


<script>
import {ElMessage, ElMessageBox} from 'element-plus'
import {auth} from "@/utils/auth.js";
import LanguageSwitch from '@/components/LanguageSwitch.vue'

export default {
  name: 'Header',
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
            'Are you sure you want to logout?',
            'Warning',
            {
              confirmButtonText: 'OK',
              cancelButtonText: 'Cancel',
              type: 'warning',
            }
        )
        ElMessage.success('Log out completed')
        sessionStorage.removeItem('userInfo');
        auth.logoutstate()
        this.$router.push('/Homepage')
        window.location.reload();
      } catch {
        ElMessage.info('Log out canceled')
      }
    }
  },
  components: {
    LanguageSwitch
  }
}

</script>
<style>
a {
  text-decoration: none;
}
.language-menu-item {
  margin-left: auto;
}
.logo-container {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  margin-right: 20px;
}

.logo {
  height: 40px;
  width: auto;
  margin-right: 10px;
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.el-menu-demo {
  border-bottom: solid 1px #e6e6e6;
}

:deep(.el-menu-item) {
  height: 60px;
  line-height: 60px;
}

:deep(.router-link-active) {
  color: var(--el-menu-active-color);
}

.language-switch {
  margin-left: 20px;
  display: flex;
  align-items: center;
}

.language-switch-container {
  margin-left: 20px;
  margin-right: 20px;
  display: flex;
  align-items: center;
  height: 60px;
}
</style>
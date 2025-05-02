import { reactive } from 'vue'
import {ref} from "vue";
// 添加测试账号
const testUsers = [
  {
    username: 'admin',
    password: 'admin123',
    role: 'admin'
  },
  {
    username: 'user',
    password: 'user123',
    role: 'user'
  },
  {
    username: 'superadmin',
    password: 'superadmin123',
    role: 'superadmin'
  }
]

export const auth = reactive({
    isLoggedIn: false,
    userInfo: null,

    loginstate(user) {
      sessionStorage.setItem('isLoggedIn', 'true')
      sessionStorage.setItem('userInfo', JSON.stringify(user))
      this.isLoggedIn = true
      this.userInfo = user;
    },

    logoutstate() {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('userInfo');
        this.isLoggedIn = false
        this.userInfo = null;
    },

    login(username, password) {
      const user = testUsers.find(u => u.username === username && u.password === password);
      if (user) {
          this.isLoggedIn = true;
          this.userInfo = { ...user };
          sessionStorage.setItem('isLoggedIn', 'true');
          sessionStorage.setItem('userInfo', JSON.stringify(user));
          return true;
      }
      return false;
  }
})


import { reactive } from 'vue'

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
  }
]

export const auth = reactive({
    isLoggedIn: sessionStorage.getItem('isLoggedIn') === 'true',
    userInfo: null,

    loginstate(user) {
      sessionStorage.setItem('isLoggedIn', 'true')
      sessionStorage.setItem('userInfo', JSON.stringify(user))
      this.isLoggedIn = true
      this.userInfo = user
    },

    logoutstate() {
        sessionStorage.removeItem('isLoggedIn')
        this.isLoggedIn = false
        this.userInfo = null; // 清空用户信息
    },

    login(username, password) {
      const user = testUsers.find(u => u.username === username && u.password === password);
      if (user) {
          this.isLoggedIn = true;
          this.userInfo = { ...user };
          sessionStorage.setItem('isLoggedIn', 'true');
          sessionStorage.setItem('userInfo', JSON.stringify(user)); // 确保这里存储了用户信息
          return true;
      }
      return false;
  }
})


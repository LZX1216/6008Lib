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

    loginstate() {
        sessionStorage.setItem('isLoggedIn', 'true')
        this.isLoggedIn = true
    },

    logoutstate() {
        sessionStorage.removeItem('isLoggedIn')
        this.isLoggedIn = false
    },

    login(username, password) {
        // 查找测试用户
        const user = testUsers.find(u => u.username === username && u.password === password)
        if (user) {
            this.isLoggedIn = true
            this.userInfo = { ...user }
            sessionStorage.setItem('userInfo', JSON.stringify(user))
            return true
        }
        return false
    }
})
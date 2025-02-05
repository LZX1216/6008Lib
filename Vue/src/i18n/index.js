import { createI18n } from 'vue-i18n'

const messages = {
  zh: {
    common: {
      search: '搜索',
      login: '登录',
      register: '注册',
      logout: '退出登录',
      confirm: '确定',
      cancel: '取消',
      submit: '提交',
      reset: '重置'
    },
    nav: {
      home: '首页',
      books: '图书',
      about: '关于我们',
      contact: '联系我们',
      help: '帮助支持'
    },
    book: {
      title: '书名',
      author: '作者',
      isbn: 'ISBN',
      publishDate: '出版日期',
      description: '简介',
      borrow: '借阅',
      return: '归还',
      addToList: '加入书单',
      available: '可借阅',
      borrowed: '已借出',
      dueDate: '应还日期',
      rating: '评分',
      comments: '评论'
    },
    user: {
      profile: '个人资料',
      borrowing: '当前借阅',
      history: '借阅历史',
      wishlist: '我的书单',
      settings: '账户设置'
    }
  },
  en: {
    common: {
      search: 'Search',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      confirm: 'Confirm',
      cancel: 'Cancel',
      submit: 'Submit',
      reset: 'Reset'
    },
    nav: {
      home: 'Home',
      books: 'Books',
      about: 'About Us',
      contact: 'Contact',
      help: 'Help & Support'
    },
    book: {
      title: 'Title',
      author: 'Author',
      isbn: 'ISBN',
      publishDate: 'Publish Date',
      description: 'Description',
      borrow: 'Borrow',
      return: 'Return',
      addToList: 'Add to List',
      available: 'Available',
      borrowed: 'Borrowed',
      dueDate: 'Due Date',
      rating: 'Rating',
      comments: 'Comments'
    },
    user: {
      profile: 'Profile',
      borrowing: 'Current Borrows',
      history: 'Borrow History',
      wishlist: 'My Lists',
      settings: 'Account Settings'
    }
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'zh',
  fallbackLocale: 'zh',
  messages
}) 
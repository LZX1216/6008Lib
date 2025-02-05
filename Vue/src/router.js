import {createRouter, createWebHistory} from 'vue-router'

import {auth} from "@/utils/auth.js";
import {ElMessage} from "element-plus";

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'home', component: () => import('@/pages/Homepage.vue'), alias: '/Homepage' },
        { path: '/books', name: 'books', component: () => import('@/pages/BookList.vue') },
        { path: '/about', name: 'about', component: () => import('@/pages/AboutUs.vue') },
        { path: '/help', name: 'help', component: () => import('@/pages/HelpSupport.vue') },
        { path: '/login', name: 'login', component: () => import('@/pages/Login.vue') },
        { path: '/register', name: 'register', component: () => import('@/pages/register.vue') },
        { path: '/user', name: 'user', component: () => import('@/pages/User.vue'), meta: { requiresAuth: true } },
        { path: '/book/:id', name: 'bookDetail', component: () => import('@/pages/BookDetail.vue') },
        {
            path: '/admin',
            component: () => import('@/pages/admin/AdminDashboard.vue'),
            children: [
                {
                    path: '',
                    redirect: '/admin/overview'
                },
                {
                    path: 'overview',
                    component: () => import('@/pages/admin/AdminOverview.vue')
                },
                {
                    path: 'books',
                    component: () => import('@/pages/admin/AdminBookManagement.vue')
                },
                {
                    path: 'users',
                    component: () => import('@/pages/admin/AdminUserManagement.vue')
                },
                {
                    path: 'borrows',
                    component: () => import('@/pages/admin/AdminBorrowManagement.vue')
                }
            ],
            beforeEnter: (to, from, next) => {
                // 检查用户是否是管理员
                const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
                if (userInfo && userInfo.role === 'admin') {
                    next()
                } else {
                    next('/login')
                    ElMessage.error('需要管理员权限')
                }
            }
        }
    ],
})
router.beforeEach((to, from, next) => {

    if ((to.path === '/login' || to.path === '/register') && auth.isLoggedIn) {
        next({ path: '/user' })
        ElMessage({
            message: '您已登录！',
            type: "warning",
        });
    }
    else if ((to.path === '/user') && !auth.isLoggedIn) {
        next({ path: '/login' })
        ElMessage({
            message: '您未登录！',
            type: "warning",
        });
    }
    else next()
})

export default router
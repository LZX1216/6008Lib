import {createRouter, createWebHistory} from 'vue-router'

import {auth} from "@/utils/auth.js";
import {ElMessage} from "element-plus";

const routes = [
    { path: '/', name: 'home', component: () => import('@/pages/Homepage.vue'), alias: '/Homepage' },
    { path: '/books', name: 'books', component: () => import('@/pages/BookList.vue') },
    { path: '/papers', name: 'papers', component: () => import('@/pages/PaperList.vue') },
    { path: '/journal', name: 'journal', component: () => import('@/pages/Journal.vue') },
    { path: '/about', name: 'about', component: () => import('@/pages/AboutUs.vue') },
    { path: '/help', name: 'help', component: () => import('@/pages/HelpSupport.vue') },
    { path: '/login', name: 'login', component: () => import('@/pages/Login.vue') },
    { path: '/register', name: 'register', component: () => import('@/pages/Register.vue') },
    { path: '/user', name: 'user', component: () => import('@/pages/User.vue'), meta: { requiresAuth: true } },
    { path: '/book/:id', name: 'bookDetail', component: () => import('@/pages/BookDetail.vue') },
    { path: '/paper/:id', name: 'paperDetail', component: () => import('@/pages/PaperDetail.vue') },
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
            const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
            if (userInfo && (userInfo.role === 'admin' || userInfo.role === 'superadmin')) {
                next();
            } else {
                next('/login');
                ElMessage.error('Administrator privileges required');
            }
        }
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    // If the user is already logged in, redirect to the user page
    if ((to.path === '/login' || to.path === '/register') && auth.isLoggedIn) {
        next({ path: '/user' });
        ElMessage({
            message: 'Already logged in!',
            type: "warning",
        });
    }
    // If the user is not logged in and tries to access a page that requires login (e.g., /user), redirect to the login page
    else if (to.path === '/user' && !auth.isLoggedIn) {
        next({ path: '/login' });
        ElMessage({
            message: 'Not logged in!',
            type: "warning",
        });
    }
    // If the user is not logged in and tries to access the home page (/), allow them to stay on the home page
    else if (!auth.isLoggedIn && to.path === '/') {
        next(); // Allow staying on the home page
    }
    // Otherwise, proceed with the normal redirect
    else {
        next();
    }
})

export default router
import {
    createRouter,
    createWebHistory,
    createWebHashHistory,
} from 'vue-router'
import userStore from '../store/user.js'

import Layout from '../views/layout/index.vue'

import factory from './factory.js'
import personnelCenter from './personnelCenter.js'
import systemSettings from './systemSettings.js'
import merchantConfig from './merchantConfig.js'
import messageCenter from './messageCenter.js'
import dataCenter from './dataCenter.js'
import finance from './financeManage.js'

const routes = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录',
        },
        component: () => import('../views/login.vue'),
    },
    {
        path: '/403',
        name: '403',
        meta: {
            title: '没有权限',
        },
        component: () => import('../views/403.vue'),
    },
    {
        path: '/:error*',
        name: '404',
        component: () => import('../views/404.vue'),
    },
    {
        path: '/',
        name: 'Layout',
        component: Layout,
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                meta: {
                    title: '首页',
                    permiss: '1',
                },
                component: () => import('../views/dashboard/index.vue'),
            },
            ...factory,
            ...personnelCenter,
            ...systemSettings,
            ...merchantConfig,
            ...messageCenter,
            ...finance,
            ...dataCenter,
        ],
    },
]

const router = createRouter({
    history:
        process.env.VITE_MODE === 'DEV'
            ? createWebHashHistory()
            : createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | 总台`
    const hasToken = localStorage.getItem('token')
    const userData = userStore()
    if (to.path !== '/login' && !hasToken) {
        next('/login')
    } else if (from.name === 'login') {
        next()
    } else if (
        to.meta.permiss &&
        !userData.menuPermissList.includes(to.meta.permiss)
    ) {
        // 如果没有权限，则进入403
        next('/403')
    } else {
        next()
    }
})

export default router

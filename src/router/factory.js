const router = [
    {
        path: '/factory',
        redirect: '/factory/factory-manage',
    },
    {
        path: '/factory/factory-manage',
        name: 'factoryManage',
        component: () => import('@/views/factory/factoryManage/index.vue'),
        meta: {
            title: '厂家管理',
            permiss: 'admin.vendor.list',
        },
    },
    {
        path: '/factory/game-manage',
        name: 'gameManage',
        component: () => import('@/views/factory/gameManage/index.vue'),
        meta: {
            title: '子游戏管理',
            permiss: 'admin.game.list',
        },
    },
    {
        path: '/factory/msg-manage',
        name: 'msgManage',
        component: () => import('@/views/factory/msgManage/index.vue'),
        meta: {
            title: '短信配置',
            permiss: 'admin.merchant-sms-config.list',
        },
    },
    {
        path: '/factory/factory-share-stair',
        name: 'factoryShareStair',
        component: () => import('@/views/factory/factoryShareStair/index.vue'),
        meta: {
            title: '厂家分成阶梯',
            permiss: 'admin.vendor.shareList',
        },
    },
    {
        path: '/factory/factory-recharge',
        name: 'factoryRecharge',
        component: () => import('@/views/factory/factoryRecharge/index.vue'),
        meta: {
            title: '厂家上分',
            permiss: 'admin.vendor.shareList',
        },
    },
]

export default router

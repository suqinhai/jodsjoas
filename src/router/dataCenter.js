const router = [
    {
        path: '/data-center',
        redirect: '/data-center/merchant-data',
    },
    {
        path: '/data-center/merchant-data',
        name: 'merchantData',
        component: () => import('@/views/dataCenter/merchantData/index.vue'),
        meta: {
            title: '商户数据',
            permiss: 'admin.merchant.list',
        },
    },
    {
        path: '/data-center/merchant-unclear-bill',
        name: 'merchantUnclearBill',
        component: () =>
            import('@/views/dataCenter/merchantUnclearBill/index.vue'),
        meta: {
            title: '商户未结账单',
            permiss: 'admin.merchant.list',
        },
    },
    {
        path: '/data-center/merchant-consume',
        name: 'merchantConsume',
        component: () => import('@/views/dataCenter/merchantConsume/index.vue'),
        meta: {
            title: '商户消耗',
            permiss: 'admin.merchant-account.list',
        },
    },
    {
        path: '/data-center/bill-statistics',
        name: 'billStatistics',
        component: () => import('@/views/dataCenter/billStatistics/index.vue'),
        meta: {
            title: '账单统计',
            permiss: 'merchant.merchant-bill.list-1',
        },
    },
    {
        path: '/data-center/merchant-bill-check',
        name: 'merchantBillCheck',
        component: () =>
            import('@/views/dataCenter/merchantBillCheck/index.vue'),
        meta: {
            title: '商户账单稽核',
            permiss: 'merchant.merchant-bill.list-1',
        },
    },
    {
        path: '/data-center/factory-bill-check',
        name: 'factoryBillCheck',
        component: () =>
            import('@/views/dataCenter/factoryBillCheck/index.vue'),
        meta: {
            title: '厂家账单稽核',
            permiss: 'admin.vendor-bill.list',
        },
    },
    {
        path: '/data-center/merchant-commission-statistics',
        name: 'merchantCommissionStatistics',
        component: () =>
            import('@/views/dataCenter/merchantCommissionStatistics/index.vue'),
        meta: {
            title: '商户贡献抽成统计',
            permiss: 'merchant.merchant-bill.shareStats',
        },
    },
    {
        path: '/data-center/factory-commission-statistics',
        name: 'factoryCommissionStatistics',
        component: () =>
            import('@/views/dataCenter/factoryCommissionStatistics/index.vue'),
        meta: {
            title: '厂家抽成统计',
            permiss: 'admin.vendor-bill.shareStats',
        },
    },
    {
        path: '/data-center/factory-data',
        name: 'factoryData',
        component: () => import('@/views/dataCenter/factoryData/index.vue'),
        meta: {
            title: '厂家数据',
            permiss: 'admin.vendor-bill.stats',
        },
    },
    {
        path: '/data-center/merchant-operate-statistics',
        name: 'merchantOperateStatistics',
        component: () =>
            import('@/views/dataCenter/merchantOperateStatistics/index.vue'),
        meta: {
            title: '商户运营数据',
            permiss: 'admin.merchant.infoList',
        },
    },
    {
        path: '/data-center/share-difference-statistics',
        name: 'shareDifferenceStatistics',
        component: () =>
            import('@/views/dataCenter/shareDifferenceStatistics/index.vue'),
        meta: {
            title: '商户分成差额统计',
            permiss: 'merchant.merchant-bill.shareDiffStats',
        },
    },
    {
        path: '/data-center/share-difference-query',
        name: 'shareDifferenceQuery',
        component: () =>
            import('@/views/dataCenter/shareDifferenceQuery/index.vue'),
        meta: {
            title: '商户分成差额查询',
            permiss: 'merchant.merchant-bill.shareDiffDetail',
        },
    },
    {
        path: '/data-center/merchant-pgc-daily-bill',
        name: 'merchantPgcDailyBill',
        component: () =>
            import('@/views/dataCenter/merchantPgcDailyBill/index.vue'),
        meta: {
            title: '商户日账单',
            permiss: 'merchant.merchant-bill.shareDiffDetail',
        },
    },
    {
        path: '/data-center/merchant-data-summary',
        name: 'merchantDataSummary',
        component: () =>
            import('@/views/dataCenter/merchantDataSummary/index.vue'),
        meta: {
            title: '商户数据汇总',
            permiss: 'admin.merchant.statList',
        },
    },
    {
        path: '/data-center/game-bill-data',
        name: 'gameBillData',
        component: () => import('@/views/dataCenter/gameBillData/index.vue'),
        meta: {
            title: '游戏账单数据',
            permiss: 'admin.report.gameBillDailyStat',
        },
    },
    {
        path: '/data-center/game-bet-data',
        name: 'gameBetData',
        component: () => import('@/views/dataCenter/gameBetData/index.vue'),
        meta: {
            title: '游戏投注数据',
            permiss: 'admin.report.gameDailyStat',
        },
    },
    {
        path: '/data-center/merchant-ranking-data',
        name: 'merchantRankingData',
        component: () =>
            import('@/views/dataCenter/merchantRankingData/index.vue'),
        meta: {
            title: '商户排行数据',
            permiss: 'admin.merchant.rankData',
        },
    },
]

export default router

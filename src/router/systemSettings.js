const router = [
    {
        path: '/system-settings',
        redirect: '/system-settings/risk-config',
    },
    {
        path: '/system-settings/risk-config',
        name: 'riskConfig',
        component: () => import('@/views/systemSettings/riskConfig/index.vue'),
        meta: {
            title: '风控配置',
            permiss: 'admin.merchant-level-config.riskList',
        },
    },
    {
        path: '/system-settings/exchange-config',
        name: 'exchangeConfig',
        component: () =>
            import('@/views/systemSettings/exchangeConfig/index.vue'),
        meta: {
            title: '汇率配置',
            permiss: 'admin.exchange-rate-config.list',
        },
    },
    {
        path: '/system-settings/bill-time-config',
        name: 'merchantBillTimeConfig',
        component: () =>
            import('@/views/systemSettings/merchantBillTimeConfig/index.vue'),
        meta: {
            title: '商户账单时间配置',
            permiss: 'admin.merchant-bill-config.list',
        },
    },
    {
        path: '/system-settings/traffic-config',
        name: 'trafficConfig',
        component: () =>
            import('@/views/systemSettings/trafficConfig/index.vue'),
        meta: {
            title: '流量配置',
            permiss: 'merchant.traffic-stat.configList',
        },
    },
]

export default router

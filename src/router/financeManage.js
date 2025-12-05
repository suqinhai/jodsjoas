/*
 * @Author: yilaisai
 * @Date: 2024-10-31 17:39:57
 * @LastEditors: yilaisai
 * @LastEditTime: 2024-11-09 11:09:37
 */
const router = [
    {
        path: '/finance',
        redirect: '/finance-center/recharge-manage',
    },
    {
        path: '/finance-center/recharge-manage',
        name: 'rechargeConfig',
        component: () => import('@/views/finance/rechargeConfig/index.vue'),
        meta: {
            title: '充值配置',
            permiss: 'admin.merchant-recharge-config.list',
        },
    },
    {
        path: '/finance/payment-setting',
        name: 'paymentSetting',
        component: () => import('@/views/finance/paymentSetting/index.vue'),
        meta: {
            title: '收款设置',
            permiss: 'admin.merchant-recharge-config.paymentConfig',
        },
    },
    {
        path: '/finance/artificial-out-in',
        name: 'artificialOutIn',
        component: () => import('@/views/finance/artificialOutIn/index.vue'),
        meta: {
            title: '人工出入款',
            permiss: 'admin.merchant-account-adjust-log.list',
        },
    },
    {
        path: '/finance/collection-record',
        name: 'collectionRecord',
        component: () => import('@/views/finance/collectionRecord/index.vue'),
        meta: {
            title: '充值订单列表',
            permiss: 'merchant.merchant-recharge.list',
        },
    },
    {
        path: '/finance/overdue-merchant',
        name: 'overdueMerchant',
        component: () => import('@/views/finance/overdueMerchant/index.vue'),
        meta: {
            title: '逾期商户',
            permiss: 'admin.merchant.overdueList',
        },
    },
    {
        path: '/finance/factory-artificial-out-manage',
        name: 'factoryArtificialOutManage',
        component: () =>
            import('@/views/finance/factoryArtificialOutManage/index.vue'),
        meta: {
            title: '厂家人工出款管理',
            permiss: 'admin.vendor-bill.list-1',
        },
    },
    {
        path: '/finance/recharge-collect',
        name: 'rechargeCollect',
        component: () => import('@/views/finance/rechargeCollect/index.vue'),
        meta: {
            title: '波场TRX列表',
            permiss: 'admin.recharge-collect-log.list',
        },
    },
    {
        path: '/finance/merchant-overdraft-amend',
        name: 'merchantOverdraftAmend',
        component: () =>
            import('@/views/finance/merchantOverdraftAmend/index.vue'),
        meta: {
            title: '商户授信额度修正',
            permiss: 'admin.merchant-account-adjust-log.overdraftList',
        },
    },
    {
        path: '/finance/merchant-bill-check',
        name: 'financeMerchantBillCheck',
        component: () => import('@/views/finance/merchantBillCheck/index.vue'),
        meta: {
            title: '商户账单核对表',
            permiss: 'merchant.merchant-bill.checklist',
        },
    },
    {
        path: '/finance/server-cost-statistics',
        name: 'serverCostStatistics',
        component: () =>
            import('@/views/finance/serverCostStatistics/index.vue'),
        meta: {
            title: '服务器费用统计',
            permiss: 'admin.merchant-account-adjust-log.overdraftList',
        },
    },
    {
        path: '/finance/merchant-recharge-binding',
        name: 'merchantRechargeBinding',
        component: () =>
            import('@/views/finance/merchantRechargeBinding/index.vue'),
        meta: {
            title: '商户充值绑定',
            permiss: 'admin.merchant-recharge-config.collectConfig',
        },
    },
    {
        path: '/finance/usdt-collect',
        name: 'usdtCollect',
        component: () => import('@/views/finance/usdtCollect/index.vue'),
        meta: {
            title: '归集订单列表',
            permiss: 'admin.recharge-collect-log.list',
        },
    },
]

export default router

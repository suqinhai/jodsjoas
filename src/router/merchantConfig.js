const router = [
    {
        path: '/merchant-config',
        redirect: '/merchant-config/merchant-create',
    },
    {
        path: '/merchant-config/merchant-create',
        name: 'merchantCreate',
        component: () =>
            import('@/views/merchantConfig/merchantCreate/index.vue'),
        meta: {
            title: '商户创建',
            permiss: 'admin.merchant.add',
        },
    },
	{
	    path: '/merchant-config/merchant-edit',
	    name: 'editMerchantInfo',
	    component: () =>
	        import('@/views/merchantConfig/merchantCreate/editMerchantInfo.vue'),
	    meta: {
	        title: '商户修改',
	        permiss: '1',
	    },
	},
    {
        path: '/merchant-config/merchant-develop',
        name: 'merchantDevelop',
        component: () =>
            import('@/views/merchantConfig/merchantDevelop/index.vue'),
        meta: {
            title: '商户成长',
            permiss: 'admin.merchant-level-config.list',
        },
    },
    {
        path: '/merchant-config/merchant-share',
        name: 'merchantShare',
        component: () =>
            import('@/views/merchantConfig/merchantShare/index.vue'),
        meta: {
            title: '商户分成',
            permiss: 'admin.merchant-level-config.merchantShareList',
        },
    },
    {
        path: '/merchant-config/merchant-cost-set',
        name: 'merchantCostSet',
        component: () =>
            import('@/views/merchantConfig/merchantCostSet/index.vue'),
        meta: {
            title: '商户费用设置',
            permiss: 'admin.merchant-cost-config.list',
        },
    },
    {
        path: '/merchant-config/site-cost-set',
        name: 'siteCostSet',
        component: () => import('@/views/merchantConfig/siteCostSet/index.vue'),
        meta: {
            title: '站点费用设置',
            permiss: 'admin.merchant-cost-config.list-site',
        },
    },
    {
        path: '/merchant-config/merchant-site-manage',
        name: 'merchantSiteManage',
        component: () =>
            import('@/views/merchantConfig/merchantSiteManage/index.vue'),
        meta: {
            title: '商户列表数据',
            permiss: 'admin.merchant.siteList',
        },
    },
    {
        path: '/merchant-config/vender-acces-audit',
        name: 'venderAccesAudit',
        component: () =>
            import('@/views/merchantConfig/venderAccesAudit/index.vue'),
        meta: {
            title: '商户厂家接入审核',
            permiss: 'admin.vendor.applyList',
        },
    },
    {
        path: '/merchant-config/merchant-whitelist',
        name: 'merchantWhitelist',
        component: () =>
            import('@/views/merchantConfig/merchantWhitelist/index.vue'),
        meta: {
            title: '商户白名单',
            permiss: 'admin.merchant-whitelist-config.list',
        },
    },
    {
        path: '/ip/list',
        name: 'paymentIplist',
        component: () =>
            import('@/views/merchantConfig/paymentIplist/index.vue'),
        meta: {
            title: '商户支付IP',
            permiss: 'admin.merchant-whitelist-config.list',
        },
    },
    {
        path: '/merchant-config/domain-manage',
        name: 'domainManage',
        component: () =>
            import('@/views/merchantConfig/domainManage/index.vue'),
        meta: {
            title: '域名管理',
            permiss: 'admin.domain.list',
        },
    },
    {
        path: '/merchant-config/promote-merchant-apply-list',
        name: 'promoteMerchantApplyList',
        component: () =>
            import('@/views/merchantConfig/promoteMerchantApplyList/index.vue'),
        meta: {
            title: '推广商户申请列表',
            permiss: 'admin.promote-merchant.list',
        },
    },
    {
        path: '/merchant-config/merchant-brokerage-config',
        name: 'merchantBrokerageConfig',
        component: () =>
            import('@/views/merchantConfig/merchantBrokerageConfig/index.vue'),
        meta: {
            title: '商户佣金配置',
            permiss: 'admin.domain.list',
        },
    },
    {
        path: '/merchant-config/merchant-brokerage-data',
        name: 'merchantBrokerageData',
        component: () =>
            import('@/views/merchantConfig/merchantBrokerageData/index.vue'),
        meta: {
            title: '商户佣金数据',
            permiss: 'admin.domain.list',
        },
    },
    {
        path: '/merchant-config/data-push-config',
        name: 'dataPushConfig',
        component: () =>
            import('@/views/merchantConfig/dataPushConfig/index.vue'),
        meta: {
            title: '数据推送配置',
            permiss: 'admin.stat-push-config.list',
        },
    },
    {
        path: '/merchant-config/footer-advertising-config',
        name: 'footerAdvertisingConfig',
        component: () =>
            import('@/views/merchantConfig/footerAdvertisingConfig/index.vue'),
        meta: {
            title: '页脚广告配置',
            permiss: 'merchant.app.layout-techSupport',
        },
    },
    {
        path: '/merchant-config/app-upload',
        name: 'appUpload',
        component: () => import('@/views/merchantConfig/appUpload/index.vue'),
        meta: {
            title: 'APP上传',
            permiss: '1',
        },
    },
    {
        path: '/merchant-config/theme-template-manage',
        name: 'themeTemplateManage',
        component: () =>
            import('@/views/merchantConfig/themeTemplateManage/index.vue'),
        meta: {
            title: '商户前端主题模板管理',
            permiss: 'admin.merchant.getTemplateNoLimit',
        },
    },
    // {
    //     path: '/merchant-config/pay-channel-limit',
    //     name: 'payChannelLimit',
    //     component: () =>
    //         import('@/views/merchantConfig/payChannelLimit/index.vue'),
    //     meta: {
    //         title: '商户支付通道限制',
    //         permiss: 'admin.merchant.payChannelLimit',
    //     },
    // },
    {
        path: '/merchant-config/payment-method-switch',
        name: 'paymentMethodSwitch',
        component: () =>
            import('@/views/merchantConfig/paymentMethodSwitch/index.vue'),
        meta: {
            title: '商户支付方式开关',
            permiss: 'admin.merchant.payChannelLimit',
        },
    },
	{
	    path: '/merchant-config/merchant-model',
	    name: 'merchantModel',
	    component: () =>
	        import('@/views/merchantConfig/merchantModel/index.vue'),
	    meta: {
	        title: '商户模式修改',
	        permiss: 'admin.merchant.modeList',
	    },
	},
    {
	    path: '/merchant-config/merchant-promotion-commission',
	    name: 'merchantPromotionCommission',
	    component: () =>
	        import('@/views/merchantConfig/merchantPromotionCommission/index.vue'),
	    meta: {
	        title: '商户推广佣金',
	        permiss: 'admin.merchant-invite-rebate-log.reviewList',
	    },
	},
]

export default router

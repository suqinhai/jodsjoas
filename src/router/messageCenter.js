
const router = [
    {
        path: '/message-center',
        redirect: '/message-center/message-manage',
    },
    {
        path: '/message-center/message-manage',
        name: 'messageManage',
        component: () =>
            import('@/views/messageCenter/messageManage/index.vue'),
        meta: {
            title: '消息管理',
            permiss: 'admin.msg.list',
        },
    },
    {
        path: '/message-center/customer-manage',
        name: 'customerManage',
        component: () =>
            import('@/views/messageCenter/customerManage/index.vue'),
        meta: {
            title: '客服管理',
            permiss: 'admin.customer-service-config.list',
        },
    },
    {
        path: '/message-center/dealer-complaint',
        name: 'dealerComplaint',
        component: () =>
            import('@/views/messageCenter/dealerComplaint/index.vue'),
        meta: {
            title: '经销商投诉',
            permiss: 'admin.dealer-complain.list',
        },
    },
	{
	    path: '/message-center/member-complaint',
	    name: 'memberComplaint',
	    component: () =>
	        import('@/views/messageCenter/memberComplaint/index.vue'),
	    meta: {
	        title: '会员投诉列表',
	        permiss: 'merchant.feedback.list',
	    },
	},
    {
	    path: '/message-center/platform-advise',
	    name: 'platformAdvise',
	    component: () =>
	        import('@/views/messageCenter/platformAdvise/index.vue'),
	    meta: {
	        title: '平台建议',
	        permiss: 'merchant.feedback.list',
	    },
	},
]

export default router

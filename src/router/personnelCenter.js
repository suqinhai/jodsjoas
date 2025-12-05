const router = [
    {
        path: '/personnel-center',
        redirect: '/personnel-center/staff-list',
    },
    {
        path: '/personnel-center/operate-log',
        name: 'operateLog',
        component: () => import('@/views/personnelCenter/operateLog/index.vue'),
        meta: {
            title: '操作日志',
            permiss: 'admin.admin-log.platformList',
        },
    },
    {
        path: '/personnel-center/main-staff-list',
        name: 'mianAccountManage',
        component: () =>
            import('@/views/personnelCenter/mainAccountManage/index.vue'),
        meta: {
            title: '总台人事列表',
            permiss: 'admin.emp.list',
        },
    },
    {
        path: '/personnel-center/main-permission-setting',
        name: 'mianRolePermission',
        component: () =>
            import('@/views/personnelCenter/mainRolePermission/index.vue'),
        meta: {
            title: '总台权限设置',
            permiss: 'admin.role.list',
        },
    },
    {
        path: '/personnel-center/staff-list',
        name: 'accountManage',
        component: () =>
            import('@/views/personnelCenter/accountManage/index.vue'),
        meta: {
            title: '总台人事列表',
            permiss: 'admin.emp.list',
        },
    },
    {
        path: '/personnel-center/permission-setting',
        name: 'rolePermission',
        component: () =>
            import('@/views/personnelCenter/rolePermission/index.vue'),
        meta: {
            title: '商户权限设置',
            permiss: 'admin.role.list',
        },
    },
    {
        path: 'personnel-center/mix-permission',
        name: 'mixPermission',
        component: () =>
            import('@/views/personnelCenter/mixPermission/index.vue'),
        meta: {
            title: '分配权限',
            permiss: 'admin.role.list',
        },
    },
]

export default router

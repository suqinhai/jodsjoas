import $http from '@/common/util/http'

// 获取角色下拉接口
export const getroleListMetas = (data, config = {}) => {
    return $http.get('/admin/role/items', data, config)
}

// 获取运营账号列表
export const getEmpList = (data, config = {}) => {
    return $http.get(`/admin/emp/list`, data, config)
}

// 创建运营账号
export const addEmpAccount = (data, config = {}) => {
    return $http.post(`/admin/emp/add`, data, config)
}

// 修改运营账号
export const editEmpAccount = (data, config = {}) => {
    return $http.post(`/admin/emp/edit`, data, config)
}

// 删除运营账号
export const deleteEmpAccount = (data, config = {}) => {
    return $http.post(`/admin/emp/delete`, data, config)
}

// 重置google验证器
export const postResetGoogleValidator = (data, config = {}) => {
    return $http.post(`/admin/emp/resetGoogleValidator`, data, config)
}

// 获取全部权限菜单
export const roleMenusApi = (data, config = {}) => {
    return $http.get('/admin/role/menus', data, config)
}

// 角色列表【分页】
export const roleListApi = (data, config = {}) => {
    return $http.get(`/admin/role/list`, data, config)
}

// 新增/编辑角色信息
export const postRoleData = (data, config = {}) => {
    return $http.post('/admin/role/edit', data, config)
}

// 删除角色信息
export const deleteRoleData = (data, config = {}) => {
    return $http.post('/admin/role/delete', data, config)
}

// 获取 员工 授权
export const empRolesApi = (data, config = {}) => {
    return $http.get(`/admin/emp/roles`, data, config)
}

// 角色权限配置
export const roleGrantApi = (data, config = {}) => {
    return $http.post(`/admin/role/grant`, data, config)
}

// 获取操作日志列表
export const platformList = (data, config = {}) => {
    return $http.get(`/admin/admin-log/platformList`, data, config)
}

// 获取员工详情
export const getEmpDetail = (data, config = {}) => {
    return $http.get(`/admin/emp/data`, data, config)
}

// 修改商户登录密码
export const postMerchantPassword = (data, config = {}) => {
    return $http.post(`/admin/emp/initPwd`, data, config)
}

// 修改会员投诉配置
export const getList2 = (data, config = {}) => {
    return $http.get(`/admin/feedback/list2`, data, config)
}


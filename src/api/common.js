import $http from '@/common/util/http'

// 登录
export const loginApi = (data, config = {}) => {
    return $http.post('/admin/emp/login', data, config)
}

// 登出
export const empLogoutApi = (data, config = {}) => {
    return $http.get('/admin/emp/logout', data, config)
}

// 修改账号登录密码
export const postAccountPassword = (data, config = {}) => {
    return $http.post(`/admin/emp/changePwd`, data, config)
}

// 获取菜单数据
export const getMenuList = (data, config = {}) => {
    return $http.get('/admin/emp/menus', data, config)
}

// 元数据获取
export const commonMetasApi = (data, config = {}) => {
    return $http.get('/admin/common/metas', data, config)
}

// 获取元数据配置
export const getMetaData = (data, config = {}) => {
    return $http.get('/admin/meta/itemList', data, config)
}

// 提交元数据配置
export const postMetaData = (data, config = {}) => {
    return $http.post('/admin/meta/edit', data, config)
}

// 获取文件上传限制
export const getUploadLimit = (data, config = {}) => {
    return $http.get('/admin/file/init', data, config)
}

// 获取文件上传地址
export const getUploadUrl = (data, config = {}) => {
    return $http.get('/admin/file/uploadUrl', data, config)
}

// 获取文件上传地址（apk专用）
export const getFileUrl = (data, config = {}) => {
    return $http.get('/admin/file/upload', data, config)
}

// 查询商户是否存在
export const getMerchantData = (data, config = {}) => {
    return $http.get('admin/merchant/getName', data, config)
}

// 获取地区数据
export const getRegionList = (data, config = {}) => {
    return $http.get('admin/region-limit/regionItems', data, config)
}

// 获取首页布局配置
export const getHomeDeploy = (data, config = {}) => {
    return $http.get('/admin/app/layout', data, config)
}

// 提交首页布局配置
export const postHomeDeploy = (data, config = {}) => {
    return $http.post('/admin/app/layoutConfig', data, config)
}

// 获取支付通道数据
export const getPayChannelList = (data, config = {}) => {
    return $http.get('/admin/merchant-pay-config/payChannel', data, config)
}

// 获取商户站点列表
export const getMerchantSiteList = (data, config = {}) => {
    return $http.get('/admin/merchant/sites', data, config)
}

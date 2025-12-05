import $http from '@/common/util/http'

// 获取厂家列表
export const getvendorList = (data, config = {}) => {
    return $http.get(`/admin/vendor/list`, data, config)
}

// 修改厂家信息
export const editVendor = (data, config = {}) => {
    return $http.post(`/admin/vendor/edit`, data, config)
}

// 获取商户成长配置-分成配置
export const merchantLevelConfigDetailList = (data, config = {}) => {
    return $http.get(`/admin/merchant-level-config/detail`, data, config)
}

// 编辑厂家商户分成配置
export const merchantShareRateConfigEdit = (data, config = {}) => {
    return $http.post(
        `/admin/merchant-level-config/shareRateConfigEdit`,
        data,
        config,
    )
}

// 获取游戏厂商分成列表
export const vendorDivisionListApi = (data, config = {}) => {
    return $http.get(`/admin/vendor/shareList`, data, config)
}

// 修改游戏厂商分成
export const vendorDivisionEditApi = (data, config = {}) => {
    return $http.post(`/admin/vendor/shareEdit`, data, config)
}

// 获取子游戏列表
export const getGameList = (data, config = {}) => {
    return $http.get(`/admin/game/list`, data, config)
}

// 修改子游戏
export const gameEdit = (data, config = {}) => {
    return $http.post(`/admin/game/edit`, data, config)
}

// 更新子游戏
export const gameRenew = (data, config = {}) => {
    return $http.post(`/admin/game/renew`, data, config)
}

// 批量修改子游戏信息
export const batchEditGameData = (data, config = {}) => {
    return $http.post(`/admin/game/batchEdit`, data, config)
}

// 获取商户短信配置列表
export const merchantSmsConfigListApi = (data, config = {}) => {
    return $http.get('/admin/merchant-sms-config/list', data, config)
}

// 编辑商户短信配置
export const merchantSmsConfigEditApi = (data, config = {}) => {
    return $http.post('/admin/merchant-sms-config/edit', data, config)
}

// 获取商户短信配置
export const merchantSmsConfigAttrsApi = (data, config = {}) => {
    return $http.get('/admin/merchant-sms-config/attrs', data, config)
}

// 获取短信余额提醒配置
export const getMerchantSmsConfigRemindApi = (data, config = {}) => {
    return $http.get('/admin/merchant-sms-config/getRemind', data, config)
}

//编辑短信余额提醒配置
export const editMerchantSmsConfigRemindApi = (data, config = {}) => {
    return $http.post('/admin/merchant-sms-config/editRemind', data, config)
}

//USDT归集记录【分页】
export const getUsdtCollectList = (data, config = {}) => {
    return $http.get('/admin/recharge-collect-log/collectList', data, config)
}

// 标签管理 - 获取标签列表
export const getTagList = (data, config = {}) => {
    return $http.get('/admin/game/tagList', data, config)
}

// 标签管理 - 修改标签
export const editTag = (data, config = {}) => {
    return $http.post('/admin/game/tagEdit', data, config)
}
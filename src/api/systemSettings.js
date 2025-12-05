import $http from '@/common/util/http'

// 获取商户账单配置列表
export const merchantBillConfigApi = (data, config = {}) => {
    return $http.get('/admin/merchant-bill-config/list', data, config)
}

// 修改商户账单设置
export const merchantBillConfigEditApi = (data, config = {}) => {
    return $http.post('/admin/merchant-bill-config/edit', data, config)
}

// 获取商户账单配置
export const merchantBillConfigDetailApi = (data, config = {}) => {
    return $http.get('/admin/merchant-bill-config/detail', data, config)
}

// 获取汇率配置
export const exchangeRateConfigList = (data, config = {}) => {
    return $http.get('/admin/exchange-rate-config/list', data, config)
}

// 风控列表查询
export const getRiskList = (data, config = {}) => {
    return $http.get('/admin/merchant-level-config/riskList', data, config)
}

// 修改风控配置
export const riskEdit = (data, config = {}) => {
    return $http.post('/admin/merchant-level-config/riskEdit', data, config)
}

// 获取流量配置
export const getTrafficConfig = (data, config = {}) => {
    return $http.get('/admin/traffic-stat/configList', data, config)
}

// 修改流量配置
export const postTrafficConfig = (data, config = {}) => {
    return $http.post('/admin/traffic-stat/configEdit', data, config)
}

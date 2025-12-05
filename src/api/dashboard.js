import $http from '@/common/util/http'

// 平台-总览
export const getPlatformDataOverview = (data, config = {}) => {
    return $http.get('/admin/platform-home/index', data, config)
}

// 平台-获取厂家数据
export const getPlatformVendorData = (data, config = {}) => {
    return $http.get('/admin/platform-home/vendorData', data, config)
}

// 平台-厂家月账单抽成记录
export const getVendorCommissionLog = (data, config = {}) => {
    return $http.get('/admin/platform-home/vendorMonthBill', data, config)
}

// 平台-商户充值明细
export const getMerchantRechargeInfo = (data, config = {}) => {
    return $http.get('/admin/platform-home/rechargeDetail', data, config)
}

// 获取首页总览数据
export const getOverviewData = (data, config = {}) => {
    return $http.get(`/admin/platform-home/index`, data, config)
}

// 获取首页总览数据详情
export const getOverviewDetail = (data, config = {}) => {
    return $http.get(`/admin/platform-home/merchantDetail`, data, config)
}

// 获取首页游戏账单数据
export const getGameBillData = (data, config = {}) => {
    return $http.get(`/admin/merchant/statFeeDetail`, data, config)
}

// 获取首页商户排行数据
export const getMerchantRankingData = (data, config = {}) => {
    return $http.get(`/admin/platform-home/merchantRank`, data, config)
}

// 获取首页商户游戏投注数据
export const getMerchantBetData = (data, config = {}) => {
    return $http.get(
        `/admin/platform-home/merchantRankPlayDetail`,
        data,
        config,
    )
}

// 获取首页商户优惠赠送数据
export const getMerchantDiscountData = (data, config = {}) => {
    return $http.get(
        `/admin/platform-home/merchantRankPromoDetail`,
        data,
        config,
    )
}

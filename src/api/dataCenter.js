import $http from '@/common/util/http'

// 获取商户消耗列表
export const getMerchantAccountList = (data, config = {}) => {
    return $http.get(`/admin/merchant-account/list`, data, config)
}

// 获取商户数据列表
export const getMerchantList = (data, config = {}) => {
    return $http.get(`/admin/merchant/list`, data, config)
}

// 获取商户分成列表
export const merchantLevelConfigMerchantShareListApi = (data, config = {}) => {
    return $http.get(
        '/admin/merchant-level-config/merchantShareList',
        data,
        config,
    )
}

// 编辑商户分成
export const merchantLevelConfigMerchantShareEditApi = (data, config = {}) => {
    return $http.post(
        '/admin/merchant-level-config/merchantShareEdit',
        data,
        config,
    )
}

// 商户月度结算对账单列表【分页】
export const merchantBillListGetApi = (data, config = {}) => {
    return $http.get('/admin/merchant-bill/list', data, config)
}

// 账单统计导出
export const merchantBillListExport = (data, config = {}) => {
    return $http.get('/admin/merchant-bill/export', data, config)
}

// 修改商户月度对账单
export const merchantBillEditApi = (data, config = {}) => {
    return $http.post('/admin/merchant-bill/edit', data, config)
}

// 商户月度结算子账单列表【分页】
export const merchantBillChildrenApi = (data, config = {}) => {
    return $http.get('/admin/merchant-bill/children', data, config)
}

// 游戏厂商月度结算对账单列表【分页】
export const vendorBillListApi = (data, config = {}) => {
    return $http.get('/admin/vendor-bill/list', data, config)
}

// 稽核游戏厂商月度对账单
export const vendorBillAuditApi = (data, config = {}) => {
    return $http.post('/admin/vendor-bill/audit', data, config)
}

// 编辑游戏厂商月度对账单
export const vendorBillEditApi = (data, config = {}) => {
    return $http.post('/admin/vendor-bill/edit', data, config)
}

// 结算商户月度对账单（完成付款
export const vendorBillSettleApi = (data, config = {}) => {
    return $http.post('/admin/vendor-bill/settle', data, config)
}

// 查询Hash交易信息
export const getTxIdTransInfoApi = (data, config = {}) => {
    return $http.get('/admin/vendor-bill/queryTransInfo', data, config)
}

// 商户未结账单
export const merchantUnsettledBillsApi = (data, config = {}) => {
    return $http.get('/admin/merchant/unsettledBills', data, config)
}

// 获取商户额度
export const getMerchantSummaryApi = (data, config = {}) => {
    return $http.get('/admin/merchant/summary', data, config)
}

// 获取厂家数据
export const getVendorBillApi = (data, config = {}) => {
    return $http.get('/admin/vendor-bill/stats', data, config)
}

// 商户贡献抽成统计
export const getMerchantBillShareStatsApi = (data, config = {}) => {
    return $http.get('/admin/merchant-bill/shareStats', data, config)
}

// 厂家抽成统计
export const getVendorBillShareStatsApi = (data, config = {}) => {
    return $http.get('/admin/vendor-bill/shareStats', data, config)
}

// 商户运营统计【分页】
export const getMerchantStatisticsList = (data, config = {}) => {
    return $http.get('/admin/merchant/infoList', data, config)
}

// 获取商户账变记录
export const getMerchantAccountLogList = (data, config = {}) => {
    return $http.get('/admin/merchant-account/accountLogList', data, config)
}

// 获取商户信息
export const getMerchantInfoData = (data, config = {}) => {
    return $http.get('/admin/merchant/detail', data, config)
}

// 获取商户游戏分成
export const getMerchantGameShareData = (data, config = {}) => {
    return $http.get('/admin/merchant/gameShare', data, config)
}

// 获取厂家记录【分页】
export const getMerchantGameLog = (data, config = {}) => {
    return $http.get('/admin/game-play-log/merchantStat', data, config)
}

// 商户分成差额统计【分页】
export const getShareDifferenceStatistics = (data, config = {}) => {
    return $http.get(`/admin/merchant-bill/shareDiffStats`, data, config)
}

// 商户分成差额查询
export const getShareDifferenceDetail = (data, config = {}) => {
    return $http.get(`/admin/merchant-bill/shareDiffDetail`, data, config)
}

// 日账单列表
export const getPgcDailyBillList = (data, config = {}) => {
    return $http.get(`/admin/merchant-bill/dailyBillList`, data, config)
}

// 获取商户汇总数据列表
export const getMerchantSummaryList = (data, config = {}) => {
    return $http.get(`/admin/merchant/statList`, data, config)
}

// 获取游戏抽成数据详情
export const getGameCommissionData = (data, config = {}) => {
    return $http.get(`/admin/merchant/statGameShareDetail`, data, config)
}

// 获取商户费用数据详情
export const getMerchantCostData = (data, config = {}) => {
    return $http.get(`/admin/merchant/statFeeDetail`, data, config)
}

// 提交商户汇总数据备注
export const postMerchantSummaryData = (data, config = {}) => {
    return $http.post(`/admin/merchant/statGameRemark`, data, config)
}

// 获取游戏账单数据
export const getGameBillData = (data, config = {}) => {
    return $http.get(`/admin/report/gameBillDailyStat`, data, config)
}

// 获取游戏投注数据
export const getGameBetData = (data, config = {}) => {
    return $http.get(`/admin/report/gameDailyStat`, data, config)
}

// 获取商户排行数据
export const getMerchantRankingData = (data, config = {}) => {
    return $http.get(`/admin/merchant/rankData`, data, config)
}

// 获取商户投注数据
export const getMerchantBetData = (data, config = {}) => {
    return $http.get(`/admin/merchant/rankPlayDetail`, data, config)
}

// 获取商户优惠赠送数据
export const getMerchantDiscountData = (data, config = {}) => {
    return $http.get(`/admin/merchant/rankPromoDetail`, data, config)
}

// 商户账单稽核CDN详情
export const getListCdnDetail = (data, config = {}) => {
    return $http.get(`/admin/merchant-bill/listCdnDetail`, data, config)
}

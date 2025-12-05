/*
 * @Author: yilaisai
 * @Date: 2024-06-27 12:00:29
 * @LastEditors: yilaisai
 * @LastEditTime: 2024-11-05 15:55:46
 */
import $http from '@/common/util/http.js'

// 人工出入款-查询
export const manualCompensationList = (data, config = {}) => {
    return $http.get('/admin/merchant-account-adjust/list', data, config)
}

// 人工出入款-新增
export const manualCompensationAdd = (data, config = {}) => {
    return $http.post('/admin/merchant-account-adjust/add', data, config)
}

// 商户查询
export const merchantGetMerchant = (data, config = {}) => {
    return $http.get('/admin/merchant/getName', data, config)
}

// 商户充值订单列表【分页】
export const merchantRechargeListApi = (data, config = {}) => {
    return $http.get('/admin/merchant-recharge/list', data, config)
}

// 获取收款配置
export const paymentConfigApi = (data, config = {}) => {
    return $http.get(
        `/admin/merchant-recharge-config/paymentConfig`,
        data,
        config,
    )
}

// 编辑收款配置
export const paymentConfigEditApi = (data, config = {}) => {
    return $http.post(
        `/admin/merchant-recharge-config/paymentConfigEdit`,
        data,
        config,
    )
}

// 获取商户消耗列表
export const getMerchantRechargeConfig = (data, config = {}) => {
    return $http.get(`/admin/merchant-recharge-config/list`, data, config)
}

// 编辑商户充值配置
export const editMerchantRechargeConfig = (data, config = {}) => {
    return $http.post(`/admin/merchant-recharge-config/edit`, data, config)
}

// 编辑可输入金额配置
export const editMerchantRechargeInputAmountConfig = (data, config = {}) => {
    return $http.post(
        `/admin/merchant-recharge-config/inputAmountConfigEdit`,
        data,
        config,
    )
}

// 归集地址列表
export const getRechargeCollectList = (data, config = {}) => {
    return $http.get('/admin/recharge-collect-log/list', data, config)
}

// 归集地址刷新数据
export const refreshRechargeCollect = (data, config = {}) => {
    return $http.post('/admin/recharge-collect-log/refresh', data, config)
}

// 一键归集
export const rechargeCollectAll = (data, config = {}) => {
    return $http.post('/admin/recharge-collect-log/collects', data, config)
}

// 逾期商户
export const getOverdueListApi = (data, config = {}) => {
    return $http.get('/admin/merchant/overdueList', data, config)
}

// 商户授信额度修正列表查询
export const getMerchantAmendList = (data, config = {}) => {
    return $http.get(
        '/admin/merchant-account-adjust/overdraftList',
        data,
        config,
    )
}

// 商户授信额度修正-新增
export const postMerchantAmendData = (data, config = {}) => {
    return $http.post('/admin/merchant-account-adjust/overdraft', data, config)
}

// 获取归集配置列表
export const getMerchantReceiveList = (data, config = {}) => {
    return $http.get(
        '/admin/merchant-recharge-config/collectConfig',
        data,
        config,
    )
}

// 编辑归集配置
export const editCollectConfig = (data, config = {}) => {
    return $http.post(
        '/admin/merchant-recharge-config/editCollectConfig',
        data,
        config,
    )
}

// 商户账单核对表
export const getChecklist = (data, config = {}) => {
    return $http.get('/admin/merchant-bill/checklist', data, config)
}

// 导出账单
export const getAuditReport = (data, config = {}) => {
    return $http.get('/admin/merchant-bill/auditReport', data, config)
}

// 站点游戏账单
export const getGameBill = (data, config = {}) => {
    return $http.get('/admin/merchant-bill/gameBill', data, config)
}

// 商户账单
export const getViewGameBill = (data, config = {}) => {
    return $http.get('/admin/merchant-bill/get', data, config)
}

//服务器费用统计
export const getServerFeeStat = (data, config = {}) => {
    return $http.get('/admin/merchant/serverFeeStat', data, config)
}

//服务器费用统计
export const getCheckCdnDetail = (data, config = {}) => {
    return $http.get('/admin/merchant-bill/checkCdnDetail', data, config)
}

// 商户充值补单
export const postRetryOrder = (data, config = {}) => {
    return $http.post('/admin/merchant-recharge/retryOrder', data, config)
}

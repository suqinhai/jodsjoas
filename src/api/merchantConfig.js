import $http from '@/common/util/http'

// 获取商户成长配置
export const merchantLevelConfigList = (data, config = {}) => {
    return $http.get(`/admin/merchant-level-config/list`, data, config)
}

// 修改商户成长配置
export const editMerchantLevelConfig = (data, config = {}) => {
    return $http.post(`/admin/merchant-level-config/edit`, data, config)
}

// 商户创建
export const merchantAdd = (data, config = {}) => {
    return $http.post('/admin/merchant/add', data, config)
}

// 获取商户费用列表
export const merchantCostConfigListApi = (data, config = {}) => {
    return $http.get(`/admin/merchant-cost-config/list`, data, config)
}

// 新增或修改商户费用设置
export const merchantCostConfigEditApi = (data, config = {}) => {
    return $http.post(`/admin/merchant-cost-config/edit`, data, config)
}

// 获取商户列表数据
export const getMerchantSiteListApi = (data, config = {}) => {
    return $http.get(`/admin/merchant/siteList`, data, config)
}

// 商户站点状态恢复
export const restoreMerchantSiteStatusApi = (data, config = {}) => {
    return $http.post(`/admin/merchant/siteStatusRestore`, data, config)
}

// 商户状态修改
export const editMerchantSiteStatusApi = (data, config = {}) => {
    return $http.post(`/admin/merchant/editMerchantSiteStatus`, data, config)
}

// 商户站点状态修改
export const editSiteStatusApi = (data, config = {}) => {
    return $http.post(`/admin/merchant/editSiteStatus`, data, config)
}

// 商户站点批量维护
export const maintainMerchantSiteStatusApi = (data, config = {}) => {
    return $http.post(`/admin/merchant/siteStatusMaintain`, data, config)
}

// 获取商户VIP控制余额限制
export const getMemberRiskControlLimit = (data, config = {}) => {
    return $http.get('/admin/user-simple-ctrl/getLimit', data, config)
}

// 编辑商户VIP控制余额限制
export const postMemberRiskControlLimit = (data, config = {}) => {
    return $http.post(`/admin/user-simple-ctrl/editLimit`, data, config)
}

// 损益模式是否允许控赢
export const postRiskControlWin = (data, config = {}) => {
    return $http.post(`/admin/user-simple-ctrl/setCtrlWin`, data, config)
}

// 获取商家申请厂家列表
export const getMerchantApplyVendorList = (data, config = {}) => {
    return $http.get(`/admin/vendor/applyList`, data, config)
}

// 审核商家申请的游戏厂家
export const postMerchantApplyAudit = (data, config = {}) => {
    return $http.post(`/admin/vendor/applyVerify`, data, config)
}

// 获取商家白名单列表
export const getMerchantWhitelistList = (data, config = {}) => {
    return $http.get(`/admin/merchant-whitelist-config/list`, data, config)
}

// 新增/编辑商家白名单配置
export const postMerchantWhitelistConfig = (data, config = {}) => {
    return $http.post(`/admin/merchant-whitelist-config/edit`, data, config)
}

// 删除商家白名单配置
export const deleteMerchantWhitelistConfig = (data, config = {}) => {
    return $http.post(`/admin/merchant-whitelist-config/delete`, data, config)
}

// 域名管理列表（前台/后台）
export const getDomainList = (data, config = {}) => {
    return $http.get('/admin/domain/list', data, config)
}

// 添加域名
export const postDomainData = (data, config = {}) => {
    return $http.post('/admin/domain/edit', data, config)
}

// 验证域名
export const postVerifyDomain = (data, config = {}) => {
    return $http.post('/admin/domain/active', data, config)
}

// 停用/启用域名
export const postDomainStatus = (data, config = {}) => {
    return $http.post('/admin/domain/toggle', data, config)
}

// 删除域名
export const deleteDomainData = (data, config = {}) => {
    return $http.post('/admin/domain/delete', data, config)
}

// 获取推广商户申请列表
export const getPromoteApplyList = (data, config = {}) => {
    return $http.get('/admin/promote-merchant/list', data, config)
}

// 提交推广商户申请审核
export const postPromoteApplyAudit = (data, config = {}) => {
    return $http.post('/admin/promote-merchant/edit', data, config)
}

// 获取推广设置
export const getPromoteConfig = (data, config = {}) => {
    return $http.get('/admin/promote-merchant/configDetail', data, config)
}

// 编辑推广设置
export const postPromoteConfig = (data, config = {}) => {
    return $http.post('/admin/promote-merchant/configEdit', data, config)
}

// 获取数据推送配置列表
export const getDataPushConfigList = (data, config = {}) => {
    return $http.get('/admin/stat-push-config/list', data, config)
}

// 提交数据推送配置
export const postDataPushConfig = (data, config = {}) => {
    return $http.post('/admin/stat-push-config/edit', data, config)
}

// 删除数据推送配置
export const deleteDataPushConfig = (data, config = {}) => {
    return $http.post('/admin/stat-push-config/delete', data, config)
}

// 获取不限制模板的商户
export const getTemplateNoLimitMerchant = (data, config = {}) => {
    return $http.get('/admin/merchant/getTemplateNoLimit', data, config)
}

// 配置不限制模板的商户
export const postTemplateNoLimitMerchant = (data, config = {}) => {
    return $http.post('/admin/merchant/templateNoLimit', data, config)
}

// 商户支付配置开关【分页】
export const getMerchantPayChannelLimit = (data, config = {}) => {
    return $http.get('/admin/merchant/payChannelLimit', data, config)
}

// 配置商户支付通道限制
export const postMerchantPayChannelLimit = (data, config = {}) => {
    return $http.post('/admin/merchant/payChannelLimit', data, config)
}

// 获取商户模式列表
export const getModeList = (data, config = {}) => {
    return $http.get('/admin/merchant/modeList', data, config)
}

// 商户模式修改
export const postEditMode = (data, config = {}) => {
    return $http.post('/admin/merchant/editMode', data, config)
}

// 活动类型
export const getTypesData = (data, config = {}) => {
    return $http.get(`/admin/promotion/typeList`, data, config)
}

// 模板风格列表
export const getTemplateData = (data, config = {}) => {
    return $http.get(`/admin/app/templateList`, data, config)
}

// 查询介绍人简要信息
export const merchantInvite = (data, config = {}) => {
    return $http.get(`/admin/merchant-invite-rebate-log/get`, data, config)
}

// 推广佣金审核列表
export const reviewList = (data, config = {}) => {
    return $http.get(
        '/admin/merchant-invite-rebate-log/reviewList',
        data,
        config,
    )
}

// 推广佣金配置
export const inviteConfigs = (data, config = {}) => {
    return $http.get(
        '/admin/merchant-invite-rebate-log/inviteConfigs',
        data,
        config,
    )
}

// 修改商户的推广佣金配置
export const editInviteConfig = (data, config = {}) => {
    return $http.post(
        '/admin/merchant-invite-rebate-log/editInviteConfig',
        data,
        config,
    )
}

// 修改商户的推广佣金配置
export const editPromotionCommission = (data, config = {}) => {
    return $http.post('/admin/merchant-invite-rebate-log/review', data, config)
}

// 获取商户全部配置信息
export const getMerchantConfig = (data, config = {}) => {
    return $http.get('/admin/merchant/merchantConfig', data, config)
}

// 修改商户配置
export const editMerchantConfig = (data, config = {}) => {
    return $http.post('/admin/merchant/edit', data, config)
}

// 获取VIP余额限制默认配置
export const getVipLimitConfig = (data, config = {}) => {
    return $http.get('/admin/merchant/vipLimitConfig', data, config)
}

// 商户未出账单列表
export const getPlatformUnBills = (data, config = {}) => {
    return $http.get('/admin/merchant/platformUnBills', data, config)
}

// 商户子站点数
export const getSubsiteNumberData = (data, config = {}) => {
    return $http.get('/admin/merchant/merchantList', data, config)
}

// 根据国家 获取活动
export const getTypesDataByCountry = (data, config = {}) => {
    return $http.get('/admin/promotion/showList', data, config)
}

//商户支付ip列表
export const getIpList = (data, config = {}) => {
    return $http.get('/admin/ip/list', data, config)
}
//新增商户支付ip
export const postAddIp = (data, config = {}) => {
    return $http.post('/admin/ip/edit', data, config)
}
//删除商户支付ip
export const postDeleteIp = (data, config = {}) => {
    return $http.post('/admin/ip/delete', data, config)
}
// 商户支付ip详情
export const getIpDetail = (data, config = {}) => {
    return $http.get('/admin/ip/query', data, config)
}
// 商户未出账单列表
export const getUnPendingBillsData = (data, config = {}) => {
    return $http.get('/admin/merchant/platformUnBills', data, config)
}
// 获取站点未出游戏分成
export const getUnPendingShareData = (data, config = {}) => {
    return $http.get('/admin/merchant/platUnPendingShare', data, config)
}
//授权商户支付ip
export const postAuthIp = (data, config = {}) => {
    return $http.post('/admin/ip/merchantEdit', data, config)
}
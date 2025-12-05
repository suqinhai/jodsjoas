import $http from '@/common/util/http'

// 消息通知列表
export const messageConfigListApi = (data, config = {}) => {
    return $http.get('/admin/msg/list', data, config)
}

// 修改消息通知状态
export const messageConfigEditStatusApi = (data, config = {}) => {
    return $http.post('/admin/msg/editStatus', data, config)
}

// 删除消息通知
export const messageConfigDeleteApi = (data, config = {}) => {
    return $http.post('/admin/msg/delete', data, config)
}

// 新增|修改消息通知
export const messageConfigAddOrEditApi = (data, config = {}) => {
    return $http.post('/admin/msg/addOrEdit', data, config)
}

// 获取客服配置列表
export const getCustomerList = (data, config = {}) => {
    return $http.get('/admin/customer-service-config/list', data, config)
}

// 编辑客服配置
export const editCustomerConfig = (data, config = {}) => {
    return $http.post('/admin/customer-service-config/edit', data, config)
}

// 投诉列表查询【分页】
export const getDealerComplainList = (data, config = {}) => {
    return $http.get('/admin/dealer-complain/list', data, config)
}

// 处理投诉
export const postDealerComplainDispose = (data, config = {}) => {
    return $http.post('/admin/dealer-complain/edit', data, config)
}

// 有奖反馈分页列表
export const feedbackListApi = (data, config = {}) => {
    return $http.get('/admin/feedback/list', data, config)
}

// 处理反馈信息
export const postFeedbackEdit = (data, config = {}) => {
    return $http.post('/admin/feedback/edit', data, config)
}

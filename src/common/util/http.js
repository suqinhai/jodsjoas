import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import qs from 'qs'
import router from '../../router/index.js'
import userStore from '@/store/user'
import tagsStore from '@/store/tags'
import commonStore from '@/store/common'
import {
    token,
    getHeaderTimeZone,
    blobToJson,
    excelFileExport,
    getTimezone,
} from '@/common/util'

const service = axios.create({
    withCredentials: true,
    baseURL: process.env.VITE_AUTH_PATH + '/api',
    timeout: 300000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
})

service.interceptors.request.use(
    (config) => {
        config.headers['App-Id'] =
            'game_admin/PC/1.0.0/main/' + getHeaderTimeZone()
        config.headers['Accept-Language'] = 'zh'
        config.headers['MID'] = '0'
        // countryFailure 不传为true
        if (
            commonStore.country != 0 &&
            config.method === 'get' &&
            config.params.countryFailure !== false
        ) {
            config.headers['country'] = commonStore.country
        }
        if (token()) {
            config.headers.Authorization = token()
        }
        return config
    },
    (error) => Promise.reject(error),
)

service.interceptors.response.use(
    async (response) => {
        const { data, config } = response
        // 文件导出
        // if (config.responseType === 'blob') {
        if (
            (config.isExport && !data.status) ||
            config.responseType === 'blob'
        ) {
            excelFileExport(response)
            return Promise.resolve()
        }

        if (!data) return response
        const { code, msg, status, callback } = data
        if (msg) {
            if (callback && callback === 'alert') {
                ElMessageBox.alert(msg, {
                    dangerouslyUseHTMLString: true,
                })
                // ElMessageBox.alert(msg)
            } else {
                let type = status === 'OK' ? 'success' : 'error'
                ElMessage[type](msg)
            }
        }

        // 状态为login时记录当前路由地址并跳到登录页
        let defaultPath = router.currentRoute.value.fullPath
        if (status === 'login' && defaultPath !== '/login') {
            localStorage.setItem('defaultPath', defaultPath)
            await userStore().logout()
            tagsStore().clearTags()
            router.replace('/login')
            return Promise.reject()
        } else if (status === 'frozen' || status === 'blocked') {
            return Promise.reject(data)
        }
        if (code !== 0) return Promise.reject(data)
        return Promise.resolve(data)
    },
    (error) => {
        const { response } = error
        if (response && response.data && response.data.msg) {
            if (response.data.callback && response.data.callback === 'alert') {
                ElMessageBox.alert(response.data.msg, {
                    dangerouslyUseHTMLString: true,
                })
                // ElMessageBox.alert(response.data.msg)
            } else {
                ElMessage.error(response.data.msg)
            }
        } else {
            ElMessage.error('请求失败！')
        }
        return Promise.reject(error)
    },
)

export const $http = {
    get: (url, data = null, config = {}) => {
        let params = {}
        if (data) {
            for (let key in data) {
                if (!['', null, undefined].includes(data[key])) {
                    params[key] = data[key]
                }
            }
        }
        if (params.isExport) {
            params.export = getTimezone()
            config.isExport = true
            delete params.isExport
        }
        return service.get(url, {
            params,
            ...config,
        })
    },
    post: (url, data = null, config = {}, allowDots = true) =>
        // allowDots：数据存在数组格式(例：{a:[{b:1}]})时为true，数据存在对象嵌套(例：{a:{b:1}})时为false
        service.post(
            url,
            qs.stringify(data, { arrayFormat: 'indices', allowDots }),
            config,
        ),
}

export default $http

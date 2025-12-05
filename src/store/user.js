/*
 * @Date: 2023-09-08 10:06:56
 * @LastEditors: yilaisai
 * @LastEditTime: 2024-01-04 16:15:07
 */
import { defineStore } from 'pinia'
import { fetchTree, setPath, token } from '../common/util'
import { getMenuList, loginApi, empLogoutApi } from '@api/common'
import router from '../router/index'

const usertore = defineStore('user', {
    state: () => {
        return {
            menuPermissList: localStorage.getItem('menu_permiss_list')
                ? JSON.parse(localStorage.getItem('menu_permiss_list'))
                : [],
            menuList: localStorage.getItem('menu_list')
                ? JSON.parse(localStorage.getItem('menu_list'))
                : [],
            funPermissList: localStorage.getItem('fun_permiss_list')
                ? JSON.parse(localStorage.getItem('fun_permiss_list'))
                : [],
            userInfo: localStorage.getItem('user_info')
                ? JSON.parse(localStorage.getItem('user_info'))
                : {},
        }
    },
    getters: {
        isHasPermiss() {
            return (val = '') => this.funPermissList.includes(val)
        },
        isHasMenuPermiss() {
            return (val = '') => this.menuPermissList.includes(val)
        },
    },
    actions: {
        // 登录
        login(val, config = {}) {
            return new Promise((resolve, reject) => {
                loginApi(val, config)
                    .then((res) => {
                        this.userInfo = { ...res.data }
                        this.token = res.data.token
                        token(res.data.token)
                        localStorage.setItem(
                            'user_info',
                            JSON.stringify(this.userInfo),
                        )
                        // this.getMenuList()
                        resolve()
                    })
                    .catch((err) => {
                        reject()
                    })
            })
        },

        // 登出
        logout() {
            return new Promise((resolve, reject) => {
                // empLogoutApi()
                //     .then((res) => {
                localStorage.removeItem('user_info')
                localStorage.removeItem('fun_permiss_list')
                localStorage.removeItem('menu_permiss_list')
                localStorage.removeItem('menu_list')
                localStorage.removeItem('defaultPath')
                token(null)
                this.userInfo = {}
                this.funPermissList = []
                this.menuPermissList = []
                this.menuList = []
                resolve()
                // })
                // .catch((err) => {
                //     reject()
                // })
            })
        },

        // 获取菜单权限
        getMenuList() {
            return new Promise(async (resolve, reject) => {
                await getMenuList()
                    .then((res) => {
                        let arr = res.data.filter((item) => item.isMenu)
                        this.funPermissList = res.data
                            .filter((item) => !item.isMenu)
                            .filter((item) => item.routeCode)
                            .map((item) => item.routeCode)
                        this.menuPermissList = arr
                            .filter((item) => item.routeCode)
                            .map((item) => item.routeCode)
                        this.menuPermissList.unshift('1')
                        localStorage.setItem(
                            'fun_permiss_list',
                            JSON.stringify(this.funPermissList),
                        )
                        localStorage.setItem(
                            'menu_permiss_list',
                            JSON.stringify(this.menuPermissList),
                        )
                        arr = fetchTree(arr, 'id', 'pId')
                        setPath(arr)
                        localStorage.setItem('menu_list', JSON.stringify(arr))
                        this.menuList = arr
                        // console.log(11111111, arr)
                        resolve()
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        },
    },
})

export default usertore

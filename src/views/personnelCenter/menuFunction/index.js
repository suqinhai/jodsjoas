/*
 * @Author: liqijiang 3045273238@qq.com
 * @Date: 2023-09-20 19:40:25
 * @LastEditors: liqijiang 3045273238@qq.com
 * @LastEditTime: 2023-10-25 16:36:14
 * @FilePath: \management-bg\src\views\manageConfig\menuFunction\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 *
 */
import { toRefs, reactive } from 'vue'
import { roleMenusApi } from '@/api/manageConfig.js'
import { fetchTree } from '@/common/util/index'

export const useIndexHook = () => {
    const state = reactive({
        allMenulist: [],
    })

    //获取获取全部权限菜单
    const getAllMenus = async () => {
        const res = await roleMenusApi()
        // console.log(res);
        if (res.code == 0) {
            state.allMenulist = fetchTree(res.data, 'id', 'parentId')
        }
    }
    getAllMenus()

    return {
        ...toRefs(state),
    }
}

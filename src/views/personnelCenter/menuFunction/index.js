
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

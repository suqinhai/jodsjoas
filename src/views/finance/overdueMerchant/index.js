/*
 * @Author: liqijiang 3045273238@qq.com
 * @Date: 2023-11-08 19:46:43
 * @LastEditors: yilaisai
 * @LastEditTime: 2023-12-16 18:24:54
 * @FilePath: \management-bg\src\views\financialManage\overdueEnter\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { toRefs, reactive } from 'vue'
import { getOverdueListApi } from '@/api/financeManage.js'

export const useIndexHook = () => {
    const state = reactive({
        pageConfig: {
            _page: 1,
            _size: 10,
        },
        tableData: [],
        total: 0,
    })

    const getList = () => {
        getOverdueListApi(state.pageConfig).then((res) => {
            const { code, data } = res
            if (code === 0) {
                state.tableData = data.list
                state.total = data.total
            }
        })
    }

    getList()

    return {
        ...toRefs(state),
        getList,
    }
}


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


import { toRefs, reactive } from 'vue'
import { exchangeRateConfigList } from '@/api/systemSettings.js'

export const useIndexHook = () => {
    const state = reactive({
        updateType: 1,
        updateRate: 1,
        exchangeRateConfigListData: [],
    })

    const getExchangeRateConfigList = async () => {
        const { code, data } = await exchangeRateConfigList()
        if (code == 0) {
            console.log(data)
            state.exchangeRateConfigListData = data
        }
    }
    getExchangeRateConfigList()

    return {
        ...toRefs(state),
    }
}

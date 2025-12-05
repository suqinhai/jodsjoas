/*
 * @Author: liqijiang 3045273238@qq.com
 * @Date: 2023-10-23 09:49:40
 * @LastEditors: liqijiang 3045273238@qq.com
 * @LastEditTime: 2023-10-25 16:45:50
 * @FilePath: \management-bg\src\views\systemSet\exchangeConfig\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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

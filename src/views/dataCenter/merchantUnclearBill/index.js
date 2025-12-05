/*
 * @Author: liqijiang 3045273238@qq.com
 * @Date: 2023-09-27 11:18:57
 * @LastEditors: liqijiang 3045273238@qq.com
 * @LastEditTime: 2023-11-22 10:02:00
 * @FilePath: \management-bg\src\views\dataCenter\enterUnclearCount\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { onMounted, reactive, toRefs, ref } from 'vue'
import { useRoute } from 'vue-router'
import { merchantUnsettledBillsApi } from '@/api/dataCenter.js'

export const useIndexHook = () => {
    const { query } = useRoute()
    const state = reactive({
        ext: ref(0),
        merchantUnsettledBillsList: [],
    })

    onMounted(() => {
        merchantUnsettledBillsApi({ merchantId: query.id }).then(
            ({ code, data, ext }) => {
                // code=0;
                // data= [
                //         {
                //             "enabled": false,
                //             "id": 1,
                //             "period": 1696089600000,
                //             "present": false,
                //             "totalPay": 6000.12,
                //             "updateTime": 1698906902854
                //         },
                //         {
                //             "enabled": false,
                //             "id": 2,
                //             "period": 1693497600000,
                //             "present": false,
                //             "totalPay": 6000.12,
                //             "updateTime": 1698906902854
                //         }
                //     ];
                //     ext=10000.24
                if (code == 0) {
                    state.ext = ext
                    state.merchantUnsettledBillsList = data
                }
            },
        )
    })

    return {
        query,
        ...toRefs(state),
    }
}

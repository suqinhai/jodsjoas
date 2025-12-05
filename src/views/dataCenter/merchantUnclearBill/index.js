
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



import { toRefs, reactive, ref, computed } from 'vue'
import {
    merchantBillConfigApi,
    merchantBillConfigEditApi,
    merchantBillConfigDetailApi,
} from '@/api/systemSettings.js'
import { ElMessage } from 'element-plus'

export const useIndexHook = () => {
    const state = reactive({
        showEditDialog: false,
        merchantBillConfigList: [],
        editForm: {},
    })

    //获取商户账单时间配置列表
    const getMerchantBillConfig = async () => {
        const { code, data } = await merchantBillConfigApi()
        if (code == 0) {
            state.merchantBillConfigList = data
        }
    }
    getMerchantBillConfig()

    //修改商户账单时间配置
    const editMerchantBillConfig = async (params) => {
        const { code } = await merchantBillConfigEditApi(params)
        if (code == 0) {
            // ElMessage.success("修改成功");
            state.showEditDialog = false
            getMerchantBillConfig()
        }
    }

    //点击修改
    const handleEdit = (value) => {
        state.isShowEditDialog = true
        merchantBillConfigDetailApi({ type: value.type }).then(
            ({ code, data }) => {
                if (code == 0) {
                    state.editForm = { ...data }
                }
            },
        )
        state.showEditDialog = true
    }

    //
    const handleConfirm = () => {
        editMerchantBillConfig(state.editForm)
    }

    //点击切换通知开关
    const handleChangeStatus = (value) => {
        let params = { ...value }
        params.status = params.status ? 0 : 1
        console.log(params)
        editMerchantBillConfig(params)
        return new Promise((resolve) => {
            return resolve(true)
        })
    }

    return {
        ...toRefs(state),
        handleEdit,
        handleChangeStatus,
        handleConfirm,
    }
}

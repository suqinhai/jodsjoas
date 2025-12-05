

import { paymentConfigApi, paymentConfigEditApi } from '@/api/financeManage.js'
import { ElMessage } from 'element-plus'
import { reactive, toRefs, ref } from 'vue'

export const useIndexHook = () => {
    const state = reactive({
        paymentConfigList: [], //收款配置列表
        editFormDialogRef: ref(), //修改收款配置弹窗
        editForm: {
            channel: ref(), //收款通道
            toAddr: '', //收款地址
            timeout: ref(), //失效时间
        }, //修改收款配置
    })

    //获取收款配置数据
    const getPaymentConfigList = async () => {
        const res = await paymentConfigApi()
        if (res.code == 0) {
            state.paymentConfigList = [res.data]
        }
    }
    getPaymentConfigList()

    //点击修改
    const handleEdit = (value) => {
        state.editForm.toAddr = value.toAddr
        state.editForm.channel = value.channel
        state.editForm.timeout = value.timeout
        state.editFormDialogRef.openDialog()
    }

    //修改表单提交
    const editSubmit = async () => {
        state.editFormDialogRef.openLoading()
        const { code } = await paymentConfigEditApi(state.editForm)
        if (code == 0) {
            // ElMessage.success("修改成功");
        }
        state.editFormDialogRef.closeLoading()
        state.editFormDialogRef.closeDialog()
        //刷新列表
        getPaymentConfigList()
    }

    return {
        ...toRefs(state),
        handleEdit,
        editSubmit,
    }
}

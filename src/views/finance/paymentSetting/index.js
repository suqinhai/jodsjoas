/*
 * @Author: liqijiang 3045273238@qq.com
 * @Date: 2023-09-14 17:46:01
 * @LastEditors: yilaisai
 * @LastEditTime: 2023-12-22 19:49:55
 * @FilePath: \management-bg\src\views\paymentSetting\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

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

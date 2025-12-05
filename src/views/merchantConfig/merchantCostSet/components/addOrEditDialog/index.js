/*
 * @Author: liqijiang 3045273238@qq.com
 * @Date: 2023-11-20 12:18:48
 * @LastEditors: liqijiang 3045273238@qq.com
 * @LastEditTime: 2023-11-20 15:25:19
 * @FilePath: \management-bg\src\views\enterConfig\enterCostSet\components\addOrEditDialog\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { toRefs, reactive, ref } from 'vue'

export const useIndexHook = (props, emits) => {
    const state = reactive({
        formRef: ref(),
        rules: {
            merchantId: [
                {
                    required: true,
                    message: '商户ID不可为空',
                    trigger: 'blur',
                },
            ],
            openFee: [
                {
                    required: true,
                    message: '开版费不可为空',
                    trigger: 'blur',
                },
            ],
            lineCost: [
                {
                    required: true,
                    message: '线路费用不可为空',
                    trigger: 'blur',
                },
            ],
            monthMin: [
                {
                    required: true,
                    message: '游戏月保底不可为空',
                    trigger: 'blur',
                },
            ],
        },
    })

    const handleConfirm = (dialog) => {
        if (!state.formRef) return
        state.formRef.validate((valid, fields) => {
            if (valid) {
                emits('update:form', props.form)
                emits('confirm',dialog)
            }
        })
    }

    return {
        ...toRefs(state),
        handleConfirm,
    }
}

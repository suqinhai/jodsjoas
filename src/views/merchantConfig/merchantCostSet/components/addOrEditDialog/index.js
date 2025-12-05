
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

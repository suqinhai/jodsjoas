
import { toRefs, reactive, ref, watch } from 'vue'

export const useIndexHook = (props, emits) => {
    const state = reactive({
        formRef: ref(),
        rules: {
            smsVendor: [
                { required: true, message: '必选项不可为空', trigger: 'blur' },
            ],
        },
    })

    const handleConfirm = () => {
        if (!state.formRef) return
        state.formRef.validate((valid) => {
            if (valid) {
                emits('update:editForm', props.editForm)
                emits('confirm')
            } else {
                console.log('error submit!')
            }
        })
    }

    return {
        ...toRefs(state),
        handleConfirm,
    }
}

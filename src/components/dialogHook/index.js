
import { toRefs, reactive } from 'vue'

export const useIndexHook = (emits) => {
    const state = reactive({
        isShowDialog: true,
        loading: false,
    })

    //点击取消
    const handleCancel = () => {
        emits('close')
        state.isShowDialog = false
    }

    //点击确认
    const handleConfirm = () => {
        emits('confirm')
    }

    //开启加载
    const showLoading = () => {
        state.loading = true
    }

    //关闭加载
    const closeLoading = () => {
        state.loading = false
    }

    //
    const handleClick = (value) => {
        emits('otherEvent', value)
    }

    return {
        ...toRefs(state),
        handleCancel,
        handleConfirm,
        showLoading,
        closeLoading,
        handleClick,
    }
}

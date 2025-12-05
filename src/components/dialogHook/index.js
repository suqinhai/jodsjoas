/*
 * @Author: liqijiang 3045273238@qq.com
 * @Date: 2023-11-07 16:29:22
 * @LastEditors: liqijiang 3045273238@qq.com
 * @LastEditTime: 2023-11-07 18:28:38
 * @FilePath: \management-bg\src\components\dialogHook\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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

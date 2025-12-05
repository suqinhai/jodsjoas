/*
 * @Author: liqijiang 3045273238@qq.com
 * @Date: 2023-09-07 12:54:57
 * @LastEditors: liqijiang 3045273238@qq.com
 * @LastEditTime: 2023-11-07 16:25:23
 */
import { reactive,toRefs } from "vue"

export const useFormDialogHook=(emits,props)=>{
    const state=reactive({
        isShowDialog:false,
        loading:false
    })

    //打开弹窗
    const openDialog=()=>{
        state.isShowDialog=true;
    }

    //关闭弹窗
    const closeDialog=()=>{
        state.loading=false;
        state.isShowDialog=false;
    }

    //提交按钮加载效果
    const openLoading=()=>{
        state.loading=true
    }

    //关闭提交按钮加载效果
    const closeLoading=()=>{
        state.loading=false
    }

    const onSubmit=()=>{
        emits('onSubmit')
    }

    const handleFn=() => {
        emits('otherBtn')
    }

    return {
        ...toRefs(state),
        openDialog,
        closeDialog,
        onSubmit,
        // opened,
        openLoading,
        closeLoading, 
        handleFn,
    }
}

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
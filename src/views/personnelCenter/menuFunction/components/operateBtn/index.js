
import { toRefs,reactive } from "vue"

export const useIndexHook=()=>{

    const state=reactive({
        
    })

    return {
        ...toRefs(state),
    }
}
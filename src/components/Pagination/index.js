
import { computed } from 'vue'
import { toRefs, reactive, ref } from 'vue'

export const useIndexHook = (props, emits) => {
    const state = reactive({})

    const getPage = computed({
        get() {
            return props.page
        },
        set(val) {
            emits('update:page', val)
        },
    })

    const getSize = computed({
        get() {
            return props.size
        },
        set(val) {
            emits('update:size', val)
        },
    })

    //分页page切换
    const handlePageChange = () => {
        emits('pagination')
    }

    //分页size切换
    const handleSizeChange = (value) => {
        if (value * getPage.value > props.total) {
            emits('update:page', parseInt(props.total / value) + 1)
        }
        emits('pagination')
    }

    return {
        ...toRefs(state),
        handleSizeChange,
        handlePageChange,
        getPage,
        getSize,
    }
}

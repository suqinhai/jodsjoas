/*
 * @Author: liqijiang 3045273238@qq.com
 * @Date: 2023-10-27 15:24:13
 * @LastEditors: liqijiang 3045273238@qq.com
 * @LastEditTime: 2023-10-27 17:45:29
 * @FilePath: \management-bg\src\components\pagination\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE,
 */
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

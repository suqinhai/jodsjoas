/*
 * @Author: liqijiang 3045273238@qq.com
 * @Date: 2023-11-18 10:04:45
 * @LastEditors: liqijiang 3045273238@qq.com
 * @LastEditTime: 2023-11-18 15:38:17
 * @FilePath: \management-bg\src\views\factoryManage\msgManage\components\editDialog\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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

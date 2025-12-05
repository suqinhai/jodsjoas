/*
 * @Author: liqijiang 3045273238@qq.com
 * @Date: 2023-09-11 10:32:47
 * @LastEditors: yilaisai
 * @LastEditTime: 2023-12-22 19:47:05
 * @FilePath: \management-bg\src\views\enterDevelop\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { toRefs, reactive, ref } from 'vue'
import {
    merchantLevelConfigList,
    editMerchantLevelConfig,
} from '@/api/merchantConfig.js'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

export const useIndexHook = () => {
    const router = useRouter()

    const state = reactive({
        showEditDialog: false,
        merchantLevelConfigData: [], //商户成长配置列表
        editForm: {}, //修改商户成长配置
    })

    //获取商户成长配置列表
    const getMerchantLevelConfigList = async () => {
        const res = await merchantLevelConfigList()
        state.merchantLevelConfigData = res.data
    }
    getMerchantLevelConfigList()

    //修改商户成长配置
    const handleEdit = (value) => {
        let { id, overdraftRatio, totalRecharge, level } = value
        state.editForm = { id, overdraftRatio, totalRecharge, level }
        state.showEditDialog = true
    }

    //修改商户成长配置提交
    const handleConfirm = () => {
        editMerchantLevelConfig(state.editForm).then(({ code }) => {
            if (code === 0) {
                state.showEditDialog = false
            }
            //刷新列表
            getMerchantLevelConfigList()
        })
    }

    //点击分成设定
    const handleShareSet = (value) => {
        router.push({
            path: '/factory/factory-share-stair',
            query: {
                id: value.id, //商户等级配置ID,
            },
        })
    }

    return {
        ...toRefs(state),
        handleEdit,
        handleConfirm,
        handleShareSet,
    }
}

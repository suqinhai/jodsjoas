
import { toRefs, reactive, ref } from 'vue'
import {
    merchantCostConfigListApi,
    merchantCostConfigEditApi,
} from '@/api/merchantConfig.js'
import { ElMessage } from 'element-plus'

export const useIndexHook = () => {
    const state = reactive({
        showDialog: false,
        merchantCostConfigList: [],
        pageConfig: {
            _page: 1,
            _size: 10,
        },
        total: 0,
        operateType: false, //操作类型 false 新增 true 修改
        form: {},
        formData: {},
    })

    const fetchData = (val) => {
        if (val) {
            state.pageConfig._page = 1
            if (val === 'reset') {
                state.formData = {}
            }
        }
        merchantCostConfigListGet()
    }

    //获取商户费用列表
    const merchantCostConfigListGet = async () => {
        let params = {
            ...state.pageConfig,
            ...state.formData,
            identity: 0,
        }
        const res = await merchantCostConfigListApi(params)
        if (res.code == 0) {
            state.merchantCostConfigList = res.data.list
            //   state.pageConfig._page = res.data.page;
            //   state.pageConfig._size = res.data.size;
            state.total = res.data.total
        }
    }
    merchantCostConfigListGet()

    //创建或新增商户费用设置
    const merchantCostConfigEdit = async (data, dialog) => {
        dialog.showLoading()
        merchantCostConfigEditApi(data).then(({ code }) => {
            if (code == 0) {
                // ElMessage.success(
                //     `${state.operateType ? '创建成功' : '修改成功'}`,
                // )
                state.showDialog = false
            }
            dialog.closeLoading()
            //刷新列表
            merchantCostConfigListGet()
        })
    }

    //点击创建
    const handleCreate = () => {
        state.form = {
            identity: 0,
        }
        state.operateType = true
        state.showDialog = true
    }

    //点击修改
    const handleEdit = (value) => {
        let { lineCost, merchantId, monthMin, openFee, upLimit } = value
        state.form = {
            lineCost,
            merchantId,
            monthMin,
            openFee,
            upLimit,
            identity: 0,
        }
        state.operateType = false
        state.showDialog = true
    }

    //弹窗表单提交
    const handleConfirm = async (dialog) => {
        merchantCostConfigEdit(state.form, dialog)
    }

    return {
        ...toRefs(state),
        handleConfirm,
        handleCreate,
        handleEdit,
        merchantCostConfigListGet,
        fetchData,
    }
}

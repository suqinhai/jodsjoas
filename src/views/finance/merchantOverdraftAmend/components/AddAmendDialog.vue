<template>
    <Dialog ref="dialog" width="500" title="商户授信额度修正" top="10vh" @confirm="handleSubmit(deployFormRef)" @cancel="cancel">
        <el-form ref="deployFormRef" :model="state.formData" :rules="state.rules" label-width="85px">
            <el-form-item label="商户ID:" prop="merchantId">
                <el-input-number :disabled="state.isSearch" v-model="state.formData.merchantId"
                    style="width: 256px;margin-right: 15px" placeholder="请输入商户ID" :controls="false" :precision="0" :min="1" />
                <el-button v-throttle type="primary" @click="handleSearch">{{state.isSearch ?'重 置':'搜 索'}}</el-button>
            </el-form-item>
            <el-row>
                <el-col :span="9">
                    <el-form-item label="商户ID:">
                        <span>{{state.merchantInfo.id}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="15">
                    <el-form-item label-width="85px" label="商户名称:">
                        <span>{{state.merchantInfo.name}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="操作:">
                <el-radio-group :disabled="!state.isSearch" v-model="state.formData.tradeType">
                    <el-radio v-for="item in merchantTradeType" :key="item.value" :label="item.value*1">{{item.label}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="修正金额:" prop="amount">
                <el-input-number :disabled="!state.isSearch" style="width: 100%" v-model="state.formData.amount" :controls="false"
                    :precision="2" placeholder="请输入大于0的数字" />
                <!-- <div style="font-size: 12px">人工加款时请输入正数，人工扣款时请输入负数</div> -->
            </el-form-item>
            <el-form-item label="备注:" prop="remark">
                <el-input :disabled="!state.isSearch" style="width: 100%" type="textarea" :rows="4" placeholder="请输入备注"
                    v-model="state.formData.remark" show-word-limit maxlength="100" />
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script setup>
import Dialog from '@/components/Dialog/index.vue'
import { postMerchantAmendData } from '@/api/financeManage'
import { getMerchantData } from '@/api/common'
import { ref, reactive, defineProps } from 'vue'
import { ElMessage } from 'element-plus'

const emits = defineEmits(['close', 'fetchData'])
const props = defineProps({
    merchantTradeType: {
        type: Array,
        default: () => []
    }
})
const state = reactive({
    isSearch: false,
    formData: {
        merchantId: undefined,
        tradeType: 7,
    },
    merchantInfo: {},
    rules: {
        merchantId: [{ required: true, message: '请输入商户ID！', trigger: 'change' }],
        amount: [
            { required: true, message: '请输入修正金额！', trigger: 'change' },
            { type: 'number', max: 999999, min: 0.01, message: '请输入0~999999之间的数字！', trigger: 'change' }
        ],
        remark: [{ required: true, message: '请输入备注！', trigger: 'change' }],
    }
})
const deployFormRef = ref(null)
const dialog = ref(null)

const handleSearch = () => {
    if (state.isSearch) {
        delete state.formData.merchantId
        state.merchantInfo = {}
        state.isSearch = false
    } else {
        if (!state.formData.merchantId) {
            return ElMessage.warning('请输入商户ID再进行搜索！')
        }
        dialog.value.showLoading()
        getMerchantData({ id: state.formData.merchantId }).then(({ code, data }) => {
            if (code === 0 && data) {
                state.merchantInfo = data
                state.formData.merchantId = state.merchantInfo.id
                state.isSearch = true
            } else {
                ElMessage.warning(`未查询到此商户ID信息！`)
            }
            dialog.value.closeLoading()
        }).catch((err) => {
            dialog.value.closeLoading()
        })
    }
}

const handleSubmit = (el) => {
    el.validate((valid, fields) => {
        if (valid) {
            let params = { ...state.formData }
            dialog.value.showLoading()
            postMerchantAmendData(params).then(() => {
                cancel()
                emits('fetchData')
            }).catch(() => {
                dialog.value.closeLoading()
            })
        } else {
            ElMessage.warning('请完善表单内容再进行提交！')
        }
    })
}

const cancel = () => {
    emits('close')
}
</script>

<style lang="scss">
</style>

<template>
    <Dialog ref="dialog" width="500" title="修改" top="10vh" buttonCenter @confirm="handleSubmit(operateForm)" @cancel="cancel">
        <el-form ref="operateForm" :rules="state.rules" :model="state.formData" label-width="95px">
            <el-form-item label="充值金额:" prop="rechargeAmount">
                <el-input-number v-model="state.formData.rechargeAmount" style="width: 100%" :controls="false" :precision="2" :min="0.01"
                    placeholder="请输入充值金额" />
            </el-form-item>
            <el-form-item label="赠送比例:">
                <el-input-number v-model="state.formData.ratio" style="width: 305px;margin-right: 5px" :controls="false" :precision="2" :max="100"
                    :min="0" placeholder="请输入赠送比例" />%
            </el-form-item>
            <el-form-item label="赠送金额:">
                <el-input-number v-model="state.formData.giftAmount" style="width: 100%" :controls="false" :precision="2" :min="0"
                    placeholder="请输入赠送金额" />
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script setup>
import Dialog from '@/components/Dialog/index.vue'
import { ElMessage } from 'element-plus'
import { editMerchantRechargeConfig } from '@/api/financeManage'
import { ref, reactive, onMounted } from 'vue'

const emits = defineEmits(['fetchData', 'close'])
const props = defineProps({
    itemData: {
        type: Object,
        default: {}
    },
})
const dialog = ref(null)
const operateForm = ref(null)
const state = reactive({
    formData: {},
    rules: {
        rechargeAmount: [{ required: true, message: '请输入充值金额！', trigger: 'blur' }],
    }
})

onMounted(() => {
    state.formData = { ...props.itemData }
})

const handleSubmit = (el) => {
    el.validate((valid, fields) => {
        if (valid) {
            let { rechargeAmount, giftAmount, ratio } = state.formData
            if (giftAmount > rechargeAmount) return ElMessage.warning('赠送金额必须小于充值金额！')
            if (!!giftAmount && !!ratio) return ElMessage.warning('赠送金额和赠送比例只能配置一个！')
            dialog.value.showLoading()
            editMerchantRechargeConfig(state.formData).then(res => {
                cancel()
                emits('fetchData')
            }).catch(err => {
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

<style scoped lang="scss">
</style>

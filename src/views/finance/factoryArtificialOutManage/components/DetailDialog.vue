<template>
    <DialogHook :title='props.viewType === "view" ? "查看" : "审核" ' @confirm="submit" :showConfirmBtn="props.viewType === 'edit'"
        @close="emits('close')">
        <el-form :model="state.checkForm" label-width="150px">
            <el-form-item label="厂家ID：">{{ state.checkForm.id }}</el-form-item>
            <el-form-item label="厂家名称：">{{ state.checkForm.vendor }} </el-form-item>
            <el-form-item label="人工订单号：">{{ state.checkForm.id }}</el-form-item>
            <el-row>
                <el-col :span="showButton ? 20 : 24">
                    <el-form-item label="交易哈希值：">
                        <el-input v-if="showButton" v-model="state.checkForm.txId" placeholder="请输入交易哈希值">
                        </el-input>
                        <span v-else>{{ state.checkForm.txId }}</span>
                    </el-form-item>
                </el-col>
                <el-col v-if="showButton" :span="4">
                    <el-button v-throttle type="primary" @click="handleLog">获取记录</el-button>
                </el-col>
            </el-row>
            <el-form-item label="转账金额：">{{state.checkForm.realPay}}</el-form-item>
            <el-form-item label="付款账户或地址：">{{ state.checkForm.fromAddr }}</el-form-item>
            <el-form-item label="收款账号或地址：">{{ state.checkForm.toAddr }}</el-form-item>
            <el-form-item label="交易时间：">{{ dateFormat(state.checkForm.realPayTime)}}</el-form-item>
            <el-form-item label="备注：">
                <el-input v-if="props.viewType === 'edit'" type="textarea" :rows="2" v-model="state.checkForm.auditRemark"
                    placeholder="请输入备注" :autosize="{ minRows: 2, maxRows: 4 }">
                </el-input>
                <span v-else>{{ state.checkForm.auditRemark }}</span>
            </el-form-item>
        </el-form>
    </DialogHook>
</template>

<script setup>
import { reactive, onMounted, computed } from 'vue'
import { vendorBillSettleApi, getTxIdTransInfoApi } from '@/api/dataCenter.js'
import { ElMessage } from 'element-plus'
import { dateFormat } from '@common/util'
import DialogHook from '@/components/dialogHook/index.vue'

const emits = defineEmits(["close", "refresh"])
const props = defineProps(['item', 'viewType'])
const state = reactive({
    checkForm: {},
})

const showButton = computed(() => {
    return (props.viewType === 'edit' && (!state.checkForm.realPay || !state.checkForm.fromAddr || !state.checkForm.toAddr))
})

const handleLog = () => {
    if (!state.checkForm.txId) return ElMessage.warning('请填写txId')
    getTxIdTransInfoApi({ txId: state.checkForm.txId }).then((res) => {
        const { data, code } = res
        if (code === 0) {
            // const { fromAddr, toAddr, realPay, realPayTime } = data
            Object.assign(state.checkForm, data)
            state.checkForm.realPay = data.amount || 0
        }
    })
}

// 账单付款
const submit = () => {
    let { id, txId, auditRemark } = state.checkForm
    let params = { id, txId, remark: auditRemark }
    vendorBillSettleApi(params).then(({ code }) => {
        if (code == 0) {
            emits('close')
            emits('refresh')
        }
    })
}

onMounted(() => {
    state.checkForm = {
        ...props.item,
    }
})
</script>

<style lang="scss" scoped></style>

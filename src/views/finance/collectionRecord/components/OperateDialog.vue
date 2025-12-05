<template>
    <!-- 充值订单列表-补单 -->
    <Dialog ref="dialog" width="600" title="补单" top="10vh" buttonCenter @confirm="handleSubmit(operateForm)" @cancel="cancel">
        <el-form ref="operateForm" :rules="state.rules" :model="state.formData" label-width="75px">
            <el-form-item label="txId:" prop="txId">
                <el-input v-model="state.formData.txId" style="width:100%" placeholder="请填写txId（交易哈希）" />
            </el-form-item>
            <el-form-item label="备注:">
                <el-input style="width: 100%" type="textarea" :rows="4" placeholder="请输入备注" v-model="state.formData.remark" show-word-limit
                    maxlength="250" />
            </el-form-item>

        </el-form>
    </Dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { postRetryOrder } from '@/api/financeManage'

const emits = defineEmits(['fetchData', 'close'])
const props = defineProps({
    itemData: {
        type: Object,
        default: {}
    },
})
const state = reactive({
    formData: {},
    rules: {
        txId: { required: true, message: '请填写txId（交易哈希）！', trigger: 'blur' },
    },
})
const dialog = ref(null)
const operateForm = ref(null)

const handleSubmit = (el) => {
    el.validate((valid, fields) => {
        if (valid) {
            ElMessageBox.confirm('确定补单操作吗，确定后将增加商户订单金额？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
            }).then(() => {
                dialog.value.showLoading()
                postRetryOrder({
                    ...state.formData,
                    id: props.itemData.id
                }).then(() => {
                    emits('close')
                    emits('fetchData')
                }).catch(() => {
                    dialog.value.closeLoading()
                })
            }).catch(() => { })
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

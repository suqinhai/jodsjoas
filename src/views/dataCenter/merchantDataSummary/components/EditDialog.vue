<template>
    <!-- 商户数据汇总-修改备注 -->
    <Dialog ref="dialog" width="450" title="修改备注" buttonCenter top="10vh" @confirm="handleSubmit(operateForm)" @cancel="cancel">
        <el-form ref="operateForm" :rules="state.rules" :model="state.formData" label-width="70px">
            <el-form-item label="备注:" prop="remark">
                <el-input style="width: 100%" type="textarea" :rows="5" placeholder="请输入备注" v-model="state.formData.remark" show-word-limit
                    maxlength="100" />
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { postMerchantSummaryData } from '@/api/dataCenter.js'

const emits = defineEmits(['fetchData', 'close'])
const props = defineProps({
    itemData: {
        type: Object,
        default: () => {
            return {}
        }
    },
})
const dialog = ref(null)
const operateForm = ref(null)
const state = reactive({
    formData: {},
    rules: {
        remark: [{ required: true, message: '请输入备注！', trigger: 'blur' }],
    }
})

onMounted(() => {
    state.formData.remark = props.itemData.remark || ''
})

const handleSubmit = (el) => {
    el.validate((valid) => {
        if (valid) {
            state.formData.id = props.itemData.id
            dialog.value.showLoading()
            postMerchantSummaryData(state.formData).then(() => {
                emits('close')
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

<style scoped lang="scss">
</style>

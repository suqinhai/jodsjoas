<template>
    <!-- 流量配置-修改 -->
    <Dialog ref="dialog" title="流量配置" buttonCenter width="450" @cancel="emits('close')" @confirm="handleConfirm">
        <el-form :model="state.formData" ref="formRef" :rules="state.rules" label-width="130px">
            <el-form-item label="免费流量(GB):" prop="free">
                <el-input-number v-model="state.formData.free" :controls="false" :min="0" :precision="2" placeholder="请输入免费流量数值" />
                <div>每月前xxG免费</div>
            </el-form-item>
            <el-form-item label="超出流量单价(U):" prop="exceedPrice">
                <el-input-number v-model="state.formData.exceedPrice" :controls="false" :min="0" :precision="2" placeholder="请输入超出流量单价" />
                <div>超出部分额外收取xxUSDT/G/月</div>
            </el-form-item>
            <el-form-item label="超出域名数:" prop="freeDomainNum">
                <el-input-number v-model="state.formData.freeDomainNum" :controls="false" :min="1" :precision="0" placeholder="请输入超出域名数" />
                <div>设定超过数量后需要收费</div>
            </el-form-item>
            <el-form-item label="超出域名单价(U):" prop="exceedDomainPrice">
                <el-input-number v-model="state.formData.exceedDomainPrice" :controls="false" :min="0" :precision="2" placeholder="请输入超出域名单价" />
                <div>设定超过域名数量后需要收费的单价</div>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { postTrafficConfig } from '@/api/systemSettings.js'

const emits = defineEmits(["close", "getData"])
const props = defineProps({
    itemData: {
        type: Object,
        default: () => {
            return {}
        },
    },
});
const state = reactive({
    rules: {
        free: { required: true, message: '请输入免费流量数值！', trigger: 'blur' },
        exceedPrice: { required: true, message: '请输入超出流量单价！', trigger: 'blur' },
        freeDomainNum: { required: true, message: '请输入超出域名数！', trigger: 'blur' },
        exceedDomainPrice: { required: true, message: '请输入超出域名单价！', trigger: 'blur' },
    },
    formData: {},
})
const formRef = ref(null)
const dialog = ref(null)

onMounted(() => {
    state.formData = { ...props.itemData }
})

const handleConfirm = () => {
    if (!formRef.value) return
    formRef.value.validate((valid, fields) => {
        if (valid) {
            dialog.value.showLoading()
            postTrafficConfig(state.formData).then(() => {
                emits('close')
                emits('getData')
            }).catch(() => {
                dialog.value.closeLoading()
            })
        } else {
            ElMessage.warning('请完善表单内容再进行提交！')
        }
    })
}
</script>

<style lang="scss" scoped></style>

<template>
    <!-- 数据推送配置-新增/修改 -->
    <Dialog ref="dialog" width="600" :title="!itemData.id ? '新增': '修改'" top="10vh" @confirm="handleSubmit(deployFormRef)" @cancel="cancel">
        <el-form ref="deployFormRef" :model="state.formData" :rules="state.rules" label-width="110px">
            <el-form-item label="商户ID:" prop="merchantIds">
                <el-input style="width: 100%" type="textarea" :rows="4" placeholder="可批量输入商户ID，用英文逗号隔开" v-model="state.formData.merchantIds" />
            </el-form-item>
            <el-form-item label="机器人token:" prop="botId">
                <el-input style="width: 100%" v-model="state.formData.botId" placeholder="请输入机器人token" />
            </el-form-item>
            <el-form-item label="推送群ID:" prop="chatId">
                <el-input style="width: 100%" v-model="state.formData.chatId" placeholder="请输入推送群ID" />
            </el-form-item>
            <el-form-item label="备注:">
                <el-input style="width: 100%" type="textarea" :rows="4" placeholder="请输入备注" v-model="state.formData.remark" show-word-limit
                    maxlength="250" />
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script setup>
import Dialog from '@/components/Dialog/index.vue'
import { postDataPushConfig } from '@/api/merchantConfig'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const emits = defineEmits(['close', 'fetchData'])
const props = defineProps({
    itemData: {
        type: Object,
        default: () => {
            return {}
        }
    }
})
const state = reactive({
    formData: {},
    rules: {
        merchantIds: [{ required: true, message: '请输入商户ID！', trigger: 'change' }],
        botId: [{ required: true, message: '请输入机器人token！', trigger: 'change' }],
        chatId: [{ required: true, message: '请输入推送群ID！', trigger: 'change' }],
    }
})
const deployFormRef = ref(null)
const dialog = ref(null)

onMounted(() => {
    if (props.itemData) {
        state.formData = { ...props.itemData }
    }
})

const handleSubmit = (el) => {
    el.validate((valid, fields) => {
        if (valid) {
            dialog.value.showLoading()
            postDataPushConfig(state.formData).then(() => {
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
.data-push-deploy {
    .merchant-search {
    }
}
</style>

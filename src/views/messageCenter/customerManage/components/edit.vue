
<template>
    <Dialog :title="'修改'+props.item.type_" width="600px" @close="emits('close')" @confirm="confirmEdit">
        <el-form v-model="formData" label-width="100px">
            <el-form-item label="商户模块:">
                {{ props.item.type_ }}
            </el-form-item>
            <el-form-item label="提示内容:">
                {{item.prompt}}
            </el-form-item>
            <el-form-item label="tg号码:">
                <el-input v-model="formData.phone" :maxlength="32" show-word-limit></el-input>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { editCustomerConfig } from '@/api/messageCenter.js'
import { ElMessage } from 'element-plus';
import Dialog from "@/components/dialogHook/index.vue"
const props = defineProps(['item'])
const emits = defineEmits(['close', 'refresh'])
const formData = reactive({
    phone: ''
})

onMounted(() => {
    formData.phone = props.item.phone || ''
    formData.type = props.item.type
})

const confirmEdit = () => {
    editCustomerConfig(formData).then(res => {
        if (res.code === 0) {
            emits('close')
            emits('refresh')
        }
    })
}
</script>

<style lang="scss">
</style>
<template>
    <Dialog title="短信余额不足提醒" width="600" top="10vh" @cancel="emits('close')" @confirm="handleConfirm">
        <el-form :model="formData" label-width="100px">
            <el-form-item label="短信商余额<=">
                <el-input-number :controls="false" :step="1" :min="1" step-strictly v-model="formData.balance">
                </el-input-number>
            </el-form-item>
            <el-form-item label="通知内容">
                <el-input type="textarea" v-model="formData.content" :rows="4"></el-input>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script setup>
import Dialog from "@/components/Dialog/index.vue";
import { reactive, onMounted } from 'vue'
import { getMerchantSmsConfigRemindApi, editMerchantSmsConfigRemindApi } from "@/api/factory"

const emits = defineEmits(["close"]);
const formData = reactive({})
const handleConfirm = () => {
    editMerchantSmsConfigRemindApi({
        smsBalance: formData.balance,
        remindContent: formData.content
    }).then(res => {
        const { status } = res
        if (status === 'OK') {
            emits('close')
        }
    })
}

onMounted(() => {
    getMerchantSmsConfigRemindApi().then(res => {
        const { status, data } = res
        if (status === 'OK' && data) {
            formData.balance = data.smsBalance || ''
            formData.content = data.remindContent || ''
        }
    })
})
</script>

<style lang="scss">
</style>
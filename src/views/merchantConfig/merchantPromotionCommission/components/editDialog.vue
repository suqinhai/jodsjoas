
<template>
    <DialogHook title='商户推广佣金配置' @confirm="submit" @close="emits('close')" ref="dialog">
        <el-form :model="state.checkForm" label-width="150px">
            <el-form-item label="商户ID：">{{ state.checkForm.merchant?.id }}</el-form-item>
            <el-form-item label="月贡献返佣比例：">
                <el-input-number v-model="state.checkForm.rate" :controls="false" :min="0" :precision="2" style="width:100px;">
                </el-input-number>
                <span style="margin-left:5px;">%</span>
            </el-form-item>
        </el-form>
    </DialogHook>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { editInviteConfig } from '@/api/merchantConfig.js'
import DialogHook from '@/components/dialogHook/index.vue'

const emits = defineEmits(["close", "refresh"])
const props = defineProps(['item'])
const state = reactive({
    checkForm: {},
})
const dialog = ref(null)



const submit = () => {
    let { id, rate } = state.checkForm
    let params = { id, rate }
    dialog.value.showLoading()
    editInviteConfig(params).then(({ code }) => {
        dialog.value.closeLoading()
        if (code == 0) {
            emits('close')
            emits('refresh')
        }
    }).catch(()=> {
        dialog.value.closeLoading()
    })
}

onMounted(() => {
    state.checkForm = {
        ...props.item,
    }
})
</script>

<style lang="scss" scoped></style>


<template>
    <DialogHook title='审核' @confirm="submit('pass')" @close="emits('close')" @otherEvent="submit('reject')" :otherBtn="[{type:'default', label:'拒绝', value:'4'}]" cancelText="取消" confirmText="通过"  ref="dialog">
        <el-form :model="state.checkForm" label-width="150px">
            <el-form-item label="商户ID：">{{ state.checkForm.merchant?.id }}</el-form-item>
            <el-form-item label="来源运营地区：">{{ state.checkForm.inviteRegion_ }}</el-form-item>
            <el-form-item label="开版返现额度：">{{ state.checkForm.openRebate }}</el-form-item>
            <el-form-item label="最新生成时间：">{{ state.checkForm.addTime_ }}</el-form-item>
            <el-form-item label="备注：">
                <el-input type="textarea" :rows="2" v-model="state.checkForm.remark"
                    placeholder="请输入备注" :autosize="{ minRows: 2, maxRows: 4 }">
                </el-input>
            </el-form-item>
        </el-form>
    </DialogHook>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { editPromotionCommission } from '@/api/merchantConfig.js'
import DialogHook from '@/components/dialogHook/index.vue'

const emits = defineEmits(["close", "refresh"])
const props = defineProps(['item'])
const state = reactive({
    checkForm: {},
})
const dialog = ref(null)

const submit = (type) => {
    let status = type === 'pass'?'3':'4'
    let { id, remark } = state.checkForm
    let params = { id, remark, status }
    dialog.value.showLoading()
    editPromotionCommission(params).then(({ code }) => {
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

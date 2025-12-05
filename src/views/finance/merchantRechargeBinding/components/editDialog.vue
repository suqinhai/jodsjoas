
<template>
    <DialogHook title='修改充值账号' @confirm="submit" @close="emits('close')" ref="dialog">
        <el-form :model="state.checkForm" label-width="150px">
            <el-form-item label="商户ID：">{{ state.checkForm.merchant?.id }}</el-form-item>
            <el-form-item label="商户名称：">{{ state.checkForm.merchant?.name }} </el-form-item>
            <el-form-item label="绑定充值账号：">
                <el-input v-model="state.checkForm.collectAddr" placeholder="请输入充值账号"></el-input>
            </el-form-item>
            <el-form-item label="备注：">
                <el-input type="textarea" :rows="2" v-model="state.checkForm.remark"
                    placeholder="请输入备注" :autosize="{ minRows: 2, maxRows: 4 }">
                </el-input>
            </el-form-item>
        </el-form>
    </DialogHook>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { dateFormat } from '@common/util'
import { editCollectConfig } from '@/api/financeManage.js'
import DialogHook from '@/components/dialogHook/index.vue'

const emits = defineEmits(["close", "refresh"])
const props = defineProps(['item'])
const state = reactive({
    checkForm: {},
})
const dialog = ref(null)



const submit = () => {
    let { id, collectAddr, remark } = state.checkForm
    let params = { id, collectAddr, remark }
    dialog.value.showLoading()
    editCollectConfig(params).then(({ code }) => {
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

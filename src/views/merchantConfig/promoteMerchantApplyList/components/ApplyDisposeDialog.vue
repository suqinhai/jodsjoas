<template>
    <Dialog ref="dialog" width="700" title="处理" top="10vh" :operateActions="['关闭','处理']" @confirm="handleSubmit" @cancel="cancel">
        <el-form label-width="100px">
            <el-form-item label="联系方式:">
                {{itemData.type_}}
            </el-form-item>
            <el-form-item label="联系信息:">
                {{itemData.account}}
            </el-form-item>
            <el-form-item label="申请人备注:">
                <el-input disabled style="width: 100%" type="textarea" :rows="4" v-model="itemData.remark" />
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script setup>
import Dialog from '@/components/Dialog/index.vue'
import { ref } from 'vue'
import { postPromoteApplyAudit } from '@/api/merchantConfig'

const emits = defineEmits(['fetchData', 'close'])
const props = defineProps({
    itemData: {
        type: Object,
        default: {}
    }
})
const dialog = ref(null)

const handleSubmit = () => {
    dialog.value.showLoading()
    postPromoteApplyAudit({ id: props.itemData.id }).then(res => {
        cancel()
        emits('fetchData')
    }).catch(err => {
        dialog.value.closeLoading()
    })
}

const cancel = () => {
    emits('close')
}
</script>

<style lang="scss">
</style>

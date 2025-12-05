<template>
    <Dialog ref="dialog" width="500" title="批量修改遮罩图" top="10vh" buttonCenter @confirm="handleSubmit(deployForm)" @cancel="cancel">
        <el-form ref="deployForm" :rules="state.rules" :model="state.formData" label-width="80px">
            <el-form-item label="遮罩图:" prop="maskImage">
                <UploadImage v-model="state.formData.maskImage" :width="75" @success="uploadSuccess" :height="75" :size="200"
                    :tip="`请上传75*75或等比例，PNG/JPG格式小于200KB的图片`"></UploadImage>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script setup>
import Dialog from '@/components/Dialog/index.vue'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { batchEditGameData } from '@/api/factory.js'
import UploadImage from "@/components/UploadImage/index.vue"

const emits = defineEmits(['close', 'refresh'])
const props = defineProps({
    itemData: {
        type: Object,
        default: () => {
            return {}
        }
    }
})
const dialog = ref(null)
const deployForm = ref(null)
const state = reactive({
    formData: {},
    rules: {
        maskImage: [
            { required: true, message: '请上传遮罩图！', trigger: 'blur' },
        ],
    },
    isValidate: false
})

// 上传成功
const uploadSuccess = () => {
    if (state.isValidate) {
        deployForm.value.validateField(['maskImage'])
    }
}

const handleSubmit = (el) => {
    state.isValidate = true
    el.validate(async (valid, fields) => {
        if (valid) {
            dialog.value.showLoading()
            batchEditGameData({
                ...props.itemData,
                ...state.formData
            }).then(() => {
                cancel()
                emits('refresh')
            }).catch((err) => {
                dialog.value.closeLoading()
            })
        } else {
            ElMessage.warning('请完善表格内容再进行提交！')
        }
    })
}

const cancel = () => {
    emits('close')
}

</script>

<style  lang="scss">
.edit-password {
}
</style>

<template>
    <!-- 经销商投诉-审核 -->
    <Dialog ref="dialog" width="650" :title="state.title" top="10vh" :operateActions="state.operateActions" :isShowSubmit="state.isShowSubmit"
        :isCancel="state.isCancel" @confirm="handleOperation(1)" @cancel="handleOperation(2)" @close="emits('close')">
        <el-form ref="operateForm" class="dealer-complaint-form" :model="state.formData" label-width="80px">
            <el-form-item label="反馈内容:">
                <el-input style="width: 100%" type="textarea" :rows="6" disabled v-model="itemData.content" />
            </el-form-item>
            <el-form-item label="附件:" class="file-row">
                <div v-if="!state.formData.attach">无</div>
                <UploadImage :style="{'width': state.images.length * 160 + 'px'}" v-if="state.images.length" v-model="state.images" disabled />
                <el-button v-for="(item,index) in state.videos" :key="index" v-throttle type="primary" text @click="handleLook(item)">
                    查看视频附件{{state.videos.length > 1 ? index + 1 : ''}}</el-button>
            </el-form-item>
            <el-form-item label="回复:" v-if="state.formData.status !== 2">
                <el-input style="width: 100%" type="textarea" :rows="4" :disabled="state.formData.status !== 0" placeholder="请输入回复"
                    v-model="state.formData.remark" show-word-limit maxlength="255" />
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script setup>
import Dialog from '@/components/Dialog/index.vue'
import UploadImage from '@/components/UploadImage/index.vue'
import { ElMessage } from 'element-plus'
import { ref, reactive, onMounted } from 'vue'
import { postDealerComplainDispose } from '@/api/messageCenter'

const emits = defineEmits(['fetchData', 'close', 'lookVideo'])
const props = defineProps({
    itemData: {
        type: Object,
        default: {}
    }
})
const dialog = ref(null)
const operateForm = ref(null)
const state = reactive({
    formData: {},
    title: '处理',
    operateActions: ['忽略', '提交回复'],
    isShowSubmit: true,
    isCancel: false,
    images: [],
    videos: []
})

onMounted(() => {
    state.formData = { ...props.itemData }
    let fileList = state.formData.attach ? state.formData.attach.split(",") : []
    state.images = fileList.filter(item => !item.endsWith('.mp4'))
    state.videos = fileList.filter(item => item.endsWith('.mp4'))
    if (state.formData.status) {
        state.title = '查看'
        state.operateActions = ['关闭']
        state.isShowSubmit = false
        state.isCancel = true
    }
})

const handleLook = (url) => {
    emits('lookVideo', url)
}

const handleOperation = (val) => {
    if (state.formData.status !== 0) return emits('close')
    const { remark, id } = state.formData
    let params = {
        remark,
        id,
        status: val
    }
    dialog.value.showLoading()
    postDealerComplainDispose(params).then(res => {
        emits('close')
        emits('fetchData')
    }).catch(err => {
        dialog.value.closeLoading()
    })
}

</script>

<style lang="scss">
.dealer-complaint-form {
    .file-row .el-form-item__content {
        display: flex;
        flex-wrap: wrap;
        .el-button + .el-button {
            margin-left: 0;
        }
    }
}
</style>

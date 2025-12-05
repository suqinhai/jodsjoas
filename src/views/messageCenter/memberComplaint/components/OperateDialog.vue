<template>
	<!-- 会员投诉-投诉内容 -->
    <div class="operateDialog">
        <Dialog title="投诉内容" :isShowBottomButton="false" @cancel="emits('close')">
            <el-form :model="formDialog" ref="formRef" :rules="state.formDialogRules"
                label-position="right" label-width="120px">
				<el-form-item label="反馈内容:">
					<el-input disabled type="textarea" :rows="4" v-model="formDialog.feedbackContent"></el-input>
				</el-form-item>
				<el-form-item label="附件:">
				  <div v-if="!formDialog.attach">无</div>
				  <UploadImage disabled :style="{'width': state.images.length * 160 + 'px'}" v-if="state.images.length" v-model="state.images" />
				  <el-button v-for="(item,index) in state.videos" :key="index" v-throttle type="primary" text @click="handleLook(item)">
				      查看视频附件{{state.videos.length > 1 ? index + 1 : ''}}</el-button>
				</el-form-item>
				<el-form-item label="投诉金额:">
					<el-input disabled type="input" v-model="formDialog.amount"></el-input>
				</el-form-item>
				<el-form-item label="回复:" v-if="formDialog.replyContent">
				   <el-input disabled type="textarea" placeholder="请输入回复" :rows="4" v-model="formDialog.replyContent" :maxlength="1000"  show-word-limit></el-input>
				</el-form-item>
				<el-form-item label="附件:"  v-if="formDialog.replyContent || formDialog.replyAttach">
				  <div v-if="!formDialog.replyAttach">无</div>
				  <UploadImage disabled :style="{'width': state.imagesReply.length * 160 + 'px'}" v-if="state.imagesReply.length" v-model="state.imagesReply" />
				  <el-button v-for="(item,index) in state.videosReply" :key="index" v-throttle type="primary" text @click="handleLook(item)">
				      查看视频附件{{state.videosReply.length > 1 ? index + 1 : ''}}</el-button>
				</el-form-item>
            </el-form>
        </Dialog>
    </div>
</template>

<script setup>
import Dialog from "@/components/Dialog/index.vue"
import UploadImage from "@/components/UploadImage/index.vue"
import { reactive, ref, onMounted } from 'vue'

const emits = defineEmits(["close", "update:formDialog", "confirm","lookVideo"]);
const props = defineProps({
    formDialog: {
        type: Object,
        default: () => { },
    },
});

const state = reactive({
	operateActions: ['取消', '提交回复'],
	isShowSubmit: true,
	isCancel: false,
	images: [],
	videos: [],
	imagesReply: [],
	videosReply: [],
    formDialogRules: {
        replyContent: [{ required: true, message: '请输入回复内容', trigger: 'change' }],
    },
})
const formRef = ref(null)

onMounted(() => {
    state.replyContent = props.formDialog.replyContent
	let fileList = props.formDialog.attach ? props.formDialog.attach.split(",") : []
	state.images = fileList.filter(item => !item.endsWith('.mp4'))
	state.videos = fileList.filter(item => item.endsWith('.mp4'))
	let fileListReply = props.formDialog.replyAttach ? props.formDialog.replyAttach.split(",") : []
	state.imagesReply = fileListReply.filter(item => !item.endsWith('.mp4'))
	state.videosReply = fileListReply.filter(item => item.endsWith('.mp4'))
	state.isShowSubmit = props.formDialog.isShowSubmit
})

const handleLook = (url) => {
    emits('lookVideo', url)
}

</script>

<style lang="scss" scoped>
.feedbackContent {
   max-height: 150px;
   word-break: break-all;
   overflow-y: auto;
}
.text{
	width: 100%;
	text-align: right;
	margin-top:  -30px;
	position: relative;
	z-index: 100;
}
</style>

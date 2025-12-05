<template>
	<!-- 会员投诉-投诉触发设置 -->
    <Dialog ref="dialog" width="700" title="投诉触发设置" top="10vh" buttonCenter @confirm="handleSubmit(operateForm)" @cancel="cancel">
		<el-form ref="operateForm" :rules="state.rules" :model="state.formData" label-width="100px">
			<el-form-item label="" prop="daily">
				投诉达到＞= <el-input-number style="width: 50px" v-model="state.formData.daily" :controls="false" :precision="0"
					:min="1" :max="100" /> 天未处理时，进入列表
				<div>注：如设置2天，将根据商户未处理的投诉时间，于第二天0点（运营地时区），将显示到列表。</div>
			</el-form-item>
			<el-form-item label="" prop="count">
				同会员投诉＞= <el-input-number style="width: 50px" v-model="state.formData.count" :controls="false" :precision="0"
					:min="1" :max="100" /> 次时，进入列表
				<div>注：如设置5，同个会员投诉达到5次时，再次投诉时，不管是否处理和是否达到未处理天数都将进入列表。</div>
			</el-form-item>
		</el-form>
	</Dialog>
</template>

<script setup>
import Dialog from '@/components/Dialog/index.vue'
import { ElMessage } from 'element-plus'
import { ref, reactive, onMounted } from 'vue'
import { getMetaData, postMetaData } from '@/api/common'

const emits = defineEmits(['close'])
const dialog = ref(null)
const operateForm = ref(null)
const state = reactive({
	formData: {
		enabled: true,
	},
	merchantId: 0,
	type: 48,
	rules: {
		daily: [{ required: true, message: '', trigger: 'blur' }],
		count: [{ required: true, message: '', trigger: 'blur' }],
	},
})

onMounted(() => {
	dialog.value.showLoading()
	getMetaData({ type: state.type, merchantId: state.merchantId }).then((res)=>{
		state.formData = res.data['投诉提醒配置']?.config || { enabled:false }
		!state.formData.daily ? state.formData.daily = '' : ''
		!state.formData.count ? state.formData.count = '' : ''
		state.id = res.data['投诉提醒配置']?.id || ''
		dialog.value.closeLoading()
	})
})



const handleSubmit = (el) => {
	el.validate((valid, fields) => {
		if (valid) {
			dialog.value.showLoading()
			let data  = { 
				type: state.type,
				merchantId: state.merchantId, 
				config:JSON.stringify(state.formData)
			}
			if(state.id)  data['id'] = state.id
			postMetaData(data).then(() => {
				emits('close')
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

<style scoped lang="scss">
</style>
    
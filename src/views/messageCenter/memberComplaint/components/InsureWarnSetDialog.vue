<template>
	<!-- 会员投诉-投诉提醒设置 -->
   <Dialog ref="dialog" width="1000" title="投诉提醒设置" top="10vh" buttonCenter @confirm="handleSubmit(operateForm)" @cancel="cancel">
	    <el-checkbox label="已开启提醒" v-model="state.formData.enabled" />
		<el-table class="table-box" :data="[state.formData.tip]" border>
		    <el-table-column prop="interval" label="未处理时间（天）" width="150" align="center">
				<template #default="{ row }">
					<el-input-number style="width: 100px" v-model="row.interval" placeholder="未处理时间（天）" :controls="false" :min="1" :max="100"
					    :precision="0" />
			    </template>
			</el-table-column>
		    <el-table-column prop="unit" label="弹窗提醒周期" width="150" align="center">
				<template #default="{ row }">
					<el-select class="select-box" v-model="row.unit" placeholder="弹窗提醒周期" clearable>
					    <el-option v-for="item in period" :key="item.value" :label="item.label" :value="item.value">
					    </el-option>
					</el-select>
			    </template>
			</el-table-column>
			<el-table-column prop="popTime" label="设置参数" width="150" align="center">
				<template #default="{ row }">
					<el-input-number style="width: 100px" v-model="row.popTime" placeholder="设置参数" :controls="false" :min="1" :max="100"
					    :precision="0" />
				</template>
			</el-table-column>
			<el-table-column prop="msg" label="提醒内容" align="center">
				<template #default="{ row }">
			        <el-input v-model="row.msg" type="textarea" placeholder="提醒内容" maxlength="1000" :rows="3" show-word-limit></el-input>
			    </template>
			</el-table-column>
			<el-table-column prop="user.name" label="说明" align="center">
				<template #default="{ row }">
					<div v-if="row.unit === 0 && row.popTime">达到未处理时间，每{{row.popTime}}日弹窗提醒一次</div>
					<div v-if="row.unit === 1 && row.popTime">达到未处理时间，每{{row.popTime}}小时弹窗提醒一次</div>
			    </template>
			</el-table-column>
		</el-table>
		<div class="red">注：比如设置2天提醒一次，那就是（2*24小时后的投诉时间）提醒</div>
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
		tip: {}
	},
	merchantId: 0,
	type: 48,
})
const period = reactive([{
	value: 0,
	label: '每天'
},{
	value: 1,
	label: '每小时'
}])

onMounted(() => {
	dialog.value.showLoading()
	getMetaData({ type: state.type, merchantId: state.merchantId }).then((res)=>{
		state.formData = res.data['投诉提醒配置']?.config || { enabled:true, tip: {} }
		!state.formData.tip ? state.formData['tip'] = {} : ''
		!state.formData.tip.interval ? state.formData['tip'].interval = '' : ''
		!state.formData.tip.unit ?  state.formData['tip'].unit = 0 : ''
		!state.formData.tip.popTime ?  state.formData['tip'].popTime = '' : ''
		!state.formData.tip.msg ?  state.formData['tip'].msg = '' : ''
		state.id = res.data['投诉提醒配置']?.id || ''
		dialog.value.closeLoading()
	})
})

const handleSubmit = (el) => {
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
}

const cancel = () => {
	emits('close')
}
</script>

<style scoped lang="scss">
	.red{
		color: red;
		margin-top: 15px;
	}
</style>
       

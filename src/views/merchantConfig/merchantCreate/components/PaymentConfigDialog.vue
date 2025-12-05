<template>
	<!-- 	商户配置-商户创建-支付通道选择-->
	<Dialog ref="dialog" width="650px" class="paymentConfigDialog" title="支付通道配置" top="5vh" @confirm="handleSubmit" @close="cancel" confirmText="保存">
		<div class="switch-deploy">
			<template v-if="state.oneList.length">
				<div class="title">1类</div>
				<el-checkbox v-model="state.oneCheckAll" :indeterminate="state.oneIsIndeterminate"
							@change="handleOneCheckAllChange">
					<span style="font-weight: bold;">全选1类支付</span>
				</el-checkbox>
			</template>
			<div class="content-1" v-if="state.oneList.length">
				<div class="item" v-for="item in (state.oneList || [])" :key="item.value"
					:label="item.value">
					<template v-if="item.currencies.includes(props.currency)">
						<el-checkbox v-model="item.checkAll" :indeterminate="item.isIndeterminate"
							@change="handleCheckAllChange(item,$event)">
							{{item.label}}
						</el-checkbox>
						<el-checkbox-group v-model="item.checkedCities" @change="handleCheckedCitiesChange(item,$event)">
							<el-checkbox value="r" label="r">
								代收
							</el-checkbox>
							<el-checkbox value="c" label="c">
								代付
							</el-checkbox>
						</el-checkbox-group>
					</template>
				</div>
			</div>
			<template v-if="state.twoList.length">
				<div class="title">2类</div>
				<el-checkbox v-model="state.twoCheckAll" :indeterminate="state.twoIsIndeterminate"
							@change="handleTwoCheckAllChange">
					<span style="font-weight: bold;">全选2类支付</span>
				</el-checkbox>
			</template>
			<div class="content-1">
				<div class="item" v-for="item in (state.twoList || [])" :key="item.value"
					:label="item.value">
					<template v-if="item.currencies.includes(props.currency)">
						<el-checkbox v-model="item.checkAll" :indeterminate="item.isIndeterminate"
							@change="handleCheckAllChange(item,$event)">
							{{item.label}}
						</el-checkbox>
						<el-checkbox-group v-model="item.checkedCities" @change="handleCheckedCitiesChange(item,$event)">
							<el-checkbox value="r" label="r">
								代收
							</el-checkbox>
							<el-checkbox value="c" label="c">
								代付
							</el-checkbox>
						</el-checkbox-group>
					</template>
				</div>
			</div>
		</div>
	</Dialog>
</template>

<script setup>
	import { ref, reactive, onMounted, watch } from 'vue'
	import Dialog from "@/components/dialogHook/index.vue";
	import { ElMessage } from 'element-plus'
	import { postMetaData } from '@/api/common'
	import { deepCopy } from '@/common/util'

	const emits = defineEmits(['setData', 'close'])
	const props = defineProps({
		payChannelList: {
			type: Object,
			default: () => {
				return {}
			}
		},
		payConfigs: {
			type: Array,
			default: () => {
				return []
			}
		},
		currency: {
			type: String,
			default: () => {
				return '99999'
			}
		}
	})
	const dialog = ref(null)
	const state = reactive({
		oneList: [],
		twoList: [],
		oneCheckAll: false,
		oneIsIndeterminate: false,
		twoCheckAll: false,
		twoIsIndeterminate: false,
	})

	onMounted(() => {
		state.oneList = deepCopy(filtration(props.payChannelList[1]) || [])
		state.twoList = deepCopy(filtration(props.payChannelList[2]) || [])
		setFields(state.oneList)
		setFields(state.twoList)
		addFields(state.oneList)
		addFields(state.twoList)
	})

	watch(() => state.oneList,()=>{
		state.oneCheckAll = state.oneList.every((item)=>{ return item.checkedCities.length === 2})
		state.oneIsIndeterminate = state.oneList.some((item)=>{ return item.checkedCities.indexOf('r') > -1 || item.checkedCities.indexOf('c') > -1}) && !state.oneCheckAll
	}, { deep: true, immediate: true })
	
	watch(() => state.twoList,()=>{
		state.twoCheckAll = state.twoList.every((item)=>{ return item.checkedCities.length === 2})
		state.twoIsIndeterminate = state.twoList.some((item)=>{ return item.checkedCities.indexOf('r') > -1 || item.checkedCities.indexOf('c') > -1}) && !state.twoCheckAll
	}, { deep: true, immediate: true })


	const filtration = (arr)=>{
		return arr?.filter((item)=>{
			if(item.currencies.includes(props.currency)){
				return true
			}
		})
	}

	const handleOneCheckAllChange = ()=>{
		if(state.oneCheckAll){
			state.oneList.forEach((item,index)=>{
				item.checkAll = true
				item.checkedCities = ['r','c']
			})
		}else{
			state.oneList.forEach((item,index)=>{
				item.checkAll = false
				item.checkedCities = []
			})
		}
		state.oneIsIndeterminate = false
	}
	
	const handleTwoCheckAllChange = ()=>{
		if(state.twoCheckAll){
			state.twoList.forEach((item,index)=>{
				item.checkAll = true
				item.checkedCities = ['r','c']
			})
		}else{
			state.twoList.forEach((item,index)=>{
				item.checkAll = false
				item.checkedCities = []
			})
		}
		state.twoIsIndeterminate = false
	}
	
	const handleCheckAllChange = (item, val) => {
		item.checkedCities = val ? ['r','c'] : []
		item.isIndeterminate = false
	}
	const handleCheckedCitiesChange = (item, value) => {
		const checkedCount = value.length
		item.checkAll = checkedCount === 2
		item.isIndeterminate = checkedCount > 0 && checkedCount < 2
	}
	
	const setFields = (arr)=>{
		arr.forEach(item => {
			item.setting.c = false
			item.setting.r = false
		})
	}
	
	const addFields = (arr)=>{
		arr.forEach((item)=>{
			props.payConfigs.forEach((it)=>{
				if(item.setting.l === it.l){
					item.setting.c = it.c
					item.setting.r = it.r
				}
			})
			item.checkAll = item.setting.r && item.setting.c
			item.checkedCities = []
			if(item.setting.r){
				item.checkedCities.push('r')
			}
			if(item.setting.c){
				item.checkedCities.push('c')
			}
			item.isIndeterminate = item.checkedCities.length === 1
		})
	}
	
	const dataValue = (arr1,arr2) =>{
		let data1 = arr1.map((item)=>{
			item.setting.r = item.checkedCities.includes('r')
			item.setting.c = item.checkedCities.includes('c')
			return item.setting
		})
		let data2 = arr2.map((item)=>{
			item.setting.r = item.checkedCities.includes('r')
			item.setting.c = item.checkedCities.includes('c')
			return item.setting
		})
		return data1.concat(data2).filter((item)=>{return item.r || item.c})
	}

	const handleSubmit = () => {
		const data = dataValue(state.oneList,state.twoList)
		const newData = data.map((item)=>{
			// c 是代付 r 是代收
			return {l: item.l, c: item.c, r: item.r,}
		})
		emits('setData',newData)
		emits('close')
	}

	const cancel = () => {
		emits('close')
	}
</script>

<style scoped lang="scss">
	.switch-deploy {
		.lable {
			font-weight: 600;
			padding-right: 12px;
		}

		.title {
			font-size: 18px;
			font-weight: 600;
			line-height: 24px;
			margin-top: 20px;
		}

		.tips {
			color: red;
		}
	}
	.content-1{
		overflow: hidden;
		.item{
			width: 33.33%;
			float: left;
		}
	}
</style>
<style lang="scss">
	.paymentConfigDialog{
		.el-dialog__body{
			max-height: 65vh;
			overflow-y: auto;
		}
	}
</style>

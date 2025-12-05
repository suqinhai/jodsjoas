<template>
	<!-- 商户支付方式开关-商户支付开关配置-修改 -->
	<Dialog ref="dialog" width="800" title="修改" top="5vh" @confirm="handleSubmit" @cancel="cancel">
		<div class="switch-deploy">
			<el-row>
				<el-col :span="12">
					<span class="lable">商户ID:</span>
					<span>{{itemData.merchantId}}</span>
				</el-col>
				<el-col :span="12">
					<span class="lable">商户名称:</span>
					<span>{{itemData.merchantName}}</span>
				</el-col>
			</el-row>
			
			<template v-if="state.oneList.some((item)=>{ return item.currencies.includes(props.itemData.currency)})">
				<div class="title">1类</div>
				<el-checkbox v-model="state.oneCheckAll" :indeterminate="state.oneIsIndeterminate"
							@change="handleOneCheckAllChange">
					<span style="font-weight: bold;">全选1类支付</span>
				</el-checkbox>
			</template>
			
			<div class="content-1">
				<div class="item" v-for="item in (state.oneList || [])" :key="item.value"
					:label="item.value">
					<el-checkbox v-model="item.checkAll" :indeterminate="item.isIndeterminate"
						@change="handleCheckAllChange(item,$event)">
						{{item.label}}
					</el-checkbox>
					<el-checkbox-group v-model="item.checkedCities" @change="handleCheckedCitiesChange(item,$event)">
						<el-checkbox label="r" value="r">
							代收
						</el-checkbox>
						<el-checkbox label="c" value="c">
							代付
						</el-checkbox>
					</el-checkbox-group>
				</div>
			</div>
		
			<template v-if="state.twoList.some((item)=>{ return item.currencies.includes(props.itemData.currency)})">
				<div class="title">2类</div>
				<el-checkbox v-model="state.twoCheckAll" :indeterminate="state.twoIsIndeterminate"
							@change="handleTwoCheckAllChange">
					<span style="font-weight: bold;">全选2类支付</span>
				</el-checkbox>
			</template>
			
			<div class="content-1">
				<div class="item" v-for="item in (state.twoList || [])" :key="item.value"
					:label="item.value">
					<el-checkbox v-model="item.checkAll" :indeterminate="item.isIndeterminate"
						@change="handleCheckAllChange(item,$event)">
						{{item.label}}
					</el-checkbox>
					<el-checkbox-group v-model="item.checkedCities" @change="handleCheckedCitiesChange(item,$event)">
						<el-checkbox label="r" value="r">
							代收
						</el-checkbox>
						<el-checkbox label="c" value="c">
							代付
						</el-checkbox>
					</el-checkbox-group>
				</div>
			</div>
			<div class="tips" style="margin-top: 20px">说明：</div>
			<div class="tips">列表默认显示所有商户，根据开站时商户的抽成模式，自动分配；
				如是打码就2类，损益就1类，如果该商户为1类：将显示全部支付通道，且默认1类开关已勾选；
				可修改商户的支付方式开关，关闭后商户新增支付方式的时候不显示，已添加的不影响。</div>
		</div>
	</Dialog>
</template>

<script setup>
	import { ref, reactive, onMounted, watch } from 'vue'
	import { ElMessage } from 'element-plus'
	import { postMetaData } from '@/api/common'
	import { deepCopy } from '@/common/util'

	const emits = defineEmits(['fetchData', 'close'])
	const props = defineProps({
		itemData: {
			type: Object,
			default: {}
		},
		payChannelList: {
			type: Object,
			default: () => {
				return {}
			}
		},
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
		state.oneList = deepCopy(filtrationBZ(props.payChannelList[1] || []))
		state.twoList = deepCopy(filtrationBZ(props.payChannelList[2] || []))
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
	
	const filtrationBZ = (arr)=>{
		return arr.filter(item => {
			return item.currencies.includes(props.itemData.currency)
		})
	}
	
	const setFields = (arr)=>{
		arr.forEach(item => {
			props.itemData.dataList.forEach((item2)=>{
				if(item2.value === item.value){
					item.setting.c = item2.setting.c
					item.setting.r = item2.setting.r
				}
			})
		})
	}
	
	const addFields = (arr)=>{
		arr.forEach((item)=>{
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
		let val = dataValue(state.oneList,state.twoList)
		if (!val || val.length === 0) return ElMessage.warning('请至少配置一个支付通道再进行提交！')
		let {
			payId,
			name,
			type,
			merchantId
		} = props.itemData
		dialog.value.showLoading()
		postMetaData({
			merchantId,
			id: payId,
			name,
			type,
			value: JSON.stringify(val),
		}).then(() => {
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
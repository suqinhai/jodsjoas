<template>
<!-- 	商户配置-商户创建-活动配置-->
    <Dialog title="活动配置" ref="editFormRef" @close="cancel" @confirm="handleConfirm" confirmText="保存" width="600px">
        <el-form ref="editFormRef">
			<el-checkbox v-model="state.checkAll" :indeterminate="state.indeterminate"
						@change="handleCheckAllChange">
				<span style="font-weight: bold;">全选</span>
			</el-checkbox>
			<el-checkbox-group v-model="checkList">
				<el-checkbox v-for="(item,index) in props.typesData" :value="+item.value" :label="+item.value">{{item.label}}</el-checkbox>
			</el-checkbox-group>
        </el-form>
    </Dialog>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from 'vue'
import Dialog from "@/components/dialogHook/index.vue";
const props = defineProps({
    typesData: {
        type: Array,
        default: () => {
			return []
		},
    },
	promotionTypes: {
        type: Array,
        default: () => {
			return []
		},
    },
	merchantId: {
		type: String,
		default: ''
	}
});

const emits = defineEmits(["setData","close"]);

const state = reactive({
	checkAll: false,
	indeterminate: false,
})
const checkList = ref([])

watch(checkList, (val)=>{
	const checkedCount = val.length
	state.checkAll = checkedCount === props.typesData.length
	state.indeterminate = checkedCount > 0 && checkedCount < props.typesData.length
})

onMounted(()=>{
	checkList.value = props.promotionTypes || []
})

const handleConfirm = ()=>{
	emits('setData',checkList.value)
	emits('close')
}

const handleCheckAllChange = (val) => {
	if(val){
		checkList.value = props.typesData.map(item=>{ return +item.value })
	}else{
		checkList.value = []
	}
	state.indeterminate = false
}

const cancel = () => {
	emits('close')
}
</script>

<style lang="scss" scoped></style>

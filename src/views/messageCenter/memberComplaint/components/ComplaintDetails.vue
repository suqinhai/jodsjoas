<template>
	<!-- 会员投诉-投诉人详情 -->
   <Dialog ref="dialog" width="1000" title="投诉人详情" top="10vh" buttonCenter @confirm="handleSubmit(operateForm)" @cancel="cancel" :isShowBottomButton="false">
		<el-table class="table-box" :data="state.tableData" border>
		    <el-table-column prop="username" label="账号" min-width="150" align="center" />
			<el-table-column prop="registerTime" label="注册日期" min-width="150" align="center" />
			<el-table-column prop="rechargeSum" label="充值金额" min-width="150" align="center" />
			<el-table-column prop="cashSum" label="提现金额" min-width="150" align="center" />
			<el-table-column prop="count" label="投诉次数" min-width="150" align="center" />
			<el-table-column prop="amount" label="本次投诉金额" min-width="150" align="center" />
		</el-table>
   </Dialog>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import Dialog from '@/components/Dialog/index.vue'

const emits = defineEmits(['close'])
const props = defineProps({
    itemData: {
        type: Object,
        default: () => {},
    },
});
const state = reactive({
	tableData: [],
})

onMounted(() => {
	state.tableData = [props.itemData]
})

const cancel = () => {
	emits('close')
}
</script>

<style scoped lang="scss">
</style>
       

<template>
    <!-- 财务中心-商户账单核对表-未出账单详情 -->
    <Dialog width="700" title="未出账单详情" :isShowSubmit="false" top="10vh" @cancel="emits('close')">
        <el-table :data="state.tableData" border>
            <el-table-column prop="id" label="站点ID" min-width="100" align="center" />
            <el-table-column prop="cdnFee" label="cdn费用" min-width="180" align="center">
				<template #default="{ row }">
			        {{ row.cdnFee || 0}}
			    </template>
			</el-table-column>
			<el-table-column prop="pendingBill" label="游戏损益" min-width="180" align="center" />
        </el-table>
    </Dialog>
</template>

<script setup>
import { reactive, onMounted } from "vue"
import { getPlatformUnBills } from '@/api/merchantConfig.js'

const state = reactive({
	tableData: [],
	formData: {}
})
const emits = defineEmits(['close'])
const props = defineProps({
    itemData: {
        type: Object,
        default: {}
    },
})

// 表格过滤数据处理
const fetchData = (val = '') => {
    let params = { ...state.formData }
    let { receiveTime } = state.formData
    if (receiveTime && receiveTime.length) {
        params['interval.begin'] = receiveTime[0]
        params['interval.end'] = receiveTime[1]
    }
    globalVBus.$emit('globalLoading', true)
    getPlatformUnBills(params).then(({ data = {} }) => {
		state.tableData = data || []
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        globalVBus.$emit('globalLoading', false)
    })
}

onMounted(() => {
	// state.formData.period = props.itemData.period
	state.formData.merchantId = props.itemData.id
	fetchData()
})
</script>

<style lang="scss">
</style>

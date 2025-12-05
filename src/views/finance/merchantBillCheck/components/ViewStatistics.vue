<template>
    <!-- 财务管理-商户账单核对表-查看 -->
    <Dialog ref="dialog" width="900" title="账单统计" top="5vh" :isShowSubmit="false" @cancel="cancel">
        <el-table :data="tableData" border :span-method="objectSpanMethod">
			<el-table-column prop="period" label="日期" align="center" />
            <el-table-column prop="vendor_" label="游戏平台" align="center" />
            <el-table-column prop="gameType_" label="游戏类型" align="center" />
            <el-table-column prop="realShareRate" label="抽成(%)" align="center">
                <template #default="{ row }">
                    <div>{{row.realShareRate}}</div>
                </template>
            </el-table-column>
			<el-table-column prop="timesOrCoinIn" label="投注" align="center"/>
			<el-table-column prop="winCoin" label="输赢" align="center"/>
			<el-table-column prop="localFee" label="计算（本地货币）" align="center"/>
            <el-table-column prop="fee" label="贡献（USDT）" align="center"/>
			<el-table-column prop="remark" label="备注" align="center"/>
        </el-table>
    </Dialog>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue';
import { getViewGameBill } from '@/api/financeManage'
import { deepCopy } from '@/common/util'

const emits = defineEmits(['close'])
const props = defineProps(['itemdata'])
const dialog = ref(null)
const tableData = ref([])
const state = reactive({
	merchantId: ''
})

onMounted(() => {
	state.merchantId = deepCopy(props.itemdata.group.id)
    getList()
})

const getList = () => {
	dialog.value.showLoading()
    getViewGameBill({ merchantIds: state.merchantId, period: props.itemdata.period, merchantIds:  props.itemdata.merchantIds}).then(res => {
        if (res.code === 0 && res.data && res.data.length) {
			res.data.push({vendor_: '游戏合计', localFee: res.ext.localGameFee, fee: res.ext.gameFee})
			res.data.push({vendor_: 'USDT汇率', localFee: res.ext.exchangeRate, fee: ''})
			res.data.push({vendor_: 'CDN费用', localFee: '', fee: res.ext.otherFee})
			res.data.push({vendor_: '优惠', localFee: '', fee: res.ext.freeAmount})
			res.data.push({vendor_: '账单合计', localFee: '', fee: res.ext.totalPrice})
            tableData.value = res.data
        }
		dialog.value.closeLoading()
    }).catch((err) => {
		dialog.value.closeLoading()
	})
}


const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
	if(rowIndex == 0 && columnIndex == 0) return { rowspan: tableData.value.length, colspan: 1 }
	if(rowIndex != 0 && columnIndex == 0) return { rowspan: 0, colspan: 0 }
	if(rowIndex >= tableData.value.length - 5  && [1].includes(columnIndex)) return { rowspan: 1, colspan: 5 }
	if(rowIndex >= tableData.value.length - 5  && [2,3,4,5].includes(columnIndex)) return { rowspan: 0, colspan: 0 }
}

const cancel = () => {
    emits('close')
}
</script>

<style lang='scss'>
</style>
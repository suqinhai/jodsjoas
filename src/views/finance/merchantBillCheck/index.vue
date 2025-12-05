<template>
    <!-- 财务中心-商户账单核对表 -->
    <div class="container">
        <el-form class="filter-form" :model="state.searchForm" inline>
			<el-form-item>
			    <el-date-picker style="width: 220px" v-model="state.searchForm.receiveTime" type="daterange" value-format="YYYY-MM-DD"
			        start-placeholder="开始时间" end-placeholder="结束时间" :disabled-date="disabledDate" :shortcuts="shortcuts" />
			</el-form-item>
            <el-form-item label="商户ID:">
                <el-input v-model="state.searchForm.merchantId" placeholder="请输入商户ID" />
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click="fetchData('reset')">重 置</el-button>
            </el-form-item>
			<el-form-item>
			    <el-button v-throttle type="primary" @click="fetchData('export')">导出表格</el-button>
			</el-form-item>
        </el-form>
        <el-table class="table-box" border :data="state.tableData">
            <el-table-column prop="period" label="账单月份" align="center" />
            <el-table-column label="商户ID" align="center" min-width="100">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.group.id)">
                        {{ row.group?.id || '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="商户名称" align="center" min-width="140">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.group.id)">
                        {{ row.group?.name  || '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="currency" label="货币" align="center" />
            <el-table-column prop="exchangeRate" label="汇率" align="center" />
            <el-table-column prop="activeAmount" label="商户余额" align="center" />
            <el-table-column prop="realPay" label="实际支付" align="center" />
            <el-table-column prop="totalPay" label="账单合计u" align="center" />
            <el-table-column prop="openFee" label="开版费u" align="center" />
            <el-table-column prop="otherFee" label="cdn费用u" align="center">
				<template #default="{ row }">
			        <span class="special pointer" @click="showCdnCost(row)">
			            {{ row.otherFee }}
			        </span>
			    </template>
			</el-table-column>
            <el-table-column prop="netFee" label="服务器费用u" align="center" />
            <el-table-column prop="gameFee" label="游戏账单u" align="center">
				<template #default="{ row }">
			        <span class="special pointer" @click="showGameFee(row)">
			            {{ row.gameFee }}
			        </span>
			    </template>
			</el-table-column>
            <el-table-column fixed="right" align="center" label="操作" width="160">
            	<template #default="{ row }">
            		<el-button v-throttle type="primary" text
            			@click="handleExportBill( row )">导出账单</el-button>
            		<el-button v-throttle type="primary" text @click="handleView( row)">查看</el-button>
            	</template>
            </el-table-column>
        </el-table>
        <Pagination v-show="!!state.total" v-model:page="state.pageConfig._page" v-model:size="state.pageConfig._size"
            :total="state.total" @pagination="fetchData"></Pagination>

       <GameBillDialog v-if="state.showGameBillDialog" @close="state.showGameBillDialog=false" :itemdata="state.itemdata"></GameBillDialog>
	   <ViewStatistics v-if="state.showViewStatistics" @close="state.showViewStatistics=false" :itemdata="state.itemdata"></ViewStatistics>
	   <CdnCostDialog :itemData="state.itemData" v-if="state.showCdnCostDialog" @close="state.showCdnCostDialog = false"></CdnCostDialog>
    </div>
</template>

<script setup name="merchantBillCheck">
import Pagination from '@/components/Pagination/index.vue'
import { reactive, onMounted, defineAsyncComponent } from "vue"
import userStore from '@/store/user'
import { getChecklist, getAuditReport } from '@/api/financeManage.js'
import { dateFormat, getTimezone } from '@common/util'
const GameBillDialog = defineAsyncComponent(() => import('./components/GameBillDialog.vue'))
const ViewStatistics = defineAsyncComponent(() => import('./components/ViewStatistics.vue'))
const CdnCostDialog = defineAsyncComponent(() => import('./components/cdnCostDialog.vue'))

const state = reactive({
    searchForm: {},
    tableData: [],
    pageConfig: {
        _page: 1,
        _size: 10,
    },
    total: 0,
    showGameBillDialog: false,
	showViewStatistics: false,
    itemdata: {},
	showCdnCostDialog: false
})
const userData = userStore()

onMounted(() => {
    fetchData()
})

const showCdnCost = (data)=>{
	state.itemData = data
	state.showCdnCostDialog = true
}

const showGameFee = (item)=>{
	state.itemdata = item
	state.showGameBillDialog = true
}

const handleView = (item)=>{
	state.itemdata = item
	state.showViewStatistics = true
}

const fetchData = (val = '') => {
    if (val && val !== 'export') {
        state.pageConfig._page = 1
        if (val === 'reset') {
            state.searchForm = {}
        }
    }
    let params = { ...state.pageConfig, ...state.searchForm }
    let { receiveTime } = state.searchForm
    if (receiveTime && receiveTime.length) {
        params['interval.begin'] = receiveTime[0]
        params['interval.end'] = receiveTime[1]
    }
    delete params.receiveTime
    if (val === 'export') params.isExport = true
    getChecklist(params).then(res => {
		if (!params.isExport) {
			let { total, list = [] } = res.data
			state.tableData = list
			state.total = total
		}
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        state.tableData = []
        globalVBus.$emit('globalLoading', false)
    })
}


const handleExportBill = (item)=>{
	const params = {
		merchantIds: item.group.id,
		period: item.period,
		merchantIds: item.merchantIds,
		export: getTimezone()
	}
	getAuditReport( params,{ responseType: 'blob' } ).then((res)=>{})
}

// 查看商户详情
const showMerchantDetail = (id) => {
    globalVBus.$emit('merchantDetailDialog', id)
}
</script>

<style lang="scss" scoped>
.factoryArtificialOutInManage {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .el-table {
        flex: 1;
    }
}
</style>

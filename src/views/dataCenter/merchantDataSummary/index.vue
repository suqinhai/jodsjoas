<template>
    <!-- 商户数据汇总 -->
    <div class="container merchant-data-summary">
        <el-form class="filter-form" :model="state.formData" inline>
            <el-form-item label="月份:">
                <el-date-picker style="width: 200px" clearable v-model="state.formData.receiveTime" type="monthrange" value-format="YYYY-MM"
                    start-placeholder="开始月份" end-placeholder="结束月份" :disabled-date="disabledCurrentDateAfter" />
            </el-form-item>
            <el-form-item label="商户ID:">
                <el-input v-model="state.formData.groupId" placeholder="请输入商户ID" />
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click="fetchData('reset')">重 置</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('export')">导出报表</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="state.tableData" class="table-box" border
            :row-class-name="({row,rowIndex}) => (rowIndex +1 === state.tableData.length ? 'total-row': '')">
            <el-table-column prop="period" label="月份" min-width="100" align="center" />
            <el-table-column label="商户ID" min-width="120" align="center">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.groupId)">
                        {{ row.groupId }}
                    </span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="商户名称" min-width="140" align="center">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.id)">
                        {{ row.name }}
                    </span>
                </template>
            </el-table-column> -->
            <el-table-column prop="rechargeAmount" label="充值金额U" min-width="140" align="center" />
            <el-table-column prop="adjustInAmount" label="人工加款" min-width="140" align="center" />
            <el-table-column label="人工扣款" min-width="140" align="center">
                <template #default="{ row }">
                    <span style="color: green">{{ row.adjustOutAmount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="商户费用" min-width="140" align="center">
                <template #default="{ row }">
                    <span v-if="!row.isTotal && row.openLineFee" class="special pointer" @click="handleConfig(row,'showMerchantCost')">
                        {{ row.openLineFee }}
                    </span>
                    <span v-else>{{ row.openLineFee }}</span>
                </template>
            </el-table-column>
            <el-table-column label="游戏抽成" min-width="140" align="center">
                <template #default="{ row }">
                    <span v-if="!row.isTotal && row.gameShareAmount" class="special pointer" @click="handleConfig(row,'showGameCommission')">
                        {{ row.gameShareAmount }}
                    </span>
                    <span v-else>{{ row.gameShareAmount }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="addTime_" label="开站时间" min-width="160" align="center" />
            <el-table-column prop="freezeTime_" label="冻结时间" min-width="160" align="center" />
            <el-table-column prop="remark" label="备注" min-width="200" align="center" />
            <el-table-column fixed="right" label="操作" width="120" align="center">
                <template #default="{ row }">
                    <el-button v-if="!row.isTotal" v-throttle type="primary" text @click="handleConfig(row,'showEditDialog')">修改备注
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination v-show="state.total > 0" :total="state.total" v-model:size="state.listQuery._size" v-model:page="state.listQuery._page"
            @pagination="fetchData"></Pagination>

        <GameCommissionInfo v-if="state.showGameCommission" :itemData="state.itemData" @close="state.showGameCommission = false"></GameCommissionInfo>
        <MerchantCostInfo v-if="state.showMerchantCost" :itemData="state.itemData" @close="state.showMerchantCost = false"></MerchantCostInfo>
        <EditDialog v-if="state.showEditDialog" :itemData="state.itemData" @fetchData="fetchData" @close="state.showEditDialog = false"></EditDialog>
    </div>
</template>

<script setup name="merchantDataSummary">
import { reactive, onMounted, defineAsyncComponent } from "vue"
import commonStore from '@/store/common'
import { getMerchantSummaryList } from '@/api/dataCenter.js'
import { getMerchantSiteList } from '@/api/common'
import { disabledCurrentDateAfter } from '@/common/util'
const GameCommissionInfo = defineAsyncComponent(() => import('./components/GameCommissionInfo.vue'))
const MerchantCostInfo = defineAsyncComponent(() => import('./components/MerchantCostInfo.vue'))
const EditDialog = defineAsyncComponent(() => import('./components/EditDialog.vue'))

const state = reactive({
    tableData: [],
    formData: {},
    total: 0,
    listQuery: {
        _page: 1,
        _size: 10,
    },
    ext: {},
    itemData: {},
    showEditDialog: false,
    showGameCommission: false,
    showMerchantCost: false,
})
const commonData = commonStore()

onMounted(() => {
    fetchData()
})

// 表格过滤数据处理
const fetchData = (val = '') => {
    if (val && val !== 'export') {
        state.listQuery._page = 1
        if (val === 'reset') {
            state.formData = {}
        }
    }
    let params = { ...state.listQuery, ...state.formData }
    let { receiveTime } = state.formData
    if (receiveTime && receiveTime.length) {
        params['interval.begin'] = receiveTime[0]
        params['interval.end'] = receiveTime[1]
    }
    delete params.receiveTime
    if (val === 'export') params.isExport = true
    globalVBus.$emit('globalLoading', true)
    getMerchantSummaryList(params).then(({ data = {}, ext = {} }) => {
        if (!params.isExport) {
            let { total, list = [] } = data
            state.tableData = list
            state.listQuery._page === 1 && (state.ext = { ...ext })
            if (state.tableData.length) {
                state.tableData.push({ ...state.ext, period: '汇总', isTotal: true })
            }
            state.total = total || 0
        }
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        if (!params.isExport) state.tableData = []
        globalVBus.$emit('globalLoading', false)
    })
}

const handleConfig = (row, key) => {
    state.itemData = { ...row }
    if (key !== 'showGameCommission') return state[key] = true
    globalVBus.$emit('globalLoading', true)
    getMerchantSiteList({ groupId: row.groupId }).then(res => {
        let { data = [] } = res
        state.itemData.siteList = data || []
        state[key] = true
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        state.tableData = []
        globalVBus.$emit('globalLoading', false)
    })
}

// 查看商户详情
const showMerchantDetail = (id) => {
    globalVBus.$emit('merchantDetailDialog', id)
}
</script>

<style lang="scss">
.merchant-data-summary {
    .row-items {
        display: flex;
        align-items: center;
        justify-content: center;
        &-left {
            min-width: 150px;
            margin-right: 10px;
        }
        &-right {
            margin-left: 10px;
        }
    }
}
</style>

<template>
    <!-- 充值订单列表 -->
    <div class="container">
        <el-form class="filter-form" :model="state.searchForm" inline>
            <el-form-item>
                <el-date-picker style="width: 220px" v-model="state.searchForm.interval" type="daterange" start-placeholder="开始时间"
                    end-placeholder="结束时间" :disabled-date="disabledDate" :shortcuts="shortcuts" value-format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item label="商户ID:">
                <el-input v-model="state.searchForm.merchantId" placeholder="请输入商户ID" />
            </el-form-item>
            <el-form-item label="订单号:">
                <el-input v-model="state.searchForm.orderNo" placeholder="请输入订单号" />
            </el-form-item>
            <el-form-item label="状态:">
                <el-select class="select-box" v-model="state.searchForm.status" clearable placeholder="请选择状态">
                    <el-option v-for="item in state.statusList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="订单类型:">
                <el-select class="select-box" v-model="state.searchForm.payType" clearable placeholder="请选择订单类型">
                    <el-option v-for="item in state.payTypeList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click="fetchData('reset')">重 置</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('export')">导 出</el-button>
            </el-form-item>
        </el-form>
        <el-table class="table-box" :data="state.tableData" border :row-class-name="({row}) => (row.isTotal ? 'total-row' : '')">
            <el-table-column label="订单号" align="center" min-width="160">
                <template #default="{ row }">
                    <span v-if="!row.isTotal">
                        {{ row.orderNo }}
                    </span>
                    <div v-else>汇总
                        <el-tooltip effect="dark" content="汇总：汇总数据均按成功充值订单记录，不会根据状态过滤。" placement="top-start">
                            <el-icon class="pointer" :size="15">
                                <QuestionFilled />
                            </el-icon>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="payType_" label="订单类型" min-width="120" align="center" />
            <el-table-column label="下单时间" min-width="160" align="center">
                <template #default="{ row }">
                    <span>{{ row.addTime ? dateFormat(row.addTime) : '' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="到账时间" min-width="160" align="center">
                <template #default="{ row }">
                    <span>{{ row.updateTime ? dateFormat(row.updateTime) : '' }}</span>
                </template>
            </el-table-column>
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
                        {{ row.group?.name || '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="amount" label="充币订单金额" min-width="130" align="center" />
            <el-table-column prop="totalAmount" label="实际到账金额(U)" min-width="130" align="center" />
            <el-table-column prop="giftAmount" label="赠送金额(U)" min-width="120" align="center" />
            <el-table-column prop="activeAmount" label="充值后余额(U)" min-width="120" align="center">
                <template #default="{ row }">
                    {{ row.activeAmount || '' }}
                </template>
            </el-table-column>
            <el-table-column prop="status_" label="状态" min-width="100" align="center" />
            <el-table-column prop="emp.name" label="申请人" min-width="120" align="center" />
            <el-table-column prop="toAddr" label="充币地址" min-width="300" align="center" />
            <el-table-column prop="txId" label="区块链ID" min-width="300" align="center" />
            <el-table-column prop="remark" label="备注" min-width="160" align="center" />
            <el-table-column fixed="right" label="操作" align="center" width="80">
                <template #default="{ row }">
                    <el-button v-if="row.status !== 9 && !row.isTotal" v-throttle type="primary" link
                        @click="state.itemData = {...row},state.showOperateDialog = true">补单</el-button>
                </template>
            </el-table-column>
        </el-table>

        <Pagination v-show="!!state.total" v-model:page="state.pageConfig._page" v-model:size="state.pageConfig._size" :total="state.total"
            @pagination="fetchData"></Pagination>
        <OperateDialog v-if="state.showOperateDialog" :itemData="state.itemData" @close="state.showOperateDialog = false" @fetchData="fetchData">
        </OperateDialog>
    </div>
</template>

<script setup name="collectionRecord">
import { ref, onMounted, reactive, defineAsyncComponent } from 'vue'
import { merchantRechargeListApi } from '@/api/financeManage'
import { commonMetasApi } from '@/api/common.js'
import { dateFormat, getShortcuts } from '@/common/util/index.js'
const OperateDialog = defineAsyncComponent(() => import("./components/OperateDialog.vue"))

const shortcuts = getShortcuts()
const state = reactive({
    tableData: [],
    pageConfig: {
        _page: 1,
        _size: 10,
    },
    total: 0,
    searchForm: {},
    payTypeList: [],
    statusList: [],
    itemData: {},
    showOperateDialog: false
})
const disabledDate = ref((time) => {
    return time.getTime() > Date.now()
})

onMounted(() => {
    commonMetasApi({ types: 'payType,rechargeStatus' }).then(({ code, data }) => {
        if (code == 0) {
            state.payTypeList = data.payType
            state.statusList = data.rechargeStatus
        }
    })
    fetchData()
})

const fetchData = (val = '') => {
    if (val && val !== 'export') {
        state.pageConfig._page = 1
        if (val === 'reset') {
            state.searchForm = {}
        }
    }
    let params = { ...state.pageConfig, ...state.searchForm }
    let { interval } = state.searchForm
    if (interval && interval.length) {
        params['interval.begin'] = interval[0]
        params['interval.end'] = interval[1]
    }
    delete params.interval
    if (val === 'export') params.isExport = true
    globalVBus.$emit('globalLoading', true)
    merchantRechargeListApi(params).then(res => {
        if (!params.isExport) {
            let { total, list = [] } = res.data
            state.tableData = list
            if (state.tableData.length) {
                let { amountSum = 0, giftRatioSum = 0, totalAmountSum = 0 } = res.ext
                state.tableData.unshift({
                    amount: amountSum,
                    giftAmount: giftRatioSum,
                    totalAmount: totalAmountSum,
                    isTotal: true
                })
            }
            state.total = total
        }
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        if (!params.isExport) state.dataList = []
        globalVBus.$emit('globalLoading', false)
    })
}

// 查看商户详情
const showMerchantDetail = (id) => {
    globalVBus.$emit('merchantDetailDialog', id)
}
</script>

<style lang="scss" scoped>
</style>

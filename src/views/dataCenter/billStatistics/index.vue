<template>
    <!-- 账单统计 -->
    <div class="container">
        <el-form class="filter-form" :model="state.searchForm" inline>
            <el-form-item label="商户ID:">
                <el-input v-model="state.searchForm.merchantId" placeholder="请输入商户ID"></el-input>
            </el-form-item>
            <el-form-item label="账单月份:">
                <el-date-picker v-model="state.searchForm.month" value-format="YYYY-MM" type="month" placeholder="请选择账单月份" />
            </el-form-item>
            <el-form-item label="账单状态:">
                <el-select class="select-box" v-model="state.searchForm.status" placeholder="请选择账单状态" clearable>
                    <el-option v-for="item in state.statusList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="getList('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click="getList('reset')">重 置</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="exportFile">导出报表</el-button>
            </el-form-item>
        </el-form>
        <el-table class="table-box" border :data="state.billList">
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
            <el-table-column prop="period" label="账单月份" align="center" />
            <el-table-column prop="winCoin" label="盈亏金额" align="center" />
            <el-table-column prop="currency" label="币种" align="center" />
            <el-table-column prop="totalPay" label="账单金额（U）" align="center" />
            <el-table-column prop="realPay" label="实际支付（U）" align="center" />
            <el-table-column prop="" label="账单状态" align="center">
                <template #default="{ row }">
                    <span :class="row.status === 1 || row.status === 5?'status-pending':row.status === 9?'status-success':''">{{row.status_}}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" align="center">
                <template #default="{ row }">
                    <el-button v-throttle type="primary" link size="default" @click="handleDetail(row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination v-show="!!state.total" v-model:page="state.pageConfig._page" v-model:size="state.pageConfig._size" :total="state.total"
            @pagination="getList"></Pagination>
        <Dialog ref="detailDialogRef" :title="'详情'" :isShowSubmitBtn="false" width="1000px" draggable>
            <el-form>
                <el-form-item label="商户名称：" style="margin-bottom:0;">{{ state.currentItem.group?.name || '' }}</el-form-item>
                <el-form-item label="账单月份：" style="margin-bottom:0;">{{ state.currentItem.period }}</el-form-item>
                <el-form-item label="经营地时区：">(UTC:{{ state.currentItem.timeZone }})</el-form-item>
                <el-table :data="state.tableData" :span-method="arraySpanMethod" tooltip-effect="dark" style="width: 100%" border>
                    <el-table-column prop="currency" label="币种" min-width="120" align="center">
                        <template #default="{row, $index}">
                            <div style="text-align: right;">
                                {{$index === 0?row.currency:$index === 1?'其他费用':$index === 2?'路线维护费(U)':$index === 3?'本账单合计(U)':$index === 4?'优惠额度(U)':'调整后实际支付(U)' }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="winCoin" label="盈亏金额" min-width="120" align="center" />
                    <el-table-column prop="exchangeRate" label="折算汇率" min-width="120" align="center" />
                    <el-table-column prop="amount" label="账单金额(U)" min-width="120" align="center">
                        <template #default="{row, $index}">
                            {{ $index === 0? row.gameFee : $index === 1? row.otherFee : $index === 2? row.netFee : $index === 3? toolPoint(add(row.totalPay, row.freeAmount), 2): $index == 4? row.freeAmount: row.totalPay }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" min-width="250" align="center">
                        <template #default="{row, $index}">
                            <!-- <el-button v-throttle type="primary" link
                                v-if="$index === 0 && userData.isHasPermiss('merchant.merchant-bill.edit-1')"
                                @click="handleChecked">核对</el-button> -->
                            <span>{{ $index === 1?'域名CDN费用':$index === 2?'固定费用':$index === 4?`当前站点余额${state.currentItem.activeAmount || 0}(U)`:'' }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
        </Dialog>
        <Dialog ref="checkDialogRef" :title="'核对详情'" :isShowSubmitBtn="false" width="1000px" draggable appendToBody :top="'18vh'">
            <el-form>
                <el-form-item label="站点名称：" style="margin-bottom:0;">{{ state.currentItem.group?.name || '' }}</el-form-item>
                <el-form-item label="账单月份：" style="margin-bottom:0;">{{ state.currentItem.period }}</el-form-item>
                <el-form-item label="经营地（含时区）：">(UTC:{{ state.currentItem.timeZone }})</el-form-item>
                <el-table :data="state.gameFeeList" tooltip-effect="dark" v-if="state.gameFeeList.length" show-summary :summary-method="getSummaries"
                    style="width: 100%" border>
                    <el-table-column prop="vendor_" label="游戏平台" min-width="80" align="center" />
                    <el-table-column prop="gameType_" label="游戏类型" min-width="80" align="center" />
                    <el-table-column prop="userCoinIn" label="有效投注(货币)" min-width="120" align="center" />
                    <el-table-column prop="winCoin" label="游戏输赢(货币)" min-width="120" align="center" />
                    <el-table-column prop="realShareRate" label="收取费率" align="center">
                        <template #default="{row}">
                            {{ row.realShareRate }}%
                        </template>
                    </el-table-column>
                    <el-table-column prop="localFee" label="费用(货币)" min-width="120" align="center" />
                </el-table>
                <div class="sum">
                    <div>
                        <label>折算汇率：</label>
                        <span>{{state.currentItem.exchangeRate}}</span>
                    </div>
                    <div>
                        <label>折算金额(U)：</label>
                        <span>{{state.currentItem.gameFee}}</span>
                    </div>
                </div>
            </el-form>
        </Dialog>
    </div>
</template>

<script setup name="billStatistics">
import { onMounted, reactive, ref } from "vue";
import userStore from '@/store/user'
import { merchantBillListGetApi, merchantBillListExport, getMerchantSummaryApi, merchantBillChildrenApi } from '@api/dataCenter'
import { commonMetasApi } from '@/api/common.js'
import { add, toolPoint, getTimezone } from '@common/util'
import Dialog from '@/components/dialogOld/index.vue'

const state = reactive({
    statusList: [],
    billList: [],
    pageConfig: {
        _page: 1,
        _size: 10,
    },
    searchForm: {},
    total: 0,
    currentItem: {},
    tableData: [],
    gameFeeList: [],
    showDetailDialog: false,
    showCheckDialo: false,
})
const userData = userStore()
const detailDialogRef = ref(null)
const checkDialogRef = ref(null)

onMounted(async () => {
    getList()
    const { code, data } = await commonMetasApi({ types: 'merchantBillStatus' })
    if (code == 0) {
        state.statusList = data.merchantBillStatus
    }
})

const getList = (type) => {
    if (type) {
        state.pageConfig._page = 1
        if (type === 'reset') {
            state.searchForm = {}
        }
    }
    let params = {
        ...state.pageConfig,
        ...state.searchForm,
    }
    params['interval.begin'] = params.month || ''
    params['interval.end'] = params.month || ''
    delete params.month
    params.type = 2 // 固定参数，不可删除
    globalVBus.$emit('globalLoading', true)
    merchantBillListGetApi(params).then((res) => {
        const { code, data } = res
        if (code === 0) {
            state.billList = data.list || []
            state.total = data.total || 0
        }
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        state.billList = []
        globalVBus.$emit('globalLoading', false)
    })
}

const exportFile = () => {
    globalVBus.$emit('globalLoading', true)
    merchantBillListExport({ export: getTimezone() }, { responseType: 'blob' }).then((res) => {
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        globalVBus.$emit('globalLoading', false)
    })
}

// 获取商户时区、余额
const getMerchantSummaryDetail = () => {
    globalVBus.$emit('globalLoading', true)
    getMerchantSummaryApi({
        id: state.currentItem.group.id,
    }).then((res) => {
        const { data, code } = res
        if (code === 0 && data) {
            state.currentItem.timeZone = data.timeZone
            state.currentItem.activeAmount = data.activeAmount
            detailDialogRef.value.openDialog()
        }
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        globalVBus.$emit('globalLoading', false)
    })
}

// 查看商户详情
const showMerchantDetail = (id) => {
    globalVBus.$emit('merchantDetailDialog', id)
}

//点击详情
const handleDetail = (value) => {
    state.currentItem = value
    state.tableData = []
    for (var i = 0; i < 6; i++) {
        state.tableData[i] = value
    }
    getMerchantSummaryDetail()
}

//点击核对
const handleChecked = (val = '') => {
    checkDialogRef.value.openDialog()
    let params = {
        merchantId: state.currentItem.group.id,
        period: state.currentItem.period,
    }
    params.type = 2 // 固定参数，不可删除
    globalVBus.$emit('globalLoading', false)
    merchantBillChildrenApi(params).then((res) => {
        state.gameFeeList.length = 0
        const { code, data } = res
        if (code === 0) {
            state.gameFeeList.push(...data.list)
        }
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        state.gameFeeList.length = 0
        globalVBus.$emit('globalLoading', false)
    })
}

const arraySpanMethod = ({ row, column, rowIndex, columnIndex }) => {
    if (rowIndex !== 0) {
        if (columnIndex === 0) {
            return [1, 3]
        } else if (columnIndex === 1 || columnIndex === 2) {
            return [0, 0]
        }
    }
}

const getSummaries = (param) => {
    const { columns, data } = param
    const sums = []
    columns.forEach((column, index) => {
        if (index === 0) {
            sums[index] = '合计'
        } else if (index === 4) {
            sums[index] = ''
        } else {
            const values = data.map((item) => Number(item[column.property]))
            if (!values.every((value) => isNaN(value))) {
                sums[index] = `${values.reduce((prev, curr) => {
                    const value = Number(curr)
                    if (!isNaN(value)) {
                        return prev + curr
                    } else {
                        return prev
                    }
                }, 0).toFixed(2)}`
            } else {
                sums[index] = ''
            }
        }
    })
    return sums
}

</script>

<style lang="scss" scoped>
.billStatistics {
}
</style>

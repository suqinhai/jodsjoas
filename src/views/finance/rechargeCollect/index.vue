<template>
    <!-- 波场TRX列表 -->
    <div class="container recharge-collect-page">
        <el-form class="filter-form" :model="state.formData" inline>
            <el-form-item label="商户ID:">
                <el-input v-model="state.formData.merchantId" placeholder="请输入商户ID" />
            </el-form-item>
            <el-form-item label="充币数量区间范围:">
                <el-input-number v-model="state.formData.min" style="width: 120px" :controls="false" :precision="2" :min="0" placeholder="充币数量"
                    @blur="inputBlur" />
                <span style="padding: 0 5px">-</span>
                <el-input-number v-model="state.formData.max" style="width: 120px" :controls="false" :precision="2" :min="0.01" placeholder="充币数量"
                    @blur="inputBlur" />
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="getList('')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click="getList('export')">导 出</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="refresh">刷新数据</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="collectAll">能量一键归集</el-button>
            </el-form-item>
        </el-form>
        <el-table ref="tableRef" class="table-box" :data="state.dataList" border
            :row-class-name="({row,rowIndex}) => (rowIndex === 0 ? 'total-row': '')" @sort-change="sortChange">
            <el-table-column label="商户ID" align="center">
                <template #default="{ row,$index }">
                    <span class="special pointer" @click="showMerchantDetail(row.merchantId)" v-if="$index !== 0">
                        {{ row.merchantId }}
                    </span>
                    <span v-else>{{ row.merchantId }}</span>
                </template>
            </el-table-column>
            <el-table-column label="商户名称" align="center">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.merchantId)">
                        {{ row.name }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column sortable="custom" prop="realBalance" label="充币数量" align="center" min-width="110" />
            <el-table-column prop="updateTime" label="最新充值时间" align="center" min-width="160">
                <template #default="{row}">
                    <span>{{ row.updateTime && dateFormat(row.updateTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="toAddr" label="充币地址" align="center" min-width="160">
                <template #default="{row}">
                    <el-button v-throttle type="primary" link @click="goAddr(row.toAddr)">{{ row.toAddr }}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="collectAmountSum" label="已归集金额" align="center" min-width="110" />
            <el-table-column prop="energy" label="能量数量" align="center" />
            <el-table-column prop="bandwidth" label="带宽数量" align="center" />
            <el-table-column prop="trxBalance" label="trx余额" align="center" />
            <el-table-column prop="collectStatus" label="能量状态" align="center">
                <template #default="{ row }">
                    <span>{{ row.collectStatus === 0?'已归集':row.collectStatus === 1?'未归集':'' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="归集时间" align="center" min-width="160">
                <template #default="{ row }">
                    <span>{{ row.updateTime && dateFormat(row.updateTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" align="center" width="120">
                <template #default="{ row }">
                    <el-button v-if="[0,1].includes(row.collectStatus)" v-throttle type="primary" link size="default" @click="refresh(row)">刷新
                    </el-button>
                    <el-button v-if="row.collectStatus === 1" v-throttle type="primary" link size="default" @click="collectAll(row)">归集</el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination v-show="state.total > 0" v-model:page="state.pageConfig._page" v-model:size="state.pageConfig._size" :total="state.total"
            @pagination="getList">
        </Pagination>
    </div>
</template>

<script setup name="rechargeCollect">
import { ref, reactive, onMounted } from 'vue'
import { getRechargeCollectList, refreshRechargeCollect, rechargeCollectAll } from '@api/financeManage.js'
import { dateFormat } from '@common/util'

const state = reactive({
    formData: {},
    dataList: [],
    total: 0,
    pageConfig: {
        _page: 1,
        _size: 10
    }
})
const tableRef = ref(null)

onMounted(() => {
    getList()
})

const getList = (val = '') => {
    let params = { ...state.pageConfig, ...state.formData }
    if (val === 'export') params.isExport = true
    globalVBus.$emit('globalLoading', true)
    getRechargeCollectList(params).then(res => {
        const { code, data, ext } = res
        if (!params.isExport) {
            state.dataList = data.list || []
            if (state.dataList.length && ext) {
                let { realBalanceSum, collectAmountSum, energySum, bandwidthSum, trxBalanceSum } = ext
                state.dataList.unshift({
                    realBalance: realBalanceSum,
                    collectAmountSum: collectAmountSum,
                    energy: energySum,
                    bandwidth: bandwidthSum,
                    trxBalance: trxBalanceSum,
                    merchantId: '汇总',
                })
            }
            state.total = data.total || 0
        }
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        if (!params.isExport) state.dataList = []
        globalVBus.$emit('globalLoading', false)
    })
}

const sortChange = ({ order }) => {
    delete state.formData.sort
    if (order === 'descending') {
        state.formData.sort = false
    } else if (order === 'ascending') {
        state.formData.sort = true
    }
    getList()
}
const inputBlur = () => {
    let { max, min } = state.formData
    if (typeof min !== 'number' || typeof max !== 'number') return
    if (max < min) {
        state.formData.max = min
    }
}
const goAddr = (addr) => {
    window.open('https://tronscan.org/#/address/' + addr, 'blank')
}

const refresh = (row) => {
    globalVBus.$emit('globalLoading', true)
    refreshRechargeCollect(row.id ? { id: row.id } : null).then(res => {
        tableRef.value && !row.id && tableRef.value.clearSort()
        getList()
    }).catch(err => {
        globalVBus.$emit('globalLoading', false)
    })
}

const collectAll = (row) => {
    globalVBus.$emit('globalLoading', true)
    rechargeCollectAll(row.id ? { id: row.id } : null).then(res => {
        getList()
    }).catch(err => {
        globalVBus.$emit('globalLoading', false)
    })
}

// 查看商户详情
const showMerchantDetail = (id) => {
    globalVBus.$emit('merchantDetailDialog', id)
}
</script>

<style lang="scss">
.recharge-collect-page {
}
</style>
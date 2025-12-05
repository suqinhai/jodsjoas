<template>
    <!-- 商户消耗 -->
    <div class="container">
        <el-form class="filter-form" :model="state.searchForm" inline>
            <el-form-item>
                <el-date-picker style="width: 220px" v-model="state.searchForm.interval" type="daterange" start-placeholder="开始时间"
                    end-placeholder="结束时间" :disabled-date="disabledDate" :shortcuts="shortcuts" value-format="YYYY-MM-DD" />
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
                <el-button v-throttle type="primary" @click="fetchData('export')">excel导出</el-button>
            </el-form-item>
        </el-form>
        <el-table class="table-box" :data="state.tableData" border>
            <el-table-column label="商户ID" min-width="100" align="center">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.id)">
                        {{ row.id }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="商户名称" min-width="140" align="center">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.id)">
                        {{ row.name }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="totalAmount" label="可用额度" min-width="120" align="center" />
            <el-table-column prop="overdraftAmount" label="授信额度" min-width="120" align="center" />
            <el-table-column prop="pendingBill" label="未出账单" min-width="120" align="center" />
            <el-table-column label="变更时间" min-width="160" align="center">
                <template #default="{ row }">
                    <span>{{ dateFormat(row.updateTime) }}</span>
                </template>
            </el-table-column>
        </el-table>
        <Pagination v-show="!!state.total" v-model:page="state.pageConfig._page" v-model:size="state.pageConfig._size" :total="state.total"
            @pagination="fetchData"></Pagination>
    </div>
</template>

<script setup name="merchantConsume">
import { ref, reactive, onMounted } from 'vue'
import { getMerchantAccountList } from '@/api/dataCenter.js'
import { getShortcuts, dateFormat } from '@/common/util/index'

const shortcuts = getShortcuts()
const state = reactive({
    searchForm: {},
    pageConfig: {
        _page: 1,
        _size: 10,
    },
    tableData: [],
    total: 0,

})
const disabledDate = ref((time) => {
    return time.getTime() > Date.now()
})

onMounted(() => {
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
        delete params.interval
    }
    if (val === 'export') params.isExport = true
    globalVBus.$emit('globalLoading', true)
    getMerchantAccountList(params).then(res => {
        if (!params.isExport) {
            let { total, list = [] } = res.data
            state.tableData = list
            state.total = total
        }
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        if (!params.isExport) state.tableData = []
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

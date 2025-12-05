<template>
    <!-- 厂家数据 -->
    <div class="container">
        <el-form class="filter-form" :model="state.searchForm" inline>
            <el-form-item>
                <el-date-picker style="width: 220px" v-model="state.searchForm.interval" type="daterange" start-placeholder="开始时间"
                    end-placeholder="结束时间" value-format="YYYY-MM-DD" :disabled-date="disabledDate" :shortcuts="shortcuts">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="货币类型:">
                <el-select class="select-box" v-model="state.searchForm.currency" placeholder="请选择货币类型" clearable>
                    <el-option v-for="item in state.currencyList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="厂家:">
                <el-select class="select-box" v-model="state.searchForm.vendor" placeholder="请选择厂家" clearable>
                    <el-option v-for="item in state.vendorList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="游戏类型:">
                <el-select class="select-box" v-model="state.searchForm.gameType" placeholder="请选择游戏类型" clearable>
                    <el-option v-for="item in state.gameTypeList" :key="item.value" :label="item.label" :value="item.value">
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
                <el-button v-throttle type="primary" @click="fetchData('export')">导出报表</el-button>
            </el-form-item>
        </el-form>
        <el-table class="table-box" :data="state.tableData" border>
            <el-table-column prop="period" label="时间" min-width="100" align="center" />
            <el-table-column prop="vendorId" label="厂家ID" min-width="100" align="center" />
            <el-table-column prop="vendorName" label="厂家名称" min-width="100" align="center" />
            <el-table-column prop="gameType_" label="游戏类型" min-width="100" align="center" />
            <el-table-column prop="currency" label="货币" min-width="100" align="center" />
            <el-table-column prop="userCount" label="投注人数" min-width="100" align="center" />
            <el-table-column prop="userCoinIn" label="投注额" min-width="100" align="center" />
            <el-table-column prop="winCoin" label="输赢金额" min-width="100" align="center" />
            <el-table-column prop="playTimes" label="注单数" min-width="100" align="center" />
        </el-table>
        <Pagination v-show="!!state.total" v-model:page="state.pageConfig._page" v-model:size="state.pageConfig._size" :total="state.total"
            @pagination="fetchData"></Pagination>
    </div>
</template>

<script setup name="factoryData">
import { ref, reactive, onMounted } from 'vue'
import { getVendorBillApi } from '@api/dataCenter'
import { commonMetasApi } from '@/api/common.js'
import { getShortcuts } from '@common/util'

const shortcuts = getShortcuts()
const state = reactive({
    tableData: [],
    searchForm: {},
    pageConfig: {
        _page: 1,
        _size: 10,
    },
    total: 0,
    currencyList: [], //货币数据数组
    vendorList: [], //厂家元数据数组
    gameTypeList: [], //游戏类型元数据数组
})
const disabledDate = ref((time) => {
    return time.getTime() > Date.now()
})

onMounted(() => {
    commonMetasApi({ types: 'currency,gameVendor,gameType' }).then(({ code, data }) => {
        if (code == 0) {
            state.currencyList = data.currency
            state.vendorList = data.gameVendor
            state.gameTypeList = data.gameType
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
        delete params.interval
    }
    if (val === 'export') params.isExport = true
    globalVBus.$emit('globalLoading', true)
    getVendorBillApi(params).then(res => {
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

</script>

<style lang="scss" scoped>
.factoryData {
}
</style>

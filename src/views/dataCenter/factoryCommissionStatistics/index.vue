<template>
    <!-- 厂家抽成统计 -->
    <div class="container">
        <el-form class="filter-form" :model="state.searchForm" inline>
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
            <el-form-item label="货币:">
                <el-select class="select-box" v-model="state.searchForm.currency" placeholder="请选择货币" clearable>
                    <el-option v-for="item in state.currencyList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click="fetchData('reset')">重 置</el-button>
            </el-form-item>
        </el-form>
        <el-table class="table-box" :data="state.tableData" border>
            <el-table-column prop="name" label="厂家游戏类型" align="center" />
            <el-table-column prop="currency" label="货币" align="center" />
            <el-table-column prop="totalShare" label="累计抽成金额" align="center" />
            <el-table-column prop="vendorShare" label="厂家抽成金额" align="center" />
            <el-table-column prop="platformDiff" label="平台抽成差金额" align="center" />
        </el-table>
        <Pagination v-show="!!state.total" v-model:page="state.pageConfig._page" v-model:size="state.pageConfig._size" :total="state.total"
            @pagination="fetchData"></Pagination>
    </div>
</template>

<script setup name="factoryCommissionStatistics">
import { reactive, onMounted, defineAsyncComponent } from "vue";
import { getVendorBillShareStatsApi } from '@api/dataCenter'
import { commonMetasApi } from '@/api/common.js'
const Pagination = defineAsyncComponent(() => import('@/components/Pagination/index.vue'))

const state = reactive({
    searchForm: {},
    tableData: [],
    pageConfig: {
        _page: 1,
        _size: 10,
    },
    total: 0,
    vendorList: [],
    gameTypeList: [],
    currencyList: [],
});

onMounted(() => {
    commonMetasApi({ types: 'gameVendor,gameType,currency' }).then(({ code, data }) => {
        if (code == 0) {
            state.vendorList = data.gameVendor
            state.gameTypeList = data.gameType
            state.currencyList = data.currency
        }
    })
    fetchData()
})

const fetchData = (val = '') => {
    if (val) {
        state.pageConfig._page = 1
        if (val === 'reset') {
            state.searchForm = {}
        }
    }
    let params = { ...state.pageConfig, ...state.searchForm }
    globalVBus.$emit('globalLoading', true)
    getVendorBillShareStatsApi(params).then(res => {
        let { total, list = [] } = res.data
        state.tableData = list
        state.total = total
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        state.tableData = []
        globalVBus.$emit('globalLoading', false)
    })
}
</script>

<style lang="scss" scoped>
.factoryCommissionStatistics {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .el-table {
        flex: 1;
    }
}
</style>

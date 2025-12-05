<template>
    <!-- 商户贡献抽成统计 -->
    <div class="container">
        <el-form class="filter-form" :model="state.searchForm" inline>
            <el-form-item label="商户ID:">
                <el-input v-model="state.searchForm.merchantId" placeholder="请输入商户ID"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click="fetchData('reset')">重 置</el-button>
            </el-form-item>
        </el-form>
        <el-table class="table-box" :data="state.tableData" border>
            <el-table-column label="商户ID" align="center">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.id)">
                        {{ row.id }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="商户名称" align="center">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.id)">
                        {{ row.name }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="activeAmount" label="商户余额(U)" align="center" />
            <el-table-column prop="totalShare" label="累计抽成金额" align="center" />
            <el-table-column prop="vendorShare" label="厂家抽成金额" align="center" />
            <el-table-column prop="platformDiff" label="平台抽成差金额" align="center" />
        </el-table>
        <Pagination v-show="!!state.total" v-model:page="state.pageConfig._page" v-model:size="state.pageConfig._size"
            :total="state.total" @pagination="fetchData"></Pagination>
    </div>
</template>

<script setup name="merchantCommissionStatistics">
import { reactive, onMounted } from 'vue'
import { getMerchantBillShareStatsApi } from '@api/dataCenter'

const state = reactive({
    searchForm: {},
    pageConfig: {
        _page: 1,
        _size: 10,
    },
    tableData: [],
    total: 0,
})

onMounted(() => {
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
    getMerchantBillShareStatsApi(params).then(res => {
        let { total, list = [] } = res.data
        state.tableData = list
        state.total = total
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

<style lang="scss" scoped>
</style>

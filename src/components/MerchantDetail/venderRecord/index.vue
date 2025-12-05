<template>
    <div class="vende-record">
        <el-table :data="state.tableData" style="width: 100%" border>
            <el-table-column prop="localTime_" label="记录时间" width="120" align="center" />
            <!--  <el-table-column prop="vendor" label="厂家名称" min-width="120" align="center" /> -->
            <el-table-column label="游戏服务提供商" min-width="160" align="center">
                <template #default="{ row }">
                    {{ row.provider }}（{{row.vendor_}}）
                </template>
            </el-table-column>
            <el-table-column prop="gameType_" label="游戏类型" min-width="120" align="center" />
            <el-table-column prop="count" label="注单数" min-width="120" align="center" />
            <el-table-column prop="validCoinTotal" label="投注额度" min-width="120" align="center" />
            <el-table-column label="输赢金额" min-width="120" align="center">
                <template #default="{ row }">
                    {{ row.winLoseCoinTotal * -1 }}
                </template>
            </el-table-column>
        </el-table>
        <Pagination v-show="!!state.total" :total="state.total" v-model:page="state.listQuery._page" v-model:size="state.listQuery._size"
            @pagination="fetchData">
        </Pagination>
    </div>
</template>

<script setup>
import Pagination from '@/components/Pagination/index.vue'
import { reactive, onMounted, inject } from 'vue'
import { getMerchantGameLog } from '@/api/dataCenter.js'
import commonStore from '@/store/common'
const commonData = commonStore()
const provideData = inject('provideData')
const state = reactive({
    tableData: [],
    total: 0,
    listQuery: {
        _page: 1,
        _size: 10,
    },
})

onMounted(() => {
    fetchData()
})

const fetchData = () => {
    let params = {
        ...state.listQuery,
        merchantId: commonData.activeMerchantId || provideData.merchantId,
    }
    provideData.showLoading()
    getMerchantGameLog(params).then(res => {
        let { total, list = [] } = res.data
        state.total = total || 0
        state.tableData = list
        provideData.hideLoading()
    }).catch(() => {
        state.tableData = []
        state.total = 0
        provideData.hideLoading()
    })
}
</script>

<style lang="scss">
.vende-record {
}
</style>

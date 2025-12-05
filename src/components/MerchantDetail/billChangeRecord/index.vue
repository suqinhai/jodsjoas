<template>
    <div class="amount-record">
        <el-table :data="state.tableData" style="width: 100%" border>
            <el-table-column prop="addTime" label="账变时间" min-width="160" align="center" />
            <el-table-column prop="tradeTypeLabel" label="账单明细" min-width="120" align="center" />
            <el-table-column prop="beforeAmount" label="变动前余额" min-width="120" align="center" />
            <el-table-column prop="tradeAmount" label="变动金额" min-width="120" align="center" />
            <el-table-column prop="totalAmount" label="变动后金额" min-width="120" align="center" />
        </el-table>
        <Pagination v-show="!!state.total" :total="state.total" v-model:page="state.listQuery._page" v-model:size="state.listQuery._size"
            @pagination="fetchData">
        </Pagination>
    </div>
</template>

<script setup>
import { dateFormat } from '@/common/util'
import { reactive, onMounted, inject, defineAsyncComponent } from 'vue'
import { getMerchantAccountLogList } from '@/api/dataCenter.js'
const Pagination = defineAsyncComponent(() => import('@/components/Pagination/index.vue'))
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
        merchantId: commonData.activeMerchantId || provideData.merchantId
    }
    provideData.showLoading()
    getMerchantAccountLogList(params).then(res => {
        let { total, list = [] } = res.data
        state.total = total || 0
        state.tableData = list.map(item => {
            item.addTime && (item.addTime = dateFormat(item.addTime))
            return item
        })
        provideData.hideLoading()
    }).catch(() => {
        state.tableData = []
        state.total = 0
        provideData.hideLoading()
    })
}
</script>

<style lang="scss">
.amount-record {
}
</style>

<template>
    <div class="vende-record">
        <el-table :data="state.tableData" border>
            <el-table-column prop="addTime" label="记录时间" min-width="160" align="center" />
            <el-table-column prop="payType_" label="方式" min-width="120" align="center" />
            <el-table-column prop="toAddr" label="充币地址" min-width="300" align="center" />
            <el-table-column prop="amount" label="充值U币" min-width="100" align="center" />
            <el-table-column prop="giftAmount" label="赠送U币" min-width="100" align="center" />
            <el-table-column prop="status_" label="状态" min-width="100" align="center" />
        </el-table>
        <Pagination v-show="state.total > 0" :total="state.total" v-model:page="state.listQuery._page" v-model:size="state.listQuery._size"
            @pagination="fetchData">
        </Pagination>
    </div>
</template>

<script setup>
import { dateFormat } from '@/common/util'
import { reactive, onMounted, inject, defineAsyncComponent } from 'vue'
import { merchantRechargeListApi } from '@/api/financeManage.js'
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
        merchantId: commonData.activeMerchantId || provideData.merchantId,
    }
    provideData.showLoading()
    merchantRechargeListApi(params).then(res => {
        let { total, list = [] } = res.data
        state.total = total || 0
        state.tableData = list.map(item => {
            item.addTime && (item.addTime = dateFormat(item.addTime))
            return item
        })
        provideData.hideLoading()
    }).catch(() => {
        state.tableData = []
        provideData.hideLoading()
    })
}
</script>

<style lang="scss">
.vende-record {
}
</style>

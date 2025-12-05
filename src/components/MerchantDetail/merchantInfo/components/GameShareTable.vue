<template>
    <div>
        <div class="head">游戏分成</div>
        <el-table :data="state.tableData" border>
            <el-table-column prop="name" label="游戏平台" min-width="100" align="center" />
            <el-table-column prop="typeLabel" label="游戏类型" min-width="160" align="center" />
            <el-table-column prop="maRate" label="你的费率%" min-width="160" align="center" />
            <el-table-column prop="totalCoin" label="累计贡献" min-width="160" align="center" />
        </el-table>
        <Pagination v-show="!!state.total" v-model:page="state.pageConfig._page" v-model:size="state.pageConfig._size"
            :total="state.total" @pagination="fetchData(1)"></Pagination>
    </div>
</template>

<script setup>
import { reactive, onMounted, inject, } from 'vue'
import { getMerchantGameShareData } from '@/api/dataCenter.js'

const provideData = inject('provideData')
const state = reactive({
    tableData: [],
    total: 0,
    pageConfig: {
        _page: 1,
        _size: 10
    }
})

onMounted(() => {
    fetchData()
})

// 表格过滤数据处理
const fetchData = (type = 0) => {
    !!type && provideData.showLoading()
    getMerchantGameShareData({ ...state.pageConfig, merchantId: provideData.merchantId }).then(({ code, data }) => {
        if (code === 0 && data) {
            state.tableData = data.list
            state.total = data.total
        }
        !!type && provideData.hideLoading()
    }).catch(err => {
        state.tableData = []
        !!type && provideData.hideLoading()
    })
}
</script>

<style lang="scss">
.merchant-info {
    .merchant-info-main {
        .title {
            line-height: 24px;
            color: #666;
        }
    }
    .head {
        font-size: 18px;
        line-height: 30px;
        color: #666;
        margin-top: 15px;
    }
}
</style>

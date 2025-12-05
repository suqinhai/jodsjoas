<template>
    <!-- 游戏投注数据 -->
    <div class="container">
        <el-form class="filter-form" :model="state.formData" inline>
            <el-form-item>
                <el-date-picker v-model="state.formData.receiveTime" type="daterange" start-placeholder="开始时间" end-placeholder="结束时间"
                    :shortcuts="shortcuts" :disabled-date="disabledCurrentDateAfter" :clearable="false" value-format="YYYY-MM-DD">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="商户ID:">
                <el-input @input="(val) => state.formData.merchantId = val.replace(/\D/g,'')" v-model="state.formData.merchantId"
                    placeholder="请输入商户ID" />
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('export')">导 出</el-button>
            </el-form-item>
        </el-form>
        <el-table class="table-box" :data="state.tableData" border :row-class-name="({row,rowIndex}) => (!rowIndex ? 'total-row': '')">
            <el-table-column fixed="left" prop="reportTime_" label="厂家" min-width="100" align="center" />
            <el-table-column v-for="(item,index) in state.venderList" :key="index" :label="item.label" min-width="135" align="center">
                <template #default="{ row }">
                    {{ row['validCoin' + (state.keyData[item.value] || '')] || 0}}
                </template>
            </el-table-column>
        </el-table>

        <Pagination v-show="!!state.total" v-model:page="state.pageConfig._page" v-model:size="state.pageConfig._size" :total="state.total"
            @pagination="fetchData"></Pagination>
    </div>
</template>

<script setup name="gameBetData">
import { reactive, onMounted, onActivated } from "vue"
import { useRoute } from "vue-router"
import { getGameBetData } from "@/api/dataCenter"
import { commonMetasApi } from '@/api/common'
import { disabledCurrentDateAfter, getShortcuts, getTimeRange } from '@/common/util'

const shortcuts = getShortcuts()
const state = reactive({
    formData: {},
    venderList: [],
    keyData: {},
    tableData: [],
    total: 0,
    pageConfig: {
        _page: 1,
        _size: 10,
    },
    searchTime: '',
    merchantId: '',
    isInit: false
})
const route = useRoute()

onMounted(async () => {
    try {
        globalVBus.$emit('globalLoading', true)
        const res = await commonMetasApi({ types: 'gameVendor' })
        state.venderList = res.data?.gameVendor || []
        const { query } = route
        state.merchantId = query.merchantId || ''
        state.searchTime = query.endTime ? [query.startTime, query.endTime] : state.searchTime ? [] : ''
        state.formData = {
            merchantId: state.merchantId,
            receiveTime: state.searchTime ? state.searchTime : getTimeRange(),
        }
        fetchData()
    } catch (error) {
        globalVBus.$emit('globalLoading', false)
    }
})

onActivated(() => {
    if (!state.isInit) return state.isInit = true
    const { query } = route
    if (state.merchantId !== query.merchantId || ((state.searchTime.length && (state.searchTime[0] !== query.startTime || state.searchTime[1] !== query.endTime)) || (!state.searchTime.length && query.endTime))
    ) {
        state.merchantId = query.merchantId || ''
        state.searchTime = query.endTime ? [query.startTime, query.endTime] : state.searchTime ? [] : ''
        state.formData = {
            merchantId: state.merchantId,
            receiveTime: state.searchTime ? state.searchTime : getTimeRange(),
        }
        fetchData()
    }
})

// 表格过滤数据处理
const fetchData = (val = '') => {
    if (val === 'search') state.pageConfig._page = 1
    let params = { ...state.formData, ...state.pageConfig }
    let { receiveTime } = state.formData
    if (receiveTime && receiveTime.length) {
        if (new Date(receiveTime[1] + ' 23:23:59').getTime() - new Date(receiveTime[0] + ' 00:00:00').getTime() > 31 * 24 * 60 * 60 * 1000) return ElMessage.warning('搜索时间范围不得超过31天！')
        params['interval.begin'] = receiveTime[0]
        params['interval.end'] = receiveTime[1]
    }
    delete params.receiveTime
    if (val === 'export') params.isExport = true
    globalVBus.$emit('globalLoading', true)
    getGameBetData(params).then(({ data = {}, ext = {} }) => {
        if (!params.isExport) {
            let { total, list } = data
            state.total = total
            state.tableData = list || []
            if (state.tableData.length) {
                state.keyData = ext.key || {}
                state.tableData.unshift({ ...ext.data, reportTime_: '汇总' })
            }
        }
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        if (!params.isExport) state.tableData = []
        globalVBus.$emit('globalLoading', false)
    })
}
</script>

<style lang="scss">
</style>

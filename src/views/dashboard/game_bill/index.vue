<template>
    <!-- 首页-游戏账单数据 -->
    <div v-loading="state.loading">
        <div class="head">游戏账单数据（根据厂家货币显示）</div>
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
                <el-button v-throttle type="primary" @click="fetchData('')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('export')">导 出</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="state.tableData" border :row-class-name="({row,rowIndex}) => (!rowIndex ? 'total-row': '')">
            <el-table-column fixed="left" prop="reportTime_" label="厂家" min-width="120" align="center" />
            <el-table-column v-for="(item,index) in venderList" :key="index" :label="item.label" min-width="135" align="center">
                <template #default="{ row }">
                    {{ row['validCoin' + (state.keyData[item.value] || '')] || 0}}
                </template>
            </el-table-column>
        </el-table>

        <div class="foot">
            <span class="title">最多显示10条</span>
            <el-button v-throttle type="primary" @click="handleLookMore">查看更多</el-button>
        </div>
    </div>
</template>

<script setup>
import { reactive, onMounted } from "vue"
import { useRouter } from "vue-router"
import { ElMessage } from 'element-plus'
import { getGameBillData } from "@/api/dataCenter"
import { disabledCurrentDateAfter, getShortcuts, getTimeRange } from '@/common/util'

const shortcuts = getShortcuts()
const props = defineProps({
    venderList: {
        type: Array,
        default: () => []
    }
})
const state = reactive({
    loading: false,
    keyData: {},
    tableData: [],
    formData: {},
    searchData: {},
})
const router = useRouter()

onMounted(() => {
    state.formData.receiveTime = getTimeRange()
    fetchData()
})

// 表格过滤数据处理
const fetchData = (val = '') => {
    let params = {
        _page: 1,
        _size: 10,
        ...state.formData
    }
    let { receiveTime } = state.formData
    if (receiveTime && receiveTime.length) {
        if (new Date(receiveTime[1] + ' 23:23:59').getTime() - new Date(receiveTime[0] + ' 00:00:00').getTime() > 31 * 24 * 60 * 60 * 1000) return ElMessage.warning('搜索时间范围不得超过31天！')
        params['interval.begin'] = receiveTime[0]
        params['interval.end'] = receiveTime[1]
    }
    delete params.receiveTime
    if (val === 'export') params.isExport = true
    state.loading = true
    getGameBillData(params).then(({ data = {}, ext = {} }) => {
        if (!params.isExport) {
            state.tableData = []
            state.tableData = data.list || []
            if (state.tableData.length) {
                state.keyData = ext.key || {}
                state.tableData.unshift({ ...ext.data, reportTime_: '汇总' })
            }
            state.searchData = { ...state.formData }
        }
        state.loading = false
    }).catch(err => {
        if (!params.isExport) state.tableData = []
        state.loading = false
    })
}

const handleLookMore = () => {
    let { merchantId, receiveTime } = state.searchData
    router.push(`/data-center/game-bill-data?startTime=${receiveTime && receiveTime.length ? receiveTime[0] : ''}&endTime=${receiveTime && receiveTime.length ? receiveTime[1] : ''}&merchantId=${merchantId || ''}`)
}
</script>

<style lang="scss">
</style>

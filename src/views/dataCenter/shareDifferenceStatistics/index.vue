<template>
    <!-- 商户分成差额统计 -->
    <div class="container">
        <el-form class="filter-form" :model="state.searchForm" inline>
            <el-form-item label="选择月份:">
                <el-date-picker style="width: 160px" v-model="state.searchForm.interval" type="monthrange" :clearable="false" start-placeholder="开始月份"
                    end-placeholder="结束月份" :disabled-date="disabledDate" value-format="YYYY-MM" />
            </el-form-item>
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
        <div style="margin-bottom: 10px;color: #666">过滤条件存在商户ID时可跨月查询，不存在时，只能查询某一个月内数据</div>
        <el-table :data="state.tableData" border class="table-box">
            <el-table-column prop="period" label="时间" min-width="120" align="center" />
            <el-table-column label="商户ID" align="center" min-width="100">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.group.id)">
                        {{ row.group?.id || '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="商户名称" align="center" min-width="140">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.group.id)">
                        {{ row.group?.name || '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="currency" label="货币" min-width="100" align="center" />
            <el-table-column prop="difference" label="分成差额" min-width="120" align="center" />
            <el-table-column fixed="right" label="操作" align="center" width="100">
                <template #default="{ row }">
                    <el-button v-throttle type="primary" text
                        @click="router.push(`/data-center/share-difference-query?date=${row.period}&merchantId=${row.group.id}`)">
                        详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination v-show="!!state.total" v-model:page="state.pageConfig._page" v-model:size="state.pageConfig._size" :total="state.total"
            @pagination="fetchData"></Pagination>
    </div>
</template>

<script setup name="shareDifferenceStatistics">
import Pagination from "@/components/Pagination/index.vue"
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getShareDifferenceStatistics } from '@/api/dataCenter.js'
import { dateFormat } from "@/common/util/index.js"

const state = reactive({
    searchForm: {},
    tableData: [],
    total: 0,
    pageConfig: {
        _page: 1,
        _size: 10,
    },
    currentMonth: [],
})
const router = useRouter()
const disabledDate = ref((time) => {
    return time.getTime() > Date.now()
})

onMounted(() => {
    state.currentMonth = dateFormat((new Date()).getTime(), 'YYYY-MM')
    state.searchForm.interval = [state.currentMonth, state.currentMonth]
    fetchData()
})

const fetchData = (val = '') => {
    if (val) {
        state.pageConfig._page = 1
        if (val === 'reset') {
            state.searchForm = {
                interval: [state.currentMonth, state.currentMonth]
            }
        }
    }
    let params = { ...state.pageConfig, ...state.searchForm }
    let { interval = [], merchantId } = state.searchForm
    if (!merchantId) {
        interval[1] = interval[0]
    }
    if (interval.length) {
        params['interval.begin'] = interval[0]
        params['interval.end'] = interval[1]
        delete params.interval
    }
    globalVBus.$emit('globalLoading', true)
    getShareDifferenceStatistics(params).then(res => {
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

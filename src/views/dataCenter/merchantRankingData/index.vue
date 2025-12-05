<template>
    <!-- 商户排行数据 -->
    <div class="container">
        <el-form class="filter-form" :model="state.formData" inline>
            <el-form-item>
                <el-date-picker v-model="state.formData.receiveTime" type="daterange" start-placeholder="开始时间" end-placeholder="结束时间"
                    :shortcuts="shortcuts" :disabled-date="disabledCurrentDateAfter" :clearable="false" value-format="YYYY-MM-DD">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('export')">导 出</el-button>
            </el-form-item>
        </el-form>
        <!-- <div class="tips-box">默认统计商户总贡献排行，选择日期则为范围日期数据排名。</div> -->
        <el-table class="table-box" :data="state.tableData" border>
            <el-table-column prop="rank" label="排名" width="80" align="center" />
            <el-table-column label="商户ID" min-width="100" align="center">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.groupId)">
                        {{ row.groupId }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="商户名称" min-width="140" align="center">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.groupId)">
                        {{ row.name }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="rechargeAmount" label="商户充值金额" min-width="120" align="center" />
            <el-table-column prop="cashAmount" label="商户提现金额" min-width="120" align="center" />
            <el-table-column prop="diff" label="商户充提差额" min-width="120" align="center" />
            <el-table-column prop="commission" label="商户贡献" min-width="120" align="center" />
            <el-table-column label="商户总投注" min-width="120" align="center">
                <template #default="{ row }">
                    <span v-if="!row.playAmount">0</span>
                    <span v-else class="special pointer" @click="handleInfo(row.groupId,'showVenderBet')">
                        {{ row.playAmount }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="商户优惠总赠送" min-width="140" align="center">
                <template #default="{ row }">
                    <span v-if="!row.promotionAmount">0</span>
                    <span v-else class="special pointer" @click="handleInfo(row.groupId,'showDiscountInfo')">
                        {{ row.promotionAmount }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="regUserCount" label="商户总注册人数" min-width="140" align="center" />
            <el-table-column prop="rechargeUserCount" label="商户总充值人数" min-width="140" align="center" />
            <el-table-column prop="advertCost" label="商户广告消耗" min-width="140" align="center" />
            <el-table-column prop="playUserCount" label="商户投注人数" min-width="140" align="center" />
        </el-table>

        <Pagination v-show="!!state.total" v-model:page="state.pageConfig._page" v-model:size="state.pageConfig._size" :total="state.total"
            @pagination="fetchData"></Pagination>

        <VenderBetInfoDialog v-if="state.showVenderBet" :itemData="state.currentItem" @close="state.showVenderBet = false">
        </VenderBetInfoDialog>
        <DiscountInfoDialog v-if="state.showDiscountInfo" :itemData="state.currentItem" @close="state.showDiscountInfo = false">
        </DiscountInfoDialog>
    </div>
</template>

<script setup name="merchantRankingData">
import { reactive, onMounted, defineAsyncComponent, onActivated } from "vue"
import { useRoute } from "vue-router"
import { getMerchantRankingData } from "@/api/dataCenter.js"
import { disabledCurrentDateAfter, getShortcuts, getTimeRange } from '@/common/util'
const VenderBetInfoDialog = defineAsyncComponent(() => import("./components/VenderBetInfoDialog.vue"))
const DiscountInfoDialog = defineAsyncComponent(() => import("./components/DiscountInfoDialog.vue"))

const shortcuts = getShortcuts()
const state = reactive({
    formData: {},
    searchTime: [],
    tableData: [],
    total: 0,
    pageConfig: {
        _page: 1,
        _size: 10,
    },
    currentItem: {},
    showVenderBet: false,
    showDiscountInfo: false,
    jumpTime: '',
    isInit: false
})
const route = useRoute()

onMounted(() => {
    const { query } = route
    state.jumpTime = query.endTime ? [query.startTime, query.endTime] : state.jumpTime ? [] : ''
    state.formData = {
        receiveTime: state.jumpTime ? state.jumpTime : getTimeRange(),
    }
    fetchData()
})

onActivated(() => {
    if (!state.isInit) return state.isInit = true
    const { query } = route
    if ((state.jumpTime.length && (state.jumpTime[0] !== query.startTime || state.jumpTime[1] !== query.endTime)) || (!state.jumpTime.length && query.endTime)) {
        state.jumpTime = query.endTime ? [query.startTime, query.endTime] : state.jumpTime ? [] : ''
        state.formData = {
            agentUserId: state.agentUserId,
            receiveTime: state.jumpTime ? state.jumpTime : getTimeRange(),
        }
        fetchData()
    }
})

// 表格过滤数据处理
const fetchData = (val = '') => {
    if (val === 'search') state.pageConfig._page = 1
    let params = { ...state.pageConfig }
    let { receiveTime } = state.formData
    if (receiveTime && receiveTime.length) {
        if (new Date(receiveTime[1] + ' 23:23:59').getTime() - new Date(receiveTime[0] + ' 00:00:00').getTime() > 31 * 24 * 60 * 60 * 1000) return ElMessage.warning('搜索时间范围不得超过31天！')
        params['interval.begin'] = receiveTime[0]
        params['interval.end'] = receiveTime[1]
    }
    if (val === 'export') params.isExport = true
    globalVBus.$emit('globalLoading', true)
    getMerchantRankingData(params).then(({ data = {} }) => {
        if (!params.isExport) {
            state.tableData = data.list || []
            state.total = data.total || 0
            state.searchTime = receiveTime || []
        }
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        if (!params.isExport) state.tableData = []
        globalVBus.$emit('globalLoading', false)
    })
}

// 查看商户详情
const showMerchantDetail = (id) => {
    globalVBus.$emit('merchantDetailDialog', id)
}

const handleInfo = (groupId, key) => {
    state.currentItem = {
        receiveTime: state.searchTime,
        groupId
    }
    state[key] = true
}
</script>

<style lang="scss">
</style>

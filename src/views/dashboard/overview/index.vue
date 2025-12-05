<template>
    <!-- 首页-总览数据 -->
    <div class="overview-data" v-loading="state.loading">
        <div class="head">总览</div>
        <el-table :data="state.tableData" border>
            <el-table-column label="今日新增商户数" min-width="130" align="center">
                <template #default="{ row }">
                    <span v-if="!row.merchantStat || !row.merchantStat.daily">0</span>
                    <span v-else class="special pointer" @click="handleInfo(1)">
                        {{ row.merchantStat.daily }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="本周新增商户数" min-width="130" align="center">
                <template #default="{ row }">
                    <span v-if="!row.merchantStat || !row.merchantStat.week">0</span>
                    <span v-else class="special pointer" @click="handleInfo(2)">
                        {{ row.merchantStat.week }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="本月新增商户数" min-width="130" align="center">
                <template #default="{ row }">
                    <span v-if="!row.merchantStat || !row.merchantStat.month">0</span>
                    <span v-else class="special pointer" @click="handleInfo(3)">
                        {{ row.merchantStat.month }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="商户总数" min-width="120" align="center">
                <template #default="{ row }">
                    <span v-if="!row.merchantStat || !row.merchantStat.total">0</span>
                    <span v-else class="special pointer" @click="handleInfo(4)">
                        {{ row.merchantStat.total }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="今日商户充值/人工" min-width="140" align="center">
                <template #default="{ row }">
                    {{ row.rechargeStat?.daily || 0 }}/<span
                        :style="{'color': row.adjustStat && row.adjustStat.daily < 0 ? 'red' : '#606266'}">{{ row.adjustStat?.daily || 0}}</span>
                </template>
            </el-table-column>
            <el-table-column label="本月商户充值/人工" min-width="140" align="center">
                <template #default="{ row }">
                    {{ row.rechargeStat?.month || 0 }}/<span
                        :style="{'color': row.adjustStat && row.adjustStat.month < 0 ? 'red' : '#606266'}">{{ row.adjustStat?.month || 0}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="monthNetFee" label="本月服务器费用" min-width="130" align="center" />
            <el-table-column prop="monthCdnFee" label="本月CDN费用" min-width="130" align="center" />
            <el-table-column min-width="140" align="center">
                <template #header>本月实际收入
                    <el-tooltip effect="dark" content="统计本月1号0点至今产生的费用，包括本月服务器费用，本月CDN费用，游戏抽成（截止查询当日，为游戏未出账单）" placement="top-start">
                        <el-icon class="pointer" :size="15">
                            <QuestionFilled />
                        </el-icon>
                    </el-tooltip>
                </template>
                <template #default="{ row }">
                    {{ row.monthCommission }}
                </template>
            </el-table-column>
            <el-table-column prop="overdueAmount" label="授信金额汇总" min-width="130" align="center" />
        </el-table>

        <InfoDialog v-if="state.showInfoDialog" :itemData="state.currentItem" @close="state.showInfoDialog = false">
        </InfoDialog>
    </div>
</template>

<script setup>
import { reactive, onMounted, defineAsyncComponent } from "vue"
import { getOverviewData } from "@/api/dashboard"
const InfoDialog = defineAsyncComponent(() => import("./components/InfoDialog.vue"))

let titleData = ['今日新增商户', '本周新增商户数', '本月新增商户数', '商户总数']
const state = reactive({
    loading: false,
    tableData: [],
    formData: {},
    currentItem: {},
    showInfoDialog: false
})

onMounted(() => {
    state.loading = true
    getOverviewData().then(({ data = {} }) => {
        state.tableData = [data]
        state.loading = false
    }).catch(err => {
        state.tableData = []
        state.loading = false
    })
})

const handleInfo = (tab) => {
    state.currentItem = {
        title: titleData[tab - 1],
        tab
    }
    state.showInfoDialog = true
}
</script>

<style lang="scss">
.overview-data {
    margin-bottom: 20px;
}
</style>

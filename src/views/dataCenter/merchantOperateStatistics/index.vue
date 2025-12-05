<template>
    <!-- 商户运营统计 -->
    <div class="container">
        <el-form class="filter-form" inline :model="state.formData">
            <!-- <el-form-item>
                <el-date-picker style="width: 220px" v-model="state.formData.receiveTime" type="daterange"
                    value-format="YYYY-MM-DD" start-placeholder="开始时间" end-placeholder="结束时间" :shortcuts="shortcuts" />
            </el-form-item> -->
            <el-form-item label="商户ID:">
                <el-input v-model="state.formData.merchantId" placeholder="请输入商户ID" />
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click="fetchData('reset')">重 置</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('export')">导出表格</el-button>
            </el-form-item>
        </el-form>
        <el-table class="table-box" :data="state.tableData" border>
            <el-table-column label="商户ID" min-width="100" align="center">
                <template #default="{ row }">
                    <span class="special pointer" @click="commonData.merchantId = row.id, tabType = 1, state.merchantDetailShow = true">
                        {{ row.id }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="商户名称" min-width="140" align="center">
                <template #default="{ row }">
                    <span class="special pointer" @click="commonData.merchantId = row.id, tabType = 1, state.merchantDetailShow = true">
                        {{ row.name }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="子站点数" min-width="140" align="center">
                <template #default="{ row }">
                    <span class="special pointer" @click="commonData.merchantId = row.id,tabType = 5,state.merchantDetailShow = true">
                        {{ row.merchantNum }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="vendorNum" label="游戏厂家数" min-width="100" align="center" />
            <el-table-column prop="currency" label="货币" min-width="100" align="center" />
            <el-table-column prop="expendAmount" label="消耗额度(U)" min-width="100" align="center" />
            <el-table-column prop="activeAmount" label="当前站点余额(U)" min-width="100" align="center" />
            <el-table-column prop="agentUserCount" label="代理数" min-width="100" align="center" />
            <el-table-column prop="userCount" label="会员数" min-width="100" align="center" />
        </el-table>

        <Pagination v-show="state.total > 0" :total="state.total" v-model:size="state.listQuery._size" v-model:page="state.listQuery._page"
            @pagination="fetchData"></Pagination>

        <MerchantDetail v-if="state.merchantDetailShow" :tabType="tabType" @close="state.merchantDetailShow = false">
        </MerchantDetail>
    </div>
</template>

<script setup name="merchantOperateStatistics">
import { reactive, onMounted, defineAsyncComponent, ref } from 'vue'
import { getMerchantStatisticsList } from "@/api/dataCenter.js"
import { getShortcuts } from '@/common/util'
import commonStore from '@/store/common'
const Pagination = defineAsyncComponent(() => import('@/components/Pagination/index.vue'))
const MerchantDetail = defineAsyncComponent(() => import('@/components/MerchantDetail/index.vue'))

const shortcuts = getShortcuts()
const tabType = ref(0)
const state = reactive({
    formData: {},
    tableData: [],
    total: 0,
    listQuery: {
        _page: 1,
        _size: 10,
    },
    merchantDetailShow: false,
})


const commonData = commonStore()

onMounted(() => {
    fetchData()
})

// 表格过滤数据处理
const fetchData = (val = '') => {
    if (val && val !== 'export') {
        state.listQuery._page = 1
        if (val === 'reset') {
            state.formData = {}
        }
    }
    let params = { ...state.listQuery, ...state.formData }
    // let { receiveTime = [] } = state.formData
    // if (receiveTime.length) {
    //     params['interval.begin'] = receiveTime[0]
    //     params['interval.end'] = receiveTime[1]
    // }
    // delete params.receiveTime
    if (val === 'export') params.isExport = true
    globalVBus.$emit('globalLoading', true)
    getMerchantStatisticsList(params).then(res => {
        if (!params.isExport) {
            let { total, list = [] } = res.data
            state.tableData = list
            state.total = total
        }
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        if (!params.isExport) state.tableData = []
        globalVBus.$emit('globalLoading', false)
    })
}
</script>

<style lang="scss" scoped>
</style>

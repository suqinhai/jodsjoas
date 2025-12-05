<template>
    <!-- 商户数据 -->
    <div class="container">
        <el-form class="filter-form" :model="state.searchForm" inline>
            <el-form-item>
                <el-date-picker style="width: 220px" v-model="state.searchForm.interval" type="daterange" start-placeholder="开始时间"
                    end-placeholder="结束时间" value-format="YYYY-MM-DD" :disabled-date="disabledDate" :shortcuts="shortcuts">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="商户ID:">
                <el-input v-model="state.searchForm.merchantId" placeholder="请输入商户ID" />
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click="fetchData('reset')">重 置</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('export')">导出报表</el-button>
            </el-form-item>
        </el-form>
        <el-table class="table-box" :data="state.tableData" border>
            <el-table-column label="商户ID" align="center" min-width="100">
                <template #default="{ row }">
                    <span class="special pointer" @click="commonData.merchantId = row.id, tabType = 1, state.merchantDetailShow = true">
                        {{ row.id }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="商户名称" align="center" min-width="140">
                <template #default="{ row }">
                    <span class="special pointer" @click="commonData.merchantId = row.id, tabType = 1, tabType = 1, state.merchantDetailShow = true">
                        {{ row.name }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="level" label="商户等级" min-width="100" align="center" />
            <el-table-column label="子站点数" align="center" min-width="140">
                <template #default="{ row }">
                    <span class="special pointer" @click="commonData.merchantId = row.id, tabType = 5, state.merchantDetailShow = true">
                        {{ row.merchantNum }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="currency" label="货币" min-width="80" align="center" />
            <el-table-column prop="totalAmount" label="可用余额" min-width="120" align="center" />
            <el-table-column prop="activeAmount" label="站点额度" min-width="120" align="center" />
            <el-table-column prop="overdraftAmount" label="授信额度" min-width="120" align="center" />
            <el-table-column prop="unpaidBill" label="未结账单" min-width="120" align="center">
                <template #default="{ row }">
                    <el-button v-throttle type="primary" link @click="handleOpenAccount(row)" v-if="row.unpaidBill">
                        {{ row.unpaidBill }}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="domain" label="后台域名" min-width="160" align="center" />
            <el-table-column prop="riskStatus_" label="风控状态" min-width="120" align="center" />
            <el-table-column prop="vendorNum" label="厂家游戏类型数" min-width="160" align="center" />
            <el-table-column prop="status_" label="站点状态" min-width="120" align="center" />
            <el-table-column prop="addTime" label="创建时间" min-width="160" align="center">
                <template #default="{ row }">
                    <span>{{ dateFormat(row.addTime) }}</span>
                </template>
            </el-table-column>
        </el-table>
        <Pagination v-show="!!state.total" v-model:page="state.pageConfig._page" v-model:size="state.pageConfig._size" :total="state.total"
            @pagination="fetchData"></Pagination>
        <MerchantDetail v-if="state.merchantDetailShow" :tabType="tabType" @close="state.merchantDetailShow = false">
        </MerchantDetail>
    </div>
</template>

<script setup name="merchantData">
import Pagination from "@/components/Pagination/index.vue";
import { ref, reactive, onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { getMerchantList } from '@/api/dataCenter.js'
import { getShortcuts, dateFormat } from '@common/util'
import commonStore from '@/store/common'
const MerchantDetail = defineAsyncComponent(() => import('@/components/MerchantDetail/index.vue'))

const shortcuts = getShortcuts()
const tabType = ref(0)
const state = reactive({
    tableData: [],
    searchForm: {},
    pageConfig: {
        _page: 1,
        _size: 10,
    },
    total: 0,
    merchantId: '',
    merchantDetailShow: false,
})
const commonData = commonStore()
const disabledDate = ref((time) => {
    return time.getTime() > Date.now()
})
const router = useRouter()

onMounted(() => {
    fetchData()
})

const fetchData = (val = '') => {
    if (val && val !== 'export') {
        state.pageConfig._page = 1
        if (val === 'reset') {
            state.searchForm = {}
        }
    }
    let params = { ...state.pageConfig, ...state.searchForm }
    let { interval } = state.searchForm
    if (interval && interval.length) {
        params['interval.begin'] = interval[0]
        params['interval.end'] = interval[1]
    }
    delete params.interval
    if (val === 'export') params.isExport = true
    globalVBus.$emit('globalLoading', true)
    getMerchantList(params).then(res => {
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

//点击未结账单
const handleOpenAccount = (value) => {
    router.push({
        path: '/data-center/merchant-unclear-bill',
        query: {
            id: value.id,
        },
    })
}
</script>

<style lang="scss" scoped>
</style>

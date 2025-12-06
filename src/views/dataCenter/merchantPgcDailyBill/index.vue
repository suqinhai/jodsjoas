<template>
    <!-- 商户日账单 -->
    <div class="container">
        <el-form class="filter-form" :model="state.searchForm" inline>
            <el-form-item>
                <el-date-picker style="width: 150px" v-model="state.searchForm.period" type="date" :clearable="false" placeholder="请选择日期"
                    value-format="YYYY-MM-DD" :disabled-date="disabledDate">
                </el-date-picker>
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
            <el-table-column prop="period" label="日期" min-width="120" align="center" />
            <el-table-column label="商户ID" align="center" min-width="120">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.merchantId)">
                        {{ row.merchantId }}
                    </span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="商户名称" align="center" min-width="140">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.merchant.id)">
                        {{ row.merchant?.name || '' }}
                    </span>
                </template>
            </el-table-column> -->
            <el-table-column prop="rtpUpCoinIn" label="rtp＞100投注（BRL）" min-width="180" align="center" />
            <el-table-column prop="rtpUpFee" label="rtp＞100费用（U）" min-width="160" align="center" />
            <el-table-column prop="rtpDnCoinIn" label="rtp＜100投注（BRL）" min-width="180" align="center" />
            <el-table-column prop="rtpDnFee" label="rtp＜100费用（U）" min-width="160" align="center" />
            <el-table-column prop="rechargeAmount" label="充值金额" min-width="120" align="center" />
            <el-table-column prop="cashAmount" label="提现金额" min-width="120" align="center" />
            <el-table-column prop="diff" label="充提差" min-width="120" align="center" />
        </el-table>
        <!-- <Pagination v-show="!!state.total" v-model:page="state.pageConfig._page" v-model:size="state.pageConfig._size" :total="state.total"
            @pagination="fetchData"></Pagination> -->
    </div>
</template>

<script setup name="merchantPgcDailyBill">
// import Pagination from "@/components/Pagination/index.vue"
import { ref, reactive, onMounted } from 'vue'
import { getPgcDailyBillList } from '@/api/dataCenter.js'
import { dateFormat } from '@common/util'

const state = reactive({
    tableData: [],
    searchForm: {},
    pageConfig: {
        _page: 1,
        _size: 10,
    },
    total: 0,
})
const disabledDate = ref((time) => {
    return time.getTime() > Date.now() - (24 * 60 * 60 * 1000)
})

onMounted(() => {
    state.searchForm.period = dateFormat(Date.now() - (24 * 60 * 60 * 1000), 'YYYY-MM-DD')
    fetchData()
})

const fetchData = (val = '') => {
    if (val && val !== 'export') {
        state.pageConfig._page = 1
        if (val === 'reset') {
            state.searchForm = {
                period: dateFormat(Date.now() - (24 * 60 * 60 * 1000), 'YYYY-MM-DD')
            }
        }
    }
    let params = { ...state.searchForm }
    if (val === 'export') params.isExport = true
    globalVBus.$emit('globalLoading', true)
    getPgcDailyBillList(params).then(res => {
        if (!params.isExport) {
            state.tableData = res.data || []
            state.tableData.forEach(item => {
                item.period && (item.period = dateFormat(item.period, 'YYYY-MM-DD'))
            })
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
</script>

<style lang="scss" scoped>
</style>

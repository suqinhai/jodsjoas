<template>
    <!-- 商户佣金数据 -->
    <div class="container merchant-brokerage-data">
        <el-form class="filter-form" inline :model="state.formData">
            <el-form-item>
                <el-date-picker style="width: 220px" v-model="state.formData.receiveTime" type="daterange" value-format="YYYY-MM-DD"
                    start-placeholder="开始时间" end-placeholder="结束时间" :disabled-date="disabledDate" :shortcuts="shortcuts" />
            </el-form-item>
            <el-form-item label="商户ID:">
                <el-input v-model="state.formData.merchantId" placeholder="请输入商户ID" />
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click="fetchData('reset')">重 置</el-button>
            </el-form-item>
        </el-form>
        <el-table class="table-box" :data="state.tableData" border>
            <el-table-column prop="addTime" label="时间" min-width="160" align="center" />
            <el-table-column label="商户ID" align="center" min-width="100">
                <template #default="{ row }">
                    <span class="special pointer" @click="state.merchantId = row.merchant.id,state.merchantDetailShow = true">
                        {{ row.merchant?.id || '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="商户名称" align="center" min-width="140">
                <template #default="{ row }">
                    <span class="special pointer" @click="state.merchantId = row.merchant.id,state.merchantDetailShow = true">
                        {{ row.merchant?.name  || '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="上级商户ID" align="center" min-width="140">
                <template #default="{ row }">
                    <span class="special pointer" @click="state.merchantId = row.merchant.id,state.merchantDetailShow = true">
                        {{ row.merchant?.id  || '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="tradeType_" label="是否开站成功" min-width="120" align="center" />
            <el-table-column prop="tradeType_" label="推广商户数" min-width="120" align="center" />
            <el-table-column prop="tradeType_" label="总预缴额度U" min-width="120" align="center" />
            <el-table-column prop="tradeType_" label="当前额度U" min-width="120" align="center" />
            <el-table-column prop="remark" label="佣金奖励" min-width="140" align="center" />
        </el-table>
        <Pagination v-show="state.total > 0" :total="state.total" v-model:size="state.listQuery._size" v-model:page="state.listQuery._page"
            @pagination="fetchData"></Pagination>
    </div>
</template>

<script setup name="merchantBrokerageData">
import { ref, reactive, onMounted, defineAsyncComponent } from 'vue'
import { getPromoteApplyList } from "@/api/merchantConfig.js"
import { dateFormat, getShortcuts } from '@/common/util'
const Pagination = defineAsyncComponent(() => import('@/components/Pagination/index.vue'))

const shortcuts = getShortcuts()
const state = reactive({
    formData: {},
    tableData: [],
    total: 0,
    listQuery: {
        _page: 1,
        _size: 10,
    },
    merchantDetailShow: false,
    merchantId: '',
})
const disabledDate = ref((time) => {
    return time.getTime() > Date.now()
})

onMounted(() => {
    // fetchData()
})

const fetchData = (val = '') => {
    if (val) {
        state.listQuery._page = 1
        if (val === 'reset') {
            state.formData = {}
        }
    }
    let params = { ...state.listQuery, ...state.formData }
    let { receiveTime } = state.formData
    if (receiveTime && receiveTime.length) {
        params['interval.begin'] = receiveTime[0]
        params['interval.end'] = receiveTime[1]
    }
    delete params.receiveTime
    globalVBus.$emit('globalLoading', true)
    getPromoteApplyList(params).then(res => {
        let { total, list = [] } = res.data
        state.tableData = list.map(item => {
            item.addTime && (item.addTime = dateFormat(item.addTime))
            return item
        })
        state.total = total
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        state.tableData = []
        globalVBus.$emit('globalLoading', false)
    })
}
</script>

<style lang="scss" scoped>
.merchant-brokerage-data {
}
</style>

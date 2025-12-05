<template>
    <!-- 商户授信额度修正 -->
    <div class="container merchant-overdraft-amend">
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
            <!-- <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('export')">导出表格</el-button>
            </el-form-item> -->
            <el-form-item v-permiss="'admin.merchant-account-adjust-log.overdraft'">
                <el-button v-throttle type="primary" @click="state.addAmendShow = true">新 增</el-button>
            </el-form-item>
        </el-form>
        <el-table class="table-box" :data="state.tableData" border>
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
                        {{ row.group?.name  || '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="tradeType_" label="变动类型" min-width="120" align="center" />
            <el-table-column label="变更透支额U" min-width="140" align="center">
                <template #default="{ row }">
                    <span :style="{'color': row.tradeType === 7 ? 'green' : 'red'}">
                        {{ row.tradeType === 7 ? row.amount : row.amount * -1 }}
                    </span>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="activeAmount" label="修正后透支额U" min-width="140" align="center" /> -->
            <!-- <el-table-column prop="totalAmount" label="修正前余额" min-width="120" align="center" />
            <el-table-column prop="auditFactor" label="稽核倍数" min-width="120" align="center" /> -->
            <el-table-column prop="remark" label="备注" min-width="140" align="center" />
            <!-- <el-table-column prop="pcRemark" label="前端备注" min-width="120" align="center" /> -->
            <el-table-column prop="emp.name" label="操作人" min-width="120" align="center" />
            <el-table-column prop="addTime" label="操作时间" min-width="160" align="center" />
        </el-table>
        <Pagination v-show="state.total > 0" :total="state.total" v-model:size="state.listQuery._size" v-model:page="state.listQuery._page"
            @pagination="fetchData"></Pagination>

        <AddAmendDialog v-if="state.addAmendShow" :merchantTradeType="merchantTradeType" @close="state.addAmendShow = false" @fetchData="fetchData">
        </AddAmendDialog>
    </div>
</template>

<script setup name="merchantOverdraftAmend">
import { ref, reactive, onMounted, defineAsyncComponent } from 'vue'
import { getMerchantAmendList } from "@/api/financeManage.js"
import { commonMetasApi } from '@/api/common'
import { dateFormat, getShortcuts } from '@/common/util'
const Pagination = defineAsyncComponent(() => import('@/components/Pagination/index.vue'))
const AddAmendDialog = defineAsyncComponent(() => import('./components/AddAmendDialog.vue'))

const shortcuts = getShortcuts()
const state = reactive({
    formData: {},
    tableData: [],
    total: 0,
    listQuery: {
        _page: 1,
        _size: 10,
    },
    addAmendShow: false,
})
const disabledDate = ref((time) => {
    return time.getTime() > Date.now()
})
let merchantTradeType = ref([])

commonMetasApi({ types: 'merchantTradeType' }).then(res => {
    merchantTradeType.value = res.data.merchantTradeType.filter(item => [7, 8].includes(+item.value))
})

onMounted(() => {
    fetchData()
})

const fetchData = (val = '') => {
    if (val && val !== 'export') {
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
    if (val === 'export') params.isExport = true
    globalVBus.$emit('globalLoading', true)
    getMerchantAmendList(params).then(res => {
        if (!params.isExport) {
            let { total, list = [] } = res.data
            state.tableData = list.map(item => {
                item.addTime && (item.addTime = dateFormat(item.addTime))
                return item
            })
            state.total = total
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
.merchant-overdraft-amend {
}
</style>

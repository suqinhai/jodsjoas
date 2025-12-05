<template>
    <!-- 厂家人工出款管理 -->
    <div class="container">
        <el-form class="filter-form" :model="state.searchForm" inline>
            <el-form-item label="厂家ID:">
                <el-input v-model="state.searchForm.id" placeholder="请输入厂家ID" />
            </el-form-item>
            <el-form-item label="厂家名称:">
                <el-input v-model="state.searchForm.vendor" placeholder="请输入厂家名称" />
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click="fetchData('reset')">重 置</el-button>
            </el-form-item>
        </el-form>
        <el-table class="table-box" border :data="state.tableData">
            <el-table-column prop="id" label="账单ID" min-width="80" align="center" />
            <el-table-column prop="period" label="月账单" min-width="80" align="center" />
            <el-table-column prop="vendor" label="厂家名称" min-width="120" align="center" />
            <el-table-column prop="realPay" label="转账金额(U)" min-width="130" align="center" />
            <el-table-column prop="fromAddr" label="From Addr" min-width="340" align="center" />
            <el-table-column prop="toAddr" label="To Addr" min-width="340" align="center" />
            <el-table-column prop="auditRemark" label="备注" min-width="140" align="center" />
            <el-table-column prop="status_" label="状态" min-width="100" align="center" />
            <el-table-column prop="settleEmpName" label="操作人" min-width="120" align="center" />
            <el-table-column prop="realPayTime" label="操作时间" min-width="160" align="center">
                <template #default="{ row }">
                    {{ dateFormat(row.realPayTime) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" align="center" width="100">
                <template #default="{ row }">
                    <el-button v-throttle type="primary" v-if="row.status != 9 && userData.isHasPermiss('admin.vendor-bill.settle')" link
                        @click="handleCheck(row)">审核</el-button>
                    <el-button v-throttle type="primary" v-else link @click="handleDetail(row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination v-show="!!state.total" v-model:page="state.pageConfig._page" v-model:size="state.pageConfig._size" :total="state.total"
            @pagination="fetchData"></Pagination>

        <DetailDialog @close="state.showCheckOrDetailDialog=false" :viewType="state.viewType" :item="state.currentItem"
            v-if="state.showCheckOrDetailDialog" @refresh="fetchData">
        </DetailDialog>
    </div>
</template>

<script setup name="factoryArtificialOutManage">
import { reactive, onMounted, defineAsyncComponent } from "vue"
import userStore from '@/store/user'
import { vendorBillListApi } from '@/api/dataCenter.js'
import { dateFormat } from '@common/util'
const Pagination = defineAsyncComponent(() => import('@/components/Pagination/index.vue'))
const DetailDialog = defineAsyncComponent(() => import('./components/DetailDialog.vue'))

const state = reactive({
    searchForm: {},
    tableData: [],
    pageConfig: {
        _page: 1,
        _size: 10,
    },
    total: 0,
    showCheckOrDetailDialog: false,
    currentItem: {},
    viewType: '',
})
const userData = userStore()

onMounted(() => {
    fetchData()
})

const fetchData = (val = '') => {
    if (val) {
        state.pageConfig._page = 1
        if (val === 'reset') {
            state.searchForm = {}
        }
    }
    let params = { ...state.pageConfig, ...state.searchForm }
    params.menu = 2
    globalVBus.$emit('globalLoading', true)
    vendorBillListApi(params).then(res => {
        let { total, list = [] } = res.data
        state.tableData = list
        state.total = total
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        state.tableData = []
        globalVBus.$emit('globalLoading', false)
    })
}

const handleDetail = (item) => {
    state.currentItem = item
    state.viewType = 'view'
    state.showCheckOrDetailDialog = true
}

const handleCheck = (item) => {
    state.currentItem = item
    state.viewType = 'edit'
    state.showCheckOrDetailDialog = true
}
</script>

<style lang="scss" scoped>
.factoryArtificialOutInManage {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .el-table {
        flex: 1;
    }
}
</style>

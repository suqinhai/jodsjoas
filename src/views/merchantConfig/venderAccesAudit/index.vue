<template>
    <!-- 商户厂家接入审核 -->
    <div class="container">
        <el-table class="table-box" :data="state.tableData" border style="width: 100%">
            <el-table-column prop="vendorId" label="厂家ID" min-width="100" align="center" />
            <el-table-column prop="alias_" label="厂家名称" min-width="120" align="center" />
            <el-table-column prop="type_" label="游戏类型" min-width="120" align="center" />
            <el-table-column prop="shareRate" label="商户分成比例%" min-width="140" align="center" />
            <el-table-column label="申请商户ID" align="center" min-width="100">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.merchant.id)">
                        {{ row.merchant?.id || '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="申请商户名称" align="center" min-width="140">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.merchant.id)">
                        {{ row.merchant?.name || '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="applyRemark" label="申请备注" min-width="200" align="center" />
            <el-table-column label="申请状态" min-width="120" align="center">
                <template #default="{ row }">
                    <span style="color: red" v-if="row.status === 1">{{row.status_}}</span>
                    <span style="color: green" v-if="row.status === 2">{{row.status_}}</span>
                    <span style="color: #999" v-if="row.status === 3">{{row.status_}}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" align="center" label="操作" width="120">
                <template #default="{ row }">
                    <el-button v-throttle type="primary" text
                        v-if="row.status === 1 && userData.isHasPermiss('admin.vendor.applyVerify')" @click="handleAudit(row)">审核
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination v-show="!!state.total" v-model:page="state.listQuery._page" v-model:size="state.listQuery._size"
            :total="state.total" @pagination="fetchData"></Pagination>

        <AuditDialog v-if="state.showAuditDialog" @close="state.showAuditDialog = false" :itemData="state.itemData"
            @fetchData="fetchData">
        </AuditDialog>
    </div>
</template>

<script setup name="venderAccesAudit">
import Pagination from "@/components/Pagination/index.vue"
import { reactive, onMounted, defineAsyncComponent } from "vue"
import userStore from '@/store/user'
import { getMerchantApplyVendorList } from '@/api/merchantConfig'
import { dateFormat } from '@/common/util'
const AuditDialog = defineAsyncComponent(() => import('./components/AuditDialog.vue'))

const state = reactive({
    tableData: [],
    total: 0,
    listQuery: {
        _page: 1,
        _size: 10,
    },
    itemData: {},
    showAuditDialog: false,
})
const userData = userStore()

onMounted(() => {
    fetchData()
})

// 表格过滤数据处理
const fetchData = () => {
    globalVBus.$emit('globalLoading', true)
    getMerchantApplyVendorList().then(res => {
        let { list, total } = res.data
        state.tableData = list.map(item => {
            item.addTime && (item.addTime = dateFormat(item.addTime))
            item.updateTime && (item.updateTime = dateFormat(item.updateTime))
            return item
        })
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

const handleAudit = (row) => {
    state.itemData = { ...row }
    state.showAuditDialog = true
}
</script>

<style lang="scss" scoped>
.operation-statist {
}
</style>

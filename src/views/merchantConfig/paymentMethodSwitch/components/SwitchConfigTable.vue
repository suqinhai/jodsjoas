<template>
    <!-- 商户支付方式开关-商户支付开关配置 -->
    <div class="tabs-main">
        <el-form class="filter-form" inline :model="state.formData">
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
            <el-table-column label="商户ID" align="center" min-width="100">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.merchantId)">
                        {{ row.merchantId || '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="商户名称" align="center" min-width="120">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.merchantId)">
                        {{ row.merchantName || '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="currency" label="币种" align="center" min-width="120" />
            <el-table-column prop="commissionMode" label="抽成模式" min-width="120" align="center" />
            <el-table-column prop="payCount" label="已开启支付数量" min-width="120" align="center" />
            <el-table-column fixed="right" align="center" label="操作" width="120">
                <template #default="{ row }">
                    <el-button v-throttle type="primary" text @click="handleConfig(row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination v-show="state.total > 0" :total="state.total" v-model:size="state.listQuery._size" v-model:page="state.listQuery._page"
            @pagination="fetchData">
        </Pagination>

        <DeployDialog v-if="state.dialogShow" @close="state.dialogShow = false" :payChannelList="payChannelList" :itemData="state.itemData"
            @fetchData="fetchData">
        </DeployDialog>
    </div>
</template>

<script setup>
import { reactive, onMounted, defineAsyncComponent, defineProps } from 'vue'
import { getMerchantPayChannelLimit } from '@/api/merchantConfig'
import { getPayChannelList } from '@/api/common'
import { dateFormat } from '@/common/util'
const DeployDialog = defineAsyncComponent(() => import('./DeployDialog.vue'))

const props = defineProps({
    payChannelList: {
        type: Object,
        default: () => {
            return {}
        }
    }
})
const state = reactive({
    formData: {},
    ext: {},
    tableData: [],
    total: 0,
    listQuery: {
        _page: 1,
        _size: 10,
    },
    dialogShow: false,
    itemData: {}
})

onMounted(() => {
    fetchData()
})

// 表格过滤数据处理
const fetchData = (val = '') => {
    if (val) {
        state.listQuery._page = 1
        if (val === 'reset') {
            state.formData = {}
        }
    }
    let params = { ...state.listQuery, ...state.formData }
    globalVBus.$emit('globalLoading', true)
    getMerchantPayChannelLimit(params).then(({ data, ext }) => {
        let { total, list } = data
        state.tableData = list.map(item => {
            item.updateTime && (item.updateTime = dateFormat(item.updateTime))
            return item
        })
        state.ext = ext || {}
        state.total = total
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        state.tableData = []
        globalVBus.$emit('globalLoading', false)
    })
}

// 修改
const handleConfig = (row) => {
    globalVBus.$emit('globalLoading', true)
    getPayChannelList({ merchantId: row.merchantId }).then(res => {
        state.itemData = { ...row, ...state.ext }
        state.itemData.dataList = res.data || []
        state.dialogShow = true
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        globalVBus.$emit('globalLoading', false)
    })
}

// 查看商户详情
const showMerchantDetail = (id) => {
    globalVBus.$emit('merchantDetailDialog', id)
}
</script>

<style lang="scss">
</style>

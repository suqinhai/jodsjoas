<template>
    <!-- 站点费用设置 -->
    <div class="container">
        <el-form class="filter-form" :model="state.searchForm" inline>
            <el-form-item label="商户名称:">
                <el-input v-model="state.searchForm.name" placeholder="请输入商户名称" />
            </el-form-item>
            <el-form-item label="商户ID:">
                <el-input v-model="state.searchForm.groupId" placeholder="请输入商户ID" />
            </el-form-item>
			<el-form-item label="站点ID:">
			    <el-input v-model="state.searchForm.merchantId" placeholder="请输入站点ID" />
			</el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click="fetchData('reset')">重 置</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="state.tableData" border class="table-box">
            <el-table-column label="商户ID" align="center" min-width="100">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.merchantId)">
                        {{ row.merchantId || '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="商户名称" align="center" min-width="140">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.merchantId)">
                        {{ row.merchantName || '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="siteId" label="站点ID" min-width="120" align="center" />
            <el-table-column prop="name" label="站点名称" min-width="120" align="center" />
            <el-table-column prop="openFee" label="开版费U" min-width="120" align="center" />
            <el-table-column prop="lineCost" label="线路费用U" min-width="120" align="center" />
            <el-table-column prop="monthMin" label="游戏月保底" min-width="120" align="center" />
            <el-table-column prop="updateTime" label="操作时间" min-width="160" align="center" />
            <el-table-column fixed="right" label="操作" width="100" align="center" v-if="userData.isHasPermiss('admin.merchant-cost-config.edit-site')">
                <template #default="{ row }">
                    <el-button v-throttle type="primary" text @click="handleConfig(row)">修改
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination v-show="!!state.total" v-model:page="state.pageConfig._page" v-model:size="state.pageConfig._size" :total="state.total"
            @pagination="fetchData"></Pagination>

        <DeployDialog :itemData="state.itemData" @close="state.showDeployDialog = false" v-if="state.showDeployDialog" @fetchData="fetchData">
        </DeployDialog>
    </div>
</template>

<script setup name="siteCostSet">
import Pagination from "@/components/Pagination/index.vue"
import { reactive, onMounted, defineAsyncComponent } from 'vue'
import userStore from '@/store/user'
import { merchantCostConfigListApi } from '@/api/merchantConfig.js'
import { dateFormat } from "@/common/util/index.js"
const DeployDialog = defineAsyncComponent(() => import("./components/DeployDialog.vue"))

const state = reactive({
    searchForm: {},
    tableData: [],
    total: 0,
    pageConfig: {
        _page: 1,
        _size: 10,
    },
    showDeployDialog: false,
    itemData: {},
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
    let params = { ...state.pageConfig, ...state.searchForm, identity: 1 }
    globalVBus.$emit('globalLoading', true)
    merchantCostConfigListApi(params).then(res => {
        let { total, list = [] } = res.data
        state.tableData = list.map(item => {
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

const handleConfig = (row) => {
    state.itemData = { ...row }
    state.showDeployDialog = true
}
</script>

<style lang="scss" scoped>
</style>

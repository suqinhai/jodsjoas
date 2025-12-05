<template>
    <!-- 推广商户申请列表 -->
    <div class="container promote-merchant-apply-list">
        <el-form class="filter-form" inline :model="state.formData">
            <el-form-item>
                <el-date-picker style="width: 220px" v-model="state.formData.receiveTime" type="daterange" value-format="YYYY-MM-DD"
                    start-placeholder="开始时间" end-placeholder="结束时间" :disabled-date="disabledDate" :shortcuts="shortcuts" />
            </el-form-item>
            <el-form-item label="上级商户ID:">
                <el-input v-model="state.formData.parentId" placeholder="请输入上级商户ID" />
            </el-form-item>
            <el-form-item label="状态:">
                <el-select class="select-box" v-model="state.formData.status" placeholder="请选择状态" clearable>
                    <el-option label="待处理" :value="0" />
                    <el-option label="已处理" :value="1" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click="fetchData('reset')">重 置</el-button>
            </el-form-item>
            <el-form-item v-permiss="'admin.promote-merchant.configEdit'">
                <el-button v-throttle type="primary" @click="handleSet">推广设置</el-button>
            </el-form-item>
        </el-form>
        <el-table class="table-box" :data="state.tableData" border>
            <el-table-column prop="addTime" label="申请时间" min-width="160" align="center" />
            <el-table-column label="上级商户ID" align="center" min-width="100">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.merchant.id)">
                        {{ row.merchant?.id || '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="上级商户名称" align="center" min-width="140">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.merchant.id)">
                        {{ row.merchant?.name  || '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="type_" label="联系方式" min-width="120" align="center" />
            <el-table-column prop="account" label="联系信息" min-width="120" align="center" />
            <el-table-column prop="remark" label="申请人备注" min-width="140" align="center" />
            <el-table-column prop="status_" label="状态" min-width="120" align="center" />
            <el-table-column fixed="right" align="center" label="操作" width="100">
                <template #default="{ row }">
                    <el-button v-if="userData.isHasPermiss('admin.promote-merchant.edit') && row.status === 0" v-throttle type="primary" text
                        @click="state.itemData = {...row},state.showDialog = true">处理
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination v-show="state.total > 0" :total="state.total" v-model:size="state.listQuery._size" v-model:page="state.listQuery._page"
            @pagination="fetchData"></Pagination>

        <ApplyDisposeDialog v-if="state.showDialog" :itemData="state.itemData" @close="state.showDialog = false" @fetchData="fetchData">
        </ApplyDisposeDialog>
        <PromoteSetDialog v-if="state.showSetDialog" :imType="state.imType" :itemData="state.itemData" @close="state.showSetDialog = false">
        </PromoteSetDialog>
    </div>
</template>

<script setup name="promoteMerchantApplyList">
import { ref, reactive, onMounted, defineAsyncComponent } from 'vue'
import { getPromoteApplyList, getPromoteConfig } from "@/api/merchantConfig.js"
import { commonMetasApi } from '@/api/common'
import { dateFormat, getShortcuts } from '@/common/util'
import userStore from '@/store/user'
const Pagination = defineAsyncComponent(() => import('@/components/Pagination/index.vue'))
const ApplyDisposeDialog = defineAsyncComponent(() => import('./components/ApplyDisposeDialog.vue'))
const PromoteSetDialog = defineAsyncComponent(() => import('./components/PromoteSetDialog.vue'))

const shortcuts = getShortcuts()
const state = reactive({
    formData: {},
    tableData: [],
    total: 0,
    listQuery: {
        _page: 1,
        _size: 10,
    },
    itemData: {},
    showDialog: false,
    showSetDialog: false,
    imType: []
})
const disabledDate = ref((time) => {
    return time.getTime() > Date.now()
})
const userData = userStore()

commonMetasApi({ types: 'imType' }).then(res => {
    state.imType = res.data.imType || []
})

onMounted(() => {
    fetchData()
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

// 查看商户详情
const showMerchantDetail = (id) => {
    globalVBus.$emit('merchantDetailDialog', id)
}

const handleSet = () => {
    globalVBus.$emit('globalLoading', true)
    getPromoteConfig().then(res => {
        state.itemData = res.data || {}
        state.showSetDialog = true
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        globalVBus.$emit('globalLoading', false)
    })
}
</script>

<style lang="scss" scoped>
.promote-merchant-apply-list {
}
</style>

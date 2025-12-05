<template>
     <!-- 财务管理-服务器费用统计 -->
    <div class="container">
        <el-form class="filter-form" :model="state.searchForm" inline>
            <el-form-item>
            	<el-date-picker v-model="state.searchForm.receiveTime" 
            	type="month"
            	placeholder="请选择" 
            	value-format="YYYY-MM"
            	> </el-date-picker>
				<el-select  v-model="state.searchForm.cycle" clearable style="width:120px;" placeholder="请选择">
				    <el-option v-for="item in metaData.serverFeeCycle" :label="item.label" :value="item.value"></el-option>
				</el-select>
             </el-form-item>
            <el-form-item label="商户ID">
            	<el-input v-model="state.searchForm.groupId" placeholder="请输入商户ID" />
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click="fetchData('reset')">重 置</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="state.tableData" border class="table-box">
            <el-table-column prop="period" label="月份" align="center" />
            <el-table-column prop="cycle" label="周期" min-width="140" align="center" />
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
            <el-table-column prop="serverFee" label="服务器费用" min-width="120" align="center" />
            <el-table-column prop="amount" label="应扣除金额" min-width="80" align="center" />
            <el-table-column prop="actualAmount" label="实际扣除金额" min-width="100" align="center" />
            <el-table-column prop="updateTime" label="扣除时间" min-width="160" align="center" />
        </el-table>
        <Pagination v-show="!!state.total" v-model:page="state.pageConfig._page" v-model:size="state.pageConfig._size" :total="state.total"
            @pagination="fetchData"></Pagination>

    </div>
</template>

<script setup name="serverCostStatistics">
import Pagination from "@/components/Pagination/index.vue"
import { reactive, onMounted } from 'vue'
import { getServerFeeStat } from '@/api/financeManage.js'
import { commonMetasApi } from '@/api/common.js'
import { dateFormat } from "@/common/util/index.js"


const state = reactive({
    searchForm: {},
    tableData: [],
    total: 0,
    pageConfig: {
        _page: 1,
        _size: 10,
    },
	metaData: {}
})

let metaData = reactive({
    serverFeeCycle: [],
})

onMounted(() => {
    fetchData()
})

commonMetasApi({ types: 'serverFeeCycle' }).then(res => {
    metaData = Object.assign(metaData, res.data || {})
})


const fetchData = (val = '') => {
    if (val) {
        state.pageConfig._page = 1
        if (val === 'reset') {
            state.searchForm = {}
        }
    }
    let params = { ...state.pageConfig, ...state.searchForm }
	let { receiveTime } = state.searchForm
	if (receiveTime) {
		params['interval.begin'] = receiveTime
	}
	delete params.receiveTime
    globalVBus.$emit('globalLoading', true)
    getServerFeeStat(params).then(res => {
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

</script>

<style lang="scss" scoped>
</style>


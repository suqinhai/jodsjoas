<template>
    <!-- 归集订单列表 -->
    <div class="container">
        <el-form class="filter-form" inline :model="state.formData">
            <el-form-item>
                <el-date-picker style="width: 220px" v-model="state.formData.receiveTime" type="daterange" value-format="YYYY-MM-DD"
                    start-placeholder="开始时间" end-placeholder="结束时间" :disabled-date="disabledDate" :shortcuts="shortcuts" />
            </el-form-item>
            <el-form-item>
                <el-select style="width: 100px" v-model="state.queryType" @change="state.queryVal = ''">
                    <el-option v-for="item in metaData.inputTypeList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <div>
                    <el-input v-model="state.queryVal" :placeholder="placeholderLabel" v-if="state.queryType === 1" />
                    <el-input v-model="state.queryVal" @input="(val) => state.queryVal = val.replace(/\D/g,'')"
                        :placeholder="placeholderLabel" v-if="state.queryType === 2" />
                </div>
            </el-form-item>
            <el-form-item label="链上的交易ID:">
                <el-input v-model="state.formData.txId" placeholder="请输入链上的交易ID" />
            </el-form-item>
            <el-form-item label="金额范围:">
                <el-input-number style="width: 120px" v-model="state.formData.min" :controls="false" :min="0" :precision="2" placeholder="请输入最小金额" />
                <span style="margin: 0 3px">~</span>
                <el-input-number style="width: 120px" v-model="state.formData.max" :controls="false" :min="0" :precision="2" placeholder="请输入最大金额" />
            </el-form-item>
            <el-form-item label="状态:">
                <el-select v-model="state.formData.status" placeholder="请选择状态">
                    <el-option v-for="item in metaData.collectLogStatus" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click="fetchData('reset')">重 置</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('export')">导 出</el-button>
            </el-form-item>
        </el-form>
        <el-table class="table-box" :data="state.tableData" border :row-class-name="({row}) => (row.isTotal ? 'total-row' : '')">
            <el-table-column prop="txId" label="链上的交易ID" align="center" min-width="200" />
            <el-table-column label="商户ID" align="center" min-width="80">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.merchantId)">
                        {{ row.merchantId || '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="商户名称" align="center" min-width="100">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.merchantId)">
                        {{ row.name  || '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="操作时间" min-width="160" align="center" />
            <el-table-column prop="addTime" label="归集时间" min-width="160" align="center" />
            <el-table-column prop="amount" label="归集金额" min-width="100" align="center" />
            <el-table-column prop="fee" label="TRX消耗" min-width="100" align="center" />
            <el-table-column prop="fromAddr" label="充币地址" min-width="200" align="center">
                <template #default="{row}">
                    <el-button v-throttle type="primary" link @click="goAddr(row.fromAddr)">{{ row.fromAddr }}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="toAddr" label="提币地址" min-width="200" align="center" />
            <el-table-column prop="status_" label="状态" min-width="90" align="center" />
        </el-table>
        <Pagination v-show="state.total > 0" :total="state.total" v-model:size="state.listQuery._size" v-model:page="state.listQuery._page"
            @pagination="fetchData"></Pagination>
    </div>
</template>

<script setup name="usdtCollect">
import { ref, reactive, onMounted, computed } from 'vue'
import { getUsdtCollectList } from "@/api/factory.js"
import { commonMetasApi } from '@/api/common'
import { dateFormat, getShortcuts } from '@/common/util'
import Pagination from '@/components/Pagination/index.vue'

const shortcuts = getShortcuts()
const state = reactive({
    queryType: 1,
    queryVal: '',
    formData: {},
    tableData: [],
    total: 0,
    listQuery: {
        _page: 1,
        _size: 10,
    },
})
const metaData = reactive({
    inputTypeList: [
        { label: '商户账号', value: 1, placeholder: '请输入商户账号' },
        { label: '商户ID', value: 2, placeholder: '请输入商户ID' },
    ],
    collectLogStatus: []
})
const placeholderLabel = computed(() => {
    return metaData.inputTypeList.find(item => item.value === state.queryType)?.placeholder || ''
});

const disabledDate = ref((time) => {
    return time.getTime() > Date.now()
})

commonMetasApi({ types: 'collectLogStatus' }).then(res => {
    metaData.collectLogStatus = res.data.collectLogStatus
})

onMounted(() => {
    fetchData()
})

const goAddr = (addr) => {
    window.open('https://tronscan.org/#/address/' + addr, 'blank')
}

const fetchData = (val = '') => {
    if (val && val !== 'export') {
        state.listQuery._page = 1
        if (val === 'reset') {
            state.queryType = 1
            state.queryVal = ''
            state.formData = {}
            state.listQuery = {
                _page: 1,
                _size: 10,
            }
        }
    }
    let params = { ...state.listQuery, ...state.formData }
    let { receiveTime } = state.formData
    if (receiveTime && receiveTime.length) {
        params['interval.begin'] = receiveTime[0]
        params['interval.end'] = receiveTime[1]
    }
    params[state.queryType == 1 ? 'name' : 'merchantId'] = state.queryVal
    delete params.receiveTime
    if (val === 'export') params.isExport = true
    globalVBus.$emit('globalLoading', true)
    getUsdtCollectList(params).then(res => {
        if (!params.isExport) {
            let { total, list = [] } = res.data
            state.tableData = list.map(item => {
                item.addTime && (item.addTime = dateFormat(item.addTime))
                item.updateTime && (item.updateTime = dateFormat(item.updateTime))
                return item
            })
            if (state.tableData.length && res.ext) {
                let { amountSum = 0, feeSum = 0 } = res.ext
                state.tableData.unshift({ amount: amountSum, fee: feeSum, txId: '合计', isTotal: true })
            }
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
</style>

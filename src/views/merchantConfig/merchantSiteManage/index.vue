<template>
    <!-- 商户列表数据 -->
    <div class="container">
        <el-form class="filter-form" inline>
            <el-form-item>
                <el-date-picker style="width: 220px" v-model="state.searchForm.receiveTime" type="daterange" value-format="YYYY-MM-DD"
                    start-placeholder="开始时间" end-placeholder="结束时间" :disabled-date="disabledDate" :shortcuts="shortcuts" />
            </el-form-item>
            <el-form-item label="商户ID:">
                <el-input v-model="state.searchForm.groupId" style="width:120px;" placeholder="请输入商户ID" />
            </el-form-item>
            <el-form-item label="货币:">
                <el-select v-model="state.searchForm.currency" clearable style="width:120px;">
                    <el-option v-for="item in metaData.currency" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click.stop="fetchData('reset')">重 置</el-button>
            </el-form-item>
            <div style="float: right; margin-bottom:18px;">
                <el-button v-throttle type="primary" @click="exportFile">导出报表</el-button>
                <el-button v-throttle v-permiss="'admin.merchant.siteStatusMaintain'" type="primary" @click="handleMaintain">一键维护
                </el-button>
                <el-button v-throttle v-permiss="'admin.merchant.siteStatusRestore'" type="primary" @click="handleRestore('')">一键恢复
                </el-button>
            </div>
        </el-form>
        <el-table class="table-box" :data="state.tableData" @sort-change="handleTableSort" border>
            <el-table-column prop="addTime" label="创建时间" min-width="180" align="center" />
            <el-table-column label="商户ID" min-width="140" align="center">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.id)">
                        {{ row.id }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="商户名称" min-width="140" align="center">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.id)">
                        {{ row.name }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="商户后台账号" min-width="140" align="center">
                <template #default="{ row }">
                    <span>
                        {{ row.emp?.name }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="status_" label="商户状态" min-width="100" align="center" />
            <el-table-column prop="currency" label="货币" min-width="100" align="center" />
            <el-table-column prop="totalFee" label="商户费用" min-width="100" align="center" />
            <el-table-column prop="activeAmount" label="商户余额(U)" min-width="100" align="center" />
            <el-table-column prop="overdraftAmount" label="授信额度(U)" min-width="100" align="center" />
            <el-table-column prop="oweFee" label="所欠费用" min-width="120" sortable="custom" align="center" />
            <el-table-column prop="domain" label="后台域名" min-width="100" align="center" />
            <el-table-column prop="payIp" label="支付IP" min-width="140" align="center" />
            <el-table-column prop="gameFee" label="游戏抽成" min-width="100" align="center" />
            <el-table-column label="运营模式" prop="commissionMode_" width="140" align="center" />
            <el-table-column prop="totalAmount" label="可用额度(U)" min-width="100" align="center" />
            <el-table-column prop="unpaidBill" label="未结账单(U)" min-width="140" align="center" />
            <el-table-column prop="pendingBill" label="未出账单(U)" min-width="140" align="center">
                <template #default="{ row }">
                    <span class="special pointer" @click="showCdnCost(row)">
                        {{ row.pendingBill }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="vendorNum" label="商户授权厂商数" min-width="100" align="center" />
            <el-table-column prop="merchantNum" label="子站点数量" min-width="100" align="center" />
            <el-table-column prop="serverVendor_" label="所属服务器" min-width="100" align="center" />
            <el-table-column prop="provider_" label="已配置cdn" min-width="100" align="center" />
            <el-table-column label="操作" align="center" width="170" fixed="right">
                <template #default="{ row }">
                    <!-- <el-button v-throttle type="primary" v-if="row.commissionMode === 2" link @click="handleConfig(row.id)"> VIP控制余额限制</el-button> -->
                    <el-button v-throttle type="primary" v-if="row.status === 0 || row.status === 1" link @click="handleEditStatus(row,'site')">
                        修改站点状态</el-button>
                    <el-button v-throttle type="primary" v-permiss="'admin.merchant.editMerchantSiteStatus'"
                        v-if="row.status === 0 || row.status === 1" link @click="handleEditStatus(row,'merchant')">
                        修改商户状态</el-button>
                    <el-button v-throttle type="primary" v-permiss="'admin.merchant.siteStatusRestore'" v-if="row.status === -1 || row.status === -5"
                        link @click="handleRestore(row.id)">
                        恢复</el-button>
                    <el-button v-throttle type="primary" v-if="row.status !== -3 && row.status !== -99" link
                        @click="router.push('/merchant-config/merchant-edit?id=' + row.id)"> 修改配置</el-button>
                    <el-button v-throttle type="primary" v-permiss="'admin.ip.merchantEdit'" link
                        @click="showConfigPayIp(row)"> 配置支付IP</el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination v-show="!!state.total" v-model:page="state.pageConfig._page" v-model:size="state.pageConfig._size" :total="state.total"
            @pagination="fetchData">
        </Pagination>

        <SiteStatusDialog v-if="state.showStatusDialog" :itemData="state.itemData" :metaData="metaData" @close="state.showStatusDialog = false"
            @fetchData="fetchData">
        </SiteStatusDialog>
        <BalanceLimitDeploy v-if="state.showLimitDialog" :itemData="state.itemData" @close="state.showLimitDialog = false">
        </BalanceLimitDeploy>
        <CdnCostDialog :itemData="state.itemData" v-if="state.showCdnCostDialog" @close="state.showCdnCostDialog = false"></CdnCostDialog>
        <ConfigPayIpDialog ref="configPayIpDialog" v-if="state.showConfigPayIpDialog" :itemData="state.itemData" :metaData="metaData" @close="state.showConfigPayIpDialog = false"
            @fetchData="fetchData"></ConfigPayIpDialog>

        <!-- <EditControl v-if="state.showEditControl" :itemData="state.itemData" @close="state.showEditControl = false" @fetchData="fetchData"></EditControl> -->
    </div>
</template>

<script setup name="merchantSiteManage">
import { ref, reactive, onMounted, onActivated, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { getMerchantSiteListApi, restoreMerchantSiteStatusApi, maintainMerchantSiteStatusApi, getMemberRiskControlLimit } from '@/api/merchantConfig.js'
import { commonMetasApi } from '@/api/common.js'
import { dateFormat, getShortcuts, getTimezone } from '@/common/util'
import { useRouter } from 'vue-router'
const SiteStatusDialog = defineAsyncComponent(() => import("./components/SiteStatusDialog.vue"))
const BalanceLimitDeploy = defineAsyncComponent(() => import("./components/BalanceLimitDeploy.vue"))
const CdnCostDialog = defineAsyncComponent(() => import('./components/cdnCostDialog.vue'))
// const EditControl = defineAsyncComponent(() => import("./components/EditControl.vue"))
const ConfigPayIpDialog = defineAsyncComponent(() => import("./components/ConfigPayIpDialog.vue"))


const state = reactive({
    searchForm: {},
    tableData: [],
    total: 0,
    pageConfig: {
        _page: 1,
        _size: 10,
    },
    itemData: {},
    showCdnCostDialog: false,
    showStatusDialog: false,
    showLimitDialog: false,
    showConfigPayIpDialog: false,

    // showEditControl: false,
    groupId: '',
    nowTime: '',
    currencyList: [],
    isInit: true,
})
const route = useRoute()
const router = useRouter()
let metaData = reactive({
    platformSiteStatus: [],
    currency: []
})

const disabledDate = ref((time) => {
    return time.getTime() > Date.now()
})

const shortcuts = getShortcuts()

commonMetasApi({ types: 'platformSiteStatus,currency' }).then((res) => {
    metaData = Object.assign(metaData, res.data || {})
})

onMounted(() => {
    state.nowTime = route.query.nowTime
    state.groupId = route.query.groupId
    state.searchForm.groupId = state.groupId
    fetchData()
})

onActivated(() => {
    if (state.isInit) return state.isInit = false
    if ((state.groupId !== route.query.groupId) || (route.query.nowTime !== state.nowTime)) {
        state.groupId = route.query.groupId
        !!state.groupId && (state.searchForm.groupId = state.groupId)
        state.nowTime = route.query.nowTime
        fetchData('search')
    }
})


const showCdnCost = (data) => {
    state.itemData = data
    state.showCdnCostDialog = true
}
const showConfigPayIp = (data) => {
    state.itemData = data
    state.showConfigPayIpDialog = true
}


const handleTableSort = ({ column, order }) => {
    state.searchForm.sort = order === 'descending' ? 1 : order === 'ascending' ? 0 : ''
    fetchData()
}

const fetchData = (val = '') => {
    if (val) {
        state.pageConfig._page = 1
        if (val === 'reset') {
            state.searchForm = {
                groupId: state.groupId
            }
        }
    }
    let params = { ...state.pageConfig, ...state.searchForm }
    let { receiveTime } = state.searchForm
    if (receiveTime && receiveTime.length) {
        params['interval.begin'] = receiveTime[0]
        params['interval.end'] = receiveTime[1]
    }
    delete params.receiveTime
    globalVBus.$emit('globalLoading', true)
    getMerchantSiteListApi(params).then(res => {
        let { total, list = [] } = res.data
        state.tableData = list
        state.tableData.forEach(item => item.addTime = dateFormat(item.addTime))
        state.total = total || 0
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        state.tableData = []
        globalVBus.$emit('globalLoading', false)
    })
}

const exportFile = () => {
    globalVBus.$emit('globalLoading', true)
    getMerchantSiteListApi({ export: getTimezone() }, { responseType: 'blob' }).then((res) => {
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        globalVBus.$emit('globalLoading', false)
    })
}

//点击修改状态
const handleEditStatus = (row, type) => {
    row.type = type
    state.itemData = { ...row }
    state.showStatusDialog = true
}

//点击恢复
const handleRestore = (merchantId) => {
    globalVBus.$emit('globalLoading', true)
    restoreMerchantSiteStatusApi({ merchantId }).then((res) => {
        fetchData()
    }).catch(() => {
        globalVBus.$emit('globalLoading', false)
    })
}

// 一键维护
const handleMaintain = () => {
    ElMessageBox.confirm('确定对所有商户进行维护操作吗？', '一键维护')
        .then(() => {
            globalVBus.$emit('globalLoading', true)
            maintainMerchantSiteStatusApi().then((res) => {
                fetchData()
            }).catch(() => {
                globalVBus.$emit('globalLoading', false)
            })
        })
        .catch(() => { })
}

// 查看商户详情
const showMerchantDetail = (id) => {
    globalVBus.$emit('merchantDetailDialog', id)
}

// 获取商户VIP控制余额限制
const handleConfig = (id) => {
    globalVBus.$emit('globalLoading', true)
    getMemberRiskControlLimit({
        merchantId: id,
    }).then((res) => {
        state.itemData = {
            limits: res.data || [],
            id
        }
        state.showLimitDialog = true
        globalVBus.$emit('globalLoading', false)
    }).catch(() => {
        globalVBus.$emit('globalLoading', false)
    })
}

// const handleEditControl = (data)=>{
// 	state.itemData = data
// 	state.showEditControl = true
// }
</script>

<style lang="scss">
</style>

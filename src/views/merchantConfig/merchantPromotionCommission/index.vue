<template>
    <div class="container merchant-promotion-data-page">
        <el-tabs v-model="activeTab" @tab-change="fetchData('reset')">
            <el-tab-pane label="商户推广佣金数据" name="1">
                <el-form class="filter-form" :model="state.formData" inline>
                    <el-form-item>
                        <el-date-picker style="width: 220px" v-model="state.formData.receiveTime" type="daterange" value-format="YYYY-MM-DD"
                        start-placeholder="开始时间" end-placeholder="结束时间" :disabled-date="disabledDate" :shortcuts="shortcuts" />
                    </el-form-item>
                    <el-form-item label="商户ID:">
                        <el-input v-model="state.formData.merchantId" style="width:150px;" placeholder="请输入商户ID" />
                    </el-form-item>
                    <el-form-item label="介绍人商户ID:">
                        <el-input v-model="state.formData.inviteMerchantId" style="width:150px;" placeholder="请输入介绍人商户ID" />
                    </el-form-item>
                    <el-form-item label="状态:">
                        <el-select  v-model="state.formData.status" style="width:120px;">
                            <el-option v-for="item in state.statusList" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button v-throttle @click="fetchData('reset')">重 置</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button v-throttle type="primary" @click="exportFile">导出报表</el-button>
                    </el-form-item>
                </el-form>
                <div style="margin-bottom:10px;font-size:14px;">说明：此表根据配置的介绍人商户返现，对绑定的商户生成记录。</div>
                <el-table class="table-box" :data="state.tableData" border>
                    <el-table-column prop="addTime_" label="最新生成时间" min-width="160" align="center" />
                    <el-table-column label="商户ID" align="center" min-width="80">
                        <template #default="{ row }">
                            <span class="special pointer" @click="showMerchantDetail(row.merchant.id)">
                                {{ row.merchant?.id || '' }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="商户名称" align="center" min-width="140">
                        <template #default="{ row }">
                            <span class="special pointer" @click="showMerchantDetail(row.merchant.id)">
                                {{ row.merchant?.name || '' }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="inviteMerchantId" label="介绍人商户ID" min-width="110" align="center" />
                    <el-table-column prop="openRebate" label="开版返现额度" min-width="120"  align="center" />
                    <el-table-column prop="rate" label="月贡献返现比例(%)" min-width="140"  align="center" />
                    <el-table-column prop="billFee" label="月贡献返现额度" min-width="120" align="center" />
                    <el-table-column prop="billRebate" label="总返现额度" min-width="120" align="center" />
                    <el-table-column prop="inviteRegion_" label="介绍人运营地区" min-width="120" align="center" />
                    <el-table-column prop="updateTime_" label="审核时间" min-width="160" align="center" />
                    <el-table-column prop="status_" label="状态" min-width="100" align="center" />
                    <el-table-column prop="remark" label="备注" min-width="120" align="center" />
                    <el-table-column label="操作人" align="center" min-width="140">
                        <template #default="{ row }">
                            <span>
                                {{ row.emp?.name || '' }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" min-width="160" align="center">
                        <template #default="{ row }">
                            <el-button type="primary" link v-if="row.status === 2" @click="showAuditConfig(row)">审核</el-button>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="商户推广佣金配置" name="2">
                <el-form class="filter-form" :model="state.searchForm" inline>
                    <el-form-item>
                        <el-date-picker style="width: 220px" v-model="state.formData.receiveTime" type="daterange" value-format="YYYY-MM-DD"
                        start-placeholder="开始时间" end-placeholder="结束时间" :disabled-date="disabledDate" :shortcuts="shortcuts" />
                    </el-form-item>
                    <el-form-item label="介绍人商户ID:">
                        <el-input v-model="state.formData.merchantId" style="width:150px;" placeholder="请输入介绍人商户ID" />
                    </el-form-item>
                    <el-form-item>
                        <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button v-throttle @click="fetchData('reset')">重 置</el-button>
                    </el-form-item>
                </el-form>
                <div style="margin-bottom:10px;font-size:14px;">说明：修改佣金配置后，从最近一次未发放的奖励开始生效</div>
                <el-table class="table-box" :data="state.tableData" border>
                    <el-table-column prop="addTime" label="商户创建时间" min-width="140" align="center" />
                    <el-table-column label="商户ID" align="center" min-width="80">
                        <template #default="{ row }">
                            <span class="special pointer" @click="showMerchantDetail(row.merchant.id)">
                                {{ row.merchant?.id || '' }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="inviteMerchantId" label="介绍人商户ID"  align="center" />
                    <el-table-column prop="inviteRegion" label="运营地区"  align="center" />
                    <el-table-column prop="rate" label="月贡献返现比例(%)"  align="center" />
                    <el-table-column label="操作" min-width="160" align="center">
                        <template #default="{ row }">
                            <el-button type="primary" link @click="showEditConfig(row)">修改</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
        <Pagination v-show="state.total > 0" :total="state.total" v-model:size="state.listQuery._size" v-model:page="state.listQuery._page"
            @pagination="changePage"></Pagination>
        <EditDialog @close="state.showEditDialog = false" :item="state.currentItem" @refresh="fetchData" v-if="state.showEditDialog"></EditDialog>
        <AuditDialog @close="state.showAuditDialog = false" :item="state.currentItem" @refresh="fetchData" v-if="state.showAuditDialog"></AuditDialog>
    </div>
</template>

<script setup>
    import { ref, reactive, defineAsyncComponent, onMounted } from 'vue'
    import { dateFormat, getShortcuts, getTimezone } from '@/common/util'
    import Pagination from '@/components/Pagination/index.vue'
    import { inviteConfigs, reviewList } from '@/api/merchantConfig.js'
    import { commonMetasApi } from '@/api/common.js'
    const EditDialog = defineAsyncComponent(()=> import('./components/editDialog.vue'))
    const AuditDialog = defineAsyncComponent(()=> import('./components/auditDialog.vue'))
    const activeTab = ref('1')
    const state = reactive({
        searchForm:{},
        formData: {},
        tableData: [],
        statusList:[{label:'已生效',value:1}],
        total: 100,
        listQuery: {
            _page: 1,
            _size: 10,
        },
        merchantDetailShow: false,
        merchantId: '',
        showEditDialog:false,
        showAuditDialog:false,
        currentItem:''
    })

    const disabledDate = ref((time) => {
        return time.getTime() > Date.now()
    })

    const shortcuts = getShortcuts()

    // 查看商户详情
    const showMerchantDetail = (id) => {
        globalVBus.$emit('merchantDetailDialog', id)
    }

    const changePage = ()=> {
        fetchData()
    }

    const showAuditConfig = (item)=> {
        state.showAuditDialog = true
        state.currentItem = item
    }

    const showEditConfig = (item)=> {
        state.showEditDialog = true
        state.currentItem = item
    }

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
        let api = activeTab.value == '1'?reviewList:inviteConfigs
        api(params).then(res => {
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

    const exportFile = () => {
        globalVBus.$emit('globalLoading', true)
        reviewList({ export: getTimezone() }, { responseType: 'blob' }).then((res) => {
            globalVBus.$emit('globalLoading', false)
        }).catch(err => {
            globalVBus.$emit('globalLoading', false)
        })
    }

    onMounted(async ()=> {
        fetchData()
        const { code, data } = await commonMetasApi({ types: 'rewardStatus' })
        if (code == 0) {
            state.statusList = data.rewardStatus.filter(item => item.value > 1)
            state.statusList.unshift({
                label:'全部',
                value:' '
            })
        }
    })
</script>

<style lang="scss">
.merchant-promotion-data-page {
    .el-tabs {
        flex:1;
        overflow: hidden;
        .el-tabs__content {
            height:calc(100% - 55px);
            overflow-y: hidden;
            .el-tab-pane {
                height: 100%;
                display: flex;
                flex-direction: column;
            }
        }
    }
}
</style>
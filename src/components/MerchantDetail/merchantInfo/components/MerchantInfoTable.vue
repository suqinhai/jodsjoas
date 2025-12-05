<template>
    <div>
        <div class="merchant-info-main">
            <el-row>
                <el-col :span="12">
                    <div class="title">
                        商户名称：{{state.merchantData.site && state.merchantData.site.name ? state.merchantData.site.name : ''}}
                        <el-button v-throttle type="primary" style="margin-left: 20px;" text
                            v-if="state.merchantData.site && state.merchantData.site.id && userData.isHasPermiss('admin.emp.edit')"
                            @click="emits('editPassword',{ data: state.merchantData.site, key: 'editPasswordShow'})">修改密码
                        </el-button>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="title">注册时间：{{state.merchantData.addTime ? dateFormat(state.merchantData.addTime) : ''}}</div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <div class="title">会员数：{{state.merchantData.userCount}}</div>
                </el-col>
                <el-col :span="12">
                    <div class="title">累计充值(U)：{{state.merchantData.totalRecharge}}</div>
                </el-col>
            </el-row>
        </div>

        <div class="head">商户额度</div>
        <el-table :data="state.siteData" style="width: 100%" border>
            <el-table-column prop="id" label="商户ID" min-width="60" align="center" />
            <el-table-column prop="name" label="商户名称" min-width="100" align="center" />
            <el-table-column label="可用额度(U)" min-width="100" align="center">
                <template #default="{ row }">
                    <span style="color: red">{{row.totalAmount}}</span>
                </template>
            </el-table-column>
            <el-table-column label="商户余额(U)" min-width="100" align="center">
                <template #default="{ row }">
                    <span style="color: red">{{row.activeAmount}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="overdraftAmount" label="授信额度(U)" min-width="100" align="center" />
            <el-table-column label="未结账单(U)" min-width="100" align="center">
                 <template #default="{ row }">
                    <span class="special pointer" @click="goBillCheck(row)">{{row.unpaidBill}}</span>
                </template>
            </el-table-column>
            <el-table-column label="未出账单(U)" min-width="100" align="center">
                <template #default="{ row }">
                    <span class="special pointer" @click="state.showBillTable = true">{{row.pendingBill}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="后台域名" min-width="100" align="center">
                <template #default="{ row }">
                    <div>主：{{row.openAccount}}</div>
                    <div>副：{{row.openAccount}}</div>
                </template>
            </el-table-column> -->
            <el-table-column prop="status_" label="站点状态" width="100" align="center" />
            <el-table-column prop="riskStatus_" label="风控" width="100" align="center" />
<!-- 			<el-table-column prop="updateTime" label="操作时间" align="center" min-width="100">
			    <template #default="{ row }">
			        <span>{{ row.updateTime && dateFormat(row.updateTime) }}</span>
			    </template>
			</el-table-column> -->
        </el-table>

        <div class="head">商户信息</div>
        <el-table :data="state.infoData" style="width: 100%" border>
            <el-table-column prop="openFee" label="开站费" min-width="100" align="center" />
            <el-table-column prop="lineCost" label="线路费用" min-width="90" align="center" />
            <el-table-column prop="monthMin" label="游戏月保底" min-width="100" align="center" />
            <el-table-column prop="zone" label="时区" min-width="140" align="center" />
            <el-table-column prop="languages" label="客户端语言" min-width="140" align="center" />
            <el-table-column prop="currency" label="币种" min-width="100" align="center" />
            <el-table-column prop="serverVendor" label="OSS数据中心" min-width="100" align="center" />
            <el-table-column prop="commissionMode" label="RTP抽成模式" min-width="100" align="center" />
        </el-table>
    </div>
    <PendingBillTable v-if="state.showBillTable"  @close="state.showBillTable = false" @showUnPendingDialog="showUnPending"></PendingBillTable>
    <PendingBilldetail v-if="state.showDetail" :item="state.currentItem" @close="state.showDetail = false"></PendingBilldetail>
</template>

<script setup>
import { reactive, onMounted, inject, defineAsyncComponent } from 'vue'

import userStore from '@/store/user'
import { getMerchantInfoData } from '@/api/dataCenter.js'
import { dateFormat } from '@/common/util'
import commonStore from '@/store/common'
import { useRouter } from "vue-router"
const router = useRouter()
const commonData = commonStore()
const PendingBillTable = defineAsyncComponent(() => import("./PendingBillTable.vue"))
const PendingBilldetail = defineAsyncComponent(() => import("./PendingBilldetail.vue"))

const emits = defineEmits(['editPassword'])
const provideData = inject('provideData')
const state = reactive({
    merchantData: {},
    siteData: [],
    infoData: [],
    showBillTable: false,
    showDetail: false,
    currentItem: {},
    commissionMode: ''
})
const userData = userStore()

onMounted(() => {
    fetchData()
})

// 表格过滤数据处理
const fetchData = () => {
    provideData.showLoading()
    getMerchantInfoData({ merchantId: provideData.merchantId }).then(({ data, code }) => {
        if (code === 0 && data) {
            state.merchantData = data
            data.site && state.siteData.push(data.site)
            data.info && state.infoData.push(data.info)
            state.commissionMode = data.site.commissionMode
            commonData.activeMerchantId = data?.groupId || ''
        }
        provideData.hideLoading()
    }).catch(err => {
        state.tableData = []
        provideData.hideLoading()
    })
}
const showUnPending = (item) => {
    state.showDetail = true
    state.currentItem = item
    state.currentItem.commissionMode = state.commissionMode
}
const goBillCheck = (item) => {
    if (item.unpaidBill === 0) return;
    commonData.merchantDetailShow = false;
    router.push({
        path: '/data-center/merchant-bill-check',
        query: {
            merchantId: item.id
        }
    });
};
</script>

<style lang="scss">
.merchant-info {
    .merchant-info-main {
        .title {
            line-height: 30px;
            color: #666;
        }
    }
    .head {
        font-size: 16px;
        line-height: 30px;
        color: #666;
        margin-top: 15px;
    }
}
</style>

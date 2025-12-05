<template>
    <div class="container domain-manage">
        <el-tabs v-model="type">
            <el-tab-pane v-for="(item,index) in showTabList" :key="index" :label="item.title" :name="item.value">
            </el-tab-pane>
        </el-tabs>
        <div class="domain-manage-main">
            <DomainManageTable :metaData="metaData" :asBack="0" v-show="type === 0"></DomainManageTable>
            <DomainManageTable :metaData="metaData" :asBack="1" v-show="type === 1"></DomainManageTable>
			<DomainManageTable :metaData="metaData" :asBack="2" v-show="type === 10"></DomainManageTable>
            <keep-alive>
                <!-- <WithdrawalAccount v-if="type === 2"></WithdrawalAccount>
        <AccountTransaction v-if="type === 3"></AccountTransaction>
        <BetStatistics v-if="type === 4"></BetStatistics>
        <MemberMessage v-if="type === 5"></MemberMessage>
        <MemberLog v-if="type === 6"></MemberLog>
        <RelevancyAccount :metaData="metaData" v-if="type === 7"></RelevancyAccount> -->
            </keep-alive>
        </div>
    </div>
</template>

<script setup name="domainManage">
import { reactive, defineAsyncComponent, ref, computed, onMounted } from 'vue'
import userStore from '@/store/user'
import { commonMetasApi } from '@/api/common.js'
const DomainManageTable = defineAsyncComponent(() => import('./domainManageTable/index.vue'))

const tabData = [
    { title: '前台域名管理', value: 0, permissionCode: '' },
    { title: '后台域名管理', value: 1, permissionCode: 'admin.domain.list-1' },
    { title: 'WEB大厅', value: 2, permissionCode: '' },
    { title: 'APP大厅', value: 3, permissionCode: '' },
    { title: '下载站域名', value: 4, permissionCode: '' },
    { title: '支付域名', value: 5, permissionCode: '' },
    { title: '自定义解析', value: 6, permissionCode: '' },
    { title: '流量统计', value: 7, permissionCode: '' },
    { title: 'CDN网络质量', value: 8, permissionCode: '' },
    { title: '证书管理', value: 9, permissionCode: '' },
	{ title: '推广域名', value: 10, permissionCode: 'admin.domain.list-2' },
]
const type = ref(0)
let metaData = reactive({
    riskTag: [],
    autoLayer: [],
    botSpyType: [],
    botSpyPunish: [],
    balanceAdjustType: [],
})
const userData = userStore()

const showTabList = computed(() => {
    return tabData.filter(item => item.value === 0 || userData.isHasPermiss(item.permissionCode))
})

onMounted(() => {
    type.value = showTabList.value[0] ? showTabList.value[0].value : 0
})

commonMetasApi({ types: 'dnsProvider' }).then(res => {
    metaData = Object.assign(metaData, res.data || {})
})
</script>

<style lang="scss">
.domain-manage-main {
    height: 100%;
    height: calc(100% - 50px);
}
</style>

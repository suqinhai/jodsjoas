<template>
    <div class="merchant-detail">
        <Dialog v-if="showTabList.length" ref="dialog" width="1100" title="商户信息" :isShowSubmit="false" top="2vh" @cancel="cancel">
            <div class="dialog-main">
                <el-tabs v-model="state.type">
                    <el-tab-pane v-for="(item,index) in showTabList" :key="index" :label="item.title" :name="item.id">
                    </el-tab-pane>
                </el-tabs>
                <MerchantInfo v-if="state.type === 1" @showDialog="showDialog">
                </MerchantInfo>
                <BillChangeRecord v-if="state.type === 2"></BillChangeRecord>
                <VenderRecord v-if="state.type === 3"></VenderRecord>
                <RechargeRecord v-if="state.type === 4"></RechargeRecord>
                <subsiteNumberRecord v-if="state.type === 5"></subsiteNumberRecord>
            </div>
        </Dialog>

        <EditPasswordDialog v-if="state.editPasswordShow" :merchantData="state.itemData" @close="state.editPasswordShow = false">
        </EditPasswordDialog>
    </div>
</template>

<script setup>
import Dialog from '@/components/Dialog/index.vue'
import { defineAsyncComponent, reactive, ref, defineProps, provide, defineEmits, computed, onMounted } from 'vue'
import userStore from '@/store/user'
import commonStore from '@/store/common'
const MerchantInfo = defineAsyncComponent(() => import('./merchantInfo/index.vue'))
const BillChangeRecord = defineAsyncComponent(() => import('./billChangeRecord/index.vue'))
const VenderRecord = defineAsyncComponent(() => import('./venderRecord/index.vue'))
const RechargeRecord = defineAsyncComponent(() => import('./rechargeRecord/index.vue'))
const EditPasswordDialog = defineAsyncComponent(() => import('./components/EditPasswordDialog.vue'))
const subsiteNumberRecord = defineAsyncComponent(() => import('./subsiteNumber/index.vue'))

const emits = defineEmits(['resetData', 'close'])
const props = defineProps({
    tabType: {
        type: Number || String,
    },
})
const tabData = [
    { title: '商户明细', id: 1, permissionCode: 'admin.merchant.detail' },
    { title: '账变记录', id: 2, permissionCode: 'admin.merchant-account.accountLogList' },
    { title: '厂家记录', id: 3, permissionCode: 'admin.game-play-log.merchantStat' },
    { title: '充值记录', id: 4, permissionCode: 'merchant.merchant-recharge.list' },
    { title: '子站点', id: 5, permissionCode: 'admin.merchant.infoList' }
]
const state = reactive({
    type: 1,
    itemData: {},
    editPasswordShow: false,
})
const dialog = ref(null)
const userData = userStore()
const commonData = commonStore()

const showTabList = computed(() => {
    return tabData.filter(item => userData.isHasPermiss(item.permissionCode) || userData.isHasMenuPermiss(item.permissionCode))
})

onMounted(() => {
    state.type = props.tabType || (showTabList.value[0] ? showTabList.value[0].id : '')
})

// 展示弹窗
const showDialog = (val) => {
    let { key, data } = val
    state[key] = true
    state.itemData = data
}

const cancel = () => {
    commonData.merchantDetailShow = false
    emits('close')
}

provide('provideData', {
    'merchantId': commonData.merchantId,
    'showLoading': () => dialog.value.showLoading(),
    'hideLoading': () => dialog.value.closeLoading(),

})
</script>

<style lang="scss">
.merchant-detail {
    .dialog-main {
        margin-top: -10px;
    }
}
</style>

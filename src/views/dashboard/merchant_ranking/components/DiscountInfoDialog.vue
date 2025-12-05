<template>
    <!-- 首页-商户排行-商户优惠总赠送 -->
    <div>
        <Dialog ref="dialog" width="500" title="商户优惠总赠送" :isShowSubmit="false" top="10vh" @cancel="emits('close')">
            <el-table :data="state.tableData" border>
                <el-table-column prop="name" label="优惠类型" min-width="100" align="center" />
                <el-table-column label="数据" min-width="200" align="center">
                    <template #default="{ row }">
                        <span v-if="!row.isHaveInfo || !row.value">{{ row.value }}</span>
                        <span v-else class="special pointer" @click="state.showInfoDialog = true">
                            {{ row.value }}
                        </span>
                    </template>
                </el-table-column>
            </el-table>
        </Dialog>

        <ActivityDiscountDialog v-if="state.showInfoDialog" :itemData="state.initData" @close="state.showInfoDialog = false">
        </ActivityDiscountDialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineAsyncComponent } from "vue"
import { getMerchantDiscountData } from '@/api/dashboard'
const ActivityDiscountDialog = defineAsyncComponent(() => import("./ActivityDiscountDialog.vue"))

const keyObj = {
    'promotion': '活动',
    'task': '任务',
    'rebate': '返水',
    'commission': '返佣',
    'vipReward': 'VIP奖励',
    'rechargeDiscount': '充值优惠',
    'income': '余额宝',
    'ticket': '票券',
}
const emits = defineEmits(['close'])
const props = defineProps({
    itemData: {
        type: Object,
        default: {}
    },
})
const state = reactive({
    tableData: [],
    showInfoDialog: false,
    initData: {}
})
const dialog = ref(null)

onMounted(() => {
    fetchData()
})

const fetchData = () => {
    let params = { ...props.itemData }
    let { receiveTime } = params
    if (receiveTime && receiveTime.length) {
        params['interval.begin'] = receiveTime[0]
        params['interval.end'] = receiveTime[1]
    }
    delete params.receiveTime
    dialog.value.showLoading()
    getMerchantDiscountData(params).then(({ data = {} }) => {
        state.initData = { ...data }
        state.tableData = []
        Object.keys(keyObj).forEach(item => {
            state.tableData.push({
                name: keyObj[item],
                value: data[item] || 0,
                isHaveInfo: item === 'promotion'
            })
        })
        dialog.value.closeLoading()
    }).catch(err => {
        state.tableData = []
        dialog.value.closeLoading()
    })
}
</script>

<style lang="scss">
</style>

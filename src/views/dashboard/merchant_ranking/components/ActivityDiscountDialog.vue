<template>
    <!-- 首页-商户排行-商户优惠总赠送-商户活动赠送 -->
    <Dialog width="500" title="商户活动赠送" :isShowSubmit="false" top="10vh" @cancel="emits('close')">
        <el-table :data="state.tableData" border :row-class-name="({row,rowIndex}) => (!rowIndex ? 'total-row': '')">
            <el-table-column prop="name" label="活动名称" min-width="100" align="center" />
            <el-table-column prop="value" label="赠送金额" min-width="180" align="center" />
        </el-table>
    </Dialog>
</template>

<script setup>
import { reactive, onMounted } from "vue"

const keyObj = {
    'promotion': '汇总',
    'promoSign': '签到',
    'promoRelief': '救援金',
    'promoTurntable': '幸运转盘',
    'promoRedEnvelope': '红包',
    'promoAgent': '推广',
    'promoChallengeInvite': '闯关邀请',
    'promoReliefBalance': '余额救援金',
    'promoRecharge': '充值',
    'promoPlay': '打码',
    'promoRedeemCode': '新人彩金',
    'promoCustom': '自定义',
    'promoRank': '排行榜',
    // 'turntableReward': '奖金转盘',
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
})

onMounted(() => {
    Object.keys(keyObj).forEach(item => {
        state.tableData.push({
            name: keyObj[item],
            value: props.itemData[item] || 0,
        })
    })
})
</script>

<style lang="scss">
</style>

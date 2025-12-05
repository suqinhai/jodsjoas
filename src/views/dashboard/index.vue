<template>
    <div class="container dashboard">
        <Overview></Overview>
        <GameBill :venderList="venderList"></GameBill>
        <GameBet :venderList="venderList"></GameBet>
        <MerchantRanking></MerchantRanking>
    </div>
</template>

<script setup name="dashboard">
import { ref, defineAsyncComponent, onBeforeMount } from 'vue'
import { commonMetasApi } from '@/api/common'
const Overview = defineAsyncComponent(() => import("./overview/index.vue"))
const GameBill = defineAsyncComponent(() => import("./game_bill/index.vue"))
const GameBet = defineAsyncComponent(() => import("./game_bet/index.vue"))
const MerchantRanking = defineAsyncComponent(() => import("./merchant_ranking/index.vue"))

const venderList = ref([])

onBeforeMount(async () => {
    try {
        globalVBus.$emit('globalLoading', true)
        const res = await commonMetasApi({ types: 'gameVendor' })
        venderList.value = res.data?.gameVendor || []
        globalVBus.$emit('globalLoading', false)
    } catch (error) {
        globalVBus.$emit('globalLoading', false)
    }
})
</script>

<style lang="scss">
.dashboard {
    display: flex;
    flex-direction: column;
    color: var(--el-text-color-regular, #606266);

    .head {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .foot {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-top: 10px;
        .title {
            margin-right: 10px;
        }
    }
}
</style>

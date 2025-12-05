<template>
    <div class="merchant-info">
        <MerchantInfoTable @editPassword="editPassword"></MerchantInfoTable>
<!--        <GameShareTable v-if="userData.isHasPermiss('admin.merchant.gameShare')"></GameShareTable> -->
    </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import userStore from '@/store/user'
// const GameShareTable = defineAsyncComponent(() => import('./components/GameShareTable.vue'))
const MerchantInfoTable = defineAsyncComponent(() => import('./components/MerchantInfoTable.vue'))

const emits = defineEmits(['showDialog'])
const userData = userStore()

const editPassword = (val) => {
    emits('showDialog', val)
}
</script>

<style lang="scss">
.merchant-info {
    .merchant-info-main {
        .title {
            line-height: 24px;
            color: #666;
        }
    }
    .head {
        font-size: 18px;
        line-height: 30px;
        color: #666;
        margin-top: 15px;
    }
}
</style>

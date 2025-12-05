<template>
    <!-- 商户支付方式开关-商户支付方式 -->
    <div class="tabs-main payment-method-list">
        <div class="title">1类</div>
        <div class="main-box">
            <div class="main-box-small" v-for="item in (payChannelList[1] || [])" :key="item.value">{{item.label}}</div>
        </div>
        <div class="title" style="margin-top: 20px;" v-if="payChannelList[2]?.length">2类</div>
        <div class="main-box" v-if="payChannelList[2]?.length">
            <div class="main-box-small" v-for="item in (payChannelList[2] || [])" :key="item.value">{{item.label}}</div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    payChannelList: {
        type: Object,
        default: () => {
            return {}
        }
    }
})
</script>

<style lang="scss">
.payment-method-list {
    overflow-y: auto;
    .title {
        font-size: 24px;
        font-weight: 600;
    }
    .main-box {
        font-size: 16px;
        display: flex;
        flex-wrap: wrap;
        &-small {
            text-align: center;
            width: 100px;
            padding: 15px;
        }
    }
}
</style>

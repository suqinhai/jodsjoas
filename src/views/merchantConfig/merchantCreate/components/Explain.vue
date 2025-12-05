<template>
    <!-- 创建账号-说明-->
    <Dialog width="880" title="操作引导：" top="10vh" :isShowBottomButton="false" @cancel="emits('close')">
        <div class="explain-box">
            <div class="small-box" v-for="(item,index) in showData" :key="index">
                <span class="label">{{item.title}}</span>
                <span class="text">{{item.text}}</span>
            </div>
			<img src="@/assets/img/telegram.jpg" alt="" class="img">
        </div>
    </Dialog>
</template>

<script setup>
const emits = defineEmits(['close'])

const showData = [
    { title: '', text: '1.搜索添加：@MerchantsNotifyBot' },
    { title: '', text: '2.点击/start，接收通知' },
]
</script>

<style lang="scss">
.explain-box {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    .small-box {
        font-size: 16px;
        line-height: 24px;
        .label {
            color: #666;
        }
        .text {
            color: #999;
        }
        &--active {
            margin-top: 10px;
        }
    }
	.img{
		width: 750px;
	}
}
</style>

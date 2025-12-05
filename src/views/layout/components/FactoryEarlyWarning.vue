<template>
    <Dialog ref="dialog" width="600" :isShowSubmit="false" buttonCenter submitButtonTitle="知道了" title="提醒" top="10vh" @cancel="cancel">
        <div class="title">
            游戏厂家
            <span class="name">{{ itemData.vendor }}</span>
            当前分过低，快去上分吧。
        </div>
        <div class="check-box">
            <el-checkbox v-model="checked">勾选后，本日将不再提醒</el-checkbox>
        </div>
    </Dialog>
</template>

<script setup>
import { ref } from 'vue'
import { dateFormat } from '@common/util'

const emits = defineEmits(['close', 'showNext', 'showMemberInfo'])
const props = defineProps({
    itemData: {
        type: Object,
        default: () => {
            return {}
        }
    }
})
const checked = ref(false)

const cancel = () => {
    if (checked.value) {
        let time = new Date(dateFormat(Date.now(), 'YYYY-MM-DD') + ' 23:59:59').getTime()
        localStorage.setItem('current_day_latest_time', time)
    } else {
        localStorage.removeItem('current_day_latest_time')
    }
    emits('close')
    emits('showNext')
}

</script>

<style lang="scss" scoped>
.title {
    width: 100%;
    text-align: center;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 20px;

    .name {
        color: #409eff;
        padding: 0 10px;
    }
}

.check-box {
    width: 100%;
    display: flex;
    justify-content: center;
}
</style>


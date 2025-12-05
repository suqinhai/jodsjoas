
<template>
    <div class="dialogHook">
        <el-dialog :top="top" :title="title" v-model="isShowDialog" :width="width" :append-to-body="appendToBody"
            :close-on-click-modal="clickModalClose" modal-class="dialog-hook" :close-on-press-escape="pressEscClose"
            :show-close="showClose" :draggable="draggable" :center="isCenter" destroy-on-close @close="handleCancel">
            <div class="dialogContent">
                <slot></slot>
            </div>
            <template #footer>
                <!-- dialog_footer_btn isCenterBtn -->
                <div :class="isCenterBtn ? 'isCenterBtn' : 'dialog_footer_btn '">
                    <el-button v-throttle @click="handleCancel">{{ showConfirmBtn ? cancelText : '关闭' }}</el-button>
                    <div class="other_btn" style="display: inline-block;" v-if="otherBtn.length > 0">
                        <el-button v-throttle v-for="item in otherBtn" :key="item" :type="item.type"
                            @click="handleClick(item.value)">
                            {{ item.label }}</el-button>
                    </div>
                    <el-button v-throttle type="primary" @click="handleConfirm" style="margin-left: 20px" :loading="loading"
                        v-if="showConfirmBtn">{{
            confirmText
          }}</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
const props = defineProps({
    //标题
    title: {
        type: String,
        default: () => "新增",
    },

    //取消按钮描述文字
    cancelText: {
        type: String,
        default: () => "取消",
    },

    //确认按钮描述文字
    confirmText: {
        type: String,
        default: () => "提交",
    },

    //弹窗宽度
    width: {
        type: String,
        default: () => "800px",
    },

    //距离浏览器顶部宽度
    top: {
        type: String,
        default: () => "15vh",
    },

    //是否为二级弹窗
    appendToBody: {
        type: Boolean,
        default: () => false,
    },

    //点击遮罩层关闭弹窗
    clickModalClose: {
        type: Boolean,
        default: () => false,
    },

    //按压ESC按关闭弹窗
    pressEscClose: {
        type: Boolean,
        default: () => false,
    },

    // 是否显示关闭按钮
    showClose: {
        type: Boolean,
        default: () => true,
    },

    // 是否显示确认按钮
    showConfirmBtn: {
        type: Boolean,
        default: () => true,
    },

    //是否可拖拽
    draggable: {
        type: Boolean,
        default: () => false,
    },

    //弹窗脚部头部是否居中
    isCenter: {
        type: Boolean,
        default: () => false,
    },

    //弹窗按钮是否居中
    isCenterBtn: {
        type: Boolean,
        default: () => false,
    },
    //底部含有多个操作按钮
    otherBtn: {
        type: Array,
        default: () => [],
    },
});
const emits = defineEmits(["close", "confirm", 'otherEvent']);
import { useIndexHook } from "./index.js";
const {
    isShowDialog,
    loading,
    handleConfirm,
    handleCancel,
    showLoading,
    closeLoading,
    handleClick
} = useIndexHook(emits);

defineExpose({
    showLoading,
    closeLoading,
});
</script>

<style lang="scss" scoped>
// .dialogContent {
//     width: 100%;
//     height: 100%;
// }
// .isCenterBtn {
//     display: flex;
//     flex-direction: row;
//     flex-wrap: nowrap;
//     justify-content: center;
// }
// .other_btn {
//     margin: 0 10px;
// }
// :deep(.el-dialog__body) {
//     border-top: 1px solid #ebeef5;
//     box-sizing: border-box;
// }
</style>

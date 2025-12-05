<!--
 * @Author: liqijiang 3045273238@qq.com
 * @Date: 2023-09-07 12:54:57
 * @LastEditors: yilaisai
 * @LastEditTime: 2023-12-13 19:36:33
-->
<template>
    <el-dialog :close-on-press-escape="escClose" v-model="isShowDialog" destroy-on-close :title="title" :width="width"
        :draggable="draggable" :close-on-click-modal="modelClose" modal-class="dialog-hook" :append-to-body="appendToBody"
        :top="top">
        <slot></slot>
        <template #footer>
            <span class="dialog-footer">
                <el-button v-throttle @click="closeDialog">{{isShowSubmitBtn ? '取消' : '关闭' }}</el-button>
                <el-button v-throttle v-if="isShowOtherBtn" @click="handleFn" :loading="loading" type="primary">
                    {{ otherBtnText }}
                </el-button>
                <el-button v-throttle v-if="isShowSubmitBtn" type="primary" style="margin-left: 20px" @click="onSubmit"
                    :loading="loading">{{
          confirmText
        }}</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { useFormDialogHook } from "./useFormDialogHook.js";
const props = defineProps({
    modelClose: {
        type: Boolean,
        default: () => false,
    },
    escClose: {
        type: Boolean,
        default: () => false,
    },
    title: {
        type: String,
    },
    confirmText: {
        type: String,
        default: "提交",
    },
    width: {
        type: String,
        default: "800px",
    },
    draggable: {
        type: Boolean,
        default: () => false,
    },
    appendToBody: {
        type: Boolean,
        default: () => false,
    },
    top: {
        type: String,
        default: "15vh",
    },
    isShowSubmitBtn: {
        type: Boolean,
        default: () => true,
    },
    isShowOtherBtn: {
        type: Boolean,
        default: () => false,
    },
    otherBtnText: {
        type: String,
        default: () => "",
    },
});
const emits = defineEmits(["onSubmit", "otherBtn"]);
const {
    isShowDialog,
    openDialog,
    closeDialog,
    onSubmit,
    loading,
    openLoading,
    closeLoading,
    handleFn,
} = useFormDialogHook(emits, props);
defineExpose({
    openDialog,
    closeDialog,
    openLoading,
    closeLoading,
});
</script>

<style lang="scss">
// .el-dialog {
//     min-width: 600px;
// }
// .el-dialog__body {
//     border-top: 1px solid #ebeef5;
//     box-sizing: border-box;
// }
</style>

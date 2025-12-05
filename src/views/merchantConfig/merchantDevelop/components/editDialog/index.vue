<template>
    <Dialog title="修改商户等级配置" ref="editFormRef" @close="emits('close')" @confirm="handleConfirm">
        <el-form :model="editForm" ref="editFormRef" :rules="rules">
            <el-form-item label="累积充值(单位u)：" prop="totalRecharge">
                <el-input v-model="editForm.totalRecharge"></el-input>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script setup>
import { useIndexHook } from "./index.js";
import Dialog from "@/components/dialogHook/index.vue";

const props = defineProps({
    editForm: {
        type: Object,
        default: () => { },
    },
});
const emits = defineEmits(["close", "update:editForm", "confirm"]);
const { handleConfirm, editFormRef, rules } = useIndexHook(props, emits);
</script>

<style lang="scss" scoped></style>

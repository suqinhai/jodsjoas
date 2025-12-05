<template>
    <div class="editDialog">
        <Dialog title="修改商户短信配置" @close="emits('close')" @confirm="handleConfirm">
            <el-form :model="editForm" ref="formRef" :rules="rules" label-width="120px">
                <el-form-item label="商户ID：">
                    <span>{{ editForm.id }}</span>
                </el-form-item>
                <el-form-item label="短信供应商：" prop="smsVendor">
                    <el-select v-model="editForm.smsVendor" placeholder="请选择短信供应商">
                        <el-option v-for="item in msgProvideList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-for="(item, index) in editForm.props" :key="item" :label="`${item.label}：`"
                    :prop="'props.' + index + '.value'" :rules="[{ required: item.required, message: '必填项不可为空',trigger: 'blur'}]">
                    <el-input v-model="item.value"></el-input>
                </el-form-item>
            </el-form>
        </Dialog>
    </div>
</template>

<script setup>
import Dialog from "@/components/dialogHook/index.vue";
import { useIndexHook } from "./index.js";
const emits = defineEmits(["close", "update:editForm", "confirm"]);
const props = defineProps({
    editForm: {
        type: Object,
        default: () => { },
    },
    msgProvideList: {
        type: Array,
        default: () => [],
    },
    merchantSmsConfigAttrs: {
        type: Array,
        default: () => [],
    },
});
const { formRef, rules, handleConfirm } = useIndexHook(props, emits);
</script>

<style lang="scss" scoped></style>


<template>
    <Dialog ref="dialog" :title="(operateType ? '创建' : '修改') + '商户费用设置'" width="400" @cancel="emits('close')" @close="emits('close')" @confirm="handleConfirm(dialog)">
        <el-form :model="form" ref="formRef" label-width="120px" :rules="rules">
            <el-form-item label="商户ID:" prop="merchantId">
                <el-input-number :disabled="!operateType" v-model="form.merchantId" :controls="false" :precision="0" :min="1"
                    :placeholder="'请输入商户ID'" />
            </el-form-item>
            <el-form-item label="开版费U:" prop="openFee">
                <el-input-number v-model="form.openFee" :controls="false" :precision="0" :min="0" :placeholder="'请输入开版费'" />
            </el-form-item>
            <el-form-item label="线路费用:" prop="lineCost">
                <el-input-number v-model="form.lineCost" :controls="false" :precision="0" :min="0" :placeholder="'请输入线路费用'" />
            </el-form-item>
            <el-form-item label="游戏月保底:" prop="monthMin">
                <el-input-number v-model="form.monthMin" :controls="false" :precision="0" :min="0" :placeholder="'请输入游戏月保底'" />
            </el-form-item>
  <!--          <el-form-item label="最大站点数量:">
                <el-input-number v-model="form.upLimit" :controls="false" :precision="0" :min="0" :placeholder="'请输入最大站点数量'" />
            </el-form-item> -->
        </el-form>
    </Dialog>
</template>

<script setup>
import Dialog from '@/components/Dialog/index.vue'
import { useIndexHook } from "./index.js";
import { ref } from 'vue'
const emits = defineEmits(["close", "update:form", "confirm"]);
const props = defineProps({
    form: {
        type: Object,
        default: () => { },
    },
    operateType: {
        type: Boolean,
        default: false,
    },
});
const dialog = ref(null)
const { formRef, rules, handleConfirm, } = useIndexHook(props, emits);
</script>

<style lang="scss">
</style>

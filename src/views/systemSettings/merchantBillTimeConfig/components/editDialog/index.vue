<!--
 * @Author: liqijiang 3045273238@qq.com
 * @Date: 2023-11-18 18:21:29
 * @LastEditors: liqijiang 3045273238@qq.com
 * @LastEditTime: 2023-11-18 18:39:26
 * @FilePath: \management-bg\src\views\systemSet\enterBillTimeConfig\components\editDialog\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="editDialog">
        <Dialog :title="userData.isHasPermiss('admin.merchant-bill-config.edit') ? '修改' : '详情'"
            :isShowSubmitBtn="userData.isHasPermiss('admin.merchant-bill-config.edit')" @close="emits('close')"
            @confirm="handleConfirm">
            <el-form :model="editForm" ref="editFormRef" :rules="rules"
                :disabled="!userData.isHasPermiss('admin.merchant-bill-config.edit')" label-width="100px">
                <el-form-item label="账单：" prop="day">
                    <span>每月</span>
                    <el-input-number v-model="editForm.day" :min="1" :max="31" :step="1" :controls="true"
                        controls-position="right">
                    </el-input-number>
                    <span>日{{ typeLabelCom }}</span>
                </el-form-item>
                <el-form-item label="说明：" prop="desc">
                    <el-input v-model="editForm.desc" type="text" placeholder="请输入说明" maxlength="20" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="通知内容：" prop="content">
                    <el-input v-model="editForm.content" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }"
                        placeholder="请输入说明" maxlength="50" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="提醒：" v-if="editForm.type != 1">
                    <span>提前</span>
                    <el-input-number v-model="editForm.aheadDay" :min="0" :max="31" :step="1" :controls="true"
                        controls-position="right">
                    </el-input-number>
                    <span> 天提醒，到期失效</span>
                </el-form-item>
                <el-form-item label="" v-if="editForm.type != 1">
                    <el-radio-group v-model="editForm.promptType">
                        <el-radio :label="1">每天进入首页提醒一次</el-radio>
                        <el-radio :label="2">仅提醒一次</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </Dialog>
    </div>
</template>

<script setup>
import userStore from '@/store/user'
import Dialog from "@/components/dialogHook/index.vue";
import { useIndexHook } from "./index.js";

const emits = defineEmits(["close", "update:editForm", "confirm"]);
const props = defineProps({
    editForm: {
        type: Object,
        default: () => { },
    }
})
const userData = userStore()
const { editFormRef, rules, typeLabelCom, handleConfirm } = useIndexHook(props, emits);
</script>

<style lang="scss" scoped></style>

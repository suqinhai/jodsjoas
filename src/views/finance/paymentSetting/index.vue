<template>
    <!-- 收款设置 -->
    <div class="container">
        <p>收款地址：</p>
        <el-table :data="paymentConfigList" border table-layout="auto">
            <el-table-column prop="channel" label="收款通道" align="center" />
            <el-table-column prop="toAddr" label="收款地址" align="center" />
            <el-table-column prop="timeout" label="收款失效时间(分钟)" align="center" />
            <el-table-column label="操作" align="center" fixed="right">
                <template #default="scope">
                    <el-button v-throttle v-permiss="'admin.merchant-recharge-config.paymentConfigEdit'" type="primary" link
                        @click="handleEdit(scope.row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <FormDialog ref="editFormDialogRef" :title="'修改收款配置'" @onSubmit="editSubmit">
            <el-form :model="editForm" label-width="120px">
                <el-form-item label="收款通道：">
                    <el-input v-model="editForm.channel"></el-input>
                </el-form-item>
                <el-form-item label="收款地址：">
                    <el-input v-model="editForm.toAddr"></el-input>
                </el-form-item>
                <el-form-item label="收款失效时间s：">
                    <el-input v-model="editForm.timeout"></el-input>
                </el-form-item>
            </el-form>
        </FormDialog>
    </div>
</template>

<script setup name="paymentSetting">
import { defineAsyncComponent } from 'vue'
import { useIndexHook } from "./index";
const { paymentConfigList, editForm, editFormDialogRef, handleEdit, editSubmit } = useIndexHook()
import FormDialog from "@/components/dialogOld/index.vue"
</script>

<style lang="scss" scoped></style>

<template>
    <!-- 商户账单时间配置 -->
    <div class="enterBillTimeConfig">
        商户账单时间配置
        <el-table :data="merchantBillConfigList" border table-layout="auto">
            <!-- <el-table-column prop="id" label="id" align="center"/> -->
            <el-table-column prop="type" label="类型" align="center">
                <template #default="{ row }">
                    <span>{{
            MERCHANT_BILL_CONFIG_TYPE.find((item) => item.value == row.type)
              ?.label
          }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="day" label="日期" align="center" />
            <el-table-column prop="desc" label="说明" align="center" />
            <el-table-column prop="content" label="通知内容" align="center" />
            <el-table-column prop="status" label="通知开关" align="center">
                <template #default="{ row }">
                    <el-switch :disabled="!userData.isHasPermiss('admin.merchant-bill-config.edit')" v-model="row.status"
                        :active-value="1" :inactive-value="0" :before-change="() => handleChangeStatus(row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" fixed="right">
                <template #default="{ row }">
                    <el-button v-throttle v-permiss="'admin.merchant-bill-config.detail'" type="primary" link
                        @click="handleEdit(row)">
                        {{userData.isHasPermiss('admin.merchant-bill-config.edit') ? '修改' : '详情'}}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <EditDialog @close="showEditDialog = false" v-if="showEditDialog" v-model:editForm="editForm" @confirm="handleConfirm">
        </EditDialog>
    </div>
</template>

<script setup name="merchantBillTimeConfig">
import userStore from '@/store/user'
import { defineAsyncComponent, ref } from "vue";
import { useIndexHook } from "./index.js";
import { MERCHANT_BILL_CONFIG_TYPE } from "@/common/source_map/index.js"
const EditDialog = defineAsyncComponent(() =>
    import("./components/editDialog/index.vue")
);


const userData = userStore()
const {
    showEditDialog,
    merchantBillConfigList,
    editForm,
    handleEdit,
    handleConfirm,
    editMerchantBillConfig,
    handleChangeStatus,
} = useIndexHook();
</script>

<style lang="scss" scoped>
.el-radio-group {
    display: inline-flex;
    align-items: flex-start;
    font-size: 0;
    flex-direction: column;
}
</style>

<template>
    <!-- 商户成长 -->
    <div class="enterDevelop">
        <p style="margin-bottom:10px;">商户等级配置</p>
        <el-table :data="merchantLevelConfigData" border table-layout="auto">
            <el-table-column prop="level" label="等级" align="center" />
            <el-table-column prop="totalRecharge" label="累计充值u" align="center" />
            <el-table-column label="操作" align="center" fixed="right">
                <template #default="scope">
                    <el-button v-throttle v-permiss="'admin.merchant-level-config.edit'" type="primary" link
                        @click="handleEdit(scope.row)">
                        修改</el-button>
                </template>
            </el-table-column>
        </el-table>

        <EditDialog v-if="showEditDialog" v-model:editForm="editForm" @confirm="handleConfirm" @close="showEditDialog = false">
        </EditDialog>
    </div>
</template>

<script setup name="merchantDevelop">
import { defineAsyncComponent } from "vue";
import { useIndexHook } from "./index";
const EditDialog = defineAsyncComponent(() =>
    import("./components/editDialog/index.vue")
);
const {
    editForm,
    showEditDialog,
    merchantLevelConfigData,
    handleShareSet,
    handleEdit,
    handleConfirm,
} = useIndexHook();
</script>

<style lang="scss" scoped>
// .addBtn {
//   display: flex;
//   justify-content: end;
//   margin-bottom: 20px;
// }
</style>

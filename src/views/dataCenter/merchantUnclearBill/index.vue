<template>
    <!-- 商户未结账单 -->
    <div class="merchantUnclearBill">
        <!-- <p>商户ID：{{ query.id }}</p> -->
        <p>未结账单：{{ ext }}</p>
        <div class="tablesData">
            <el-table :data="merchantUnsettledBillsList" border :table-layout="'auto'" class="tableWidth">
                <el-table-column prop="merchantId" label="站点ID" align="center" />
                <el-table-column prop="" label="未缴月份" align="center">
                    <template #default="{ row }">
                        <span>{{ dateFormat(row.period,"yyyy-MM-DD") }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="未缴额度" align="center">
                    <template #default="{ row }">
                        <span>{{ sub(row.totalPay,row.realPay).toFixed(2) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="updateTime" label="更新时间" align="center">
                    <template #default="{ row }">
                        <span>{{ dateFormat(row.updateTime) }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup name="merchantUnclearBill">
import { useIndexHook } from "./index.js";
import { dateFormat, sub } from "@/common/util/index.js";
const { query, ext, merchantUnsettledBillsList } = useIndexHook();
</script>

<style lang="scss" scoped>
.tablesData {
    margin-top: 20px;
    .tableWidth {
        width: 50%;
    }
}
</style>

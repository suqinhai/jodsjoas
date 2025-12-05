<template>
    <!-- 逾期商户 -->
    <div class="overdueEnter">
        <el-table :data="tableData" border table-layout="auto">
            <el-table-column label="商户ID" align="center">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.merchantId)">
                        {{ row.merchantId }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="商户名称" align="center">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.merchantId)">
                        {{ row.name }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="arrears" label="欠费额度" align="center" />
            <el-table-column prop="overdueDays" label="逾期天数" align="center" />
            <el-table-column prop="lastRechargeTime" label="上次充值时间" align="center">
                <template #default="{row}">
                    {{row.lastRechargeTime ? dateFormat(row.lastRechargeTime) : ''}}
                </template>
            </el-table-column>
            <el-table-column prop="siteStatus_" label="站点状态" align="center" />
            <el-table-column label="操作" align="center">
                <template #default="{row}">
                    <el-button v-throttle type="primary" link @click="router.push('/merchant-config/merchant-site-manage?groupId=' + row.merchantId)">
                        点击跳转
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination v-show="!!total" v-model:page="pageConfig._page" v-model:size="pageConfig._size" :total="total" @pagination="getList">
        </Pagination>
    </div>
</template>

<script setup name="overdueMerchant">
import { dateFormat } from '@common/util'
import { useRouter } from "vue-router"
import { useIndexHook } from "./index.js"
const { total, pageConfig, tableData, getList } = useIndexHook()
const router = useRouter()

// 查看商户详情
const showMerchantDetail = (id) => {
    globalVBus.$emit('merchantDetailDialog', id)
}
</script>

<style lang="scss" scoped>
.overdueEnter {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .el-table {
        flex: 1;
    }
}
</style>

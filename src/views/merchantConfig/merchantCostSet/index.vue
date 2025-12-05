<template>
    <!-- 商户费用设置 -->
    <div class="enterCostSet">
        <el-form class="filter-form" inline :model="formData">
            <el-form-item label="商户名称:">
                <el-input v-model="formData.name" placeholder="请输入商户名称" />
            </el-form-item>
			<el-form-item label="商户ID:">
			    <el-input v-model="formData.merchantId" placeholder="请输入商户ID" />
			</el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click="fetchData('reset')">重 置</el-button>
            </el-form-item>
        </el-form>

        <el-table border :table-layout="'auto'" :data="merchantCostConfigList">
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
                        {{ row.merchantName }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="openFee" label="开版费u" align="center" />
            <el-table-column prop="lineCost" label="线路费用" align="center" />
            <el-table-column prop="monthMin" label="游戏月保底" align="center" />
<!--            <el-table-column prop="upLimit" label="最大站点数量" align="center" /> -->
            <el-table-column prop="updateTime" label="操作时间" align="center">
                <template #default="{ row }">
                    <span>{{ dateFormat(row.updateTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" fixed="right">
                <template #default="scope">
                    <el-button v-throttle v-permiss="'admin.merchant-cost-config.edit'" type="primary" link
                        @click="handleEdit(scope.row)">修改
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <Pagination v-show="!!total" v-model:page="pageConfig._page" v-model:size="pageConfig._size" :total="total"
            @pagination="merchantCostConfigListGet"></Pagination>

        <AddOrEditDialog v-if="showDialog" @close="showDialog = false" v-model:form="form" :operateType="operateType"
            @confirm="handleConfirm"></AddOrEditDialog>
    </div>
</template>

<script setup name="merchantCostSet">
import Pagination from "@/components/Pagination/index.vue"
import { defineAsyncComponent } from "vue"
import { useIndexHook } from "./index.js"
import { dateFormat } from "@/common/util/index"
const AddOrEditDialog = defineAsyncComponent(() => import("./components/addOrEditDialog/index.vue"))

const {
    form,
    operateType,
    pageConfig,
    total,
    merchantCostConfigList,
    showDialog,
    handleConfirm,
    handleCreate,
    handleEdit,
    merchantCostConfigListGet,
	formData,
	fetchData
} = useIndexHook()

// 查看商户详情
const showMerchantDetail = (id) => {
    globalVBus.$emit('merchantDetailDialog', id)
}
</script>

<style lang="scss" scoped>
.createBtn {
    margin-bottom: 10px;
}
.enterCostSet {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .el-table {
        flex: 1;
    }
}
</style>

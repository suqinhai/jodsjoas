<template>
    <!-- 客服管理 -->
    <div class="customer-page">
        <el-table :data="customerList" border>
            <el-table-column prop="type_" label="商户模块" align="center" />
            <el-table-column prop="prompt" label="提示内容" align="center" />
            <el-table-column prop="phone" label="tg号码" align="center" />
            <el-table-column prop="gameType_" label="操作" align="center">
                <template #default="{ row }">
                    <el-button v-throttle v-permiss="'admin.customer-service-config.edit'" type="primary" text
                        @click="handleEdit(row)">修改
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <EditDialog v-if="showEditDialog" :item="currentItem" @close="showEditDialog = false" @refresh="getList"></EditDialog>
    </div>
</template>

<script setup name='customerManage'>
import { ref, reactive, onMounted, defineAsyncComponent } from 'vue'
import { getCustomerList } from '@/api/messageCenter.js'
const EditDialog = defineAsyncComponent(() => import('./components/edit.vue'))
const customerList = reactive([])
const showEditDialog = ref(false)
const currentItem = ref()

const getList = () => {
    customerList.length = 0
    getCustomerList().then(res => {
        const { data, code } = res
        if (code === 0) {
            customerList.push(...data)
        }
    })
}

const handleEdit = (item) => {
    currentItem.value = item
    showEditDialog.value = true
}

onMounted(() => {
    getList()
})
</script>

<style lang="scss">
.customer-page {
}
</style>
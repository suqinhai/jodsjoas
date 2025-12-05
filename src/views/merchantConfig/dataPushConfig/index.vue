<template>
    <!-- 数据推送配置 -->
    <div class="container data-push-config">
        <div class="head" v-permiss="'admin.stat-push-config.edit'">
            <el-button v-throttle style="margin-right: 20px" type="primary" @click="handleConfig({})">新 增</el-button>
        </div>
        <el-table class="table-box" :data="state.tableData" border>
            <el-table-column prop="merchantIds" label="商户ID" min-width="160" align="center" />
            <el-table-column prop="chatId" label="推送群id" min-width="120" align="center" />
            <el-table-column prop="botId" label="机器人token" min-width="160" align="center" />
            <el-table-column prop="remark" label="备注" min-width="160" align="center" />
            <el-table-column label="操作时间" min-width="160" align="center">
                <template #default="{ row }">
                    {{row.updateTime && dateFormat(row.updateTime)}}
                </template>
            </el-table-column>
            <el-table-column fixed="right" align="center" label="操作" width="240">
                <template #default="{ row }">
                    <el-button v-throttle type="primary" text v-if="userData.isHasPermiss('admin.stat-push-config.edit')"
                        @click="handleConfig( row )">修改</el-button>
                    <el-button v-throttle type="danger" text v-if="userData.isHasPermiss('admin.stat-push-config.edit')"
                        @click="handleDelete( row.id )">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination v-show="state.total > 0" :total="state.total" v-model:page="state.listQuery._page" v-model:size="state.listQuery._size"
            @pagination="fetchData" />

        <DeployDialog v-if="state.dialogShow" :itemData="state.itemData" @fetchData="fetchData" @close="state.dialogShow = false">
        </DeployDialog>
    </div>
</template>

<script setup name='dataPushConfig'>
import { reactive, onMounted, defineAsyncComponent } from 'vue'
import userStore from '@/store/user'
import { ElMessageBox } from 'element-plus'
import { dateFormat } from "@/common/util/index.js"
import { getDataPushConfigList, deleteDataPushConfig } from '@/api/merchantConfig'
const DeployDialog = defineAsyncComponent(() => import('./components/DeployDialog.vue'))

const state = reactive({
    tableData: [],
    total: 0,
    listQuery: {
        _page: 1,
        _size: 10,
    },
    itemData: {},
    dialogShow: false
})
const userData = userStore()

onMounted(() => {
    fetchData()
})

const fetchData = () => {
    globalVBus.$emit('globalLoading', true)
    getDataPushConfigList(state.listQuery).then(res => {
        let { total, list } = res.data
        state.total = total || 0
        state.tableData = list || []
        globalVBus.$emit('globalLoading', false)
    }).catch(() => {
        state.tableData = []
        globalVBus.$emit('globalLoading', false)
    })
}

const handleConfig = (val = {}) => {
    state.itemData = { ...val }
    state.dialogShow = true
}

const handleDelete = (id) => {
    ElMessageBox.confirm('确定要删除此推送配置吗？', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取消',
        showClose: true,
        type: 'warning',
    }).then(() => {
        globalVBus.$emit('globalLoading', true)
        deleteDataPushConfig({ id }).then(() => {
            fetchData()
        }).catch(err => {
            globalVBus.$emit('globalLoading', false)
        })
    }).catch(() => { })
}
</script>

<style lang="scss">
.data-push-config {
    .head {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;
    }
}
</style>

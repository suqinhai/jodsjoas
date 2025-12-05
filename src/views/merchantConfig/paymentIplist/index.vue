<template>
    <!-- 商户支付IP -->
    <div class="container">
        <el-form class="filter-form" :model="state.searchForm" inline>
            <el-form-item label="商户ID:">
                <el-input v-model="state.searchForm.groupId" placeholder="请输入商户ID" />
            </el-form-item>
            <el-form-item label="IP:">
                <el-input v-model="state.searchForm.ip" placeholder="请输入IP" />
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click="fetchData('reset')">重 置</el-button>
            </el-form-item>
            <el-form-item v-permiss="'admin.ip.edit'">
                <el-button v-throttle type="primary" @click="handleConfig({})">新 增</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="state.tableData" border class="table-box">
            <el-table-column prop="ip" label="支付IP" width="180" align="center"/>
            <el-table-column prop="merchantIds" label="使用商户ID" align="center" min-width="180"/>
            <el-table-column prop="updateTime" label="修改时间" width="180" align="center">
                <template #default="{ row }">
                    <span>{{ dateFormat(row.updateTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="emp.name" label="修改人" width="100" align="center" />
            <el-table-column prop="remark" label="备注" min-width="160" align="center" />
            <el-table-column fixed="right" label="操作" width="160" align="center">
                <template #default="{ row }">
                    <el-button v-throttle v-if="userData.isHasPermiss('admin.ip.edit')" type="primary" text
                        @click="handleConfig(row)">修改
                    </el-button>
                    <el-button v-throttle v-if="userData.isHasPermiss('admin.ip.delete') && row.canDelete" type="primary" text
                        @click="handleDelete(row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination v-show="!!state.total" v-model:page="state.pageConfig._page" v-model:size="state.pageConfig._size" :total="state.total"
            @pagination="fetchData"></Pagination>

        <DeployDialog :itemData="state.itemData" @close="state.showDeployDialog = false" v-if="state.showDeployDialog" @fetchData="fetchData">
        </DeployDialog>
    </div>
</template>

<script setup name="merchantWhitelist">
import Pagination from "@/components/Pagination/index.vue"
import { reactive, onMounted, defineAsyncComponent } from 'vue'
import userStore from '@/store/user'
import { ElMessageBox } from 'element-plus'
import { getIpList, postAddIp, postDeleteIp, getIpDetail } from '@/api/merchantConfig'
import { dateFormat } from "@/common/util/index.js"
const DeployDialog = defineAsyncComponent(() => import("./components/DeployDialog.vue"))

const state = reactive({
    searchForm: {},
    tableData: [],
    total: 0,
    pageConfig: {
        _page: 1,
        _size: 10,
    },
    showDeployDialog: false,
    itemData: {},
})
const userData = userStore()

onMounted(() => {
    fetchData()
})

const fetchData = (val = '') => {
    if (val) {
        state.pageConfig._page = 1
        if (val === 'reset') {
            state.searchForm = {}
        }
    }
    let params = { ...state.pageConfig, ...state.searchForm }
    globalVBus.$emit('globalLoading', true)
    getIpList(params).then(res => {
        let { total, list = [] } = res.data
        state.tableData = list
        state.total = total
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        state.tableData = []
        globalVBus.$emit('globalLoading', false)
    })
}

const handleDelete = ({ group, id }) => {
    ElMessageBox.confirm('确定要删除此商户支付IP配置吗？', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        globalVBus.$emit('globalLoading', true)
        postDeleteIp({ id }).then(res => {
            fetchData()
        }).catch(err => {
            globalVBus.$emit('globalLoading', false)
        })
    }).catch(() => { })
}

const handleConfig = (row) => {
    state.itemData = { ...row }
    state.showDeployDialog = true
}
</script>

<style lang="scss" scoped>
</style>

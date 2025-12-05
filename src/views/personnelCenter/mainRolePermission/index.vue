<template>
    <!-- 权限设置 -->
    <div class="container role-permission">
        <div class="head" v-if="isPremiss">
            <el-button v-throttle style="margin-right: 20px" type="primary" @click="handleConfig">新增总台角色</el-button>
        </div>
        <el-table class="table-box" :data="state.tableData" border>
            <el-table-column prop="id" label="ID" width="120" align="center" />
            <el-table-column prop="name" label="角色名称" min-width="160" align="center" />
            <el-table-column prop="info" label="角色描述" min-width="160" align="center" />
            <el-table-column fixed="right" align="center" label="操作" width="240">
                <template #default="{ row }">
                    <el-button v-throttle type="primary" text v-if="row.canEdit && userData.isHasPermiss('admin.role.edit')"
                        @click="handleConfig( row )">修改</el-button>
                    <el-button v-throttle type="danger" text v-if="row.canDelete && userData.isHasPermiss('admin.role.delete')"
                        @click="handleDelete( row.id )">删除</el-button>
                    <el-button v-throttle type="primary" text v-if="row.canGrant && userData.isHasPermiss('admin.role.grant')"
                        @click="router.push('/personnel-center/mix-permission?id='+ row.id)">分配权限</el-button>
                </template>
            </el-table-column>
        </el-table>

        <Pagination v-show="state.total > 0" :total="state.total" v-model:page="state.listQuery._page" v-model:size="state.listQuery._size"
            @pagination="fetchData" />

        <RoleDeploy v-if="state.dialogShow" :itemData="state.itemData" @fetchData="fetchData" @close="state.dialogShow = false">
        </RoleDeploy>
    </div>
</template>

<script setup name='rolePermission'>
import { reactive, onMounted, defineAsyncComponent, computed } from 'vue'
import { useRouter } from 'vue-router'
import userStore from '@/store/user'
import { ElMessageBox } from 'element-plus'
import { roleListApi, deleteRoleData } from '@/api/manageConfig'
const RoleDeploy = defineAsyncComponent(() => import('./components/RoleDeploy.vue'))

const state = reactive({
    tableData: [],
    merchantData:[],
    total: 0,
    listQuery: {
        _page: 1,
        _size: 10,
    },
    merchantTotal:0,
    itemData: {},
    dialogShow: false
})
const router = useRouter()
const userData = userStore()

const isPremiss = computed(() => {
    return userData.userInfo.asSuper
})

onMounted(() => {
    fetchData()
})

const fetchData = () => {
    let params = { ...state.listQuery, }
    globalVBus.$emit('globalLoading', true)
    roleListApi(params).then(res => {
        let { total, list } = res.data
        state.total = total || 0
        state.tableData = list || []
        globalVBus.$emit('globalLoading', false)
    }).catch(() => {
        globalVBus.$emit('globalLoading', false)
    })
}

const handleConfig = (val = {}) => {
    state.itemData = { ...val }
    state.dialogShow = true
}

const handleDelete = (id) => {
    ElMessageBox.confirm('确定要删除此角色吗？', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取消',
        showClose: true,
        type: 'warning',
    }).then(() => {
        globalVBus.$emit('globalLoading', true)
        deleteRoleData({ id }).then(res => {
            fetchData()
        }).catch(err => {
            globalVBus.$emit('globalLoading', false)
        })
    }).catch(() => { })
}
</script>

<style lang="scss">
.role-permission {
    .head {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;
    }
    .el-tabs {
        flex:1;
        .el-tabs__content {
            height: calc(100% - 40px);
            overflow-y: hidden;
            .el-tab-pane {
                height: 100%;
                display: flex;
                flex-direction: column;
            }
        }
    }
}
</style>

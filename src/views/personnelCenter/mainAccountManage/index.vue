<template>
    <!-- 人事列表 -->
    <div class="container accountManage">

        <el-form class="filter-form" inline :model="state.searchData">
            <el-form-item label="登录账号:">
                <el-input v-model="state.searchData.username" placeholder="请输入登录账号" />
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click="fetchData('reset')">重 置</el-button>
            </el-form-item>
            <el-form-item v-permiss="'admin.emp.add'">
                <el-button v-throttle type="primary" @click="handleCreateAccount">创建账号</el-button>
            </el-form-item>
        </el-form>

        <el-table class="table-box" :data="state.tableData" border>
            <el-table-column prop="username" label="登录账号" min-width="140" align="center" />
            <el-table-column prop="nickname" label="昵称" min-width="140" align="center" />
            <el-table-column prop="roleName" label="所属角色" min-width="140" align="center" />
            <el-table-column prop="status" label="账号状态" min-width="100" align="center">
                <template #default="{row}">
                    <span :class="row.status === 1 ? 'normal': 'freeze'">{{row.status === 1 ? '正常': '冻结'}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="lastLoginTime" label="登录时间" min-width="160" align="center">
                <template #default="{ row }">
                    {{  row.lastLoginTime ? dateFormat(row.lastLoginTime) : "" }}
                </template>
            </el-table-column>
            <el-table-column prop="lastLoginIp" label="登录IP" min-width="140" align="center" />
            <el-table-column label="操作" fixed="right" min-width="140" align="center">
                <template #default="{row}">
                    <el-button v-throttle v-permiss="'admin.emp.edit'" text type="primary" @click="handleEdit(row.id)">修改
                    </el-button>
                    <el-button v-throttle text type="danger" v-permiss="'admin.emp.delete'" v-if="row.canDelete" @click="handleDelete(row)">
                        删除</el-button>
                    <el-button v-throttle type="primary" v-permiss="'admin.emp.resetGoogleValidator'" v-if="row.googleAuth" text
                        @click="handleResetBinding(row.id )">重置google验证器
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination v-show="!!state.total" v-model:page="state.pageConfig._page" v-model:size="state.pageConfig._size" :total="state.total"
                @pagination="handPaginationChange"></Pagination>
        <AddOrEditDialog @close="state.showDialog = false" :itemData="state.itemData" :roleList="state.roleList" v-if="state.showDialog"
            @fetchData="handPaginationChange"></AddOrEditDialog>
    </div>
</template>

<script setup name="accountManage">
import Pagination from "@/components/Pagination/index.vue"
import { reactive, onMounted, defineAsyncComponent, computed, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import userStore from '@/store/user'
import { getEmpList, getroleListMetas, deleteEmpAccount, getEmpDetail, postResetGoogleValidator } from '@/api/manageConfig.js'
import { dateFormat } from "@/common/util/index";
const AddOrEditDialog = defineAsyncComponent(() => import("./components/AddOrEditDialog.vue"))

const state = reactive({
    showDialog: false,
    searchData: {},
    pageConfig: {
        _page: 1,
        _size: 10,
    },
    total: 0,
    tableData: [],
    merchantTableData:[],
    itemData: {},
    roleList: [],
})
const userData = userStore()
const activeName = ref(1)

const isPremiss = computed(() => {
    return userData.userInfo.asSuper
})

onMounted(() => {
    getroleListMetas().then(({ code, data }) => {
        if (code == 0) {
            state.roleList = data
        }
    })
    fetchData()
})

const fetchData = (val = '') => {
    if (val) {
        state.pageConfig._page = 1
        if (val === 'reset') {
            state.searchData = {}
        }
    }
    let params = { ...state.pageConfig, ...state.searchData, type:1 }
    globalVBus.$emit('globalLoading', true)
    getEmpList(params).then(res => {
        let { total, list = [] } = res.data
        state.tableData = list
        state.total = total
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        state.tableData = []
        globalVBus.$emit('globalLoading', false)
    })
}

//删除
const handleDelete = async (value) => {
    ElMessageBox.confirm('删除后不可恢复，确认删除吗？', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'error',
    }).then(async () => {
        globalVBus.$emit('globalLoading', true)
        deleteEmpAccount({
            id: value.id,
            status: value.status,
        }).then(() => {
            fetchData()
        }).catch(() => {
            globalVBus.$emit('globalLoading', false)
        })
    }).catch(() => { })
}


//创建账号
const handleCreateAccount = () => {
    state.itemData = {}
    state.showDialog = true
}

//修改
const handleEdit = (id) => {
    globalVBus.$emit('globalLoading', true)
    getEmpDetail({ id }).then((res) => {
        const { code, data } = res
        if (code === 0) {
            state.itemData = data
            state.showDialog = true
        }
        globalVBus.$emit('globalLoading', false)
    }).catch(() => {
        globalVBus.$emit('globalLoading', false)
    })
}

const handleResetBinding = (id) => {
    ElMessageBox.confirm(`确定要移除此账号绑定的google验证器吗？移除后将需要重新绑定谷歌验证器登录商户后台！`, '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        globalVBus.$emit('globalLoading', true)
        postResetGoogleValidator({ id }).then(res => {
            fetchData()
        }).catch(err => {
            globalVBus.$emit('globalLoading', false)
        })
    }).catch(() => { })
}

const handleTabChange = (v)=> {
    state.pageConfig._page = 1
    state.searchData.username = ''
    fetchData()
}

const handPaginationChange = ()=> {
    fetchData()
}

</script>

<style lang="scss">
    .accountManage {
        .el-tabs {
            flex:1;
            .el-tabs__content {
                height: calc(100% - 40px);
                display: flex;
                flex-direction: column;
                .el-tab-pane {
                    flex:1;
                }
            }
        }
        .table-box {
            .normal {
                color:green;
            }
            .freeze {
                color:red;
            }
        }
    }
</style>
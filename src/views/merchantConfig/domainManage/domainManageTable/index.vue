<template>
    <!-- 商户域名管理-前台域名管理/后台域名管理/推广域名 -->
    <div class="domain-manage-table">
        <el-form class="filter-form" inline :model="state.formData">
            <el-form-item label="节点类型:">
                <el-select class="select-box" v-model="state.formData.status" clearable placeholder="请选择节点类型">
                    <el-option v-for="item in metaData.dnsProvider" :key="item.value" :value="item.value" :label="item.label" />
                </el-select>
            </el-form-item>
            <el-form-item label="主域名:">
                <el-input v-model="state.formData.name" placeholder="请输入主域名" />
            </el-form-item>
            <el-form-item label="操作人ID:">
                <el-input v-model="state.formData.empId" placeholder="请输入操作人ID" />
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click="fetchData('reset')">重 置</el-button>
            </el-form-item>
            <!-- <el-form-item>
                <el-button v-throttle type="primary" @click="state.explainDialogShow = true">限额说明</el-button>
            </el-form-item> -->
            <el-form-item v-permiss="permissList[asBack]" v-if="[0,1].includes(asBack)">
                <el-button v-throttle type="primary" @click="state.domainDeployShow = true">新 增</el-button>
            </el-form-item>
            <!-- <el-form-item>
                <el-select class="select-box" v-model="state.isAutoRefresh" @change="selectChange">
                    <el-option label="不自动刷新" :value="0" />
                    <el-option label="15s刷新" :value="15000" />
                    <el-option label="30s刷新" :value="30000" />
                    <el-option label="60s刷新" :value="60000" />
                </el-select>
            </el-form-item> -->
        </el-form>
        <el-table class="table-box" :data="state.tableData" border>
            <!-- <el-table-column prop="merchantId" label="商户ID" min-width="100" align="center" /> -->
            <el-table-column label="商户ID" min-width="100" align="center">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.merchantId)">
                        {{ row.merchantId }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="provider_" label="CDN节点名称" min-width="140" align="center" />
            <el-table-column label="主域名" min-width="140" align="center">
                <template #default="{ row }">
                    <div class="row-items">
                        <span>{{row.name}}</span>
                        <el-icon v-if="row.name" class="pointer icon-primary" style="margin-left: 10px;" :size="18" @click="copyText(row.name)">
                            <DocumentCopy />
                        </el-icon>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="DNS服务器" :min-width="240" align="center">
                <template #default="{ row }">
                    <div class="row-items" v-if="row.nameServerList && row.nameServerList.length">
                        <div class="row-items-left">
                            <div v-for="(item,index) in row.nameServerList" :key='index' class="row-items">
                                <span>{{item}}</span>
                                <el-icon v-if="row" class="pointer icon-primary" style="margin-left: 10px" :size="18" @click="copyText(item)">
                                    <DocumentCopy />
                                </el-icon>
                            </div>
                        </div>
                        <div class="row-items-right" v-if="userData.isHasPermiss(permissList[asBack])">
                            <el-button v-throttle :type="!row.canActive ? 'success' : 'primary'" text @click="handleVerify(row)">
                                {{!row.canActive ? '验证通过': '点击验证'}}</el-button>
                        </div>
                    </div>
                    <el-button v-if="userData.isHasPermiss(permissList[asBack]) &&  (!row.nameServerList || !row.nameServerList.length)" v-throttle
                        type="primary" text @click="handleVerify(row)">获取DNS服务器</el-button>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="exportLimitTypes" label="验证方式" min-width="160" align="center" /> -->
            <el-table-column prop="active_" label="主域名状态" min-width="120" align="center" />
            <el-table-column prop="expiredTime" label="过期时间" min-width="160" align="center" />
            <el-table-column prop="updateEmpName" label="操作人" min-width="140" align="center" />
            <el-table-column prop="updateTime" label="操作时间" min-width="160" align="center" />
            <el-table-column fixed="right" align="center" label="操作" width="160">
                <template #default="{ row }">
                    <!-- <el-button v-throttle v-permiss="'admin.user-blacklist.delete'"  type="primary" text
                        @click="handleConfig(row)">修改</el-button> -->
                    <el-button v-if="userData.isHasPermiss(permissList[asBack]) && (typeof row.canToggle === 'boolean') && !row.canToggle" v-throttle
                        type="primary" text @click="handleOperate(row.id,1)">停用</el-button>
                    <el-button v-if="userData.isHasPermiss(permissList[asBack]) && (typeof row.canToggle === 'boolean') && row.canToggle" v-throttle
                        type="primary" text @click="handleOperate(row.id,2)">启用</el-button>
                    <el-button v-if="userData.isHasPermiss(permissList[asBack]) && row.canDelete" v-throttle type="danger" text
                        @click="handleOperate(row.id,0)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination v-show="!!state.total" :total="state.total" v-model:page="state.listQuery._page" v-model:size="state.listQuery._size"
            @pagination="fetchData">
        </Pagination>

        <EexplainDialog v-if="state.explainDialogShow" @close="state.explainDialogShow = false">
        </EexplainDialog>
        <DomainDeployDialog v-if="state.domainDeployShow" :asBack="asBack" :metaData="metaData" @close="state.domainDeployShow = false"
            @fetchData="fetchData">
        </DomainDeployDialog>
    </div>
</template>

<script setup>
import { reactive, onMounted, defineAsyncComponent } from 'vue'
import userStore from '@/store/user'
import { ElMessageBox } from 'element-plus'
import { getDomainList, postVerifyDomain, postDomainStatus, deleteDomainData } from '@/api/merchantConfig'
import { dateFormat, copyText } from '@/common/util'
const EexplainDialog = defineAsyncComponent(() => import('./components/EexplainDialog.vue'))
const DomainDeployDialog = defineAsyncComponent(() => import('./components/DomainDeployDialog.vue'))

let permissList = ['admin.domain.edit', 'admin.domain.edit-1', 'admin.domain.list-2']
const props = defineProps({
    metaData: {
        type: Object,
        default: () => {
            return {}
        }
    },
    asBack: {
        type: Number,
        default: 0
    },
})
const state = reactive({
    formData: {},
    tableData: [],
    total: 0,
    listQuery: {
        _page: 1,
        _size: 10,
    },
    itemData: {},
    explainDialogShow: false,
    domainDeployShow: false,
})
const userData = userStore()

onMounted(() => {
    fetchData()
})

// 表格过滤数据处理
const fetchData = (val = '') => {
    if (val) {
        state.listQuery._page = 1
        if (val === 'reset') {
            state.formData = {}
        }
    }
    let params = { ...state.listQuery, ...state.formData }
    params.forBack = props.asBack
    globalVBus.$emit('globalLoading', true)
    getDomainList(params).then(res => {
        let { total, list } = res.data
        state.tableData = list.map(item => {
            item.updateTime && (item.updateTime = dateFormat(item.updateTime))
            item.expiredTime && (item.expiredTime = dateFormat(item.expiredTime))
            return item
        })
        state.total = total
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        state.tableData = []
        globalVBus.$emit('globalLoading', false)
    })
}

// 查看商户详情
const showMerchantDetail = (id) => {
    globalVBus.$emit('merchantDetailDialog', id)
}

const handleConfig = (val) => {
    state.itemData = { ...val }
    state.domainDeployShow = true
}

// 停用/启用/删除
const handleOperate = (id, type) => {
    let title = '删除'
    let api = deleteDomainData
    let obj = { id, asBack: props.asBack }
    if (type) {
        api = postDomainStatus
        title = type === 2 ? '启用' : '停用'
        obj.status = type - 1
    }
    ElMessageBox.confirm(`确定要${title}此域名吗？`, '提示', {
        type: 'warning'
    }).then(() => {
        globalVBus.$emit('globalLoading', true)
        api(obj).then(res => {
            fetchData()
        }).catch(err => {
            globalVBus.$emit('globalLoading', false)
        })
    }).catch(() => { })
}

// 域名验证/获取DNS服务器
const handleVerify = ({ id, canActive }) => {
    if (!canActive) return
    globalVBus.$emit('globalLoading', true)
    postVerifyDomain({
        id,
        asBack: props.asBack
    }).then(res => {
        fetchData()
    }).catch(err => {
        globalVBus.$emit('globalLoading', false)
    })
}
</script>

<style lang="scss">
.domain-manage-table {
    height: 100%;
    display: flex;
    flex-direction: column;
    .row-items {
        display: flex;
        align-items: center;
        justify-content: center;
        &-left {
            min-width: 150px;
            margin-right: 10px;
        }
        &-right {
            margin-left: 10px;
        }
    }
}
</style>

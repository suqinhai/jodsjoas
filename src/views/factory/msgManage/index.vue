<template>
    <!-- 短信配置 -->
    <div class="container">
        <el-form class="filter-form" :model="state.searchForm" inline>
            <el-form-item label="商户ID:">
                <el-input v-model="state.searchForm.id" placeholder="请输入商户ID" />
            </el-form-item>
            <el-form-item label="短信提供商:">
                <el-select class="select-box" v-model="state.searchForm.smsVendor" placeholder="请选择短信提供商" clearable>
                    <el-option v-for="item in state.msgProvideList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click="fetchData('reset')">重 置</el-button>
            </el-form-item>
            <el-form-item v-permiss="'admin.merchant-sms-config.editRemind'">
                <el-button v-throttle type="primary" @click="state.showRemindDialog = true">余额不足提醒</el-button>
            </el-form-item>
        </el-form>

        <el-table class="table-box" :data="state.tableData" border>
            <el-table-column label="商户ID" align="center">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.merchant.id)">
                        {{ row.merchant?.id || '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="商户名称" align="center">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.merchant.id)">
                        {{ row.merchant?.name || '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="smsVendorName" label="短信提供商" align="center" />
            <el-table-column prop="countries" label="运营地区" align="center" />
            <el-table-column prop="balance" label="短信商余额" align="center" />
            <el-table-column prop="param.username" label="api-key" align="center" />
            <el-table-column prop="param.password" label="secret" align="center" />
            <el-table-column prop="param.appId" label="app-id" align="center" />
            <el-table-column label="更新时间" width="160" align="center">
                <template #default="{ row }">
                    <span>{{ dateFormat(row.updateTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" align="center">
                <template #default="{ row }">
                    <el-button v-throttle v-permiss="'admin.merchant-sms-config.edit'" link type="primary" @click="handleEdit(row)">修改
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <Pagination v-show="!!state.total" v-model:page="state.pageConfig._page" v-model:size="state.pageConfig._size" :total="state.total"
            @pagination="fetchData"></Pagination>

        <EditDialog v-model:editForm="state.form" :msgProvideList="state.msgProvideList" :merchantSmsConfigAttrs="state.merchantSmsConfigAttrs"
            @close="state.showEditDialog = false" @confirm="handleConfirm" v-if="state.showEditDialog"></EditDialog>
        <RemindDialog v-if="state.showRemindDialog" @close="state.showRemindDialog = false"></RemindDialog>
    </div>
</template>

<script setup name="msgManage">
import { reactive, onMounted, defineAsyncComponent, watch } from "vue"
import { merchantSmsConfigListApi, merchantSmsConfigEditApi, merchantSmsConfigAttrsApi } from '@/api/factory.js'
import { commonMetasApi } from '@/api/common.js'
import { dateFormat } from "@/common/util/index"
const Pagination = defineAsyncComponent(() => import('@/components/Pagination/index.vue'))
const EditDialog = defineAsyncComponent(() => import("./components/editDialog/index.vue"))
const RemindDialog = defineAsyncComponent(() => import('./components/remind/index.vue'))

const state = reactive({
    searchForm: {},
    tableData: [],
    pageConfig: {
        _page: 1,
        _size: 10,
    },
    total: 0,
    form: {
        id: '', //商户ID
        props: [],
    },
    selectedEditData: {},
    msgProvideList: [], //短信供应商列表
    merchantSmsConfigAttrs: [], //参数配置
    showRemindDialog: false,
    showEditDialog: false,
})

watch(
    () => state.form.smsVendor,
    (val) => {
        getMerchantSmsConfig(val)
    },
    {
        deep: true
    },
)

onMounted(() => {
    commonMetasApi({ types: 'smsVendor' }).then(({ code, data }) => {
        if (code == 0) {
            state.msgProvideList = data.smsVendor
        }
    })
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
    merchantSmsConfigListApi(params).then(res => {
        let { total, list = [] } = res.data
        state.tableData = list
        state.total = total
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        state.tableData = []
        globalVBus.$emit('globalLoading', false)
    })
}

const getMerchantSmsConfig = (val) => {
    state.form.props = []
    merchantSmsConfigAttrsApi({ smsVendor: val }).then(({ code, data }) => {
        if (code == 0 && data) {
            state.merchantSmsConfigAttrs = data
            state.merchantSmsConfigAttrs.forEach((item, index) => {
                state.form.props.push({
                    key: Date.now(),
                    label: item.label,
                    name: item.name,
                    value: state.selectedEditData.param[item.name],
                    required: item.required,
                })
            })
        }
    })
}

// 查看商户详情
const showMerchantDetail = (id) => {
    globalVBus.$emit('merchantDetailDialog', id)
}

//修改
const handleEdit = async (values) => {
    state.selectedEditData = values
    state.form.smsVendor = ''
    state.form.id = values.merchant.id
    state.form.smsVendor = values.param.vendor || ''
    state.form.appId = values.param.appId || ''
    state.form.username = values.param.username || ''
    state.form.password = values.param.password || ''
    state.showEditDialog = true
}

//编辑商户短信配置表单提交
const handleConfirm = () => {
    let { id, smsVendor } = state.form
    let params = { id, smsVendor, props: { vendor: smsVendor } }
    state.form.props.forEach((item) => {
        params.props[item.name] = item.value
    })
    params.props = JSON.stringify(params.props)
    merchantSmsConfigEditApi(params).then((res) => {
        if (res.code == 0) {
            fetchData()
            state.showEditDialog = false
        }
    })
}
</script>

<style lang="scss" scoped>
</style>

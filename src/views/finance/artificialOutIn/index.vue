<template>
    <!-- 人工出入款 -->
    <div class="container">
        <el-form class="filter-form" :model="state.searchForm" inline>
            <el-form-item>
                <el-date-picker style="width: 220px" v-model="state.searchForm.interval" type="daterange" start-placeholder="开始日期"
                    end-placeholder="结束日期" :disabled-date="disabledDate" :shortcuts="shortcuts" value-format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item label="商户ID:">
                <el-input v-model="state.searchForm.merchantId" placeholder="请输入商户ID" />
            </el-form-item>
            <el-form-item label="订单号:">
                <el-input v-model="state.searchForm.id" placeholder="请输入订单号" />
            </el-form-item>
            <el-form-item label="操作类型:">
                <el-select class="select-box" v-model="state.searchForm.tradeType" placeholder="请选择操作类型" clearable>
                    <el-option v-for="item in state.accountAdjustType" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click="fetchData('reset')">重 置</el-button>
            </el-form-item>
            <el-form-item v-permiss="'admin.merchant-account-adjust-log.add'">
                <el-button v-throttle type="primary" @click="handleCreate">新 增</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="state.tableData" border class="table-box">
            <el-table-column prop="id" label="人工订单号" min-width="100" align="center" />
            <el-table-column label="商户ID" align="center" min-width="100">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.merchantId)">
                        {{ row.merchantId }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="商户名称" align="center" min-width="140">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.merchantId)">
                        {{ row.group?.name || '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="tradeType_" label="操作类型" min-width="120" align="center" />
            <el-table-column prop="amount" label="额度变化U" min-width="120" align="center" />
            <el-table-column prop="activeAmount" label="变化后金额" min-width="120" align="center" />
            <el-table-column prop="emp.name" label="操作人" min-width="120" align="center" />
            <el-table-column prop="addTime" label="操作时间" min-width="160" align="center">
                <template #default="{ row }">
                    <span>{{ dateFormat(row.addTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" min-width="160" align="center" />
        </el-table>
        <Pagination v-show="!!state.total" v-model:page="state.pageConfig._page" v-model:size="state.pageConfig._size" :total="state.total"
            @pagination="fetchData"></Pagination>

        <CreateFormDialog ref="createFormDialogRef" :title="'新增'" @onSubmit="handleSubmit">
            <el-form :model="state.createForm" ref="createFormRef" label-width="100px">
                <el-form-item label="商户ID:" prop="merchantId">
                    <el-select v-model="state.createForm.merchantId" placeholder="请选择商户" clearable filterable remote reserve-keyword
                        :remote-method="remoteMethod" :loading="state.loading" id="remoteSelect">
                        <el-option v-for="item in state.merchantIdList" :key="item.id" :label="item.id" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商户名称:" v-if="state.createForm.merchantId && state.merchantInfo.id">
                    <span>{{ state.merchantInfo.name }}</span>
                </el-form-item>

                <el-form-item label="操作类型:" prop="tradeType">
                    <el-select v-model="state.createForm.tradeType" placeholder="请选择操作类型" clearable @change="state.createForm.amount = ''">
                        <el-option v-for="item in state.accountAdjustType" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="金额:" prop="amount">
                    <el-input v-model="state.createForm.amount" placeholder="请输入金额" @input="amountInput"></el-input>
                </el-form-item>
                <el-form-item label="备注:">
                    <el-input v-model="state.createForm.remark" placeholder="请输入备注"></el-input>
                </el-form-item>
            </el-form>
        </CreateFormDialog>
    </div>
</template>

<script setup name="artificialOutIn">
import { reactive, ref, onMounted, nextTick } from 'vue'
import { manualCompensationList, manualCompensationAdd, merchantGetMerchant } from '@/api/financeManage.js'
import { commonMetasApi } from '@/api/common.js'
import { dateFormat, getShortcuts } from "@/common/util/index.js"
import Pagination from "@/components/Pagination/index.vue"
import CreateFormDialog from "@/components/dialogOld/index.vue"

const shortcuts = getShortcuts()
const state = reactive({
    searchForm: {},
    loading: false,
    createForm: {
        merchantId: '',
        tradeType: '',
        amount: 0,
        remark: '',
    },
    merchantIdList: [],
    merchantInfo: {},
    tableData: [],
    accountAdjustType: [],
    pageConfig: {
        _page: 1,
        _size: 10,
    },
    total: 0,
    rules: {
        merchantId: [{ required: true, message: "请选择商户！", trigger: "blur" }],
        tradeType: [{ required: true, message: "请选择操作类型！", trigger: "blur" }],
        amount: [{ required: true, message: "请输入金额！", trigger: "blur" }],
    },
})
const disabledDate = ref((time) => {
    return time.getTime() > Date.now()
})
const createFormDialogRef = ref(null)

onMounted(() => {
    commonMetasApi({ types: 'accountAdjustType' }).then(({ code, data }) => {
        if (code == 0) {
            state.accountAdjustType = data.accountAdjustType
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
    let { interval } = state.searchForm
    if (interval && interval.length) {
        params['interval.begin'] = interval[0]
        params['interval.end'] = interval[1]
        delete params.interval
    }
    globalVBus.$emit('globalLoading', true)
    manualCompensationList(params).then(res => {
        let { total, list = [] } = res.data
        state.tableData = list
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

//新增人工出入款
const manualCompensationAddApi = async (params) => {
    const { code } = await manualCompensationAdd(params)
    if (code == 0) {
        createFormDialogRef.value.closeDialog()
        fetchData()
    }
}

//点击新增
const handleCreate = () => {
    state.createForm = {}
    createFormDialogRef.value.openDialog()
    handleCheckInput()
}

//表单提交
const handleSubmit = () => {
    manualCompensationAddApi(state.createForm)
}

const remoteMethod = async (query) => {
    query = query.replace(/[^\d]/g, '')
    if (query) {
        state.loading = true
        const { code, data } = await merchantGetMerchant({ id: query })
        if (code == 0 && data) {
            state.merchantInfo = data
            state.merchantIdList = [data]
        } else {
            state.merchantIdList = []
        }
        state.loading = false
    } else {
        if (!state.createForm.merchantId) state.merchantIdList = []
    }
}

const amountInput = () => {
    let checkPlan = '' + state.createForm.amount
    if (state.createForm.tradeType == 5) {
        checkPlan = checkPlan
            .replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
            .replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
            .replace(/^\./g, '') // 保证第一个为数字而不是.
            .replace('.', '$#$')
            .replace(/\./g, '')
            .replace('$#$', '.')
        if (checkPlan.indexOf('.') < 0 && checkPlan !== '') {
            // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
            checkPlan = parseFloat(checkPlan) + ''
        } else if (checkPlan.indexOf('.') >= 0) {
            checkPlan = checkPlan.replace(/^()*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
        }
    } else {
        checkPlan = checkPlan.replace(/[^\d]/g, '')
        if (checkPlan !== '') checkPlan = parseFloat(checkPlan) + ''
    }
    state.createForm.amount = checkPlan
}

const handleCheckInput = () => {
    nextTick(() => {
        let dom = document.getElementById('remoteSelect')
        dom.oninput = () => {
            dom.value = dom.value.replace(/[^\d]/g, '')
        }
    })
}
</script>

<style lang="scss" scoped>
</style>

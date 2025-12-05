<template>
    <!-- 商户账单稽核 -->
    <div class="container">
        <el-form class="filter-form" :model="state.searchForm" inline>
            <el-form-item label="商户ID:">
                <el-input v-model="state.searchForm.merchantId" placeholder="请输入商户ID"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click="fetchData('reset')">重 置</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('export')">导出报表</el-button>
            </el-form-item>
        </el-form>
        <el-table class="table-box" :data="state.tableData" border>
            <el-table-column label="商户ID" min-width="100" align="center">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.group.id)">
                        {{ row.group?.id || '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="商户名称" min-width="140" align="center">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.group.id)">
                        {{ row.group?.name || '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="period" label="账单月份" align="center" min-width="100" />
            <el-table-column prop="currency" label="游戏货币" align="center" min-width="100" />
            <el-table-column prop="localGameFee" label="游戏账单(货币)" align="center" min-width="120" />
            <el-table-column prop="gameFee" label="游戏账单(U)" align="center" min-width="110" />
            <el-table-column prop="netFee" label="路线费用(U)" align="center" min-width="110" />
            <el-table-column prop="otherFee" label="cdn费用(U)" align="center" min-width="110">
                <template #default="{ row }">
                    <span class="special pointer" @click="showCdnCost(row)">
                        {{ row.otherFee }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="freeAmount" label="优惠额度(U)" align="center" min-width="110" />
            <el-table-column prop="totalPay" label="本账单合计(U)" align="center" min-width="120">
                <template #default="{ row }">
                    <span>{{ ((row.totalPay || 0) + (row.freeAmount || 0)).toFixed(2) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="totalPay" align="center" min-width="120">
                <template #header>
                    <div>实际需支付U</div>
                    <div>(扣除折扣优惠)</div>
                </template>
            </el-table-column>
            <el-table-column prop="status_" label="稽核状态" align="center" min-width="100" />
            <el-table-column prop="remark" label="稽核备注" align="center" min-width="140" />
            <el-table-column prop="emp.name" label="稽核操作人" align="center" min-width="120" />
            <el-table-column label="稽核操作时间" align="center" min-width="160">
                <template #default="{ row }">
                    <span>{{ dateFormat(row.auditTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="稽核操作" fixed="right" align="center" width="140">
                <template #default="{ row }">
                    <el-button v-throttle type="primary" link v-if="row.canEdit" @click="handleCheck(row, 1)">审核</el-button>
                    <el-button v-throttle type="primary" link @click="handleCheck(row, 0)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination v-show="!!state.total" v-model:page="state.pageConfig._page" v-model:size="state.pageConfig._size" :total="state.total"
            @pagination="fetchData"></Pagination>

        <Dialog ref="checkDialogRef" width="900px" :title="state.operateType == 1 ? '稽核' : '查看'" :isShowSubmitBtn="state.operateType != 0"
            @onSubmit="onSubmit" :draggable="true">
            <el-form :model="state.checkForm" :rules="state.rules" ref="checkFormRef" label-width="150">
                <el-row justify="end">
                    <el-col :span="10">
                        <el-form-item label="商户ID：">{{ state.checkForm.group?.id || '' }}</el-form-item>
                    </el-col>
                    <el-col :span="14">
                        <el-form-item label="商户名称：">{{ state.checkForm.group?.name || '' }}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="账单月份：">{{ state.checkForm.period }}</el-form-item>
                    </el-col>
                    <el-col :span="14">
                        <el-form-item label="游戏货币：">{{ state.checkForm.currency }}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="经营地（含时区）：">UTC {{state.checkForm.timeZone}}</el-form-item>
                    </el-col>
                    <el-col :span="14">
                        <el-form-item label="游戏货币汇率：">{{ state.checkForm.exchangeRate }}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="游戏账单-货币：">{{ state.checkForm.localGameFee }}</el-form-item>
                    </el-col>
                    <el-col :span="14">
                        <el-form-item label="游戏账单-U：">
                            {{div(...[state.checkForm.currency === 'VND' ? state.checkForm.localGameFee * 1000 : state.checkForm.localGameFee, state.checkForm.exchangeRate]).toFixed(2)}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="优惠费用u：" prop="freeAmount">
                            <el-input-number :disabled="state.operateType == 0" v-model="state.checkForm.freeAmount" :controls="false" :min="0"
                                :precision="2" @blur="handleInput(state.checkForm, 'freeAmount')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="14">
                        <el-form-item label="优惠费用u备注：">
                            <el-input :disabled="state.operateType == 0" v-model="state.checkForm.freeAmountRemark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="cdn费用u：" prop="otherFee">
                            <el-input-number :disabled="state.operateType == 0" v-model="state.checkForm.otherFee" :controls="false" :min="0"
                                :precision="2" @blur="handleInput(state.checkForm, 'otherFee')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="14">
                        <el-form-item label="cdn费用u备注：">
                            <el-input :disabled="state.operateType == 0" v-model="state.checkForm.otherFeeRemark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="子站点数：" prop="otherFee">
                            <el-input-number :disabled="true" v-model="state.checkForm.siteNum" :controls="false" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-row>
                    <el-col :span="10">
                        <el-form-item label="路线费用u：" prop="netFee">
                            <el-input-number :disabled="state.operateType == 0" v-model="state.checkForm.netFee" :controls="false" :min="0"
                                :precision="2" @blur="handleInput(state.checkForm, 'netFee')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="14">
                        <el-form-item label="路线费用u备注：">
                            <el-input :disabled="state.operateType == 0" v-model="state.checkForm.netFeeRemark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <el-form-item label="本账单合计u：">{{totalPay}}</el-form-item>
                <el-form-item label="实际需支付u（扣除折扣和优惠）：">{{realPay}}</el-form-item>
            </el-form>
        </Dialog>
        <CdnCostDialog :itemData="state.itemData" v-if="state.showCdnCostDialog" @close="state.showCdnCostDialog = false"></CdnCostDialog>
    </div>
</template>

<script setup name="merchantBillCheck">
import { ref, reactive, onMounted, computed, defineAsyncComponent } from "vue";
import { merchantBillListGetApi, merchantBillEditApi } from '@/api/dataCenter.js'
import { dateFormat, div, toolPoint, add, sub } from "@/common/util/index.js"
import Dialog from "@/components/dialogOld/index.vue"
import { useRoute } from 'vue-router'
const route = useRoute()
const CdnCostDialog = defineAsyncComponent(() => import('./components/cdnCostDialog.vue'))

const state = reactive({
    searchForm: {},
    checkForm: {},
    rules: {
        freeAmount: [
            { required: true, message: '必填项不可为空', trigger: 'blur' },
            {
                pattern: /^[0-9]\d*(.\d{1,2})?$/,
                message: '非法输入，应为数字最多含有两位小数且大于0',
            },
        ],
        otherFee: [
            { required: true, message: '必填项不可为空', trigger: 'blur' },
            {
                pattern: /^[0-9]\d*(.\d{1,2})?$/,
                message: '非法输入，应为数字最多含有两位小数且大于0',
            },
        ],
        netFee: [
            { required: true, message: '必填项不可为空', trigger: 'blur' },
            {
                pattern: /^[0-9]\d*(.\d{1,2})?$/,
                message: '非法输入，应为数字最多含有两位小数且大于0',
            },
        ],
    },
    detailForm: {},
    operateType: 1,
    tableData: [], //主表格数据,
    pageConfig: {
        _page: 1,
        _size: 10,
    },
    total: 0,
    merchantBillChildren: [], //详情表格数据
    billPageConfig: {
        _page: 1,
        _size: 10,
    },
    billTotal: 0,
    itemData: {},
    showCdnCostDialog: false
})
const checkDialogRef = ref(null)
const checkFormRef = ref(null)

const totalPay = computed(() => {
    let { gameFee = 0, otherFee = 0 } = state.checkForm
    return (gameFee + otherFee).toFixed(2)
})

const realPay = computed(() => {
    let { gameFee = 0, otherFee = 0, freeAmount = 0 } = state.checkForm
    return (gameFee + otherFee - freeAmount).toFixed(2)
})

onMounted(() => {
    let { merchantId } = route.query
    state.searchForm.merchantId = merchantId
    fetchData()
})

const showCdnCost = (data) => {
    state.itemData = data
    state.showCdnCostDialog = true
}

const fetchData = (val = '') => {
    if (val && val !== 'export') {
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
    if (val === 'export') params.isExport = true
    params.type = 2 // 固定参数，不可删除
    globalVBus.$emit('globalLoading', true)
    merchantBillListGetApi(params).then(res => {
        if (!params.isExport) {
            let { total, list = [] } = res.data
            state.tableData = list
            state.total = total
        }
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        if (!params.isExport) state.tableData = []
        globalVBus.$emit('globalLoading', false)
    })
}

// 查看商户详情
const showMerchantDetail = (id) => {
    globalVBus.$emit('merchantDetailDialog', id)
}

//点击审核
const handleCheck = (val, type) => {
    state.operateType = type
    state.checkForm = { ...val }
    checkDialogRef.value.openDialog()
}

//输入项变化
const handleInput = (value, type) => {
    //本账单合计=游戏账单u+其他费用+路线费用
    if (!checkFormRef.value) return
    checkFormRef.value.validate((valid) => {
        value.totalPay = add(
            ...[
                div(...[value.currency === 'VND' ? value.localGameFee * 1000 : value.localGameFee, value.exchangeRate]),
                value.otherFee,
                value.netFee,
            ],
        ).toFixed(2)
        value.realPay = sub(...[value.totalPay, value.freeAmount])
    })
}

const onSubmit = () => {
    if (!checkFormRef.value) return
    checkFormRef.value.validate((valid) => {
        let { group, netFee, otherFee, freeAmount, netFeeRemark, otherFeeRemark, freeAmountRemark, period } = state.checkForm
        let params = { merchantId: group.id, netFee, otherFee, freeAmount, netFeeRemark, otherFeeRemark, freeAmountRemark, period }
        merchantBillEditApi(params).then(({ code }) => {
            if (code == 0) {
                checkDialogRef.value.closeDialog()
                fetchData()
            }
        })
    })
}
</script>

<style lang="scss" scoped>
</style>

<template>
    <!-- 厂家账单稽核 -->
    <div class="container">
        <el-form class="filter-form" :model="state.searchForm" inline>
            <el-form-item label="厂家:">
                <el-select class="select-box" v-model="state.searchForm.vendor" placeholder="请选择厂家" clearable>
                    <el-option v-for="item in state.gameVendor" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态:">
                <el-select class="select-box" v-model="state.searchForm.status" placeholder="请选择状态" clearable>
                    <el-option v-for="item in state.vendorBillStatusList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click="fetchData('reset')">重 置</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('export')">excel导出</el-button>
            </el-form-item>
        </el-form>
        <el-table class="table-box" :data="state.vendorBillList" border>
            <el-table-column prop="id" label="账单ID" min-width="80" align="center" />
            <el-table-column prop="vendor" label="厂家名称" min-width="100" align="center" />
            <el-table-column prop="period" label="账单月份" min-width="100" align="center" />
            <el-table-column prop="totalUserIn" label="总有效下注U" min-width="120" align="center" />
            <el-table-column prop="totalMerchantWin" label="总利润额U" min-width="120" align="center" />
            <el-table-column prop="totalPay" label="总净利润U" min-width="120" align="center" />
            <el-table-column prop="status_" label="状态" min-width="100" align="center" />
            <el-table-column prop="auditRemark" label="稽核备注" min-width="140" align="center" />
            <el-table-column prop="auditEmpName" label="稽核操作人" min-width="120" align="center" />
            <el-table-column prop="auditTime" label="稽核操作时间" align="center" min-width="160">
                <template #default="{ row }">
                    <span>{{ row.auditTime && dateFormat(row.auditTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="confirmEmpName" label="账单确认人" min-width="120" align="center" />
            <el-table-column prop="confirmTime" label="账单确认时间" align="center" min-width="160">
                <template #default="{ row }">
                    <span>{{ row.confirmTime && dateFormat(row.confirmTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" align="center" width="120">
                <template #default="{ row }">
                    <div class="operate_table">
                        <el-button v-throttle
                            v-if="(row.status != 9 &&  row.status != 5) && (userData.isHasPermiss('admin.vendor-bill.audit') || userData.isHasPermiss('admin.vendor-bill.edit'))"
                            type="primary" @click="handleCheck(row, 1)" link>审核
                        </el-button>
                        <el-button v-throttle type="primary" v-if="row.status != 0" @click="handleView(row, 0)" link>查看
                        </el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <Pagination v-show="!!state.total" v-model:page="state.pageConfig._page" v-model:size="state.pageConfig._size" :total="state.total"
            @pagination="fetchData"></Pagination>

        <CheckConfirmDialog ref="checkConfirmDialogRef" top="5vh" :title="!state.operateType ? '查看' :  !state.checkConfirmForm.status ? 
        '稽核人员：厂家账单稽核' : '财务人员：厂家账单确认'" width="1000px" @onSubmit="onSubmit"
            :isShowOtherBtn="state.checkConfirmForm.status > 0 && userData.isHasPermiss('admin.vendor-bill.edit')"
            :isShowSubmitBtn="state.checkConfirmForm.status == 0 && userData.isHasPermiss('admin.vendor-bill.audit')" :otherBtnText="'账单确认'"
            @otherBtn="handleBillConfirm" confirmText="稽核确认">
            <el-form>
                <el-form-item label="厂家Id:">
                    {{ state.checkConfirmForm.id }}
                </el-form-item>
                <el-form-item label="厂家名称：">
                    {{ state.checkConfirmForm.vendor }}
                </el-form-item>
                <el-form-item label="账单月份：">
                    {{ state.checkConfirmForm.period }}
                </el-form-item>
                <el-form-item label="账单生成日期：">
                    <span>{{ dateFormat(state.checkConfirmForm.addTime) }}</span>
                    <div class="dialog_table_operateBtn toRight" v-if="state.operateType == 1 && state.checkConfirmForm.status != 9"
                        style="margin-bottom:10px;">
                        <el-button v-throttle v-if="state.tableOperateType" type="primary" size="small" @click="handleEdit">修改
                        </el-button>
                        <el-button v-throttle v-if="!state.tableOperateType" size="small" @click="handleCancel">取消</el-button>
                        <el-button v-throttle v-if="!state.tableOperateType" type="primary" size="small" @click="handleSave">保存
                        </el-button>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-table :data="state.checkConfirmForm.detail" border show-summary :summary-method="getSummaries">
                        <el-table-column label="游戏类型" align="center">
                            <template #default="{ row }">
                                <span>{{ state.gameTypeList.find((item) => item.value == row.type).label}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="currency" label="货币" align="center" />
                        <el-table-column prop="userCoinIn" label="有效投注(货币)" align="center" />
                        <el-table-column prop="userCoinInU" label="有效投注(U)" align="center" />
                        <!-- <el-table-column prop="merchantWin" label="总利润（货币）" align="center"/> -->
                        <el-table-column prop="merchantWinU" label="总利润(U)" align="center" />
                        <!-- <el-table-column prop="merchantPureWin" label="净利润抽成（货币）" align="center"/> -->
                        <el-table-column prop="merchantPureWinU" label="净利润抽成(U)" align="center" />
                        <el-table-column prop="shareRate" label="抽成比例%" align="center" />
                        <el-table-column label="汇率" align="center">
                            <template #default="{ row }">
                                <span v-if="state.tableOperateType">{{ row.exchangeRate }}</span>
                                <el-input v-else v-model="row.exchangeRate" @input="changeExChangeRate(row)"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="merchantPureLose" label="亏损额度(货币)" align="center" />
                        <el-table-column prop="merchantPureLoseU" label="亏损额度(U)" align="center" />
                    </el-table>
                </el-form-item>
                <el-form-item label="账单图片：">
                    <el-image v-if="(state.checkConfirmForm.status == 9 || !state.operateType) && !!state.checkConfirmForm.thirdBill"
                        :src="state.checkConfirmForm.thirdBill" fit="contain" style="height: 200px" lazy
                        :preview-src-list="[state.checkConfirmForm.thirdBill]" :crossorigin="null" preview-teleported>
                        <template #error>
                            <div class="image-slot">
                                <el-icon>
                                    <icon-picture />
                                </el-icon>
                            </div>
                        </template>
                    </el-image>
                    <UploadImage v-else v-model="state.checkConfirmForm.thirdBill">
                    </UploadImage>
                </el-form-item>
                <el-form-item label="交易哈希值：" label-width="100">
                    <el-input v-model="state.checkConfirmForm.txId" :disabled="(state.checkConfirmForm.status!=5)||!state.operateType"
                        @input="handleChangeTxId"></el-input>
                </el-form-item>
                <el-form-item label="应付款u：" label-width="100">{{ state.checkConfirmForm.shouldPay }}</el-form-item>
                <el-form-item label="备注：" label-width="100">
                    <el-input v-model="state.checkConfirmForm.auditRemark"
                        :disabled="!(state.operateType == 1 && state.checkConfirmForm.status != 9)"></el-input>
                </el-form-item>
            </el-form>
        </CheckConfirmDialog>
    </div>
</template>

<script setup name="factoryBillCheck">
import { reactive, ref, onMounted } from 'vue'
import userStore from '@/store/user'
import { Picture as IconPicture } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { vendorBillListApi, vendorBillAuditApi, vendorBillEditApi } from '@/api/dataCenter.js'
import { commonMetasApi } from '@/api/common.js'
import { dateFormat, deepCopy, div, toDecimal, mul } from '@/common/util/index.js'
import CheckConfirmDialog from "@/components/dialogOld/index.vue"
import UploadImage from "@/components/UploadImage/index.vue"

const state = reactive({
    searchForm: {}, //搜索数据
    checkConfirmForm: {},
    checkConfirmFormCopy: {},
    pageConfig: {
        _page: 1,
        _size: 10,
    },
    operateType: 1, //1:审核 0：查看
    tableOperateType: true, //1:修改 2:取消/保存
    total: 0,
    vendorBillList: [], //列表数据
    vendorBillStatusList: [], //状态元数据数组
    gameTypeList: [], //游戏类型元数据数组,
    gameVendor: [], //厂家类型元数据数组,
})
const userData = userStore()
const checkConfirmDialogRef = ref(null)

onMounted(() => {
    commonMetasApi({ types: 'vendorBillStatus,gameType,gameVendor' }).then(({ code, data }) => {
        if (code == 0) {
            state.vendorBillStatusList = data.vendorBillStatus
            state.gameTypeList = data.gameType
            state.gameVendor = data.gameVendor
        }
    })
    fetchData()
})

const fetchData = (val = '') => {
    if (val && val !== 'export') {
        state.pageConfig._page = 1
        if (val === 'reset') {
            state.searchForm = {}
        }
    }
    let params = { ...state.pageConfig, ...state.searchForm }
    params.menu = 1
    if (val === 'export') params.isExport = true
    globalVBus.$emit('globalLoading', true)
    vendorBillListApi(params).then(res => {
        if (!params.isExport) {
            let { total, list = [] } = res.data
            state.vendorBillList = list
            state.total = total
        }
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        if (!params.isExport) state.vendorBillList = []
        globalVBus.$emit('globalLoading', false)
    })
}

const initCheckConfirmForm = (value) => {
    state.checkConfirmForm.detail = value.map((item) => {
        item.merchantPureWinU =
            item.merchantWin > 0
                ? toDecimal(
                    mul(...[item.currency === 'VND' ? item.merchantWin * 1000 : item.merchantWin, item.shareRate / 100]) /
                    item.exchangeRate,
                )
                : '0.00'
        item.merchantPureWin =
            item.merchantWin > 0
                ? toDecimal(
                    mul(...[item.merchantWin, item.shareRate / 100]),
                )
                : '0.00'
        item.userCoinInU = toDecimal(
            div(...[item.currency === 'VND' ? item.userCoinIn * 1000 : item.userCoinIn, item.exchangeRate]),
        )
        item.userCoinIn = item.userCoinIn
            ? (item.userCoinIn * 1).toFixed(2)
            : '0.00'
        item.merchantWinU = item.merchantWin < 0 ? 0 : toDecimal(
            div(...[item.currency === 'VND' ? item.merchantWin * 1000 : item.merchantWin, item.exchangeRate]),
        )
        item.merchantPureLoseU =
            item.merchantWin < 0
                ? toDecimal(
                    mul(...[item.currency === 'VND' ? item.merchantWin * 1000 : item.merchantWin, item.shareRate / 100]) /
                    item.exchangeRate,
                )
                : '0.00'
        item.merchantPureLose =
            item.merchantWin < 0
                ? toDecimal(
                    mul(...[item.merchantWin, item.shareRate / 100]),
                )
                : '0.00'
        return item
    })
    //计算应付款
    state.checkConfirmForm.shouldPay = state.checkConfirmForm.detail
        .filter((obj) => obj.merchantPureWinU * 1 > 0) // 剔除 merchantPureWinU(净利润抽成) 为负数的对象
        .reduce((sum, obj) => sum + obj.merchantPureWinU * 1, 0)
        .toFixed(2) // 对 merchantPureWinU(净利润抽成) 属性进行累加
}

//点击审核
const handleCheck = (value, type) => {
    let {
        id,
        vendor,
        status,
        addTime,
        period,
        thirdBill,
        txId,
        auditRemark,
    } = value
    state.operateType = type
    state.checkConfirmForm = {
        id,
        vendor,
        status,
        addTime,
        period,
        thirdBill,
        txId,
        detail: [],
        auditRemark,
    }
    checkConfirmDialogRef.value.openDialog()
    initCheckConfirmForm(value.detail)
    state.checkConfirmFormCopy = deepCopy(state.checkConfirmForm)
}

const changeExChangeRate = (value) => {
    if (value.exchangeRate * 1 > 0) {
        value.merchantPureWinU =
            value.merchantWin > 0
                ? toDecimal(
                    mul(...[value.currency === 'VND' ? value.merchantWin * 1000 : value.merchantWin, value.shareRate / 100]) /
                    value.exchangeRate,
                )
                : '0.00'
        value.merchantPureWin =
            value.merchantWin > 0
                ? toDecimal(
                    mul(...[value.merchantWin, value.shareRate / 100]),
                )
                : '0.00'
        value.userCoinInU = toDecimal(
            div(...[value.currency === 'VND' ? value.userCoinIn * 1000 : value.userCoinIn, value.exchangeRate]),
        )
        value.merchantWinU = value.merchantWin < 0 ? 0 : toDecimal(
            div(...[value.currency === 'VND' ? value.merchantWin * 1000 : value.merchantWin, value.exchangeRate]),
        )
        state.checkConfirmForm.shouldPay = state.checkConfirmForm.detail
            .filter((obj) => obj.merchantPureWinU * 1 > 0) // 剔除 merchantPureWin(净利润抽成) 为负数的对象
            .reduce((sum, obj) => sum + obj.merchantPureWinU * 1, 0)
            .toFixed(2) // 对 merchantPureWin(净利润抽成) 属性进行累加
    } else {
        ElMessage.warning('汇率需大于0且为数字')
    }
}

//点击查看
const handleView = (value, type) => {
    let {
        id,
        vendor,
        status,
        addTime,
        period,
        thirdBill,
        txId,
        auditRemark,
    } = value
    state.checkConfirmForm = {
        id,
        vendor,
        status,
        addTime,
        period,
        thirdBill,
        txId,
        detail: [],
        auditRemark,
    }
    state.operateType = type
    checkConfirmDialogRef.value.openDialog()
    initCheckConfirmForm(value.detail)
}

//核对弹窗表格点击修改
const handleEdit = () => {
    state.tableOperateType = false
}

//核对弹窗表格点击取消
const handleCancel = () => {
    state.checkConfirmForm = state.checkConfirmFormCopy
    state.tableOperateType = true
}

//核对弹窗表格点击保存
const handleSave = () => {
    state.tableOperateType = true
}

//表尾合计
const getSummaries = (param) => {
    const { columns, data } = param
    const sums = []
    columns.forEach((column, index) => {
        if (index === 0) {
            sums[index] = '合计'
            return
        }
        if (column.label == '汇率' || column.label == '抽成比例%') {
            sums[index] = ''
            return
        }
        const values = data.map((item) => Number(item[column.property]))

        if (!values.every((value) => isNaN(value))) {
            sums[index] = values
                .reduce((prev, curr) => {
                    const value = Number(curr)
                    if (!isNaN(value)) {
                        return prev + curr
                    } else {
                        return prev
                    }
                }, 0)
                .toFixed(2)
        } else {
            sums[index] = ''
        }
    })

    return sums
}

//弹窗点击稽核确认
const onSubmit = () => {
    if (state.checkConfirmForm.thirdBill.length < 1) {
        ElMessage.warning('账单图片未传')
    } else {
        let { id, thirdBill, auditRemark } = state.checkConfirmForm
        let detail = []
        state.checkConfirmForm.detail.forEach((item) => {
            let { type, currency, exchangeRate } = item
            detail.push({
                type,
                currency,
                exchangeRate,
            })
        })
        let params = {
            id,
            thirdBill,
            auditRemark,
            detail: JSON.stringify(detail),
        }
        globalVBus.$emit('globalLoading', true)
        vendorBillAuditApi(params).then((res) => {
            if (res.code == 0) {
                // ElMessage.success('稽核保存成功')
                checkConfirmDialogRef.value.closeDialog()
                fetchData()
            }
        }).catch(err => {
            globalVBus.$emit('globalLoading', false)
        })
    }
}

//账单确认
const handleBillConfirm = () => {
    if (state.checkConfirmForm.thirdBill.length < 1) {
        ElMessage.warning('账单图片未传')
    } else {
        let { id, thirdBill } = state.checkConfirmForm
        let detail = []
        state.checkConfirmForm.detail.forEach((item) => {
            let { type, currency, exchangeRate } = item
            detail.push({
                type,
                currency,
                exchangeRate,
            })
        })
        let params = { id, thirdBill, detail: JSON.stringify(detail) }
        globalVBus.$emit('globalLoading', true)
        vendorBillEditApi(params).then((res) => {
            if (res.code == 0) {
                // ElMessage.success('稽核保存成功')
                checkConfirmDialogRef.value.closeDialog()
                fetchData()
            }
        }).catch(err => {
            globalVBus.$emit('globalLoading', false)
        })
    }
    // let { id, txId } = state.checkConfirmForm
    // let params = { id, txId }
    // console.log(11111111111, state.checkConfirmForm, params)
    // vendorBillEditApi(params).then(({ code }) => {
    //     if (code == 0) {
    //         ElMessage.success('账单已确认')
    //         checkConfirmDialogRef.value.closeDialog()
    //         fetchData()
    //     }
    // })
}

//填写txId
const handleChangeTxId = () => {
    if (state.checkConfirmForm.thirdBill.length < 1) {
        ElMessage.warning('请先上传账单图片')
        state.checkConfirmForm.txId = ''
    }
}
</script>

<style lang="scss" scoped>
.factoryBillCheck {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .operate_top {
        display: flex;
        justify-content: space-between;
    }
    .el-table {
        flex: 1;
    }
}
.dialog_table_operateBtn {
    flex: 1;
}
.toRight {
    display: flex;
    justify-content: flex-end;
}
.checkConfirmDialog {
    .el-form-item {
        margin-bottom: 5px;
    }
}
</style>

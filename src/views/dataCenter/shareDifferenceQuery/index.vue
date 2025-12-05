<template>
    <!-- 商户分成差额查询 -->
    <div class="container">
        <el-form ref="searchRef" class="filter-form" :model="state.searchForm" :rules="state.rules" inline>
            <el-form-item label="月份:" prop="period">
                <el-date-picker style="width: 150px" v-model="state.searchForm.period" type="month" placeholder="请选择月份"
                    :disabled-date="disabledDate" value-format="YYYY-MM" />
            </el-form-item>
            <el-form-item label="商户ID:" prop="merchantId">
                <el-input v-model="state.searchForm.merchantId" placeholder="请输入商户ID"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData">搜 索</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="state.tableData" border>
            <el-table-column prop="vendor_" label="游戏厂家" min-width="120" align="center" />
            <el-table-column prop="gameType_" label="游戏类型" min-width="120" align="center" />
            <el-table-column label="商户抽成比例" min-width="130" align="center">
                <template #default="{ row }">
                    {{row.realShareRate || 0}}%
                </template>
            </el-table-column>
            <el-table-column prop="realLocalFee" label="商户贡献额度" min-width="130" align="center" />
            <el-table-column label="厂家抽成比例" min-width="130" align="center">
                <template #default="{ row }">
                    {{row.vendorShareRate || 0}}%
                </template>
            </el-table-column>
            <el-table-column prop="vendorShareFee" label="厂家贡献额度" min-width="130" align="center" />
            <el-table-column prop="shareRateDiff" label="分成差额" min-width="120" align="center" />
            <el-table-column prop="shareFeeDiff" label="平台差额" min-width="120" align="center" />
        </el-table>
    </div>
</template>

<script setup name="shareDifferenceQuery">
import { ref, reactive, onMounted, onActivated, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getShareDifferenceDetail } from '@/api/dataCenter.js'

const state = reactive({
    searchForm: {},
    rules: {
        period: { required: true, message: '请选择月份！', trigger: 'change' },
        merchantId: { required: true, message: '请输入商户ID！', trigger: 'blur' },
    },
    tableData: [],
    date: '',
    merchantId: ''
})
const route = useRoute();
const searchRef = ref(null)
const disabledDate = ref((time) => {
    return time.getTime() > Date.now()
})

onMounted(() => {
    const { query } = route
    if ((query.merchantId && !state.merchantId) && (query.date && !state.date)) {
        state.merchantId = query.merchantId || ''
        state.date = query.date || ''
        state.searchForm = {
            merchantId: state.merchantId,
            period: state.date,
        }
        nextTick(() => {
            fetchData()
        })
    }
})

onActivated(() => {
    const { query } = route
    if ((query.merchantId && query.merchantId !== state.merchantId) || (query.date && query.date !== state.date)) {
        state.merchantId = query.merchantId || ''
        state.date = query.date || ''
        state.searchForm = {
            merchantId: state.merchantId,
            period: state.date,
        }
        nextTick(() => {
            fetchData()
        })
    }
})

const fetchData = () => {
    searchRef.value.validate((valid, fields) => {
        if (valid) {
            globalVBus.$emit('globalLoading', true)
            getShareDifferenceDetail(state.searchForm).then(res => {
                state.tableData = res.data || []
                globalVBus.$emit('globalLoading', false)
            }).catch(err => {
                state.tableData = []
                globalVBus.$emit('globalLoading', false)
            })
        } else {
            ElMessage.warning('请输入过滤条件再进行查询！')
        }
    })
}
</script>

<style lang="scss" scoped>
</style>


<template>
    <!-- 商户数据汇总-商户费用 -->
    <Dialog ref="dialog" title="商户费用" :isShowSubmit="false" @cancel="emits('close')" width="500" top="5vh">
        <div class="title">
            <div class="small-box">商户ID：{{itemData.groupId}}</div>
            <div class="small-box">月份：{{itemData.period}}</div>
        </div>
        <el-table :data="state.tableData" class="table-box" border>
            <el-table-column prop="merchantId" label="站点ID" min-width="120" align="center" />
            <!-- <el-table-column prop="rechargeNum" label="开版费" min-width="160" align="center" />
            <el-table-column prop="rechargeAmount" label="线路费" min-width="160" align="center" /> -->
            <el-table-column prop="openLineFee" label="站点费用" min-width="160" align="center" />
        </el-table>
        <Pagination v-show="state.total > 0 && itemData.type" :total="state.total" v-model:size="state.listQuery._size"
            v-model:page="state.listQuery._page" @pagination="fetchData"></Pagination>
    </Dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import { getMerchantCostData } from '@/api/dataCenter'

const emits = defineEmits(['close'])
const props = defineProps({
    itemData: {
        type: Object,
        default: () => {
            return {}
        }
    }
})
const state = reactive({
    tableData: [],
    total: 0,
    listQuery: {
        _page: 1,
        _size: 10,
    },
})
const dialog = ref(null)

onMounted(() => {
    fetchData()
})

// 表格过滤数据处理
const fetchData = () => {
    let { groupId, period } = props.itemData
    let params = { ...state.listQuery, groupId }
    params['interval.begin'] = period
    params['interval.end'] = period
    dialog.value.showLoading()
    getMerchantCostData(params).then(res => {
        let { total, list = [] } = res.data
        state.tableData = list
        state.total = total || 0
        dialog.value.closeLoading()
    }).catch(err => {
        state.tableData = []
        dialog.value.closeLoading()
    })
}
</script>

<style lang="scss" scoped>
.title {
    display: flex;
    font-size: 16px;

    .small-box {
        margin-right: 40px;
    }
    margin-bottom: 10px;
}
</style>


<template>
    <!-- 商户数据汇总-游戏抽成 -->
    <Dialog ref="dialog" title="游戏抽成" :isShowSubmit="false" @cancel="emits('close')" width="800" top="5vh">
        <div class="title">
            <div class="small-box">商户ID：{{itemData.groupId}}</div>
            <div class="small-box">月份：{{itemData.period}}</div>
        </div>
        <el-form class="filter-form" inline>
            <el-form-item label="站点ID:">
                <el-select v-model="state.merchantId" placeholder="请选择站点" filterable clearable reserve-keyword>
                    <!-- <el-option v-if="isShowAll" label="全部站点" :value="allValue" /> -->
                    <el-option v-for="item in itemData.siteList" :key="item.id" :label="item.name + `（ID：${item.id}）`" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData">搜 索</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="state.tableData" class="table-box" border>
            <el-table-column prop="merchantId" label="站点ID" min-width="120" align="center" />
            <el-table-column prop="vendor_" label="游戏平台" min-width="160" align="center" />
            <el-table-column prop="gameType_" label="游戏类型" min-width="120" align="center" />
            <el-table-column prop="shareRate" label="你的费率%" min-width="160" align="center" />
            <el-table-column prop="summaryRealFee" label="贡献额度" min-width="160" align="center" />
        </el-table>
        <Pagination v-show="state.total > 0" :total="state.total" v-model:size="state.listQuery._size" v-model:page="state.listQuery._page"
            @pagination="fetchData"></Pagination>
    </Dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import { getGameCommissionData } from '@/api/dataCenter'
import { dateFormat } from '@/common/util'

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
    merchantId: '',
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
    let params = { ...state.listQuery, groupId, merchantId: state.merchantId }
    params['interval.begin'] = period
    params['interval.end'] = period
    dialog.value.showLoading()
    getGameCommissionData(params).then(res => {
        let { total, list } = res.data
        state.tableData = list || []
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

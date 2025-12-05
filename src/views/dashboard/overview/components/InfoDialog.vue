<template>
    <!-- 首页-总览数据-数据详情 -->
    <Dialog ref="dialog" width="1100" :title="itemData.title" :isShowSubmit="false" top="5vh" @cancel="emits('close')">
        <div>
            <el-table :data="state.tableData" border>
                <el-table-column fixed="left" prop="id" label="商户ID" min-width="140" align="center" />
                <el-table-column fixed="left" prop="name" label="商户名称" min-width="140" align="center" />
                <el-table-column label="开站日期" min-width="120" align="center">
                    <template #default="{ row }">
                        {{row.addTime && dateFormat(row.addTime,'YYYY-MM-DD')}}
                    </template>
                </el-table-column>
                <el-table-column label="已充值费用/人工" min-width="160" align="center">
                    <template #default="{ row }">
                        {{ row.rechargeAmount || 0 }}/<span
                            :style="{'color': row.adjustAmount < 0 ? 'red' : '#606266'}">{{ row.adjustAmount || 0}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="totalFee" label="已产生费用" min-width="120" align="center" />
                <el-table-column prop="status_" label="状态" min-width="120" align="center" />
                <el-table-column prop="telegram" label="TG联系方式" min-width="120" align="center" />
                <el-table-column prop="businessName" label="所属商务" min-width="140" align="center" />
                <el-table-column prop="overdraftFee" label="所欠费用" min-width="120" align="center" />
                <el-table-column prop="merchantNum" label="已建子站点" min-width="120" align="center" />
                <el-table-column prop="cdnFee" label="CDN费用" min-width="120" align="center" />
            </el-table>
            <Pagination v-show="state.total > 0" :total="state.total" v-model:size="state.listQuery._size" v-model:page="state.listQuery._page"
                @pagination="fetchData"></Pagination>
        </div>
    </Dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import { getOverviewDetail } from '@/api/dashboard'
import { dateFormat } from '@/common/util'

const emits = defineEmits(['close'])
const props = defineProps({
    itemData: {
        type: Object,
        default: {}
    },
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

const fetchData = () => {
    let params = {
        type: props.itemData.tab,
        ...state.listQuery
    }
    dialog.value.showLoading()
    getOverviewDetail(params).then(({ data = {} }) => {
        let { total, list } = data
        state.tableData = list || []
        state.total = total
        dialog.value.closeLoading()
    }).catch(err => {
        state.tableData = []
        dialog.value.closeLoading()
    })
}
</script>

<style lang="scss">
</style>

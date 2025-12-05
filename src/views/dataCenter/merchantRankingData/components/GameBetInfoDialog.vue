<template>
    <!-- 商户排行数据-商户总投注-商户总投注游戏 -->
    <Dialog ref="dialog" width="800" title="商户总投注游戏" :isShowSubmit="false" top="5vh" @cancel="emits('close')">
        <el-table :data="state.tableData" border>
            <el-table-column prop="gameName" label="游戏名称" min-width="130" align="center" />
            <el-table-column prop="gameId" label="游戏ID" min-width="100" align="center" />
            <el-table-column prop="validCoinSum" label="投注金额" min-width="160" align="center" />
        </el-table>
        <Pagination v-show="state.total > 0" :total="state.total" v-model:size="state.listQuery._size" v-model:page="state.listQuery._page"
            @pagination="fetchData"></Pagination>
    </Dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import { getMerchantBetData } from '@/api/dataCenter'

const emits = defineEmits(['close'])
const props = defineProps({
    itemData: {
        type: Object,
        default: {}
    },
})
const state = reactive({
    initData: [],
    tableData: [],
    total: 0,
    listQuery: {
        _page: 1,
        _size: 10,
    },
})
const dialog = ref(null)

onMounted(() => {
    let params = { ...props.itemData }
    let { receiveTime } = params
    if (receiveTime && receiveTime.length) {
        params['interval.begin'] = receiveTime[0]
        params['interval.end'] = receiveTime[1]
    }
    delete params.receiveTime
    dialog.value.showLoading()
    getMerchantBetData(params).then(({ data = [] }) => {
        state.initData = data || []
        state.total = state.initData.length
        fetchData()
        dialog.value.closeLoading()
    }).catch(err => {
        dialog.value.closeLoading()
    })
})

const fetchData = () => {
    let { _page, _size } = state.listQuery
    state.tableData = state.initData.slice((_page - 1) * _size, _page * _size)
}
</script>

<style lang="scss">
</style>

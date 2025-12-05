<template>
    <!-- 商户排行数据-商户总投注 -->
    <div>
        <Dialog ref="dialog" width="800" title="商户总投注" :isShowSubmit="false" top="5vh" @cancel="emits('close')">
            <el-table :data="state.tableData" border>
                <el-table-column prop="vendor_" label="游戏平台" min-width="130" align="center" />
                <el-table-column prop="gameType_" label="游戏类型" min-width="100" align="center" />
                <el-table-column label="投注金额" min-width="160" align="center">
                    <template #default="{ row }">
                        <span v-if="!row.validCoinSum">0</span>
                        <span v-else class="special pointer" @click="handleInfo(row)">
                            {{ row.validCoinSum }}
                        </span>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination v-show="state.total > 0" :total="state.total" v-model:size="state.listQuery._size" v-model:page="state.listQuery._page"
                @pagination="fetchData"></Pagination>
        </Dialog>

        <GameBetInfoDialog v-if="state.showInfoDialog" :itemData="state.currentItem" @close="state.showInfoDialog = false">
        </GameBetInfoDialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineAsyncComponent } from "vue"
import { getMerchantBetData } from '@/api/dataCenter'
const GameBetInfoDialog = defineAsyncComponent(() => import("./GameBetInfoDialog.vue"))

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
    currentItem: {},
    showInfoDialog: false
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

const handleInfo = ({ gameType, vendor }) => {
    state.currentItem = {
        ...props.itemData,
        gameType,
        vendor
    }
    state.showInfoDialog = true
}
</script>

<style lang="scss">
</style>

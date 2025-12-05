<template>
    <!-- 财务管理-商户账单核对表-游戏账单u -->
    <Dialog ref="dialog" width="900" title="游戏账单" top="5vh" :isShowSubmit="false" @cancel="cancel">
		<el-form class="filter-form" inline>
		    <el-form-item label="站点ID:">
		        <el-select v-model="state.merchantId" placeholder="请选择站点" filterable reserve-keyword>
		            <!-- <el-option v-if="isShowAll" label="全部站点" :value="allValue" /> -->
		            <el-option v-for="item in siteList" :key="item.id" :label="item.name + `（ID：${item.id}）`" :value="item.id" />
		        </el-select>
		    </el-form-item>
		    <el-form-item>
		        <el-button v-throttle type="primary" @click="getList">搜 索</el-button>
		    </el-form-item>
		</el-form>
        <el-table :data="tableData" border>
            <el-table-column prop="vendor_" label="游戏平台" min-width="100" align="center" />
            <el-table-column prop="gameType_" label="游戏类型" min-width="100" align="center" />
            <el-table-column prop="realShareRate" label="抽成" min-width="100" align="center">
                <template #default="{ row }">
                    <div>{{row.realShareRate}}%</div>
                </template>
            </el-table-column>
            <el-table-column prop="winCoin" label="输赢" min-width="100" align="center"/>
			<el-table-column prop="timesOrCoinIn" label="投注" min-width="100" align="center"/>
            <el-table-column prop="summaryRealFee" label="贡献" min-width="100" align="center"/>
        </el-table>
    </Dialog>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue';
import { getGameBill } from '@/api/financeManage'
import { getMerchantSiteList } from '@/api/common'
import { deepCopy } from '@/common/util'

const emits = defineEmits(['close'])
const props = defineProps(['itemdata'])
const dialog = ref(null)
const tableData = ref([])
const siteList = ref([])
const state = reactive({
	merchantId: ''
})

onMounted(() => {
	state.merchantId = deepCopy(props.itemdata.group.id)
    getList()
	getSiteList()
})

const getList = () => {
    getGameBill({ merchantId: state.merchantId, period: props.itemdata.period }).then(res => {
        if (res.code === 0) {
            tableData.value = res.data
        }
    })
}

const getSiteList = () => {
    dialog.value.showLoading()
    getMerchantSiteList({ groupId: props.itemdata.group.id }).then(res => {
        let { data = [] } = res
        siteList.value = data || []
        dialog.value.closeLoading()
    }).catch(err => {
        dialog.value.closeLoading()
    })
}

const cancel = () => {
    emits('close')
}
</script>

<style lang='scss'>
</style>
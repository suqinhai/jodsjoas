<template>
    <!-- 商户信息-站未出账单-游戏分成明细 -->
    <Dialog width="900" :title="`站点ID：${item.id} ${item.commissionMode === 2 ? '打码模式' : '损益模式'}`" top="5vh"
        :isShowSubmit="false" @cancel="cancel">
        <el-table :data="tableData" border>
            <el-table-column prop="name" label="游戏平台" min-width="100" align="center" />
            <el-table-column prop="typeLabel" label="游戏类型" min-width="100" align="center" />
            <el-table-column prop="maRate" label="你的费率%" min-width="100" align="center">
                <template #default="{ row }">
                    <template v-if="isBetMode(row.alias)">
                        <div>rtp&#62;100：{{row.rtpUpRate}}</div>
                        <div>rtp&#60;100：{{row.rtpDnRate}}</div>
                    </template>
                    <div v-else>{{row.maRate}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="rtpUpValidCoin" label="投注" min-width="100" align="center" v-if="item.commissionMode === 2">
                <template #default="{ row }">
                    <div v-if="isBetMode(row.alias)">rtp&#62;100：{{row.rtpUpValidCoin}}</div>
                    <div v-if="isBetMode(row.alias)">rtp&#60;100：{{row.rtpDnValidCoin}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="winLoseCoin" label="输赢" min-width="100" align="center" />
            <el-table-column prop="totalCoin" label="贡献" min-width="100" align="center">
                <template #default="{ row }">
                    <template v-if="isBetMode(row.alias)">
                        <div>rtp&#62;100：{{row.rtpUpTotalCoin}}</div>
                        <div>rtp&#60;100：{{row.rtpDnTotalCoin}}</div>
                    </template>
                    <div v-else>{{row.totalCoin}}</div>
                </template>
            </el-table-column>
        </el-table>
    </Dialog>
</template>

<script setup>
import { onMounted, ref, defineEmits, inject } from 'vue';


import { getUnPendingShareData } from '@/api/merchantConfig'
import userStore from '@/store/user'
const provideData = inject('provideData')

const emits = defineEmits(['close'])
const props = defineProps(['item'])
const userData = userStore()
const tableData = ref([])

onMounted(() => {
    getList()
})

const isBetMode = (alias) => {
    return props.item.commissionMode === 2 && ['PGC', 'JL', 'NPP'].includes(alias)

}

const getList = () => {
    let params = {
        groupId: provideData.merchantId,
        id: props.item.id
    }
    getUnPendingShareData(params).then(res => {
        if (res.code === 0) {
            tableData.value = res.data
        }
    })
}

const cancel = () => {
    emits('close')
}
</script>

<style lang='scss'>
</style>
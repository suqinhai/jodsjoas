<template>
    <!-- 流量配置 -->
    <div class="traffic-config">
        <div class="head" v-permiss="'merchant.traffic-stat.configEdit'">
            <el-button style="width: 80px" v-throttle type="primary" @click="state.showDialog = true">修 改</el-button>
        </div>

        <el-table :data="state.tableData" border style="width: 1080px">
            <el-table-column label="流量类型" min-width="120px" align="center">
                <template #default="{ row }">
                    {{row.type === 1 ? 'AWS' : 'Cloudflare'}}
                </template>
            </el-table-column>
            <el-table-column prop="free" label="免费流量(GB)" min-width="120px" align="center" />
            <el-table-column prop="exceedPrice" label="超出流量单价(U)" min-width="120px" align="center" />
            <el-table-column prop="freeDomainNum" label="超出域名数" min-width="120px" align="center" />
            <el-table-column prop="exceedDomainPrice" label="超出域名单价(U)" min-width="120px" align="center" />
        </el-table>

        <DeployDialog :itemData="state.tableData[0] || {}" v-if="state.showDialog" @close="state.showDialog = false" @getData="getData">
        </DeployDialog>
    </div>
</template>

<script setup name="trafficConfig">
import { reactive, onMounted, defineAsyncComponent } from "vue"
import { getTrafficConfig } from '@/api/systemSettings.js'
const DeployDialog = defineAsyncComponent(() => import("./components/DeployDialog.vue"))

const state = reactive({
    tableData: [],
    showDialog: false,
})

onMounted(() => {
    getData()
})

const getData = () => {
    globalVBus.$emit('globalLoading', true)
    getTrafficConfig().then(res => {
        state.tableData = res.data || []
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        state.tableData = []
        globalVBus.$emit('globalLoading', false)
    })
}
</script>

<style lang="scss">
.traffic-config {
    .head {
        width: 1080px;
        margin-bottom: 10px;
        padding: 0 20px;
        display: flex;
        justify-content: flex-end;
    }
}
</style>

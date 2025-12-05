<template>
    <!-- 充值配置 -->
    <div class="container recharge-config">
        <div class="head">
            <span class="title">笔笔送:</span>
            <el-input-number :disabled="state.isDisabled" v-model="state.everytimeAward" style="width: 150px" :controls="false"
                :precision="2" :max="1" :min="0" placeholder="请输入赠送比例" />%
            <div class="operate">
                <el-button v-throttle type="primary" v-if="state.isDisabled" @click="state.isDisabled = false">编 辑</el-button>
                <el-button v-throttle type="primary" v-if="!state.isDisabled" @click="fetchData">取 消</el-button>
                <el-button v-throttle type="primary" v-if="!state.isDisabled" @click="handleSave(deployForm)">保 存</el-button>
            </div>
        </div>
        <el-table :data="state.rechangeList" border>
            <el-table-column align="center" prop="id" label="ID" min-width="100" />
            <el-table-column align="center" prop="rechargeAmount" label="充币额度u" min-width="120" />
            <el-table-column align="center" prop="ratio" label="赠送比例%" min-width="120" />
            <el-table-column align="center" prop="giftAmount" label="赠送额度u" min-width="120" />
            <el-table-column align="center" label="操作" fixed="right" min-width="100">
                <template #default="{row}">
                    <el-button v-permiss="'admin.merchant-recharge-config.edit'" type="primary" text
                        @click="state.itemData = {...row},state.showRechargeConfig = true">修改</el-button>
                </template>
            </el-table-column>
        </el-table>

        <DeployDialog v-if="state.showRechargeConfig" :itemData="state.itemData" @close="state.showRechargeConfig = false"
            @fetchData="fetchData">
        </DeployDialog>
    </div>
</template>

<script setup name="rechargeConfig">
import { defineAsyncComponent, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getMerchantRechargeConfig, editMerchantRechargeConfig } from '@/api/financeManage.js'
const DeployDialog = defineAsyncComponent(() => import("./components/DeployDialog.vue"))

const state = reactive({
    rechangeList: [],
    showRechargeConfig: false,
    itemData: {},
    isDisabled: true,
    everytimeAward: undefined
})

onMounted(() => {
    fetchData()
})

const fetchData = () => {
    globalVBus.$emit('globalLoading', true)
    getMerchantRechargeConfig().then(({ data, code, ext }) => {
        if (code === 0) {
            state.rechangeList = data || []
            state.everytimeAward = ext || 0
        }
        state.isDisabled = true
        globalVBus.$emit('globalLoading', false)
    }).catch(() => {
        state.rechangeList = []
        globalVBus.$emit('globalLoading', false)
    })
}

const handleSave = () => {
    if (typeof state.everytimeAward !== 'number') return ElMessage.warning('请配置笔笔送比例再进行提交！')
    globalVBus.$emit('globalLoading', true)
    editMerchantRechargeConfig({ sendRatio: state.everytimeAward }).then(res => {
        fetchData()
    }).catch(err => {
        globalVBus.$emit('globalLoading', false)
    })
}
</script>

<style lang="scss">
.recharge-config {
    .head {
        display: flex;
        align-items: center;
        padding-left: 10px;
        padding-bottom: 10px;
        .title {
            font-weight: 600;
            margin-right: 5px;
        }
        .operate {
            margin-left: 10px;
        }
    }
}
</style>

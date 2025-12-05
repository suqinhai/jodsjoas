<template>
    <!-- 厂家上分 -->
    <div class="container factory-recharge">
        <div class="head">
            <span class="title">分低于设定时预警</span>
            <el-input-number :disabled="state.isDisabled" v-model="state.earlyWarningNum" style="width: 150px" :controls="false"
                :precision="0" :min="0" placeholder="请输入分数预警值" />
            <div class="operate">
                <el-button v-throttle type="primary" v-if="state.isDisabled" @click="state.isDisabled = false">编 辑</el-button>
                <el-button v-throttle type="primary" v-if="!state.isDisabled" @click="fetchData">取 消</el-button>
                <el-button v-throttle type="primary" v-if="!state.isDisabled" @click="handleSave(deployForm)">保 存</el-button>
            </div>
        </div>
        <el-table :data="state.tableData" border style="width: 600px">
            <el-table-column prop="vendor" label="游戏厂家" min-width="100" align="center" />
            <el-table-column prop="balance" label="当前分" min-width="120" align="center" />
        </el-table>
    </div>
</template>

<script setup name="factoryRecharge">
import { reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getMerchantRechargeConfig, editMerchantRechargeConfig } from '@/api/financeManage.js'

const state = reactive({
    tableData: [],
    isDisabled: true,
    earlyWarningNum: undefined
})

onMounted(() => {
    // fetchData()
})

const fetchData = () => {
    globalVBus.$emit('globalLoading', true)
    getMerchantRechargeConfig().then(({ data, code, ext }) => {
        if (code === 0) {
            state.rechangeList = data || []
            state.earlyWarningNum = ext || 0
        }
        state.isDisabled = true
        globalVBus.$emit('globalLoading', false)
    }).catch(() => {
        state.rechangeList = []
        globalVBus.$emit('globalLoading', false)
    })
}

const handleSave = () => {
    if (typeof state.earlyWarningNum !== 'number') return ElMessage.warning('请配置分数预警值再进行提交！')
    globalVBus.$emit('globalLoading', true)
    editMerchantRechargeConfig({ sendRatio: state.earlyWarningNum }).then(res => {
        fetchData()
    }).catch(err => {
        globalVBus.$emit('globalLoading', false)
    })
}
</script>

<style lang="scss">
.factory-recharge {
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

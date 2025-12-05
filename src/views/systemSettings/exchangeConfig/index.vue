<template>
    <!-- 汇率配置 -->
    <div class="exchangeConfig">
        <div class="configSet">
            <el-row>
                <el-col :span="4">
                    <el-form-item label="更新方式：">
                        自动同步
                        <!-- <el-radio-group v-model="updateType">
                        <el-radio :label="1" :disabled="true">自动同步</el-radio>
                    </el-radio-group> -->
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="同步频率：">
                        30分钟
                        <!-- <el-radio-group v-model="updateRate">
                        <el-radio :label="1" :disabled="true"></el-radio>
                    </el-radio-group> -->
                    </el-form-item>
                </el-col>
            </el-row>
        </div>
        <el-table :data="exchangeRateConfigListData" border table-layout="auto">
            <el-table-column prop="baseCurrency" label="原币种" align="center" />
            <el-table-column prop="localCurrency" label="兑换币种" align="center" />
            <el-table-column prop="source_" label="汇率来源" align="center" />
            <el-table-column prop="rate" label="市场汇率" align="center" />
        </el-table>
    </div>
</template>

<script setup name="exchangeConfig">
import { useIndexHook } from './index.js'
const { updateType, updateRate, exchangeRateConfigListData } = useIndexHook()

</script>

<style lang="scss" scoped></style>

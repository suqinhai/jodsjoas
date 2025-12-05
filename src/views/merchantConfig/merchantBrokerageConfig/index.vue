<template>
    <!-- 商户佣金配置 -->
    <div class="container merchant-brokerage-config">
        <div class="title">推广商户配置</div>
        <el-form ref="deployForm" :disabled="state.isDisabled" :model="state.formData" :rules="state.rules" label-width="200px">
            <el-form-item label="开站成功奖励U:" prop="successAward">
                <el-input-number v-model="state.formData.successAward" style="width: 200px" :controls="false" :precision="2"
                    :min="0" placeholder="请输入开站成功奖励" />
            </el-form-item>
            <el-form-item label="最低领奖额度:" prop="lowestAward">
                <el-input-number v-model="state.formData.lowestAward" style="width: 200px" :controls="false" :precision="2"
                    :min="0" placeholder="请输入最低领奖额度" />
            </el-form-item>
            <el-form-item label="预缴额度奖励U:">
                <el-table :data="state.formData.vips" border style="width: 600px">
                    <el-table-column prop="id" label="ID" width="100" align="center" />
                    <el-table-column label="缴费额度U" min-width="140" align="center">
                        <template #default="{ row, $index }">
                            <el-form-item :prop="'vips.' + $index + '.qr'" :rules="[
                                {
                                    required: true,
                                    message: '',
                                    trigger: 'change',
                                },
                            ]">
                                <el-input-number v-model="row.qr" style="width: 100%" :controls="false" :precision="2" :min="0"
                                    placeholder="请输入缴费额度" />
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="奖励U" min-width="140" align="center">
                        <template #default="{ row, $index }">
                            <el-form-item :prop="'vips.' + $index + '.qc'" :rules="[
                                {
                                    required: true,
                                    message: '',
                                    trigger: 'change',
                                },
                            ]">
                                <el-input-number v-model="row.qc" style="width: 100%" :controls="false" :precision="2" :min="0"
                                    placeholder="请输入奖励金额" />
                            </el-form-item>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
        <div class="foot">
            <el-button v-throttle type="primary" v-if="state.isDisabled" @click="state.isDisabled = false">编 辑</el-button>
            <el-button v-throttle type="primary" v-if="!state.isDisabled" @click="getData">取 消</el-button>
            <el-button v-throttle type="primary" v-if="!state.isDisabled" @click="handleSave(deployForm)">保 存</el-button>
        </div>
    </div>
</template>

<script setup name="merchantBrokerageConfig">
import { ref, reactive, onMounted } from 'vue'
import { getPromoteApplyList } from "@/api/merchantConfig.js"

const state = reactive({
    formData: {
        vips: [
            { id: 1, qr: 100, qc: 200 }
        ]
    },
    rules: {
        successAward: [{ required: true, message: '请输入开站成功奖励！', trigger: 'change' }],
        lowestAward: [{ required: true, message: '请输入最低领奖额度！', trigger: 'change' }],
    },
    isDisabled: true
})
const deployForm = ref(null)

onMounted(() => {
    // getData()
})

const getData = () => {
    globalVBus.$emit('globalLoading', true)
    getPromoteApplyList().then(res => {
        // let { total, list = [] } = res.data
        state.isDisabled = true
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        state.tableData = []
        globalVBus.$emit('globalLoading', false)
    })
}

// 保存
const handleSave = (el) => {
    el.validate((valid, fields) => {
        if (valid) {
            let obj = { ...state.formData }
            globalVBus.$emit('globalLoading', true)
            // postHomeDeploy({
            //     part: 'cs',
            //     alias: 'cs',
            //     status: 1,
            //     cs: JSON.stringify(obj)
            // }).then(() => {
            //     getData()
            // }).catch(() => {
            //     globalVBus.$emit('globalLoading', false)
            // })
        } else {
            ElMessage.warning('请完善配置内容再进行提交！')
        }
    })
}
</script>

<style lang="scss">
.merchant-brokerage-config {
    .title {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 20px;
    }
    .foot {
        margin-top: 50px;
        width: 500px;
        display: flex;
        justify-content: flex-end;
    }
}
</style>

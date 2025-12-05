<template>
    <!-- 商户站点管理-VIP控制余额限制修改 -->
    <Dialog ref="dialog" width="500" :title="itemData.id ? 'VIP控制余额限制' : 'VIP控制余额限制初始配置'" top="5vh" buttonCenter @confirm="handleSubmit(operateForm)" @cancel="cancel">
        <div class="head" v-if="!itemData.id">
            <span class="label">币种:</span>
            <el-select style="width: 150px" v-model="state.type" placeholder="请选择币种" @change="selectChange">
                <el-option v-for="item in metaData.currency" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </div>
        <div class="head" v-else>
            <span class="label">商户ID:</span>
            <span class="text">{{itemData.id}}</span>
        </div>
        <el-form ref="operateForm" :model="state.formData" :rules="state.rules">
            <el-table :data="state.formData" class="table-box" border>
                <el-table-column label="VIP等级" min-width="100" align="center">
                    <template #default="{ row }">
                        VIP{{row.level}}
                    </template>
                </el-table-column>
                <el-table-column label="余额限制" min-width="140" align="center">
                    <template #default="{ row,$index }">
                        <el-form-item :prop="$index + '.balanceLimit'" :rules="
                                { required: true, message: '', trigger: 'blur' }">
                            <el-input-number v-model="row.balanceLimit" :controls="false" :precision="0" placeholder="请输入大于0的整数" :min="1" />
                        </el-form-item>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
        <div class="tips" v-if="!!itemData.id">
            注：商户对会员进行控制时，根据系统和商户的配置，取最小值；
            如：系统限制VIP3余额上限1000，商户配置余额限制200，则以200为准，商户余额限制配置1300，则以1000为准。
        </div>
        <div class="tips" v-else>
            <div>注：汇率按照巴西比例对应换算：</div>
            <div>BRL 1.00 = 2,777 IDR</div>
            <div>BRL 1.00 = PHP 10</div>
            <div>BRL 1.00 = 4,500VND</div>
            <div>BRL 1.00 = 15 INR</div>
            <div>BRL 1.00 = 6 THB</div>
        </div>
    </Dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref, reactive, onMounted } from 'vue'
import { postMemberRiskControlLimit, getMemberRiskControlLimit } from '@/api/merchantConfig.js'

const emits = defineEmits(['close'])
const props = defineProps({
    itemData: {
        type: Object,
        default: () => {
            return {}
        }
    },
    metaData: {
        type: Object,
        default: () => {
            return {}
        }
    },
})
const dialog = ref(null)
const operateForm = ref(null)
const state = reactive({
    formData: [],
    initData: {},
    type: '',
})

onMounted(() => {
    if (!props.itemData.id && props.metaData.currency.length) {
        state.type = props.metaData.currency[0].value
        getConfig()
        return
    }
    state.formData = props.itemData.limits || []
})

const getConfig = () => {
    dialog.value.showLoading()
    getMemberRiskControlLimit().then((res) => {
        state.initData = res.data || {}
        state.formData = state.initData[state.type] || []
        dialog.value.closeLoading()
    }).catch(() => {
        dialog.value.closeLoading()
    })
}

const selectChange = (val) => {
    state.formData = state.initData[val] || []
}

const handleSubmit = (el) => {
    el.validate((valid, fields) => {
        if (valid) {
            let params = {
                limits: JSON.stringify(state.formData)
            }
            params.merchantId = props.itemData.id || 0
            if (!props.itemData.id) {
                params.currency = state.type
            }
            dialog.value.showLoading()
            postMemberRiskControlLimit(params).then(() => {
                if (props.itemData.id) {
                    emits('close')
                } else {
                    getConfig()
                }
            }).catch(() => {
                dialog.value.closeLoading()
            })
        } else {
            ElMessage.warning('请完善表单内容再进行提交！')
        }
    })
}

const cancel = () => {
    emits('close')
}
</script>

<style scoped lang="scss">
.head {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .label {
        font-weight: bold;
        margin-right: 10px;
        display: flex;
        align-items: center;
    }
    .text {
        margin-top: 2px;
    }
}
.tips {
    color: red;
    margin-top: 10px;
    line-height: 16px;
}
</style>

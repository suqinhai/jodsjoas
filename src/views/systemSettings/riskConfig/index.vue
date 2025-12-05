<template>
    <!-- 风控配置 -->
    <div class="riskConfig">
        <div class="filterAndEdit">
            <div class="filter-box">
                <span style="font-weight: 600;margin-right: 5px">商户等级：</span>
                <el-select style="width: 150px" v-model="state.level" placeholder="请选择商户等级" @change="riskListGet">
                    <el-option v-for="item in state.merchantLevel" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <span style="font-weight: 600;margin: 0 5px 0 30px">初始授信额度U：</span>
                <el-input-number :disabled="!state.isEdit" v-model="state.initMaxOverdraft" :controls="false" :min="0" />
            </div>

            <div v-permiss="'admin.merchant-level-config.riskEdit'">
                <el-button v-throttle v-if="state.isEdit" @click="riskListGet">取 消</el-button>
                <el-button v-throttle v-if="state.isEdit" type="primary" @click="handleSave(editFormRef)">保 存</el-button>
                <el-button v-throttle v-if="!state.isEdit" type="primary" @click="state.isEdit = true">修 改</el-button>
            </div>
        </div>

        <el-form ref="editFormRef" :model="state.formData" label-width="0px">
            <el-table :data="state.formData" border>
                <el-table-column align="center" prop="id" label="ID" width="100px" />
                <el-table-column align="center" prop="typeLabel" label="类型" width="120px" />
                <el-table-column align="center" prop="value" label="设定值" width="150px">
                    <template #default="{row,$index}">
                        <span v-if="!state.isEdit">{{ row.value }}</span>
                        <el-form-item v-if="state.isEdit" :prop="$index + '.value'"
                            :rules="[{ required: true, message: ' ', trigger: 'blur' }]">
                            <el-input-number v-model="row.value" :controls="false" :min="0" />
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="预警颜色" width="150px">
                    <template #default="{row}">
                        <div class="early-warning-color">
                            <span class="color-box" :style="{ background: row.color ? row.color : '#000' }">
                                {{ row.color }}
                            </span>
                            <el-color-picker v-if="state.isEdit" v-model="row.color" :disabled="!state.isEdit" />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="说明" />
            </el-table>
        </el-form>
    </div>
</template>

<script setup name="riskConfig">
import { reactive, onMounted, ref } from "vue"
import { ElMessage } from 'element-plus'
import { commonMetasApi } from '@/api/common.js'
import { getRiskList, riskEdit } from '@/api/systemSettings.js'

const state = reactive({
    level: '',
    initMaxOverdraft: undefined,
    formData: [],
    merchantLevel: [],
    isEdit: false,
})
const editFormRef = ref(null)

onMounted(async () => {
    const res = await commonMetasApi({ types: 'merchantLevel' })
    if (res.code == 0) {
        state.merchantLevel = res.data.merchantLevel
        state.level = state.merchantLevel[0].value
        riskListGet()
    }
})

//风控列表查询
const riskListGet = async () => {
    try {
        globalVBus.$emit('globalLoading', true)
        const res = await getRiskList({ level: state.level })
        if (res.code == 0) {
            state.formData = res.data.map((item) => {
                if (item.color) {
                    item.color = '#' + item.color
                }
                // item.initValue = item.value
                return item
            })
            state.initMaxOverdraft = res.ext && res.ext.overdraft ? +res.ext.overdraft : 0
        }
        state.isEdit = false
        globalVBus.$emit('globalLoading', false)
    } catch (err) {
        globalVBus.$emit('globalLoading', false)
    }
}

const handleSave = (el) => {
    if (!state.formData.length) return
    el.validate((valid, fields) => {
        if (valid) {
            let params = []
            state.formData.forEach((item) => {
                params.push({
                    value: item.value,
                    color: item.color && item.color.indexOf('#') > -1 ? item.color.split('#')[1] : '',
                    id: item.id,
                })
            })
            globalVBus.$emit('globalLoading', true)
            riskEdit({
                risk: JSON.stringify(params),
                level: state.level,
                overdraft: state.initMaxOverdraft
            }).then(() => {
                riskListGet()
            }).catch((err) => {
                globalVBus.$emit('globalLoading', false)
            })
        } else {
            ElMessage.warning('请完善表格内容再进行提交！')
        }
    })
}
</script>

<style lang="scss">
.riskConfig {
    .filterAndEdit {
        margin-bottom: 10px;
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        .filter-box {
            display: flex;
            align-items: center;
        }
    }
    .riskControlRemind {
        &_text {
            margin: 10px 0;
            font-weight: bold;
        }
    }
    .early-warning-color {
        display: flex;
        align-items: center;

        .color-box {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 10px;
        }
    }
}
</style>

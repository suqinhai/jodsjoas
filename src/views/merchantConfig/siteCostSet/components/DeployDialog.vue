<template>
    <!-- 站点费用设置-修改 -->
    <Dialog ref="dialog" width="450" title="修改" top="10vh" buttonCenter @confirm="handleSubmit(operateForm)" @cancel="cancel">
        <el-form ref="operateForm" :rules="state.rules" :model="state.formData" label-width="100px">
            <el-row>
                <el-col :span="10">
                    <el-form-item label="站点ID:">
                        {{itemData.siteId}}
                    </el-form-item>
                </el-col>
                <el-col :span="14">
                    <el-form-item label-width="85px" label="站点名称:">
                        {{itemData.name}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="开版费U:" prop="openFee">
                <el-input-number style="width: 100%" v-model="state.formData.openFee" placeholder="请输入开版费" :controls="false" :precision="0"
                    :min="0" />
            </el-form-item>
            <el-form-item label="线路费用U:" prop="lineCost">
                <el-input-number style="width: 100%" v-model="state.formData.lineCost" placeholder="请输入线路费用" :controls="false" :precision="0"
                    :min="0" />
            </el-form-item>
            <el-form-item label="游戏月保底:" prop="monthMin">
                <el-input-number style="width: 100%" v-model="state.formData.monthMin" placeholder="请输入游戏月保底" :controls="false" :precision="0"
                    :min="0" />
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script setup>
import Dialog from '@/components/Dialog/index.vue'
import { ElMessage } from 'element-plus'
import { ref, reactive, onMounted } from 'vue'
import { merchantCostConfigEditApi } from '@/api/merchantConfig'

const emits = defineEmits(['fetchData', 'close'])
const props = defineProps({
    itemData: {
        type: Object,
        default: {}
    },
})
const dialog = ref(null)
const operateForm = ref(null)
const state = reactive({
    formData: {},
    rules: {
        openFee: [{ required: true, message: '请输入开版费！', trigger: 'blur' }],
        lineCost: [{ required: true, message: '请输入线路费用！', trigger: 'blur' }],
        monthMin: [{ required: true, message: '请输入游戏月保底！', trigger: 'blur' }],
    },
})

onMounted(() => {
    let { openFee, lineCost, monthMin, siteId } = props.itemData
    state.formData = {
        openFee,
        lineCost,
        monthMin,
        merchantId: siteId,
        identity: 1
    }

})

const handleSubmit = (el) => {
    el.validate((valid, fields) => {
        if (valid) {
            dialog.value.showLoading()
            merchantCostConfigEditApi(state.formData).then(() => {
                emits('close')
                emits('fetchData')
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
</style>

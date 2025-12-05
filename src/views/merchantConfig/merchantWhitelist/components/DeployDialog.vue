<template>
    <Dialog ref="dialog" width="500" :title="itemData.merchant ? '修改':'新增'" top="10vh" @confirm="handleSubmit(operateForm)" @cancel="cancel">
        <el-form ref="operateForm" :rules="state.rules" :model="state.formData" label-width="75px">
            <el-form-item label="商户ID:" prop="merchantId" v-if="!itemData.id">
                <el-input-number :disabled="state.isSearch" v-model="state.formData.merchantId" style="width: 266px;margin-right: 15px"
                    placeholder="请输入商户ID" :controls="false" :precision="0" :min="1" />
                <el-button v-throttle type="primary" @click="handleSearch">{{state.isSearch ?'重 置':'搜 索'}}</el-button>
            </el-form-item>
            <el-row>
                <el-col :span="9">
                    <el-form-item label="商户ID:">
                        <span>{{state.merchantInfo?.id || ''}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="15">
                    <el-form-item label-width="85px" label="商户名称:">
                        <span>{{state.merchantInfo?.name || ''}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="IP:" prop="ips">
                <el-input :disabled="!state.isSearch" v-model="state.formData.ips" type="textarea" style="width:100%" :rows="4"
                    placeholder="请输入IP，多个需要用英文逗号隔开" />
            </el-form-item>
            <el-form-item label="备注:">
                <el-input :disabled="!state.isSearch" style="width: 100%" type="textarea" :rows="4" placeholder="请输入备注"
                    v-model="state.formData.remark" show-word-limit maxlength="50" />
            </el-form-item>

        </el-form>
    </Dialog>
</template>

<script setup>
import Dialog from '@/components/Dialog/index.vue'
import { ElMessage } from 'element-plus'
import { ref, reactive, onMounted } from 'vue'
import { postMerchantWhitelistConfig } from '@/api/merchantConfig'
import { getMerchantData } from '@/api/common'

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
        ips: [
            { required: true, message: '请输入IP！', trigger: 'blur' },
            {
                pattern: /^\d[0-9.,]*\d$/,
                message: '请输入正确格式的IP，多个需要用英文逗号隔开！',
                trigger: 'change',
            }
        ],
        merchantId: [{ required: true, message: '请输入商户ID！', trigger: 'blur' }],
    },
    isSearch: false,
    merchantInfo: {},
})

onMounted(() => {
    if (props.itemData.id) {
        let { remark, group, ips, id } = props.itemData
        state.formData = {
            remark,
            ips,
            merchantId: group.id,
            id
        }
        state.merchantInfo = { ...group }
        state.isSearch = true
    }

})

const handleSearch = () => {
    if (state.isSearch) {
        delete state.formData.merchantId
        state.merchantInfo = {}
        state.isSearch = false
    } else {
        if (!state.formData.merchantId) {
            return ElMessage.warning('请输入商户ID再进行搜索！')
        }
        dialog.value.showLoading()
        getMerchantData({ id: state.formData.merchantId }).then(({ code, data }) => {
            if (code === 0 && data) {
                state.merchantInfo = data
                state.formData.merchantId = state.merchantInfo.id
                state.isSearch = true
            } else {
                ElMessage.warning(`未查询到此商户ID信息！`)
            }
            dialog.value.closeLoading()
        }).catch((data) => {
            dialog.value.closeLoading()
        })
    }
}

const handleSubmit = (el) => {
    el.validate((valid, fields) => {
        if (valid) {
            state.formData.type = 0
            state.formData.ips = Array.from(new Set(state.formData.ips.split(','))).join(',')
            dialog.value.showLoading()
            postMerchantWhitelistConfig(state.formData).then(() => {
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

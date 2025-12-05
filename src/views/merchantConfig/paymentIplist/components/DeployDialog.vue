<template>
    <Dialog ref="dialog" width="500" :title="itemData.id ? '修改':'新增'" top="10vh" @confirm="handleSubmit(operateForm)" @cancel="cancel">
        <el-form ref="operateForm" :rules="state.rules" :model="state.formData" label-width="105px">
            <el-form-item label="支付IP:" prop="ip">
                <el-input  v-model="state.formData.ip" type="input" style="width:100%"
                    placeholder="请输入IP" />
            </el-form-item>
            <el-form-item label="内网代理IP:" prop="localIp">
                <el-input v-model="state.formData.localIp" type="input" style="width:100%"
                    placeholder="请输入内网代理IP" />
            </el-form-item>
            <el-form-item label="端口号:" prop="point">
                <el-input v-model="state.formData.point" type="input" style="width:100%" 
                    placeholder="请输入端口号" maxlength="4" />
            </el-form-item>
            <el-form-item label="备注:">
                <el-input style="width: 100%" type="textarea" :rows="4" placeholder="请输入备注"
                    v-model="state.formData.remark" show-word-limit maxlength="100" />
            </el-form-item>

        </el-form>
    </Dialog>
</template>

<script setup>
import Dialog from '@/components/Dialog/index.vue'
import { ElMessage } from 'element-plus'
import { ref, reactive, onMounted } from 'vue'
import { getIpList, postAddIp, postDeleteIp, getIpDetail } from '@/api/merchantConfig'

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
        ip: [
            { required: true, message: '请输入IP！', trigger: [ 'blur', 'change' ] },
            {
                pattern: /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                message: '请输入正确的IP！',
                trigger: 'change',
            }
        ],
        localIp: [
            { required: true, message: '请输入IP！', trigger: [ 'blur', 'change' ] },
            {
                 pattern: /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                message: '请输入正确的IP！',
                trigger: 'change',
            }
        ],
        point: [
            { required: true, message: '请输入端口号！', trigger: [ 'blur', 'change' ] },
            {
                pattern: /^\d{1,4}$/,
                message: '请输入正确的端口号！',
                trigger: 'change',
            }
        ],

    },
    isSearch: false,
    merchantInfo: {},
})

onMounted(() => {
    if (props.itemData.id) {
        // let { remark, group, ips, id } = props.itemData
        let { remark, group, ip, localIp, point, id } = props.itemData
        state.formData = {
            remark,
            ip,
            localIp,
            point,
            // merchantId: group.id,
            id
        }
        state.merchantInfo = { ...group }
        state.isSearch = true
    }

})



const handleSubmit = (el) => {
    el.validate((valid, fields) => {
        if (valid) {
            dialog.value.showLoading()
            postAddIp(state.formData).then(() => {
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

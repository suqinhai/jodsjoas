
<template>
    <Dialog ref="dialog" width="580" title="配置支付IP" top="10vh" buttonCenter @confirm="handleSubmit(operateForm)" @cancel="cancel">
        <el-form ref="operateForm" :model="state.formData" :rules="state.rules" label-width="100px">
            <el-row>
                <el-col :span="10">
                    <el-form-item label="商户ID:">
                        {{itemData.id}}
                    </el-form-item>
                </el-col>
                <el-col :span="14">
                    <el-form-item label-width="85px" label="商户名称:">
                        {{itemData.name}}
                    </el-form-item>
                </el-col>
            </el-row>
			<el-form-item label="支付IP:" prop="ipConfigId" >
			    <el-select v-model="state.formData.ipConfigId" placeholder="请选择支付IP" filterable reserve-keyword clearable>
                    <el-option v-for="item in ipList" :key="item.id" :label="item.merchantIds ? item.ip + `（${item.merchantIds}）` : item.ip" :value="item.id" />
			    </el-select>
			</el-form-item>
            <div class="tips">
                <p>独立IP费用 </p>
                <p>温馨提示：</p>
                <p>选择支付IP后，该商户对接三方支付将使用该IP进行加白，其他IP都不生效。</p>
                <p>清除支付IP后，该商户对接三方支付将使用公共IP进行加白。</p>
            </div>
        </el-form>
    </Dialog>
</template>

<script setup>
import Dialog from '@/components/Dialog/index.vue'
import { ElMessage } from 'element-plus'
import { ref, reactive, onMounted, computed } from 'vue'
import { getMerchantSiteList } from '@/api/common'
import { deepCopy } from '@/common/util/index.js'
import { getIpList, postAddIp, postDeleteIp, getIpDetail, postAuthIp } from '@/api/merchantConfig'


const emits = defineEmits(['fetchData', 'close'])
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
const ipList = ref([])
const state = reactive({
    formData: {
    },
    rules: {
        // ipConfigId: { required: true, message: '请选择支付IP！', trigger: 'change' },
    },
    merchantId: ''
})

onMounted(() => {
    let { id, ipConfigId } = props.itemData
    state.formData = {
		merchantId: id,
		ipConfigId: ipConfigId,
    }
    fetchData()
})

const handleSubmit = (el) => {
    el.validate((valid, fields) => {
        if (valid) {
            let params = { 
                groupId: props.itemData.id,
                ipConfigId: state.formData.ipConfigId
            }
            postAuthIp(params).then(() => {
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
const fetchData = () => {
    globalVBus.$emit('globalLoading', true)
    getIpDetail().then(res => {
        ipList.value = res.data || []
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
         ipList.value = []
        globalVBus.$emit('globalLoading', false)
    })
}
</script>

<style scoped lang="scss">
.tips p{
    font-size: 14px;
    line-height: 24px;
}


</style>

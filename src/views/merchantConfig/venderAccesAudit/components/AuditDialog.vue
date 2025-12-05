<!--
 * @Author: yilaisai
 * @Date: 2024-01-30 09:47:12
 * @LastEditors: yilaisai
 * @LastEditTime: 2024-01-30 10:30:38
-->
<template>
    <Dialog ref="dialog" width="600" title="审核" top="10vh" :isCancel="false" :operateActions="['拒绝', '通过']"
        @confirm="handleSubmit(2)" @cancel="handleSubmit(3)" @close="emits('close')">
        <el-form :model="state.formData" label-width="145px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="商户ID:">
                        {{(itemData.merchant && itemData.merchant.id) ? itemData.merchant.id : ''}}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="商户名称:">
                        {{(itemData.merchant && itemData.merchant.name) ? itemData.merchant.name : ''}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="厂家名称:">
                        {{itemData.alias_}}
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="itemData.rtpFlag === 0">
                    <el-form-item label="厂家分成:">
                        {{itemData.vendorRate}}%
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="商户分成比例:" prop="shareRate" v-if="itemData.rtpFlag === 0">
                <el-input-number style="width: 150px;margin-right: 5px" v-model="state.formData.shareRate" :controls="false"
                    :precision="2" :max="100" :min="0.01" placeholder="请输入商户分成比例" />%
            </el-form-item>
			<template v-if="itemData.rtpFlag === 1">
			    <el-form-item label="rtp＞100抽成(%):">
			        <el-input class="inputWidth" v-model="state.formData.upShareRate" placeholder="请输入(0-100)范围内的值" :maxlength="8"
			            style="width: 200px;"></el-input>
			    </el-form-item>
			    <el-form-item label="rtp＜100抽成(%):">
			        <el-input class="inputWidth" v-model="state.formData.dnShareRate" placeholder="请输入(0-100)范围内的值" :maxlength="8"
			            style="width: 200px;"></el-input>
			    </el-form-item>
			</template>
            <el-form-item label="审核备注:">
                <el-input type="textarea" :rows="4" placeholder="请输入备注" v-model="state.formData.verifyRemark" show-word-limit
                    maxlength="100" />
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script setup>
import Dialog from '@/components/Dialog/index.vue'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { postMerchantApplyAudit } from '@/api/merchantConfig.js'
import { getMerchantInfoData } from '@/api/dataCenter.js'

const emits = defineEmits(['close', 'fetchData'])
const props = defineProps({
    itemData: {
        type: Object,
        default: () => {
            return {}
        }
    }
})
const state = reactive({
    formData: {
        shareRate: undefined,
		upShareRate: undefined,
		dnShareRate: undefined,
        verifyRemark: '',
    },
	merchantData: {}	
})
const dialog = ref(null)


const handleSubmit = (status) => {
	// if(status === 2 && props.itemData.rtpFlag === 1){
	// 	if (!(Number(state.formData.upShareRate) <= 100 && Number(state.formData.upShareRate) >= 0)) return ElMessage.warning('rtp＞100抽成为(0-100)范围内的值')
	// 	if (!(Number(state.formData.dnShareRate) <= 100 && Number(state.formData.dnShareRate) >= 0)) return ElMessage.warning('rtp＜100抽成为(0-100)范围内的值')
	// }
    if (status === 2 && props.itemData.rtpFlag === 0) {
		if(!state.formData.shareRate){
			return ElMessage.warning('请设置商户分成比例再进行提交！')
		}
    }
    let { vendorId, merchant = {} } = props.itemData
    let { shareRate, verifyRemark, upShareRate, dnShareRate } = state.formData
    dialog.value.showLoading()
    postMerchantApplyAudit({
        vendorId,
        merchantId: merchant.id,
        shareRate,
        verifyRemark,
		upShareRate,
		dnShareRate,
        status
    }).then(() => {
        emits('close')
        emits('fetchData')
    }).catch(() => {
        dialog.value.closeLoading()
    })
}
</script>

<style lang="scss" scoped>
:deep(.el-input-number.is-without-controls .el-input .el-input__wrapper .el-input__inner) {
    text-align: left;
}

:deep(.el-input-number.is-without-controls .el-input .el-input__wrapper) {
    padding-left: 11px !important;
    padding-right: 11px !important;
}
</style>

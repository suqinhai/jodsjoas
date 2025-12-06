<template>
    <!-- 商户模式修改-修改抽成 -->
    <Dialog ref="dialog" :title="'修改抽成'" buttonCenter top="15vh" @confirm="handleSubmit(operateForm)" @cancel="cancel">
        <el-form ref="operateForm" :rules="state.rules" :model="state.formData" label-width="150px">
            <el-form-item class="items" label="模式:">
                <el-radio-group v-model="state.formData.commissionMode">
                    <el-radio :label="1">损益模式</el-radio>
                    <el-radio :label="2">打码模式</el-radio>
                </el-radio-group>
            </el-form-item>
			<template v-if="state.formData.commissionMode == 2">
				<el-form-item label="电子:">
					<el-form-item label="rtp＞100抽成(%):" prop="rtpUpRate" label-width="140px" style="margin-bottom: 10px;">
						<el-input class="inputWidth" v-model="state.formData.PGC.rtpUpRate" placeholder="请输入(0-100)范围内的值" :maxlength="8" style="width: 200px;"></el-input>
					</el-form-item>
					<el-form-item label="rtp＜100抽成(%):" prop="rtpDnRate" label-width="140px">
						<el-input class="inputWidth" v-model="state.formData.PGC.rtpDnRate" placeholder="请输入(0-100)范围内的值" :maxlength="8" style="width: 200px;"></el-input>
					</el-form-item>
				 </el-form-item>
				 <el-form-item label="电子:">
				 	<el-form-item label="rtp＞100抽成(%):" prop="rtpUpRate" label-width="140px" style="margin-bottom: 10px;">
				 		<el-input class="inputWidth" v-model="state.formData.NJL.rtpUpRate" placeholder="请输入(0-100)范围内的值" :maxlength="8" style="width: 200px;"></el-input>
				 	</el-form-item>
				 	<el-form-item label="rtp＜100抽成(%):" prop="rtpDnRate" label-width="140px">
				 		<el-input class="inputWidth" v-model="state.formData.NJL.rtpDnRate" placeholder="请输入(0-100)范围内的值" :maxlength="8" style="width: 200px;"></el-input>
				 	</el-form-item>
				  </el-form-item>
                <el-form-item label="电子:">
				 	<el-form-item label="rtp＞100抽成(%):" prop="rtpUpRate" label-width="140px" style="margin-bottom: 10px;">
				 		<el-input class="inputWidth" v-model="state.formData.NPP.rtpUpRate" placeholder="请输入(0-100)范围内的值" :maxlength="8" style="width: 200px;"></el-input>
				 	</el-form-item>
				 	<el-form-item label="rtp＜100抽成(%):" prop="rtpDnRate" label-width="140px">
				 		<el-input class="inputWidth" v-model="state.formData.NPP.rtpDnRate" placeholder="请输入(0-100)范围内的值" :maxlength="8" style="width: 200px;"></el-input>
				 	</el-form-item>
				</el-form-item>
			</template>	
            <template v-if="state.formData.commissionMode == 1">
				<el-form-item label="抽成:" prop="shareRate">
				    <el-input-number class="special-input" v-model="state.formData.PGC.shareRate" :controls=" false" :min="0" placeholder="请输入抽成"
				        style="width: 100%;" />
				</el-form-item>
				<el-form-item label="抽成:" prop="shareRate">
				    <el-input-number class="special-input" v-model="state.formData.NJL.shareRate" :controls=" false" :min="0" placeholder="请输入抽成"
				        style="width: 100%;" />
				</el-form-item>
                <el-form-item label="抽成:" prop="shareRate">
				    <el-input-number class="special-input" v-model="state.formData.NPP.shareRate" :controls=" false" :min="0" placeholder="请输入抽成"
				        style="width: 100%;" />
				</el-form-item>
			</template>
        </el-form>
    </Dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref, reactive, onMounted } from 'vue'
import { postEditMode } from '@/api/merchantConfig.js'


const emits = defineEmits(['resetData', 'close'])
const dialog = ref(null)
const operateForm = ref(null)
const state = reactive({
    formData: {
        commissionMode: 0,
		PGC: {},
		NJL: {},
        NPP: {},
    },
    rules: {}
})

const props = defineProps({
    itemData: {
        type: Object,
        default: () => { },
    },
});

onMounted(() => {
    state.formData = {
        ...props.itemData
    }
	!state.formData.PGC ? state.formData.PGC = {} : ''
	!state.formData.NJL ? state.formData.NJL = {} : ''
	!state.formData.NPP ? state.formData.NPP = {} : ''
})

const handleSubmit = (el) => {
    el.validate((valid, fields) => {
        if (valid) {
            let data = {
                groupId: state.formData.group.id,
                commissionMode: state.formData.commissionMode,
                type: 2, //模式：1=控制模式；2=抽成模式；
            }
			if(state.formData.commissionMode === 1){
				data['PGC.shareRate'] = state.formData.PGC.shareRate
				data['NJL.shareRate'] = state.formData.NJL.shareRate
				data['NPP.shareRate'] = state.formData.NPP.shareRate
			}else{
				data['PGC.rtpUpRate'] = state.formData.PGC.rtpUpRate
				data['PGC.rtpDnRate'] = state.formData.PGC.rtpDnRate
				data['NJL.rtpUpRate'] = state.formData.NJL.rtpUpRate
				data['NJL.rtpDnRate'] = state.formData.NJL.rtpDnRate
                data['NPP.rtpUpRate'] = state.formData.NPP.rtpUpRate
				data['NPP.rtpDnRate'] = state.formData.NPP.rtpDnRate
				if (!(Number(state.formData.PGC.rtpUpRate) <= 100 && Number(state.formData.PGC.rtpUpRate) >= 0)) return ElMessage.warning('电子:rtp＞100抽成为(0-100)范围内的值')
				if (!(Number(state.formData.PGC.rtpDnRate) <= 100 && Number(state.formData.PGC.rtpDnRate) >= 0)) return ElMessage.warning('电子:rtp＜100抽成为(0-100)范围内的值')
				// if (!(Number(state.formData.NJL.rtpUpRate) <= 100 && Number(state.formData.NJL.rtpUpRate) >= 0)) return ElMessage.warning('电子:rtp＞100抽成为(0-100)范围内的值')
				// if (!(Number(state.formData.NJL.rtpDnRate) <= 100 && Number(state.formData.NJL.rtpDnRate) >= 0)) return ElMessage.warning('电子:rtp＜100抽成为(0-100)范围内的值')
                if (!(Number(state.formData.NPP.rtpUpRate) <= 100 && Number(state.formData.NPP.rtpUpRate) >= 0)) return ElMessage.warning('电子:rtp＞100抽成为(0-100)范围内的值')
				if (!(Number(state.formData.NPP.rtpDnRate) <= 100 && Number(state.formData.NPP.rtpDnRate) >= 0)) return ElMessage.warning('电子:rtp＜100抽成为(0-100)范围内的值')
			}
            dialog.value.showLoading()
            postEditMode(data).then(() => {
                cancel()
                emits('resetData')
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

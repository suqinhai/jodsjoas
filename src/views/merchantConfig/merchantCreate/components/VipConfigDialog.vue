<template>
	<!-- 商户配置-商户创建-修改vip配置 -->
    <Dialog title="修改vip配置" ref="dialog" @close="cancel" @confirm="handleConfirm(operateForm)" width="500px" confirmText="保存">
        <el-form ref="operateForm" :model="state.tableData" :rules="state.rules">
			<el-table :data="state.tableData" tooltip-effect="dark" border>
			    <el-table-column label="vip等级" align="center">
			        <template #default="{ row, $index }">
						{{row.level}}
			        </template>
			    </el-table-column>
			    <el-table-column label="余额上限" align="center">
			        <template #default="{ row,$index }">
			            <el-form-item :prop="$index + '.balanceLimit'" :rules="
			                    { required: true, message: '', trigger: 'blur' }">
			                <el-input-number v-model="row.balanceLimit" :controls="false" :precision="0" placeholder="请输入大于0的整数" :min="1" />
			            </el-form-item>
			        </template>
			    </el-table-column>
			</el-table>
			<div class="des">注：商户对会员进行控制时，系统根据总台和商户的配置，取最小值，如系统限制vip3余额上限1000，商户配置余额限制200，则以200为准，商户余额限制配置1300，则以1000为准；</div>
        </el-form>
    </Dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import Dialog from "@/components/dialogHook/index.vue";
import { getVipLimitConfig } from '@/api/merchantConfig.js'

const emits = defineEmits(["setData","close"]);
const props = defineProps({
	vipLimits: {
		type: Array,
		default: () => {
			return []
		}
	},
	currency: {
		type: String,
		default: () => {
			return ''
		}
	}
})
const operateForm = ref(null)
const state = reactive({
	tableData: []
})

onMounted(()=>{
	state.tableData = props.vipLimits
})

const handleConfirm = (el)=>{
	el.validate((valid, fields) => {
	    if (valid) {
			emits('setData',state.tableData)
			emits('close')
		} else {
	        ElMessage.warning('请完善表单内容再进行提交！')
	    }
	})
}

const cancel = () => {
	emits('close')
}
</script>

<style lang="scss" scoped>
	.des{
		margin-top: 20px;
	}
	.button{
		text-align: right;
		margin-top: 10px;
	}
</style>


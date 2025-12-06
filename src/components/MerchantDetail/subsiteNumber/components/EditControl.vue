<template>
    <!-- 商户信息-子站点-修改控制 -->
    <Dialog ref="dialog" :title="'修改控制'" buttonCenter top="15vh"
        @confirm="handleSubmit(operateForm)" @cancel="cancel">
        <el-form ref="operateForm" :rules="state.rules" :model="state.formData" label-width="150px">
			<el-form-item class="items" label="模式:">
			    <el-radio-group v-model="state.formData.ctrlMode">
			        <el-radio :label="1">专业模式</el-radio>
			        <el-radio :label="0">简易模式</el-radio>
			    </el-radio-group>
			</el-form-item>
        </el-form>
    </Dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref, reactive, onMounted } from 'vue'
import { postEditMode } from '@/api/merchantConfig.js'


const emits = defineEmits(['fetchData', 'close'])
const dialog = ref(null)
const operateForm = ref(null)
const state = reactive({
    formData: {
		ctrlMode: 0,
	},
	rules: {}
})

const props = defineProps({
    itemData: {
        type: Object,
        default: () => { },
    },
});

onMounted(()=>{
	state.formData = {
		...props.itemData
	}
})

const handleSubmit = (el) => {
    el.validate((valid, fields) => {
        if (valid) {
            dialog.value.showLoading()
			let data = {
				merchantId: state.formData.id,
				ctrlMode: state.formData.ctrlMode,
				type: 1, //模式：1=控制模式；2=抽成模式；
			}
            postEditMode(data).then(() => {
                cancel()
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

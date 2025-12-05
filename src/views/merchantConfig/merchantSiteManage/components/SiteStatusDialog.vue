
<template>
    <Dialog ref="dialog" width="530" :title="props.itemData.type == 'site' ? '站点状态' : '商户状态'" top="10vh" buttonCenter @confirm="handleSubmit(operateForm)" @cancel="cancel">
        <el-form ref="operateForm" :model="state.formData" :rules="state.rules" label-width="85px">
			<el-form-item label="站点ID:" v-if="props.itemData.type == 'site'">
			    <el-select v-model="state.formData.ids" placeholder="请选择站点" filterable reserve-keyword multiple clearable>
			        <el-option v-for="item in siteList" :key="item.id" :label="item.name + `（ID：${item.id}）`" :value="item.id" />
			    </el-select>
			</el-form-item>
            <el-form-item label="站点状态:" prop="status">
                <el-radio-group v-model="state.formData.status">
                    <el-radio v-for="item in platformSiteStatus" :value="Number(item.value)" :key="item.value" :label="Number(item.value)">{{ item.label }}
                    </el-radio>	
                </el-radio-group>
            </el-form-item>
            <el-link v-if="state.formData.status == -3" type="danger" :underline="false" size="small">结账：操作后将实时生成当月账单，商户前端不可进入，后台可进，只可查看商户信息，商户账单</el-link>
            <el-link v-if="state.formData.status == -99" type="danger" :underline="false" size="small">注销：即前台和后台都不可以登录，注销之后，不可以恢复，请谨慎处理</el-link>
        </el-form>
    </Dialog>
</template>

<script setup>
import Dialog from '@/components/Dialog/index.vue'
import { ElMessage } from 'element-plus'
import { ref, reactive, onMounted, computed } from 'vue'
import { editMerchantSiteStatusApi, editSiteStatusApi } from '@/api/merchantConfig.js'
import { getMerchantSiteList } from '@/api/common'
import { deepCopy } from '@/common/util/index.js'

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
const siteList = ref([])
const state = reactive({
    formData: {},
    rules: {
        status: { required: true, message: '请选择站点状态！', trigger: 'change' },
    },
	merchantId: ''
})

onMounted(() => {
    let { id, status } = props.itemData
    state.formData = {
		merchantId: id,
        // status,
		// ids: [id]
    }
	getSiteList()
})

const platformSiteStatus = computed(()=>{
	let platformSiteStatus = []
	props.metaData.platformSiteStatus.forEach((item)=>{
		if(props.itemData.type == 'site' && item.value != -3) platformSiteStatus.push(item)
		if(props.itemData.type == 'merchant' && (item.value != -3 || props.itemData.status != 0)) platformSiteStatus.push(item)
	})
	return platformSiteStatus
})

const getSiteList = () => {
    dialog.value.showLoading()
    getMerchantSiteList({ groupId: props.itemData.id, type: 2 }).then(res => {
        let { data = [] } = res
        siteList.value = data || []
        dialog.value.closeLoading()
    }).catch(err => {
        dialog.value.closeLoading()
    })
}

const handleSubmit = (el) => {
    el.validate((valid, fields) => {
        if (valid) {
			const data = deepCopy(state.formData)
			const api = props.itemData.type == 'site' ? editSiteStatusApi : editMerchantSiteStatusApi
			if(props.itemData.type == 'site') data.ids = data.ids?.join(',')
			dialog.value.showLoading()
            api(data).then(() => {
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

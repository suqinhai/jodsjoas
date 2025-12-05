
<template>
    <!-- 权限设置-新增/修改 -->
    <Dialog ref="dialog" width="500" :title="state.title" top="10vh" @confirm="handleSubmit(deployForm)" @cancel="cancel">
        <el-form ref="deployForm" :rules="state.rules" :model="state.formData" label-width="85px">
            <el-form-item label="角色名称:" prop="name">
                <el-input v-model="state.formData.name" placeholder="请输入角色名称" maxlength="20" show-word-limit />
            </el-form-item>
            <el-form-item label="角色描述:">
                <el-input type="textarea" :rows="4" placeholder="请输入角色描述" v-model="state.formData.info" show-word-limit maxlength="100" />
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script setup>
import Dialog from '@/components/Dialog/index.vue'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { postRoleData } from '@/api/manageConfig'

const emits = defineEmits(['close', 'fetchData'])
const props = defineProps({
    itemData: {
        type: Object,
        default: () => {
            return {}
        },
    }
})

const dialog = ref(null)
const deployForm = ref(null)
const state = reactive({
    formData: {},
    title: '',
    rules: {
        name: [{ required: true, message: '请选择角色！', trigger: 'blur' }],
    }
})

onMounted(() => {
    state.formData = { ...props.itemData }
    state.title = '新增总台角色'
    if (props.itemData.id) {
        state.title = '修改总台角色'
    }
})

const handleSubmit = (el) => {
    el.validate((valid, fields) => {
        if (valid) {
            dialog.value.showLoading()
            postRoleData(state.formData).then(() => {
                // ElMessage.success(`新增成功！`)
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
.grade-row {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    .row-small {
        display: flex;
        align-items: center;
    }
}
</style>

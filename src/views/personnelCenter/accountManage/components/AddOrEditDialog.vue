<template>
    <Dialog ref="dialog" :title="!itemData.id ? '创建总台账号' : '编辑账号'" buttonCenter width="450" @cancel="emits('close')"
        @confirm="handleConfirm">
        <el-form :model="state.form" ref="formRef" :rules="state.rules" label-width="90px">
            <el-form-item label="登录账号:" prop="username">
                <el-input v-model="state.form.username" maxlength="16" placeholder="请输入登录账号" :disabled="!!itemData.id" />
            </el-form-item>
            <el-form-item label="登录密码:" prop="password" :rules="[ { required: !itemData.id, message: '登录密码不可为空！', trigger: 'blur'}, 
                { pattern: state.passwordPattern,
                    message: '请输入6~16个字符，支持字母、数字、符号！',
                    trigger: 'change',
                    }]">
                <el-input v-model="state.form.password" placeholder="请输入登录密码" />
            </el-form-item>
            <el-form-item label="昵称:" prop="nickname">
                <el-input v-model="state.form.nickname" maxlength="20" placeholder="请输入昵称" />
            </el-form-item>
            <el-form-item label="所属角色:" prop="roleId" v-if="(!itemData.id || isPremiss) && !itemData.merchantId">
                <el-select style="width: 100%" v-model="state.form.roleId" placeholder="请选择角色">
                    <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="+item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="账号状态:" prop="status">
                <el-radio-group v-model="state.form.status">
                    <el-radio :label="1">正常</el-radio>
                    <el-radio :label="0">冻结</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script setup>
import Dialog from "@/components/Dialog/index.vue"
import userStore from '@/store/user'
import { reactive, ref, onMounted, computed } from 'vue'
import { addEmpAccount, editEmpAccount } from '@/api/manageConfig.js'

const emits = defineEmits(["close", "fetchData"])
const props = defineProps({
    itemData: {
        type: Object,
        default: () => {
            return {}
        },
    },
    roleList: {
        type: Array,
        default: () => [],
    },
});
const state = reactive({
    passwordPattern:
        /[a-z_A-Z0-9-\.!@#\$%\\\^&\*\)\(\+=\{\}\[\]\/",'<>~\·`\?:;|]{6,16}$/,
    rules: {
        status: [
            {
                required: true,
                message: '账号状态不可为空！',
                trigger: 'blur',
            },
        ],
        roleId: [
            {
                required: true,
                message: '所属角色不可为空！',
                trigger: 'blur',
            },
        ],
        username: [
            {
                required: true,
                message: '登录账号不可为空！',
                trigger: 'blur',
            },
            {
                pattern: /^[a-zA-Z][a-zA-Z0-9]{3,15}$/,
                message: '请输入4~16位英文数字组合，且必须以字母开头！',
                trigger: 'change',
            },
        ],
        nickname: [
            {
                required: true,
                message: '昵称不可为空！',
                trigger: 'blur',
            },
            {
                pattern: /^[a-zA-Z0-9]{1,20}$/,
                message: '请输入1~20位英文数字组合！',
                trigger: 'change',
            },
        ],
    },
    form: {
        status: 1
    },
})
const formRef = ref(null)
const dialog = ref(null)
const userData = userStore()

const isPremiss = computed(() => {
    return userData.userInfo.asSuper
})

onMounted(() => {
    if (props.itemData.id) {
        state.form = { ...props.itemData }
    }
})

const handleConfirm = () => {
    if (!formRef.value) return
    formRef.value.validate((valid, fields) => {
        if (valid) {
            let { status, roleId, username, nickname, password, id } = state.form
            let func = !id ? addEmpAccount : editEmpAccount
            let data = { status, roleId, username, nickname, password, id }
            dialog.value.showLoading()
            func(data).then(() => {
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
</script>

<style lang="scss" scoped></style>

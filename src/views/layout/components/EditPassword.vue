<template>
    <Dialog ref="dialog" width="500" title="修改密码" top="10vh" buttonCenter @confirm="handleSubmit(deployForm)" @cancel="cancel">
        <el-form ref="deployForm" class="edit-password" :rules="state.rules" :model="state.formData" label-width="100px">
            <el-form-item label="旧密码:" prop="oldPwd">
                <el-input v-model="state.formData.oldPwd" placeholder="请输入旧密码" show-password />
            </el-form-item>
            <el-form-item label="新密码:" prop="newPwd">
                <el-input v-model="state.formData.newPwd" placeholder="请输入新密码" show-password />
            </el-form-item>
            <el-form-item label="确认新密码:" prop="verifyPassword">
                <el-input v-model="state.formData.verifyPassword" placeholder="再次输入新密码" show-password />
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script setup>
import { ref, reactive, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'
import { postAccountPassword } from '@/api/common'

const emits = defineEmits(['close', 'handleLogout'])
const dialog = ref(null)
const deployForm = ref(null)
const state = reactive({
    formData: {},
    rules: {
        oldPwd: [
            { required: true, message: '请输入旧密码！', trigger: 'blur' }
        ],
        newPwd: [
            { required: true, message: '请输入新密码！', trigger: 'blur' },
            {
                pattern: /[a-z_A-Z0-9-\.!@#\$%\\\^&\*\)\(\+=\{\}\[\]\/" ,'<>~\·`\?:;|]{6,20}$/,
                message: '请输入6到20个字符，支持字母、数字、符号！',
                trigger: 'change',
            },
            {
                validator: (rule, value, callback) => {
                    const { oldPwd } = state.formData
                    if (oldPwd && oldPwd === value) {
                        return callback(new Error('新密码和旧密码不能相同！'))
                    }
                    return callback()
                }, trigger: 'change'
            }
        ],
        verifyPassword: [
            { required: true, message: '再次输入新密码！', trigger: 'blur' },
            {
                pattern: /[a-z_A-Z0-9-\.!@#\$%\\\^&\*\)\(\+=\{\}\[\]\/" ,'<>~\·`\?:;|]{6,20}$/,
                message: '请输入6到20个字符，支持字母、数字、符号！',
                trigger: 'change',
            },
            {
                validator: (rule, value, callback) => {
                    const { newPwd } = state.formData
                    if (newPwd && newPwd !== value) {
                        return callback(new Error('两次输入的密码不一致！'))
                    }
                    return callback()
                }, trigger: 'change'
            }
        ],
        captcha: [{ required: true, message: '请输入验证码！', trigger: 'blur' }],
    }
})

const handleSubmit = (el) => {
    el.validate(async (valid, fields) => {
        if (valid) {
            try {
                let params = { ...state.formData }
                delete params.verifyPassword
                dialog.value.showLoading()
                await postAccountPassword(params)
                cancel()
                emits('handleLogout')
            } catch (err) {
                dialog.value.closeLoading()
            }
        } else {
            ElMessage.warning('请完善表格内容再进行提交！')
        }
    })
}

const cancel = () => {
    emits('close')
}

</script>

<style  lang="scss">
.edit-password {
}
</style>

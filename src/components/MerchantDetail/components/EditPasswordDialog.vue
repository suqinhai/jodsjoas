<template>
    <Dialog ref="dialog" width="500" title="修改密码" top="10vh" buttonCenter @confirm="handleSubmit(deployForm)" @cancel="cancel">
        <el-form ref="deployForm" class="edit-password" :rules="state.rules" :model="state.formData" label-width="100px">
            <el-form-item label="商户名称:">
                {{merchantData.name}}
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
import Dialog from '@/components/Dialog/index.vue'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { postMerchantPassword } from '@/api/manageConfig.js'

const emits = defineEmits(['close'])
const props = defineProps({
    merchantData: {
        type: Object,
        default: () => {
            return {}
        }
    }
})
const dialog = ref(null)
const deployForm = ref(null)
const state = reactive({
    formData: {},
    rules: {
        newPwd: [
            { required: true, message: '请输入新密码！', trigger: 'blur' },
            {
                pattern: /[a-z_A-Z0-9-\.!@#\$%\\\^&\*\)\(\+=\{\}\[\]\/" ,'<>~\·`\?:;|]{6,20}$/,
                message: '请输入6到16个字符，支持字母、数字、符号！',
                trigger: 'change',
            },
        ],
        verifyPassword: [
            { required: true, message: '再次输入新密码！', trigger: 'blur' },
            {
                pattern: /[a-z_A-Z0-9-\.!@#\$%\\\^&\*\)\(\+=\{\}\[\]\/" ,'<>~\·`\?:;|]{6,20}$/,
                message: '请输入6到16个字符，支持字母、数字、符号！',
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
    }
})

const handleSubmit = (el) => {
    el.validate(async (valid, fields) => {
        if (valid) {
            dialog.value.showLoading()
            postMerchantPassword({
                newPwd: state.formData.newPwd,
                merchantId: props.merchantData.id,
            }).then(() => {
                cancel()
            }).catch((err) => {
                dialog.value.closeLoading()
            })
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
    .el-form-item__content {
        justify-content: flex-start;
    }
}
</style>

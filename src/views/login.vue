<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">总台管理系统</div>
            <el-form :model="param" :rules="rules" ref="loginRef" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input :disabled="loading" v-model="param.username" placeholder="username">
                        <template #prepend>
                            <el-button :icon="User"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input :disabled="loading" type="password" show-password placeholder="password" v-model="param.password" @keyup.enter="submitForm(loginRef)">
                        <template #prepend>
                            <el-button :icon="Lock"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button v-throttle type="primary" @click="submitForm(loginRef)" :loading="loading" @keydown.enter="submitForm(loginRef)">登录
                    </el-button>
                </div>
                <!-- <p class="login-tips">Tips : admin/123456</p> -->
            </el-form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue"
import useTagsStore from "../store/tags"
import userStore from "../store/user"
import { useRouter } from "vue-router"
import { Lock, User } from "@element-plus/icons-vue"

const router = useRouter()
const userData = userStore()
const param = reactive({
    username: "",
    password: "",
})
const rules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'change' }],
    password: [{ required: true, message: '请输入密码', trigger: 'change' }],
}
const loading = ref(false)
const loginRef = ref(null)

const submitForm = (formEl) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            loading.value = true
            userData.login(param).then(() => {
                loading.value = false
                if (localStorage.getItem('defaultPath') && localStorage.getItem('defaultPath') !== 'undefined') {
                    router.push(localStorage.getItem('defaultPath'))
                } else {
                    router.push('/')
                }
            }).catch(() => {
                loading.value = false
            })
        } else {
            return false
        }
    })
}

// 监听回车事件
const onKeyUp = (e) => {
    if (e.key == "Enter") submitForm(login.value)
}

// 添加键盘监听
onMounted(() => {
    document.addEventListener("keyup", onKeyUp)
})

// 移除键盘监听
onBeforeUnmount(() => {
    document.removeEventListener("keyup", onKeyUp)
})

useTagsStore().clearTags()
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>

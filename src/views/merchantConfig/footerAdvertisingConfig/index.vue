<template>
    <!-- 页脚广告配置 -->
    <div class="container footer-advertising-config">
        <el-form ref="deployRef" :model="state.formData" :rules="state.rules" :disabled="state.isDisabled" label-width="150px">
            <el-form-item label="总台技术支持:">
                <el-switch v-model="state.formData.status" :active-value="1" :inactive-value="0" />
            </el-form-item>
            <el-form-item label="联系方式:" prop="type">
                <el-select v-model="state.formData.type" placeholder="请选择联系方式">
                    <el-option v-for="item in metaData.imType" :key="item.value" :label="item.label" :value="+item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="链接地址">
                <el-input style="width: 300px" v-model="state.formData.account" placeholder="请输入链接地址" />
            </el-form-item>
            <el-form-item label="屏蔽IP:">
                <el-select style="width: 300px" v-model="state.formData.ipLimit" multiple clearable placeholder="请选择屏蔽国家">
                    <el-option v-for="item in metaData.areaCountryList" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
            </el-form-item>
        </el-form>

        <div class="btn">
            <el-button v-throttle v-if="!state.isDisabled" @click="getData">取 消</el-button>
            <el-button v-throttle style="margin-left:30px" type="primary" v-if="!state.isDisabled" @click="handleSave(deployRef)">
                保 存
            </el-button>
            <el-button v-throttle type="primary" v-if="state.isDisabled" @click="state.isDisabled = false">修 改
            </el-button>
        </div>
    </div>
</template>

<script setup name="footerAdvertisingConfig">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Minus } from "@element-plus/icons-vue"
import { commonMetasApi, getRegionList, getHomeDeploy, postHomeDeploy } from '@/api/common.js'
import { deepCopy } from '@/common/util'

const state = reactive({
    formData: {
        status: 1,
        ipLimit: []
    },
    isDisabled: true,
    rules: {
        type: [{ required: true, message: '请选择联系方式！', trigger: 'change' }],
        account: [{ required: true, message: '请输入链接地址！', trigger: 'change' }],
    }
})
const deployRef = ref(null)
let metaData = reactive({
    imType: [],
    areaCountryList: [],
})

commonMetasApi({ types: 'imType' }).then(res => {
    metaData.imType = res.data?.imType || []
})

getRegionList().then(res => {
    metaData.areaCountryList = res.data || []
})

onMounted(() => {
    getData()
})

// 获取配置数据
const getData = () => {
    globalVBus.$emit('globalLoading', true)
    getHomeDeploy({ part: 'techSupport' }).then(({ data, code }) => {
        if (code === 0 && data) {
            state.formData = data
            state.formData.ipLimit = data.ipLimit ? data.ipLimit.split(',') : []
        }
        state.isDisabled = true
        globalVBus.$emit('globalLoading', false)
    }).catch(() => {
        globalVBus.$emit('globalLoading', false)
    })
}

const handleSave = (el) => {
    el.validate((valid, fields) => {
        if (valid) {
            globalVBus.$emit('globalLoading', true)
            let params = deepCopy(state.formData)
            params.ipLimit = params.ipLimit.join(',')
            postHomeDeploy({
                part: 'techSupport',
                alias: 'techSupport',
                status: 1,
                techSupport: JSON.stringify(params)
            }).then(() => {
                getData()
            }).catch(() => {
                globalVBus.$emit('globalLoading', false)
            })
        } else {
            ElMessage.warning('请完善表单内容再进行提交！')
        }
    })
}
</script>

<style lang="scss">
.footer-advertising-config {
    .btn {
        width: 800px;
        display: flex;
        justify-content: center;
        padding-top: 50px;
    }
}
</style>

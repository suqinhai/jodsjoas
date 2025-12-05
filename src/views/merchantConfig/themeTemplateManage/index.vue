<template>
    <!-- 商户前端主题模板管理 -->
    <div class="container theme-template-manage">
        <div class="head">商户前端主题模板管理
            <!-- <span class="tips">（当前配置的商户，可设置所有主题模板，未添加到配置的商户只能设置特定模板！）</span> -->
        </div>
        <el-form ref="deployForm" :disabled="state.isDisabled" :rules="state.rules" :model="state.formData" label-width="100px">
            <el-form-item label="商户ID:">
                <el-input @input="(val) => state.formData.mIds = val.replace('，','')" v-model="state.formData.mIds" style="width: 600px"
                    type="textarea" :rows="6" placeholder="请输入商户ID，多个需要用英文逗号隔开" />
                <div style="color: red">当前配置的商户，前端可设置所有主题模板，未配置的商户只能设置特定主题模板！</div>
            </el-form-item>
        </el-form>
        <div class="foot" v-permiss="'admin.merchant.templateNoLimit'">
            <el-button v-throttle type="primary" v-if="state.isDisabled" @click="state.isDisabled = false">编 辑</el-button>
            <el-button v-throttle type="primary" v-if="!state.isDisabled" @click="emits('getData')">取 消</el-button>
            <el-button v-throttle type="primary" v-if="!state.isDisabled" @click="handleSave">保 存</el-button>
        </div>
    </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { getTemplateNoLimitMerchant, postTemplateNoLimitMerchant } from '@/api/merchantConfig'

const state = reactive({
    isDisabled: true,
    formData: {},
    rules: {
        mIds: [{
            pattern: /^\d[0-9,]*\d$/,
            message: '请输入正确的商户ID，多个需要用英文逗号隔开！',
            trigger: 'change',
        }
        ],
    }
})

onMounted(() => {
    getData()
})

const getData = () => {
    globalVBus.$emit('globalLoading', true)
    getTemplateNoLimitMerchant().then(res => {
        state.formData.mIds = res.data || ''
        state.isDisabled = true
        globalVBus.$emit('globalLoading', false)
    }).catch(() => {
        globalVBus.$emit('globalLoading', false)
    })
}

const handleSave = () => {
    globalVBus.$emit('globalLoading', true)
    postTemplateNoLimitMerchant(state.formData).then(() => {
        getData()
    }).catch(() => {
        globalVBus.$emit('globalLoading', false)
    })
}
</script>

<style lang="scss">
.theme-template-manage {
    width: 800px;
    .head {
        font-size: 18px;
        font-weight: 600;
        // display: flex;
        // align-items: center;
        margin-bottom: 40px;
        // .tips {
        //     font-size: 14px;
        //     font-weight: 400;
        // }
    }
    .foot {
        margin-top: 20px;
        width: 400px;
        display: flex;
        justify-content: flex-end;
    }
}
</style>

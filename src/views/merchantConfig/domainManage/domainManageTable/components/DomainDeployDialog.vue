<template>
    <!-- 商户域名管理-前台域名管理/后台域名管理/推广域名-新增 -->
    <Dialog ref="dialog" width="700" :title="'新增' + (props.asBack ? '后台域名' : '前台域名')" top="10vh" @confirm="handleSubmit(deployFormRef)"
        @cancel="cancel">
        <el-form class="domain-deploy" ref="deployFormRef" :model="state.formData" :rules="state.rules" label-width="85px">
            <el-form-item label="CDN节点:" prop="provider">
                <el-radio-group v-model="state.formData.provider">
                    <el-radio v-for="item in metaData.dnsProvider" :key="item.value" :label="+item.value">{{item.label}}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="商户ID:">
                <el-input :disabled="state.isSearch" style="width: 256px;margin-right: 15px"
                    @input="(val) => state.merchantId = val.replace(/\D/g,'')" v-model="state.merchantId" placeholder="请输入商户ID" />
                <el-button v-throttle type="primary" @click="handleSearch">{{state.isSearch ?'重 置':'搜 索'}}</el-button>
            </el-form-item>
            <el-row v-if="state.isSearch">
                <el-col :span="9">
                    <el-form-item label="商户ID:">
                        <span>{{state.merchantInfo.id}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="15">
                    <el-form-item label-width="85px" label="商户名称:">
                        <span>{{state.merchantInfo.name}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="站点ID:" prop="merchantId">
                <el-select v-model="state.formData.merchantId" placeholder="请选择站点" filterable clearable reserve-keyword>
                    <el-option v-for="item in siteList" :key="item.id" :label="item.name + `（ID：${item.id}）`" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="主域名:" prop="names">
                <el-input style="width: 100%" type="textarea" :rows="6" placeholder="支持批量添加，最多20个，多个域名请换行" v-model="state.formData.names" />
                <span class="tips">温馨提示：只支持顶级域名，请勿添加子域名。</span>
            </el-form-item>
            <div class="title">费用说明:</div>
            <div class="text">域名解析：前30个域名免费（含子域名），超出部分额外收取5USDT/条解析/月;</div>
            <div class="text">流量：每月前500G免费，超出部分额外收取0.3USDT/G/月;</div>
            <div class="text">节点：免费提供3个节点，超出部分额外收取300USDT/节点/月，每个节点都是独立云，都能扛攻击，建议均匀分配。</div>
        </el-form>
    </Dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { postDomainData } from '@/api/merchantConfig'
import { getMerchantData, getMerchantSiteList } from '@/api/common'

const emits = defineEmits(['close', 'fetchData'])
const props = defineProps({
    metaData: {
        type: Object,
        default: () => {
            return {}
        }
    },
    asBack: {
        type: Number,
        default: 0
    },
})
const state = reactive({
    title: '新增',
    formData: {},
    rules: {
        provider: [{ required: true, message: '请选择CDN节点！', trigger: 'blur' }],
        names: [{ required: true, message: '请输入主域名！', trigger: 'blur' }],
        merchantId: [{ required: true, message: '请选择站点', trigger: 'blur' }],
    },
    merchantInfo: {},
    isSearch: false,
    merchantId: ''
})
const siteList = ref([])
const deployFormRef = ref(null)
const dialog = ref(null)

onMounted(() => { })


const handleSearch = () => {
    if (state.isSearch) {
        delete state.merchantId
        state.formData.merchantId = ''
        state.merchantInfo = {}
        state.isSearch = false
        siteList.value = []
    } else {
        if (!state.merchantId) {
            return ElMessage.warning('请输入商户ID再进行搜索！')
        }
        dialog.value.showLoading()
        getMerchantData({ id: state.merchantId }).then(({ status, data }) => {
            if (status === 'OK' && data) {
                state.merchantInfo = data
                state.merchantId = state.merchantInfo.id
                state.isSearch = true
                getSiteList(state.merchantInfo.id)
            } else {
                ElMessage.warning(`未查询到此商户ID信息！`)
            }
            dialog.value.closeLoading()
        }).catch((err) => {
            dialog.value.closeLoading()
        })
    }
}
const getSiteList = (groupId) => {
    dialog.value.showLoading()
    getMerchantSiteList({ groupId: groupId, type: 3 }).then(res => {
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
            state.formData.asBack = props.asBack
            dialog.value.showLoading()
            postDomainData(state.formData).then(() => {
                cancel()
                emits('fetchData', {})
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

<style lang="scss">
.domain-deploy {
    .title {
        color: #666;
    }
    .text {
        padding-left: 10px;
        color: #999;
    }
}
</style>

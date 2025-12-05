<template>
    <!-- 推广商户申请列表-推广设置 -->
    <Dialog ref="dialog" width="850" title="推广设置" top="5vh" @confirm="handleSubmit(deployFormRef)" @cancel="emits('close')">
        <el-form class="dealer-audit-deploy" ref="deployFormRef" :model="state.formData" :rules="state.rules">
            <div class="deploy-box">
                <div class="small-row" v-for="(item,index) in state.formData.contacts" :key="index">
                    <span>联系方式</span>
                    <el-form-item :prop="'contacts.' + index + '.type'"
                        :rules="[{ required: true, message: '请选择联系方式！', trigger: 'change' }]">
                        <el-select style="width: 120px;margin: 0 3px" v-model="item.type">
                            <el-option v-for="its in imType" :key="its.value" :label="its.label" :value="+its.value" />
                        </el-select>
                    </el-form-item>
                    <span>，联系信息</span>
                    <el-form-item :prop="'contacts.' + index + '.account'"
                        :rules="[{ required: true, message: '请输入联系信息！', trigger: 'change' }]">
                        <el-input v-model="item.account" style="width: 270px;margin: 0 3px" placeholder="请输入联系信息" />
                    </el-form-item>
                    <span>，顶部显示</span>
                    <el-form-item>
                        <el-switch style="margin: 0 3px" v-model="item.topShow" :active-value="1" :inactive-value="0" />
                    </el-form-item>
                    <div class="operate">
                        <el-button v-throttle type="primary" v-if="state.formData.contacts.length < 10" @click="handleAdd(index)"
                            :icon="Plus"></el-button>
                        <el-button v-throttle type="danger" v-if="state.formData.contacts.length > 1" @click="handleDel(index)"
                            :icon="Minus">
                        </el-button>
                    </div>
                </div>
            </div>
            <el-form-item label="演示站:" prop="demo">
                <el-input style="width: 100%" v-model="state.formData.demo" placeholder="请输入演示站路径" />
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script setup>
import Dialog from '@/components/Dialog/index.vue'
import { ref, reactive, onMounted } from 'vue'
import { postPromoteConfig } from '@/api/merchantConfig'
import { ElMessage } from 'element-plus'
import { Plus, Minus } from "@element-plus/icons-vue";

const emits = defineEmits(['close', 'fetchData'])
const props = defineProps({
    imType: {
        type: Array,
        default: []
    },
    itemData: {
        type: Object,
        default: () => {
            return {}
        }
    },
})
const state = reactive({
    formData: {
        demo: '',
        contacts: [{ type: '', account: '', topShow: 0 }]
    },
    rules: {
        demo: [{ required: true, message: '请输入演示站路径！', trigger: 'change' }],
    }
})
const deployFormRef = ref(null)
const dialog = ref(null)

onMounted(() => {
    if (props.itemData.demo) {
        state.formData = props.itemData
    }
})

//删除等级
const handleDel = (index) => {
    state.formData.contacts.splice(index, 1)
}

//添加一级
const handleAdd = (index) => {
    state.formData.contacts.splice(index + 1, 0, {
        type: '',
        account: '',
        topShow: 0
    })
}

const handleSubmit = (el) => {
    el.validate((valid, fields) => {
        if (valid) {
            dialog.value.showLoading()
            postPromoteConfig({ config: JSON.stringify(state.formData) }).then(() => {
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

<style lang="scss" >
.dealer-audit-deploy {
    .deploy-box {
        .small-row {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            .el-form-item {
                margin-bottom: 0;
            }
            .operate {
                margin-left: 10px;
            }
        }
    }
}
</style>

<template>
    <div class="operateDialog">
        <Dialog :title="!operateType ? '详情' : formDialog.id ? '修改' : '新增'" :showConfirmBtn="!!operateType" @close="emits('close')"
            @confirm="handleConfirm">
            <el-form :model="formDialog" ref="formRef" :disabled="!operateType" :rules="state.formDialogRules"
                label-position="right" label-width="120px">
                <el-form-item label="消息类型" prop="type">
                    <el-select v-model="formDialog.type" placeholder="请选择消息类型">
                        <el-option v-for="item in newsTypeList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
				<!-- v-if="item.label != '代理消息'"  测试yhui说先隐藏 -->
                <el-form-item label="提醒商户：" prop="scope" v-if="formDialog.type*1 === 0">
                    <el-select v-model="formDialog.scope" placeholder="请选择提醒商户类型">
                        <el-option v-for="item in receiveList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" v-if="formDialog.scope*1 === 101" prop="ranges"
                    :rules="{ required: true, message: '必填项不可为空', trigger: 'blur' }">
                    <el-input type="textarea" :rows="3" v-model="formDialog.ranges"
                        placeholder="请输入商户账号，多个账号需要用英文逗号隔开，最多可输入一万个会员">
                    </el-input>
                </el-form-item>
                <el-form-item prop="rangesLevel" v-if="formDialog.scope*1 === 102"
                    :rules="{ required: true, message: '必选项不可为空', trigger: 'blur'}">
                    <el-checkbox v-model="state.checkAll" :indeterminate="state.isIndeterminate" @change="handleCheckAllChange">全选
                    </el-checkbox>
                    <el-checkbox-group v-model="formDialog.rangesLevel" @change="handleCheckedLevelsChange">
                        <el-checkbox v-for="item in merchantLevelList" :key="item" :label="item.value">{{ item.label }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="标题：" prop="title">
                    <el-input v-model="formDialog.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="显示内容：" prop="content">
                    <Tinymce v-if="formDialog.type*1  < 2" v-model="formDialog.content" :disabled="!operateType" height="500px">
                    </Tinymce>
                    <el-input v-else v-model="formDialog.content" :rows="4" type="textarea" placeholder="请输入内容"></el-input>
                </el-form-item>
                <div class="sendTypeAndTime">
                    <el-form-item v-if="formDialog.type*1 < 3" label="发送时间：" prop="sendType"
                        :rules="{ required: true, message: '必选项不可为空', trigger: 'blur' }">
                        <el-radio-group v-model="formDialog.sendType">
                            <el-radio label="1">立即发送</el-radio>
                            <el-radio label="0">定时发送</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="formDialog.sendType*1 === 0 && formDialog.type*1 < 3" label-width="0px" prop="sendTime"
                        :rules="{ required: true, message: '必选项不可为空', trigger: 'blur'}">
                        <el-date-picker style="margin-left:5px" v-model="formDialog.sendTime" type="datetime"
                            format="YYYY-MM-DD HH:mm:ss" placeholder="请选择发送时间" value-format="x"></el-date-picker>
                    </el-form-item>
                </div>
                <!-- <el-form-item label="是否弹窗：" v-if="formDialog.type * 1 < 2">
                    <el-switch v-model="formDialog.pop" active-value="1" inactive-value="0">
                    </el-switch>
                </el-form-item> -->
                <el-form-item label="弹出频次：" prop="popUp" :rules="{ required: true, message: '必选项不可为空', trigger: 'blur' }">
                    <el-select v-model="formDialog.popUp">
                        <el-option v-for="item in state.dialogRateList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="结束时间：" prop="endTime" :rules="{ required: true, message: '必选项不可为空', trigger: 'blur' }">
                    <el-date-picker v-model="formDialog.endTime" type="datetime" format="YYYY-MM-DD HH:mm:ss"
                        placeholder="请选择结束时间" value-format="x"></el-date-picker>
                </el-form-item>
                <el-form-item label="弹出条件：" v-if="formDialog.type*1 > 2">
                    达到风控配置设定值触发
                </el-form-item>
            </el-form>
        </Dialog>
    </div>
</template>

<script setup>
import Dialog from "@/components/dialogHook/index.vue"
import Tinymce from "@/components/Tinymce/index.vue"
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const emits = defineEmits(["close", "update:formDialog", "confirm"]);
const props = defineProps({
    formDialog: {
        type: Object,
        default: () => { },
    },
    operateType: {
        type: Boolean,
        default: false,
    },
    newsTypeList: {
        type: Array,
        default: () => [],
    },
    receiveList: {
        type: Array,
        default: () => [],
    },
    merchantLevelList: {
        type: Array,
        default: () => [],
    },
});

const state = reactive({
    checkAll: false, //控制商户等级全选状态
    isIndeterminate: false, //
    dialogRateList: [
        { label: '不弹窗', value: '0' },
        { label: '每日一次', value: '2' },
        { label: '每小时一次', value: '4' },
    ],
    formDialogRules: {
        type: [{ required: true, message: '必选项不可为空', trigger: 'blur' }],
        scope: [{ required: true, message: '必选项不可为空', trigger: 'blur' }],
        title: [{ required: true, message: '必填项不可为空', trigger: 'blur' }],
        content: [{ required: true, message: '必填项不可为空', trigger: 'blur' }],
    },
})
const formRef = ref(null)

onMounted(() => {
    if (props.formDialog.id) {
        props.formDialog.type = props.formDialog.type.toString()
        props.formDialog.sendType = props.formDialog.sendType.toString()
        props.formDialog.popUp = props.formDialog.popUp.toString()
        if (props.formDialog.scope == 102) {
            state.checkAll =
                props.formDialog.rangesLevel.length ===
                props.merchantLevelList.length
            state.isIndeterminate =
                props.formDialog.rangesLevel.length &&
                props.formDialog.rangesLevel.length <
                props.merchantLevelList.length
        }
    }
})

const handleCheckAllChange = (val) => {
    props.formDialog.rangesLevel = val
        ? props.merchantLevelList.map((item) => item.value)
        : []
    state.isIndeterminate = false
}

const handleCheckedLevelsChange = (value) => {
    const checkedCount = value.length
    state.checkAll = checkedCount === props.merchantLevelList.length
    state.isIndeterminate =
        checkedCount > 0 && checkedCount < props.merchantLevelList.length
}

//表单提交
const handleConfirm = async () => {
    if (!formRef.value) return
    await formRef.value.validate(async (valid, fields) => {
        if (valid) {
            let params = { ...props.formDialog }
            if (params.sendType === '1') {
                delete params.sendTime
            } else if (
                new Date(params.sendTime).getTime() < new Date().getTime()
            ) {
                return ElMessage.warning('定时发送时间不能早于当前时间')
            }
            if (new Date(params.endTime).getTime() < new Date().getTime()) {
                return ElMessage.warning('结束时间不能早于当前时间')
            }
            if (
                params.sendType === '0' &&
                new Date(params.sendTime).getTime() >=
                new Date(params.endTime).getTime()
            ) {
                return ElMessage.warning('结束时间不能早于发送时间')
            }
            if (params.type === '0') {
                if (params.scope !== '101') {
                    delete params.ranges
                }
                if (params.scope === '102') {
                    params.ranges = params.rangesLevel.join(',')
                    delete params.rangesLevel
                }
            } else {
                delete params.ranges
                params.scope = '100'
                delete params.memberGrade
            }
            emits('confirm', params)
        } else {
            console.log('error submit!', fields)
        }
    })
}



</script>

<style lang="scss" scoped>
.sendTypeAndTime {
    display: flex;
}
</style>

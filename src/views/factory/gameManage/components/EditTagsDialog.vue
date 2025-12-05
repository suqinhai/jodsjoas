<template>
    <Dialog top="5vh" title="标签管理" @close="emits('close')" @confirm="handleConfirm" width="1240px;">
        <el-form :model="formData" ref="formRef">
            <el-form-item label="类型选择:" prop="type">
                <div class="flex justify-between align-center">
                    <!-- <el-select v-model="formData.gameType" placeholder="请选择类型" @change="handleChange">
                        <el-option v-for="item in props.gameTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select> -->
                    <el-button type="primary" @click="addTags">添加标签</el-button>
                </div>
            </el-form-item>
            <el-form-item>
                <el-table :data="formData.tags" border height="500px">
                    <el-table-column prop="description" label="标签名称-中文" align="center">
                        <template #default="scope">
                            <span v-if="!scope.row.isEdit && scope.row.id">{{ scope.row.zhName }}</span>
                            <el-form-item v-else label-width="0px" :prop="`tags.${scope.$index}.zhName`"
                                :rules="[{ required: true, message: '请输入标签名称', trigger: 'blur' }]">
                                <el-input v-model="scope.row.zhName" placeholder="请输入标签名称" clearable
                                    maxlength="20"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="description" label="标签名称-英语" align="center">
                        <template #default="scope">
                            <span v-if="!scope.row.isEdit && scope.row.id">{{ scope.row.enName }}</span>
                            <el-form-item v-else label-width="0px" :prop="`tags.${scope.$index}.enName`"
                                :rules="[{ required: true, message: '请输入标签名称', trigger: 'blur' }]">
                                <el-input v-model="scope.row.enName" placeholder="请输入标签名称" clearable
                                    maxlength="20"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="description" label="标签名称-菲律宾语" align="center">
                        <template #default="scope">
                            <span v-if="!scope.row.isEdit && scope.row.id">{{ scope.row.phName }}</span>
                            <el-form-item v-else label-width="0px" :prop="`tags.${scope.$index}.phName`"
                                :rules="[{ required: true, message: '请输入标签名称', trigger: 'blur' }]">
                                <el-input v-model="scope.row.phName" placeholder="请输入标签名称" clearable
                                    maxlength="20"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="description" label="标签名称-印度尼西亚语" align="center">
                        <template #default="scope">
                            <span v-if="!scope.row.isEdit && scope.row.id">{{ scope.row.idName }}</span>
                            <el-form-item v-else label-width="0px" :prop="`tags.${scope.$index}.phName`"
                                :rules="[{ required: true, message: '请输入标签名称', trigger: 'blur' }]">
                                <el-input v-model="scope.row.idName" placeholder="请输入标签名称" clearable
                                    maxlength="20"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="description" label="标签名称-印地语" align="center">
                        <template #default="scope">
                            <span v-if="!scope.row.isEdit && scope.row.id">{{ scope.row.hiName }}</span>
                            <el-form-item v-else label-width="0px" :prop="`tags.${scope.$index}.phName`"
                                :rules="[{ required: true, message: '请输入标签名称', trigger: 'blur' }]">
                                <el-input v-model="scope.row.hiName" placeholder="请输入标签名称" clearable
                                    maxlength="20"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="description" label="标签名称-越南语" align="center">
                        <template #default="scope">
                            <span v-if="!scope.row.isEdit && scope.row.id">{{ scope.row.viName }}</span>
                            <el-form-item v-else label-width="0px" :prop="`tags.${scope.$index}.phName`"
                                :rules="[{ required: true, message: '请输入标签名称', trigger: 'blur' }]">
                                <el-input v-model="scope.row.viName" placeholder="请输入标签名称" clearable
                                    maxlength="20"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="description" label="标签名称-乌尔都语" align="center">
                        <template #default="scope">
                            <span v-if="!scope.row.isEdit && scope.row.id">{{ scope.row.urName }}</span>
                            <el-form-item v-else label-width="0px" :prop="`tags.${scope.$index}.phName`"
                                :rules="[{ required: true, message: '请输入标签名称', trigger: 'blur' }]">
                                <el-input v-model="scope.row.urName" placeholder="请输入标签名称" clearable
                                    maxlength="20"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="description" label="标签名称-孟加拉语" align="center">
                        <template #default="scope">
                            <span v-if="!scope.row.isEdit && scope.row.id">{{ scope.row.bnName }}</span>
                            <el-form-item v-else label-width="0px" :prop="`tags.${scope.$index}.phName`"
                                :rules="[{ required: true, message: '请输入标签名称', trigger: 'blur' }]">
                                <el-input v-model="scope.row.bnName" placeholder="请输入标签名称" clearable
                                    maxlength="20"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="description" label="标签名称-西班牙语" align="center">
                        <template #default="scope">
                            <span v-if="!scope.row.isEdit && scope.row.id">{{ scope.row.esName }}</span>
                            <el-form-item v-else label-width="0px" :prop="`tags.${scope.$index}.phName`"
                                :rules="[{ required: true, message: '请输入标签名称', trigger: 'blur' }]">
                                <el-input v-model="scope.row.esName" placeholder="请输入标签名称" clearable
                                    maxlength="20"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>

                    <el-table-column prop="description" label="操作" align="center" width="150px">
                        <template #default="scope">
                            <template v-if="scope.$index !== 0">
                                <el-button v-if="scope.row.id && !scope.row.isEdit" type="primary" v-throttle link @click="openEdit(scope.row)">修改</el-button>
                                <el-button v-if="scope.row.id && scope.row.isEdit" type="primary" v-throttle link @click="closeEdit(scope.row)">取消</el-button>
                                <el-button type="danger" v-throttle link @click="deleteTags(scope.$index)">删除</el-button>
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { getTagList, editTag } from '@/api/factory.js'
import Dialog from "@/components/dialogHook/index.vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { deepCopy } from "@/common/util";

const props = defineProps({
    gameType: {
        type: String,
        default: ''
    },
    gameTypeList: {
        type: Array,
        default: () => []
    }
});

const emits = defineEmits(["close", "confirm"]);
const defaultRow = { zhName: '', enName: '', phName: '', idName: '', hiName: '', viName: '', urName: '', bnName: '', esName: '' };



const formRef = ref(null);
const formData = reactive({
    gameType: props.gameType,
    tags: []
});

const openEdit = (row) => {
    row.isEdit = true;
}

const closeEdit = (row) => {
    row.isEdit = false;
    handleChange(formData.gameType)
}
const addTags = () => {
    if (formData.tags.length >= 30) {
        ElMessage({
            type: 'warning',
            message: '最多只能添加30个标签'
        });
        return;
    }
    formData.tags.push(deepCopy(defaultRow));
};

const deleteTags = (index) => {
    ElMessageBox.confirm('此操作将删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        formData.tags.splice(index, 1);
    }).catch(() => {
        console.log('取消删除');
    });
};

const handleConfirm = () => {
    formRef.value.validate(valid => {
        if (valid) {
            saveTags()
        } else {
            ElMessage.error('请填写完整信息');
        }
    });
};

const saveTags = () => {
    const data = deepCopy(formData);
    data.tags.length && data.tags.shift();
    const tags = data.tags.map(item => {
        return {
            name: {
                zhName: item.zhName,
                enName: item.enName,
                phName: item.phName,
                idName: item.idName,
                hiName: item.hiName,
                viName: item.viName,
                urName: item.urName,
                bnName: item.bnName,
                esName: item.esName,


            }
        };
    });
    data.tags =  JSON.stringify(tags);
    editTag(data).then(res => {
        const { code } = res;
        if (code === 0) {
            emits('confirm');
            emits('close');
        }
    });
};

const handleChange = (value) => {
    getTagList({ gameType: value }).then(res => {
        const { code, data } = res;
        if (code === 0) {
            formData.tags = data;
        }
    })
};

onMounted(() => { 
    handleChange(formData.gameType);
});
</script>

<style lang="scss" scoped></style>

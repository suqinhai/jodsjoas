<template>
    <!-- APP上传 -->
    <div class="container appUpload">
        <div class="title">上传APP文件到 R2</div>
        <div class="main">
            <el-button v-throttle type="primary" @click="handleGiveFile">选择文件</el-button>
            <span :class="{'special': state.file}" class="name">{{state.file ? state.file.name : '未选择文件'}}</span>
        </div>
        <div v-if="state.fileLimit.singleFileMax" class="tips">请上传{{state.fileLimit.fileTypes.join('/')}}格式，小于{{showLimit}}的文件！</div>
        <el-button class="but" v-throttle type="primary" @click="handleUpload">上 传</el-button>
        <el-table v-if="state.fileUrlList.length" :data="state.fileUrlList" border style="width: 800px">
            <el-table-column prop="name" label="文件名称" min-width="200" align="center" />
            <el-table-column label="文件地址" min-width="400" align="center">
                <template #default="{ row }">
                    <div class="preview">
                        <span>{{row.url}}</span>
                        <el-icon v-if="row.url" class="pointer icon-primary" style="margin-left: 10px;" :size="18" @click="copyText(row.url)">
                            <DocumentCopy />
                        </el-icon>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getFileUrl, getUploadLimit } from '@/api/common'
import { copyText } from '@/common/util'
import axios from 'axios'

const state = reactive({
    file: '',
    fileUrlList: [],
    fileLimit: {
        singleFileMax: 0,
        fileTypes: ['apk']
    }
})

const showLimit = computed(() => {
    let { singleFileMax } = state.fileLimit
    if (!singleFileMax) return ''
    let sizeLimit = parseInt(state.fileLimit.singleFileMax / 1024)
    if (sizeLimit > 1024) {
        return parseInt(sizeLimit / 1024) + 'MB'
    } else {
        return sizeLimit + 'KB'
    }
})

onMounted(() => {
    globalVBus.$emit('globalLoading', true)
    getUploadLimit({ bizType: 'app' }).then(res => {
        state.fileLimit = res.data || {}
        globalVBus.$emit('globalLoading', false)
    }).catch(() => {
        globalVBus.$emit('globalLoading', false)
    })
})

const handleGiveFile = () => {
    if (!state.fileLimit.singleFileMax) return ElMessage.warning(`初始化数据失败，请刷新页面后再重新操作！`)
    let input = document.createElement('input')
    input.type = 'file'
    let { fileTypes, singleFileMax } = state.fileLimit
    let accept = fileTypes.map(item => item = '.' + item).join(',')
    input.accept = accept
    input.style.display = "none"
    document.body.appendChild(input)
    input.onchange = (event) => {
        let file = event.target.files[0];
        let type = file.name.split('.')
        if (!fileTypes.includes(type[type.length - 1])) {
            ElMessage.warning(`请上传${accept}格式的文件！`)
            return
        }
        if (file.size > singleFileMax) {
            ElMessage.warning(`文件大小不能超过${showLimit.value}`)
            return
        }
        state.file = event.target.files[0]
    }
    input.click()
    document.body.removeChild(input)
}

const handleUpload = () => {
    if (state.file) {
        let { name, size, type } = state.file
        globalVBus.$emit('globalLoading', true)
        getFileUrl({
            bizType: 'app',
            fileName: name,
            fileSize: size,
        }).then(({ data }) => {
            if (data) {
                axios.put(data.upload, state.file, {
                    headers: {
                        "Content-Type": type
                    }
                }).then(() => {
                    state.fileUrlList.push({
                        url: data.url,
                        name,
                    })
                    state.file = ''
                    ElMessage.success('上传成功！')
                    globalVBus.$emit('globalLoading', false)
                }).catch(() => {
                    globalVBus.$emit('globalLoading', false)
                })
            } else {
                globalVBus.$emit('globalLoading', false)
            }
        }).catch(() => {
            globalVBus.$emit('globalLoading', false)
        })
    } else {
        ElMessage.warning('请选择文件后再进行上传操作！')
    }
}
</script>

<style lang="scss">
.appUpload {
    margin-left: 20px;
    .title {
        font-size: 20px;
        margin-bottom: 20px;
        font-weight: 600;
    }
    .main {
        display: flex;
        align-items: center;
        .name {
            margin-left: 10px;
        }
    }
    .but {
        width: 60px;
        margin: 20px 0;
    }
    .preview {
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>

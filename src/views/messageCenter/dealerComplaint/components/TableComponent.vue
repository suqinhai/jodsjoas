<template>
    <!-- 经销商投诉-表格 -->
    <div class="tabs-main dealer-complaint-main">
        <el-form class="filter-form" inline :model="state.formData">
            <el-form-item v-if="type !== 0">
                <el-select style="width: 100px" v-model="state.formData.timeType" placeholder="时间类型">
                    <el-option label="反馈时间" :value="0" />
                    <el-option label="操作时间" :value="1" />
                </el-select>
                <el-date-picker v-model="state.formData.receiveTime" type="daterange" value-format="YYYY-MM-DD" start-placeholder="开始时间"
                    end-placeholder="结束时间" :shortcuts="shortcuts" />
            </el-form-item>
            <el-form-item label="状态:" v-if="type === ''">
                <el-select class="select-box" v-model="state.formData.status" clearable placeholder="请选择状态">
                    <el-option v-for="item in metaData.dealerComplainStatus" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="用户ID:">
                <el-input v-model="state.formData.userId" placeholder="请输入用户ID" />
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click="fetchData('reset')">重 置</el-button>
            </el-form-item>
        </el-form>
        <el-table class="table-box" :data="state.tableData" border>
            <el-table-column prop="userId" label="反馈会员ID" min-width="120" align="center" />
            <el-table-column prop="user.name" label="反馈会员账号" min-width="140" align="center" />
            <el-table-column prop="source" label="来源商户ID" min-width="120" align="center">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.merchant.id)">
                        {{ row.merchant?.id || '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="source" label="来源商户名称" min-width="140" align="center">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.merchant.id)">
                        {{ row.merchant?.name || '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="addTime" label="反馈时间" min-width="160" align="center">
                <template #default="{ row }">{{ dateFormat(row.addTime)  }}</template>
            </el-table-column>
            <el-table-column v-if="type === ''" prop="status_" label="状态" min-width="100" align="center" />
            <el-table-column v-if="type !== 0" prop="updateTime" label="操作时间" min-width="160" align="center">
                <template #default="{ row }">{{ dateFormat(row.updateTime)  }}</template>
            </el-table-column>

            <el-table-column fixed="right" align="center" label="操作" width="100">
                <template #default="{ row }">
                    <el-button v-throttle type="primary" text @click="handleDispose(row)">
                        {{row.status === 0 ? '处理' : '查看'}}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination v-show="state.total > 0" :total="state.total" v-model:size="state.listQuery._size" v-model:page="state.listQuery._page"
            @pagination="fetchData"></Pagination>

        <DisposeDialog v-if="state.disposeDialoglShow" :itemData="state.itemData" @fetchData="fetchData" @lookVideo="lookVideo"
            @close="state.disposeDialoglShow = false">
        </DisposeDialog>

        <div v-if="state.isShow" class="video-preview" @click="state.isShow = false">
            <video controls :src="state.videoUrl" />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineAsyncComponent, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getDealerComplainList } from '@/api/messageCenter'
import { getShortcuts, dateFormat } from '@/common/util'
import { commonMetasApi } from '@/api/common'
const Pagination = defineAsyncComponent(() => import('@/components/Pagination/index.vue'))
const DisposeDialog = defineAsyncComponent(() => import('./DisposeDialog.vue'))

const shortcuts = getShortcuts()
const props = defineProps({
    type: {
        type: [Number, String],
        default: ''
    }
})
const state = reactive({
    formData: {
        timeType: 0
    },
    tableData: [],
    total: 0,
    listQuery: {
        _page: 1,
        _size: 10,
    },
    disposeDialoglShow: false,
    itemData: {},
    isShow: false,
    videoUrl: ''
})
let metaData = reactive({
    client: [],
    dealerComplainStatus: [],
})
const router = useRouter()

watch(
    () => props.type,
    (val) => {
        state.total = 0
        state.tableData = []
        state.listQuery._page = 1
        state.listQuery._size = 10
        state.formData = {
            timeType: 0
        }
        fetchData()
    },
)

commonMetasApi({ types: 'client,dealerComplainStatus' }).then(({ code, data }) => {
    if (code === 0 && data) {
        metaData.client = data.client.filter(item => item.value !== 'System' && item.value !== '?')
        metaData.dealerComplainStatus = data.dealerComplainStatus || []
    }
})

onMounted(() => {
    fetchData()
})

// 表格过滤数据处理
const fetchData = (val = '') => {
    if (val) {
        state.listQuery._page = 1
        if (val === 'reset') {
            state.formData = {
                timeType: 0
            }
        }
    }
    let params = { ...state.listQuery, ...state.formData }
    let { receiveTime } = state.formData
    if (receiveTime && receiveTime.length) {
        params['interval.begin'] = receiveTime[0]
        params['interval.end'] = receiveTime[1]
    } else {
        delete params.timeType
    }
    delete params.receiveTime
    if (typeof props.type === 'number') params.status = props.type
    globalVBus.$emit('globalLoading', true)
    getDealerComplainList(params).then(res => {
        let { total, list } = res.data
        state.tableData = list
        state.total = total
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        state.tableData = []
        globalVBus.$emit('globalLoading', false)
    })
}

// 查看商户详情
const showMerchantDetail = (id) => {
    globalVBus.$emit('merchantDetailDialog', id)
}

// 按钮操作
const handleDispose = (row) => {
    state.itemData = { ...row }
    state.disposeDialoglShow = true
}

const lookVideo = (val) => {
    state.videoUrl = val
    state.isShow = true
}
</script>

<style lang="scss">
.dealer-complaint-main {
    .video-preview {
        position: fixed;
        width: 100vw;
        height: 100vh;
        left: 0;
        top: 0;
        background-color: rgba(0, 0, 0, 0.6);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;

        video {
            width: 800px;
            height: 600px;
            background-color: #fff;
        }
    }
}
</style>

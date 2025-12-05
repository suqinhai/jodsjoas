<template>
    <!-- 操作日志 -->
    <div class="container operate-log">
        <el-tabs v-model="state.type" class="demo-tabs" @tab-change="handleClick">
            <el-tab-pane label="总台日志" name="1"></el-tab-pane>
            <el-tab-pane label="商户日志" name="2"></el-tab-pane>
        </el-tabs>
        <el-form class="filter-form" :model="state.searchForm" inline>
            <el-form-item>
                <el-date-picker style="width: 220px" v-model="state.searchForm.interval" type="daterange" start-placeholder="开始时间"
                    end-placeholder="结束时间" value-format="YYYY-MM-DD" :disabled-date="disabledDate" :shortcuts="shortcuts">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="商户ID:" v-if="state.type == 2">
                <el-input v-model="state.searchForm.merchantId" placeholder="请输入商户ID" />
            </el-form-item>
            <el-form-item label="站点ID:" v-if="state.type == 2">
                <el-input v-model="state.searchForm.siteId" placeholder="请输入站点ID" />
            </el-form-item>
            <el-form-item label="操作人:" prop="operatorName">
                <el-input v-model="state.searchForm.operatorName" placeholder="请输入操作人" />
            </el-form-item>
            <el-form-item label="操作模块:" prop="moduleName">
                <el-input v-model="state.searchForm.moduleName" placeholder="请输入操作模块" />
            </el-form-item>
            <el-form-item label="操作内容:">
                <el-input v-model="state.searchForm.func" placeholder="请输入操作内容" />
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click="fetchData('reset')">重 置</el-button>
            </el-form-item>
        </el-form>
        <el-table class="table-box" :data="state.tableData" border>
            <el-table-column prop="merchantId" label="商户ID" min-width="140" align="center" v-if="state.type == 2" />
            <el-table-column prop="siteId" label="站点ID" min-width="140" align="center" v-if="state.type == 2" />
            <el-table-column prop="moduleName" label="操作模块" min-width="140" align="center" />
            <el-table-column prop="func" label="操作内容" min-width="150" align="center" />
            <el-table-column prop="action" label="操作行为" min-width="150" align="center" />
            <el-table-column label="操作记录" align="center" min-width="400">
                <template #default="{ row }">
                    <div v-for="(item,index) in row.contentText" :key="index">
                        <div v-if="!!item.label">
                            <div>操作对象：{{ item.label }}</div>
                            <span>操作前：{{ item.old }}</span>
                            <span>；操作后：{{ item.now }}</span>
                        </div>
                        <div v-else>{{item || ''}}</div>
                    </div>
                </template>
                <!-- <el-table-column label="操作对象" align="center" min-width="240">
                    <template #default="{ row }">
                        <div v-for="(item,index) in row.contentText" :key="index">{{ item.label }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作前" min-width="120" align="center">
                    <template #default="{ row }">
                        <div class="row-text" v-for="(item,index) in row.contentText" :key="index">{{ item.old}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作后" min-width="120" align="center">
                    <template #default="{ row }">
                        <div class="row-text" v-for="(item,index) in row.contentText" :key="index">{{ item.now}}</div>
                    </template>
                </el-table-column> -->
            </el-table-column>
            <el-table-column prop="operatorName" label="操作人" min-width="120" align="center" />
            <el-table-column label="IP" min-width="140" align="center">
                <template #default="{ row }">
                    {{row.ip || ''}}
                    <!-- {{row.ip || ''}}{{row.region ? row.region+'/' : ''}} -->
                </template>
            </el-table-column>
            <el-table-column prop="operatorTime" label="操作时间" min-width="160" align="center">
                <template #default="{ row }">
                    <span>{{ dateFormat(row.operatorTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" min-width="120" align="center">
                <template #default="{ row }">
                    <el-button v-if="row.currents && row.olds" v-throttle type="primary" text @click="handleDetail(row)">详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination v-show="!!state.total" v-model:page="state.pageConfig._page" v-model:size="state.pageConfig._size" :total="state.total"
            @pagination="fetchData"></Pagination>

        <DetailDialog @close="state.detailDialogShow = false" v-if="state.detailDialogShow" :itemData="state.itemData">
        </DetailDialog>

    </div>
</template>

<script setup name="operateLog">
import { ref, reactive, onMounted, defineAsyncComponent } from 'vue'
import { platformList } from '@/api/manageConfig.js'
import { getShortcuts, dateFormat } from '@common/util'
const DetailDialog = defineAsyncComponent(() => import("./components/DetailDialog.vue"))

const shortcuts = getShortcuts()
const state = reactive({
    tableData: [],
    searchForm: {},
    pageConfig: {
        _page: 1,
        _size: 10,
    },
    type: '1',
    total: 0,
    detailDialogShow: false,
    itemData: {}
})
const disabledDate = ref((time) => {
    return time.getTime() > Date.now()
})

const handleClick = (val) => {
    if (state.type == '1') {
        delete state.searchForm.merchantId
        delete state.searchForm.siteId
        fetchData('reset')
    }
    if (state.type == '2') {
        state.pageConfig._page = 1
        state.searchForm = {}
        state.tableData = []
        state.total = 0
    }
}

onMounted(() => {
    fetchData()
})

const fetchData = (val = '') => {
    if (val) {
        state.pageConfig._page = 1
        if (val === 'reset') {
            if (state.type == '2') {
                state.searchForm = {}
                state.tableData = []
                state.total = 0
                return
            }
            state.searchForm = {}
        }
    }
    let params = { ...state.pageConfig, ...state.searchForm, type: state.type }
    let { interval } = state.searchForm
    if (interval && interval.length) {
        params['interval.begin'] = interval[0]
        params['interval.end'] = interval[1]
        delete params.interval
    }
    globalVBus.$emit('globalLoading', true)
    platformList(params).then(res => {
        let { total, list = [] } = res.data
        state.tableData = list.map(item => {
            if (item.content) {
                try {
                    let content = JSON.parse(item.content)
                    item.contentText = Array.isArray(content) ? content.filter(item => !!item && !!item.label) : [content]
                } catch (error) {
                    item.contentText = [item.content]
                }
            } else {
                item.contentText = []
            }
            return item
        })
        state.total = total
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        state.tableData = []
        globalVBus.$emit('globalLoading', false)
    })
}

const handleDetail = ({ currents, olds }) => {
    state.itemData.currentData = currents.split("\\r\\n").filter(item => !!item)
    state.itemData.oldData = olds.split("\\r\\n").filter(item => !!item)
    state.detailDialogShow = true

}
</script>

<style lang="scss">
.operate-log {
}
</style>

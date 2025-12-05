<template>
    <!-- 消息管理 -->
    <div class="container">
        <el-form class="filter-form" :model="state.searchForm" inline>
            <el-form-item>
                <el-date-picker style="width: 220px" v-model="state.searchForm.interval" type="daterange" start-placeholder="开始时间"
                    end-placeholder="结束时间" value-format="YYYY-MM-DD" :shortcuts="shortcuts">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="消息类型:">
                <el-select class="select-box" v-model="state.searchForm.type" placeholder="请选择消息类型" clearable>
                    <el-option v-for="item in state.newsTypeList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="消息状态:">
                <el-select class="select-box" v-model="state.searchForm.status" placeholder="请选择消息状态" clearable>
                    <el-option v-for="item in state.statusList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标题:">
                <el-input v-model="state.searchForm.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click="fetchData('reset')">重 置</el-button>
            </el-form-item>
            <el-form-item v-permiss="'admin.msg.addOrEdit'">
                <el-button v-throttle type="primary" @click="handleCreate">新 增</el-button>
            </el-form-item>
        </el-form>

        <el-table class="table-box" :data="state.tableData" border>
            <el-table-column prop="id" label="Id" align="center" min-width="80" />
            <el-table-column prop="type_" label="消息类型" min-width="120" align="center" />
            <el-table-column prop="title" label="标题" min-width="160" align="center" />
            <el-table-column prop="scope" label="提醒商户" min-width="120" align="center">
                <template #default="{ row }">
                    <span>{{ state.receiveList.find((item) => item.value * 1 == row.scope)?.label || '' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="sendTime" label="发送时间" min-width="160" align="center">
                <template #default="{ row }">
                    <span>{{ dateFormat(row.sendTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="endTime" label="结束时间" min-width="160" align="center">
                <template #default="{ row }">
                    <span>{{ dateFormat(row.endTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" min-width="120" align="center">
                <template #default="{ row }">
                    <span v-if="row.status == 1" style="color: red">{{row.status_}}</span>
                    <span v-else-if="row.status == 0" style="color: rgb(170,170,170)">{{row.status_}}</span>
                    <span v-else-if="row.status == -1" style="color: green">{{row.status_}}</span>
                    <!-- <span v-else-if="row.status == 1" style="color: red">{{row.status_}}</span> -->
                </template>
            </el-table-column>
            <el-table-column prop="emp.name" label="操作人" min-width="140" align="center" />
            <el-table-column prop="updateTime" label="操作时间" min-width="160" align="center">
                <template #default="{ row }">
                    <span>{{ dateFormat(row.updateTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="160" align="center">
                <template #default="{ row }">
                    <div class="operateBtn">
                        <el-button v-throttle type="primary"
                            v-if="userData.isHasPermiss('admin.msg.addOrEdit') && (row.status == -1 || row.status == 0)" @click="handleEdit(row)"
                            link>修改
                        </el-button>
                        <el-button v-throttle v-if="userData.isHasPermiss('admin.msg.addOrEdit') && (row.status == 2 || row.status == 1)"
                            type="primary" @click="handleDetail(row)" link>详情
                        </el-button>
                        <el-button v-throttle type="danger" v-if="row.status != 1 && userData.isHasPermiss('admin.msg.addOrEdit')"
                            @click="handleDel(row)" link>删除</el-button>
                        <el-button v-throttle v-if="row.status == 1 && userData.isHasPermiss('admin.msg.addOrEdit')" type="warning"
                            @click="handleRecall(row)" link>撤回</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <Pagination v-show="!!state.total" v-model:page="state.pageConfig._page" v-model:size="state.pageConfig._size" :total="state.total"
            @pagination="fetchData"></Pagination>

        <OperateDialog v-if="state.showOperateDialog" @close="state.showOperateDialog = false" v-model:formDialog="state.formDialog"
            :operateType="state.operateType" :newsTypeList="state.newsTypeList" :receiveList="state.receiveList"
            :merchantLevelList="state.merchantLevelList" @confirm="handleConfirm">
        </OperateDialog>
    </div>
</template>

<script setup name="messageManage">
import { reactive, onMounted, defineAsyncComponent } from "vue"
import userStore from '@/store/user'
import { commonMetasApi } from '@/api/common.js'
import { messageConfigListApi, messageConfigEditStatusApi, messageConfigDeleteApi, messageConfigAddOrEditApi } from '@/api/messageCenter.js'
import { ElMessageBox } from 'element-plus'
import { dateFormat, getShortcuts } from "@/common/util/index.js"
const Pagination = defineAsyncComponent(() => import('@/components/Pagination/index.vue'))
const OperateDialog = defineAsyncComponent(() => import("./components/OperateDialog.vue"))

const shortcuts = getShortcuts()
const state = reactive({
    tableData: [],
    searchForm: {},
    pageConfig: {
        _page: 1,
        _size: 10,
    },
    total: 0,
    operateType: false, //false 详情 true 新增/修改
    showOperateDialog: false,
    formDialog: {},
    merchantLevelList: [],
    newsTypeList: [],
    statusList: [],
    receiveList: [],
})
const userData = userStore()

onMounted(() => {
    commonMetasApi({ types: 'merchantLevel,msgType,msgStatus,merchantMsgScope' }).then(({ code, data }) => {
        if (code == 0) {
            state.merchantLevelList = data.merchantLevel
            state.newsTypeList = data.msgType
            state.statusList = data.msgStatus
            state.receiveList = data.merchantMsgScope.filter((item) => { return item.label != '代理消息' })
            // v-if="item.label != '代理消息'"  测试yhui说先隐藏 
        }
    })
    fetchData()
})

const fetchData = (val = '') => {
    if (val) {
        state.pageConfig._page = 1
        if (val === 'reset') {
            state.searchForm = {}
        }
    }
    let params = { ...state.pageConfig, ...state.searchForm }
    let { interval } = state.searchForm
    if (interval && interval.length) {
        params['interval.begin'] = interval[0]
        params['interval.end'] = interval[1]
        delete params.interval
    }
    globalVBus.$emit('globalLoading', true)
    messageConfigListApi(params).then(res => {
        let { total, list = [] } = res.data
        state.tableData = list
        state.total = total
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        state.tableData = []
        globalVBus.$emit('globalLoading', false)
    })
}

//点击修改
const handleEdit = (row) => {
    state.operateType = true
    state.formDialog = { ...row }
    state.formDialog.type = row.type + ''
    state.formDialog.scope = row.scope + ''
    state.formDialog.sendType = row.sendType + ''
    state.formDialog.pop = row.pop + ''
    if (row.pop == 1) {
        state.formDialog.popUp = row.popUp + ''
        state.formDialog.endTime = row.endTime
    }
    if (row.scope == 101) {
        state.formDialog.ranges = row.ranges
    } else if (row.scope == 102) {
        state.formDialog.rangesLevel = row.ranges.split(',')
    }
    state.showOperateDialog = true
}

//点击删除
const handleDel = (row) => {
    ElMessageBox.confirm('删除后不可恢复，是否确认删除？', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'error',
    })
        .then(() => {
            globalVBus.$emit('globalLoading', true)
            messageConfigDeleteApi({ id: row.id }).then(() => {
                fetchData()
            }).catch(() => {
                globalVBus.$emit('globalLoading', false)
            })
        })
        .catch(() => { })
}

//点击详情
const handleDetail = (row) => {
    state.formDialog = { ...row }
    state.operateType = false
    state.formDialog.type = row.type + ''
    state.formDialog.scope = row.scope + ''
    state.formDialog.sendType = row.sendType + ''
    state.formDialog.pop = row.pop + ''
    if (row.pop == 1) {
        state.formDialog.popUp = row.popUp + ''
        state.formDialog.endTime = row.endTime
    }
    if (row.scope == 101) {
        state.formDialog.ranges = row.ranges
    } else if (row.scope == 102) {
        state.formDialog.rangesLevel = row.ranges.split(',')
    }
    state.showOperateDialog = true
}

//点击撤回
const handleRecall = (value) => {
    ElMessageBox.confirm('确认要撤回此条消息嘛？', '撤回', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'error',
    })
        .then(async () => {
            const { code } = await messageConfigEditStatusApi({
                id: value.id,
                status: -1,
            })
            if (code == 0) {
                fetchData()
            }
        })
        .catch(() => {

        })
}

//点击新增
const handleCreate = () => {
    state.operateType = true
    state.formDialog = {}
    state.formDialog.messageType = '0'
    state.showOperateDialog = true
}

//表单提交
const handleConfirm = async (params) => {
    delete params.pop
    const { code } = await messageConfigAddOrEditApi(params)
    if (code == 0) {
        // ElMessage.success(`${params.id ? '修改' : '新增'}成功`)
        state.showOperateDialog = false
        fetchData()
    }
}
</script>

<style lang="scss">
</style>

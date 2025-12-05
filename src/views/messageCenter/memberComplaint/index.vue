<template>
    <!-- 会员投诉 -->
    <div class="container member-complaint">
        <el-form class="filter-form" :model="state.searchForm" inline>
            <el-form-item>
                <el-date-picker style="width: 220px" v-model="state.searchForm.interval" type="daterange" start-placeholder="开始时间"
                    end-placeholder="结束时间" value-format="YYYY-MM-DD" :shortcuts="shortcuts">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="消息状态:">
                <el-select class="select-box" v-model="state.searchForm.status" placeholder="请选择消息状态" clearable>
                    <el-option v-for="item in state.statusList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
			<el-form-item label="站点ID:">
			    <el-input v-model="state.searchForm.merchantId" placeholder="请输入站点ID" />
			</el-form-item>
			<el-form-item label="会员ID:">
			    <el-input v-model="state.searchForm.userId" placeholder="请输入会员ID" />
			</el-form-item>
			<el-form-item label="会员账号:">
			    <el-input v-model="state.searchForm.userName" placeholder="请输入会员账号" />
			</el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click="fetchData('reset')">重 置</el-button>
            </el-form-item>
			<el-form-item>
			    <el-button v-throttle type="primary" @click="state.reportSetDialogShow = true">投诉触发设置</el-button>
			</el-form-item>
			<el-form-item>
			    <el-button v-throttle type="primary" @click="state.insureWarnSetDialogShow = true">投诉提醒设置</el-button>
			</el-form-item>
        </el-form>

        <el-table class="table-box" :data="state.tableData" border>
			<el-table-column prop="addTime" label="被投诉日期" align="center" min-width="110"/>
            <el-table-column prop="merchantId" label="商户ID" align="center">
				<template #default="{ row }">
			        <span class="special pointer" @click="showMerchantDetail(row.merchantId)">
			            {{ row.merchantId }}
			        </span>
			    </template>
			</el-table-column>
            <el-table-column prop="merchantName" label="商户名称" align="center">
				<template #default="{ row }">
			        <span class="special pointer" @click="showMerchantDetail(row.merchantId)">
			            {{ row.merchantName }}
			        </span>
			    </template>
			</el-table-column>
            <el-table-column prop="siteId" label="站点ID" align="center" />
            <el-table-column prop="siteName" label="站点名称" align="center" />
            <el-table-column prop="contact" label="投诉人详情" align="center" min-width="70">
				<template #default="{ row }">
			        <span class="special pointer" @click="clickComplaintDetails(row)">查看</span>
			    </template>
			</el-table-column>
            <el-table-column prop="feedbackContent" label="投诉内容" align="center" min-width="70">
                <template #default="{ row }">
                    <span class="special pointer" @click="clickOperateDialog(row)">查看</span>
                </template>
            </el-table-column>
			<el-table-column prop="count" label="投诉次数" align="center" min-width="70" />
            <el-table-column prop="diff" label="未处理时间（天）" align="center" min-width="90" />
            <el-table-column prop="status" label="商户处理状态" align="center">
                <template #default="{ row }">
                   {{['未处理','已处理'][row.status]}}
                </template>
            </el-table-column>
			<el-table-column label="处理人" prop="emp.name" align="center" />
			<el-table-column label="处理时间" prop="updateTime" align="center" min-width="110" />
        </el-table>

        <Pagination v-show="!!state.total" v-model:page="state.pageConfig._page" v-model:size="state.pageConfig._size"
            :total="state.total" @pagination="fetchData"></Pagination>

        <OperateDialog v-if="state.showOperateDialog" @close="state.showOperateDialog = false"
            v-model:formDialog="state.formDialog" @lookVideo="lookVideo">
        </OperateDialog>
		
		<InsureWarnSetDialog v-if="state.insureWarnSetDialogShow" @close="state.insureWarnSetDialogShow = false"></InsureWarnSetDialog>
		<ReportSetDialog v-if="state.reportSetDialogShow" @close="state.reportSetDialogShow = false"></ReportSetDialog>
		<ComplaintDetails :itemData="state.itemData" v-if="state.complaintDetailsShow" @close="state.complaintDetailsShow = false"></ComplaintDetails>
		
		<div v-if="state.isShow" class="video-preview" @click="state.isShow = false">
		    <video controls :src="state.videoUrl" />
		</div>
    </div>
</template>

<script setup name="memberComplaint">
import Pagination from '@/components/Pagination/index.vue'
import { reactive, onMounted, defineAsyncComponent } from "vue";
import userStore from '@/store/user'
import { getList2 } from '@/api/manageConfig.js'
import { dateFormat, getShortcuts } from "@/common/util/index.js";
const OperateDialog = defineAsyncComponent(() => import("./components/OperateDialog.vue"))
const InsureWarnSetDialog = defineAsyncComponent(() => import("./components/InsureWarnSetDialog.vue"))
const ReportSetDialog = defineAsyncComponent(() => import("./components/ReportSetDialog.vue"))
const ComplaintDetails = defineAsyncComponent(() => import("./components/ComplaintDetails.vue"))


const shortcuts = getShortcuts()
const state = reactive({
    tableData: [],
    searchForm: {},
    pageConfig: {
        _page: 1,
        _size: 10,
    },
    total: 0,
    showOperateDialog: false,
    formDialog: {},
    statusList: [
		{value:0,label:'未处理'},
		{value:1,label:'已处理'}
	],
	isShow: false,
	videoUrl: '',
	itemData: {},
	insureWarnSetDialogShow: false,
	reportSetDialogShow: false,
	complaintDetailsShow: false
})
const userData = userStore()

onMounted(() => {
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
	params['type'] = 0
    globalVBus.$emit('globalLoading', true)
    getList2(params).then(res => {
        let { total, list = [] } = res.data
		list.forEach((item)=>{
			item.addTime = item.addTime ? dateFormat(item.addTime) : ''
			item.updateTime = item.updateTime ? dateFormat(item.updateTime) : ''
			item.registerTime = item.registerTime ? dateFormat(item.registerTime) : ''
		})
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

const clickComplaintDetails = (data)=>{
	state.itemData = data
	state.complaintDetailsShow = true
}

const clickOperateDialog = (data)=>{
	state.formDialog = data
	state.showOperateDialog = true
}

const lookVideo = (val) => {
    state.videoUrl = val
    state.isShow = true
}
</script>

<style lang="scss">
.member-complaint {
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

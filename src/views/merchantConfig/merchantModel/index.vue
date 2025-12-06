<template>
    <!-- 商户模式修改 -->
    <div class="container">
        <el-form class="filter-form" :model="state.searchForm" inline>
            <el-form-item label="商户ID:">
                <el-input v-model="state.searchForm.groupId" placeholder="请输入商户ID" />
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click="fetchData('reset')">重 置</el-button>
            </el-form-item>
        </el-form>
        <div class="tips-box">修改抽成，立即生效</div>
        <el-table class="table-box" :data="state.tableData" border>
            <el-table-column label="商户ID" align="center">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.group.id)">
                        {{ row.group?.id || '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="商户名称" align="center">
                <template #default="{ row }">
                    <span class="special pointer" @click="showMerchantDetail(row.group.id)">
                        {{ row.group?.name || '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="commissionMode_" label="抽成模式" align="center" />
            <el-table-column prop="PGC" label="打码比例" align="center">
                <template #default="{ row }">
                    <div v-if="row.commissionMode == 1">{{row.PGC?.shareRate}}</div>
                    <div v-if="row.commissionMode == 2">
                        <div>rtp&#62;100：{{row.PGC?.rtpUpRate}}</div>
                        <div>rtp&#60;100：{{row.PGC?.rtpDnRate}}</div>
                    </div>
                </template>
            </el-table-column>
			<el-table-column prop="NJL" label="打码比例" align="center">
			    <template #default="{ row }">
			        <div v-if="row.commissionMode == 1">{{row.NJL?.shareRate}}</div>
			        <div v-if="row.commissionMode == 2">
			            <div>rtp&#62;100：{{row.NJL?.rtpUpRate}}</div>
			            <div>rtp&#60;100：{{row.NJL?.rtpDnRate}}</div>
			        </div>
			    </template>
			</el-table-column>
            <el-table-column prop="NPP" label="打码比例" align="center">
                <template #default="{ row }">
                    <div v-if="row.commissionMode == 1">{{row.NPP?.shareRate}}</div>
                    <div v-if="row.commissionMode == 2">
                        <div>rtp&#62;100：{{row.NPP?.rtpUpRate}}</div>
                        <div>rtp&#60;100：{{row.NPP?.rtpDnRate}}</div>
                    </div>
                </template>
            </el-table-column>
            <!--            <el-table-column prop="balance" label="控制模式" align="center" /> -->
            <el-table-column fixed="right" label="操作" align="center">
                <template #default="{ row }">
                    <el-button v-if="row.NJL || row.PGC" v-throttle type="text" @click="handleEdit(row)" v-permiss="'admin.merchant.editMode-commission'">修改抽成
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <Pagination v-show="!!state.total" v-model:page="state.pageConfig._page" v-model:size="state.pageConfig._size" :total="state.total"
            @pagination="fetchData"></Pagination>

        <EditDialog v-model:itemData="state.itemData" @close="state.showEditDialog = false" v-if="state.showEditDialog"
            @resetData="fetchData('reset')"></EditDialog>
    </div>
</template>

<script setup name="msgManage">
import { reactive, onMounted, defineAsyncComponent } from "vue"
import { getModeList } from '@/api/merchantConfig.js'
const Pagination = defineAsyncComponent(() => import('@/components/Pagination/index.vue'))
const EditDialog = defineAsyncComponent(() => import("./components/editDialog/index.vue"))


const state = reactive({
    searchForm: {},
    tableData: [],
    pageConfig: {
        _page: 1,
        _size: 10,
    },
    total: 0,
    showEditDialog: false,
})

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
    globalVBus.$emit('globalLoading', true)
    getModeList(params).then(res => {
        let { total, list = [] } = res.data
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

//修改
const handleEdit = async (values) => {
    state.itemData = values
    state.showEditDialog = true
}

</script>

<style lang="scss" scoped>
</style>

<template>
    <div class="vende-record">
        <el-table :data="state.tableData" border>
            <el-table-column prop="addTime" label="创建时间" min-width="160" align="center" />
            <el-table-column prop="name" label="站点名称" min-width="120" align="center" />
            <el-table-column prop="id" label="站点ID" min-width="120" align="center" />
            <!-- <el-table-column prop="ctrlMode" label="控制模式" min-width="120" align="center">
				<template #default="{ row }">
			       {{row.ctrlMode === 0 ? '简易模式' : row.ctrlMode === 1 ? '专业模式' : '' }}
			    </template>
			</el-table-column> -->
            <el-table-column prop="siteStatus_" label="状态" min-width="120" align="center" />
            <!-- <el-table-column label="操作" align="center" width="160" fixed="right">
                <template #default="{ row }">
                    <el-button v-throttle type="primary" link @click="handleEditControl(row)"> 修改控制</el-button>
                </template>
            </el-table-column> -->
        </el-table>
        <Pagination v-show="state.total > 0" :total="state.total" v-model:page="state.listQuery._page" v-model:size="state.listQuery._size"
            @pagination="fetchData">
        </Pagination>

        <EditControl v-if="state.showEditControl" :itemData="state.itemData" @close="state.showEditControl = false" @fetchData="fetchData">
        </EditControl>
    </div>
</template>

<script setup>
import { reactive, onMounted, inject, defineAsyncComponent } from 'vue'
import { getSubsiteNumberData } from '@/api/merchantConfig'
import { dateFormat } from '@/common/util'
const EditControl = defineAsyncComponent(() => import("./components/EditControl.vue"))
import commonStore from '@/store/common'
const commonData = commonStore()
const provideData = inject('provideData')
const state = reactive({
    tableData: [],
    total: 0,
    listQuery: {
        _page: 1,
        _size: 10,
    },
    showEditControl: false,
    itemData: {},
})

onMounted(() => {
    fetchData()
})

const fetchData = () => {
    let params = {
        groupId: commonData.activeMerchantId || provideData.merchantId,
        ...state.listQuery
    }
    provideData.showLoading()
    getSubsiteNumberData(params).then(res => {
        let { total, list = [] } = res.data
        state.total = total || 0
        state.tableData = list.map(item => {
            item.addTime && (item.addTime = dateFormat(item.addTime))
            return item
        })
        provideData.hideLoading()
    }).catch(() => {
        state.tableData = []
        provideData.hideLoading()
    })
}

const handleEditControl = (data) => {
    state.itemData = data
    state.showEditControl = true
}
</script>

<style lang="scss">
.vende-record {
}
</style>

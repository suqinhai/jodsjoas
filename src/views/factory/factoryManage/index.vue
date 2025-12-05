<template>
    <!-- 厂家管理 -->
    <div class="container">
        <el-form class="filter-form" :model="state.searchForm" inline>
            <el-form-item label="厂家选择:">
                <el-select class="select-box" v-model="state.searchForm.alias" placeholder="请选择厂家" clearable>
                    <el-option v-for="item in state.gameVendorList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="货币选择:">
                <el-select class="select-box" v-model="state.searchForm.currency" placeholder="请选择货币" clearable>
                    <el-option v-for="item in state.currencyList" :key="item.value" :label="item.label" :value="item.label">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="游戏类型:">
                <el-select class="select-box" v-model="state.searchForm.type" placeholder="请选择游戏类型" clearable>
                    <el-option v-for="item in state.gameTypeList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click="fetchData('reset')">重 置</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="state.tableData" border class="table-box">
            <el-table-column prop="id" label="ID" align="center" />
            <el-table-column prop="name_" label="游戏厂家" align="center" />
            <el-table-column prop="type" label="游戏类型" align="center">
                <template #default="{row}">
                    <span v-if="state.gameTypeList.length">{{
          state.gameTypeList.filter((item) => item.value == row.type).length && state.gameTypeList.filter((item) => item.value == row.type)[0].label
        }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="currency" label="货币" align="center" />
            <el-table-column prop="shareRate" label="厂家分成" align="center" />
            <el-table-column prop="status" label="厂家开关" align="center">
                <template #default="{row}">
                    <el-switch :disabled="!userData.isHasPermiss('admin.vendor.edit')" v-model="row.status" :active-value="1" :inactive-value="0"
                        @change="handleChangStatus(row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="maintain" label="维护开关" align="center">
                <template #default="{row}">
                    <el-switch :disabled="!userData.isHasPermiss('admin.vendor.edit')" v-model="row.maintain" :active-value="1" :inactive-value="0"
                        @change="handleChangMaintain(row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="gameNum" label="子游戏数量" align="center">
                <template #default="{row}">
                    <el-button v-throttle type="primary" link @click="handleGameNum(row)">{{ row.gameNum }}</el-button>
                </template>
            </el-table-column>
            <el-table-column width="150" prop="image" label="厂家图标" align="center">
                <template #default="{row}">
                    <el-image v-if="!!row.image" class="imgs" :src="row.image" :preview-src-list="[row.image]" :crossorigin="null" preview-teleported
                        fit="contain" />
                </template>
            </el-table-column>
            <el-table-column width="150" label="厂家宣传图标(欧美)" align="center">
                <template #default="{row}">
                    <el-image v-if="!!row.sloganImage_us" class="imgs" :src="row.sloganImage_us" :preview-src-list="[row.sloganImage_us]"
                        :crossorigin="null" preview-teleported fit="contain" />
                </template>
            </el-table-column>
            <el-table-column width="150" label="热门图片(欧美)" align="center">
                <template #default="{row}">
                    <el-image v-if="!!row.hotImage_us" class="imgs" :src="row.hotImage_us" :preview-src-list="[row.hotImage_us]" :crossorigin="null"
                        preview-teleported fit="contain" />
                </template>
            </el-table-column>
            <el-table-column width="150" label="厂家宣传图标(亚太)" align="center">
                <template #default="{row}">
                    <el-image v-if="!!row.sloganImage_as" class="imgs" :src="row.sloganImage_as" :preview-src-list="[row.sloganImage_as]"
                        :crossorigin="null" preview-teleported fit="contain" />
                </template>
            </el-table-column>
            <el-table-column width="150" label="热门图片(亚太)" align="center">
                <template #default="{row}">
                    <el-image v-if="!!row.hotImage_as" class="imgs" :src="row.hotImage_as" :preview-src-list="[row.hotImage_as]" :crossorigin="null"
                        preview-teleported fit="contain" />
                </template>
            </el-table-column>
            <!-- <el-table-column width="150" label="定制版LOGO(已选择)" align="center">
                <template #default="{row}">
                    <el-image v-if="!!row.activeLogo" class="imgs" :src="row.activeLogo" :preview-src-list="[row.activeLogo]" :crossorigin="null"
                        preview-teleported fit="contain" />
                </template>
            </el-table-column>
            <el-table-column width="150" label="定制版LOGO(未选择)" align="center">
                <template #default="{row}">
                    <el-image v-if="!!row.nonActiveLogo" class="imgs" :src="row.nonActiveLogo" :preview-src-list="[row.nonActiveLogo]"
                        :crossorigin="null" preview-teleported fit="contain" />
                </template>
            </el-table-column> -->
            <el-table-column label="操作" align="center" fixed="right">
                <template #default="{row}">
                    <el-button v-throttle v-permiss="'admin.vendor.edit'" type="primary" link @click="handleEdit(row)">修改
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <Pagination v-show="!!state.total" v-model:page="state.pageConfig._page" v-model:size="state.pageConfig._size" :total="state.total"
            @pagination="fetchData"></Pagination>

        <EditDialog v-model:editForm="state.editForm" @close="state.showEditDialog = false" @confirm="vendorEdit" v-if="state.showEditDialog">
        </EditDialog>
    </div>
</template>

<script setup name="factoryManage">
import { reactive, onMounted, defineAsyncComponent } from "vue"
import { useRouter } from 'vue-router'
import userStore from '@/store/user'
import { getvendorList, editVendor } from '@/api/factory.js'
import { commonMetasApi } from '@/api/common.js'
const EditDialog = defineAsyncComponent(() => import("./components/EditDialog.vue"))

const state = reactive({
    searchForm: {},
    editForm: {},
    tableData: [],
    pageConfig: {
        _page: 1,
        _size: 10,
    },
    total: 0,
    showEditDialog: false,
    gameVendorList: [], //厂商元数据
    currencyList: [], //货币元数据
    gameTypeList: [], //游戏类型元数据
})
const router = useRouter()
const userData = userStore()

onMounted(() => {
    commonMetasApi({ types: 'gameVendor,currency,gameType' }).then(({ code, data }) => {
        if (code == 0) {
            state.gameVendorList = data.gameVendor
            state.gameTypeList = data.gameType
            state.currencyList = data.currency
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
    globalVBus.$emit('globalLoading', true)
    getvendorList(params).then(res => {
        let { total, list = [] } = res.data
        list.forEach((item) => {
            item.sloganImages = item.sloganImages?.split(',') || []
            item.hotImages = item.hotImages?.split(',') || []
            if (item.sloganImages.length) {
                item.sloganImage_us = item.sloganImages[0] || ''
                item.sloganImage_as = item.sloganImages[1] || ''
            }
            if (item.hotImages.length) {
                item.hotImage_us = item.hotImages[0] || ''
                item.hotImage_as = item.hotImages[1] || ''
            }
        })
        state.tableData = list
        state.total = total
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        state.tableData = []
        globalVBus.$emit('globalLoading', false)
    })
}

//修改
const handleEdit = (value) => {
    let { id, status, maintain, image, sloganImage_us, sloganImage_as, hotImage_us, hotImage_as, activeLogo = '', nonActiveLogo = '', shareRate, alias, type } = value
    state.editForm = {
        id,
        status,
        maintain,
        image,
        sloganImage_us,
        sloganImage_as,
        hotImage_us,
        hotImage_as,
        // activeLogo,
        // nonActiveLogo,
        shareRate,
        alias,
        type
    }
    state.showEditDialog = true
}

const vendorEdit = async () => {
    state.editForm.sloganImages = [state.editForm.sloganImage_us, state.editForm.sloganImage_as].join(',')
    state.editForm.hotImages = [state.editForm.hotImage_us, state.editForm.hotImage_as].join(',')
    // state.editForm.customizedImages = [state.editForm.activeLogo, state.editForm.nonActiveLogo].join(',')
    const res = await editVendor(state.editForm)
    state.showEditDialog = false
    delete state.editForm.sloganImage_us
    delete state.editForm.sloganImage_as
    delete state.editForm.hotImage_us
    delete state.editForm.hotImage_as
    delete state.editForm.activeLogo
    delete state.editForm.nonActiveLogo
    fetchData()
}

//修改维护开关状态
const handleChangMaintain = (value) => {
    globalVBus.$emit('globalLoading', true)
    editVendor({
        id: value.id,
        maintain: value.maintain,
    }).then(() => {
        fetchData()
    }).catch(() => {
        value.maintain = value.maintain ? 0 : 1
        globalVBus.$emit('globalLoading', false)
    })
}

const handleChangStatus = async (value) => {
    globalVBus.$emit('globalLoading', true)
    editVendor({
        id: value.id,
        status: value.status,
    }).then(() => {
        fetchData()
    }).catch(() => {
        value.status = value.status ? 0 : 1
        globalVBus.$emit('globalLoading', false)
    })
}

// 点击子游戏列表
const handleGameNum = (value) => {
    router.push({
        path: '/factory/game-manage',
        query: {
            id: value.id,
            alias: value.alias,
            currency: value.currency,
            type: value.type,
        },
    })
}
</script>

<style lang="scss" scoped>
</style>

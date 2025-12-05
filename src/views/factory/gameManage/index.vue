<template>
    <!-- 子游戏管理 -->
    <div class="container">
        <el-form class="filter-form" :model="state.searchFrom" inline>
            <el-form-item label="厂家选择:">
                <el-select class="select-box" v-model="state.searchFrom.alias" placeholder="请选择厂家">
                    <el-option v-for="item in state.gameVendorList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="游戏类型:">
                <el-select class="select-box" v-model="state.searchFrom.type" placeholder="请选择游戏类型" @change="getTagListHandle">
                    <el-option v-for="item in state.gameTypeList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="游戏ID:">
                <el-input v-model="state.searchFrom.gameId" placeholder="请输入游戏ID"></el-input>
            </el-form-item>
            <el-form-item label="游戏名称:">
                <el-input v-model="state.searchFrom.name" placeholder="请输入游戏名称"></el-input>
            </el-form-item>
            <el-form-item label="标签选择:">
                <el-select 
                v-model="state.searchFrom.tagId" 
                placeholder="请选择标签"
                :disabled="!state.searchFrom.type"
                clearable
                >
                    <el-option label="全部标签" value=""></el-option>
                    <el-option v-for="item in state.tagList" :key="item.id" :label="item.zhName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="gameListGet('search')">搜 索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle @click="gameListGet('reset')">重 置</el-button>
            </el-form-item>
            <el-form-item v-permiss="'admin.game.renew'">
                <el-button v-throttle type="primary" @click="handleUpdateGame">更新指定游戏</el-button>
            </el-form-item>
            <el-form-item v-permiss="'admin.game.edit'">
                <el-dropdown @command="handleBatch">
                    <el-button v-throttle type="primary">
                        批量操作
                        <el-icon class="el-icon--right">
                            <arrow-down />
                        </el-icon>
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item v-for="(item,index) in operateTypeData" :key="index" :command="item.type">
                                {{item.title}}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="handleLabelsManagement">标签管理</el-button>
            </el-form-item>
        </el-form>
        <el-table ref="tableRef" class="table-box" :data="state.gameList" border @selection-change="handleSelectionChange">
            <el-table-column fixed="left" type="selection" width="55" />
            <el-table-column prop="sort" label="排序" width="100" align="center" />
            <el-table-column prop="gameId" label="游戏ID" min-width="120" align="center" />
            <el-table-column prop="name" label="游戏名称" min-width="140" align="center" />
            <el-table-column label="游戏开关" min-width="100" align="center">
                <template #default="{row}">
                    <el-switch :disabled="!userData.isHasPermiss('admin.game.edit')" v-model="row.status" :active-value="1" :inactive-value="0"
                        @change="handleSwitch(row,'status')">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="维护开关" min-width="100" align="center">
                <template #default="{row}">
                    <el-switch :disabled="!userData.isHasPermiss('admin.game.edit')" v-model="row.maintain" :active-value="1" :inactive-value="0"
                        @change="handleSwitch(row,'maintain')">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="图标(欧美)" min-width="120" align="center">
                <template #default="{row}">
                    <el-image v-if="!!row.image_us" :src="row.image_us" class="imgs" :preview-src-list="[row.image_us]" :crossorigin="null"
                        preview-teleported fit="contain" lazy></el-image>
                </template>
            </el-table-column>
            <el-table-column label="图标(亚太)" min-width="120" align="center">
                <template #default="{row}">
                    <el-image v-if="!!row.image_as" :src="row.image_as" class="imgs" :preview-src-list="[row.image_as]" :crossorigin="null"
                        preview-teleported fit="contain" lazy></el-image>
                </template>
            </el-table-column>
            <el-table-column label="图标(定制版)" min-width="120" align="center">
                <template #default="{row}">
                    <el-image v-if="!!row.image_c" :src="row.image_c" class="imgs" :preview-src-list="[row.image_c]" :crossorigin="null"
                        preview-teleported fit="contain" lazy></el-image>
                </template>
            </el-table-column>

            <!--            <el-table-column label="遮罩图" min-width="100" align="center">
                <template #default="{row}">
                    <el-image v-if="!!row.maskImage" :src="row.maskImage" class="imgs" :preview-src-list="[row.maskImage]"
                        :crossorigin="null" preview-teleported fit="contain" lazy></el-image>
                </template>
            </el-table-column> -->
            <el-table-column label="标签" min-width="160" align="center" prop="tagNames"></el-table-column>
            <el-table-column label="更新时间" min-width="160" align="center">
                <template #default="{ row }">
                    <span>{{ dateFormat(row.updateTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="100" align="center">
                <template #default="{ row }">
                    <el-button v-throttle v-permiss="'admin.game.edit'" link type="primary" @click="handleEdit(row)">修改
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <Pagination v-show="!!state.total" v-model:page="state.pageConfig._page" v-model:size="state.pageConfig._size" :total="state.total"
            isShowChecked :selectedNum="state.selectedNum" @pagination="gameListGet"></Pagination>

        <EditDeployDialog 
        v-if="state.showEditDialog"
        v-model:editForm="state.editForm" 
        :tags="state.tagList"
        @close="state.showEditDialog = false" 
        @confirm="editGame" 
        >
        </EditDeployDialog>
        <EditMaskImage :itemData="state.itemData" @close="state.showEditMaskImage= false" @refresh="gameListGet" v-if="state.showEditMaskImage">
        </EditMaskImage>
        <EditTagsDialog 
        v-if="showEditTagsDialog" 
        :gameType="state.searchFrom.type" 
        :gameTypeList="state.gameTypeList"
        @close="showEditTagsDialog= false"
        @confirm="refreshTags"/>
    </div>
</template>

<script setup name="gameManage">
import { reactive, ref, onMounted, h, defineAsyncComponent, onActivated } from 'vue'
import userStore from '@/store/user'
import { useRoute } from 'vue-router'
import { ElMessageBox, ElMessage, ElForm, ElFormItem, ElSelect, ElOption } from 'element-plus'
import { getGameList, gameEdit, gameRenew, batchEditGameData, getTagList, editTag } from '@/api/factory.js'
import { commonMetasApi } from '@/api/common.js'
import { dateFormat } from "@/common/util/index"
const EditDeployDialog = defineAsyncComponent(() => import("./components/EditDeployDialog.vue"))
const EditMaskImage = defineAsyncComponent(() => import("./components/EditMaskImage.vue"))
const EditTagsDialog = defineAsyncComponent(() => import("./components/EditTagsDialog.vue"))

const operateTypeData = [
    { type: 1, title: '游戏开关-关闭' },
    { type: 2, title: '游戏开关-开启' },
    { type: 3, title: '维护开关-关闭' },
    { type: 4, title: '维护开关-开启' },
    { type: 5, title: '遮罩图' },
]
const route = useRoute()
const state = reactive({
    showEditDialog: false,
    pageConfig: {
        _page: 1,
        _size: 10,
    },
    total: 0,
    selectedNum: 0,
    tableListSelection: [],
    searchFrom: {},
    updateGameForm: {
        gameVendor: '',
    }, //更新子游戏表单
    editForm: {}, //修改子游戏表单
    gameList: [], //子游戏列表
    gameVendorList: [],
    currencyList: [],
    gameTypeList: [],
    itemData: {},
    showEditMaskImage: false,
    initData: {},
    tagList: [],
})
const showEditTagsDialog = ref(false) // 标签管理弹窗
const userData = userStore()
const tableRef = ref(null)

onMounted(async () => {
    const { query } = route
    const res = await commonMetasApi({ types: 'gameVendor,currency,gameType' })
    if (res.code == 0) {
        state.currencyList = res.data.currency
        state.gameTypeList = res.data.gameType
        state.gameVendorList = res.data.gameVendor
        state.updateGameForm.gameVendor = state.gameVendorList[0].value
        if (!query.id) {
            state.searchFrom.alias = res.data.gameVendor[0].value
            state.searchFrom.currency = res.data.currency[0].value
            state.searchFrom.type = res.data.gameType[0].value
        } else if (query.id && !state.initData.id) {
            let { alias, currency, type, id } = query
            state.searchFrom = { alias, currency, type, id }
            state.initData = { ...state.searchFrom }
        } else {
            return
        }
        gameListGet()
    }

    getTagListHandle()
})

onActivated(async () => {
    const { query } = route
    let { alias = '', currency = '', type = '', id = '' } = state.initData
    if ((query.id && query.id !== id) || (query.alias && query.alias !== alias) || (query.currency && query.currency !== currency) || (query.type && query.type !== type)) {
        let { alias, currency, type, id } = query
        state.searchFrom = { alias, currency, type, id }
        state.initData = { ...state.searchFrom }
        gameListGet('search')

    }
})

//获取子游戏列表
const gameListGet = (type) => {
    if (type) {
        state.pageConfig._page = 1
        if (type === 'reset') {
            if (route.query.id) {
                const { query } = route
                let { alias, currency, type, id } = query
                state.searchFrom = { alias, currency, type, id }
            } else {
                state.searchFrom = {
                    alias: state.gameVendorList[0].value,
                    currency: state.currencyList[0].value,
                    type: state.gameTypeList[0].value,
                }
            }
        }
    }
    let params = {
        ...state.searchFrom,
        ...state.pageConfig,
    }
    tableRef.value.clearSelection()
    globalVBus.$emit('globalLoading', true)
    getGameList(params).then(({ code, data = {} }) => {
        if (code == 0) {
            data.list.forEach((item) => {
                item.images = item.images?.split(',') || []
                if (item.images.length) {
                    item.image_us = item.images[0] || ''
                    item.image_as = item.images[1] || ''
                    item.image_c = item.images[2] || ''
                }
            })
            state.gameList = data.list || []
            state.total = data.total
        }
        globalVBus.$emit('globalLoading', false)
    }).catch(() => {
        state.gameList = []
        globalVBus.$emit('globalLoading', false)
    })
}

// 获取标签列表
const getTagListHandle = () => { 
    getTagList({
        gameType: state.searchFrom.type
    }).then(res => {
        const { code, data } = res
        if (code === 0) {
            state.tagList = data || []
        } else {
            ElMessage.error('获取标签列表失败')
        }
    })
}

// 表格勾选切换
const handleSelectionChange = (val) => {
    state.tableListSelection = val
    state.selectedNum = val.length
}

//修改
const handleEdit = (value) => {
    let { id, name, status, maintain, image_us, image_as, image_c, maskImage, hot, sort, alias, gameId, type, tagIds } = value
    if (tagIds) {
        tagIds = tagIds.split(',')?.map(item => +item)
    } else {
        tagIds = []
    }
    console.log(tagIds)
    state.editForm = {
        id,
        name,
        status,
        maintain,
        image_us,
        image_as,
        image_c,
        maskImage,
        hot,
        sort,
        alias,
        gameId,
        type,
        tagIds
    }
    state.showEditDialog = true
}

const editGame = async () => {
    state.editForm.images = [state.editForm.image_us, state.editForm.image_as, state.editForm.image_c].join(',')
    state.editForm.tagIds = state.editForm.tagIds ? state.editForm.tagIds.join(',') : ''
    const res = await gameEdit(state.editForm)
    if (res.code == 0) {
        state.showEditDialog = false
        gameListGet()
    }
}

// 切换开关状态
const handleSwitch = (row, key) => {
    globalVBus.$emit('globalLoading', true)
    gameEdit({
        id: row.id,
        [key]: row[key],
    }).then(() => {
        gameListGet()
    }).catch(() => {
        row[key] = row[key] ? 0 : 1
        globalVBus.$emit('globalLoading', false)
    })
}

// 批量操作
const handleBatch = (val) => {
    let { tableListSelection } = state
    if (!tableListSelection.length) {
        return ElMessage.warning('请至少选择一条数据再进行操作！')
    }
    let { alias, type, currency } = state.searchFrom
    state.itemData = {
        alias,
        type,
        currency,
        'ids': tableListSelection.map(item => item.id).join(',')
    }
    if (val < 3) {
        state.itemData.status = val - 1
        state.itemData.items = 'status'
    } else if (val < 5) {
        state.itemData.maintain = val - 3
        state.itemData.items = 'maintain'
    } else {
        state.itemData.items = 'maskImage'
    }
    if (val === 5) {
        state.showEditMaskImage = true
        return
    }
    ElMessageBox.confirm(`确定要进行${operateTypeData.find(item => item.type === val).title}操作吗？`, "删除", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
    }).then(() => {
        globalVBus.$emit('globalLoading', true)
        batchEditGameData(state.itemData).then(res => {
            gameListGet()
        }).catch(err => {
            gameListGet()
        })
    }).catch(() => { })

}

// 标签管理
const handleLabelsManagement = () => {
    showEditTagsDialog.value = true
}

const refreshTags = () => {
    getTagListHandle()
    gameListGet('search')
}
//更新游戏
const handleUpdateGame = () => {
    ElMessageBox({
        title: '更新指定游戏',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton: true,
        dangerouslyUseHTMLString: true,
        message: h(ElForm, { modelValue: state.updateGameForm }, () =>
            h(
                ElFormItem,
                {
                    label: '游戏厂商：',
                },
                () =>
                    h(
                        ElSelect,
                        {
                            modelValue: state.updateGameForm.gameVendor,
                            'onUpdate:modelValue': (value) => {
                                state.updateGameForm.gameVendor = value
                            },
                            placeholder: '请选择游戏厂商:',
                            style: { 'width': '200px' },
                        },
                        () =>
                            state.gameVendorList.map((item) =>
                                h(ElOption, {
                                    value: item.value,
                                    label: item.label,
                                    key: item,
                                }),
                            ),
                    ),
            )
        )
    }).then(() => {
        gameRenew(state.updateGameForm)
    }).catch(() => { })
}
</script>

<style lang="scss">
</style>

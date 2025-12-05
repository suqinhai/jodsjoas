<template>
    <!-- 厂家分成阶梯 -->
    <div class="container">
        <el-form class="filter-form" :model="state.searchForm" inline>
            <el-form-item label="厂家:">
                <el-select class="select-box" v-model="state.searchForm.alias" placeholder="请选择厂家">
                    <el-option v-for="item in state.gameVendorList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="货币:">
                <el-select class="select-box" v-model="state.searchForm.currency" placeholder="请选择货币">
                    <el-option v-for="item in state.currencyList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="游戏类型:">
                <el-select class="select-box" v-model="state.searchForm.type" placeholder="请选择游戏类型">
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
            <el-form-item v-permiss="'admin.vendor.shareEdit'">
                <el-button v-throttle v-if="state.isSave" @click="handleCancel">取 消</el-button>
                <el-button v-throttle type="primary" @click="handleEditOrSave">{{ state.isSave ? "保 存" : "修 改" }}</el-button>
            </el-form-item>
        </el-form>
        <el-table border :data="state.tableData">
            <el-table-column prop="limit" label="分成额度（U）" min-width="140" align="center">
                <template #default="{ row }">
                    <el-input-number v-if="state.isSave" v-model="row.limit" :controls="false" :min="0" :precision="0"
                        placeholder="请输入分成额度" />
                    <span v-else>{{ row.limit }}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="status" label="当前抽成进度" min-width="140" align="center">
                <template #default="{ row }">
                    <span>{{ row.status == "0" ? "未达标" : row.status == "1" ? "已达标" : "进行中" }}</span>
                </template>
            </el-table-column> -->
            <el-table-column align="center">
                <template #header>
                    <span>{{ GAME_TYPE.find((item) => item.value == state.tableFilter).label }}</span>
                </template>
                <el-table-column prop="vbRate" label="变更前(%)" min-width="120" align="center">
                    <template #default="{ row }">
                        {{ row.vbRate }}
                    </template>
                </el-table-column>
                <el-table-column prop="vaRate" label="变更后(%)" min-width="120" align="center">
                    <template #default="{ row }">
                        <el-input-number v-if="state.isSave" v-model="row.vaRate" :controls="false" :min="0" :precision="2"
                            placeholder="请输入变更后比例" />
                        <span v-else>{{ row.vaRate }}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="修改时间" min-width="160" align="center">
                <template #default="{ row }">
                    <span>{{ dateFormat(row.updateTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="生效时间" min-width="160" align="center">
                <template #default="{ row }">
                    <span>{{ dateFormat(row.effectTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="isEffect" label="是否生效" min-width="120" align="center" />
        </el-table>
    </div>
</template>

<script setup name="factoryShareStair">
import { reactive, onMounted } from "vue";
import { vendorDivisionListApi, vendorDivisionEditApi } from '@/api/factory.js'
import { commonMetasApi } from '@/api/common.js'
import { GAME_TYPE } from "@/common/source_map/index";
import { dateFormat } from "@/common/util/index";

const state = reactive({
    tableFilter: '1',
    searchForm: {},
    tableData: [],
    isSave: false,
    currencyList: [], //搜索  货币列表
    gameVendorList: [], //搜索  厂商列表
    gameTypeList: [], //游戏类型
});

onMounted(() => {
    commonMetasApi({ types: 'currency,gameVendor,gameType' }).then(({ code, data }) => {
        if (code == 0) {
            state.gameVendorList = data.gameVendor
            state.gameTypeList = data.gameType
            state.currencyList = data.currency
            state.searchForm = {
                alias: state.gameVendorList[0].value,
                currency: state.currencyList[0].value,
                type: state.gameTypeList[0].value,
            }
            fetchData()
        }
    })
})

const fetchData = (val = '') => {
    if (val === 'reset') {
        state.searchForm = {
            alias: state.gameVendorList[0].value,
            currency: state.currencyList[0].value,
            type: state.gameTypeList[0].value,
        }
    }
    let params = { ...state.searchForm }
    state.tableFilter = params.type
    globalVBus.$emit('globalLoading', true)
    vendorDivisionListApi(params).then(({ code, data = [] }) => {
        if (code === 0) {
            state.tableData = data
        }
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        state.tableData = []
        globalVBus.$emit('globalLoading', false)
    })
}

//点击修改或者保存
const handleEditOrSave = () => {
    if (state.isSave) {
        globalVBus.$emit('globalLoading', true)
        vendorDivisionEditApi({
            ...state.searchForm,
            config: JSON.stringify(state.tableData),
        }).then(() => {
            state.isSave = !state.isSave
            fetchData()
        }).catch(() => {
            globalVBus.$emit('globalLoading', false)
        })
    } else {
        state.isSave = !state.isSave
    }
}

//点击取消
const handleCancel = () => {
    state.isSave = false
    fetchData()
}
</script>

<style lang="scss" scoped>
</style>

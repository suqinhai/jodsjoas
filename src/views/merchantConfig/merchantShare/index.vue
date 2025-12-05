<template>
    <!-- 商户分成 -->
    <div class="container">
        <el-form class="filter-form" :mode="state.searchForm" inline>
            <el-form-item label="商户ID:">
                <el-input v-model="state.searchForm.merchantId" placeholder="请输入商户ID" />
            </el-form-item>
            <el-form-item>
                <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
            </el-form-item>
        </el-form>
        <div class="tips-box">NEW（PG,JILI,PP）打码模式次日生效，损益模式隔月生效</div>
        <el-table class="table-box" :data="state.tableData" border>
            <el-table-column prop="alias_" label="游戏厂家" min-width="120" align="center" />
            <el-table-column prop="typeLabel" label="游戏类型" min-width="120" align="center" />
            <el-table-column prop="moRate" label="平台给商户分成（初始）" min-width="180" align="center" />
            <el-table-column prop="mbRate" label="商户变更前分配比例" min-width="160" align="center" />
            <el-table-column prop="maRate" label="商户变更后分配比例" min-width="160" align="center">
                <template #default="{ row }">
                    <div v-if="!(['PGC','NJL', 'NPP'].includes(row.alias) && row.isRtp)">
                        <div v-if="!row.isEdit">{{ row.maRate }}</div>
                        <el-input v-model="row.modifyRate" v-else></el-input>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="maRtpUpRate" label="rtp＞100抽成(%)" min-width="266" align="center">
                <template #default="{ row }">
                    <div v-if="['PGC','NJL', 'NPP'].includes(row.alias) && row.isRtp">
                        <div v-if="!row.isEdit">{{ row.maRtpUpRate }}</div>
                        <el-input v-model="row.newMaRtpUpRate" v-else :maxlength="8" placeholder="请输入(0.000001-100)范围内的值"></el-input>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="maRtpDnRate" label="rtp＜100抽成(%)" min-width="266" align="center">
                <template #default="{ row }">
                    <div v-if="['PGC','NJL', 'NPP'].includes(row.alias) && row.isRtp">
                        <div v-if="!row.isEdit">{{ row.maRtpDnRate }}</div>
                        <el-input v-model="row.newMaRtpDnRate" v-else :maxlength="8" placeholder="请输入(0.000001-100)范围内的值"></el-input>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="修改时间" min-width="160" align="center">
                <template #default="{ row }">
                    {{dateFormat(row.updateTime)}}
                </template>
            </el-table-column>
            <el-table-column label="生效时间" min-width="160" align="center">
                <template #default="{ row }">
                    {{dateFormat(row.effectTime)}}
                </template>
            </el-table-column>
            <el-table-column prop="isEffect" label="是否生效" min-width="120" align="center" />
            <el-table-column fixed="right" label="操作" align="center" width="220">
                <template #default="{ row }">
                    <el-button text v-throttle type="primary" @click="confirmEdit(row)" v-if="row.isEdit">保存</el-button>
                    <el-button text v-throttle @click="row.isEdit = !row.isEdit" v-if="row.isEdit">取消</el-button>
                    <el-button v-throttle text v-if="!row.isEdit && userData.isHasPermiss('admin.merchant-level-config.merchantShareEdit')"
                        type="primary" @click="changeType(row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup name='merchantShare'>
import { reactive } from 'vue'
import userStore from '@/store/user'
import { ElMessage } from 'element-plus';
import { dateFormat, deepCopy } from "@/common/util/index"
import { merchantLevelConfigMerchantShareListApi, merchantLevelConfigMerchantShareEditApi } from '@/api/dataCenter.js'

const state = reactive({
    searchForm: {},
    tableData: [],
})
const userData = userStore()

const fetchData = () => {
    if (!state.searchForm.merchantId) return ElMessage.warning('请输入商户ID再搜索！')
    globalVBus.$emit('globalLoading', true)
    merchantLevelConfigMerchantShareListApi(state.searchForm).then(({ data = [] }) => {
        state.tableData = data.map(item => {
            item.isEdit = false
            return item
        })
        globalVBus.$emit('globalLoading', false)
    }).catch(err => {
        state.tableData = []
        globalVBus.$emit('globalLoading', false)
    })
}


const changeType = (item) => {
    item.isEdit = !item.isEdit
    item.modifyRate = deepCopy(item.maRate)
    item.newMaRtpUpRate = deepCopy(item.maRtpUpRate)
    item.newMaRtpDnRate = deepCopy(item.maRtpDnRate)
}

const confirmEdit = (item) => {
    if (['NewPG','NewJiLi'].includes(item.alias_) && item.isRtp) {
        if (!(Number(item.newMaRtpUpRate) <= 100 && Number(item.newMaRtpUpRate) >= 0.000001)) return ElMessage.warning('rtp＞100抽成为：(0.000001-100)范围内的值')
        if (!(Number(item.newMaRtpDnRate) <= 100 && Number(item.newMaRtpDnRate) >= 0.000001)) return ElMessage.warning('rtp＜100抽成为：(0.000001-100)范围内的值')
    }
    globalVBus.$emit('globalLoading', true)
    merchantLevelConfigMerchantShareEditApi({
        alias: item.alias,
        currency: item.currency,
        type: item.type,
        maRate: item.modifyRate,
        merchantId: state.searchForm.merchantId,
        maRtpUpRate: item.newMaRtpUpRate,
        maRtpDnRate: item.newMaRtpDnRate
    }).then(res => {
        fetchData()
    }).catch(err => {
        globalVBus.$emit('globalLoading', false)
    })
}
</script>

<style lang="scss">
.merchantShare-page {
}
</style>
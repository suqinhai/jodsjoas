
<template>
    <div class="container merchant-recharge-binding-page" >
        <el-tabs type="border-card">
            <el-tab-pane label="公共商户收款（归集）地址">
                <el-table :data="state.table" border>
                    <el-table-column prop="channel" label="收款通道" min-width="130" align="center" />
                    <el-table-column label="收款地址（归集地址）" min-width="160" align="center">
                        <template #default="{ row }">
                            <el-input v-model="state.toAddr" v-if="isEdit"></el-input>
                            <span v-else>{{ row.toAddr }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="收款失效时间-分钟" min-width="160" align="center">
                        <template #default="{ row }">
                            <el-input-number v-model="state.timeout" :min="1" v-if="isEdit" />
                            <span v-else>{{ row.timeout }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" min-width="160" align="center">
                        <template #default="{ row }">
                            <el-button link v-throttle  @click="handleEdit(row)">{{isEdit?'保存':'修改'}}</el-button>
                            <el-button link v-throttle  @click="isEdit = false" width="80" v-if="isEdit">取消</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="商户归集收款地址" >
                <el-form class="filter-form" :model="state.searchForm" inline>
                    <el-form-item label="商户ID:">
                        <el-input v-model="state.searchForm.merchantId" placeholder="请输入商户ID" />
                    </el-form-item>
                    <el-form-item>
                        <el-button v-throttle type="primary" @click="fetchData('search')">搜 索</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button v-throttle @click="fetchData('reset')">重 置</el-button>
                    </el-form-item>
                </el-form>
                <el-table class="table-box" :data="state.tableData" border>
                    <el-table-column label="商户ID" align="center" min-width="100">
                        <template #default="{ row }">
                            <span class="special pointer" @click="showMerchantDetail(row.merchant.id)">
                                {{ row.merchant?.id || '' }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="商户名称" align="center" min-width="140">
                        <template #default="{ row }">
                            <span class="special pointer" @click="showMerchantDetail(row.merchant.id)">
                                {{ row.merchant?.name || '' }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="channel" label="类型" min-width="130" align="center" />
                    <el-table-column prop="collectAddr" label="归集收款地址" min-width="130" align="center" />
                    <el-table-column prop="remark" label="备注" min-width="130" align="center" />
                    <el-table-column label="操作" min-width="160" align="center">
                        <template #default="{ row }">
                            <el-button link @click="handleEditSingle(row)">修改</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <Pagination v-show="!!state.total" v-model:page="state.pageConfig._page" v-model:size="state.pageConfig._size" :total="state.total"
            @pagination="fetchData"></Pagination>
            </el-tab-pane>
        </el-tabs>
        <EditDialog @close="state.showEditDialog = false" :item="state.currentItem" @refresh="fetchData" v-if="state.showEditDialog"></EditDialog>
    </div>
</template>

<script setup>
    import { ref, reactive, defineAsyncComponent, onMounted } from 'vue'
    import { getMerchantReceiveList, paymentConfigApi, paymentConfigEditApi } from '@/api/financeManage.js'
    const EditDialog = defineAsyncComponent(()=>import('./components/editDialog.vue'))
    const address = ref('')
    const isEdit = ref(false)
    const state = reactive({
        searchForm:{},
        table:[],
        tableData:[],
        total:0,
        pageConfig: {
            _page: 1,
            _size: 10,
        },
        showEditDialog:false,
        currentItem:'',
        toAddr:'',
        timeout:''
    })

    const handleEdit = (item)=> {
        if (!isEdit.value) {
            isEdit.value = true
            state.toAddr = item.toAddr
            state.timeout = item.timeout
        } else {
            let params = {
                channel:item.channel,
                toAddr:state.toAddr,
                timeout:state.timeout
            }
            globalVBus.$emit('globalLoading', true)
            paymentConfigEditApi(params).then(res => {
                globalVBus.$emit('globalLoading', false)
                const { code, data } = res
                if (code === 0) {
                    isEdit.value = false
                    getCommonAddress()
                }
            }).catch(() => {
                globalVBus.$emit('globalLoading', true)
            })
            
        }
        
    }

    const handleEditSingle = (item)=> {
        state.currentItem = item
        state.showEditDialog = true
    }

    const fetchData = (val)=> {
        if (val) {
            state.pageConfig._page = 1
            if (val === 'reset') {
                state.searchForm = {}
            }
        }
        let params = { ...state.pageConfig, ...state.searchForm }
        globalVBus.$emit('globalLoading', true)
        getMerchantReceiveList(params).then(res => {
            globalVBus.$emit('globalLoading', false)
            const { code, data } = res
            if (code === 0) {
                state.tableData = data.list
                state.total = data.total
            }
        }).catch(() => {
            state.tableData = []
            globalVBus.$emit('globalLoading', true)
        })
    }

    // 查看商户详情
    const showMerchantDetail = (id) => {
        globalVBus.$emit('merchantDetailDialog', id)
    }

    const getCommonAddress = ()=> {
        paymentConfigApi().then(res => {
            const { code, data } = res
            if (code === 0) {
                state.table = [data]
            }
        })
    }

    onMounted(()=> {
        fetchData()
        getCommonAddress()
    })
</script>

<style lang="scss">
    .merchant-recharge-binding-page {
        .el-tabs {
            flex:1;
            overflow: hidden;
            .el-tabs__content {
                height:calc(100% - 40px);
                overflow-y: hidden;
                .el-tab-pane {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
            }
        }
    }
</style>
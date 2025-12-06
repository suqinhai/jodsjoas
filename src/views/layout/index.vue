<template>
    <div>
        <Navbar></Navbar>
        <div v-if="userData.menuList.length" class="content-box">
            <Tags></Tags>
            <div class="content" v-loading="loading">
                <router-view v-slot="{ Component }">
                    <transition name="move" mode="out-in">
                        <div :key="route.path" class="page-container">
                            <keep-alive :include="tags.nameList">
                                <component :is="Component"></component>
                            </keep-alive>
                        </div>
                    </transition>
                </router-view>
            </div>
        </div>

        <FactoryEarlyWarning :itemData="state.factoryWarningData" v-if="state.factoryWarningShow" @close="state.factoryWarningShow = false"
            @showNext="showNext">
        </FactoryEarlyWarning>

        <MerchantDetail v-if="commonData.merchantDetailShow"></MerchantDetail>
    </div>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onBeforeMount, onMounted, ref, reactive, defineAsyncComponent, nextTick } from 'vue'
import { findPathInList, findFirstMenuPage } from '@common/util'
import { EXTRA_PAGE_PATH } from '@common/source_map/index.js'
import useTagsStore from '@/store/tags'
import userStore from '@/store/user'
import commonStore from '@/store/common'
import Navbar from './components/Navbar.vue'
import Tags from './components/Tags.vue'
const FactoryEarlyWarning = defineAsyncComponent(() => import('./components/FactoryEarlyWarning.vue'))
const MerchantDetail = defineAsyncComponent(() => import('@/components/MerchantDetail/index.vue'))
const Pagination = defineAsyncComponent(() => import('@/components/Pagination/index.vue'))
const Dialog = defineAsyncComponent(() => import('@/components/Dialog/index.vue'))

const tags = useTagsStore()
const userData = userStore()
const commonData = commonStore()
const loading = ref(false)
const router = useRouter()
const route = useRoute()
const state = reactive({
    factoryWarningShow: false,  // 厂家上分提醒弹窗是否展示
    factoryWarningData: {},  // 当前厂家上分提醒弹窗内容
    factoryWarningList: [],  // 当前厂家上分提醒弹窗列表
    currentWarningIndex: 0,  // 当前厂家上分提醒弹窗索引
})

onBeforeMount(async () => {
    await userData.getMenuList().then(() => {
        if (!findPathInList(userData.menuList, route.path) && !EXTRA_PAGE_PATH.includes(route.path)) {
            let path = findFirstMenuPage(userData.menuList)
            tags.clearTags()
            router.replace(path)
        }tags.setTagsItem({
                name: route.name,
                title: route.meta.title,
                path: route.path,
                fullPath: route.fullPath,
            })
    })
})

onMounted(() => {
    globalVBus.$on('globalLoading', (val) => {
        loading.value = val
    })
    globalVBus.$on('merchantDetailDialog', (val) => {
        commonData.showMerchantDetail(val)
    })
    commonData.getFileType()
    // getFactoryPopupList()
})

// 获取厂家上分提醒弹窗数据
const getFactoryPopupList = async () => {
    try {
        globalVBus.$emit('globalLoading', true)
        let currentDayLatestTime = localStorage.getItem('current_day_latest_time')
        if (currentDayLatestTime && Date.now <= +currentDayLatestTime) return
        if (currentDayLatestTime && Date.now > +currentDayLatestTime) localStorage.removeItem('current_day_latest_time')
        let res = await getRemindMassageList()
        globalVBus.$emit('globalLoading', false)
        let { data } = res
        if (!data || !data.length) {
            state.factoryWarningList = []
        } else {
            state.factoryWarningList = data
            state.currentWarningIndex = 0
            openFactoryPopup()
        }
    } catch (err) { }
}

// 打开厂家上分提醒弹窗
const openFactoryPopup = () => {
    let latestTime = localStorage.getItem('current_day_latest_time')
    if (!state.factoryWarningList[state.currentWarningIndex] || Date.now() <= +latestTime) return
    state.remindData = { ...state.factoryWarningList[state.currentWarningIndex] }
    state.factoryWarningShow = true
}

// 打开下一个弹窗
const showNext = () => {
    nextTick(() => {
        state.currentWarningIndex++
        openFactoryPopup()
    })
}
</script>

<style lang="scss">
.content-box {
    .content {
        width: auto;
        height: calc(100% - 30px);
        box-sizing: border-box;
        background-color: var(--app-main-bg, #fff);
        border-radius: 6px;
        padding: 20px 20px 30px;
        overflow: auto;
        border: 20px solid var(--app-content-bg, #f0f0f0);
        transition: background-color 0.3s ease, border-color 0.3s ease;
        .page-container {
            width: 100%;
            height: 100%;
            min-width: 1080px;
        }
    }
}
</style>

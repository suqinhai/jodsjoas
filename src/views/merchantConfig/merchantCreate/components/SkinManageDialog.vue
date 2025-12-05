<template>
    <!--商户配置-商户创建-皮肤管理配置-->
    <Dialog title="皮肤管理配置" top="5vh" ref="editFormRef" @cancel="cancel" @confirm="handleConfirm" width="850">
        <el-tabs v-model="state.type">
            <el-tab-pane v-for="(item,index) in showTabList" :key="index" :label="item.label" :name="+item.value">
            </el-tab-pane>
        </el-tabs>
        <div class="skin-main">
            <el-checkbox :disabled="isDisabledAll" v-model="showData.checkAll" :indeterminate="showData.indeterminate" @change="handleCheckAllChange">
                <span style="font-weight: bold;">全选</span>
            </el-checkbox>
            <el-checkbox-group v-model="showData.colors" @change="handleCheckedColorChange">
                <div v-for="(item,index) in showData.dataList" style="display: inline-block;width: 25%;margin-bottom: 10px;" :key="index">
                    <el-checkbox :value="item.value" :label="item.value" :disabled="isDisabled(showData.type,item.value)">
                        {{item.title}}
                    </el-checkbox>
                    <br>
                    <el-button size="small" v-throttle @click="browseImg(item)">浏览</el-button>
                </div>
            </el-checkbox-group>
        </div>
        <div v-if="state.dialogVisible && state.dialogImageUrl" class="preview" @click="state.dialogVisible = false">
            <div class="preview-box">
                <img class="preview-img" :src="state.dialogImageUrl" alt="">
            </div>
        </div>
    </Dialog>
</template>

<script setup>
import { reactive, onMounted, computed } from 'vue'
import { TEMPLATE_STYLE_DATA } from "@/common/source_map/index.js"
import { deepCopy } from '@/common/util'
import { useRoute } from 'vue-router'
const route = useRoute()

const emits = defineEmits(["setData", "close"])
const props = defineProps({
    skins: {
        type: Array,
        default: () => {
            return []
        }
    },
    disabledSkins: {
        type: Array,
        default: () => {
            return []
        }
    },
    templateType: {
        type: Array,
        default: () => {
            return []
        }
    },
    countryCode: {
        type: String,
        default: ''
    },
})
const state = reactive({
    type: 1,
    dialogVisible: false,
    skinData: [],
})

const showData = computed(() => {
    return state.skinData.find(item => item.type === state.type) || {}
})
// const showTabList = computed(() => {
//     return props.countryCode === 'PH' ? props.templateType : props.templateType.filter(item => +item.value !== 4)
// })
const showTabList = computed(() => {
    let filteredTemplateType = [...props.templateType];
    if (route.query.id) {
        const hasType4 = state.skinData.some(item => item.type === 4);
        if (!hasType4) {
            filteredTemplateType = filteredTemplateType.filter(item => +item.value !== 4);
        }
    } else {
        filteredTemplateType =  props.templateType;
    }
    if (props.countryCode === 'AR' || props.countryCode === 'CO' || props.countryCode === 'UZ') {
        filteredTemplateType = filteredTemplateType.filter(item => +item.value !== 4 && +item.value !== 5)
    }
    return filteredTemplateType;
})
const isDisabledAll = computed(() => {
    let obj = props.disabledSkins.find(item => item.type === state.type)
    return !!obj && !!obj.colors.length
})

onMounted(() => {
    state.skinData = deepCopy(props.skins)
    showTabList.value.forEach(item => {
        if (props.skins.every(its => its.type !== +item.value)) state.skinData.push({ type: +item.value, colors: [] })
    })
    // if (props.countryCode !== 'PH') {
    //     state.skinData = state.skinData.filter(item => item.type !== 4)
    // }
    let count = 0
    state.skinData.forEach(item => {
        item.dataList = TEMPLATE_STYLE_DATA[item.type]
        count = item.colors.length
        item.checkAll = count === item.dataList.length
        item.indeterminate = count > 0 && count < item.dataList.length
    })
})

const isDisabled = (type, value) => {
    let obj = props.disabledSkins.find(item => item.type === type)
    return obj && obj.colors && (obj.colors.includes(value) || obj.colors[0] === 0)
}

const handleCheckedColorChange = () => {
    const checkedCount = showData.value.colors.length
    showData.value.checkAll = checkedCount === showData.value.dataList.length
    showData.value.indeterminate = checkedCount > 0 && checkedCount < showData.value.dataList.length
}

const handleCheckAllChange = (val) => {
    if (val) {
        showData.value.colors = showData.value.dataList.map(it => it.value)
        showData.value.checkAll = true
    } else {
        showData.value.colors = []
    }
    showData.value.indeterminate = false
}

const handleConfirm = () => {
    let arr = deepCopy(state.skinData)
    arr.forEach(item => {
        delete item.dataList
        delete item.indeterminate
        delete item.checkAll
    })
    emits('setData', arr)
    emits('close')
}

const browseImg = (item) => {
    state.dialogImageUrl = new URL(`../../../../assets/img/template/${item.image}.png`, import.meta.url).href
    state.dialogVisible = true
}
const cancel = () => {
    emits('close')
}
</script>

<style lang="scss">
.skin-main {
    max-height: 65vh;
    overflow-y: auto;
}
</style>

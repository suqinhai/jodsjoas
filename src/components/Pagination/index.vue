<!--
 * @Author: liqijiang 3045273238@qq.com
 * @Date: 2023-10-27 15:24:06
 * @LastEditors: liqijiang 3045273238@qq.com
 * @LastEditTime: 2023-10-27 17:45:41
 * @FilePath: \management-bg\src\components\pagination\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="pagination-wrapper">
        <div class="check-box">
            <div v-if="isShowChecked" class="selected-count">已选择{{ selectedNum }}条数据</div>
        </div>
        <el-pagination background :page-sizes="pageSizes" :layout="props.layout" v-model:current-page="getPage" v-model:page-size="getSize"
            :total="props.total" @current-change="handlePageChange" @size-change="handleSizeChange">
        </el-pagination>
    </div>
</template>

<script setup>
import { useIndexHook } from "./index.js";
const emits = defineEmits(["update:page", "update:size", "pagination"]);
const props = defineProps({
    //分页尺寸配置
    pageSizes: {
        type: Array,
        default: () => [10, 20, 50, 100, 200],
    },
    //分页功能配置
    layout: {
        type: String,
        default: () => 'total, prev, pager, next, sizes, jumper',
    },
    //页数
    page: {
        type: Number,
        default: () => 1,
    },
    //分页尺寸
    size: {
        type: Number,
        default: () => 10,
    },
    //总条数
    total: {
        type: Number,
        default: () => 10,
    },
    // 是否展示勾选数量
    isShowChecked: {
        type: Boolean,
        default: false,
    },
    // 勾选数量
    selectedNum: {
        type: Number,
        default: 0,
    },
});
const { getPage, getSize, handlePageChange, handleSizeChange } = useIndexHook(
    props,
    emits
);
</script>

<style lang="scss" scoped>
.pagination-wrapper {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;

    ::v-deep(.el-pagination__sizes) {
        margin-left: 10px;
        margin-right: -6px;
    }

    .check-box {
        display: flex;

        .selected-count {
            width: fit-content;
            flex-shrink: 1;
            padding: 0 20px;
            color: var(--el-text-color-regular, #606266);
            line-height: 39px;
        }
    }
}
</style>

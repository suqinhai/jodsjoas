
<template>
    <div class="operateBtn">
        <el-button v-throttle color="#444c69ff" :icon="Refresh" />
        <el-button v-throttle color="#18bc9cff" :icon="Plus">添加</el-button>
        <el-button v-throttle color="#6fd4bfff" :icon="Edit">编辑</el-button>
        <el-button v-throttle color="#fa8f87ff" :icon="Delete">删除</el-button>
        <el-button v-throttle color="#858b9eff" :icon="More">更多</el-button>
        <el-button v-throttle color="#f75444ff" :icon="View">显示全部</el-button>
    </div>
</template>

<script setup>
import { Refresh, Plus, Edit, Delete, More, View } from '@element-plus/icons-vue'
import { useIndexHook } from './index';
const { } = useIndexHook();
</script>

<style scoped>
.el-button {
    color: #fff;
    margin-bottom: 20px;
}
</style>
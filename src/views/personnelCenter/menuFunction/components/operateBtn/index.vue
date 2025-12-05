<!--
 * @Author: liqijiang 3045273238@qq.com
 * @Date: 2023-09-20 20:14:45
 * @LastEditors: liqijiang 3045273238@qq.com
 * @LastEditTime: 2023-09-21 09:54:19
 * @FilePath: \management-bg\src\views\manageConfig\menuFunction\components\operateBtn\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
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
<template>
    <!-- 经销商投诉 -->
    <div class="container dealer-complaint">
        <el-tabs v-model="type">
            <el-tab-pane v-for="(item,index) in tabData" :key="index" :label="item.title" :name="item.id">
            </el-tab-pane>
        </el-tabs>
        <TableComponent :type="type"></TableComponent>
    </div>
</template>

<script setup name="dealerComplaint">
import { ref } from 'vue'
import TableComponent from './components/TableComponent.vue'

const tabData = [
    { id: 0, title: '待处理' },
    { id: 1, title: '已采纳' },
    { id: 2, title: '已忽略' },
    { id: '', title: '全部反馈' },
]
const type = ref(0)
</script>

<style lang="scss">
</style>

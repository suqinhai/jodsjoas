<!--
 * @Date: 2023-08-25 16:33:49
 * @LastEditors: Sai
 * @LastEditTime: 2023-09-11 15:38:12
-->
<template>
    <el-config-provider :locale="zhCn">
        <router-view />
    </el-config-provider>
</template>

<script setup>
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
</script>
<style>
</style>

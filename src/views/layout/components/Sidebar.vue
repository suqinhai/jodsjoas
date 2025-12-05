<!--
 * @Date: 2023-08-25 16:33:49
 * @LastEditors: yilaisai
 * @LastEditTime: 2023-12-16 18:34:01
-->
<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="sidebar.collapse" background-color="#324157" text-color="#bfcbd9"
            active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in userData.menuList">
                <template v-if="item.children">
                    <el-sub-menu :index="item.path" :key="item.path">
                        <template #title>
                            <!-- <el-icon>
                                <component :is="item.icon"></component>
                            </el-icon> -->
                            <svg-icon :iconClass="item.icon" class="menu-icon el-icon"></svg-icon>
                            <span>{{ item.name }}</span>
                        </template>
                        <template v-for="subItem in item.children">
                            <el-sub-menu v-if="subItem.children" :index="subItem.path" :key="subItem.path">
                                <template #title>{{ subItem.name }}</template>
                                <el-menu-item v-for="(threeItem, i) in subItem.children" :key="i" :index="threeItem.path">
                                    {{ threeItem.name }}
                                </el-menu-item>
                            </el-sub-menu>
                            <el-menu-item v-else :index="subItem.path">
                                {{ subItem.name }}
                            </el-menu-item>
                        </template>
                    </el-sub-menu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.path" :key="item.path">
                        <!-- <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon> -->
                        <span class="el-icon menu-box">
                            <svg-icon :iconClass="item.icon" class="menu-icon"></svg-icon>
                        </span>
                        <template #title>{{ item.name }}</template>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script setup>
import { computed } from "vue";
import useSidebarStore from "@/store/sidebar";
import userStore from "@/store/user";
import { useRoute } from "vue-router";

const sidebar = useSidebarStore();
const userData = userStore()

const route = useRoute();
const onRoutes = computed(() => {
    return route.path;
});


</script>

<style scoped  lang="scss">
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
    background-color: #324157;
    .menu-box {
        display: inline-flex;
        width: 15px !important;
    }
    .menu-icon {
        font-size: 15px;
        margin-top: -2px;
    }
}

.sidebar::-webkit-scrollbar {
    width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
    width: 200px;
}

.sidebar > ul {
    height: 100%;
}
::v-deep .el-menu--collapse .el-menu .el-submenu,
.el-menu--popup {
    min-width: 120px !important;
}
</style>

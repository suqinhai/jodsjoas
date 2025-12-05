
<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="sidebar.collapse"
            :background-color="menuBgColor"
            :text-color="menuTextColor"
            :active-text-color="menuActiveColor"
            unique-opened router>
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
import { useThemeStore } from '@/store/theme'

const themeStore = useThemeStore()
const sidebar = useSidebarStore();
const userData = userStore()

const route = useRoute();
const onRoutes = computed(() => {
    return route.path;
});

// 菜单颜色 - 根据主题动态变化
const menuBgColor = computed(() => themeStore.appliedTheme === 'dark' ? '#1a1a1b' : '#324157')
const menuTextColor = computed(() => themeStore.appliedTheme === 'dark' ? '#a3a6ad' : '#bfcbd9')
const menuActiveColor = computed(() => themeStore.appliedTheme === 'dark' ? '#66b1ff' : '#409eff')

</script>

<style scoped  lang="scss">
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
    background-color: var(--app-header-bg, #324157);
    transition: background-color 0.3s ease;
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

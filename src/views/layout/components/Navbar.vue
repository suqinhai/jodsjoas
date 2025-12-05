<template>
    <div class="header">
        <div class="header-left">
            <div class="logo">总台管理系统</div>
            <!-- 顶部菜单 -->
            <div class="header-menu" v-if="userData.menuList.length">
                <el-menu
                    class="header-el-menu"
                    :default-active="onRoutes"
                    mode="horizontal"
                    :background-color="menuBgColor"
                    :text-color="menuTextColor"
                    :active-text-color="menuActiveColor"
                    router
                    :ellipsis="false"
                >
                    <template v-for="item in userData.menuList">
                        <template v-if="item.children">
                            <el-sub-menu :index="item.path" :key="item.path" :popper-offset="0">
                                <template #title>
                                    <svg-icon :iconClass="item.icon" class="menu-icon"></svg-icon>
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
                                <svg-icon :iconClass="item.icon" class="menu-icon"></svg-icon>
                                <span>{{ item.name }}</span>
                            </el-menu-item>
                        </template>
                    </template>
                </el-menu>
            </div>
        </div>

        <div class="header-right">
            <div class="header-right-country" v-if="isShow">
                <el-select v-model="country" @change="changeCountry">
                    <el-option v-for="item in countryList" :value="item.value" :label="item.label" :key="item.value"></el-option>
                </el-select>
            </div>
            <div class="header-user-con">
                <!-- 用户头像 -->
                <el-avatar class="user-avator" :size="30" :src="imgurl" />
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{ userData.userInfo.username }}
                        <el-icon class="el-icon--right">
                            <arrow-down />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="editPassword">修改密码</el-dropdown-item>
                            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>

        <EditPassword v-if="editPasswordShow" @close="editPasswordShow = false" @handleLogout="handleLogout"></EditPassword>
    </div>
</template>
<script setup>
import { ref, onMounted, defineAsyncComponent, watch, computed } from "vue";
import { useRouter, useRoute } from 'vue-router'
import { commonMetasApi } from '@/api/common.js'
import userStore from '@/store/user'
import tagsStore from '@/store/tags'
import commonStore from '@/store/common'
import { useThemeStore } from '@/store/theme'
import imgurl from "@/assets/img/img.jpg"
import { ElMessageBox } from 'element-plus'
import { NO_CURRENCY_SELECT_PATH } from "@/common/source_map"
const EditPassword = defineAsyncComponent(() => import('./EditPassword.vue'))

const themeStore = useThemeStore()
const commonData = commonStore()
const router = useRouter()
const route = useRoute()
const userData = userStore()
const editPasswordShow = ref(null)
const countryList = ref()
const country = ref()

// 当前激活的路由
const onRoutes = computed(() => {
    return route.path;
});

// 菜单颜色 - 根据主题动态变化
const menuBgColor = computed(() => themeStore.appliedTheme === 'dark' ? '#1a1a1b' : '#324157')
const menuTextColor = computed(() => themeStore.appliedTheme === 'dark' ? '#a3a6ad' : '#bfcbd9')
const menuActiveColor = computed(() => themeStore.appliedTheme === 'dark' ? '#66b1ff' : '#409eff')

watch(country, (newVal) => {
    localStorage.setItem('country', newVal)
    commonStore.country = newVal
})

const isShow = computed(() => !NO_CURRENCY_SELECT_PATH.includes(route.path))

onMounted(async () => {
    country.value = commonData.country
    const res = await commonMetasApi({ types: 'country' })
    if (res.status === 'OK') {
        res.data.country.forEach(item => item.label = item.label.split('/')[0])
        countryList.value = res.data.country
        countryList.value.unshift({
            label: '全部',
            value: '0'
        })
    }
});

// 登出
const handleLogout = () => {
    userStore().logout().then(() => {
        tagsStore().clearTags()
        router.replace('/login');
    })
};

// 用户名下拉菜单选择事件
const handleCommand = (command) => {
    if (command == 'loginout') {
        ElMessageBox.confirm('确定退出登录状态吗？', '提示', {
            type: 'warning'
        }).then(() => {
            userData.logout().then(() => {
                tagsStore().clearTags()
                router.replace('/login');
            })
        }).catch(() => { })
    } else if (command == 'editPassword') {
        editPasswordShow.value = true
    }
};

const changeCountry = () => {
    location.reload()
}
</script>
<style scoped lang="scss">
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: var(--app-header-text, #fff);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--app-header-bg, #324157);
    transition: background-color 0.3s ease, color 0.3s ease;
}

.header-left {
    display: flex;
    align-items: center;
    height: 100%;
    flex: 1;
    overflow: hidden;
}

.header .logo {
    padding: 0 20px;
    line-height: 70px;
    white-space: nowrap;
    font-weight: 500;
}

.header-menu {
    flex: 1;
    height: 100%;
    overflow: hidden;

    .header-el-menu {
        height: 100%;
        border-bottom: none;

        .menu-icon {
            font-size: 16px;
            margin-right: 5px;
        }

        :deep(.el-menu-item),
        :deep(.el-sub-menu__title) {
            height: 70px;
            line-height: 70px;
            border-bottom: none !important;
            transition: background-color 0.2s ease;
        }

        :deep(.el-menu-item:hover),
        :deep(.el-sub-menu__title:hover) {
            background-color: var(--app-header-menu-hover-bg, rgba(255, 255, 255, 0.05)) !important;
        }

        :deep(.el-sub-menu.is-active > .el-sub-menu__title) {
            border-bottom: none !important;
        }
    }
}

.header-right {
    display: flex;
    align-items: center;
    padding-right: 30px;
    gap: 15px;
}

.header-right-country {
    width: 120px;

    :deep(.el-input__wrapper) {
        background-color: rgba(255, 255, 255, 0.1);
        box-shadow: none;

        &:hover {
            background-color: rgba(255, 255, 255, 0.15);
        }
    }

    :deep(.el-input__inner) {
        color: var(--app-header-text, #fff);
    }

    :deep(.el-select__caret) {
        color: var(--app-header-text, #fff);
    }
}

.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}

.user-name {
    margin-left: 10px;
}

.user-avator {
    margin-left: 20px;
}

.el-dropdown-link {
    color: var(--app-header-text, #fff);
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.8;
    }
}

.el-dropdown-menu__item {
    text-align: center;
}
</style>

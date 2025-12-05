<template>
    <el-dropdown trigger="click" @command="handleThemeChange">
        <div class="theme-switch">
            <div class="theme-switch__current" :style="currentThemeStyle">
                <svg v-if="!themeStore.isDark" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M10 7a7 7 0 0 0 12 4.9v.1c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2h.1A6.979 6.979 0 0 0 10 7zm-6 5a8 8 0 0 0 15.062 3.762A9 9 0 0 1 8.238 4.938 7.999 7.999 0 0 0 4 12z"/>
                </svg>
            </div>
        </div>
        <template #dropdown>
            <el-dropdown-menu class="theme-dropdown">
                <el-dropdown-item
                    v-for="item in themes"
                    :key="item.key"
                    :command="item.key"
                    :class="{ 'is-active': themeStore.theme === item.key }"
                >
                    <span class="theme-item">
                        <span class="theme-item__color" :style="getThemeColorStyle(item.key)"></span>
                        <span class="theme-item__label">{{ item.label }}</span>
                        <el-icon v-if="themeStore.theme === item.key" class="theme-item__check">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                            </svg>
                        </el-icon>
                    </span>
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script setup name="ThemeSwitch">
import { computed } from 'vue'
import { useThemeStore, THEMES } from '@/store/theme'

const themeStore = useThemeStore()

const themes = THEMES

// 主题颜色映射
const themeColors = {
    'light': '#409eff',
    'dark': '#8c949b',
    'dark-blue': '#409eff',
    'dark-green': '#52c41a',
    'dark-purple': '#722ed1',
    'dark-orange': '#fa8c16',
    'system': '#909399'
}

const currentThemeStyle = computed(() => {
    const color = themeColors[themeStore.appliedTheme] || themeColors['light']
    return {
        color: themeStore.isDark ? '#e5eaf3' : '#606266'
    }
})

const getThemeColorStyle = (themeKey) => {
    return {
        backgroundColor: themeColors[themeKey] || '#409eff'
    }
}

const handleThemeChange = (theme) => {
    themeStore.setTheme(theme)
}
</script>

<style scoped lang="scss">
.theme-switch {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
}

.theme-switch__current {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #bfcbd9;
}

.theme-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 2px 0;
}

.theme-item__color {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    flex-shrink: 0;
}

.theme-item__label {
    flex: 1;
}

.theme-item__check {
    color: var(--el-color-primary);
    margin-left: auto;
}
</style>

<style lang="scss">
.theme-dropdown {
    min-width: 140px;

    .el-dropdown-menu__item {
        padding: 8px 16px;

        &.is-active {
            background-color: var(--el-color-primary-light-9);
            color: var(--el-color-primary);
        }
    }
}
</style>

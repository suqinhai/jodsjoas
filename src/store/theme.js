import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const THEME_KEY = 'app-theme'

// 可用的主题列表
export const THEMES = [
    { key: 'light', label: '亮色', icon: 'sun' },
    { key: 'dark', label: '暗黑', icon: 'moon' },
    { key: 'dark-blue', label: '深蓝', icon: 'moon', isDark: true },
    { key: 'dark-green', label: '暗绿', icon: 'moon', isDark: true },
    { key: 'dark-purple', label: '暗紫', icon: 'moon', isDark: true },
    { key: 'dark-orange', label: '暗橙', icon: 'moon', isDark: true },
    { key: 'system', label: '跟随系统', icon: 'system' }
]

// 暗色主题列表
const DARK_THEMES = ['dark', 'dark-blue', 'dark-green', 'dark-purple', 'dark-orange']

export const useThemeStore = defineStore('theme', () => {
    // 主题类型
    const theme = ref(localStorage.getItem(THEME_KEY) || 'light')

    // 实际应用的主题
    const appliedTheme = ref('light')

    // 获取系统主题偏好
    const getSystemTheme = () => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark'
        }
        return 'light'
    }

    // 判断是否为暗色主题
    const isDark = computed(() => DARK_THEMES.includes(appliedTheme.value))

    // 应用主题到 HTML 元素
    const applyTheme = (newTheme) => {
        const html = document.documentElement

        // 添加过渡类
        html.classList.add('theme-transition')

        // 计算实际主题
        const actualTheme = newTheme === 'system' ? getSystemTheme() : newTheme
        appliedTheme.value = actualTheme

        // 设置 data-theme 属性
        html.setAttribute('data-theme', actualTheme)

        // 设置 color-scheme
        if (DARK_THEMES.includes(actualTheme)) {
            html.style.colorScheme = 'dark'
        } else {
            html.style.colorScheme = 'light'
        }

        // 移除过渡类
        setTimeout(() => {
            html.classList.remove('theme-transition')
        }, 300)
    }

    // 设置主题
    const setTheme = (newTheme) => {
        theme.value = newTheme
        localStorage.setItem(THEME_KEY, newTheme)
        applyTheme(newTheme)
    }

    // 切换主题 (在 light 和 dark 之间切换)
    const toggleTheme = () => {
        const newTheme = isDark.value ? 'light' : 'dark'
        setTheme(newTheme)
    }

    // 循环切换所有主题
    const cycleTheme = () => {
        const themeKeys = THEMES.filter(t => t.key !== 'system').map(t => t.key)
        const currentIndex = themeKeys.indexOf(appliedTheme.value)
        const nextIndex = (currentIndex + 1) % themeKeys.length
        setTheme(themeKeys[nextIndex])
    }

    // 获取当前主题信息
    const currentThemeInfo = computed(() => {
        return THEMES.find(t => t.key === theme.value) || THEMES[0]
    })

    // 初始化主题
    const initTheme = () => {
        applyTheme(theme.value)

        // 监听系统主题变化
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (theme.value === 'system') {
                    applyTheme('system')
                }
            })
        }
    }

    return {
        theme,
        appliedTheme,
        isDark,
        setTheme,
        toggleTheme,
        cycleTheme,
        initTheme,
        getSystemTheme,
        currentThemeInfo,
        THEMES
    }
})

export default useThemeStore

/*
 * @Date: 2023-08-25 16:33:49
 * @LastEditors: Sai
 * @LastEditTime: 2023-09-11 15:38:00
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import userStore from './store/user'
import { useThemeStore } from './store/theme'
import VBus from '@/common/util/v_bus'
import '@/assets/svg/index.vue'
import 'virtual:svg-icons-register'
import initSvgIcon from '@/assets/svg/index.js'
import 'element-plus/dist/index.css'
import './common/style/theme/index.scss'
import './common/style/index.scss'

window.globalVBus = VBus

const app = createApp(App)
app.use(createPinia()).use(router).use(initSvgIcon)

// 初始化主题
const themeStore = useThemeStore()
themeStore.initTheme()

// 注册elementplus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.directive('throttle', {
    mounted(el, binding) {
        let timer
        el.addEventListener('click', () => {
            if (!timer) {
                el['disabled'] = true
                // 设置计时器，等待指定时间后再次触发
                timer = setTimeout(() => {
                    el['disabled'] = false
                    clearTimeout(timer)
                    timer = null
                }, binding.value || 1000)
            }
        })
    },
})

// 自定义权限指令
const userData = userStore()
app.directive('permiss', {
    mounted(el, binding) {
        if (binding.value && !userData.funPermissList.includes(binding.value)) {
            el['hidden'] = true
        }
    },
})

// 添加全局滚轮事件监听器
window.addEventListener(
    'wheel',
    (event) => {
        const target = event.target
        if (target.tagName === 'INPUT') {
            event.preventDefault()
        }
    },
    { passive: false },
)

app.mount('#app')

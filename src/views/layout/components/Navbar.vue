<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <el-icon v-if="sidebar.collapse">
                <Expand />
            </el-icon>
            <el-icon v-else>
                <Fold />
            </el-icon>
        </div>
        <div class="logo">总台管理系统</div>

        <div class="header-right">
            <div class="header-right-country" v-if="isShow">
                <el-select v-model="country" @change="changeCountry">
                    <el-option v-for="item in countryList" :value="item.value" :label="item.label" :key="item.value"></el-option>
                </el-select>
            </div>
            <div class="header-user-con">
                <!-- 消息中心 -->
                <!-- <div class="btn-bell" @click="router.push('/tabs')">
          <el-tooltip
            effect="dark"
            :content="message ? `有${message}条未读消息` : `消息中心`"
            placement="bottom"
          >
            <i class="el-icon-lx-notice"></i>
          </el-tooltip>
          <span class="btn-bell-badge" v-if="message"></span>
        </div> -->
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
                            <!-- <el-dropdown-item command="loginout">退出登录</el-dropdown-item> -->
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
import useSidebarStore from "@/store/sidebar"
import userStore from '@/store/user'
import tagsStore from '@/store/tags'
import commonStore from '@/store/common'
import imgurl from "@/assets/img/img.jpg"
import { ElMessageBox } from 'element-plus'
import { NO_CURRENCY_SELECT_PATH } from "@/common/source_map"
const EditPassword = defineAsyncComponent(() => import('./EditPassword.vue'))

const commonData = commonStore()
const message = 2
const router = useRouter()
const route = useRoute()
const sidebar = useSidebarStore();
const userData = userStore()
const editPasswordShow = ref(null)
const countryList = ref()
const country = ref()

// 侧边栏折叠
const collapseChage = () => {
    sidebar.handleCollapse()
}

watch(country, (newVal) => {
    localStorage.setItem('country', newVal)
    commonStore.country = newVal
})

const isShow = computed(() => !NO_CURRENCY_SELECT_PATH.includes(route.path))

onMounted(async () => {
    if (document.body.clientWidth < 1500) {
        collapseChage();
    }
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
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
}
.collapse-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    float: left;
    padding: 0 21px;
    cursor: pointer;
}
.header .logo {
    float: left;
    width: 250px;
    line-height: 70px;
}
.header-right {
    float: right;
    padding-right: 50px;
    display: flex;
    align-items: center;
}
.header-right-country {
    width: 120px;
}

.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
}
.btn-bell-badge {
    position: absolute;
    right: 4px;
    top: 0px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}
.btn-bell .el-icon-lx-notice {
    color: #fff;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
}
.el-dropdown-menu__item {
    text-align: center;
}
</style>

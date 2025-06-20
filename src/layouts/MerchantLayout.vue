<template>
  <div class="merchant-layout">
    <!-- 顶部导航栏 -->
    <el-header class="merchant-header">
      <div class="header-left">
        <div class="logo">
          <ship theme="outline" size="32" fill="#1890ff" />
          <span class="logo-text">绿色智能船艇</span>
          <el-tag type="warning" size="small" class="role-tag">商家</el-tag>
        </div>
      </div>

      <div class="header-right">
        <el-dropdown @command="handleCommand">
          <span class="user-info">
            <el-avatar :size="32" :src="userInfo?.avatar || undefined" :icon="User" />
            <span class="username">{{ userInfo?.username || '商家' }}</span>
            <el-icon class="dropdown-arrow"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人中心</el-dropdown-item>
              <el-dropdown-item command="home">返回首页</el-dropdown-item>
              <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <!-- 主体内容区域 -->
    <el-container class="merchant-container">
      <!-- 侧边导航栏 -->
      <el-aside class="merchant-aside" width="250px">
        <el-menu :default-active="activeMenu" class="merchant-menu" router>
          <el-menu-item index="/merchant/dashboard">
            <el-icon><data-analysis /></el-icon>
            <span>经营概况</span>
          </el-menu-item>

          <el-sub-menu index="boats">
            <template #title>
              <el-icon><ship /></el-icon>
              <span>船艇管理</span>
            </template>
            <el-menu-item index="/merchant/boats">我的船艇</el-menu-item>
            <el-menu-item index="/merchant/boats/add">添加船艇</el-menu-item>
            <el-menu-item index="/merchant/crew">船员审核</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="goods">
            <template #title>
              <el-icon><Commodity /></el-icon>
              <span>商品管理</span>
            </template>
            <el-menu-item index="/merchant/goods">商品列表</el-menu-item>
            <el-menu-item index="/merchant/goods/add">添加商品</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="bookings">
            <template #title>
              <el-icon><calendar /></el-icon>
              <span>预约管理</span>
            </template>
            <el-menu-item index="/merchant/bookings">预约列表</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="orders">
            <template #title>
              <el-icon><list /></el-icon>
              <span>订单管理</span>
            </template>
            <el-menu-item index="/merchant/orders">订单列表</el-menu-item>
          </el-sub-menu>

          <el-menu-item index="/merchant/routes">
            <el-icon><map-road /></el-icon>
            <span>航线管理</span>
          </el-menu-item>

          <el-menu-item index="/merchant/finance">
            <el-icon><money /></el-icon>
            <span>财务管理</span>
          </el-menu-item>

          <el-menu-item index="/merchant/settings">
            <el-icon><setting /></el-icon>
            <span>店铺设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主要内容区域 -->
      <el-main class="merchant-main">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  UserFilled,
  ArrowDown,
  Setting,
  DataAnalysis,
  List,
  Calendar,
} from '@element-plus/icons-vue'
import { Ship, MapRoad, User, Commodity } from '@icon-park/vue-next'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// 计算属性
const userInfo = computed(() => authStore.user)
const activeMenu = computed(() => route.path)

// 处理下拉菜单命令
const handleCommand = async (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/user/profile')
      break
    case 'home':
      router.push('/')
      break
    case 'logout':
      try {
        await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        authStore.logout()
        ElMessage.success('已退出登录')
        router.push('/')
      } catch {
        // 用户取消操作
      }
      break
  }
}
</script>

<style scoped>
.merchant-layout {
  min-height: 100vh;
  background: #f0f2f5;
}

.merchant-header {
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
  color: #1890ff;
  gap: 8px;
}

.logo-text {
  margin-left: 8px;
}

.role-tag {
  margin-left: 12px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background: #f5f5f5;
}

.username {
  margin-left: 8px;
  margin-right: 4px;
  color: #333;
}

.dropdown-arrow {
  font-size: 12px;
  color: #999;
}

.merchant-container {
  height: calc(100vh - 60px);
}

.merchant-aside {
  background: #fff;
  border-right: 1px solid #e8e8e8;
}

.merchant-menu {
  height: 100%;
  border-right: none;
}

.merchant-menu .el-menu-item {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}

.merchant-menu .el-menu-item:hover {
  background: #fff7e6;
  color: #fa8c16;
}

.merchant-menu .el-menu-item.is-active {
  background: #fff7e6;
  color: #fa8c16;
  border-right: 2px solid #fa8c16;
}

.merchant-menu .el-sub-menu__title:hover {
  background: #f5f5f5;
  color: #fa8c16;
}

.merchant-main {
  padding: 24px;
  background: #f0f2f5;
}
</style>

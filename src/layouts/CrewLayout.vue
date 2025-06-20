<template>
  <div class="crew-layout">
    <!-- 顶部导航栏 -->
    <el-header class="crew-header">
      <div class="header-left">
        <div class="logo">
          <ship theme="outline" size="32" fill="#1890ff" />
          <span class="logo-text">绿色智能船艇</span>
          <el-tag type="success" size="small" class="role-tag">船员</el-tag>
        </div>
      </div>

      <div class="header-right">
        <el-button type="primary" size="small" @click="goToFrontend" class="frontend-btn">
          <el-icon><HomeFilled /></el-icon>
          返回前台
        </el-button>

        <el-dropdown @command="handleCommand">
          <span class="user-info">
            <el-avatar :size="32" :src="userInfo?.avatar || undefined" :icon="User" />
            <span class="username">{{ userInfo?.username || '船员' }}</span>
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
    <el-container class="crew-container">
      <!-- 侧边导航栏 -->
      <el-aside class="crew-aside" width="250px">
        <el-menu :default-active="activeMenu" class="crew-menu" router>
          <el-menu-item index="/crew/dashboard">
            <el-icon><data-analysis /></el-icon>
            <span>工作台</span>
          </el-menu-item>

          <el-sub-menu index="tasks">
            <template #title>
              <el-icon><list /></el-icon>
              <span>工作任务</span>
            </template>
            <el-menu-item index="/crew/tasks">任务列表</el-menu-item>
          </el-sub-menu>

          <!-- <el-menu-item index="/crew/schedule">
            <el-icon><calendar /></el-icon>
            <span>工作排班</span>
          </el-menu-item>

          <el-menu-item index="/crew/boats">
            <el-icon><ship /></el-icon>
            <span>船艇信息</span>
          </el-menu-item>

          <el-menu-item index="/crew/routes">
            <el-icon><map-road  /></el-icon>
            <span>航行路线</span>
          </el-menu-item>

          <el-menu-item index="/crew/safety">
            <el-icon><warning /></el-icon>
            <span>安全检查</span>
          </el-menu-item>

          <el-menu-item index="/crew/reports">
            <el-icon><document /></el-icon>
            <span>工作报告</span>
          </el-menu-item> -->
        </el-menu>
      </el-aside>

      <!-- 主要内容区域 -->
      <el-main class="crew-main">
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
  DataAnalysis,
  List,
  Calendar,
  Warning,
  Document,
  HomeFilled,
} from '@element-plus/icons-vue'
import { Ship, MapRoad, User } from '@icon-park/vue-next'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// 计算属性
const userInfo = computed(() => authStore.user)
const activeMenu = computed(() => route.path)

// 返回前台
const goToFrontend = () => {
  router.push('/user/dashboard')
}

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
.crew-layout {
  min-height: 100vh;
  background: #f0f2f5;
}

.crew-header {
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
  gap: 16px;
}

.frontend-btn {
  border-radius: 6px;
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

.crew-container {
  height: calc(100vh - 60px);
}

.crew-aside {
  background: #fff;
  border-right: 1px solid #e8e8e8;
}

.crew-menu {
  height: 100%;
  border-right: none;
}

.crew-menu .el-menu-item {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}

.crew-menu .el-menu-item:hover {
  background: #f6ffed;
  color: #52c41a;
}

.crew-menu .el-menu-item.is-active {
  background: #f6ffed;
  color: #52c41a;
  border-right: 2px solid #52c41a;
}

.crew-menu .el-sub-menu__title:hover {
  background: #f5f5f5;
  color: #52c41a;
}

.crew-main {
  padding: 24px;
  background: #f0f2f5;
}
</style>

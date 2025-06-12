<template>
  <div class="user-layout">
    <!-- 顶部导航栏 -->
    <el-header class="user-header">
      <div class="header-left">
        <div class="logo">
          <ship theme="outline" size="32" fill="#1890ff" />
          <span class="logo-text">绿色智能船艇</span>
        </div>

        <!-- 主导航菜单 -->
        <el-menu :default-active="activeMenu" class="header-menu" mode="horizontal" router>
          <el-menu-item index="/user/dashboard">首页</el-menu-item>
          <el-menu-item index="/user/boats">船舶预订</el-menu-item>
          <el-menu-item index="/user/bookings">我的预约</el-menu-item>
          <el-menu-item index="/user/products">农产品采购</el-menu-item>
        </el-menu>
      </div>

      <div class="header-right">
        <el-dropdown @command="handleCommand">
          <span class="user-info">
            <el-avatar :size="32" :src="userInfo?.avatar || undefined" :icon="UserFilled" />
            <span class="username">{{ userInfo?.username || '用户' }}</span>
            <el-icon class="dropdown-arrow"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人中心</el-dropdown-item>
              <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <!-- 主体内容区域 -->
    <el-container class="user-container">
      <!-- 主要内容区域 - 不再有侧边栏 -->
      <el-main class="user-main">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UserFilled, ArrowDown } from '@element-plus/icons-vue'
import { Ship } from '@icon-park/vue-next'
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
.user-layout {
  min-height: 100vh;
  background: #f5f5f5;
}

.user-header {
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 64px;
}

.header-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
  color: #1890ff;
  margin-right: 48px;
}

.logo-text {
  margin-left: 8px;
}

.header-menu {
  flex: 1;
  border-bottom: none;
}

.header-menu .el-menu-item {
  font-size: 14px;
  font-weight: 500;
}

.header-menu .el-menu-item:hover {
  background: transparent;
  color: #1890ff;
}

.header-menu .el-menu-item.is-active {
  background: transparent;
  color: #1890ff;
  border-bottom: 2px solid #1890ff;
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

.user-container {
  height: calc(100vh - 64px);
}

.user-main {
  padding: 24px;
  background: #f5f5f5;
}
</style>

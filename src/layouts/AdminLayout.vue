<template>
  <div class="admin-layout">
    <!-- 顶部导航栏 -->
    <el-header class="admin-header">
      <div class="header-left">
        <div class="logo">
          <ship theme="outline" size="32" fill="#1890ff" />
          <span class="logo-text">绿色智能船艇</span>
          <el-tag type="danger" size="small" class="role-tag">管理员</el-tag>
        </div>
      </div>

      <div class="header-right">
        <el-dropdown @command="handleCommand">
          <span class="user-info">
            <el-avatar
              :size="32"
              :src="userInfo?.avatar || undefined"
              :icon="UserFilled"
            />
            <span class="username">{{ userInfo?.username || '管理员' }}</span>
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
    <el-container class="admin-container">
      <!-- 侧边导航栏 -->
      <el-aside class="admin-aside" width="250px">
        <el-menu
          :default-active="activeMenu"
          class="admin-menu"
          router
        >
          <el-menu-item index="/admin/dashboard">
            <el-icon><data-analysis /></el-icon>
            <span>仪表板</span>
          </el-menu-item>

          <el-sub-menu index="users">
            <template #title>
              <el-icon><user /></el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/admin/users">用户列表</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="qualifications">
            <template #title>
              <el-icon><audit /></el-icon>
              <span>资质管理</span>
            </template>
            <el-menu-item index="/admin/realname">实名认证</el-menu-item>
            <el-menu-item index="/admin/merchantAudit">商家审核</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="business">
            <template #title>
              <el-icon><ship /></el-icon>
              <span>业务管理</span>
            </template>
            <el-menu-item index="/admin/boats">船艇管理</el-menu-item>
            <el-menu-item index="/admin/orders">订单管理</el-menu-item>
            <el-menu-item index="/admin/routes">航线管理</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="system">
            <template #title>
              <el-icon><setting /></el-icon>
              <span>系统管理</span>
            </template>
            <el-menu-item index="/admin/settings">系统设置</el-menu-item>
            <el-menu-item index="/admin/logs">操作日志</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <!-- 主要内容区域 -->
      <el-main class="admin-main">
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
  User,
  Setting,
  DataAnalysis,
} from '@element-plus/icons-vue'
import { Ship, Audit } from '@icon-park/vue-next'
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
          type: 'warning'
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
.admin-layout {
  min-height: 100vh;
  background: #f0f2f5;
}

.admin-header {
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

.admin-container {
  height: calc(100vh - 60px);
}

.admin-aside {
  background: #fff;
  border-right: 1px solid #e8e8e8;
}

.admin-menu {
  height: 100%;
  border-right: none;
}

.admin-menu .el-menu-item {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}

.admin-menu .el-menu-item:hover {
  background: #e6f7ff;
  color: #1890ff;
}

.admin-menu .el-menu-item.is-active {
  background: #e6f7ff;
  color: #1890ff;
  border-right: 2px solid #1890ff;
}

.admin-menu .el-sub-menu__title:hover {
  background: #f5f5f5;
  color: #1890ff;
}

.admin-main {
  padding: 24px;
  background: #f0f2f5;
}
</style>
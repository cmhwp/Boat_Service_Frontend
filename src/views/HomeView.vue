<template>
  <div class="home-container">
    <!-- 顶部用户信息栏 -->
    <div class="top-bar" v-if="authStore.isAuthenticated">
      <div class="top-bar-left">
        <div class="logo">
          <ship theme="outline" size="24" fill="#1890ff" />
          <span class="logo-text">绿色智能船艇</span>
        </div>
      </div>
      <div class="top-bar-right">
        <el-dropdown @command="handleUserCommand">
          <span class="user-dropdown">
            <el-avatar :size="32" :src="authStore.user?.avatar || undefined" :icon="UserFilled" />
            <span class="username">{{ authStore.user?.username }}</span>
            <el-icon class="dropdown-arrow"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><user /></el-icon>
                个人信息
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <el-icon><logout /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <div class="welcome-section">
      <div class="brand-area">
        <div class="brand-icon">
          <ship theme="outline" size="64" fill="#1890ff" />
        </div>
        <h1 class="brand-title">绿色智能船艇农文旅平台</h1>
        <p class="brand-description">探索智慧农业与文旅融合的全新体验，让科技与自然和谐共生</p>
      </div>

      <div class="action-buttons" v-if="!authStore.isAuthenticated">
        <el-button type="primary" size="large" class="action-btn login-btn" @click="goToLogin">
          <user theme="outline" size="20" fill="#fff" />
          立即登录
        </el-button>
        <el-button size="large" class="action-btn register-btn" @click="goToRegister">
          <add-user theme="outline" size="20" fill="#1890ff" />
          免费注册
        </el-button>
      </div>

      <div class="action-buttons" v-else>
        <el-button
          type="primary"
          size="large"
          class="action-btn experience-btn"
          @click="goToExperience"
        >
          <ship theme="outline" size="20" fill="#fff" />
          立即体验
        </el-button>
      </div>
    </div>

    <!-- 功能导航 -->
    <div class="feature-section" v-if="authStore.isAuthenticated">
      <h2 class="section-title">平台功能</h2>
      <div class="feature-grid">
        <div class="feature-card" @click="goToFeature('boats')">
          <div class="feature-icon">
            <ship theme="outline" size="32" fill="#1890ff" />
          </div>
          <h3 class="feature-title">船艇管理</h3>
          <p class="feature-desc">智能船艇预订与管理</p>
        </div>

        <div class="feature-card" @click="goToFeature('agriculture')">
          <div class="feature-icon">
            <tree-one theme="outline" size="32" fill="#52c41a" />
          </div>
          <h3 class="feature-title">智慧农业</h3>
          <p class="feature-desc">现代农业技术应用</p>
        </div>

        <div class="feature-card" @click="goToFeature('tourism')">
          <div class="feature-icon">
            <camera theme="outline" size="32" fill="#faad14" />
          </div>
          <h3 class="feature-title">文旅体验</h3>
          <p class="feature-desc">特色文旅项目推荐</p>
        </div>

        <div class="feature-card" @click="goToFeature('analytics')">
          <div class="feature-icon">
            <chart-line theme="outline" size="32" fill="#722ed1" />
          </div>
          <h3 class="feature-title">数据分析</h3>
          <p class="feature-desc">智能数据分析报告</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UserFilled, ArrowDown } from '@element-plus/icons-vue'
import {
  Ship,
  User,
  AddUser,
  Logout,
  Setting,
  TreeOne,
  Camera,
  ChartLine,
} from '@icon-park/vue-next'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const goToLogin = () => {
  router.push('/auth/login')
}

const goToRegister = () => {
  router.push('/auth/register')
}

const goToExperience = () => {
  const role = authStore.user?.role
  switch (role) {
    case 'admin':
      router.push('/admin')
      break
    case 'merchant':
      router.push('/merchant')
      break
    case 'crew':
      router.push('/crew')
      break
    case 'user':
      router.push('/user')
      break
    default:
      ElMessage.warning('用户角色未识别')
  }
}

const handleUserCommand = async (command: string) => {
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

const goToFeature = (feature: string) => {
  ElMessage.info(`${feature}功能开发中`)
}

// 角色标签类型
const getRoleTagType = (role: API.UserRole) => {
  const roleMap = {
    admin: 'danger',
    merchant: 'warning',
    crew: 'success',
    user: 'info',
  }
  return roleMap[role] || 'info'
}

// 角色文本
const getRoleText = (role: API.UserRole) => {
  const roleMap = {
    admin: '管理员',
    merchant: '商家',
    crew: '船员',
    user: '用户',
  }
  return roleMap[role] || '用户'
}

// 实名状态标签类型
const getStatusTagType = (status: API.RealnameStatus) => {
  const statusMap = {
    verified: 'success',
    pending: 'warning',
    unverified: 'info',
  }
  return statusMap[status] || 'info'
}

// 实名状态文本
const getStatusText = (status: API.RealnameStatus) => {
  const statusMap = {
    verified: '已认证',
    pending: '认证中',
    unverified: '未认证',
  }
  return statusMap[status] || '未认证'
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 50%, #e6fffb 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 0;
}

.top-bar {
  width: 100%;
  height: 60px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(24, 144, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.top-bar-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
}

.logo-text {
  margin-left: 8px;
}

.top-bar-right {
  display: flex;
  align-items: center;
}

.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.user-dropdown:hover {
  background: rgba(24, 144, 255, 0.05);
}

.username {
  margin-left: 8px;
  margin-right: 4px;
  color: #333;
  font-weight: 500;
}

.dropdown-arrow {
  font-size: 12px;
  color: #999;
}

.welcome-section {
  text-align: center;
  max-width: 600px;
  width: 100%;
  margin-bottom: 3rem;
  padding: 2rem;
}

.brand-area {
  margin-bottom: 3rem;
}

.brand-icon {
  margin-bottom: 2rem;
  display: inline-block;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  box-shadow: 0 12px 32px rgba(24, 144, 255, 0.15);
}

.brand-title {
  font-size: 3rem;
  font-weight: 700;
  color: #1890ff;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(24, 144, 255, 0.1);
}

.brand-description {
  font-size: 1.2rem;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  height: 48px;
  padding: 0 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.login-btn {
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
}

.register-btn {
  background: #fff;
  border: 2px solid #1890ff;
  color: #1890ff;
}

.register-btn:hover {
  background: #1890ff;
  color: #fff;
  transform: translateY(-2px);
}

.experience-btn {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(82, 196, 26, 0.3);
}

.experience-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(82, 196, 26, 0.4);
}

.feature-section {
  max-width: 1000px;
  width: 100%;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  color: #1890ff;
  margin: 0 0 2rem 0;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(24, 144, 255, 0.15);
}

.feature-icon {
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  display: inline-block;
}

.feature-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.feature-desc {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .home-container {
    padding: 1rem;
  }

  .brand-title {
    font-size: 2.5rem;
  }

  .brand-description {
    font-size: 1.1rem;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .action-btn {
    width: 100%;
    max-width: 280px;
  }

  .welcome-section {
    padding: 1rem;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .brand-title {
    font-size: 2rem;
  }

  .brand-description {
    font-size: 1rem;
  }

  .top-bar {
    padding: 0 1rem;
  }

  .feature-card {
    padding: 1.5rem;
  }
}

/* 动画效果 */
.welcome-section {
  animation: fadeInUp 0.8s ease-out;
}

.feature-section {
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

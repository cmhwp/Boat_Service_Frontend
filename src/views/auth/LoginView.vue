<template>
  <div class="login-container">
    <!-- 页面标题 -->
    <div class="login-header">
      <h2 class="login-title">欢迎回来</h2>
      <p class="login-subtitle">登录您的账户，开启智慧农旅之旅</p>
    </div>

    <!-- 登录表单 -->
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      size="large"
      @submit.prevent="handleLogin"
    >
      <!-- 用户名/邮箱输入 -->
      <el-form-item prop="identifier">
        <el-input
          v-model="loginForm.identifier"
          placeholder="请输入用户名或邮箱"
          class="login-input"
          clearable
        >
          <template #prefix>
            <user theme="outline" size="18" fill="#999" />
          </template>
        </el-input>
      </el-form-item>

      <!-- 密码输入 -->
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          placeholder="请输入密码"
          class="login-input"
          show-password
          clearable
          @keyup.enter="handleLogin"
        >
          <template #prefix>
            <lock theme="outline" size="18" fill="#999" />
          </template>
        </el-input>
      </el-form-item>

      <!-- 记住我和忘记密码 -->
      <div class="login-options">
        <el-checkbox v-model="loginForm.remember" class="remember-checkbox"> 记住我 </el-checkbox>
        <el-link
          type="primary"
          :underline="false"
          class="forgot-link"
          @click="handleForgotPassword"
        >
          忘记密码？
        </el-link>
      </div>

      <!-- 登录按钮 -->
      <el-form-item>
        <el-button
          type="primary"
          class="login-button"
          size="large"
          :loading="authStore.loading"
          @click="handleLogin"
        >
          <template #loading>
            <loading theme="outline" size="18" fill="#fff" />
          </template>
          {{ authStore.loading ? '登录中...' : '登录' }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 第三方登录 -->
    <div class="social-login">
      <div class="divider">
        <span class="divider-text">或者使用以下方式登录</span>
      </div>

      <div class="social-buttons">
        <el-button class="social-btn wechat-btn" @click="handleSocialLogin('wechat')">
          <wechat theme="filled" size="20" fill="#07c160" />
          微信登录
        </el-button>
        <el-button class="social-btn qq-btn" @click="handleSocialLogin('qq')">
          <tencent-qq theme="filled" size="20" fill="#1890ff" />
          QQ登录
        </el-button>
      </div>
    </div>

    <!-- 注册提示 -->
    <div class="register-tip">
      <span class="tip-text">还没有账户？</span>
      <el-link type="primary" :underline="false" class="register-link" @click="goToRegister">
        立即注册
      </el-link>
    </div>

    <!-- 忘记密码对话框 -->
    <el-dialog
      v-model="forgotPasswordVisible"
      title="忘记密码"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form ref="forgotFormRef" :model="forgotForm" :rules="forgotRules" label-width="0">
        <el-form-item prop="email">
          <el-input v-model="forgotForm.email" placeholder="请输入注册邮箱" clearable>
            <template #prefix>
              <mail theme="outline" size="18" fill="#999" />
            </template>
          </el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="forgotPasswordVisible = false">取消</el-button>
          <el-button type="primary" :loading="forgotLoading" @click="sendResetEmail">
            发送重置链接
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { User, Lock, Loading, Wechat, TencentQq, Mail } from '@icon-park/vue-next'
import { useAuthStore, type LoginForm } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// 表单引用
const loginFormRef = ref<FormInstance>()
const forgotFormRef = ref<FormInstance>()

// 登录表单数据
const loginForm = reactive<LoginForm>({
  identifier: '',
  password: '',
  remember: false,
})

// 忘记密码表单
const forgotForm = reactive({
  email: '',
})

const forgotPasswordVisible = ref(false)
const forgotLoading = ref(false)

// 表单验证规则
const loginRules: FormRules = {
  identifier: [
    { required: true, message: '请输入用户名或邮箱', trigger: 'blur' },
    { min: 3, max: 50, message: '用户名或邮箱长度在 3 到 50 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
  ],
}

const forgotRules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
}

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    const valid = await loginFormRef.value.validate()
    if (!valid) return

    const result = await authStore.login(loginForm)

    if (result.success) {
      // 跳转到首页或之前访问的页面
      const redirect = router.currentRoute.value.query.redirect as string
      router.push(redirect || '/')
    }
  } catch (error) {
    console.error('Login validation failed:', error)
  }
}

// 处理忘记密码
const handleForgotPassword = () => {
  forgotPasswordVisible.value = true
  forgotForm.email = ''
}

// 发送重置邮件
const sendResetEmail = async () => {
  if (!forgotFormRef.value) return

  try {
    const valid = await forgotFormRef.value.validate()
    if (!valid) return

    forgotLoading.value = true
    const result = await authStore.forgotPassword(forgotForm.email)

    if (result.success) {
      forgotPasswordVisible.value = false
      ElMessage.success('重置链接已发送到您的邮箱，请查收')
    }
  } catch (error) {
    console.error('Send reset email failed:', error)
  } finally {
    forgotLoading.value = false
  }
}

// 处理第三方登录
const handleSocialLogin = (platform: string) => {
  ElMessage.info(`${platform === 'wechat' ? '微信' : 'QQ'}登录功能开发中`)
}

// 跳转到注册页面
const goToRegister = () => {
  router.push('/auth/register')
}

// 组件挂载时检查是否记住登录
onMounted(() => {
  const remembered = localStorage.getItem('remember')
  if (remembered === 'true') {
    loginForm.remember = true
  }
})
</script>

<style scoped>
.login-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1890ff;
  margin: 0 0 0.5rem 0;
}

.login-subtitle {
  color: #666;
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.4;
}

.login-form {
  margin-bottom: 1.5rem;
}

.login-input {
  height: 48px;
}

.login-input :deep(.el-input__inner) {
  border-radius: 12px;
  border: 2px solid #f0f0f0;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.login-input :deep(.el-input__inner:focus) {
  border-color: #1890ff;
  box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
}

.login-input :deep(.el-input__prefix) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.remember-checkbox {
  color: #666;
}

.remember-checkbox :deep(.el-checkbox__label) {
  font-size: 0.9rem;
}

.forgot-link {
  font-size: 0.9rem;
  color: #1890ff;
  transition: opacity 0.3s ease;
}

.forgot-link:hover {
  opacity: 0.8;
}

.login-button {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
  transition: all 0.3s ease;
}

.login-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
}

.login-button:active {
  transform: translateY(0);
}

.social-login {
  margin-bottom: 2rem;
}

.divider {
  position: relative;
  text-align: center;
  margin: 2rem 0 1.5rem 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e8e8e8;
  z-index: 1;
}

.divider-text {
  background: rgba(255, 255, 255, 0.95);
  padding: 0 1rem;
  color: #999;
  font-size: 0.85rem;
  position: relative;
  z-index: 2;
}

.social-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.social-btn {
  height: 44px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  border: 2px solid #f0f0f0;
  background: #fff;
  color: #666;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.social-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.wechat-btn:hover {
  border-color: #07c160;
  color: #07c160;
}

.qq-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.register-tip {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.tip-text {
  color: #999;
  font-size: 0.9rem;
  margin-right: 0.5rem;
}

.register-link {
  font-size: 0.9rem;
  color: #1890ff;
  font-weight: 500;
  transition: opacity 0.3s ease;
}

.register-link:hover {
  opacity: 0.8;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-container {
    padding: 0 1rem;
  }

  .login-title {
    font-size: 1.6rem;
  }

  .social-buttons {
    grid-template-columns: 1fr;
  }

  .login-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}

/* 动画效果 */
.login-container {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

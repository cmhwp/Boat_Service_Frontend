<template>
  <div class="register-container">
    <!-- 页面标题 -->
    <div class="register-header">
      <h2 class="register-title">加入我们</h2>
      <p class="register-subtitle">创建您的账户，开启智慧农旅新体验</p>
    </div>

    <!-- 注册表单 -->
    <el-form
      ref="registerFormRef"
      :model="registerForm"
      :rules="registerRules"
      class="register-form"
      size="large"
      @submit.prevent="handleRegister"
    >
      <!-- 用户名输入 -->
      <el-form-item prop="username">
        <el-input
          v-model="registerForm.username"
          placeholder="请输入用户名"
          class="register-input"
          clearable
        >
          <template #prefix>
            <user theme="outline" size="18" fill="#999" />
          </template>
        </el-input>
      </el-form-item>

      <!-- 邮箱输入 -->
      <el-form-item prop="email">
        <el-input
          v-model="registerForm.email"
          placeholder="请输入邮箱地址"
          class="register-input"
          clearable
          @blur="checkEmailChange"
        >
          <template #prefix>
            <mail theme="outline" size="18" fill="#999" />
          </template>
        </el-input>
      </el-form-item>

      <!-- 验证码输入 -->
      <el-form-item prop="verificationCode">
        <div class="verification-input-group">
          <el-input
            v-model="registerForm.verificationCode"
            placeholder="请输入邮箱验证码"
            class="verification-input"
            clearable
            maxlength="6"
          >
            <template #prefix>
              <check-correct theme="outline" size="18" fill="#999" />
            </template>
          </el-input>
          <el-button
            class="send-code-btn"
            :disabled="!canSendCode || sendCodeLoading"
            :loading="sendCodeLoading"
            @click="sendVerificationCode"
          >
            {{ sendCodeText }}
          </el-button>
        </div>
      </el-form-item>

      <!-- 密码输入 -->
      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          placeholder="请输入密码"
          class="register-input"
          show-password
          clearable
        >
          <template #prefix>
            <lock theme="outline" size="18" fill="#999" />
          </template>
        </el-input>
      </el-form-item>

      <!-- 确认密码输入 -->
      <el-form-item prop="confirmPassword">
        <el-input
          v-model="registerForm.confirmPassword"
          type="password"
          placeholder="请确认密码"
          class="register-input"
          show-password
          clearable
        >
          <template #prefix>
            <check-correct theme="outline" size="18" fill="#999" />
          </template>
        </el-input>
      </el-form-item>

      <!-- 服务条款 -->
      <el-form-item prop="agreeTerm">
        <el-checkbox v-model="registerForm.agreeTerm" class="term-checkbox">
          <span class="term-text">
            我已阅读并同意
            <el-link type="primary" :underline="false" class="term-link" @click="showTerms">
              《用户服务协议》
            </el-link>
            和
            <el-link type="primary" :underline="false" class="term-link" @click="showPrivacy">
              《隐私政策》
            </el-link>
          </span>
        </el-checkbox>
      </el-form-item>

      <!-- 注册按钮 -->
      <el-form-item>
        <el-button
          type="primary"
          class="register-button"
          size="large"
          :loading="authStore.loading"
          @click="handleRegister"
        >
          <template #loading>
            <loading theme="outline" size="18" fill="#fff" />
          </template>
          {{ authStore.loading ? '注册中...' : '立即注册' }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 快速注册 -->
    <div class="quick-register">
      <div class="divider">
        <span class="divider-text">或者使用以下方式快速注册</span>
      </div>

      <div class="social-buttons">
        <el-button class="social-btn wechat-btn" @click="handleSocialRegister('wechat')">
          <wechat theme="filled" size="20" fill="#07c160" />
          微信注册
        </el-button>
        <el-button class="social-btn qq-btn" @click="handleSocialRegister('qq')">
          <tencent-qq theme="filled" size="20" fill="#1890ff" />
          QQ注册
        </el-button>
      </div>
    </div>

    <!-- 登录提示 -->
    <div class="login-tip">
      <span class="tip-text">已有账户？</span>
      <el-link type="primary" :underline="false" class="login-link" @click="goToLogin">
        立即登录
      </el-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { User, Mail, Lock, CheckCorrect, Loading, Wechat, TencentQq } from '@icon-park/vue-next'
import { useAuthStore, type RegisterForm } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// 表单引用
const registerFormRef = ref<FormInstance>()

// 注册表单数据
const registerForm = reactive<RegisterForm>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  verificationCode: '',
  agreeTerm: false,
})

// 验证码相关状态
const sendCodeLoading = ref(false)
const sendCodeCountdown = ref(0)
const lastEmail = ref('')

// 验证码发送按钮文本
const sendCodeText = computed(() => {
  if (sendCodeCountdown.value > 0) {
    return `${sendCodeCountdown.value}s后重发`
  }
  return '发送验证码'
})

// 是否可以发送验证码
const canSendCode = computed(() => {
  return (
    registerForm.email &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email) &&
    sendCodeCountdown.value === 0
  )
})

// 自定义验证函数
const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请确认密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const validateAgreeTerm = (rule: any, value: boolean, callback: any) => {
  if (!value) {
    callback(new Error('请同意用户服务协议和隐私政策'))
  } else {
    callback()
  }
}

// 表单验证规则
const registerRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
      message: '用户名只能包含字母、数字、下划线和中文',
      trigger: 'blur',
    },
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
  verificationCode: [
    { required: true, message: '请输入邮箱验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '验证码必须为6位数字', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
    { pattern: /^(?=.*[a-zA-Z])(?=.*\d)/, message: '密码必须包含字母和数字', trigger: 'blur' },
  ],
  confirmPassword: [{ required: true, validator: validateConfirmPassword, trigger: 'blur' }],
  agreeTerm: [{ required: true, validator: validateAgreeTerm, trigger: 'change' }],
}

// 检查邮箱变化
const checkEmailChange = () => {
  if (registerForm.email !== lastEmail.value) {
    registerForm.verificationCode = ''
    lastEmail.value = registerForm.email
  }
}

// 发送验证码
const sendVerificationCode = async () => {
  if (!canSendCode.value) return

  try {
    sendCodeLoading.value = true
    const result = await authStore.sendVerificationCode(registerForm.email)
    if (result.success) {
      ElMessage.success('验证码已发送，请查收邮箱')
      // 开始倒计时
      sendCodeCountdown.value = 60
      const timer = setInterval(() => {
        sendCodeCountdown.value--
        if (sendCodeCountdown.value <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    }
  } catch (error) {
    console.error('Send verification code failed:', error)
  } finally {
    sendCodeLoading.value = false
  }
}

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return

  try {
    const valid = await registerFormRef.value.validate()
    if (!valid) return

    const result = await authStore.register(registerForm)

    if (result.success) {
      ElMessage.success('注册成功！请登录')
      // 跳转到登录页面
      router.push('/auth/login')
    }
  } catch (error) {
    console.error('Register validation failed:', error)
  }
}

// 处理第三方注册
const handleSocialRegister = (platform: string) => {
  ElMessage.info(`${platform === 'wechat' ? '微信' : 'QQ'}注册功能开发中`)
}

// 显示服务条款
const showTerms = () => {
  ElMessage.info('用户服务协议功能开发中')
}

// 显示隐私政策
const showPrivacy = () => {
  ElMessage.info('隐私政策功能开发中')
}

// 跳转到登录页面
const goToLogin = () => {
  router.push('/auth/login')
}
</script>

<style scoped>
.register-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1890ff;
  margin: 0 0 0.5rem 0;
}

.register-subtitle {
  color: #666;
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.4;
}

.register-form {
  margin-bottom: 1.5rem;
}

.register-input {
  height: 48px;
  margin-bottom: 8px;
}

.register-input :deep(.el-input__inner) {
  border-radius: 12px;
  border: 2px solid #f0f0f0;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.register-input :deep(.el-input__inner:focus) {
  border-color: #1890ff;
  box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
}

.register-input :deep(.el-input__prefix) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.verification-input-group {
  display: flex;
  gap: 8px;
}

.verification-input {
  flex: 1;
  height: 48px;
}

.verification-input :deep(.el-input__inner) {
  border-radius: 12px;
  border: 2px solid #f0f0f0;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.verification-input :deep(.el-input__inner:focus) {
  border-color: #1890ff;
  box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
}

.send-code-btn {
  height: 48px;
  padding: 0 16px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  border: 2px solid #1890ff;
  color: #1890ff;
  background: #fff;
  transition: all 0.3s ease;
}

.send-code-btn:hover:not(:disabled) {
  background: #1890ff;
  color: #fff;
}

.send-code-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.term-checkbox {
  margin-bottom: 1rem;
}

.term-checkbox :deep(.el-checkbox__label) {
  font-size: 0.85rem;
  line-height: 1.4;
}

.term-text {
  color: #666;
}

.term-link {
  font-size: 0.85rem;
  color: #1890ff;
  font-weight: 500;
}

.register-button {
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

.register-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
}

.register-button:active {
  transform: translateY(0);
}

.quick-register {
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

.login-tip {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.tip-text {
  color: #999;
  font-size: 0.9rem;
  margin-right: 0.5rem;
}

.login-link {
  font-size: 0.9rem;
  color: #1890ff;
  font-weight: 500;
  transition: opacity 0.3s ease;
}

.login-link:hover {
  opacity: 0.8;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .register-container {
    padding: 0 1rem;
  }

  .register-title {
    font-size: 1.6rem;
  }

  .social-buttons {
    grid-template-columns: 1fr;
  }

  .term-checkbox :deep(.el-checkbox__label) {
    font-size: 0.8rem;
  }

  .term-link {
    font-size: 0.8rem;
  }

  .verification-input-group {
    flex-direction: column;
  }

  .send-code-btn {
    height: 40px;
  }
}

/* 动画效果 */
.register-container {
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

/* 表单验证错误样式优化 */
.register-form :deep(.el-form-item__error) {
  font-size: 0.8rem;
  color: #ff4d4f;
  margin-top: 4px;
}

.register-form :deep(.el-form-item.is-error .el-input__inner) {
  border-color: #ff4d4f;
  box-shadow: 0 0 0 3px rgba(255, 77, 79, 0.1);
}

/* 成功状态样式 */
.register-form :deep(.el-form-item.is-success .el-input__inner) {
  border-color: #52c41a;
  box-shadow: 0 0 0 3px rgba(82, 196, 26, 0.1);
}
</style>

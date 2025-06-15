import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  loginApiV1UsersLoginPost,
  completeRegistrationApiV1UsersRegisterPost,
  getCurrentUserInfoApiV1UsersMeGet,
  sendVerificationCodeApiV1UsersSendVerificationCodePost,
  verifyEmailCodeApiV1UsersVerifyEmailCodePost,
  changePasswordApiV1UsersChangePasswordPost,
  forgotPasswordApiV1UsersForgotPasswordPost,
  resetPasswordApiV1UsersResetPasswordPost,
} from '@/services/api/users'

export interface LoginForm {
  identifier: string // 用户名或邮箱
  password: string
  remember?: boolean
}

export interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
  verificationCode: string
  agreeTerm: boolean
}

export interface VerificationForm {
  email: string
}

export interface ChangePasswordForm {
  old_password: string
  new_password: string
  confirm_password: string
}

export interface ForgotPasswordForm {
  email: string
}

export interface ResetPasswordForm {
  token: string
  new_password: string
  confirm_password: string
}

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref<API.UserResponseSchema | null>(null)
  const token = ref<string | null>(localStorage.getItem('access_token'))
  const loading = ref(false)

  // 计算属性
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userInfo = computed(() => user.value)

  // 登录
  const login = async (loginForm: LoginForm) => {
    loading.value = true
    try {
      const response = await loginApiV1UsersLoginPost({
        identifier: loginForm.identifier,
        password: loginForm.password,
      })
      if (response.data?.success && response.data?.data) {
        const { access_token, user: userInfo } = response.data.data

        // 保存token和用户信息
        token.value = access_token
        user.value = userInfo

        // 持久化存储
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('user_info', JSON.stringify(userInfo))

        if (loginForm.remember) {
          localStorage.setItem('remember', 'true')
        }
        return { success: true, user: userInfo, token: access_token }
      } else {
        const errorMessage = response.data?.message || '登录失败'
        ElMessage.error(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error: unknown) {
      console.error('Login failed:', error)
      const errorMessage = (error as any)?.response?.data?.message || '登录失败，请检查用户名和密码'
      ElMessage.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // 发送邮箱验证码
  const sendVerificationCode = async (email: string) => {
    loading.value = true
    try {
      const response = await sendVerificationCodeApiV1UsersSendVerificationCodePost({
        email,
      })

      if (response.data?.success) {
        ElMessage.success('验证码已发送到您的邮箱')
        return { success: true, data: response.data.data }
      } else {
        const errorMessage = response.data?.message || '发送验证码失败'
        ElMessage.error(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error: unknown) {
      console.error('Send verification code failed:', error)
      const errorMessage = (error as any)?.response?.data?.message || '发送验证码失败'
      ElMessage.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // 验证邮箱验证码
  const verifyEmailCode = async (email: string, code: string) => {
    try {
      const response = await verifyEmailCodeApiV1UsersVerifyEmailCodePost({
        email,
        code,
      })

      if (response.data?.success) {
        return { success: true }
      } else {
        const errorMessage = response.data?.message || '验证码验证失败'
        ElMessage.error(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error: unknown) {
      console.error('Verify email code failed:', error)
      const errorMessage = (error as any)?.response?.data?.message || '验证码验证失败'
      ElMessage.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // 注册
  const register = async (registerForm: RegisterForm) => {
    loading.value = true
    try {
      // // 先验证邮箱验证码
      // const verifyResult = await verifyEmailCode(registerForm.email, registerForm.verificationCode)
      // if (!verifyResult.success) {
      //   return verifyResult
      // }

      const response = await completeRegistrationApiV1UsersRegisterPost({
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password,
        verification_code: registerForm.verificationCode,
      })
      console.log(registerForm)
      if (response.data?.success && response.data?.data) {
        ElMessage.success('注册成功！请登录')
        return { success: true, user: response.data.data }
      } else {
        const errorMessage = response.data?.message || '注册失败'
        ElMessage.error(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error: unknown) {
      console.error('Register failed:', error)
      const errorMessage = (error as any)?.response?.data?.message || '注册失败，请稍后重试'
      ElMessage.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // 获取当前用户信息
  const getCurrentUser = async () => {
    try {
      const response = await getCurrentUserInfoApiV1UsersMeGet()

      if (response.data?.success && response.data?.data) {
        user.value = response.data.data
        localStorage.setItem('user_info', JSON.stringify(response.data.data))
        return { success: true, user: response.data.data }
      } else {
        return { success: false, error: response.data?.message || '获取用户信息失败' }
      }
    } catch (error: unknown) {
      console.error('Get current user failed:', error)
      // 如果获取用户信息失败，可能是token过期，清除登录状态
      logout()
      const errorMessage = (error as any)?.response?.data?.message || '获取用户信息失败'
      return { success: false, error: errorMessage }
    }
  }

  // 修改密码
  const changePassword = async (changePasswordForm: ChangePasswordForm) => {
    loading.value = true
    try {
      const response = await changePasswordApiV1UsersChangePasswordPost(changePasswordForm)

      if (response.data?.success) {
        ElMessage.success('密码修改成功')
        return { success: true }
      } else {
        const errorMessage = response.data?.message || '密码修改失败'
        ElMessage.error(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error: unknown) {
      console.error('Change password failed:', error)
      const errorMessage = (error as any)?.response?.data?.message || '密码修改失败'
      ElMessage.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // 忘记密码
  const forgotPassword = async (email: string) => {
    loading.value = true
    try {
      const response = await forgotPasswordApiV1UsersForgotPasswordPost({ email })

      if (response.data?.success) {
        ElMessage.success('重置链接已发送到您的邮箱')
        return { success: true }
      } else {
        const errorMessage = response.data?.message || '发送重置链接失败'
        ElMessage.error(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error: unknown) {
      console.error('Forgot password failed:', error)
      const errorMessage = (error as any)?.response?.data?.message || '发送重置链接失败'
      ElMessage.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // 重置密码
  const resetPassword = async (resetPasswordForm: ResetPasswordForm) => {
    loading.value = true
    try {
      const response = await resetPasswordApiV1UsersResetPasswordPost(resetPasswordForm)

      if (response.data?.success) {
        ElMessage.success('密码重置成功，请使用新密码登录')
        return { success: true }
      } else {
        const errorMessage = response.data?.message || '密码重置失败'
        ElMessage.error(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error: unknown) {
      console.error('Reset password failed:', error)
      const errorMessage = (error as any)?.response?.data?.message || '密码重置失败'
      ElMessage.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // 登出
  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_info')
    localStorage.removeItem('remember')
    ElMessage.success('已退出登录')
  }

  // 初始化用户信息
  const initAuth = async () => {
    const savedToken = localStorage.getItem('access_token')
    const savedUser = localStorage.getItem('user_info')

    if (savedToken) {
      token.value = savedToken

      if (savedUser) {
        try {
          user.value = JSON.parse(savedUser)
        } catch (error) {
          console.error('Failed to parse saved user data:', error)
          // 清除无效的用户数据
          localStorage.removeItem('user_info')
        }
      }

      // 如果有用户信息，先设置状态，这样可以避免路由守卫误判
      // 然后再验证token有效性并获取最新用户信息
      if (user.value) {
        try {
          await getCurrentUser()
        } catch (error) {
          // 如果获取用户信息失败，可能是token过期
          console.error('Token验证失败:', error)
        }
      }
    }
  }

  // 更新用户信息
  const updateUser = (userData: Partial<API.UserResponseSchema>) => {
    if (user.value) {
      user.value = { ...user.value, ...userData }
      localStorage.setItem('user_info', JSON.stringify(user.value))
    }
  }

  return {
    // 状态
    user: userInfo,
    token,
    loading,
    isAuthenticated,

    // 方法
    login,
    register,
    sendVerificationCode,
    verifyEmailCode,
    getCurrentUser,
    changePassword,
    forgotPassword,
    resetPassword,
    logout,
    initAuth,
    updateUser,
  }
})

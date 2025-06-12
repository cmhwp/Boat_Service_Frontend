import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getMyRealnameAuthApiV1RealnameAuthMeGet,
  submitRealnameAuthApiV1RealnameAuthSubmitPost,
  updateMyRealnameAuthApiV1RealnameAuthMePut,
  uploadIdCardImagesApiV1RealnameAuthUploadImagesPost,
} from '@/services/api/realnameAuth'

export const useRealnameStore = defineStore('realname', () => {
  // 状态
  const realnameAuth = ref<API.RealnameAuthResponseSchema | null>(null)
  const loading = ref(false)
  const submitting = ref(false)

  // 计算属性
  const isAuthenticated = computed(() => !!realnameAuth.value)
  const authStatus = computed(() => realnameAuth.value?.status || 'unverified')
  const canSubmit = computed(() => !realnameAuth.value || realnameAuth.value.status === 'rejected')

  // 获取我的实名认证信息
  const getMyRealnameAuth = async () => {
    loading.value = true
    try {
      const response = await getMyRealnameAuthApiV1RealnameAuthMeGet()

      if (response.data?.success && response.data?.data) {
        realnameAuth.value = response.data.data
        return { success: true, data: response.data.data }
      } else {
        // 如果没有实名认证记录，不算错误
        realnameAuth.value = null
        return { success: true, data: null }
      }
    } catch (error: unknown) {
      console.error('Get realname auth failed:', error)
      const errorMessage = (error as any)?.response?.data?.message || '获取实名认证信息失败'
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // 上传身份证图片
  const uploadIdCardImages = async (frontImage?: File, backImage?: File) => {
    try {
      const formData: any = {}
      if (frontImage) formData.front_image = frontImage
      if (backImage) formData.back_image = backImage

      const response = await uploadIdCardImagesApiV1RealnameAuthUploadImagesPost(formData)

      if (response.data?.success && response.data?.data) {
        return { success: true, data: response.data.data }
      } else {
        const errorMessage = response.data?.message || '图片上传失败'
        ElMessage.error(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error: unknown) {
      console.error('Upload images failed:', error)
      const errorMessage = (error as any)?.response?.data?.message || '图片上传失败'
      ElMessage.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // 提交实名认证
  const submitRealnameAuth = async (
    form: any, // 使用any类型以避免类型冲突，因为前端实际传递的是File对象
  ) => {
    submitting.value = true
    try {
      // 分离文件对象和其他数据
      const { front_image, back_image, real_name, id_card } = form

      // 判断是新建还是更新
      const isUpdate = !!realnameAuth.value

      let response
      if (isUpdate) {
        // 更新现有认证信息
        const updateBody: any = {
          real_name,
          id_card,
        }

        // 只有在用户上传了新图片时才包含图片字段
        if (front_image instanceof File) {
          updateBody.front_image = front_image
        }
        if (back_image instanceof File) {
          updateBody.back_image = back_image
        }

        response = await updateMyRealnameAuthApiV1RealnameAuthMePut(updateBody)
      } else {
        // 新建认证申请
        const requestBody = {
          real_name,
          id_card,
          front_image: '', // API要求的字符串字段，设为空
          back_image: '', // API要求的字符串字段，设为空
        }

        // 将File对象作为独立参数传递
        response = await submitRealnameAuthApiV1RealnameAuthSubmitPost(
          requestBody,
          front_image as File,
          back_image as File,
        )
      }

      if (response.data?.success && response.data?.data) {
        realnameAuth.value = response.data.data
        ElMessage.success(isUpdate ? '实名认证信息更新成功' : '实名认证申请提交成功，请等待审核')
        return { success: true, data: response.data.data }
      } else {
        const errorMessage =
          response.data?.message || (isUpdate ? '更新实名认证失败' : '提交实名认证失败')
        ElMessage.error(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error: unknown) {
      console.error('Submit realname auth failed:', error)
      const errorMessage = (error as any)?.response?.data?.message || '操作失败'
      ElMessage.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      submitting.value = false
    }
  }

  // 清空状态
  const clearRealnameAuth = () => {
    realnameAuth.value = null
  }

  return {
    // 状态
    realnameAuth,
    loading,
    submitting,

    // 计算属性
    isAuthenticated,
    authStatus,
    canSubmit,

    // 方法
    getMyRealnameAuth,
    uploadIdCardImages,
    submitRealnameAuth,
    clearRealnameAuth,
  }
})

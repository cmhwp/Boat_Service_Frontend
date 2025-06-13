import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  applyMerchantApiV1MerchantsApplyPost,
  getMyMerchantInfoApiV1MerchantsMeGet,
  updateMyMerchantApiV1MerchantsMePut,
  uploadMerchantLicenseApiV1MerchantsUploadLicensePost,
} from '@/services/api/merchants'

export const useMerchantStore = defineStore('merchant', () => {
  // 状态
  const merchantInfo = ref<API.MerchantDetailSchema | null>(null)
  const loading = ref(false)
  const submitting = ref(false)

  // 计算属性
  const isMerchant = computed(() => !!merchantInfo.value)
  const merchantStatus = computed(() => merchantInfo.value?.status || null)
  const canApply = computed(() => !merchantInfo.value)

  // 获取我的商家信息
  const getMyMerchantInfo = async () => {
    loading.value = true
    try {
      const response = await getMyMerchantInfoApiV1MerchantsMeGet()

      if (response.data?.success && response.data?.data) {
        merchantInfo.value = response.data.data
        return { success: true, data: response.data.data }
      } else {
        // 如果没有商家记录，不算错误
        merchantInfo.value = null
        return { success: true, data: null }
      }
    } catch (error: unknown) {
      console.error('Get merchant info failed:', error)
      const errorMessage = (error as any)?.response?.data?.message || '获取商家信息失败'
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // 上传营业执照
  const uploadLicense = async (file: File) => {
    try {
      const formData = {} as API.BodyUploadMerchantLicenseApiV1MerchantsUploadLicensePost
      const response = await uploadMerchantLicenseApiV1MerchantsUploadLicensePost(formData, file)

      if (response.data?.success && response.data?.data) {
        return { success: true, data: response.data.data }
      } else {
        const errorMessage = response.data?.message || '上传营业执照失败'
        ElMessage.error(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error: unknown) {
      console.error('Upload license failed:', error)
      const errorMessage = (error as any)?.response?.data?.message || '上传营业执照失败'
      ElMessage.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // 申请成为商家
  const applyMerchant = async (formData: API.MerchantApplySchema) => {
    submitting.value = true
    try {
      const response = await applyMerchantApiV1MerchantsApplyPost(formData)

      if (response.data?.success && response.data?.data) {
        merchantInfo.value = response.data.data as any
        ElMessage.success('商家申请提交成功，请等待审核')
        return { success: true, data: response.data.data }
      } else {
        const errorMessage = response.data?.message || '商家申请失败'
        ElMessage.error(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error: unknown) {
      console.error('Apply merchant failed:', error)
      const errorMessage = (error as any)?.response?.data?.message || '商家申请失败'
      ElMessage.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      submitting.value = false
    }
  }

  // 更新商家信息
  const updateMerchantInfo = async (formData: API.MerchantUpdateSchema) => {
    submitting.value = true
    try {
      const response = await updateMyMerchantApiV1MerchantsMePut(formData)

      if (response.data?.success && response.data?.data) {
        merchantInfo.value = response.data.data as any
        ElMessage.success('商家信息更新成功')
        return { success: true, data: response.data.data }
      } else {
        const errorMessage = response.data?.message || '更新商家信息失败'
        ElMessage.error(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error: unknown) {
      console.error('Update merchant failed:', error)
      const errorMessage = (error as any)?.response?.data?.message || '更新商家信息失败'
      ElMessage.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      submitting.value = false
    }
  }

  // 清空状态
  const clearMerchantInfo = () => {
    merchantInfo.value = null
  }

  return {
    // 状态
    merchantInfo,
    loading,
    submitting,

    // 计算属性
    isMerchant,
    merchantStatus,
    canApply,

    // 方法
    getMyMerchantInfo,
    uploadLicense,
    applyMerchant,
    updateMerchantInfo,
    clearMerchantInfo,
  }
})

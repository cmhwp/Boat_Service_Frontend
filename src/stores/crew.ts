import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  applyCrewApiV1CrewApplyPost,
  getMyCrewInfoApiV1CrewMeGet,
  getMyCrewApplicationsApiV1CrewMyApplicationsGet,
  resignCrewApiV1CrewResignPost,
} from '@/services/api/crew'

export const useCrewStore = defineStore('crew', () => {
  // 状态
  const crewInfo = ref<API.CrewDetailSchema | null>(null)
  const applications = ref<API.CrewApplicationDetailSchema[]>([])
  const loading = ref(false)
  const submitting = ref(false)

  // 计算属性
  const isCrew = computed(() => !!crewInfo.value)
  const crewStatus = computed(() => crewInfo.value?.status || null)
  const canApply = computed(() => !crewInfo.value || crewInfo.value.status === 'inactive')

  // 获取我的船员信息
  const getMyCrewInfo = async () => {
    loading.value = true
    try {
      const response = await getMyCrewInfoApiV1CrewMeGet()

      if (response.data?.success && response.data?.data) {
        crewInfo.value = response.data.data
        return { success: true, data: response.data.data }
      } else {
        // 如果没有船员记录，不算错误
        crewInfo.value = null
        return { success: true, data: null }
      }
    } catch (error: unknown) {
      console.error('Get crew info failed:', error)
      const errorMessage = (error as any)?.response?.data?.message || '获取船员信息失败'
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // 获取我的申请列表
  const getMyApplications = async (params: { page?: number; page_size?: number } = {}) => {
    loading.value = true
    try {
      const response = await getMyCrewApplicationsApiV1CrewMyApplicationsGet({
        page: params.page || 1,
        page_size: params.page_size || 10,
      })

      if (response.data?.success && response.data?.data) {
        applications.value = response.data.data.items
        return { success: true, data: response.data.data }
      } else {
        const errorMessage = response.data?.message || '获取申请列表失败'
        return { success: false, error: errorMessage }
      }
    } catch (error: unknown) {
      console.error('Get applications failed:', error)
      const errorMessage = (error as any)?.response?.data?.message || '获取申请列表失败'
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // 申请成为船员
  const applyCrew = async (merchantId: number) => {
    submitting.value = true
    try {
      const response = await applyCrewApiV1CrewApplyPost({
        merchant_id: merchantId,
      })

      if (response.data?.success && response.data?.data) {
        ElMessage.success('船员申请提交成功，请等待商家审核')
        // 刷新申请列表
        await getMyApplications()
        return { success: true, data: response.data.data }
      } else {
        const errorMessage = response.data?.message || '船员申请失败'
        ElMessage.error(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error: unknown) {
      console.error('Apply crew failed:', error)
      const errorMessage = (error as any)?.response?.data?.message || '船员申请失败'
      ElMessage.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      submitting.value = false
    }
  }

  // 船员离职
  const resignCrew = async () => {
    submitting.value = true
    try {
      const response = await resignCrewApiV1CrewResignPost()

      if (response.data?.success) {
        crewInfo.value = null
        ElMessage.success('船员离职成功')
        return { success: true }
      } else {
        const errorMessage = response.data?.message || '船员离职失败'
        ElMessage.error(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error: unknown) {
      console.error('Resign crew failed:', error)
      const errorMessage = (error as any)?.response?.data?.message || '船员离职失败'
      ElMessage.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      submitting.value = false
    }
  }

  // 清空状态
  const clearCrewInfo = () => {
    crewInfo.value = null
    applications.value = []
  }

  return {
    // 状态
    crewInfo,
    applications,
    loading,
    submitting,

    // 计算属性
    isCrew,
    crewStatus,
    canApply,

    // 方法
    getMyCrewInfo,
    getMyApplications,
    applyCrew,
    resignCrew,
    clearCrewInfo,
  }
})

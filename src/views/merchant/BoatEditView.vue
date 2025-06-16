<template>
  <div class="boat-edit-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-breadcrumb>
        <el-breadcrumb-item to="/merchant/dashboard">管理台</el-breadcrumb-item>
        <el-breadcrumb-item to="/merchant/boats">我的船艇</el-breadcrumb-item>
        <el-breadcrumb-item>编辑船艇</el-breadcrumb-item>
      </el-breadcrumb>
      <h1 class="page-title">编辑船艇</h1>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>

    <!-- 表单内容 -->
    <div v-else-if="boat" class="form-container">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        size="large"
        @submit.prevent="handleSubmit"
      >
        <el-card class="form-card" shadow="never">
          <template #header>
            <h3>基本信息</h3>
          </template>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="船艇名称" prop="name" required>
                <el-input
                  v-model="form.name"
                  placeholder="请输入船艇名称"
                  maxlength="100"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="证书号" prop="license_number">
                <el-input v-model="boat.license_number" placeholder="证书号" disabled />
                <span class="form-help">证书号不可修改</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="船艇类型" prop="boat_type" required>
                <el-select
                  v-model="form.boat_type"
                  placeholder="请选择船艇类型"
                  style="width: 100%"
                >
                  <el-option label="客运船" value="passenger" />
                  <el-option label="观光船" value="sightseeing" />
                  <el-option label="钓鱼船" value="fishing" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="载客量" prop="capacity" required>
                <el-input-number
                  v-model="form.capacity"
                  :min="1"
                  :max="100"
                  placeholder="请输入载客量"
                  style="width: 100%"
                />
                <span class="form-help">单位：人</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="小时费率" prop="hourly_rate" required>
                <el-input-number
                  v-model="form.hourly_rate"
                  :min="0"
                  :precision="2"
                  placeholder="请输入小时费率"
                  style="width: 100%"
                />
                <span class="form-help">单位：元/小时</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="当前位置" prop="current_location">
                <el-input
                  v-model="form.current_location"
                  placeholder="请输入当前位置"
                  maxlength="200"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="状态" prop="status" required>
                <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
                  <el-option label="可用" value="available" />
                  <el-option label="维护中" value="maintenance" />
                  <el-option label="停用" value="inactive" />
                </el-select>
                <span class="form-help">使用中状态由系统自动管理</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="船艇描述" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="4"
              placeholder="请输入船艇描述信息，包括设施、特色等"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
        </el-card>

        <el-card class="form-card" shadow="never">
          <template #header>
            <h3>船艇图片</h3>
          </template>

          <el-form-item label="上传图片" prop="images">
            <div class="upload-container">
              <el-upload
                ref="uploadRef"
                :file-list="fileList"
                :on-remove="handleRemove"
                :before-upload="beforeUpload"
                :http-request="handleManualUpload"
                list-type="picture-card"
                accept="image/*"
                :limit="10"
              >
                <el-icon class="upload-icon"><plus /></el-icon>
                <template #tip>
                  <div class="upload-tip">
                    <p>支持 jpg、jpeg、png、gif、webp 格式，单张图片不超过 10MB</p>
                    <p>最多可上传 10 张图片，建议上传清晰的船艇照片</p>
                  </div>
                </template>
              </el-upload>
            </div>
          </el-form-item>
        </el-card>

        <!-- 提交按钮 -->
        <div class="form-actions">
          <el-button size="large" @click="handleCancel">取消</el-button>
          <el-button type="primary" size="large" :loading="submitLoading" @click="handleSubmit">
            {{ submitLoading ? '保存中...' : '保存修改' }}
          </el-button>
        </div>
      </el-form>
    </div>

    <!-- 数据加载失败 -->
    <div v-else class="error-state">
      <el-result icon="error" title="加载失败" sub-title="无法加载船艇信息，请检查网络连接">
        <template #extra>
          <el-button type="primary" @click="fetchBoatDetail">重新加载</el-button>
          <el-button @click="handleCancel">返回列表</el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules, UploadProps, UploadUserFile } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  getMyBoatDetailApiV1BoatsMyBoatIdGet,
  updateMyBoatApiV1BoatsMyBoatIdPut,
  uploadBoatImageApiV1BoatsUploadImagePost,
} from '@/services/api/boats'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 获取路由参数中的船艇ID
const boatId = computed(() => Number(route.params.id))

// 表单引用
const formRef = ref<FormInstance>()
const uploadRef = ref()

// 响应式数据
const loading = ref(false)
const submitLoading = ref(false)
const boat = ref<API.BoatDetailSchema | null>(null)

// 表单数据
const form = reactive<API.BoatUpdateSchema>({
  name: '',
  boat_type: 'sightseeing',
  capacity: 10,
  hourly_rate: 100,
  description: '',
  current_location: '',
  status: 'available',
  images: [],
})

// 文件列表
const fileList = ref<UploadUserFile[]>([])

// 表单验证规则
const rules: FormRules = {
  name: [
    { required: true, message: '请输入船艇名称', trigger: 'blur' },
    { min: 2, max: 100, message: '船艇名称长度在 2 到 100 个字符', trigger: 'blur' },
  ],
  boat_type: [{ required: true, message: '请选择船艇类型', trigger: 'change' }],
  capacity: [
    { required: true, message: '请输入载客量', trigger: 'blur' },
    { type: 'number', min: 1, max: 100, message: '载客量必须在 1 到 100 之间', trigger: 'blur' },
  ],
  hourly_rate: [
    { required: true, message: '请输入小时费率', trigger: 'blur' },
    { type: 'number', min: 0, message: '小时费率必须大于 0', trigger: 'blur' },
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

// 获取船艇详情
const fetchBoatDetail = async () => {
  try {
    loading.value = true
    const response = await getMyBoatDetailApiV1BoatsMyBoatIdGet({ boat_id: boatId.value })

    if (response.data.success && response.data) {
      boat.value = response.data.data ?? null

      // 填充表单数据
      form.name = response.data.data?.name
      form.boat_type = response.data.data?.boat_type
      form.capacity = response.data.data?.capacity
      form.hourly_rate = response.data.data?.hourly_rate
      form.description = response.data.data?.description
      form.current_location = response.data.data?.current_location
      form.status = response.data.data?.status
      form.images = response.data.data?.images || []

      // 设置文件列表
      if (response.data.data?.images && response.data.data?.images.length > 0) {
        fileList.value = response.data.data?.images.map((url, index) => ({
          name: `image-${index}`,
          url: url,
          uid: -index - 1,
          status: 'success',
        }))
      }
    } else {
      ElMessage.error('获取船艇信息失败')
    }
  } catch (error) {
    console.error('获取船艇详情失败:', error)
    ElMessage.error('获取船艇信息失败')
  } finally {
    loading.value = false
  }
}

// 上传前校验
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(
    file.type,
  )
  if (!isValidType) {
    ElMessage.error('只能上传 jpg、jpeg、png、gif、webp 格式的图片')
    return false
  }

  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isLt10M) {
    ElMessage.error('图片大小不能超过 10MB')
    return false
  }

  return true
}

// 手动上传处理
const handleManualUpload = async (options: any) => {
  try {
    const response = await uploadBoatImageApiV1BoatsUploadImagePost(
      { file: options.file },
      options.file,
    )

    if (response.data.success && response.data.data?.url) {
      form.images = form.images || []
      form.images.push(response.data.data.url)

      // 更新文件状态为成功
      options.onSuccess(response.data, options.file)
      ElMessage.success('图片上传成功')
    } else {
      options.onError(new Error('上传失败'), options.file)
      ElMessage.error('图片上传失败')
    }
  } catch (error) {
    console.error('图片上传失败:', error)
    options.onError(error, options.file)
    ElMessage.error('图片上传失败，请重试')
  }
}

// 移除图片处理
const handleRemove: UploadProps['onRemove'] = (file) => {
  const response = file.response as any
  if (response?.data?.url) {
    const url = response.data.url
    const index = form.images?.indexOf(url)
    if (index !== undefined && index > -1) {
      form.images?.splice(index, 1)
    }
  } else if (file.url) {
    // 移除已存在的图片
    const index = form.images?.indexOf(file.url)
    if (index !== undefined && index > -1) {
      form.images?.splice(index, 1)
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    await ElMessageBox.confirm('确定要保存修改吗？', '确认保存', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    })

    submitLoading.value = true

    const response = await updateMyBoatApiV1BoatsMyBoatIdPut({ boat_id: boatId.value }, form)

    if (response.data.success) {
      ElMessage.success('船艇信息更新成功')
      router.push('/merchant/boats')
    } else {
      ElMessage.error(response.data.message || '更新失败')
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('更新船艇失败:', error)
      ElMessage.error('更新失败，请检查网络连接')
    }
  } finally {
    submitLoading.value = false
  }
}

// 取消操作
const handleCancel = async () => {
  try {
    await ElMessageBox.confirm('确定要取消吗？未保存的修改将丢失', '确认取消', {
      confirmButtonText: '确定',
      cancelButtonText: '继续编辑',
      type: 'warning',
    })
    router.push('/merchant/boats')
  } catch {
    // 用户取消操作
  }
}

// 页面加载时获取数据
onMounted(() => {
  if (boatId.value) {
    fetchBoatDetail()
  } else {
    ElMessage.error('无效的船艇ID')
    router.push('/merchant/boats')
  }
})
</script>

<style scoped>
.boat-edit-view {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  margin: 8px 0 0 0;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.loading-container {
  margin-top: 24px;
}

.form-container {
  max-width: 1000px;
}

.form-card {
  margin-bottom: 24px;
}

.form-card :deep(.el-card__header) {
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.form-card :deep(.el-card__header h3) {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.form-card :deep(.el-card__body) {
  padding: 24px;
}

.form-help {
  font-size: 12px;
  color: #6b7280;
  margin-left: 8px;
}

.upload-container {
  width: 100%;
}

.upload-container :deep(.el-upload-list--picture-card) {
  --el-upload-list-picture-card-size: 120px;
}

.upload-container :deep(.el-upload--picture-card) {
  --el-upload-picture-card-size: 120px;
}

.upload-icon {
  font-size: 28px;
  color: #8c939d;
}

.upload-tip {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
  margin-top: 8px;
}

.upload-tip p {
  margin: 4px 0;
}

.form-actions {
  margin-top: 32px;
  text-align: center;
  padding: 24px 0;
  border-top: 1px solid #e2e8f0;
}

.form-actions .el-button {
  min-width: 120px;
  margin: 0 8px;
}

.error-state {
  margin-top: 48px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .boat-edit-view {
    padding: 16px;
  }

  .form-container {
    max-width: 100%;
  }

  .form-card :deep(.el-card__body) {
    padding: 16px;
  }

  .upload-container :deep(.el-upload-list--picture-card) {
    --el-upload-list-picture-card-size: 100px;
  }

  .upload-container :deep(.el-upload--picture-card) {
    --el-upload-picture-card-size: 100px;
  }
}
</style>

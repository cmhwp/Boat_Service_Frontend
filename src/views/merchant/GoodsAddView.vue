<template>
  <div class="goods-add-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-breadcrumb>
        <el-breadcrumb-item to="/merchant/dashboard">管理台</el-breadcrumb-item>
        <el-breadcrumb-item to="/merchant/goods">商品列表</el-breadcrumb-item>
        <el-breadcrumb-item>添加商品</el-breadcrumb-item>
      </el-breadcrumb>
      <h1 class="page-title">添加商品</h1>
    </div>

    <!-- 表单内容 -->
    <div class="form-container">
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
              <el-form-item label="商品名称" prop="name" required>
                <el-input
                  v-model="form.name"
                  placeholder="请输入商品名称"
                  maxlength="100"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商品分类" prop="category" required>
                <el-select v-model="form.category" placeholder="请选择商品分类" style="width: 100%">
                  <el-option label="水果" value="fruit" />
                  <el-option label="蔬菜" value="vegetable" />
                  <el-option label="粮食" value="grain" />
                  <el-option label="海鲜" value="seafood" />
                  <el-option label="其他" value="other" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="商品价格" prop="price" required>
                <el-input-number
                  v-model="form.price"
                  :min="0"
                  :precision="2"
                  placeholder="请输入商品价格"
                  style="width: 100%"
                />
                <span class="form-help">单位：元</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="库存数量" prop="stock" required>
                <el-input-number
                  v-model="form.stock"
                  :min="0"
                  :max="99999"
                  placeholder="请输入库存数量"
                  style="width: 100%"
                />
                <span class="form-help">大于等于0</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="计量单位" prop="unit" required>
                <el-input
                  v-model="form.unit"
                  placeholder="请输入计量单位，如：斤、个、袋等"
                  maxlength="10"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="商品描述" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="4"
              placeholder="请输入商品描述信息，包括特色、产地、品质等"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
        </el-card>

        <el-card class="form-card" shadow="never">
          <template #header>
            <h3>商品图片</h3>
          </template>

          <el-form-item label="上传图片" prop="images">
            <div class="upload-container">
              <el-upload
                ref="uploadRef"
                :action="uploadAction"
                :headers="uploadHeaders"
                :file-list="fileList"
                :on-success="handleUploadSuccess"
                :on-error="handleUploadError"
                :on-remove="handleRemove"
                :before-upload="beforeUpload"
                list-type="picture-card"
                accept="image/*"
                :limit="10"
              >
                <el-icon class="upload-icon"><plus /></el-icon>
                <template #tip>
                  <div class="upload-tip">
                    <p>支持 jpg、jpeg、png、gif、webp 格式，单张图片不超过 10MB</p>
                    <p>最多可上传 10 张图片，建议上传清晰的商品照片</p>
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
            {{ submitLoading ? '创建中...' : '创建商品' }}
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules, UploadProps, UploadUserFile } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  createProductApiV1ProductsPost,
  uploadProductImageApiV1ProductsUploadImagePost,
} from '@/services/api/products'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// 表单引用
const formRef = ref<FormInstance>()
const uploadRef = ref()

// 表单数据
const form = reactive<API.ProductCreateSchema>({
  name: '',
  category: 'other',
  description: '',
  price: 0,
  stock: 0,
  unit: '份',
  images: [],
})

// 文件列表
const fileList = ref<UploadUserFile[]>([])

// 提交状态
const submitLoading = ref(false)

// 上传配置
const uploadAction = computed(() => '/api/v1/products/upload-image')
const uploadHeaders = computed(() => ({
  Authorization: `Bearer ${authStore.token}`,
}))

// 表单验证规则
const rules: FormRules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 100, message: '商品名称长度在 2 到 100 个字符', trigger: 'blur' },
  ],
  category: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '商品价格必须大于 0', trigger: 'blur' },
  ],
  stock: [
    { required: true, message: '请输入库存数量', trigger: 'blur' },
    { type: 'number', min: 0, message: '库存数量不能小于 0', trigger: 'blur' },
  ],
  unit: [
    { required: true, message: '请输入计量单位', trigger: 'blur' },
    { min: 1, max: 10, message: '计量单位长度在 1 到 10 个字符', trigger: 'blur' },
  ],
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

// 上传成功处理
const handleUploadSuccess: UploadProps['onSuccess'] = (response, file) => {
  if (response.data.success && response.data.data?.url) {
    form.images = form.images || []
    form.images.push(response.data.data.url)
    ElMessage.success('图片上传成功')
  } else {
    ElMessage.error('图片上传失败')
    // 从文件列表中移除失败的文件
    const index = fileList.value.findIndex((f) => f.uid === file.uid)
    if (index > -1) {
      fileList.value.splice(index, 1)
    }
  }
}

// 上传失败处理
const handleUploadError: UploadProps['onError'] = (error, file) => {
  console.error('图片上传失败:', error)
  ElMessage.error('图片上传失败，请重试')
  // 从文件列表中移除失败的文件
  const index = fileList.value.findIndex((f) => f.uid === file.uid)
  if (index > -1) {
    fileList.value.splice(index, 1)
  }
}

// 移除图片处理
const handleRemove: UploadProps['onRemove'] = (file) => {
  if (file.response?.data?.data?.url) {
    const url = file.response.data.data.url
    const index = form.images?.indexOf(url)
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

    await ElMessageBox.confirm('确定要创建这个商品吗？', '确认创建', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    })

    submitLoading.value = true

    const response = await createProductApiV1ProductsPost(form)

    if (response.data.success) {
      ElMessage.success('商品创建成功')
      router.push('/merchant/goods')
    } else {
      ElMessage.error(response.data.message || '创建失败')
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('创建商品失败:', error)
      ElMessage.error('创建失败，请检查网络连接')
    }
  } finally {
    submitLoading.value = false
  }
}

// 取消操作
const handleCancel = async () => {
  try {
    await ElMessageBox.confirm('确定要取消吗？未保存的数据将丢失', '确认取消', {
      confirmButtonText: '确定',
      cancelButtonText: '继续编辑',
      type: 'warning',
    })
    router.push('/merchant/goods')
  } catch {
    // 用户取消操作
  }
}
</script>

<style scoped>
.goods-add-view {
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

/* 响应式设计 */
@media (max-width: 768px) {
  .goods-add-view {
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

<template>
  <el-dialog v-model="dialogVisible" title="申请商家认证" width="700px" :before-close="handleClose">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
      <el-form-item label="商家名称" prop="merchant_name">
        <el-input
          v-model="formData.merchant_name"
          placeholder="请输入商家名称"
          maxlength="100"
          show-word-limit
          :disabled="loading"
        />
      </el-form-item>

      <el-form-item label="营业执照号" prop="license_number">
        <el-input
          v-model="formData.license_number"
          placeholder="请输入营业执照号"
          maxlength="50"
          show-word-limit
          :disabled="loading"
        />
      </el-form-item>

      <el-form-item label="营业执照" prop="license_image" required>
        <div class="upload-container">
          <el-upload
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-change="handleLicenseChange"
            accept="image/*"
            :disabled="loading"
          >
            <div class="upload-area">
              <img v-if="licenseImageUrl" :src="licenseImageUrl" class="license-image" />
              <div v-else class="upload-placeholder">
                <el-icon><plus /></el-icon>
                <div class="upload-text">点击上传营业执照</div>
                <div class="upload-tip">支持 jpg、png、gif、webp 格式，最大 10MB</div>
              </div>
            </div>
          </el-upload>
        </div>
      </el-form-item>

      <el-form-item label="联系电话" prop="contact_phone">
        <el-input
          v-model="formData.contact_phone"
          placeholder="请输入联系电话"
          maxlength="20"
          :disabled="loading"
        />
      </el-form-item>

      <el-form-item label="地址" prop="address">
        <el-input
          v-model="formData.address"
          type="textarea"
          placeholder="请输入详细地址"
          maxlength="255"
          show-word-limit
          :rows="3"
          :disabled="loading"
        />
      </el-form-item>

      <el-form-item label="商家描述" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          placeholder="请简要描述您的商家特色和经营范围"
          maxlength="1000"
          show-word-limit
          :rows="4"
          :disabled="loading"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" :disabled="loading">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading"> 提交申请 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import {
  ElMessage,
  type FormInstance,
  type FormRules,
  type UploadProps,
  type UploadFile,
} from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useMerchantStore } from '@/stores/merchant'

// Props
interface Props {
  visible: boolean
  loading: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  loading: false,
})

// Emits
const emit = defineEmits<{
  'update:visible': [value: boolean]
  submit: [data: API.MerchantApplySchema]
}>()

const merchantStore = useMerchantStore()

// 响应式数据
const formRef = ref<FormInstance>()
const licenseImageUrl = ref('')
const uploadingLicense = ref(false)

// 表单数据
const formData = reactive({
  merchant_name: '',
  license_number: '',
  license_image: '',
  contact_phone: '',
  address: '',
  description: '',
})

// 表单验证规则
const formRules: FormRules = {
  merchant_name: [
    { required: true, message: '请输入商家名称', trigger: 'blur' },
    { min: 2, max: 100, message: '商家名称长度在 2 到 100 个字符', trigger: 'blur' },
  ],
  license_number: [
    { required: true, message: '请输入营业执照号', trigger: 'blur' },
    { min: 1, max: 50, message: '营业执照号不能超过 50 个字符', trigger: 'blur' },
  ],
  license_image: [{ required: true, message: '请上传营业执照', trigger: 'change' }],
  contact_phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
  address: [{ max: 255, message: '地址不能超过 255 个字符', trigger: 'blur' }],
  description: [{ max: 1000, message: '描述不能超过 1000 个字符', trigger: 'blur' }],
}

// 计算属性
const dialogVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value),
})

// 监听弹窗显示状态
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      resetForm()
    }
  },
)

// 图片上传相关
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const isImage = rawFile.type.startsWith('image/')
  const isLt10M = rawFile.size / 1024 / 1024 < 10

  if (!isImage) {
    ElMessage.error('请上传图片文件!')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('图片大小不能超过10MB!')
    return false
  }
  return true
}

const handleLicenseChange = async (file: UploadFile) => {
  if (!file.raw) return

  uploadingLicense.value = true
  try {
    const result = await merchantStore.uploadLicense(file.raw)
    if (result.success) {
      formData.license_image = result.data!.url
      licenseImageUrl.value = result.data!.url
      // 手动触发表单验证
      formRef.value?.validateField('license_image')
      ElMessage.success('营业执照上传成功')
    }
  } catch (error) {
    ElMessage.error('上传失败，请重试')
  } finally {
    uploadingLicense.value = false
  }
}

// 方法
const resetForm = () => {
  Object.assign(formData, {
    merchant_name: '',
    license_number: '',
    license_image: '',
    contact_phone: '',
    address: '',
    description: '',
  })
  licenseImageUrl.value = ''
  formRef.value?.resetFields()
}

const handleClose = () => {
  if (props.loading || uploadingLicense.value) {
    ElMessage.warning('正在处理中，请稍候...')
    return
  }

  dialogVisible.value = false
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    const submitData: API.MerchantApplySchema = {
      merchant_name: formData.merchant_name,
      license_number: formData.license_number,
      license_image: formData.license_image,
      contact_phone: formData.contact_phone,
      address: formData.address || null,
      description: formData.description || null,
    }

    emit('submit', submitData)
  } catch (error) {
    ElMessage.error('请检查表单信息')
  }
}
</script>

<style scoped>
.upload-container {
  width: 100%;
}

.upload-area {
  width: 100%;
  height: 200px;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

.upload-area:hover {
  border-color: #1890ff;
}

.license-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
}

.upload-placeholder .el-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.upload-text {
  font-size: 16px;
  margin-bottom: 4px;
}

.upload-tip {
  font-size: 12px;
  color: #ccc;
}

.dialog-footer {
  text-align: right;
  padding-top: 20px;
}
</style>

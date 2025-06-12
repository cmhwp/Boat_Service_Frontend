<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEditMode ? '修改实名认证' : '申请实名认证'"
    width="600px"
    :before-close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="真实姓名" prop="real_name">
        <el-input
          v-model="formData.real_name"
          placeholder="请输入真实姓名"
          :disabled="loading"
        />
      </el-form-item>

      <el-form-item label="身份证号" prop="id_card">
        <el-input
          v-model="formData.id_card"
          placeholder="请输入18位身份证号"
          :disabled="loading"
        />
      </el-form-item>

      <el-form-item label="身份证正面" prop="front_image" required>
        <div class="image-upload-container">
          <el-upload
            :show-file-list="false"
            :before-upload="beforeImageUpload"
            :on-change="handleFrontImageChange"
            accept="image/*"
            :disabled="loading"
          >
            <div class="upload-area">
              <img v-if="frontImageUrl" :src="frontImageUrl" class="uploaded-image" />
              <div v-else class="upload-placeholder">
                <el-icon><plus /></el-icon>
                <div class="upload-text">点击上传身份证正面</div>
              </div>
            </div>
          </el-upload>
        </div>
      </el-form-item>

      <el-form-item label="身份证背面" prop="back_image" required>
        <div class="image-upload-container">
          <el-upload
            :show-file-list="false"
            :before-upload="beforeImageUpload"
            :on-change="handleBackImageChange"
            accept="image/*"
            :disabled="loading"
          >
            <div class="upload-area">
              <img v-if="backImageUrl" :src="backImageUrl" class="uploaded-image" />
              <div v-else class="upload-placeholder">
                <el-icon><plus /></el-icon>
                <div class="upload-text">点击上传身份证背面</div>
              </div>
            </div>
          </el-upload>
        </div>
      </el-form-item>

      <el-form-item>
        <el-alert type="info" :closable="false" show-icon>
          <template #title>
            <div class="tips-content">
              <p><strong>注意事项：</strong></p>
              <ul>
                <li>请确保身份证照片清晰完整，四角完整可见</li>
                <li>照片格式支持 JPG、PNG，单张图片不超过 10MB</li>
                <li>请使用本人真实身份证件，虚假信息将被拒绝</li>
                <li>认证信息提交后无法修改，请仔细核对</li>
              </ul>
            </div>
          </template>
        </el-alert>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" :disabled="loading">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
          :loading="loading"
        >
          {{ isEditMode ? '更新' : '提交申请' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, type PropType } from 'vue'
import { ElMessage, type FormInstance, type UploadProps, type UploadFile } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// Props
interface Props {
  visible: boolean
  editData?: API.RealnameAuthResponseSchema | null
  loading: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  editData: null,
  loading: false
})

// Emits
const emit = defineEmits<{
  'update:visible': [value: boolean]
  'submit': [data: any]
}>()

// 响应式数据
const formRef = ref<FormInstance>()
const frontImageUrl = ref('')
const backImageUrl = ref('')

// 表单数据
const formData = reactive({
  real_name: '',
  id_card: '',
  front_image: undefined as File | undefined,
  back_image: undefined as File | undefined,
})

// 身份证号校验函数
const validateIdCard = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('请输入身份证号'))
    return
  }

  // 基本长度检查
  if (value.length !== 18) {
    callback(new Error('身份证号必须是18位'))
    return
  }

  // 基本格式检查
  const idCardPattern = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  if (!idCardPattern.test(value)) {
    callback(new Error('请输入正确格式的18位身份证号'))
    return
  }

  // 更严格的身份证号校验（包含校验码验证）
  const validateIdCardChecksum = (idCard: string): boolean => {
    const coefficients = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']

    let sum = 0
    for (let i = 0; i < 17; i++) {
      sum += parseInt(idCard[i]) * coefficients[i]
    }

    const checkIndex = sum % 11
    const expectedCheckCode = checkCodes[checkIndex]
    const actualCheckCode = idCard[17].toUpperCase()

    return actualCheckCode === expectedCheckCode
  }

  if (!validateIdCardChecksum(value)) {
    callback(new Error('身份证号校验码不正确，请检查输入'))
    return
  }

  callback()
}

// 表单验证规则
const formRules = {
  real_name: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
    { min: 2, max: 50, message: '姓名长度在 2 到 50 个字符', trigger: 'blur' },
    { pattern: /^[\u4e00-\u9fa5·]+$/, message: '姓名只能包含中文和·符号', trigger: 'blur' },
  ],
  id_card: [
    { required: true, validator: validateIdCard, trigger: 'blur' },
  ],
}

// 计算属性
const dialogVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value)
})

const isEditMode = computed(() => !!props.editData)

// 图片上传相关
const beforeImageUpload: UploadProps['beforeUpload'] = (rawFile) => {
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

const handleFrontImageChange = (file: UploadFile) => {
  if (file.raw) {
    formData.front_image = file.raw
    frontImageUrl.value = URL.createObjectURL(file.raw)
  }
}

const handleBackImageChange = (file: UploadFile) => {
  if (file.raw) {
    formData.back_image = file.raw
    backImageUrl.value = URL.createObjectURL(file.raw)
  }
}

// 方法
const resetForm = () => {
  Object.assign(formData, {
    real_name: '',
    id_card: '',
    front_image: undefined,
    back_image: undefined,
  })
  frontImageUrl.value = ''
  backImageUrl.value = ''
  formRef.value?.resetFields()
}

const loadEditData = () => {
  if (props.editData) {
    formData.real_name = props.editData.real_name
    formData.id_card = props.editData.id_card
    frontImageUrl.value = props.editData.front_image
    backImageUrl.value = props.editData.back_image
  }
}

const handleClose = () => {
  if (props.loading) {
    ElMessage.warning('正在处理中，请稍候...')
    return
  }

  dialogVisible.value = false
  resetForm()
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    // 检查是否上传了图片（编辑模式下如果已有图片则不强制要求重新上传）
    if (!isEditMode.value) {
      if (!formData.front_image) {
        ElMessage.error('请上传身份证正面照片')
        return
      }
      if (!formData.back_image) {
        ElMessage.error('请上传身份证背面照片')
        return
      }
    }

    emit('submit', { ...formData })
  } catch (error) {
    console.error('Form validation failed:', error)
  }
}

// 监听 visible 变化，打开时加载编辑数据
watch(() => props.visible, (newValue) => {
  if (newValue) {
    if (isEditMode.value) {
      loadEditData()
    } else {
      resetForm()
    }
  }
})
</script>

<style scoped>
.image-upload-container {
  width: 100%;
}

.upload-area {
  width: 200px;
  height: 120px;
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

.upload-area:hover {
  border-color: #409eff;
}

.uploaded-image {
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
  color: #8c939d;
}

.upload-text {
  margin-top: 8px;
  font-size: 12px;
}

.tips-content ul {
  margin: 8px 0 0 0;
  padding-left: 20px;
}

.tips-content li {
  margin-bottom: 4px;
  font-size: 13px;
  line-height: 1.4;
}

.dialog-footer {
  text-align: right;
}

:deep(.el-upload) {
  width: 100%;
}
</style>
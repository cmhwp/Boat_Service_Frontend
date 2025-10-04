<template>
  <el-dialog
    v-model="visible"
    title="评价商品"
    width="600px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="商品质量" prop="quality_rating">
        <el-rate
          v-model="form.quality_rating"
          :texts="['非常差', '差', '一般', '好', '非常好']"
          show-text
        />
      </el-form-item>

      <el-form-item label="新鲜程度" prop="freshness_rating">
        <el-rate
          v-model="form.freshness_rating"
          :texts="['非常差', '差', '一般', '好', '非常好']"
          show-text
        />
      </el-form-item>

      <el-form-item label="包装评分" prop="packaging_rating">
        <el-rate
          v-model="form.packaging_rating"
          :texts="['非常差', '差', '一般', '好', '非常好']"
          show-text
        />
      </el-form-item>

      <el-form-item label="评价内容">
        <el-input
          v-model="form.comment"
          type="textarea"
          :rows="4"
          maxlength="500"
          show-word-limit
          placeholder="分享您的购买体验..."
        />
      </el-form-item>

      <el-form-item label="评价标签">
        <div class="tags-container">
          <el-tag
            v-for="tag in form.tags"
            :key="tag"
            closable
            class="tag-item"
            @close="removeTag(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="showTagInput"
            ref="tagInputRef"
            v-model="newTag"
            size="small"
            style="width: 100px"
            @keyup.enter="addTag"
            @blur="addTag"
          />
          <el-button
            v-else
            size="small"
            @click="showTagInput = true"
          >
            + 添加标签
          </el-button>
        </div>
        <div class="preset-tags">
          <span class="preset-label">常用标签：</span>
          <el-tag
            v-for="tag in presetTags"
            :key="tag"
            size="small"
            class="preset-tag"
            @click="addPresetTag(tag)"
          >
            {{ tag }}
          </el-tag>
        </div>
      </el-form-item>

      <el-form-item label="匿名评价">
        <el-switch v-model="form.is_anonymous" />
        <span class="help-text">开启后，您的用户名将不会显示</span>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">
        提交评价
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { createProductReviewApiV1ReviewsProductPost } from '@/services/api/pingjiaguanli'

const emit = defineEmits(['success'])

const visible = ref(false)
const formRef = ref<FormInstance>()
const submitting = ref(false)

const form = reactive({
  order_id: 0,
  order_item_id: 0,
  quality_rating: 5,
  freshness_rating: 5,
  packaging_rating: 5,
  comment: '',
  tags: [] as string[],
  is_anonymous: false
})

const rules: FormRules = {
  quality_rating: [
    { required: true, message: '请评分', trigger: 'change' }
  ],
  freshness_rating: [
    { required: true, message: '请评分', trigger: 'change' }
  ],
  packaging_rating: [
    { required: true, message: '请评分', trigger: 'change' }
  ]
}

// 标签相关
const showTagInput = ref(false)
const newTag = ref('')
const tagInputRef = ref()
const presetTags = ['新鲜', '好吃', '实惠', '包装好', '分量足', '正宗', '有机']

function open(orderId: number, orderItemId: number) {
  form.order_id = orderId
  form.order_item_id = orderItemId
  visible.value = true
}

function handleClose() {
  formRef.value?.resetFields()
  form.comment = ''
  form.tags = []
  form.quality_rating = 5
  form.freshness_rating = 5
  form.packaging_rating = 5
  form.is_anonymous = false
}

function removeTag(tag: string) {
  form.tags = form.tags.filter(t => t !== tag)
}

function addTag() {
  const tag = newTag.value.trim()
  if (tag && !form.tags.includes(tag) && form.tags.length < 5) {
    form.tags.push(tag)
  }
  newTag.value = ''
  showTagInput.value = false
}

function addPresetTag(tag: string) {
  if (!form.tags.includes(tag) && form.tags.length < 5) {
    form.tags.push(tag)
  }
}

async function handleSubmit() {
  await formRef.value?.validate()

  submitting.value = true
  try {
    await createProductReviewApiV1ReviewsProductPost(form as any)
    ElMessage.success('评价提交成功！')
    visible.value = false
    emit('success')
  } catch (error: any) {
    ElMessage.error(error.message || '提交失败，请重试')
  } finally {
    submitting.value = false
  }
}

defineExpose({ open })
</script>

<style scoped>
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.tag-item {
  margin: 0;
}

.preset-tags {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.preset-label {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.preset-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.preset-tag:hover {
  transform: scale(1.05);
}

.help-text {
  margin-left: 12px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
</style>


<template>
  <div class="auth-card">
    <div class="auth-card-header" v-if="$slots.header">
      <slot name="header"></slot>
    </div>

    <div class="auth-card-body">
      <slot></slot>
    </div>

    <div class="auth-card-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// 组件属性
interface Props {
  loading?: boolean
  shadow?: 'light' | 'medium' | 'heavy'
}

withDefaults(defineProps<Props>(), {
  loading: false,
  shadow: 'medium',
})
</script>

<style scoped>
.auth-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 2rem;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.auth-card.shadow-light {
  box-shadow:
    0 10px 20px rgba(24, 144, 255, 0.08),
    0 4px 8px rgba(0, 0, 0, 0.03);
}

.auth-card.shadow-medium {
  box-shadow:
    0 20px 40px rgba(24, 144, 255, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.05);
}

.auth-card.shadow-heavy {
  box-shadow:
    0 30px 60px rgba(24, 144, 255, 0.15),
    0 12px 24px rgba(0, 0, 0, 0.08);
}

.auth-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #1890ff, #52c41a, #faad14);
  border-radius: 24px 24px 0 0;
}

.auth-card-header {
  margin-bottom: 2rem;
  text-align: center;
}

.auth-card-body {
  position: relative;
}

.auth-card-footer {
  margin-top: 2rem;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .auth-card {
    border-radius: 16px;
    padding: 1.5rem;
  }
}

/* 动画效果 */
.auth-card {
  animation: cardFadeIn 0.6s ease-out;
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 加载状态 */
.auth-card.loading {
  pointer-events: none;
  opacity: 0.8;
}

.auth-card.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
</style>

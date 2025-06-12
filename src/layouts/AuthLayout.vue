<template>
  <div class="auth-layout">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="wave wave-1"></div>
      <div class="wave wave-2"></div>
      <div class="wave wave-3"></div>
    </div>

    <!-- 主要内容区域 -->
    <div class="auth-container">
      <!-- 左侧装饰区域 -->
      <div class="auth-sidebar">
        <div class="brand-section">
          <div class="brand-icon">
            <ship theme="outline" size="48" fill="#1890ff" />
          </div>
          <h1 class="brand-title">绿色智能船艇</h1>
          <h2 class="brand-subtitle">农文旅平台</h2>
          <p class="brand-description">探索智慧农业与文旅融合的全新体验，让科技与自然和谐共生</p>
        </div>

        <!-- 装饰元素 -->
        <div class="decoration-elements">
          <div class="floating-element element-1">
            <tree-one theme="outline" size="24" fill="#52c41a" />
          </div>
          <div class="floating-element element-2">
            <water theme="outline" size="20" fill="#1890ff" />
          </div>
          <div class="floating-element element-3">
            <sun theme="outline" size="28" fill="#faad14" />
          </div>
        </div>
      </div>

      <!-- 右侧表单区域 -->
      <div class="auth-main">
        <div class="auth-card">
          <router-view />
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="auth-footer">
      <p>&copy; 2024 绿色智能船艇农文旅平台. 让科技点亮美好生活</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ship, TreeOne, Water, Sun } from '@icon-park/vue-next'
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 50%, #e6fffb 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 背景装饰波浪 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.wave {
  position: absolute;
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
}

.wave-1 {
  top: 10%;
  left: -10%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, #1890ff 0%, transparent 70%);
  border-radius: 50%;
  animation-delay: 0s;
}

.wave-2 {
  top: 60%;
  right: -5%;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, #52c41a 0%, transparent 70%);
  border-radius: 50%;
  animation-delay: 2s;
}

.wave-3 {
  bottom: 20%;
  left: 10%;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, #faad14 0%, transparent 70%);
  border-radius: 50%;
  animation-delay: 4s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.1);
  }
}

/* 主容器 */
.auth-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* 左侧装饰区域 */
.auth-sidebar {
  flex: 1;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.brand-section {
  text-align: center;
  margin-bottom: 3rem;
}

.brand-icon {
  margin-bottom: 1.5rem;
  display: inline-block;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(24, 144, 255, 0.1);
  backdrop-filter: blur(10px);
}

.brand-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1890ff;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(24, 144, 255, 0.1);
}

.brand-subtitle {
  font-size: 1.8rem;
  font-weight: 600;
  color: #52c41a;
  margin: 0 0 1.5rem 0;
}

.brand-description {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto;
}

/* 浮动装饰元素 */
.decoration-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.floating-element {
  position: absolute;
  animation: float 4s ease-in-out infinite;
  padding: 8px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.element-1 {
  top: 20%;
  left: 15%;
  animation-delay: 0s;
}

.element-2 {
  top: 70%;
  right: 20%;
  animation-delay: 1.5s;
}

.element-3 {
  bottom: 25%;
  left: 25%;
  animation-delay: 3s;
}

/* 右侧表单区域 */
.auth-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 3rem;
  box-shadow:
    0 20px 40px rgba(24, 144, 255, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;
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

/* 底部信息 */
.auth-footer {
  text-align: center;
  padding: 1.5rem;
  color: #999;
  font-size: 0.9rem;
  position: relative;
  z-index: 2;
}

/* 响应式设计 */
@media (max-width: 968px) {
  .auth-container {
    flex-direction: column;
    padding: 1rem;
  }

  .auth-sidebar {
    padding: 2rem 1rem;
    order: 2;
  }

  .brand-title {
    font-size: 2rem;
  }

  .brand-subtitle {
    font-size: 1.5rem;
  }

  .auth-main {
    order: 1;
    padding: 1rem;
  }

  .auth-card {
    max-width: 100%;
    padding: 2rem;
  }

  .decoration-elements {
    display: none;
  }
}

@media (max-width: 640px) {
  .auth-layout {
    background: linear-gradient(180deg, #e6f7ff 0%, #f0f9ff 100%);
  }

  .auth-container {
    padding: 0.5rem;
  }

  .auth-card {
    border-radius: 16px;
    padding: 1.5rem;
    margin: 0 0.5rem;
  }

  .brand-title {
    font-size: 1.8rem;
  }

  .brand-subtitle {
    font-size: 1.3rem;
  }

  .brand-description {
    font-size: 1rem;
  }
}

/* 深色主题适配 */
@media (prefers-color-scheme: dark) {
  .auth-layout {
    background: linear-gradient(135deg, #001529 0%, #002140 50%, #001529 100%);
  }

  .auth-card {
    background: rgba(20, 20, 20, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .brand-description,
  .auth-footer {
    color: #bbb;
  }
}
</style>

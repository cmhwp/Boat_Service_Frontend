<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-illustration">
        <div class="boat-icon">
          <ship theme="outline" size="120" fill="#1890ff" />
        </div>
        <div class="waves">
          <div class="wave wave-1"></div>
          <div class="wave wave-2"></div>
          <div class="wave wave-3"></div>
        </div>
      </div>

      <div class="error-info">
        <h1 class="error-code">404</h1>
        <h2 class="error-title">页面迷航了</h2>
        <p class="error-description">
          抱歉，您要访问的页面似乎已经在广阔的数字海洋中迷失了方向。
          <br />
          让我们帮您重新找到正确的航道。
        </p>

        <div class="error-actions">
          <el-button type="primary" size="large" class="action-btn" @click="goHome">
            <home theme="outline" size="20" fill="#fff" />
            返回首页
          </el-button>
          <el-button size="large" class="action-btn" @click="goBack">
            <left theme="outline" size="20" fill="#1890ff" />
            返回上页
          </el-button>
        </div>
      </div>
    </div>

    <div class="help-section">
      <p class="help-text">如果问题持续存在，请联系我们：</p>
      <div class="contact-info">
        <span class="contact-item">
          <mail theme="outline" size="16" fill="#666" />
          support@boat-platform.com
        </span>
        <span class="contact-item">
          <phone theme="outline" size="16" fill="#666" />
          400-123-4567
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Ship, Home, Left, Mail, Phone } from '@icon-park/vue-next'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 50%, #e6fffb 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.not-found-content {
  text-align: center;
  max-width: 600px;
  width: 100%;
  margin-bottom: 3rem;
}

.error-illustration {
  position: relative;
  margin-bottom: 3rem;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.boat-icon {
  position: relative;
  z-index: 2;
  animation: float 3s ease-in-out infinite;
}

.waves {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 60px;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(24, 144, 255, 0.3) 0%, rgba(24, 144, 255, 0.1) 100%);
  border-radius: 50% 50% 0 0;
  animation: wave 2s ease-in-out infinite;
}

.wave-1 {
  animation-delay: 0s;
}

.wave-2 {
  animation-delay: 0.5s;
  opacity: 0.7;
}

.wave-3 {
  animation-delay: 1s;
  opacity: 0.5;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes wave {
  0%,
  100% {
    transform: scaleX(1) scaleY(1);
  }
  50% {
    transform: scaleX(1.1) scaleY(0.8);
  }
}

.error-info {
  margin-bottom: 2rem;
}

.error-code {
  font-size: 6rem;
  font-weight: 700;
  color: #1890ff;
  margin: 0 0 1rem 0;
  text-shadow: 0 4px 8px rgba(24, 144, 255, 0.2);
  opacity: 0.8;
}

.error-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: #1890ff;
  margin: 0 0 1rem 0;
}

.error-description {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  margin: 0 0 2rem 0;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  height: 48px;
  padding: 0 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.action-btn[type='primary'] {
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.action-btn[type='primary']:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
}

.action-btn:not([type]) {
  background: #fff;
  border: 2px solid #1890ff;
  color: #1890ff;
}

.action-btn:not([type]):hover {
  background: #f0f9ff;
  transform: translateY(-2px);
}

.help-section {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(24, 144, 255, 0.1);
}

.help-text {
  font-size: 0.9rem;
  color: #999;
  margin: 0 0 1rem 0;
}

.contact-info {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .not-found-container {
    padding: 1rem;
  }

  .error-code {
    font-size: 4rem;
  }

  .error-title {
    font-size: 2rem;
  }

  .error-description {
    font-size: 1rem;
  }

  .error-actions {
    flex-direction: column;
    align-items: center;
  }

  .action-btn {
    width: 100%;
    max-width: 280px;
  }

  .contact-info {
    flex-direction: column;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .error-code {
    font-size: 3rem;
  }

  .error-title {
    font-size: 1.5rem;
  }

  .waves {
    width: 200px;
  }
}

/* 页面动画 */
.not-found-content {
  animation: fadeInUp 0.8s ease-out;
}

.help-section {
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 背景装饰 */
.not-found-container::before {
  content: '';
  position: absolute;
  top: 10%;
  left: -5%;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(82, 196, 26, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 4s ease-in-out infinite;
}

.not-found-container::after {
  content: '';
  position: absolute;
  bottom: 20%;
  right: -5%;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(250, 173, 20, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 4s ease-in-out infinite 2s;
}
</style>

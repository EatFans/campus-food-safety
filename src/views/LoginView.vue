<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-left">
        <div class="left-content">
          <div class="logo-section">
            <!-- 食品安全图标 -->
            <svg class="food-icon" viewBox="0 0 200 200" width="180" height="180" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="plateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                </linearGradient>
                <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:#4facfe;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#00f2fe;stop-opacity:1" />
                </linearGradient>
              </defs>
              
              <!-- 盘子 -->
              <ellipse cx="100" cy="120" rx="70" ry="15" fill="url(#plateGradient)" opacity="0.3"/>
              <ellipse cx="100" cy="115" rx="65" ry="12" fill="url(#plateGradient)" opacity="0.5"/>
              <circle cx="100" cy="110" r="60" fill="url(#plateGradient)" opacity="0.2" stroke="#667eea" stroke-width="3"/>
              
              <!-- 食物图标 - 叉子 -->
              <g transform="translate(65, 70)">
                <rect x="0" y="0" width="3" height="35" rx="1.5" fill="#fff"/>
                <rect x="8" y="0" width="3" height="35" rx="1.5" fill="#fff"/>
                <rect x="16" y="0" width="3" height="35" rx="1.5" fill="#fff"/>
                <rect x="0" y="0" width="19" height="8" rx="2" fill="#fff"/>
              </g>
              
              <!-- 食物图标 - 勺子 -->
              <g transform="translate(115, 70)">
                <rect x="8" y="8" width="3" height="30" rx="1.5" fill="#fff"/>
                <ellipse cx="9.5" cy="5" rx="7" ry="8" fill="#fff"/>
              </g>
              
              <!-- 安全盾牌 -->
              <g transform="translate(100, 40)">
                <path d="M 0,-30 L 15,-25 L 15,0 Q 15,15 0,20 Q -15,15 -15,0 L -15,-25 Z" 
                      fill="url(#shieldGradient)" opacity="0.9" stroke="#fff" stroke-width="2"/>
                <text x="0" y="0" text-anchor="middle" font-size="20" font-weight="bold" fill="#fff">✓</text>
              </g>
              
              <!-- 装饰圆点 -->
              <circle cx="40" cy="60" r="3" fill="#4facfe" opacity="0.6">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
              </circle>
              <circle cx="160" cy="60" r="3" fill="#4facfe" opacity="0.6">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="50" cy="140" r="2" fill="#667eea" opacity="0.5">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="1s" repeatCount="indefinite"/>
              </circle>
              <circle cx="150" cy="140" r="2" fill="#667eea" opacity="0.5">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="1.5s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </div>
        </div>
      </div>
      <div class="login-right">
        <h1 class="login-title">食品安全监管系统</h1>
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="rules"
          class="login-form"
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              size="large"
              clearable
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              show-password
              clearable
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          
          <el-form-item>
            <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              style="width: 100%"
              :loading="loading"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const rememberMe = ref(false)

const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
})

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    loading.value = true
    
    // 模拟登录请求
    setTimeout(() => {
      // 示例:用户名admin,密码123456
      if (loginForm.username === 'admin' && loginForm.password === '123456') {
        // 登录成功,设置本地存储
        localStorage.setItem('isLogin', 'true')
        localStorage.setItem('username', loginForm.username)
        
        ElMessage.success('登录成功')
        
        // 跳转到后台首页
        router.push('/dashboard/overview')
      } else {
        ElMessage.error('用户名或密码错误')
      }
      loading.value = false
    }, 1000)
  } catch (error) {
    ElMessage.warning('请填写完整的登录信息')
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('@/assets/login-background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 0;
}

.login-card {
  display: flex;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  width: 90%;
  max-width: 900px;
  min-height: 500px;
  position: relative;
  z-index: 1;
}

.login-left {
  flex: 1;
  background: linear-gradient(135deg, #4a90e2 0%, #8b9ce0 100%);
  position: relative;
  min-width: 300px;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.login-left::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 50%);
  border-radius: 16px 0 0 16px;
}

.login-left::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
  animation: float 15s ease-in-out infinite;
}

.left-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
  padding: 40px;
}

.logo-section {
  margin-bottom: 30px;
  animation: fadeInDown 1s ease-out;
}

.food-icon {
  filter: drop-shadow(0 10px 30px rgba(139, 156, 224, 0.3));
  animation: float-icon 3s ease-in-out infinite;
}

@keyframes float-icon {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.welcome-title {
  font-size: 24px;
  font-weight: 300;
  margin: 0 0 10px 0;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 2px;
  animation: fadeIn 1s ease-out 0.3s both;
}

.system-title {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 15px 0;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: fadeIn 1s ease-out 0.5s both;
}

.system-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  letter-spacing: 1px;
  animation: fadeIn 1s ease-out 0.7s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(30px, -30px) rotate(120deg);
  }
  66% {
    transform: translate(-20px, 20px) rotate(240deg);
  }
}

.login-right {
  flex: 1;
  padding: 60px 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: white;
}

.login-title {
  text-align: center;
  color: #333;
  margin-bottom: 40px;
  font-size: 26px;
  font-weight: 600;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: #f5f7fa;
  border-radius: 8px;
  border: 1px solid #e0e6ed;
  transition: all 0.3s;
}

.input-wrapper:focus-within {
  border-color: #4a90e2;
  background: white;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.input-icon {
  padding: 0 15px;
  font-size: 18px;
  color: #8b95a5;
}

.input-wrapper input {
  flex: 1;
  padding: 14px 15px 14px 0;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #333;
  outline: none;
}

.input-wrapper input::placeholder {
  color: #b0b8c3;
}

.toggle-password {
  padding: 0 15px;
  cursor: pointer;
  font-size: 18px;
  user-select: none;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -5px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  color: #666;
}

.remember-me input[type="checkbox"] {
  cursor: pointer;
  width: 16px;
  height: 16px;
}

.login-btn {
  padding: 14px;
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(74, 144, 226, 0.4);
}

.login-btn:active {
  transform: translateY(0);
}

.error-message {
  color: #e74c3c;
  text-align: center;
  font-size: 13px;
  margin: 5px 0 0 0;
  padding: 8px;
  background: #fee;
  border-radius: 6px;
}

@media (max-width: 768px) {
  .login-card {
    flex-direction: column;
    max-width: 400px;
  }
  
  .login-left {
    min-height: 150px;
    min-width: auto;
  }
  
  .login-right {
    padding: 40px 30px;
  }
}
</style>

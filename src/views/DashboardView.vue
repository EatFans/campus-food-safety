<template>
  <div class="dashboard-container">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-icon">🏢</span>
          <span class="logo-text">Art Design Pro</span>
        </div>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-item" :class="{ active: activeMenu === 'dashboard' }" @click="activeMenu = 'dashboard'">
          <span class="icon">📊</span>
          <span>工作台</span>
        </div>
        <div class="nav-item" :class="{ active: activeMenu === 'food' }" @click="activeMenu = 'food'">
          <span class="icon">🍱</span>
          <span>今日资讯</span>
        </div>
        <div class="nav-item" :class="{ active: activeMenu === 'safety' }" @click="activeMenu = 'safety'">
          <span class="icon">�️</span>
          <span>核心中心</span>
        </div>
        <div class="nav-item" :class="{ active: activeMenu === 'reports' }" @click="activeMenu = 'reports'">
          <span class="icon">📝</span>
          <span>报告中心</span>
        </div>
        <div class="nav-item" :class="{ active: activeMenu === 'message' }" @click="activeMenu = 'message'">
          <span class="icon">💬</span>
          <span>消息中心</span>
        </div>
        <div class="nav-item" :class="{ active: activeMenu === 'system' }" @click="activeMenu = 'system'">
          <span class="icon">⚙️</span>
          <span>系统管理</span>
        </div>
        <div class="nav-item" :class="{ active: activeMenu === 'settings' }" @click="activeMenu = 'settings'">
          <span class="icon">🔧</span>
          <span>交易管理</span>
        </div>
        <div class="nav-item" :class="{ active: activeMenu === 'monitor' }" @click="activeMenu = 'monitor'">
          <span class="icon">�</span>
          <span>监控页面</span>
        </div>
        <div class="nav-item" :class="{ active: activeMenu === 'workplace' }" @click="activeMenu = 'workplace'">
          <span class="icon">💼</span>
          <span>标准页面</span>
        </div>
        <div class="nav-item" :class="{ active: activeMenu === 'list' }" @click="activeMenu = 'list'">
          <span class="icon">�</span>
          <span>运维管理</span>
        </div>
        <div class="nav-item" :class="{ active: activeMenu === 'official' }" @click="activeMenu = 'official'">
          <span class="icon">📄</span>
          <span>官方文档</span>
        </div>
        <div class="nav-item" :class="{ active: activeMenu === 'components' }" @click="activeMenu = 'components'">
          <span class="icon">🧩</span>
          <span>组件库本</span>
        </div>
        <div class="nav-item hot" :class="{ active: activeMenu === 'ads' }" @click="activeMenu = 'ads'">
          <span class="icon">📢</span>
          <span>图片云存储</span>
          <span class="badge">热门</span>
        </div>
      </nav>
    </aside>

    <div class="main-content">
      <header class="top-header">
        <div class="header-left">
          <span class="menu-toggle">☰</span>
          <div class="breadcrumb">
            <span>首页</span>
            <span class="separator">/</span>
            <span>工作台</span>
          </div>
        </div>
        <div class="header-right">
          <div class="header-actions">
            <span class="action-icon">🔔</span>
            <span class="action-icon">❓</span>
            <span class="action-icon">⚙️</span>
          </div>
          <div class="user-info">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%234a90e2'/%3E%3Ctext x='50' y='65' text-anchor='middle' fill='white' font-size='40' font-family='Arial'%3E{{ username.charAt(0).toUpperCase() }}%3C/text%3E%3C/svg%3E" alt="avatar" class="avatar" />
            <span class="username">{{ username }}</span>
          </div>
          <button @click="handleLogout" class="logout-btn">退出登录</button>
        </div>
      </header>

      <main class="content">
        <router-view v-slot="{ Component }">
          <component :is="Component" v-if="Component" />
          <div v-else class="welcome-section">
            <div class="page-header">
              <h2>工作台</h2>
              <p class="subtitle">欢迎使用校园食品安全管理系统</p>
            </div>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-header">
                  <span class="stat-title">总访问量</span>
                  <span class="stat-icon">📊</span>
                </div>
                <div class="stat-number">9,105</div>
                <div class="stat-footer">
                  <span class="stat-label">昨天</span>
                  <span class="stat-change positive">+20%</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-header">
                  <span class="stat-title">在线用户</span>
                  <span class="stat-icon">👥</span>
                </div>
                <div class="stat-number">181</div>
                <div class="stat-footer">
                  <span class="stat-label">昨天</span>
                  <span class="stat-change positive">+18%</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-header">
                  <span class="stat-title">总点击</span>
                  <span class="stat-icon">🖱️</span>
                </div>
                <div class="stat-number">9,504</div>
                <div class="stat-footer">
                  <span class="stat-label">昨天</span>
                  <span class="stat-change negative">-12%</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-header">
                  <span class="stat-title">新用户</span>
                  <span class="stat-icon">✨</span>
                </div>
                <div class="stat-number">155</div>
                <div class="stat-footer">
                  <span class="stat-label">昨天</span>
                  <span class="stat-change positive">+33%</span>
                </div>
              </div>
            </div>
          </div>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const activeMenu = ref('dashboard')

onMounted(() => {
  // 获取用户名
  username.value = localStorage.getItem('username') || '用户'
})

const handleLogout = () => {
  // 清除登录状态
  localStorage.removeItem('isLogin')
  localStorage.removeItem('username')
  // 跳转到登录页
  router.push('/login')
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.sidebar {
  width: 220px;
  background: #ffffff;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.02);
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  color: #1890ff;
}

.sidebar-nav {
  flex: 1;
  padding: 12px 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  margin: 2px 12px;
  color: #595959;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 6px;
  font-size: 14px;
  position: relative;
}

.nav-item:hover {
  background-color: #f5f5f5;
  color: #1890ff;
}

.nav-item.active {
  background-color: #e6f7ff;
  color: #1890ff;
  font-weight: 500;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: #1890ff;
  border-radius: 0 2px 2px 0;
}

.nav-item .icon {
  font-size: 18px;
  opacity: 0.85;
}

.nav-item.active .icon {
  opacity: 1;
}

.nav-item.hot {
  position: relative;
}

.badge {
  position: absolute;
  right: 12px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%);
  color: white;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 500;
}
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
}

.top-header {
  background: white;
  padding: 0 24px;
  height: 64px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-toggle {
  font-size: 20px;
  cursor: pointer;
  color: #595959;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s;
}

.menu-toggle:hover {
  background: #f5f5f5;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #595959;
}

.breadcrumb .separator {
  color: #d9d9d9;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-icon {
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s;
  color: #595959;
}

.action-icon:hover {
  background: #f5f5f5;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 4px;
  transition: all 0.3s;
}

.user-info:hover {
  background: #f5f5f5;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.username {
  color: #262626;
  font-size: 14px;
  font-weight: 500;
}

.logout-btn {
  padding: 6px 16px;
  background: white;
  color: #595959;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.logout-btn:hover {
  color: #1890ff;
  border-color: #1890ff;
}

.content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.welcome-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header h2 {
  margin: 0 0 8px 0;
  color: #262626;
  font-size: 24px;
  font-weight: 600;
}

.subtitle {
  margin: 0;
  color: #8c8c8c;
  font-size: 14px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  border: 1px solid #f0f0f0;
  transition: all 0.3s;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.stat-title {
  font-size: 14px;
  color: #8c8c8c;
}

.stat-icon {
  font-size: 24px;
  opacity: 0.6;
}

.stat-number {
  font-size: 32px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 12px;
}

.stat-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.stat-label {
  color: #8c8c8c;
}

.stat-change {
  font-weight: 500;
}

.stat-change.positive {
  color: #52c41a;
}

.stat-change.negative {
  color: #ff4d4f;
}
</style>

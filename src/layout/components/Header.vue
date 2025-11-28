<template>
  <el-header class="top-header">
    <div class="header-left">
      <el-icon class="menu-toggle" :size="22">
        <Expand />
      </el-icon>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ currentPageTitle }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <div class="header-right">
      <el-space :size="16">
        <el-badge :value="12" :max="99">
          <el-icon class="action-icon" :size="20">
            <Bell />
          </el-icon>
        </el-badge>
        
        <el-icon class="action-icon" :size="20">
          <QuestionFilled />
        </el-icon>
        
        <el-icon class="action-icon" :size="20">
          <Setting />
        </el-icon>
        
        <el-dropdown @command="handleCommand">
          <div class="user-info">
            <el-avatar :size="32">{{ username.charAt(0).toUpperCase() }}</el-avatar>
            <span class="username">{{ username }}</span>
            <el-icon><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><User /></el-icon>
                个人中心
              </el-dropdown-item>
              <el-dropdown-item command="settings">
                <el-icon><Setting /></el-icon>
                设置
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-space>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const username = ref(localStorage.getItem('username') || '用户')

const currentPageTitle = computed(() => {
  return (route.meta.title as string) || '工作台'
})

const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      ElMessage.info('个人中心功能开发中...')
      break
    case 'settings':
      ElMessage.info('设置功能开发中...')
      break
    case 'logout':
      localStorage.removeItem('isLogin')
      localStorage.removeItem('username')
      ElMessage.success('退出登录成功')
      router.push('/login')
      break
  }
}
</script>

<style scoped>
.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--el-box-shadow-light);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-toggle {
  cursor: pointer;
  transition: all 0.3s;
}

.menu-toggle:hover {
  color: var(--el-color-primary);
}

.action-icon {
  cursor: pointer;
  transition: all 0.3s;
}

.action-icon:hover {
  color: var(--el-color-primary);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s;
}

.user-info:hover {
  background-color: var(--el-fill-color-light);
}

.username {
  font-size: 14px;
}
</style>

<template>
  <el-aside width="220px" class="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <Icon icon="mdi:food" class="logo-icon" />
        <span class="logo-text">智慧管理系统</span>
      </div>
    </div>
    
    <el-scrollbar class="sidebar-scrollbar">
      <el-menu
        :default-active="activeMenu"
        :unique-opened="true"
        router
        class="sidebar-menu"
      >
        <template v-for="item in menuItems" :key="item.path">
          <!-- 没有子菜单的项 -->
          <el-menu-item v-if="!item.children" :index="item.path">
            <Icon :icon="item.icon" class="menu-icon" />
            <span>{{ item.title }}</span>
            <el-tag v-if="item.hot" type="danger" size="small" class="hot-tag">热门</el-tag>
          </el-menu-item>

          <!-- 有子菜单的项 -->
          <el-sub-menu v-else :index="item.path">
            <template #title>
              <Icon :icon="item.icon" class="menu-icon" />
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item
              v-for="child in item.children"
              :key="child.path"
              :index="child.path"
            >
              <Icon :icon="child.icon" class="menu-icon" />
              <span>{{ child.title }}</span>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { menuConfig } from '@/config/menu'
import type { MenuItem } from '@/config/menu'

const route = useRoute()
const menuItems = ref<MenuItem[]>(menuConfig)

const activeMenu = computed(() => route.path)
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid var(--el-border-color);
  flex-shrink: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  font-size: 24px;
  color: var(--el-color-primary);
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-color-primary);
}

.sidebar-scrollbar {
  flex: 1;
  height: 0;
}

.sidebar-menu {
  border-right: none;
}

.menu-icon {
  font-size: 18px;
  margin-right: 8px;
  vertical-align: middle;
}

.hot-tag {
  margin-left: auto;
}
</style>

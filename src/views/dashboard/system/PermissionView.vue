<template>
  <div class="permission-view">
    <div class="page-header">
      <h2>权限管理</h2>
    </div>

    <el-card shadow="never">
      <el-tree :data="permissions" :props="{ label: 'name', children: 'children' }" node-key="id" default-expand-all show-checkbox>
        <template #default="{ node, data }">
          <div class="tree-node">
            <span class="node-label">
              <el-icon v-if="data.icon"><component :is="data.icon" /></el-icon>
              {{ node.label }}
            </span>
            <span class="node-actions">
              <el-tag size="small" type="info">{{ data.code }}</el-tag>
              <el-button link type="primary" size="small" :icon="Edit">编辑</el-button>
              <el-button link type="danger" size="small" :icon="Delete">删除</el-button>
            </span>
          </div>
        </template>
      </el-tree>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'

const permissions = ref([
  {
    id: 1,
    name: '系统管理',
    code: 'system',
    icon: 'Setting',
    children: [
      { id: 11, name: '用户管理', code: 'system:user', icon: 'User' },
      { id: 12, name: '角色管理', code: 'system:role', icon: 'UserFilled' },
      { id: 13, name: '权限管理', code: 'system:permission', icon: 'Key' }
    ]
  },
  {
    id: 2,
    name: '员工管理',
    code: 'employee',
    icon: 'Avatar',
    children: [
      { id: 21, name: '员工列表', code: 'employee:list', icon: 'List' },
      { id: 22, name: '部门管理', code: 'employee:department', icon: 'OfficeBuilding' }
    ]
  },
  {
    id: 3,
    name: '报表中心',
    code: 'report',
    icon: 'DataAnalysis',
    children: [
      { id: 31, name: '销售报表', code: 'report:sales', icon: 'TrendCharts' },
      { id: 32, name: '财务报表', code: 'report:finance', icon: 'Money' }
    ]
  }
])
</script>

<style scoped>
.permission-view {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header h2 {
  margin: 0 0 20px 0;
  font-size: 22px;
  font-weight: 600;
  color: #303133;
}

.permission-view :deep(.el-card) {
  border-radius: 8px;
}

.tree-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-right: 20px;
}

.node-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.node-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>

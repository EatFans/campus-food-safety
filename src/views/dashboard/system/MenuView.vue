<template>
  <div class="menu-view">
    <div class="page-header">
      <h2>菜单管理</h2>
      <el-button type="primary" :icon="Plus">添加菜单</el-button>
    </div>

    <el-card shadow="never">
      <el-table :data="menus" row-key="id" :tree-props="{ children: 'children' }" stripe border>
        <el-table-column label="菜单名称" prop="name" width="200" />
        <el-table-column label="图标" width="80" align="center">
          <template #default="{ row }">
            <el-icon v-if="row.icon"><component :is="row.icon" /></el-icon>
          </template>
        </el-table-column>
        <el-table-column label="路径" prop="path" width="200" />
        <el-table-column label="排序" prop="sort" width="80" align="center" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '显示' ? 'success' : 'info'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small" :icon="Edit">编辑</el-button>
            <el-button link type="success" size="small" :icon="Plus">添加</el-button>
            <el-button link type="danger" size="small" :icon="Delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'

const menus = ref([
  {
    id: 1,
    name: '数据概览',
    icon: 'DataLine',
    path: '/dashboard/overview',
    sort: 1,
    status: '显示'
  },
  {
    id: 2,
    name: '员工管理',
    icon: 'User',
    path: '/dashboard/employee',
    sort: 2,
    status: '显示',
    children: [
      { id: 21, name: '员工列表', icon: '', path: '/dashboard/employee/list', sort: 1, status: '显示' },
      { id: 22, name: '部门管理', icon: '', path: '/dashboard/employee/department', sort: 2, status: '显示' }
    ]
  },
  {
    id: 3,
    name: '报表中心',
    icon: 'DataAnalysis',
    path: '/dashboard/report',
    sort: 3,
    status: '显示',
    children: [
      { id: 31, name: '销售报表', icon: '', path: '/dashboard/report/sales', sort: 1, status: '显示' },
      { id: 32, name: '财务报表', icon: '', path: '/dashboard/report/financial', sort: 2, status: '显示' }
    ]
  }
])
</script>

<style scoped>
.menu-view {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #303133;
}

.menu-view :deep(.el-card) {
  border-radius: 8px;
}

:deep(.el-table) {
  border-radius: 4px;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 600;
}

:deep(.el-button + .el-button) {
  margin-left: 8px;
}
</style>

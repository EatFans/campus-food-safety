<template>
  <div class="role-view">
    <div class="page-header">
      <div class="header-left">
        <h2>角色管理</h2>
        <span class="subtitle">共 {{ roles.length }} 个角色</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large">添加角色</el-button>
    </div>

    <el-row :gutter="16">
      <el-col :xs="24" :sm="12" :md="8" v-for="role in roles" :key="role.id">
        <el-card shadow="hover" class="role-card">
          <div class="role-header">
            <el-tag :type="role.type" size="large">{{ role.name }}</el-tag>
            <el-dropdown>
              <el-icon><MoreFilled /></el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :icon="Edit">编辑</el-dropdown-item>
                  <el-dropdown-item :icon="Setting">权限设置</el-dropdown-item>
                  <el-dropdown-item :icon="Delete" divided>删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div class="role-desc">{{ role.description }}</div>
          <el-divider />
          <div class="role-stats">
            <div class="stat-item">
              <span class="label">用户数</span>
              <span class="value">{{ role.userCount }}</span>
            </div>
            <div class="stat-item">
              <span class="label">权限数</span>
              <span class="value">{{ role.permissionCount }}</span>
            </div>
          </div>
          <div class="role-footer">
            <el-text type="info" size="small">创建时间: {{ role.createTime }}</el-text>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Edit, Delete, Setting, MoreFilled } from '@element-plus/icons-vue'

const roles = ref([
  { id: 1, name: '超级管理员', type: 'danger', description: '拥有系统所有权限', userCount: 2, permissionCount: 100, createTime: '2023-01-15' },
  { id: 2, name: '管理员', type: 'warning', description: '拥有大部分管理权限', userCount: 5, permissionCount: 80, createTime: '2023-01-15' },
  { id: 3, name: '部门主管', type: 'primary', description: '部门管理权限', userCount: 8, permissionCount: 50, createTime: '2023-01-15' },
  { id: 4, name: '普通员工', type: 'success', description: '基础操作权限', userCount: 45, permissionCount: 20, createTime: '2023-01-15' },
  { id: 5, name: '财务人员', type: 'info', description: '财务相关权限', userCount: 3, permissionCount: 30, createTime: '2023-02-20' },
  { id: 6, name: '采购人员', type: 'info', description: '采购相关权限', userCount: 6, permissionCount: 25, createTime: '2023-02-20' }
])
</script>

<style scoped>
.role-view {
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

.header-left {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.page-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #303133;
}

.subtitle {
  font-size: 14px;
  color: #909399;
}

.role-card {
  margin-bottom: 16px;
  border-radius: 8px;
  transition: all 0.3s;
}

.role-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.role-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.role-desc {
  color: #606266;
  font-size: 14px;
  margin-bottom: 16px;
  min-height: 40px;
}

.role-stats {
  display: flex;
  justify-content: space-around;
  margin: 16px 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.stat-item .label {
  color: #909399;
  font-size: 13px;
}

.stat-item .value {
  color: #409eff;
  font-size: 20px;
  font-weight: 600;
}

.role-footer {
  margin-top: 12px;
}
</style>

<template>
  <div class="template-view">
    <div class="page-header">
      <h2>模板管理</h2>
      <el-button type="primary" :icon="Plus">添加模板</el-button>
    </div>

    <el-row :gutter="16">
      <el-col :xs="24" :sm="12" :md="8" v-for="template in templates" :key="template.id">
        <el-card shadow="hover" class="template-card">
          <div class="template-preview">
            <el-icon :size="60" color="#409eff"><Document /></el-icon>
          </div>
          <div class="template-info">
            <h4>{{ template.name }}</h4>
            <p>{{ template.description }}</p>
          </div>
          <el-divider />
          <div class="template-footer">
            <el-button link type="primary" :icon="View">预览</el-button>
            <el-button link type="success" :icon="Edit">编辑</el-button>
            <el-button link type="danger" :icon="Delete">删除</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Document, View, Edit, Delete } from '@element-plus/icons-vue'

const templates = ref([
  { id: 1, name: '订单通知模板', description: '用于订单状态变更通知' },
  { id: 2, name: '审批通知模板', description: '用于审批流程通知' },
  { id: 3, name: '库存预警模板', description: '用于库存不足预警' },
  { id: 4, name: '报表导出模板', description: '用于报表数据导出' }
])
</script>

<style scoped>
.template-view {
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

.template-card {
  margin-bottom: 16px;
  border-radius: 8px;
  text-align: center;
}

.template-preview {
  padding: 30px 0;
}

.template-info h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 500;
}

.template-info p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.template-footer {
  display: flex;
  justify-content: center;
  gap: 16px;
}
</style>

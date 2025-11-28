<template>
  <div class="dict-view">
    <el-row :gutter="16">
      <el-col :xs="24" :sm="8">
        <el-card shadow="never" class="dict-type-card">
          <template #header>
            <div class="card-header">
              <span>字典类型</span>
              <el-button type="primary" size="small" :icon="Plus">添加</el-button>
            </div>
          </template>
          <el-menu :default-active="activeType" @select="handleTypeSelect">
            <el-menu-item v-for="type in dictTypes" :key="type.code" :index="type.code">
              <span>{{ type.name }}</span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="16">
        <el-card shadow="never" class="dict-data-card">
          <template #header>
            <div class="card-header">
              <span>字典数据</span>
              <el-button type="primary" size="small" :icon="Plus">添加</el-button>
            </div>
          </template>
          <el-table :data="dictData" stripe border>
            <el-table-column label="序号" type="index" width="60" align="center" />
            <el-table-column label="字典标签" prop="label" width="150" />
            <el-table-column label="字典值" prop="value" width="150" />
            <el-table-column label="排序" prop="sort" width="80" align="center" />
            <el-table-column label="状态" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="row.status === '启用' ? 'success' : 'info'">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right" align="center">
              <template #default>
                <el-button link type="primary" size="small" :icon="Edit">编辑</el-button>
                <el-button link type="danger" size="small" :icon="Delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'

const activeType = ref('user_status')

const dictTypes = ref([
  { code: 'user_status', name: '用户状态' },
  { code: 'order_status', name: '订单状态' },
  { code: 'payment_method', name: '支付方式' },
  { code: 'device_type', name: '设备类型' }
])

const dictData = ref([
  { id: 1, label: '启用', value: '1', sort: 1, status: '启用' },
  { id: 2, label: '禁用', value: '0', sort: 2, status: '启用' }
])

const handleTypeSelect = (code: string) => {
  activeType.value = code
  // 加载对应类型的字典数据
}
</script>

<style scoped>
.dict-view {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.dict-type-card,
.dict-data-card {
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.el-menu) {
  border: none;
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

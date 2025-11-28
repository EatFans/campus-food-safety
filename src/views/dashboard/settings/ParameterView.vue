<template>
  <div class="parameter-view">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <h3>参数配置</h3>
          <el-button type="primary" :icon="Plus">添加参数</el-button>
        </div>
      </template>

      <el-table :data="parameters" stripe border>
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="参数名称" prop="name" width="200" />
        <el-table-column label="参数键名" prop="key" width="200" />
        <el-table-column label="参数值" prop="value" min-width="200">
          <template #default="{ row }">
            <el-input v-model="row.value" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" min-width="200" show-overflow-tooltip />
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small" :icon="Edit">编辑</el-button>
            <el-button link type="danger" size="small" :icon="Delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="footer-actions">
        <el-button type="primary" size="large" @click="handleSave">保存所有</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const parameters = ref([
  { id: 1, name: '分页大小', key: 'page_size', value: '10', remark: '默认分页大小' },
  { id: 2, name: '上传限制', key: 'upload_limit', value: '10MB', remark: '文件上传大小限制' },
  { id: 3, name: '会话超时', key: 'session_timeout', value: '30', remark: '会话超时时间(分钟)' },
  { id: 4, name: '密码长度', key: 'password_length', value: '6', remark: '最小密码长度' },
  { id: 5, name: '验证码有效期', key: 'captcha_expire', value: '5', remark: '验证码有效期(分钟)' }
])

const handleSave = () => {
  ElMessage.success('参数已保存')
}
</script>

<style scoped>
.parameter-view {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.parameter-view :deep(.el-card) {
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.footer-actions {
  margin-top: 20px;
  text-align: center;
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

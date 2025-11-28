<template>
  <div class="backup-view">
    <el-row :gutter="16">
      <el-col :xs="24" :sm="12">
        <el-card shadow="never" class="action-card">
          <template #header>
            <h3>数据备份</h3>
          </template>
          <div class="action-content">
            <el-icon :size="80" color="#67c23a"><FolderAdd /></el-icon>
            <p>创建系统数据备份</p>
            <el-button type="success" size="large" :icon="Download" @click="handleBackup">立即备份</el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12">
        <el-card shadow="never" class="action-card">
          <template #header>
            <h3>数据恢复</h3>
          </template>
          <div class="action-content">
            <el-icon :size="80" color="#409eff"><FolderOpened /></el-icon>
            <p>从备份文件恢复数据</p>
            <el-upload action="#" :show-file-list="false" accept=".sql,.zip">
              <el-button type="primary" size="large" :icon="Upload">选择文件</el-button>
            </el-upload>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="backup-list-card">
      <template #header>
        <h3>备份记录</h3>
      </template>

      <el-table :data="backups" stripe border>
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="备份文件" prop="filename" min-width="200" />
        <el-table-column label="文件大小" prop="size" width="120" align="center" />
        <el-table-column label="备份时间" prop="time" width="180" />
        <el-table-column label="备份类型" prop="type" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="row.type === '自动' ? 'success' : 'primary'" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small" :icon="Download">下载</el-button>
            <el-button link type="success" size="small" :icon="RefreshRight">恢复</el-button>
            <el-button link type="danger" size="small" :icon="Delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Download, Upload, Delete, FolderAdd, FolderOpened, RefreshRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const backups = ref([
  { id: 1, filename: 'backup_20251128_103000.sql', size: '25.6 MB', time: '2025-11-28 10:30', type: '手动' },
  { id: 2, filename: 'backup_20251127_020000.sql', size: '24.8 MB', time: '2025-11-27 02:00', type: '自动' },
  { id: 3, filename: 'backup_20251126_020000.sql', size: '24.5 MB', time: '2025-11-26 02:00', type: '自动' },
  { id: 4, filename: 'backup_20251125_020000.sql', size: '24.2 MB', time: '2025-11-25 02:00', type: '自动' },
  { id: 5, filename: 'backup_20251124_020000.sql', size: '23.9 MB', time: '2025-11-24 02:00', type: '自动' }
])

const handleBackup = () => {
  ElMessage.success('备份任务已启动')
}
</script>

<style scoped>
.backup-view {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.action-card {
  margin-bottom: 16px;
  border-radius: 8px;
}

.action-card h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.action-content {
  text-align: center;
  padding: 40px 20px;
}

.action-content p {
  margin: 20px 0;
  color: #606266;
  font-size: 15px;
}

.backup-list-card {
  border-radius: 8px;
}

.backup-list-card h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
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

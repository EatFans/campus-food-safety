<template>
  <div class="common-page-template">
    <div class="page-header">
      <h2>{{ title }}</h2>
      <el-space>
        <el-button type="primary" :icon="Plus">新增</el-button>
        <el-button :icon="Download">导出</el-button>
        <el-button :icon="Refresh" @click="handleRefresh">刷新</el-button>
      </el-space>
    </div>

    <el-card shadow="never" class="content-card">
      <el-empty :description="`${title}功能开发中...`" :image-size="200">
        <template #image>
          <Icon icon="mdi:progress-wrench" :width="200" :height="200" color="#909399" />
        </template>
        <el-button type="primary" @click="handleDevelop">开始开发</el-button>
      </el-empty>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Plus, Download, Refresh } from '@element-plus/icons-vue'
import { Icon } from '@iconify/vue'
import { ElMessage } from 'element-plus'

defineProps<{
  title: string
}>()

const handleRefresh = () => {
  ElMessage.success('刷新成功')
}

const handleDevelop = () => {
  ElMessage.info('功能开发中,敬请期待!')
}
</script>

<style scoped>
.common-page-template {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.content-card {
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

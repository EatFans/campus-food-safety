<template>
  <div class="security-video-view">
    <div class="page-header">
      <h2>视频监控</h2>
      <el-space>
        <el-select v-model="selectedArea" placeholder="选择区域" style="width: 150px;">
          <el-option label="全部区域" value="" />
          <el-option label="厨房区域" value="kitchen" />
          <el-option label="餐厅区域" value="dining" />
          <el-option label="仓库区域" value="warehouse" />
        </el-select>
        <el-button type="primary" :icon="VideoCamera">查看回放</el-button>
      </el-space>
    </div>

    <el-row :gutter="16" class="stats-row">
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="监控总数" :value="24" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card success">
          <el-statistic title="在线设备" :value="22" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card danger">
          <el-statistic title="离线设备" :value="2" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card warning">
          <el-statistic title="今日告警" :value="3" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-top: 16px;">
      <el-col v-for="camera in cameras" :key="camera.id" :xs="24" :sm="12" :lg="8">
        <el-card shadow="hover" class="camera-card">
          <template #header>
            <div class="camera-header">
              <span>{{ camera.name }}</span>
              <el-tag :type="camera.online ? 'success' : 'danger'" size="small">
                {{ camera.online ? '在线' : '离线' }}
              </el-tag>
            </div>
          </template>
          <div class="camera-preview">
            <el-image
              style="width: 100%; height: 200px;"
              src="https://via.placeholder.com/400x200/333/fff?text=监控画面"
              fit="cover"
            />
          </div>
          <div class="camera-footer">
            <el-button link type="primary" size="small">实时查看</el-button>
            <el-button link type="warning" size="small">回放</el-button>
            <el-button link type="info" size="small">设置</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VideoCamera } from '@element-plus/icons-vue'

const selectedArea = ref('')

const cameras = ref([
  { id: 1, name: '厨房1区-主视角', location: '厨房', online: true },
  { id: 2, name: '厨房2区-操作台', location: '厨房', online: true },
  { id: 3, name: '餐厅-大厅', location: '餐厅', online: true },
  { id: 4, name: '仓库-入口', location: '仓库', online: false },
  { id: 5, name: '后厨-洗消间', location: '厨房', online: true },
  { id: 6, name: '餐厅-收银台', location: '餐厅', online: true }
])
</script>

<style scoped>
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
}

.stats-row {
  margin-top: 20px;
}

.stat-card {
  text-align: center;
}

.stat-card.success {
  border-left: 4px solid var(--el-color-success);
}

.stat-card.danger {
  border-left: 4px solid var(--el-color-danger);
}

.stat-card.warning {
  border-left: 4px solid var(--el-color-warning);
}

.camera-card {
  margin-bottom: 16px;
}

.camera-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.camera-preview {
  margin-bottom: 12px;
}

.camera-footer {
  display: flex;
  justify-content: space-around;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
}
</style>

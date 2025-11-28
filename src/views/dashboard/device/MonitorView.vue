<template>
  <div class="monitor-view">
    <div class="page-header">
      <h2>设备监控</h2>
    </div>

    <el-row :gutter="16" class="stats-row">
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card success">
          <el-statistic title="正常运行" :value="stats.normal" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card warning">
          <el-statistic title="维修中" :value="stats.repairing" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card danger">
          <el-statistic title="故障" :value="stats.fault" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card info">
          <el-statistic title="停用" :value="stats.disabled" />
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="table-card">
      <div class="table-toolbar">
        <h3>实时监控</h3>
        <el-tooltip content="刷新" placement="top">
          <el-button circle :icon="Refresh" @click="handleRefresh" />
        </el-tooltip>
      </div>

      <el-table :data="monitors" style="width: 100%" v-loading="loading" stripe border>
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="设备编号" prop="deviceNo" width="120">
          <template #default="{ row }">
            <el-text type="primary">{{ row.deviceNo }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="设备名称" prop="name" width="150" />
        <el-table-column label="设备类型" prop="type" width="120" align="center">
          <template #default="{ row }">
            <el-tag size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="运行状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)" effect="dark">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="温度" width="100" align="center">
          <template #default="{ row }">
            <el-text :type="getTempType(row.temperature)">{{ row.temperature }}°C</el-text>
          </template>
        </el-table-column>
        <el-table-column label="运行时长" width="120" align="center">
          <template #default="{ row }">
            <el-text type="primary">{{ row.runningTime }}小时</el-text>
          </template>
        </el-table-column>
        <el-table-column label="最后检查" prop="lastCheck" width="180" />
        <el-table-column label="负责人" prop="manager" width="100" />
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small" :icon="View">详情</el-button>
            <el-button link type="warning" size="small" :icon="Warning">报警</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize" :page-sizes="[10, 20, 50]" :total="pagination.total" layout="total, sizes, prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Refresh, View, Warning } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)

const stats = reactive({
  normal: 38,
  repairing: 4,
  fault: 2,
  disabled: 1
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 45
})

const monitors = ref([
  { id: 1, deviceNo: 'DEV001', name: '商用燃气灶', type: '厨房设备', status: '运行中', temperature: 85, runningTime: 156, lastCheck: '2025-11-28 08:00', manager: '张三' },
  { id: 2, deviceNo: 'DEV002', name: '冷藏柜', type: '制冷设备', status: '运行中', temperature: 4, runningTime: 2340, lastCheck: '2025-11-28 07:30', manager: '李四' },
  { id: 3, deviceNo: 'DEV003', name: '消毒柜', type: '消毒设备', status: '运行中', temperature: 120, runningTime: 89, lastCheck: '2025-11-28 08:15', manager: '王五' },
  { id: 4, deviceNo: 'DEV004', name: '监控摄像头', type: '监控设备', status: '运行中', temperature: 35, runningTime: 8760, lastCheck: '2025-11-27 18:00', manager: '赵六' },
  { id: 5, deviceNo: 'DEV005', name: '油烟机', type: '厨房设备', status: '故障', temperature: 95, runningTime: 145, lastCheck: '2025-11-28 06:00', manager: '张三' },
  { id: 6, deviceNo: 'DEV006', name: '冷冻柜', type: '制冷设备', status: '运行中', temperature: -18, runningTime: 2280, lastCheck: '2025-11-28 07:00', manager: '李四' },
  { id: 7, deviceNo: 'DEV007', name: '洗碗机', type: '厨房设备', status: '运行中', temperature: 75, runningTime: 68, lastCheck: '2025-11-28 08:30', manager: '孙七' },
  { id: 8, deviceNo: 'DEV008', name: '紫外线消毒灯', type: '消毒设备', status: '运行中', temperature: 45, runningTime: 156, lastCheck: '2025-11-28 07:45', manager: '王五' },
  { id: 9, deviceNo: 'DEV009', name: '电磁炉', type: '厨房设备', status: '停机', temperature: 25, runningTime: 0, lastCheck: '2025-11-27 17:00', manager: '周八' },
  { id: 10, deviceNo: 'DEV010', name: '保鲜柜', type: '制冷设备', status: '运行中', temperature: 8, runningTime: 1560, lastCheck: '2025-11-28 08:00', manager: '李四' }
])

const handleRefresh = () => {
  loading.value = true
  setTimeout(() => {
    ElMessage.success('刷新完成')
    loading.value = false
  }, 500)
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    '运行中': 'success',
    '故障': 'danger',
    '停机': 'info'
  }
  return colors[status] || 'info'
}

const getTempType = (temp: number) => {
  if (temp > 100) return 'danger'
  if (temp < 0) return 'primary'
  return 'success'
}
</script>

<style scoped>
.monitor-view {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header h2 {
  margin: 0 0 16px 0;
  font-size: 22px;
  font-weight: 600;
  color: #303133;
}

.stats-row {
  margin-bottom: 16px;
}

.stat-card {
  text-align: center;
  border-radius: 8px;
}

.stat-card.success {
  border-left: 4px solid #67c23a;
}

.stat-card.warning {
  border-left: 4px solid #e6a23c;
}

.stat-card.danger {
  border-left: 4px solid #f56c6c;
}

.stat-card.info {
  border-left: 4px solid #909399;
}

.table-card {
  border-radius: 8px;
}

.table-card :deep(.el-card__body) {
  padding: 20px;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-toolbar h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

:deep(.el-table) {
  border-radius: 4px;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 600;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}
</style>

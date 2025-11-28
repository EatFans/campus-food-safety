<template>
  <div class="device-list-view">
    <div class="page-header">
      <h2>设备列表</h2>
      <el-space>
        <el-input v-model="searchText" placeholder="搜索设备" :prefix-icon="Search" style="width: 200px;" />
        <el-button type="primary" :icon="Plus">添加设备</el-button>
      </el-space>
    </div>

    <el-row :gutter="16" class="stats-row">
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="设备总数" :value="156">
            <template #prefix>
              <el-icon color="#409EFF"><Monitor /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card success">
          <el-statistic title="运行正常" :value="142">
            <template #prefix>
              <el-icon color="#67C23A"><SuccessFilled /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card warning">
          <el-statistic title="需要维护" :value="8">
            <template #prefix>
              <el-icon color="#E6A23C"><Tools /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card danger">
          <el-statistic title="故障停用" :value="6">
            <template #prefix>
              <el-icon color="#F56C6C"><WarningFilled /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="hover" style="margin-top: 16px;">
      <el-table :data="devices" style="width: 100%">
        <el-table-column label="设备编号" prop="deviceNo" width="120" />
        <el-table-column label="设备名称" prop="name" />
        <el-table-column label="设备类型" prop="type" width="120" />
        <el-table-column label="所在位置" prop="location" width="120" />
        <el-table-column label="购置日期" prop="purchaseDate" width="120" />
        <el-table-column label="运行状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default>
            <el-button link type="primary" size="small">查看</el-button>
            <el-button link type="warning" size="small">维护</el-button>
            <el-button link type="danger" size="small">报修</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search, Plus, Monitor, SuccessFilled, Tools, WarningFilled } from '@element-plus/icons-vue'

const searchText = ref('')

const devices = ref([
  { deviceNo: 'DEV001', name: '冷藏柜A1', type: '冷藏设备', location: '厨房1区', purchaseDate: '2023-01-15', status: '正常' },
  { deviceNo: 'DEV002', name: '燃气灶B1', type: '烹饪设备', location: '厨房2区', purchaseDate: '2023-03-20', status: '正常' },
  { deviceNo: 'DEV003', name: '消毒柜C1', type: '消毒设备', location: '洗消间', purchaseDate: '2023-05-10', status: '需维护' },
  { deviceNo: 'DEV004', name: '油烟机D1', type: '通风设备', location: '厨房3区', purchaseDate: '2022-08-01', status: '故障' }
])

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    '正常': 'success',
    '需维护': 'warning',
    '故障': 'danger',
    '停用': 'info'
  }
  return colors[status] || 'info'
}
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

.stat-card.warning {
  border-left: 4px solid var(--el-color-warning);
}

.stat-card.danger {
  border-left: 4px solid var(--el-color-danger);
}
</style>

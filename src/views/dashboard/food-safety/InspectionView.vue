<template>
  <div class="inspection-view">
    <div class="page-header">
      <h2>安全检查</h2>
      <el-space>
        <el-button type="primary" :icon="Plus">新建检查</el-button>
        <el-button :icon="Download">导出记录</el-button>
      </el-space>
    </div>

    <el-row :gutter="16" class="stats-row">
      <el-col :xs="24" :sm="8">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="本月检查次数" :value="45">
            <template #prefix>
              <el-icon color="#409EFF"><Document /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="8">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="合格率" :value="98.5" suffix="%">
            <template #prefix>
              <el-icon color="#67C23A"><SuccessFilled /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="8">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="待整改项" :value="3">
            <template #prefix>
              <el-icon color="#F56C6C"><WarningFilled /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="hover" style="margin-top: 16px;">
      <el-table :data="inspections" style="width: 100%">
        <el-table-column label="检查项目" prop="item" />
        <el-table-column label="检查人" prop="inspector" width="120" />
        <el-table-column label="检查时间" prop="time" width="180" />
        <el-table-column label="检查结果" width="120">
          <template #default="{ row }">
            <el-tag :type="row.result === '合格' ? 'success' : 'danger'">
              {{ row.result }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default>
            <el-button link type="primary" size="small">查看</el-button>
            <el-button link type="warning" size="small">整改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Download, Document, SuccessFilled, WarningFilled } from '@element-plus/icons-vue'

const inspections = ref([
  { id: 1, item: '食材新鲜度检查', inspector: '张三', time: '2025-11-28 09:00', result: '合格' },
  { id: 2, item: '厨房卫生检查', inspector: '李四', time: '2025-11-28 08:30', result: '合格' },
  { id: 3, item: '冷藏设备温度检查', inspector: '王五', time: '2025-11-27 16:00', result: '不合格' },
  { id: 4, item: '餐具消毒检查', inspector: '赵六', time: '2025-11-27 14:00', result: '合格' }
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
</style>

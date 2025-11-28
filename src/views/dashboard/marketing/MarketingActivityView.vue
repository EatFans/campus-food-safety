<template>
  <div class="marketing-activity-view">
    <div class="page-header">
      <h2>营销活动</h2>
      <el-button type="primary" :icon="Plus">创建活动</el-button>
    </div>

    <el-row :gutter="16" class="stats-row">
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="进行中活动" :value="8" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="本月新增" :value="3" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="参与用户" :value="15680" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="活动收益" :value="89560" :precision="2" prefix="¥" />
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="hover" style="margin-top: 16px;">
      <el-table :data="activities" style="width: 100%">
        <el-table-column label="活动名称" prop="name" />
        <el-table-column label="活动类型" prop="type" width="120">
          <template #default="{ row }">
            <el-tag>{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" prop="startTime" width="180" />
        <el-table-column label="结束时间" prop="endTime" width="180" />
        <el-table-column label="参与人数" prop="participants" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default>
            <el-button link type="primary" size="small">查看</el-button>
            <el-button link type="warning" size="small">编辑</el-button>
            <el-button link type="danger" size="small">结束</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'

const activities = ref([
  { id: 1, name: '双十一狂欢节', type: '满减活动', startTime: '2025-11-11 00:00', endTime: '2025-11-11 23:59', participants: 5680, status: '已结束' },
  { id: 2, name: '新用户专享优惠', type: '折扣活动', startTime: '2025-11-01 00:00', endTime: '2025-11-30 23:59', participants: 3250, status: '进行中' },
  { id: 3, name: '会员日特惠', type: '会员活动', startTime: '2025-11-28 00:00', endTime: '2025-11-28 23:59', participants: 1890, status: '进行中' }
])

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    '进行中': 'success',
    '未开始': 'info',
    '已结束': 'info'
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
</style>

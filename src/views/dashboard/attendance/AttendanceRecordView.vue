<template>
  <div class="attendance-record-view">
    <div class="page-header">
      <h2>考勤记录</h2>
      <el-space>
        <el-date-picker v-model="selectedDate" type="date" placeholder="选择日期" />
        <el-select v-model="selectedDept" placeholder="选择部门" style="width: 150px;">
          <el-option label="全部部门" value="" />
          <el-option label="厨房部" value="kitchen" />
          <el-option label="服务部" value="service" />
          <el-option label="管理部" value="management" />
        </el-select>
        <el-button type="primary" :icon="Download">导出考勤</el-button>
      </el-space>
    </div>

    <el-row :gutter="16" class="stats-row">
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card success">
          <el-statistic title="正常出勤" :value="85" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card warning">
          <el-statistic title="迟到早退" :value="5" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card info">
          <el-statistic title="请假" :value="8" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card danger">
          <el-statistic title="缺勤" :value="2" />
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="hover" style="margin-top: 16px;">
      <el-table :data="attendanceRecords" style="width: 100%">
        <el-table-column label="员工姓名" prop="name" width="120" />
        <el-table-column label="部门" prop="department" width="120" />
        <el-table-column label="上班打卡" prop="checkIn" width="150" />
        <el-table-column label="下班打卡" prop="checkOut" width="150" />
        <el-table-column label="工作时长" prop="workHours" width="120" />
        <el-table-column label="考勤状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" />
        <el-table-column label="操作" width="150">
          <template #default>
            <el-button link type="primary" size="small">查看</el-button>
            <el-button link type="warning" size="small">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Download } from '@element-plus/icons-vue'

const selectedDate = ref(new Date())
const selectedDept = ref('')

const attendanceRecords = ref([
  { name: '张三', department: '厨房部', checkIn: '08:58', checkOut: '18:02', workHours: '9小时4分', status: '正常', remark: '' },
  { name: '李四', department: '服务部', checkIn: '09:15', checkOut: '18:00', workHours: '8小时45分', status: '迟到', remark: '迟到15分钟' },
  { name: '王五', department: '采购部', checkIn: '09:00', checkOut: '17:55', workHours: '8小时55分', status: '早退', remark: '早退5分钟' },
  { name: '赵六', department: '管理部', checkIn: '-', checkOut: '-', workHours: '-', status: '请假', remark: '事假' }
])

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    '正常': 'success',
    '迟到': 'warning',
    '早退': 'warning',
    '请假': 'info',
    '缺勤': 'danger'
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

.stat-card.info {
  border-left: 4px solid var(--el-color-info);
}

.stat-card.danger {
  border-left: 4px solid var(--el-color-danger);
}
</style>

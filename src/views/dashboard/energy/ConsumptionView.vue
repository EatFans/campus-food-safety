<template>
  <div class="consumption-view">
    <div class="page-header">
      <h2>能耗统计</h2>
    </div>

    <el-row :gutter="16" class="stats-row">
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card primary">
          <el-statistic title="本月总能耗" :value="stats.total" suffix="kWh" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card success">
          <el-statistic title="用水量" :value="stats.water" suffix="吨" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card warning">
          <el-statistic title="用电量" :value="stats.electricity" suffix="kWh" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card danger">
          <el-statistic title="燃气量" :value="stats.gas" suffix="m³" />
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="能源类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="用水" value="用水" />
                <el-option label="用电" value="用电" />
                <el-option label="燃气" value="燃气" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="统计时间">
              <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="large" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="search-actions">
            <el-button type="primary" size="large" :icon="Search" @click="handleSearch">搜索</el-button>
            <el-button size="large" :icon="Refresh" @click="handleReset">重置</el-button>
            <el-button size="large" :icon="Download">导出</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="table-card">
      <div class="table-toolbar">
        <h3>能耗明细</h3>
        <el-tooltip content="刷新" placement="top">
          <el-button circle :icon="Refresh" @click="handleRefresh" />
        </el-tooltip>
      </div>

      <el-table :data="consumptions" style="width: 100%" v-loading="loading" stripe border>
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="日期" prop="date" width="120" />
        <el-table-column label="能源类型" prop="type" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="用量" width="120" align="center">
          <template #default="{ row }">
            <el-text type="primary">{{ row.amount }} {{ row.unit }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="费用" width="120" align="right">
          <template #default="{ row }">
            <span class="cost-text">¥{{ row.cost }}</span>
          </template>
        </el-table-column>
        <el-table-column label="同比" width="100" align="center">
          <template #default="{ row }">
            <el-text :type="row.yearOnYear > 0 ? 'danger' : 'success'">{{ row.yearOnYear > 0 ? '+' : '' }}{{ row.yearOnYear }}%</el-text>
          </template>
        </el-table-column>
        <el-table-column label="环比" width="100" align="center">
          <template #default="{ row }">
            <el-text :type="row.monthOnMonth > 0 ? 'danger' : 'success'">{{ row.monthOnMonth > 0 ? '+' : '' }}{{ row.monthOnMonth }}%</el-text>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" min-width="150" show-overflow-tooltip />
      </el-table>

      <div class="pagination-container">
        <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize" :page-sizes="[10, 20, 50]" :total="pagination.total" layout="total, sizes, prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Refresh, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)

const stats = reactive({
  total: 15680,
  water: 856,
  electricity: 12450,
  gas: 2374
})

const searchForm = reactive({
  type: '',
  dateRange: []
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 90
})

const consumptions = ref([
  { id: 1, date: '2025-11-27', type: '用电', amount: 450, unit: 'kWh', cost: '360.00', yearOnYear: 5.2, monthOnMonth: -2.3, remark: '正常用电' },
  { id: 2, date: '2025-11-27', type: '用水', amount: 32, unit: '吨', cost: '128.00', yearOnYear: -3.5, monthOnMonth: 1.8, remark: '正常用水' },
  { id: 3, date: '2025-11-27', type: '燃气', amount: 85, unit: 'm³', cost: '255.00', yearOnYear: 2.1, monthOnMonth: -1.2, remark: '正常用气' },
  { id: 4, date: '2025-11-26', type: '用电', amount: 435, unit: 'kWh', cost: '348.00', yearOnYear: 4.8, monthOnMonth: -1.5, remark: '正常用电' },
  { id: 5, date: '2025-11-26', type: '用水', amount: 28, unit: '吨', cost: '112.00', yearOnYear: -2.8, monthOnMonth: 0.5, remark: '正常用水' },
  { id: 6, date: '2025-11-26', type: '燃气', amount: 78, unit: 'm³', cost: '234.00', yearOnYear: 1.5, monthOnMonth: -0.8, remark: '正常用气' },
  { id: 7, date: '2025-11-25', type: '用电', amount: 420, unit: 'kWh', cost: '336.00', yearOnYear: 3.2, monthOnMonth: -2.1, remark: '正常用电' },
  { id: 8, date: '2025-11-25', type: '用水', amount: 30, unit: '吨', cost: '120.00', yearOnYear: -1.5, monthOnMonth: 2.3, remark: '正常用水' },
  { id: 9, date: '2025-11-25', type: '燃气', amount: 82, unit: 'm³', cost: '246.00', yearOnYear: 2.8, monthOnMonth: 0.5, remark: '正常用气' },
  { id: 10, date: '2025-11-24', type: '用电', amount: 465, unit: 'kWh', cost: '372.00', yearOnYear: 6.5, monthOnMonth: 3.2, remark: '周末用电增加' }
])

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    ElMessage.success('搜索完成')
    loading.value = false
  }, 500)
}

const handleReset = () => {
  searchForm.type = ''
  searchForm.dateRange = []
  handleSearch()
}

const handleRefresh = () => {
  handleSearch()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
}

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    '用水': 'primary',
    '用电': 'warning',
    '燃气': 'danger'
  }
  return colors[type] || 'info'
}
</script>

<style scoped>
.consumption-view {
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

.stat-card.primary {
  border-left: 4px solid #409eff;
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

.search-card {
  margin-bottom: 16px;
  border-radius: 8px;
}

.search-card :deep(.el-card__body) {
  padding: 20px;
}

.search-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
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

.cost-text {
  color: #f56c6c;
  font-weight: 600;
  font-size: 15px;
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

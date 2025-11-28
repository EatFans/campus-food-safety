<template>
  <div class="operation-view">
    <div class="page-header">
      <h2>运营报表</h2>
    </div>

    <el-row :gutter="16" class="stats-row">
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="日均客流" :value="stats.avgCustomers" suffix="人" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="翻台率" :value="stats.turnoverRate" suffix="次/天" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="满意度" :value="stats.satisfaction" suffix="%" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="投诉率" :value="stats.complaintRate" suffix="%" />
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="统计维度">
              <el-select v-model="searchForm.dimension" placeholder="请选择维度" size="large" style="width: 100%;">
                <el-option label="按日统计" value="day" />
                <el-option label="按周统计" value="week" />
                <el-option label="按月统计" value="month" />
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
            <el-button type="primary" size="large" :icon="Search" @click="handleSearch">查询</el-button>
            <el-button size="large" :icon="Refresh" @click="handleReset">重置</el-button>
            <el-button size="large" :icon="Download">导出</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="table-card">
      <div class="table-toolbar">
        <h3>运营数据</h3>
      </div>

      <el-table :data="operationData" style="width: 100%" v-loading="loading" stripe border>
        <el-table-column label="日期" prop="date" width="120" />
        <el-table-column label="客流量" width="120" align="center">
          <template #default="{ row }">
            <el-text type="primary">{{ row.customers }}人</el-text>
          </template>
        </el-table-column>
        <el-table-column label="翻台率" width="120" align="center">
          <template #default="{ row }">
            {{ row.turnoverRate }}次
          </template>
        </el-table-column>
        <el-table-column label="上座率" width="120" align="center">
          <template #default="{ row }">
            <el-text :type="row.occupancyRate > 80 ? 'success' : 'warning'">{{ row.occupancyRate }}%</el-text>
          </template>
        </el-table-column>
        <el-table-column label="满意度" width="120" align="center">
          <template #default="{ row }">
            <el-text type="success">{{ row.satisfaction }}%</el-text>
          </template>
        </el-table-column>
        <el-table-column label="投诉数" width="120" align="center">
          <template #default="{ row }">
            <el-text :type="row.complaints > 0 ? 'danger' : 'success'">{{ row.complaints }}次</el-text>
          </template>
        </el-table-column>
        <el-table-column label="菜品好评率" width="120" align="center">
          <template #default="{ row }">
            {{ row.dishRating }}%
          </template>
        </el-table-column>
        <el-table-column label="服务好评率" width="120" align="center">
          <template #default="{ row }">
            {{ row.serviceRating }}%
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
  avgCustomers: 342,
  turnoverRate: 3.2,
  satisfaction: 95.8,
  complaintRate: 0.5
})

const searchForm = reactive({
  dimension: 'day',
  dateRange: []
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 30
})

const operationData = ref([
  { id: 1, date: '2025-11-28', customers: 342, turnoverRate: 3.2, occupancyRate: 85, satisfaction: 96, complaints: 1, dishRating: 95, serviceRating: 97, remark: '正常运营' },
  { id: 2, date: '2025-11-27', customers: 325, turnoverRate: 3.1, occupancyRate: 82, satisfaction: 95, complaints: 2, dishRating: 94, serviceRating: 96, remark: '正常运营' },
  { id: 3, date: '2025-11-26', customers: 312, turnoverRate: 3.0, occupancyRate: 78, satisfaction: 96, complaints: 1, dishRating: 96, serviceRating: 96, remark: '正常运营' },
  { id: 4, date: '2025-11-25', customers: 318, turnoverRate: 3.1, occupancyRate: 80, satisfaction: 95, complaints: 0, dishRating: 95, serviceRating: 95, remark: '正常运营' },
  { id: 5, date: '2025-11-24', customers: 385, turnoverRate: 3.5, occupancyRate: 92, satisfaction: 97, complaints: 0, dishRating: 97, serviceRating: 97, remark: '周末客流高峰' },
  { id: 6, date: '2025-11-23', customers: 356, turnoverRate: 3.3, occupancyRate: 88, satisfaction: 96, complaints: 1, dishRating: 96, serviceRating: 96, remark: '周末客流高峰' },
  { id: 7, date: '2025-11-22', customers: 335, turnoverRate: 3.2, occupancyRate: 84, satisfaction: 95, complaints: 2, dishRating: 94, serviceRating: 96, remark: '正常运营' },
  { id: 8, date: '2025-11-21', customers: 322, turnoverRate: 3.1, occupancyRate: 81, satisfaction: 96, complaints: 1, dishRating: 96, serviceRating: 96, remark: '正常运营' },
  { id: 9, date: '2025-11-20', customers: 314, turnoverRate: 3.0, occupancyRate: 79, satisfaction: 95, complaints: 0, dishRating: 95, serviceRating: 95, remark: '正常运营' },
  { id: 10, date: '2025-11-19', customers: 319, turnoverRate: 3.1, occupancyRate: 80, satisfaction: 96, complaints: 1, dishRating: 96, serviceRating: 96, remark: '正常运营' }
])

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    ElMessage.success('查询完成')
    loading.value = false
  }, 500)
}

const handleReset = () => {
  searchForm.dimension = 'day'
  searchForm.dateRange = []
  handleSearch()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
}
</script>

<style scoped>
.operation-view {
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
  border-left: 4px solid #409eff;
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

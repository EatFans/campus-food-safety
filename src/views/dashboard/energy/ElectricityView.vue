<template>
  <div class="electricity-view">
    <div class="page-header">
      <div class="header-left">
        <h2>用电管理</h2>
        <span class="subtitle">本月用电 {{ stats.total }} kWh</span>
      </div>
    </div>

    <el-row :gutter="16" class="stats-row">
      <el-col :xs="24" :sm="8">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="本月用电" :value="stats.total" suffix="kWh" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="8">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="本月费用" :value="stats.cost" prefix="¥" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="8">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="环比" :value="stats.change" suffix="%" />
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="抄表日期">
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
        <h3>用电记录</h3>
        <el-button type="primary" :icon="Plus" @click="handleAdd">添加记录</el-button>
      </div>

      <el-table :data="records" style="width: 100%" v-loading="loading" stripe border>
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="抄表日期" prop="date" width="120" />
        <el-table-column label="上次读数" width="120" align="center">
          <template #default="{ row }">
            <el-text>{{ row.lastReading }} kWh</el-text>
          </template>
        </el-table-column>
        <el-table-column label="本次读数" width="120" align="center">
          <template #default="{ row }">
            <el-text type="primary">{{ row.currentReading }} kWh</el-text>
          </template>
        </el-table-column>
        <el-table-column label="用电量" width="120" align="center">
          <template #default="{ row }">
            <el-text type="success">{{ row.usage }} kWh</el-text>
          </template>
        </el-table-column>
        <el-table-column label="单价" width="100" align="right">
          <template #default="{ row }">
            ¥{{ row.price }}/kWh
          </template>
        </el-table-column>
        <el-table-column label="费用" width="120" align="right">
          <template #default="{ row }">
            <span class="cost-text">¥{{ row.cost }}</span>
          </template>
        </el-table-column>
        <el-table-column label="抄表人" prop="recorder" width="100" />
        <el-table-column label="备注" prop="remark" min-width="150" show-overflow-tooltip />
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small" :icon="View">详情</el-button>
            <el-button link type="warning" size="small" :icon="Edit">编辑</el-button>
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
import { Search, Plus, Refresh, Download, Edit, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)

const stats = reactive({
  total: 12450,
  cost: 9960,
  change: 3.2
})

const searchForm = reactive({
  dateRange: []
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 30
})

const records = ref([
  { id: 1, date: '2025-11-28', lastReading: 85600, currentReading: 86050, usage: 450, price: '0.80', cost: '360.00', recorder: '李四', remark: '正常抄表' },
  { id: 2, date: '2025-11-27', lastReading: 85165, currentReading: 85600, usage: 435, price: '0.80', cost: '348.00', recorder: '李四', remark: '正常抄表' },
  { id: 3, date: '2025-11-26', lastReading: 84745, currentReading: 85165, usage: 420, price: '0.80', cost: '336.00', recorder: '王五', remark: '正常抄表' },
  { id: 4, date: '2025-11-25', lastReading: 84280, currentReading: 84745, usage: 465, price: '0.80', cost: '372.00', recorder: '李四', remark: '周末用电增加' },
  { id: 5, date: '2025-11-24', lastReading: 83840, currentReading: 84280, usage: 440, price: '0.80', cost: '352.00', recorder: '王五', remark: '周末用电' },
  { id: 6, date: '2025-11-23', lastReading: 83395, currentReading: 83840, usage: 445, price: '0.80', cost: '356.00', recorder: '李四', remark: '正常抄表' },
  { id: 7, date: '2025-11-22', lastReading: 82970, currentReading: 83395, usage: 425, price: '0.80', cost: '340.00', recorder: '王五', remark: '正常抄表' },
  { id: 8, date: '2025-11-21', lastReading: 82540, currentReading: 82970, usage: 430, price: '0.80', cost: '344.00', recorder: '李四', remark: '正常抄表' },
  { id: 9, date: '2025-11-20', lastReading: 82095, currentReading: 82540, usage: 445, price: '0.80', cost: '356.00', recorder: '王五', remark: '正常抄表' },
  { id: 10, date: '2025-11-19', lastReading: 81650, currentReading: 82095, usage: 445, price: '0.80', cost: '356.00', recorder: '李四', remark: '正常抄表' }
])

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    ElMessage.success('搜索完成')
    loading.value = false
  }, 500)
}

const handleReset = () => {
  searchForm.dateRange = []
  handleSearch()
}

const handleAdd = () => {
  ElMessage.info('添加记录功能')
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
}
</script>

<style scoped>
.electricity-view {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.page-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #303133;
}

.subtitle {
  font-size: 14px;
  color: #909399;
}

.stats-row {
  margin-bottom: 16px;
}

.stat-card {
  text-align: center;
  border-radius: 8px;
  border-left: 4px solid #e6a23c;
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

:deep(.el-button + .el-button) {
  margin-left: 8px;
}
</style>

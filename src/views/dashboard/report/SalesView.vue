<template>
  <div class="sales-view">
    <div class="page-header">
      <h2>销售报表</h2>
    </div>

    <el-row :gutter="16" class="stats-row">
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card primary">
          <el-statistic title="今日销售额" :value="stats.todaySales" prefix="¥" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card success">
          <el-statistic title="本月销售额" :value="stats.monthSales" prefix="¥" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card warning">
          <el-statistic title="今日订单" :value="stats.todayOrders" suffix="单" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card danger">
          <el-statistic title="本月订单" :value="stats.monthOrders" suffix="单" />
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
                <el-option label="按月统计" value="month" />
                <el-option label="按年统计" value="year" />
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
        <h3>销售明细</h3>
      </div>

      <el-table :data="salesData" style="width: 100%" v-loading="loading" stripe border show-summary>
        <el-table-column label="日期" prop="date" width="120" />
        <el-table-column label="销售额" width="150" align="right">
          <template #default="{ row }">
            <span class="amount-text">¥{{ row.sales }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单数" width="120" align="center">
          <template #default="{ row }">
            <el-text type="primary">{{ row.orders }}单</el-text>
          </template>
        </el-table-column>
        <el-table-column label="客单价" width="150" align="right">
          <template #default="{ row }">
            ¥{{ row.avgPrice }}
          </template>
        </el-table-column>
        <el-table-column label="会员消费" width="150" align="right">
          <template #default="{ row }">
            ¥{{ row.memberSales }}
          </template>
        </el-table-column>
        <el-table-column label="非会员消费" width="150" align="right">
          <template #default="{ row }">
            ¥{{ row.nonMemberSales }}
          </template>
        </el-table-column>
        <el-table-column label="环比" width="120" align="center">
          <template #default="{ row }">
            <el-text :type="row.change > 0 ? 'success' : 'danger'">{{ row.change > 0 ? '+' : '' }}{{ row.change }}%</el-text>
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
  todaySales: 28560,
  monthSales: 856800,
  todayOrders: 342,
  monthOrders: 10245
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

const salesData = ref([
  { id: 1, date: '2025-11-28', sales: '28560.00', orders: 342, avgPrice: '83.51', memberSales: '18650.00', nonMemberSales: '9910.00', change: 5.2, remark: '正常营业' },
  { id: 2, date: '2025-11-27', sales: '27150.00', orders: 325, avgPrice: '83.54', memberSales: '17680.00', nonMemberSales: '9470.00', change: 3.8, remark: '正常营业' },
  { id: 3, date: '2025-11-26', sales: '26180.00', orders: 312, avgPrice: '83.91', memberSales: '17120.00', nonMemberSales: '9060.00', change: -2.1, remark: '正常营业' },
  { id: 4, date: '2025-11-25', sales: '26750.00', orders: 318, avgPrice: '84.12', memberSales: '17450.00', nonMemberSales: '9300.00', change: 1.5, remark: '正常营业' },
  { id: 5, date: '2025-11-24', sales: '32450.00', orders: 385, avgPrice: '84.29', memberSales: '21190.00', nonMemberSales: '11260.00', change: 8.5, remark: '周末客流增加' },
  { id: 6, date: '2025-11-23', sales: '29920.00', orders: 356, avgPrice: '84.04', memberSales: '19550.00', nonMemberSales: '10370.00', change: 6.2, remark: '周末客流增加' },
  { id: 7, date: '2025-11-22', sales: '28170.00', orders: 335, avgPrice: '84.09', memberSales: '18410.00', nonMemberSales: '9760.00', change: 4.3, remark: '正常营业' },
  { id: 8, date: '2025-11-21', sales: '27010.00', orders: 322, avgPrice: '83.88', memberSales: '17660.00', nonMemberSales: '9350.00', change: 2.8, remark: '正常营业' },
  { id: 9, date: '2025-11-20', sales: '26280.00', orders: 314, avgPrice: '83.69', memberSales: '17180.00', nonMemberSales: '9100.00', change: -1.5, remark: '正常营业' },
  { id: 10, date: '2025-11-19', sales: '26680.00', orders: 319, avgPrice: '83.64', memberSales: '17440.00', nonMemberSales: '9240.00', change: 0.8, remark: '正常营业' }
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
.sales-view {
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
  margin-bottom: 16px;
}

.table-toolbar h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.amount-text {
  color: #67c23a;
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

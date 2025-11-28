<template>
  <div class="finance-view">
    <div class="page-header">
      <h2>财务报表</h2>
    </div>

    <el-row :gutter="16" class="stats-row">
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="本月收入" :value="stats.income" prefix="¥" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="本月支出" :value="stats.expense" prefix="¥" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="本月利润" :value="stats.profit" prefix="¥" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="利润率" :value="stats.profitRate" suffix="%" />
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="报表类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" size="large" style="width: 100%;">
                <el-option label="收支明细" value="detail" />
                <el-option label="成本分析" value="cost" />
                <el-option label="利润分析" value="profit" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="统计时间">
              <el-date-picker v-model="searchForm.dateRange" type="monthrange" range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份" size="large" style="width: 100%;" />
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
        <h3>财务明细</h3>
      </div>

      <el-table :data="financeData" style="width: 100%" v-loading="loading" stripe border show-summary>
        <el-table-column label="月份" prop="month" width="120" />
        <el-table-column label="营业收入" width="150" align="right">
          <template #default="{ row }">
            <span class="income-text">¥{{ row.income }}</span>
          </template>
        </el-table-column>
        <el-table-column label="食材成本" width="150" align="right">
          <template #default="{ row }">
            ¥{{ row.materialCost }}
          </template>
        </el-table-column>
        <el-table-column label="人工成本" width="150" align="right">
          <template #default="{ row }">
            ¥{{ row.laborCost }}
          </template>
        </el-table-column>
        <el-table-column label="能源成本" width="150" align="right">
          <template #default="{ row }">
            ¥{{ row.energyCost }}
          </template>
        </el-table-column>
        <el-table-column label="其他支出" width="150" align="right">
          <template #default="{ row }">
            ¥{{ row.otherCost }}
          </template>
        </el-table-column>
        <el-table-column label="净利润" width="150" align="right">
          <template #default="{ row }">
            <span class="profit-text">¥{{ row.profit }}</span>
          </template>
        </el-table-column>
        <el-table-column label="利润率" width="100" align="center">
          <template #default="{ row }">
            <el-text type="success">{{ row.profitRate }}%</el-text>
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
import { Search, Refresh, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)

const stats = reactive({
  income: 856800,
  expense: 598760,
  profit: 258040,
  profitRate: 30.1
})

const searchForm = reactive({
  type: 'detail',
  dateRange: []
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 12
})

const financeData = ref([
  { id: 1, month: '2025-11', income: '856800.00', materialCost: '385560.00', laborCost: '128520.00', energyCost: '42840.00', otherCost: '41840.00', profit: '258040.00', profitRate: 30.1 },
  { id: 2, month: '2025-10', income: '832500.00', materialCost: '374625.00', laborCost: '124875.00', energyCost: '41625.00', otherCost: '40625.00', profit: '250750.00', profitRate: 30.1 },
  { id: 3, month: '2025-09', income: '798600.00', materialCost: '359370.00', laborCost: '119790.00', energyCost: '39930.00', otherCost: '38930.00', profit: '240580.00', profitRate: 30.1 },
  { id: 4, month: '2025-08', income: '845200.00', materialCost: '380340.00', laborCost: '126780.00', energyCost: '42260.00', otherCost: '41260.00', profit: '254560.00', profitRate: 30.1 },
  { id: 5, month: '2025-07', income: '812300.00', materialCost: '365535.00', laborCost: '121845.00', energyCost: '40615.00', otherCost: '39615.00', profit: '244690.00', profitRate: 30.1 },
  { id: 6, month: '2025-06', income: '789400.00', materialCost: '355230.00', laborCost: '118410.00', energyCost: '39470.00', otherCost: '38470.00', profit: '237820.00', profitRate: 30.1 },
  { id: 7, month: '2025-05', income: '825600.00', materialCost: '371520.00', laborCost: '123840.00', energyCost: '41280.00', otherCost: '40280.00', profit: '248680.00', profitRate: 30.1 },
  { id: 8, month: '2025-04', income: '795800.00', materialCost: '358110.00', laborCost: '119370.00', energyCost: '39790.00', otherCost: '38790.00', profit: '239740.00', profitRate: 30.1 },
  { id: 9, month: '2025-03', income: '812500.00', materialCost: '365625.00', laborCost: '121875.00', energyCost: '40625.00', otherCost: '39625.00', profit: '244750.00', profitRate: 30.1 },
  { id: 10, month: '2025-02', income: '685200.00', materialCost: '308340.00', laborCost: '102780.00', energyCost: '34260.00', otherCost: '33260.00', profit: '206560.00', profitRate: 30.1 }
])

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    ElMessage.success('查询完成')
    loading.value = false
  }, 500)
}

const handleReset = () => {
  searchForm.type = 'detail'
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
.finance-view {
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

.income-text {
  color: #67c23a;
  font-weight: 600;
  font-size: 15px;
}

.profit-text {
  color: #409eff;
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

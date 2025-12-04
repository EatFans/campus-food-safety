<template>
  <div class="inventory-report-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2>出入库报表</h2>
        <p class="header-desc">库存进出数据统计分析与报表生成</p>
      </div>
      <el-space>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 240px"
          @change="handleDateChange"
        />
        <el-button type="primary" :icon="Refresh" @click="refreshData">刷新</el-button>
        <el-button type="success" :icon="Download" @click="exportReport">导出报表</el-button>
        <el-button :icon="Printer" @click="printReport">打印</el-button>
      </el-space>
    </div>

    <!-- 数据概览卡片 -->
    <el-row :gutter="16" class="overview-section">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover" class="stat-card inbound">
          <div class="stat-content">
            <div class="stat-left">
              <div class="stat-icon">
                <el-icon><TrendCharts /></el-icon>
              </div>
            </div>
            <div class="stat-right">
              <div class="stat-label">入库总量</div>
              <div class="stat-value">{{ inboundTotal }}</div>
              <div class="stat-trend">
                <el-icon color="#67C23A"><CaretTop /></el-icon>
                <span class="trend-text">较上期 +12.5%</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover" class="stat-card outbound">
          <div class="stat-content">
            <div class="stat-left">
              <div class="stat-icon">
                <el-icon><Sell /></el-icon>
              </div>
            </div>
            <div class="stat-right">
              <div class="stat-label">出库总量</div>
              <div class="stat-value">{{ outboundTotal }}</div>
              <div class="stat-trend">
                <el-icon color="#F56C6C"><CaretBottom /></el-icon>
                <span class="trend-text">较上期 -5.3%</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover" class="stat-card inventory">
          <div class="stat-content">
            <div class="stat-left">
              <div class="stat-icon">
                <el-icon><Box /></el-icon>
              </div>
            </div>
            <div class="stat-right">
              <div class="stat-label">当前库存</div>
              <div class="stat-value">{{ currentInventory }}</div>
              <div class="stat-trend">
                <el-icon color="#409EFF"><Minus /></el-icon>
                <span class="trend-text">库存正常</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover" class="stat-card turnover">
          <div class="stat-content">
            <div class="stat-left">
              <div class="stat-icon">
                <el-icon><DataAnalysis /></el-icon>
              </div>
            </div>
            <div class="stat-right">
              <div class="stat-label">周转率</div>
              <div class="stat-value">{{ turnoverRate }}%</div>
              <div class="stat-trend">
                <el-icon color="#67C23A"><CaretTop /></el-icon>
                <span class="trend-text">效率提升</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表展示区域 -->
    <el-row :gutter="16" class="chart-section">
      <el-col :xs="24" :md="16">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">出入库趋势分析</span>
              <el-radio-group v-model="trendPeriod" size="small">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="quarter">本季</el-radio-button>
                <el-radio-button label="year">本年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container" style="height: 300px;">
            <el-empty description="图表组件待集成 (ECharts)" />
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="8">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <span class="card-title">库存分类占比</span>
          </template>
          <div class="chart-container" style="height: 300px;">
            <el-empty description="饼图待集成" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 筛选条件 -->
    <el-card shadow="hover" class="filter-card">
      <el-form :model="filterForm" inline>
        <el-form-item label="报表类型">
          <el-select v-model="filterForm.reportType" placeholder="选择类型" style="width: 130px">
            <el-option label="入库报表" value="inbound" />
            <el-option label="出库报表" value="outbound" />
            <el-option label="库存报表" value="inventory" />
            <el-option label="综合报表" value="comprehensive" />
          </el-select>
        </el-form-item>
        <el-form-item label="物料分类">
          <el-select v-model="filterForm.category" placeholder="全部分类" clearable style="width: 130px">
            <el-option label="蔬菜类" value="vegetables" />
            <el-option label="肉类" value="meat" />
            <el-option label="水产类" value="seafood" />
            <el-option label="粮油类" value="grains" />
            <el-option label="调料类" value="seasoning" />
          </el-select>
        </el-form-item>
        <el-form-item label="仓库">
          <el-select v-model="filterForm.warehouse" placeholder="全部仓库" clearable style="width: 130px">
            <el-option label="冷库A" value="cold_a" />
            <el-option label="冷库B" value="cold_b" />
            <el-option label="常温库" value="normal" />
            <el-option label="冷冻库" value="freezer" />
          </el-select>
        </el-form-item>
        <el-form-item label="供应商">
          <el-input v-model="filterForm.supplier" placeholder="供应商名称" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleFilter">查询</el-button>
          <el-button :icon="RefreshLeft" @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 报表数据表格 -->
    <el-card shadow="hover" class="table-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">详细数据列表</span>
          <el-space>
            <el-button size="small" :icon="Grid" @click="viewMode = 'table'">表格视图</el-button>
            <el-button size="small" :icon="List" @click="viewMode = 'list'">列表视图</el-button>
          </el-space>
        </div>
      </template>

      <el-table :data="reportData" v-loading="loading" stripe border style="width: 100%">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="日期" prop="date" width="120" align="center" />
        <el-table-column label="单据号" prop="orderNo" width="150" />
        <el-table-column label="类型" prop="type" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.type === 'inbound' ? 'success' : 'warning'" size="small">
              {{ row.type === 'inbound' ? '入库' : '出库' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="物料名称" prop="materialName" width="150" />
        <el-table-column label="分类" prop="category" width="100" />
        <el-table-column label="数量" prop="quantity" width="100" align="right">
          <template #default="{ row }">
            <span :class="row.type === 'inbound' ? 'text-success' : 'text-warning'">
              {{ row.type === 'inbound' ? '+' : '-' }}{{ row.quantity }} {{ row.unit }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="单价" prop="unitPrice" width="100" align="right">
          <template #default="{ row }">
            ¥{{ row.unitPrice }}
          </template>
        </el-table-column>
        <el-table-column label="金额" prop="totalAmount" width="120" align="right">
          <template #default="{ row }">
            <span class="amount-text">¥{{ row.totalAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="仓库" prop="warehouse" width="100" />
        <el-table-column label="供应商/领用部门" prop="partner" width="150" show-overflow-tooltip />
        <el-table-column label="经办人" prop="handler" width="100" />
        <el-table-column label="状态" prop="status" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="viewDetail(row)">详情</el-button>
            <el-button link type="info" size="small" @click="printOrder(row)">打印</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 汇总统计 -->
    <el-card shadow="hover" class="summary-card">
      <template #header>
        <span class="card-title">数据汇总</span>
      </template>
      <el-row :gutter="16">
        <el-col :span="6">
          <div class="summary-item">
            <span class="summary-label">入库总金额：</span>
            <span class="summary-value inbound">¥{{ summaryData.inboundAmount }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="summary-item">
            <span class="summary-label">出库总金额：</span>
            <span class="summary-value outbound">¥{{ summaryData.outboundAmount }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="summary-item">
            <span class="summary-label">库存总值：</span>
            <span class="summary-value inventory">¥{{ summaryData.inventoryValue }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="summary-item">
            <span class="summary-label">周转次数：</span>
            <span class="summary-value">{{ summaryData.turnoverTimes }} 次</span>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Refresh, Download, Printer, Search, RefreshLeft, Grid, List,
  TrendCharts, Sell, Box, DataAnalysis, CaretTop, CaretBottom, Minus
} from '@element-plus/icons-vue'

interface ReportItem {
  id: string
  date: string
  orderNo: string
  type: 'inbound' | 'outbound'
  materialName: string
  category: string
  quantity: number
  unit: string
  unitPrice: number
  totalAmount: number
  warehouse: string
  partner: string
  handler: string
  status: string
}

const loading = ref(false)
const viewMode = ref('table')
const dateRange = ref<[Date, Date]>([new Date(2025, 11, 1), new Date(2025, 11, 4)])
const trendPeriod = ref('month')

const inboundTotal = ref('2,856')
const outboundTotal = ref('2,134')
const currentInventory = ref('1,245')
const turnoverRate = ref('85.6')

const filterForm = reactive({
  reportType: 'comprehensive',
  category: '',
  warehouse: '',
  supplier: ''
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})

const summaryData = reactive({
  inboundAmount: '458,920.00',
  outboundAmount: '342,560.00',
  inventoryValue: '286,450.00',
  turnoverTimes: 12
})

const reportData = ref<ReportItem[]>([
  {
    id: '1',
    date: '2025-12-04',
    orderNo: 'IN20251204001',
    type: 'inbound',
    materialName: '西红柿',
    category: '蔬菜类',
    quantity: 50,
    unit: 'kg',
    unitPrice: 8.5,
    totalAmount: 425,
    warehouse: '冷库A',
    partner: '绿色蔬菜供应商',
    handler: '张三',
    status: 'completed'
  },
  {
    id: '2',
    date: '2025-12-04',
    orderNo: 'OUT20251204001',
    type: 'outbound',
    materialName: '猪肉',
    category: '肉类',
    quantity: 30,
    unit: 'kg',
    unitPrice: 35,
    totalAmount: 1050,
    warehouse: '冷冻库',
    partner: '厨房A区',
    handler: '李四',
    status: 'completed'
  },
  {
    id: '3',
    date: '2025-12-03',
    orderNo: 'IN20251203002',
    type: 'inbound',
    materialName: '大米',
    category: '粮油类',
    quantity: 100,
    unit: 'kg',
    unitPrice: 6.8,
    totalAmount: 680,
    warehouse: '常温库',
    partner: '优质粮油供应商',
    handler: '王五',
    status: 'completed'
  }
])

const getStatusType = (status: string) => {
  const types: Record<string, any> = {
    completed: 'success',
    pending: 'warning',
    cancelled: 'info'
  }
  return types[status] || 'info'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    completed: '已完成',
    pending: '待审核',
    cancelled: '已取消'
  }
  return texts[status] || '未知'
}

const handleDateChange = () => {
  ElMessage.success('日期范围已更新')
}

const refreshData = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据已刷新')
  }, 1000)
}

const exportReport = () => {
  ElMessage.success('报表导出功能开发中...')
}

const printReport = () => {
  ElMessage.success('打印功能开发中...')
}

const handleFilter = () => {
  ElMessage.success('筛选条件已应用')
}

const resetFilter = () => {
  Object.assign(filterForm, {
    reportType: 'comprehensive',
    category: '',
    warehouse: '',
    supplier: ''
  })
  ElMessage.success('筛选条件已重置')
}

const viewDetail = (row: ReportItem) => {
  ElMessage.info(`查看详情: ${row.orderNo}`)
}

const printOrder = (row: ReportItem) => {
  ElMessage.info(`打印单据: ${row.orderNo}`)
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
}

onMounted(() => {
  pagination.total = reportData.value.length
})
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #EBEEF5;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.header-left h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.header-desc {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.overview-section {
  margin-bottom: 16px;
}

.stat-card {
  border-radius: 12px;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 10px;
}

.stat-left {
  margin-right: 16px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.stat-card.inbound .stat-icon {
  background: #67C23A;
  color: white;
}

.stat-card.outbound .stat-icon {
  background: #E6A23C;
  color: white;
}

.stat-card.inventory .stat-icon {
  background: #409EFF;
  color: white;
}

.stat-card.turnover .stat-icon {
  background: #909399;
  color: white;
}

.stat-right {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
  display: block;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-trend {
  display: flex;
  align-items: center;
  font-size: 12px;
}

.trend-text {
  margin-left: 4px;
  color: #909399;
}

.chart-section {
  margin-bottom: 16px;
}

.chart-card {
  border-radius: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.chart-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-card {
  margin-bottom: 16px;
  border-radius: 12px;
}

.table-card {
  margin-bottom: 16px;
  border-radius: 12px;
}

.text-success {
  color: #67C23A;
  font-weight: 600;
}

.text-warning {
  color: #E6A23C;
  font-weight: 600;
}

.amount-text {
  font-weight: 600;
  color: #303133;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.summary-card {
  border-radius: 12px;
  background: #F5F7FA;
}

.summary-item {
  padding: 16px;
  text-align: center;
}

.summary-label {
  font-size: 14px;
  color: #606266;
  display: block;
  margin-bottom: 8px;
}

.summary-value {
  font-size: 24px;
  font-weight: bold;
  display: block;
}

.summary-value.inbound {
  color: #67C23A;
}

.summary-value.outbound {
  color: #E6A23C;
}

.summary-value.inventory {
  color: #409EFF;
}
</style>

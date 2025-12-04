<template>
  <div class="inventory-analysis">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2>出入库分析</h2>
        <p class="header-desc">实时监控库存流动趋势，智能预测库存需求</p>
      </div>
      <div class="header-right">
        <el-space>
          <el-select v-model="timeRange" placeholder="选择时间范围" style="width: 150px">
            <el-option label="近7天" value="7days" />
            <el-option label="近30天" value="30days" />
            <el-option label="近3个月" value="3months" />
            <el-option label="近1年" value="1year" />
          </el-select>
          <el-button type="primary" :icon="Refresh" @click="refreshData">刷新数据</el-button>
          <el-button :icon="Download">导出报告</el-button>
        </el-space>
      </div>
    </div>

    <!-- 核心指标看板 -->
    <el-row :gutter="16" class="metrics-section">
      <el-col :span="6">
        <el-card class="metric-card inbound" shadow="hover">
          <div class="metric-content">
            <div class="metric-icon">
              <el-icon><Download /></el-icon>
            </div>
            <div class="metric-info">
              <div class="metric-label">总入库量</div>
              <div class="metric-value">{{ formatNumber(metrics.totalInbound) }}</div>
              <div class="metric-trend up">
                <el-icon><TrendCharts /></el-icon>
                <span>较上期 +12.5%</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="metric-card outbound" shadow="hover">
          <div class="metric-content">
            <div class="metric-icon">
              <el-icon><Upload /></el-icon>
            </div>
            <div class="metric-info">
              <div class="metric-label">总出库量</div>
              <div class="metric-value">{{ formatNumber(metrics.totalOutbound) }}</div>
              <div class="metric-trend down">
                <el-icon><TrendCharts /></el-icon>
                <span>较上期 -5.3%</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="metric-card stock" shadow="hover">
          <div class="metric-content">
            <div class="metric-icon">
              <el-icon><Box /></el-icon>
            </div>
            <div class="metric-info">
              <div class="metric-label">当前库存</div>
              <div class="metric-value">{{ formatNumber(metrics.currentStock) }}</div>
              <div class="metric-trend normal">
                <el-icon><TrendCharts /></el-icon>
                <span>库存正常</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="metric-card turnover" shadow="hover">
          <div class="metric-content">
            <div class="metric-icon">
              <el-icon><RefreshRight /></el-icon>
            </div>
            <div class="metric-info">
              <div class="metric-label">周转率</div>
              <div class="metric-value">{{ metrics.turnoverRate }}%</div>
              <div class="metric-trend up">
                <el-icon><TrendCharts /></el-icon>
                <span>较上期 +8.2%</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据流动可视化 -->
    <el-row :gutter="16" class="flow-section">
      <el-col :span="16">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">出入库趋势分析</span>
              <el-radio-group v-model="chartType" size="small">
                <el-radio-button label="line">折线图</el-radio-button>
                <el-radio-button label="bar">柱状图</el-radio-button>
                <el-radio-button label="area">面积图</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container" style="height: 350px;">
            <v-chart :option="trendChartOption" autoresize />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <span class="card-title">库存结构分布</span>
          </template>
          <div class="chart-container" style="height: 350px;">
            <v-chart :option="pieChartOption" autoresize />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 分类数据分析 -->
    <el-row :gutter="16" class="category-section">
      <el-col :span="24">
        <el-card class="data-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">分类出入库详情</span>
              <el-space>
                <el-input
                  v-model="searchKeyword"
                  placeholder="搜索分类"
                  :prefix-icon="Search"
                  style="width: 200px"
                  clearable
                />
                <el-button :icon="Filter">筛选</el-button>
              </el-space>
            </div>
          </template>
          
          <el-table :data="categoryData" stripe style="width: 100%">
            <el-table-column prop="category" label="食材分类" width="150">
              <template #default="{ row }">
                <div class="category-cell">
                  <el-tag :type="getCategoryTagType(row.category)">{{ row.category }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="inbound" label="入库量 (kg)" width="120" sortable>
              <template #default="{ row }">
                <span class="number-cell">{{ formatNumber(row.inbound) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="outbound" label="出库量 (kg)" width="120" sortable>
              <template #default="{ row }">
                <span class="number-cell">{{ formatNumber(row.outbound) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="stock" label="当前库存 (kg)" width="130" sortable>
              <template #default="{ row }">
                <span class="number-cell">{{ formatNumber(row.stock) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="库存状态" width="150">
              <template #default="{ row }">
                <el-progress
                  :percentage="row.stockPercentage"
                  :color="getProgressColor(row.stockPercentage)"
                  :stroke-width="12"
                />
              </template>
            </el-table-column>
            <el-table-column prop="turnover" label="周转天数" width="100" sortable>
              <template #default="{ row }">
                <el-tag :type="getTurnoverTagType(row.turnover)" size="small">
                  {{ row.turnover }}天
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="趋势" width="100">
              <template #default="{ row }">
                <div class="trend-cell" :class="row.trend">
                  <el-icon v-if="row.trend === 'up'"><CaretTop /></el-icon>
                  <el-icon v-else-if="row.trend === 'down'"><CaretBottom /></el-icon>
                  <el-icon v-else><Minus /></el-icon>
                  <span>{{ getTrendText(row.trend) }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="预警" width="100">
              <template #default="{ row }">
                <el-badge v-if="row.warning" :value="row.warning" type="danger">
                  <el-icon color="#F56C6C" :size="20"><Warning /></el-icon>
                </el-badge>
                <el-icon v-else color="#67C23A" :size="20"><SuccessFilled /></el-icon>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" size="small" @click="viewDetail(row)">
                  查看详情
                </el-button>
                <el-button link type="primary" size="small" @click="viewTrend(row)">
                  趋势分析
                </el-button>
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
      </el-col>
    </el-row>

    <!-- 智能预测面板 -->
    <el-row :gutter="16" class="prediction-section">
      <el-col :span="12">
        <el-card class="prediction-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">库存预测</span>
              <el-tag type="info" size="small">AI 智能分析</el-tag>
            </div>
          </template>
          <div class="prediction-content">
            <div class="prediction-item">
              <el-icon class="prediction-icon" color="#E6A23C"><WarnTriangleFilled /></el-icon>
              <div class="prediction-info">
                <div class="prediction-title">预计3天后缺货</div>
                <div class="prediction-desc">蔬菜类、肉类预计将低于安全库存</div>
                <el-button type="warning" size="small" plain>查看建议</el-button>
              </div>
            </div>
            <el-divider />
            <div class="prediction-item">
              <el-icon class="prediction-icon" color="#67C23A"><SuccessFilled /></el-icon>
              <div class="prediction-info">
                <div class="prediction-title">库存周转良好</div>
                <div class="prediction-desc">调味品、粮油类库存周转率达标</div>
                <el-button type="success" size="small" plain>查看详情</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="suggestion-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">优化建议</span>
              <el-tag type="success" size="small">系统推荐</el-tag>
            </div>
          </template>
          <div class="suggestion-list">
            <div v-for="(item, index) in suggestions" :key="index" class="suggestion-item">
              <div class="suggestion-badge">{{ index + 1 }}</div>
              <div class="suggestion-content">
                <div class="suggestion-title">{{ item.title }}</div>
                <div class="suggestion-desc">{{ item.desc }}</div>
              </div>
              <el-button type="primary" link>采纳</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart as EChartsPie } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import {
  Download,
  Upload,
  Refresh,
  Box,
  RefreshRight,
  TrendCharts,
  PieChart,
  Search,
  Filter,
  CaretTop,
  CaretBottom,
  Minus,
  Warning,
  SuccessFilled,
  WarnTriangleFilled
} from '@element-plus/icons-vue'

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  EChartsPie,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

// 时间范围
const timeRange = ref('30days')
const chartType = ref('line')
const searchKeyword = ref('')

// 核心指标
const metrics = reactive({
  totalInbound: 125680,
  totalOutbound: 118920,
  currentStock: 45230,
  turnoverRate: 85.6
})

// 分类数据
const categoryData = ref([
  {
    category: '蔬菜类',
    inbound: 35680,
    outbound: 33420,
    stock: 8960,
    stockPercentage: 45,
    turnover: 3,
    trend: 'up',
    warning: 0
  },
  {
    category: '肉类',
    inbound: 28450,
    outbound: 27120,
    stock: 5230,
    stockPercentage: 35,
    turnover: 2,
    trend: 'down',
    warning: 2
  },
  {
    category: '水产类',
    inbound: 15680,
    outbound: 15120,
    stock: 3450,
    stockPercentage: 55,
    turnover: 1,
    trend: 'up',
    warning: 0
  },
  {
    category: '粮油类',
    inbound: 22340,
    outbound: 20890,
    stock: 12560,
    stockPercentage: 85,
    turnover: 15,
    trend: 'stable',
    warning: 0
  },
  {
    category: '调味品',
    inbound: 12450,
    outbound: 11890,
    stock: 8920,
    stockPercentage: 90,
    turnover: 20,
    trend: 'stable',
    warning: 0
  },
  {
    category: '水果类',
    inbound: 11080,
    outbound: 10480,
    stock: 6110,
    stockPercentage: 60,
    turnover: 4,
    trend: 'up',
    warning: 0
  }
])

// 优化建议
const suggestions = ref([
  {
    title: '建议增加蔬菜类采购',
    desc: '根据历史数据分析，未来3天蔬菜类需求将增加15%'
  },
  {
    title: '优化肉类库存周转',
    desc: '当前肉类库存周转率偏低，建议调整采购频次'
  },
  {
    title: '粮油类库存充足',
    desc: '粮油类库存充足，可适当减少本周采购量'
  }
])

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 6
})

// 格式化数字
const formatNumber = (num: number) => {
  return num.toLocaleString()
}

// 获取分类标签类型
const getCategoryTagType = (category: string) => {
  const typeMap: Record<string, any> = {
    '蔬菜类': 'success',
    '肉类': 'danger',
    '水产类': 'info',
    '粮油类': 'warning',
    '调味品': '',
    '水果类': 'success'
  }
  return typeMap[category] || ''
}

// 获取进度条颜色
const getProgressColor = (percentage: number) => {
  if (percentage < 30) return '#F56C6C'
  if (percentage < 60) return '#E6A23C'
  return '#67C23A'
}

// 获取周转标签类型
const getTurnoverTagType = (days: number) => {
  if (days <= 3) return 'success'
  if (days <= 7) return 'warning'
  return 'info'
}

// 获取趋势文本
const getTrendText = (trend: string) => {
  const trendMap: Record<string, string> = {
    up: '上升',
    down: '下降',
    stable: '平稳'
  }
  return trendMap[trend] || '平稳'
}

// 刷新数据
const refreshData = () => {
  console.log('刷新数据')
}

// 查看详情
const viewDetail = (row: any) => {
  console.log('查看详情', row)
}

// 查看趋势
const viewTrend = (row: any) => {
  console.log('查看趋势', row)
}

// 分页处理
const handleSizeChange = (val: number) => {
  pagination.pageSize = val
}

const handleCurrentChange = (val: number) => {
  pagination.currentPage = val
}

// 趋势图表配置
const trendChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  legend: {
    data: ['入库量', '出库量'],
    top: 10
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  },
  yAxis: {
    type: 'value',
    name: '数量(kg)'
  },
  series: [
    {
      name: '入库量',
      type: chartType.value === 'bar' ? 'bar' : chartType.value === 'area' ? 'line' : 'line',
      data: [8200, 9500, 11200, 10800, 12500, 11800, 13200, 12600, 11900, 13500, 12800, 14200],
      smooth: true,
      itemStyle: {
        color: '#409EFF'
      },
      areaStyle: chartType.value === 'area' ? {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
          ]
        }
      } : undefined
    },
    {
      name: '出库量',
      type: chartType.value === 'bar' ? 'bar' : chartType.value === 'area' ? 'line' : 'line',
      data: [7800, 9200, 10600, 10200, 11800, 11200, 12500, 11900, 11300, 12800, 12100, 13400],
      smooth: true,
      itemStyle: {
        color: '#E6A23C'
      },
      areaStyle: chartType.value === 'area' ? {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(230, 162, 60, 0.3)' },
            { offset: 1, color: 'rgba(230, 162, 60, 0.05)' }
          ]
        }
      } : undefined
    }
  ]
}))

// 饼图配置
const pieChartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c}kg ({d}%)'
  },
  legend: {
    orient: 'vertical',
    right: 10,
    top: 'center'
  },
  series: [
    {
      name: '库存分类',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 8960, name: '蔬菜类', itemStyle: { color: '#67C23A' } },
        { value: 5230, name: '肉类', itemStyle: { color: '#E6A23C' } },
        { value: 3450, name: '水产类', itemStyle: { color: '#409EFF' } },
        { value: 12560, name: '粮油类', itemStyle: { color: '#F56C6C' } },
        { value: 8920, name: '调味品', itemStyle: { color: '#909399' } },
        { value: 6110, name: '水果类', itemStyle: { color: '#00D7E9' } }
      ]
    }
  ]
}))
</script>

<style scoped>
.inventory-analysis {
  padding: 20px;
  background: #F5F7FA;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 24px;
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

.metrics-section {
  margin-bottom: 16px;
}

.metric-card {
  border-radius: 12px;
  transition: all 0.3s;
  overflow: hidden;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.metric-content {
  display: flex;
  align-items: center;
  padding: 8px;
}

.metric-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin-right: 16px;
}

.metric-card.inbound .metric-icon {
  background: #E6F7FF;
  color: #409EFF;
}

.metric-card.outbound .metric-icon {
  background: #FFF7E6;
  color: #E6A23C;
}

.metric-card.stock .metric-icon {
  background: #F0F9FF;
  color: #67C23A;
}

.metric-card.turnover .metric-icon {
  background: #F5F5F5;
  color: #909399;
}

.metric-info {
  flex: 1;
}

.metric-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.metric-trend {
  display: flex;
  align-items: center;
  font-size: 12px;
  gap: 4px;
}

.metric-trend.up {
  color: #67C23A;
}

.metric-trend.down {
  color: #F56C6C;
}

.metric-trend.normal {
  color: #909399;
}

.flow-section,
.category-section,
.prediction-section {
  margin-bottom: 16px;
}

.chart-card,
.data-card,
.prediction-card,
.suggestion-card {
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

.chart-placeholder {
  text-align: center;
  color: #909399;
}

.chart-placeholder p {
  margin-top: 12px;
  font-size: 14px;
}

.category-cell {
  display: flex;
  align-items: center;
}

.number-cell {
  font-weight: 500;
  color: #303133;
}

.trend-cell {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.trend-cell.up {
  color: #67C23A;
}

.trend-cell.down {
  color: #F56C6C;
}

.trend-cell.stable {
  color: #909399;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.prediction-content {
  padding: 8px 0;
}

.prediction-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 0;
}

.prediction-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.prediction-info {
  flex: 1;
}

.prediction-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.prediction-desc {
  font-size: 14px;
  color: #606266;
  margin-bottom: 12px;
}

.suggestion-list {
  padding: 8px 0;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  margin-bottom: 12px;
  background: #F5F7FA;
  border-radius: 8px;
  transition: all 0.3s;
}

.suggestion-item:hover {
  background: #E6F7FF;
}

.suggestion-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #409EFF;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.suggestion-content {
  flex: 1;
}

.suggestion-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.suggestion-desc {
  font-size: 13px;
  color: #606266;
}
</style>

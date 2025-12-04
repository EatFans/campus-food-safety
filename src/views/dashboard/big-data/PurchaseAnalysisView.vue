<template>
  <div class="purchase-analysis">
    <!-- 页面头部 -->
    <div class="page-header">
      <div>
        <h2>采购分析</h2>
        <p class="subtitle">供应商绩效评估与采购成本优化分析</p>
      </div>
      <el-space>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <el-button type="primary" :icon="DataAnalysis">生成报告</el-button>
        <el-button :icon="Download">导出数据</el-button>
      </el-space>
    </div>

    <!-- 采购总览 -->
    <el-row :gutter="20" class="overview-section">
      <el-col :span="8">
        <el-card class="overview-card total" shadow="hover">
          <div class="overview-content">
            <div class="overview-left">
              <div class="overview-label">采购总额</div>
              <div class="overview-value">¥{{ formatMoney(overview.totalAmount) }}</div>
              <div class="overview-compare">
                <el-tag type="success" size="small">环比 +15.8%</el-tag>
              </div>
            </div>
            <div class="overview-icon">
              <el-icon :size="56"><Money /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="overview-card orders" shadow="hover">
          <div class="overview-content">
            <div class="overview-left">
              <div class="overview-label">采购订单</div>
              <div class="overview-value">{{ overview.totalOrders }}</div>
              <div class="overview-compare">
                <el-tag type="info" size="small">环比 +8.3%</el-tag>
              </div>
            </div>
            <div class="overview-icon">
              <el-icon :size="56"><Document /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="overview-card suppliers" shadow="hover">
          <div class="overview-content">
            <div class="overview-left">
              <div class="overview-label">合作供应商</div>
              <div class="overview-value">{{ overview.totalSuppliers }}</div>
              <div class="overview-compare">
                <el-tag type="warning" size="small">新增 3家</el-tag>
              </div>
            </div>
            <div class="overview-icon">
              <el-icon :size="56"><OfficeBuilding /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 成本分析与趋势 -->
    <el-row :gutter="20" class="cost-section">
      <el-col :span="16">
        <el-card class="cost-chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">采购成本趋势</span>
              <el-space>
                <el-segmented v-model="costPeriod" :options="periodOptions" size="small" />
                <el-button size="small" :icon="MoreFilled" circle />
              </el-space>
            </div>
          </template>
          <div class="chart-wrapper" style="height: 320px;">
            <v-chart :option="costTrendOption" autoresize />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="category-chart-card" shadow="hover">
          <template #header>
            <span class="card-title">采购分类占比</span>
          </template>
          <div class="chart-wrapper" style="height: 320px;">
            <v-chart :option="categoryPieOption" autoresize />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 供应商绩效排行 -->
    <el-row :gutter="20" class="supplier-section">
      <el-col :span="24">
        <el-card class="supplier-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">供应商绩效排行榜</span>
              <el-space>
                <el-select v-model="sortBy" placeholder="排序方式" style="width: 150px" size="small">
                  <el-option label="综合评分" value="score" />
                  <el-option label="采购金额" value="amount" />
                  <el-option label="准时率" value="ontime" />
                  <el-option label="质量评分" value="quality" />
                </el-select>
                <el-button size="small" :icon="Refresh">刷新</el-button>
              </el-space>
            </div>
          </template>

          <div class="supplier-list">
            <div v-for="(supplier, index) in supplierRanking" :key="supplier.id" class="supplier-item">
              <div class="supplier-rank">
                <div class="rank-badge" :class="getRankClass(index)">
                  {{ index + 1 }}
                </div>
              </div>
              <div class="supplier-info">
                <div class="supplier-name">{{ supplier.name }}</div>
                <div class="supplier-tags">
                  <el-tag v-for="tag in supplier.tags" :key="tag" size="small" type="info">
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
              <div class="supplier-metrics">
                <div class="metric-item">
                  <div class="metric-label">采购金额</div>
                  <div class="metric-value">¥{{ formatMoney(supplier.amount) }}</div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">订单数</div>
                  <div class="metric-value">{{ supplier.orders }}</div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">准时率</div>
                  <div class="metric-value">{{ supplier.ontimeRate }}%</div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">质量评分</div>
                  <div class="metric-value">
                    <el-rate v-model="supplier.qualityScore" disabled show-score text-color="#ff9900" />
                  </div>
                </div>
              </div>
              <div class="supplier-score">
                <el-progress
                  type="circle"
                  :percentage="supplier.totalScore"
                  :width="80"
                  :color="getScoreColor(supplier.totalScore)"
                >
                  <template #default="{ percentage }">
                    <span class="score-text">{{ percentage }}</span>
                  </template>
                </el-progress>
                <div class="score-label">综合评分</div>
              </div>
              <div class="supplier-actions">
                <el-button type="primary" link @click="viewSupplierDetail(supplier)">
                  查看详情
                </el-button>
                <el-button type="primary" link @click="compareSupplier(supplier)">
                  对比分析
                </el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 采购明细与价格波动 -->
    <el-row :gutter="20" class="detail-section">
      <el-col :span="14">
        <el-card class="detail-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">采购明细</span>
              <el-input
                v-model="searchText"
                placeholder="搜索商品名称"
                :prefix-icon="Search"
                style="width: 200px"
                size="small"
                clearable
              />
            </div>
          </template>

          <el-table :data="purchaseDetails" stripe max-height="400">
            <el-table-column type="index" label="#" width="50" />
            <el-table-column prop="productName" label="商品名称" width="150" />
            <el-table-column prop="category" label="分类" width="100">
              <template #default="{ row }">
                <el-tag size="small">{{ row.category }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="supplier" label="供应商" width="120" />
            <el-table-column prop="quantity" label="数量" width="80" align="right" />
            <el-table-column prop="unit" label="单位" width="60" />
            <el-table-column prop="unitPrice" label="单价" width="90" align="right">
              <template #default="{ row }">
                ¥{{ row.unitPrice.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="totalPrice" label="总价" width="100" align="right">
              <template #default="{ row }">
                <span class="price-text">¥{{ row.totalPrice.toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="价格趋势" width="100">
              <template #default="{ row }">
                <div class="price-trend" :class="row.priceTrend">
                  <el-icon v-if="row.priceTrend === 'up'"><Top /></el-icon>
                  <el-icon v-else-if="row.priceTrend === 'down'"><Bottom /></el-icon>
                  <el-icon v-else><Minus /></el-icon>
                  <span>{{ getPriceTrendText(row.priceTrend) }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card class="price-card" shadow="hover">
          <template #header>
            <span class="card-title">价格波动预警</span>
          </template>
          <div class="price-alerts">
            <div v-for="alert in priceAlerts" :key="alert.id" class="alert-item" :class="alert.level">
              <div class="alert-icon">
                <el-icon v-if="alert.level === 'high'" color="#F56C6C"><WarnTriangleFilled /></el-icon>
                <el-icon v-else-if="alert.level === 'medium'" color="#E6A23C"><Warning /></el-icon>
                <el-icon v-else color="#409EFF"><InfoFilled /></el-icon>
              </div>
              <div class="alert-content">
                <div class="alert-title">{{ alert.product }}</div>
                <div class="alert-desc">{{ alert.message }}</div>
                <div class="alert-change">
                  <span :class="alert.changeType">{{ alert.change }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>

        <el-card class="savings-card" shadow="hover" style="margin-top: 20px;">
          <template #header>
            <span class="card-title">成本节约建议</span>
          </template>
          <div class="savings-list">
            <div v-for="(item, index) in savingsSuggestions" :key="index" class="savings-item">
              <el-icon class="savings-icon" color="#67C23A"><Coin /></el-icon>
              <div class="savings-content">
                <div class="savings-title">{{ item.title }}</div>
                <div class="savings-amount">预计节约: ¥{{ formatMoney(item.amount) }}</div>
              </div>
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
import { LineChart, PieChart as EChartsPie } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import {
  DataAnalysis,
  Download,
  Money,
  Document,
  OfficeBuilding,
  MoreFilled,
  DataLine,
  PieChart,
  Refresh,
  Search,
  Top,
  Bottom,
  Minus,
  WarnTriangleFilled,
  Warning,
  InfoFilled,
  Coin
} from '@element-plus/icons-vue'

use([
  CanvasRenderer,
  LineChart,
  EChartsPie,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

// 日期范围
const dateRange = ref<[Date, Date]>()
const costPeriod = ref('月度')
const periodOptions = ['日度', '周度', '月度', '年度']
const sortBy = ref('score')
const searchText = ref('')

// 采购总览
const overview = reactive({
  totalAmount: 1256800,
  totalOrders: 342,
  totalSuppliers: 28
})

// 供应商排行
const supplierRanking = ref([
  {
    id: 1,
    name: '鲜美蔬菜供应商',
    tags: ['蔬菜', '水果'],
    amount: 285600,
    orders: 86,
    ontimeRate: 98,
    qualityScore: 4.8,
    totalScore: 96
  },
  {
    id: 2,
    name: '优质肉类批发',
    tags: ['肉类', '水产'],
    amount: 268900,
    orders: 72,
    ontimeRate: 95,
    qualityScore: 4.6,
    totalScore: 93
  },
  {
    id: 3,
    name: '粮油食品公司',
    tags: ['粮油', '调味品'],
    amount: 198500,
    orders: 58,
    ontimeRate: 97,
    qualityScore: 4.7,
    totalScore: 94
  },
  {
    id: 4,
    name: '海鲜水产直供',
    tags: ['水产'],
    amount: 156800,
    orders: 45,
    ontimeRate: 92,
    qualityScore: 4.5,
    totalScore: 89
  },
  {
    id: 5,
    name: '绿色有机农场',
    tags: ['蔬菜', '有机'],
    amount: 128900,
    orders: 38,
    ontimeRate: 96,
    qualityScore: 4.9,
    totalScore: 95
  }
])

// 采购明细
const purchaseDetails = ref([
  {
    productName: '新鲜白菜',
    category: '蔬菜',
    supplier: '鲜美蔬菜',
    quantity: 500,
    unit: 'kg',
    unitPrice: 3.5,
    totalPrice: 1750,
    priceTrend: 'down'
  },
  {
    productName: '猪肉',
    category: '肉类',
    supplier: '优质肉类',
    quantity: 200,
    unit: 'kg',
    unitPrice: 28.5,
    totalPrice: 5700,
    priceTrend: 'up'
  },
  {
    productName: '大米',
    category: '粮油',
    supplier: '粮油食品',
    quantity: 1000,
    unit: 'kg',
    unitPrice: 5.2,
    totalPrice: 5200,
    priceTrend: 'stable'
  },
  {
    productName: '鲈鱼',
    category: '水产',
    supplier: '海鲜水产',
    quantity: 80,
    unit: 'kg',
    unitPrice: 35.0,
    totalPrice: 2800,
    priceTrend: 'up'
  },
  {
    productName: '有机番茄',
    category: '蔬菜',
    supplier: '绿色农场',
    quantity: 150,
    unit: 'kg',
    unitPrice: 8.5,
    totalPrice: 1275,
    priceTrend: 'stable'
  }
])

// 价格预警
const priceAlerts = ref([
  {
    id: 1,
    level: 'high',
    product: '猪肉',
    message: '价格持续上涨，建议调整采购策略',
    change: '+18.5%',
    changeType: 'increase'
  },
  {
    id: 2,
    level: 'medium',
    product: '鲈鱼',
    message: '价格波动较大，需关注市场动态',
    change: '+12.3%',
    changeType: 'increase'
  },
  {
    id: 3,
    level: 'low',
    product: '白菜',
    message: '价格下降，可适当增加采购量',
    change: '-8.2%',
    changeType: 'decrease'
  }
])

// 节约建议
const savingsSuggestions = ref([
  {
    title: '批量采购粮油类商品可获得8%折扣',
    amount: 12500
  },
  {
    title: '更换蔬菜供应商可降低成本',
    amount: 8900
  },
  {
    title: '优化采购频次减少运输成本',
    amount: 6700
  }
])

// 格式化金额
const formatMoney = (amount: number) => {
  return amount.toLocaleString()
}

// 获取排名样式
const getRankClass = (index: number) => {
  if (index === 0) return 'rank-gold'
  if (index === 1) return 'rank-silver'
  if (index === 2) return 'rank-bronze'
  return ''
}

// 获取评分颜色
const getScoreColor = (score: number) => {
  if (score >= 90) return '#67C23A'
  if (score >= 80) return '#409EFF'
  if (score >= 70) return '#E6A23C'
  return '#F56C6C'
}

// 获取价格趋势文本
const getPriceTrendText = (trend: string) => {
  const trendMap: Record<string, string> = {
    up: '上涨',
    down: '下降',
    stable: '平稳'
  }
  return trendMap[trend] || '平稳'
}

// 查看供应商详情
const viewSupplierDetail = (supplier: any) => {
  console.log('查看供应商详情', supplier)
}

// 对比供应商
const compareSupplier = (supplier: any) => {
  console.log('对比供应商', supplier)
}

// 成本趋势图配置
const costTrendOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['采购总额', '订单数量'],
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
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  },
  yAxis: [
    {
      type: 'value',
      name: '金额(万元)',
      position: 'left'
    },
    {
      type: 'value',
      name: '订单数',
      position: 'right'
    }
  ],
  series: [
    {
      name: '采购总额',
      type: 'line',
      data: [85, 92, 101, 98, 115, 108, 125, 118, 112, 128, 121, 135],
      smooth: true,
      itemStyle: {
        color: '#409EFF'
      },
      areaStyle: {
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
      }
    },
    {
      name: '订单数量',
      type: 'bar',
      yAxisIndex: 1,
      data: [28, 32, 35, 33, 38, 36, 42, 39, 37, 43, 40, 45],
      itemStyle: {
        color: '#67C23A'
      }
    }
  ]
}))

// 分类占比图配置
const categoryPieOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: ¥{c}万 ({d}%)'
  },
  legend: {
    orient: 'vertical',
    right: 10,
    top: 'center'
  },
  series: [
    {
      name: '采购分类',
      type: 'pie',
      radius: '70%',
      center: ['40%', '50%'],
      data: [
        { value: 285.6, name: '蔬菜类', itemStyle: { color: '#67C23A' } },
        { value: 268.9, name: '肉类', itemStyle: { color: '#E6A23C' } },
        { value: 198.5, name: '粮油类', itemStyle: { color: '#409EFF' } },
        { value: 156.8, name: '水产类', itemStyle: { color: '#F56C6C' } },
        { value: 128.9, name: '水果类', itemStyle: { color: '#00D7E9' } },
        { value: 87.3, name: '调味品', itemStyle: { color: '#909399' } }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}))
</script>

<style scoped>
.purchase-analysis {
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

.page-header h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.subtitle {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.overview-section,
.cost-section,
.supplier-section,
.detail-section {
  margin-bottom: 20px;
}

.overview-card {
  border-radius: 12px;
  transition: all 0.3s;
}

.overview-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.overview-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
}

.overview-left {
  flex: 1;
}

.overview-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 12px;
}

.overview-value {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.overview-compare {
  margin-top: 8px;
}

.overview-icon {
  font-size: 56px;
  color: #DCDFE6;
  opacity: 0.6;
}

.cost-chart-card,
.category-chart-card,
.supplier-card,
.detail-card,
.price-card,
.savings-card {
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

.chart-wrapper {
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

.supplier-list {
  padding: 8px 0;
}

.supplier-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  margin-bottom: 16px;
  background: #F5F7FA;
  border-radius: 12px;
  transition: all 0.3s;
}

.supplier-item:hover {
  background: #E6F7FF;
  transform: translateX(4px);
}

.supplier-rank {
  flex-shrink: 0;
}

.rank-badge {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: white;
  background: #909399;
}

.rank-badge.rank-gold {
  background: linear-gradient(135deg, #FFD700, #FFA500);
}

.rank-badge.rank-silver {
  background: linear-gradient(135deg, #C0C0C0, #A8A8A8);
}

.rank-badge.rank-bronze {
  background: linear-gradient(135deg, #CD7F32, #B8860B);
}

.supplier-info {
  flex: 1;
  min-width: 150px;
}

.supplier-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.supplier-tags {
  display: flex;
  gap: 8px;
}

.supplier-metrics {
  display: flex;
  gap: 32px;
  flex: 2;
}

.metric-item {
  text-align: center;
}

.metric-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.metric-value {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.supplier-score {
  text-align: center;
  flex-shrink: 0;
}

.score-text {
  font-size: 18px;
  font-weight: bold;
}

.score-label {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

.supplier-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.price-text {
  font-weight: 600;
  color: #E6A23C;
}

.price-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.price-trend.up {
  color: #F56C6C;
}

.price-trend.down {
  color: #67C23A;
}

.price-trend.stable {
  color: #909399;
}

.price-alerts {
  padding: 8px 0;
}

.alert-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 8px;
  border-left: 4px solid;
}

.alert-item.high {
  background: #FEF0F0;
  border-left-color: #F56C6C;
}

.alert-item.medium {
  background: #FDF6EC;
  border-left-color: #E6A23C;
}

.alert-item.low {
  background: #ECF5FF;
  border-left-color: #409EFF;
}

.alert-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.alert-desc {
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
}

.alert-change {
  font-size: 14px;
  font-weight: 600;
}

.alert-change .increase {
  color: #F56C6C;
}

.alert-change .decrease {
  color: #67C23A;
}

.savings-list {
  padding: 8px 0;
}

.savings-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  margin-bottom: 12px;
  background: #F0F9FF;
  border-radius: 8px;
}

.savings-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.savings-content {
  flex: 1;
}

.savings-title {
  font-size: 14px;
  color: #303133;
  margin-bottom: 4px;
}

.savings-amount {
  font-size: 16px;
  font-weight: 600;
  color: #67C23A;
}
</style>

<template>
  <div class="supply-comparison">
    <!-- 页面头部 -->
    <div class="page-header">
      <div>
        <h2>供应量对比分析</h2>
        <p class="subtitle">多维度供应商供应能力对比与市场趋势分析</p>
      </div>
      <el-space>
        <el-button type="primary" :icon="DataBoard">对比分析</el-button>
        <el-button :icon="Download">导出对比报告</el-button>
      </el-space>
    </div>

    <!-- 对比选择器 -->
    <el-card class="selector-card" shadow="hover">
      <div class="selector-content">
        <div class="selector-item">
          <span class="selector-label">对比维度:</span>
          <el-radio-group v-model="comparisonDimension" size="large">
            <el-radio-button label="supplier">供应商对比</el-radio-button>
            <el-radio-button label="category">品类对比</el-radio-button>
            <el-radio-button label="region">区域对比</el-radio-button>
            <el-radio-button label="time">时间对比</el-radio-button>
          </el-radio-group>
        </div>
        <div class="selector-item">
          <span class="selector-label">时间周期:</span>
          <el-segmented v-model="timePeriod" :options="timeOptions" />
        </div>
        <div class="selector-item">
          <span class="selector-label">对比对象:</span>
          <el-select
            v-model="selectedItems"
            multiple
            placeholder="选择对比对象"
            style="width: 400px"
            :max-collapse-tags="3"
          >
            <el-option
              v-for="item in comparisonOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
    </el-card>

    <!-- 供应量对比图表 -->
    <el-row :gutter="20" class="chart-section">
      <el-col :span="16">
        <el-card class="comparison-chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">供应量趋势对比</span>
              <el-space>
                <el-radio-group v-model="chartMode" size="small">
                  <el-radio-button label="line">折线</el-radio-button>
                  <el-radio-button label="bar">柱状</el-radio-button>
                  <el-radio-button label="radar">雷达</el-radio-button>
                </el-radio-group>
                <el-button size="small" :icon="FullScreen">全屏</el-button>
              </el-space>
            </div>
          </template>
          <div class="chart-container" style="height: 400px;">
            <v-chart :option="comparisonChartOption" autoresize />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="ranking-card" shadow="hover">
          <template #header>
            <span class="card-title">供应量排名</span>
          </template>
          <div class="ranking-list">
            <div v-for="(item, index) in supplyRanking" :key="item.id" class="ranking-item">
              <div class="ranking-number" :class="getRankingClass(index)">
                {{ index + 1 }}
              </div>
              <div class="ranking-info">
                <div class="ranking-name">{{ item.name }}</div>
                <el-progress
                  :percentage="item.percentage"
                  :color="getRankingColor(index)"
                  :show-text="false"
                  :stroke-width="8"
                />
              </div>
              <div class="ranking-value">
                {{ item.value }}吨
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 供应能力热力图 -->
    <el-row :gutter="20" class="heatmap-section">
      <el-col :span="24">
        <el-card class="heatmap-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">供应能力热力图</span>
              <el-space>
                <span class="legend-item">
                  <span class="legend-color" style="background: #67C23A;"></span>
                  <span>充足</span>
                </span>
                <span class="legend-item">
                  <span class="legend-color" style="background: #E6A23C;"></span>
                  <span>一般</span>
                </span>
                <span class="legend-item">
                  <span class="legend-color" style="background: #F56C6C;"></span>
                  <span>不足</span>
                </span>
              </el-space>
            </div>
          </template>
          <div class="heatmap-container">
            <div class="heatmap-grid">
              <div class="heatmap-row header-row">
                <div class="heatmap-cell header-cell"></div>
                <div v-for="month in months" :key="month" class="heatmap-cell header-cell">
                  {{ month }}
                </div>
              </div>
              <div v-for="category in categories" :key="category.name" class="heatmap-row">
                <div class="heatmap-cell label-cell">{{ category.name }}</div>
                <div
                  v-for="(value, index) in category.data"
                  :key="index"
                  class="heatmap-cell data-cell"
                  :class="getHeatmapClass(value)"
                  :title="`${category.name} - ${months[index]}: ${value}%`"
                >
                  <span class="cell-value">{{ value }}%</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 详细对比数据表 -->
    <el-row :gutter="20" class="table-section">
      <el-col :span="24">
        <el-card class="table-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">详细对比数据</span>
              <el-space>
                <el-input
                  v-model="searchKeyword"
                  placeholder="搜索"
                  :prefix-icon="Search"
                  style="width: 200px"
                  size="small"
                  clearable
                />
                <el-button size="small" :icon="Filter">筛选</el-button>
                <el-button size="small" :icon="Sort">排序</el-button>
              </el-space>
            </div>
          </template>

          <el-table :data="comparisonData" stripe border style="width: 100%">
            <el-table-column prop="name" label="名称" width="150" fixed />
            <el-table-column label="本月供应量" width="120" align="center">
              <template #default="{ row }">
                <span class="data-value">{{ row.currentMonth }}吨</span>
              </template>
            </el-table-column>
            <el-table-column label="上月供应量" width="120" align="center">
              <template #default="{ row }">
                <span class="data-value">{{ row.lastMonth }}吨</span>
              </template>
            </el-table-column>
            <el-table-column label="环比变化" width="120" align="center">
              <template #default="{ row }">
                <div class="change-cell" :class="row.changeType">
                  <el-icon v-if="row.changeType === 'increase'"><Top /></el-icon>
                  <el-icon v-else-if="row.changeType === 'decrease'"><Bottom /></el-icon>
                  <span>{{ row.change }}%</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="市场占比" width="150" align="center">
              <template #default="{ row }">
                <el-progress
                  :percentage="row.marketShare"
                  :color="getMarketShareColor(row.marketShare)"
                  :stroke-width="16"
                />
              </template>
            </el-table-column>
            <el-table-column label="供应稳定性" width="120" align="center">
              <template #default="{ row }">
                <el-rate
                  v-model="row.stability"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}"
                />
              </template>
            </el-table-column>
            <el-table-column label="价格指数" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="getPriceIndexType(row.priceIndex)">
                  {{ row.priceIndex }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="质量评级" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="getQualityType(row.quality)" effect="dark">
                  {{ row.quality }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="供应能力" width="120" align="center">
              <template #default="{ row }">
                <div class="capacity-badge" :class="row.capacity">
                  {{ getCapacityText(row.capacity) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right" align="center">
              <template #default="{ row }">
                <el-button link type="primary" size="small" @click="viewTrend(row)">
                  趋势分析
                </el-button>
                <el-button link type="primary" size="small" @click="viewDetail(row)">
                  详细信息
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination-wrapper">
            <el-pagination
              v-model:current-page="pagination.currentPage"
              v-model:page-size="pagination.pageSize"
              :page-sizes="[10, 20, 50]"
              :total="pagination.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 分析洞察 -->
    <el-row :gutter="20" class="insight-section">
      <el-col :span="8">
        <el-card class="insight-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon color="#409EFF"><TrendCharts /></el-icon>
              <span class="card-title">趋势洞察</span>
            </div>
          </template>
          <div class="insight-content">
            <div class="insight-item">
              <div class="insight-icon">📈</div>
              <div class="insight-text">
                <strong>蔬菜类供应量</strong>连续3个月增长，增幅达<strong>18.5%</strong>
              </div>
            </div>
            <div class="insight-item">
              <div class="insight-icon">📊</div>
              <div class="insight-text">
                <strong>肉类供应</strong>出现季节性波动，建议提前备货
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="insight-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon color="#67C23A"><Opportunity /></el-icon>
              <span class="card-title">机会发现</span>
            </div>
          </template>
          <div class="insight-content">
            <div class="insight-item">
              <div class="insight-icon">💡</div>
              <div class="insight-text">
                发现<strong>2家新供应商</strong>，价格优势明显，建议洽谈合作
              </div>
            </div>
            <div class="insight-item">
              <div class="insight-icon">🎯</div>
              <div class="insight-text">
                <strong>水产类</strong>供应商集中度高，可考虑分散风险
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="insight-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon color="#E6A23C"><Warning /></el-icon>
              <span class="card-title">风险预警</span>
            </div>
          </template>
          <div class="insight-content">
            <div class="insight-item">
              <div class="insight-icon">⚠️</div>
              <div class="insight-text">
                <strong>粮油类</strong>供应商供应能力下降，需关注库存安全
              </div>
            </div>
            <div class="insight-item">
              <div class="insight-icon">🔔</div>
              <div class="insight-text">
                <strong>调味品</strong>价格指数上涨，建议锁定长期合同
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
import { LineChart, BarChart, RadarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  RadarComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import {
  DataBoard,
  Download,
  FullScreen,
  Histogram,
  Search,
  Filter,
  Sort,
  Top,
  Bottom,
  TrendCharts,
  Opportunity,
  Warning
} from '@element-plus/icons-vue'

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  RadarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  RadarComponent
])

// 对比维度
const comparisonDimension = ref('supplier')
const timePeriod = ref('月度')
const timeOptions = ['日度', '周度', '月度', '季度', '年度']
const chartMode = ref('line')
const searchKeyword = ref('')

// 选择的对比对象
const selectedItems = ref(['supplier1', 'supplier2', 'supplier3'])

// 对比选项
const comparisonOptions = ref([
  { label: '鲜美蔬菜供应商', value: 'supplier1' },
  { label: '优质肉类批发', value: 'supplier2' },
  { label: '粮油食品公司', value: 'supplier3' },
  { label: '海鲜水产直供', value: 'supplier4' },
  { label: '绿色有机农场', value: 'supplier5' }
])

// 供应量排名
const supplyRanking = ref([
  { id: 1, name: '鲜美蔬菜供应商', value: 1256, percentage: 100 },
  { id: 2, name: '优质肉类批发', value: 1089, percentage: 87 },
  { id: 3, name: '粮油食品公司', value: 956, percentage: 76 },
  { id: 4, name: '海鲜水产直供', value: 823, percentage: 66 },
  { id: 5, name: '绿色有机农场', value: 687, percentage: 55 }
])

// 月份
const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

// 品类数据
const categories = ref([
  { name: '蔬菜类', data: [85, 88, 92, 90, 95, 93, 96, 94, 91, 89, 87, 90] },
  { name: '肉类', data: [78, 82, 80, 85, 83, 88, 86, 84, 82, 80, 78, 81] },
  { name: '水产类', data: [65, 68, 72, 70, 75, 73, 78, 76, 74, 72, 70, 73] },
  { name: '粮油类', data: [92, 94, 95, 93, 96, 94, 97, 95, 93, 91, 89, 92] },
  { name: '调味品', data: [88, 90, 91, 89, 92, 90, 93, 91, 89, 87, 85, 88] },
  { name: '水果类', data: [72, 75, 78, 76, 80, 78, 82, 80, 78, 76, 74, 77] }
])

// 对比数据
const comparisonData = ref([
  {
    name: '鲜美蔬菜供应商',
    currentMonth: 1256,
    lastMonth: 1180,
    change: 6.4,
    changeType: 'increase',
    marketShare: 28,
    stability: 4.5,
    priceIndex: 102,
    quality: 'A',
    capacity: 'high'
  },
  {
    name: '优质肉类批发',
    currentMonth: 1089,
    lastMonth: 1120,
    change: -2.8,
    changeType: 'decrease',
    marketShare: 24,
    stability: 4.2,
    priceIndex: 105,
    quality: 'A',
    capacity: 'high'
  },
  {
    name: '粮油食品公司',
    currentMonth: 956,
    lastMonth: 945,
    change: 1.2,
    changeType: 'increase',
    marketShare: 21,
    stability: 4.8,
    priceIndex: 98,
    quality: 'A+',
    capacity: 'high'
  },
  {
    name: '海鲜水产直供',
    currentMonth: 823,
    lastMonth: 856,
    change: -3.9,
    changeType: 'decrease',
    marketShare: 18,
    stability: 3.8,
    priceIndex: 108,
    quality: 'B',
    capacity: 'medium'
  },
  {
    name: '绿色有机农场',
    currentMonth: 687,
    lastMonth: 623,
    change: 10.3,
    changeType: 'increase',
    marketShare: 15,
    stability: 4.6,
    priceIndex: 110,
    quality: 'A',
    capacity: 'medium'
  }
])

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 5
})

// 获取排名样式
const getRankingClass = (index: number) => {
  if (index === 0) return 'top1'
  if (index === 1) return 'top2'
  if (index === 2) return 'top3'
  return ''
}

// 获取排名颜色
const getRankingColor = (index: number) => {
  const colors = ['#409EFF', '#67C23A', '#E6A23C', '#909399', '#C0C4CC']
  return colors[index] || '#DCDFE6'
}

// 获取热力图样式
const getHeatmapClass = (value: number) => {
  if (value >= 90) return 'level-high'
  if (value >= 70) return 'level-medium'
  return 'level-low'
}

// 获取市场占比颜色
const getMarketShareColor = (share: number) => {
  if (share >= 25) return '#409EFF'
  if (share >= 20) return '#67C23A'
  return '#E6A23C'
}

// 获取价格指数类型
const getPriceIndexType = (index: number) => {
  if (index >= 105) return 'danger'
  if (index >= 100) return 'warning'
  return 'success'
}

// 获取质量类型
const getQualityType = (quality: string) => {
  const typeMap: Record<string, any> = {
    'A+': 'success',
    'A': 'success',
    'B': 'warning',
    'C': 'danger'
  }
  return typeMap[quality] || 'info'
}

// 获取供应能力文本
const getCapacityText = (capacity: string) => {
  const textMap: Record<string, string> = {
    high: '充足',
    medium: '一般',
    low: '不足'
  }
  return textMap[capacity] || '未知'
}

// 查看趋势
const viewTrend = (row: any) => {
  console.log('查看趋势', row)
}

// 查看详情
const viewDetail = (row: any) => {
  console.log('查看详情', row)
}

// 分页处理
const handleSizeChange = (val: number) => {
  pagination.pageSize = val
}

const handleCurrentChange = (val: number) => {
  pagination.currentPage = val
}

// 对比图表配置
const comparisonChartOption = computed(() => {
  if (chartMode.value === 'radar') {
    return {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        data: ['鲜美蔬菜供应商', '优质肉类批发', '粮油食品公司'],
        top: 10
      },
      radar: {
        indicator: [
          { name: '供应量', max: 1500 },
          { name: '质量评分', max: 100 },
          { name: '价格指数', max: 120 },
          { name: '准时率', max: 100 },
          { name: '市场占比', max: 30 }
        ]
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: [1256, 96, 102, 98, 28],
              name: '鲜美蔬菜供应商',
              itemStyle: { color: '#409EFF' }
            },
            {
              value: [1089, 93, 105, 95, 24],
              name: '优质肉类批发',
              itemStyle: { color: '#67C23A' }
            },
            {
              value: [956, 94, 98, 97, 21],
              name: '粮油食品公司',
              itemStyle: { color: '#E6A23C' }
            }
          ]
        }
      ]
    }
  }

  const baseConfig = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['鲜美蔬菜供应商', '优质肉类批发', '粮油食品公司'],
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
    yAxis: {
      type: 'value',
      name: '供应量(吨)'
    },
    series: [
      {
        name: '鲜美蔬菜供应商',
        type: chartMode.value === 'bar' ? 'bar' : 'line',
        data: [980, 1050, 1120, 1080, 1180, 1150, 1250, 1200, 1160, 1280, 1220, 1320],
        smooth: true,
        itemStyle: { color: '#409EFF' },
        areaStyle: chartMode.value === 'line' ? {
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
        name: '优质肉类批发',
        type: chartMode.value === 'bar' ? 'bar' : 'line',
        data: [850, 920, 980, 950, 1050, 1020, 1120, 1080, 1040, 1150, 1100, 1180],
        smooth: true,
        itemStyle: { color: '#67C23A' },
        areaStyle: chartMode.value === 'line' ? {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(103, 194, 58, 0.3)' },
              { offset: 1, color: 'rgba(103, 194, 58, 0.05)' }
            ]
          }
        } : undefined
      },
      {
        name: '粮油食品公司',
        type: chartMode.value === 'bar' ? 'bar' : 'line',
        data: [720, 780, 850, 820, 920, 890, 980, 950, 910, 1020, 980, 1050],
        smooth: true,
        itemStyle: { color: '#E6A23C' },
        areaStyle: chartMode.value === 'line' ? {
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
  }

  return baseConfig
})
</script>

<style scoped>
.supply-comparison {
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

.selector-card {
  margin-bottom: 20px;
  border-radius: 12px;
}

.selector-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.selector-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.selector-label {
  font-size: 14px;
  font-weight: 600;
  color: #606266;
  min-width: 80px;
}

.chart-section,
.heatmap-section,
.table-section,
.insight-section {
  margin-bottom: 20px;
}

.comparison-chart-card,
.ranking-card,
.heatmap-card,
.table-card,
.insight-card {
  border-radius: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
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

.ranking-list {
  padding: 8px 0;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  margin-bottom: 12px;
  background: #F5F7FA;
  border-radius: 8px;
  transition: all 0.3s;
}

.ranking-item:hover {
  background: #E6F7FF;
  transform: translateX(4px);
}

.ranking-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background: #909399;
  flex-shrink: 0;
}

.ranking-number.top1 {
  background: #409EFF;
}

.ranking-number.top2 {
  background: #67C23A;
}

.ranking-number.top3 {
  background: #E6A23C;
}

.ranking-info {
  flex: 1;
}

.ranking-name {
  font-size: 14px;
  color: #303133;
  margin-bottom: 8px;
}

.ranking-value {
  font-size: 16px;
  font-weight: 600;
  color: #409EFF;
  flex-shrink: 0;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #606266;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.heatmap-container {
  overflow-x: auto;
}

.heatmap-grid {
  min-width: 1000px;
}

.heatmap-row {
  display: flex;
}

.heatmap-cell {
  flex: 1;
  min-width: 80px;
  padding: 12px;
  text-align: center;
  border: 1px solid #EBEEF5;
}

.header-cell {
  background: #F5F7FA;
  font-weight: 600;
  color: #606266;
  font-size: 13px;
}

.label-cell {
  background: #F5F7FA;
  font-weight: 600;
  color: #303133;
  text-align: left;
  min-width: 100px;
}

.data-cell {
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.data-cell:hover {
  transform: scale(1.05);
  z-index: 1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.data-cell.level-high {
  background: #F0F9FF;
  color: #67C23A;
}

.data-cell.level-medium {
  background: #FDF6EC;
  color: #E6A23C;
}

.data-cell.level-low {
  background: #FEF0F0;
  color: #F56C6C;
}

.cell-value {
  font-weight: 600;
  font-size: 13px;
}

.data-value {
  font-weight: 500;
  color: #303133;
}

.change-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-weight: 600;
}

.change-cell.increase {
  color: #F56C6C;
}

.change-cell.decrease {
  color: #67C23A;
}

.capacity-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.capacity-badge.high {
  background: #F0F9FF;
  color: #67C23A;
}

.capacity-badge.medium {
  background: #FDF6EC;
  color: #E6A23C;
}

.capacity-badge.low {
  background: #FEF0F0;
  color: #F56C6C;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.insight-content {
  padding: 8px 0;
}

.insight-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  margin-bottom: 12px;
  background: #F5F7FA;
  border-radius: 8px;
}

.insight-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.insight-text {
  flex: 1;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.insight-text strong {
  color: #303133;
}
</style>

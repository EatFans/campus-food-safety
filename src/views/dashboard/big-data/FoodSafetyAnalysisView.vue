<template>
  <div class="food-safety-analysis">
    <!-- 页面头部 -->
    <div class="page-header">
      <div>
        <h2>食品安全分析</h2>
        <p class="subtitle">全方位食品安全风险评估与预警分析系统</p>
      </div>
      <el-space>
        <el-button type="danger" :icon="WarnTriangleFilled">风险预警</el-button>
        <el-button type="primary" :icon="Document">生成报告</el-button>
        <el-button :icon="Download">导出数据</el-button>
      </el-space>
    </div>

    <!-- 安全指数仪表盘 -->
    <el-row :gutter="20" class="dashboard-section">
      <el-col :span="8">
        <el-card class="safety-score-card" shadow="hover">
          <div class="score-container">
            <div class="score-circle">
              <el-progress
                type="circle"
                :percentage="safetyScore"
                :width="180"
                :stroke-width="12"
                :color="getScoreColor(safetyScore)"
              >
                <template #default="{ percentage }">
                  <div class="score-content">
                    <div class="score-value">{{ percentage }}</div>
                    <div class="score-label">安全指数</div>
                  </div>
                </template>
              </el-progress>
            </div>
            <div class="score-status" :class="getScoreLevel(safetyScore)">
              <el-icon><CircleCheckFilled /></el-icon>
              <span>{{ getScoreText(safetyScore) }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card class="indicators-card" shadow="hover">
          <template #header>
            <span class="card-title">核心安全指标</span>
          </template>
          <div class="indicators-grid">
            <div v-for="indicator in safetyIndicators" :key="indicator.name" class="indicator-item">
              <div class="indicator-header">
                <el-icon :size="24" :color="indicator.color">
                  <component :is="indicator.icon" />
                </el-icon>
                <span class="indicator-name">{{ indicator.name }}</span>
              </div>
              <div class="indicator-value">{{ indicator.value }}{{ indicator.unit }}</div>
              <el-progress
                :percentage="indicator.percentage"
                :color="indicator.color"
                :show-text="false"
                :stroke-width="8"
              />
              <div class="indicator-status" :class="indicator.status">
                {{ indicator.statusText }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 风险分布与趋势 -->
    <el-row :gutter="20" class="risk-section">
      <el-col :span="16">
        <el-card class="risk-chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">风险趋势分析</span>
              <el-space>
                <el-segmented v-model="riskPeriod" :options="['本周', '本月', '本季度', '本年']" size="small" />
                <el-button size="small" :icon="RefreshRight">刷新</el-button>
              </el-space>
            </div>
          </template>
          <div class="chart-wrapper" style="height: 320px;">
            <v-chart :option="riskTrendOption" autoresize />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="risk-distribution-card" shadow="hover">
          <template #header>
            <span class="card-title">风险等级分布</span>
          </template>
          <div class="risk-distribution">
            <div class="chart-wrapper" style="height: 200px; margin-bottom: 20px;">
              <v-chart :option="riskDistributionOption" autoresize />
            </div>
            <div v-for="level in riskLevels" :key="level.name" class="risk-level-item">
              <div class="risk-level-header">
                <span class="risk-level-name" :style="{ color: level.color }">
                  {{ level.name }}
                </span>
                <span class="risk-level-count">{{ level.count }}项</span>
              </div>
              <el-progress
                :percentage="level.percentage"
                :color="level.color"
                :stroke-width="20"
              />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 检测数据分析 -->
    <el-row :gutter="20" class="test-section">
      <el-col :span="12">
        <el-card class="test-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">快检数据统计</span>
              <el-tag type="success">合格率 {{ testStats.passRate }}%</el-tag>
            </div>
          </template>
          <div class="test-stats">
            <div class="test-stat-item">
              <div class="test-stat-icon" style="background: #E6F7FF;">
                <el-icon :size="32" color="#409EFF"><Document /></el-icon>
              </div>
              <div class="test-stat-info">
                <div class="test-stat-label">检测总数</div>
                <div class="test-stat-value">{{ testStats.total }}</div>
              </div>
            </div>
            <div class="test-stat-item">
              <div class="test-stat-icon" style="background: #F0F9FF;">
                <el-icon :size="32" color="#67C23A"><CircleCheckFilled /></el-icon>
              </div>
              <div class="test-stat-info">
                <div class="test-stat-label">合格数</div>
                <div class="test-stat-value">{{ testStats.passed }}</div>
              </div>
            </div>
            <div class="test-stat-item">
              <div class="test-stat-icon" style="background: #FEF0F0;">
                <el-icon :size="32" color="#F56C6C"><CircleCloseFilled /></el-icon>
              </div>
              <div class="test-stat-info">
                <div class="test-stat-label">不合格数</div>
                <div class="test-stat-value">{{ testStats.failed }}</div>
              </div>
            </div>
          </div>
          <div class="chart-wrapper" style="height: 200px; margin-top: 20px;">
            <v-chart :option="testResultPieOption" autoresize />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="supplier-safety-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">供应商安全评级</span>
              <el-button size="small" link type="primary">查看全部</el-button>
            </div>
          </template>
          <div class="supplier-safety-list">
            <div v-for="supplier in supplierSafety" :key="supplier.id" class="supplier-safety-item">
              <div class="supplier-info">
                <div class="supplier-name">{{ supplier.name }}</div>
                <div class="supplier-category">{{ supplier.category }}</div>
              </div>
              <div class="supplier-rating">
                <el-rate
                  v-model="supplier.rating"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}分"
                />
              </div>
              <div class="supplier-badge">
                <el-tag :type="supplier.level" effect="dark">
                  {{ supplier.levelText }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 风险预警列表 -->
    <el-row :gutter="20" class="warning-section">
      <el-col :span="24">
        <el-card class="warning-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">风险预警列表</span>
              <el-space>
                <el-select v-model="warningFilter" placeholder="筛选" style="width: 120px" size="small">
                  <el-option label="全部" value="all" />
                  <el-option label="高风险" value="high" />
                  <el-option label="中风险" value="medium" />
                  <el-option label="低风险" value="low" />
                </el-select>
                <el-input
                  v-model="searchText"
                  placeholder="搜索"
                  :prefix-icon="Search"
                  style="width: 200px"
                  size="small"
                  clearable
                />
              </el-space>
            </div>
          </template>

          <el-table :data="warningList" stripe style="width: 100%">
            <el-table-column type="index" label="#" width="50" />
            <el-table-column label="风险等级" width="100">
              <template #default="{ row }">
                <el-tag :type="getRiskLevelType(row.level)" effect="dark">
                  {{ row.level }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="预警标题" width="200" />
            <el-table-column prop="category" label="分类" width="100">
              <template #default="{ row }">
                <el-tag size="small">{{ row.category }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" min-width="250" show-overflow-tooltip />
            <el-table-column prop="source" label="来源" width="120" />
            <el-table-column prop="time" label="发现时间" width="160" />
            <el-table-column label="处理状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)" size="small">
                  {{ row.statusText }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" size="small" @click="handleWarning(row)">
                  处理
                </el-button>
                <el-button link type="primary" size="small" @click="viewWarningDetail(row)">
                  详情
                </el-button>
                <el-button link type="danger" size="small" @click="ignoreWarning(row)">
                  忽略
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

    <!-- 改进建议 -->
    <el-row :gutter="20" class="suggestion-section">
      <el-col :span="24">
        <el-card class="suggestion-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon color="#409EFF"><Opportunity /></el-icon>
              <span class="card-title">安全改进建议</span>
            </div>
          </template>
          <div class="suggestion-grid">
            <div v-for="(suggestion, index) in suggestions" :key="index" class="suggestion-item">
              <div class="suggestion-priority" :class="suggestion.priority">
                {{ getPriorityText(suggestion.priority) }}
              </div>
              <div class="suggestion-content">
                <div class="suggestion-title">{{ suggestion.title }}</div>
                <div class="suggestion-desc">{{ suggestion.description }}</div>
                <div class="suggestion-impact">
                  <span class="impact-label">预期效果:</span>
                  <span class="impact-value">{{ suggestion.impact }}</span>
                </div>
              </div>
              <div class="suggestion-action">
                <el-button type="primary" size="small">采纳建议</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, markRaw, computed } from 'vue'
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
  WarnTriangleFilled,
  Document,
  Download,
  CircleCheckFilled,
  CircleCloseFilled,
  DataLine,
  PieChart,
  RefreshRight,
  Search,
  Opportunity,
  Check,
  Close,
  Warning
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

// 安全指数
const safetyScore = ref(87)
const riskPeriod = ref('本月')
const warningFilter = ref('all')
const searchText = ref('')

// 安全指标
const safetyIndicators = ref([
  {
    name: '食材合格率',
    value: 98.5,
    unit: '%',
    percentage: 98.5,
    color: '#67C23A',
    icon: markRaw(Check),
    status: 'excellent',
    statusText: '优秀'
  },
  {
    name: '供应商达标率',
    value: 95.2,
    unit: '%',
    percentage: 95.2,
    color: '#409EFF',
    icon: markRaw(CircleCheckFilled),
    status: 'good',
    statusText: '良好'
  },
  {
    name: '检测覆盖率',
    value: 92.8,
    unit: '%',
    percentage: 92.8,
    color: '#E6A23C',
    icon: markRaw(Document),
    status: 'good',
    statusText: '良好'
  },
  {
    name: '风险响应率',
    value: 88.6,
    unit: '%',
    percentage: 88.6,
    color: '#909399',
    icon: markRaw(Warning),
    status: 'normal',
    statusText: '正常'
  }
])

// 风险等级分布
const riskLevels = ref([
  { name: '高风险', count: 3, percentage: 15, color: '#F56C6C' },
  { name: '中风险', count: 8, percentage: 40, color: '#E6A23C' },
  { name: '低风险', count: 9, percentage: 45, color: '#409EFF' }
])

// 检测统计
const testStats = reactive({
  total: 1256,
  passed: 1238,
  failed: 18,
  passRate: 98.6
})

// 供应商安全评级
const supplierSafety = ref([
  { id: 1, name: '鲜美蔬菜供应商', category: '蔬菜类', rating: 4.8, level: 'success', levelText: 'A级' },
  { id: 2, name: '优质肉类批发', category: '肉类', rating: 4.5, level: 'success', levelText: 'A级' },
  { id: 3, name: '粮油食品公司', category: '粮油类', rating: 4.9, level: 'success', levelText: 'A+级' },
  { id: 4, name: '海鲜水产直供', category: '水产类', rating: 4.2, level: 'warning', levelText: 'B级' },
  { id: 5, name: '绿色有机农场', category: '蔬菜类', rating: 4.7, level: 'success', levelText: 'A级' }
])

// 预警列表
const warningList = ref([
  {
    id: 1,
    level: '高风险',
    title: '某批次蔬菜农药残留超标',
    category: '食材检测',
    description: '2024-12-03批次白菜检测发现农药残留超标，需立即处理',
    source: '快检系统',
    time: '2024-12-04 14:30',
    status: 'pending',
    statusText: '待处理'
  },
  {
    id: 2,
    level: '中风险',
    title: '供应商资质即将过期',
    category: '供应商管理',
    description: '海鲜水产直供的食品经营许可证将于15天后过期',
    source: '系统自动检测',
    time: '2024-12-04 10:15',
    status: 'processing',
    statusText: '处理中'
  },
  {
    id: 3,
    level: '低风险',
    title: '库存温度异常波动',
    category: '储存管理',
    description: '冷藏区温度在过去24小时内出现3次波动',
    source: '温控系统',
    time: '2024-12-04 08:20',
    status: 'resolved',
    statusText: '已解决'
  },
  {
    id: 4,
    level: '中风险',
    title: '食材溯源信息不完整',
    category: '溯源管理',
    description: '本周有5批次食材缺少完整的溯源信息',
    source: '溯源系统',
    time: '2024-12-03 16:45',
    status: 'pending',
    statusText: '待处理'
  },
  {
    id: 5,
    level: '高风险',
    title: '供应商连续两次检测不合格',
    category: '供应商管理',
    description: '某供应商提供的肉类产品连续两次快检不合格',
    source: '快检系统',
    time: '2024-12-03 11:30',
    status: 'processing',
    statusText: '处理中'
  }
])

// 改进建议
const suggestions = ref([
  {
    priority: 'high',
    title: '加强供应商准入审核',
    description: '建议对新供应商实施更严格的资质审核和现场考察制度',
    impact: '预计可降低供应商风险30%'
  },
  {
    priority: 'medium',
    title: '提升快检频次',
    description: '对高风险食材类别增加快检频次，从每周1次提升至每周2次',
    impact: '预计可提高问题发现率25%'
  },
  {
    priority: 'medium',
    title: '完善溯源体系',
    description: '建立更完善的食材溯源系统，确保每批次食材可追溯',
    impact: '预计可提升溯源完整率至100%'
  },
  {
    priority: 'low',
    title: '优化库存管理',
    description: '引入智能温控系统，实时监控库存环境',
    impact: '预计可减少储存风险15%'
  }
])

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 5
})

// 获取评分颜色
const getScoreColor = (score: number) => {
  if (score >= 90) return '#67C23A'
  if (score >= 80) return '#409EFF'
  if (score >= 70) return '#E6A23C'
  return '#F56C6C'
}

// 获取评分等级
const getScoreLevel = (score: number) => {
  if (score >= 90) return 'excellent'
  if (score >= 80) return 'good'
  if (score >= 70) return 'normal'
  return 'poor'
}

// 获取评分文本
const getScoreText = (score: number) => {
  if (score >= 90) return '安全状况优秀'
  if (score >= 80) return '安全状况良好'
  if (score >= 70) return '安全状况一般'
  return '需要改进'
}

// 获取风险等级类型
const getRiskLevelType = (level: string) => {
  const typeMap: Record<string, any> = {
    '高风险': 'danger',
    '中风险': 'warning',
    '低风险': 'info'
  }
  return typeMap[level] || 'info'
}

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    pending: 'danger',
    processing: 'warning',
    resolved: 'success'
  }
  return typeMap[status] || 'info'
}

// 获取优先级文本
const getPriorityText = (priority: string) => {
  const textMap: Record<string, string> = {
    high: '高优先级',
    medium: '中优先级',
    low: '低优先级'
  }
  return textMap[priority] || '未知'
}

// 处理预警
const handleWarning = (row: any) => {
  console.log('处理预警', row)
}

// 查看预警详情
const viewWarningDetail = (row: any) => {
  console.log('查看详情', row)
}

// 忽略预警
const ignoreWarning = (row: any) => {
  console.log('忽略预警', row)
}

// 分页处理
const handleSizeChange = (val: number) => {
  pagination.pageSize = val
}

const handleCurrentChange = (val: number) => {
  pagination.currentPage = val
}

// 风险趋势图配置
const riskTrendOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  legend: {
    data: ['高风险', '中风险', '低风险'],
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
    name: '风险数量'
  },
  series: [
    {
      name: '高风险',
      type: 'line',
      data: [5, 4, 6, 3, 4, 2, 3, 2, 4, 3, 2, 3],
      smooth: true,
      itemStyle: {
        color: '#F56C6C'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(245, 108, 108, 0.3)' },
            { offset: 1, color: 'rgba(245, 108, 108, 0.05)' }
          ]
        }
      }
    },
    {
      name: '中风险',
      type: 'line',
      data: [12, 10, 14, 11, 13, 9, 11, 8, 10, 9, 7, 8],
      smooth: true,
      itemStyle: {
        color: '#E6A23C'
      },
      areaStyle: {
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
      }
    },
    {
      name: '低风险',
      type: 'line',
      data: [15, 13, 16, 14, 15, 12, 14, 11, 13, 12, 10, 9],
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
    }
  ]
}))

// 风险分布饼图配置
const riskDistributionOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c}项 ({d}%)'
  },
  legend: {
    orient: 'horizontal',
    bottom: 0,
    left: 'center'
  },
  series: [
    {
      name: '风险等级',
      type: 'pie',
      radius: '60%',
      center: ['50%', '45%'],
      data: [
        { value: riskLevels.value[0]?.count || 0, name: '高风险', itemStyle: { color: '#F56C6C' } },
        { value: riskLevels.value[1]?.count || 0, name: '中风险', itemStyle: { color: '#E6A23C' } },
        { value: riskLevels.value[2]?.count || 0, name: '低风险', itemStyle: { color: '#409EFF' } }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      label: {
        formatter: '{b}\n{d}%'
      }
    }
  ]
}))

// 检测结果饼图配置
const testResultPieOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    right: 10,
    top: 'center'
  },
  series: [
    {
      name: '检测结果',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['40%', '50%'],
      data: [
        { value: testStats.passed, name: '合格', itemStyle: { color: '#67C23A' } },
        { value: testStats.failed, name: '不合格', itemStyle: { color: '#F56C6C' } }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      label: {
        formatter: '{b}: {d}%'
      }
    }
  ]
}))
</script>

<style scoped>
.food-safety-analysis {
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

.dashboard-section,
.risk-section,
.test-section,
.warning-section,
.suggestion-section {
  margin-bottom: 20px;
}

.safety-score-card,
.indicators-card,
.risk-chart-card,
.risk-distribution-card,
.test-card,
.supplier-safety-card,
.warning-card,
.suggestion-card {
  border-radius: 12px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.score-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.score-circle {
  margin-bottom: 20px;
}

.score-content {
  text-align: center;
}

.score-value {
  font-size: 48px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
}

.score-label {
  font-size: 14px;
  color: #909399;
  margin-top: 8px;
}

.score-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 600;
}

.score-status.excellent {
  background: #F0F9FF;
  color: #67C23A;
}

.score-status.good {
  background: #E6F7FF;
  color: #409EFF;
}

.score-status.normal {
  background: #FDF6EC;
  color: #E6A23C;
}

.score-status.poor {
  background: #FEF0F0;
  color: #F56C6C;
}

.indicators-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 8px 0;
}

.indicator-item {
  padding: 16px;
  background: #F5F7FA;
  border-radius: 8px;
}

.indicator-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.indicator-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.indicator-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.indicator-status {
  margin-top: 8px;
  font-size: 12px;
  font-weight: 500;
}

.indicator-status.excellent {
  color: #67C23A;
}

.indicator-status.good {
  color: #409EFF;
}

.indicator-status.normal {
  color: #E6A23C;
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

.risk-distribution {
  padding: 16px 0;
}

.risk-level-item {
  margin-bottom: 24px;
}

.risk-level-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.risk-level-name {
  font-size: 14px;
  font-weight: 600;
}

.risk-level-count {
  font-size: 14px;
  color: #606266;
}

.test-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.test-stat-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #F5F7FA;
  border-radius: 8px;
}

.test-stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.test-stat-info {
  flex: 1;
}

.test-stat-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.test-stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.supplier-safety-list {
  padding: 8px 0;
}

.supplier-safety-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  margin-bottom: 12px;
  background: #F5F7FA;
  border-radius: 8px;
}

.supplier-info {
  flex: 1;
}

.supplier-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.supplier-category {
  font-size: 12px;
  color: #909399;
}

.supplier-rating {
  flex-shrink: 0;
}

.supplier-badge {
  flex-shrink: 0;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.suggestion-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 8px 0;
}

.suggestion-item {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #F5F7FA;
  border-radius: 12px;
  transition: all 0.3s;
}

.suggestion-item:hover {
  background: #E6F7FF;
  transform: translateY(-2px);
}

.suggestion-priority {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  height: fit-content;
  flex-shrink: 0;
}

.suggestion-priority.high {
  background: #FEF0F0;
  color: #F56C6C;
}

.suggestion-priority.medium {
  background: #FDF6EC;
  color: #E6A23C;
}

.suggestion-priority.low {
  background: #E6F7FF;
  color: #409EFF;
}

.suggestion-content {
  flex: 1;
}

.suggestion-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.suggestion-desc {
  font-size: 13px;
  color: #606266;
  margin-bottom: 12px;
  line-height: 1.6;
}

.suggestion-impact {
  font-size: 12px;
}

.impact-label {
  color: #909399;
  margin-right: 4px;
}

.impact-value {
  color: #67C23A;
  font-weight: 600;
}

.suggestion-action {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}
</style>

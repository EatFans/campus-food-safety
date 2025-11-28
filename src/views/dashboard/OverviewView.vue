<template>
  <div class="overview-view">
    <div class="page-header">
      <h2>数据总览</h2>
      <el-space>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="default"
        />
        <el-button type="primary" :icon="Refresh" @click="refreshData">刷新数据</el-button>
        <el-button :icon="Download">导出报表</el-button>
      </el-space>
    </div>
    
    <!-- 核心数据统计 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover" class="stat-card blue">
          <el-statistic title="今日订单" :value="statsData.todayOrders">
            <template #prefix>
              <el-icon color="#409EFF"><ShoppingCart /></el-icon>
            </template>
          </el-statistic>
          <div class="stat-footer">
            <span>较昨日</span>
            <el-tag type="success" size="small">+15.2%</el-tag>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover" class="stat-card green">
          <el-statistic title="今日营业额" :value="statsData.todayRevenue" :precision="2" prefix="¥">
            <template #prefix>
              <el-icon color="#67C23A"><Money /></el-icon>
            </template>
          </el-statistic>
          <div class="stat-footer">
            <span>较昨日</span>
            <el-tag type="success" size="small">+22.8%</el-tag>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover" class="stat-card orange">
          <el-statistic title="在线用户" :value="statsData.onlineUsers">
            <template #prefix>
              <el-icon color="#E6A23C"><User /></el-icon>
            </template>
          </el-statistic>
          <div class="stat-footer">
            <span>较昨日</span>
            <el-tag type="warning" size="small">-5.3%</el-tag>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover" class="stat-card red">
          <el-statistic title="待处理事项" :value="statsData.pendingTasks">
            <template #prefix>
              <el-icon color="#F56C6C"><Bell /></el-icon>
            </template>
          </el-statistic>
          <div class="stat-footer">
            <span>需及时处理</span>
            <el-tag type="danger" size="small">紧急</el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="16" style="margin-top: 16px;">
      <!-- 销售趋势折线图 -->
      <el-col :xs="24" :lg="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>销售趋势</span>
              <el-radio-group v-model="chartType" size="small" @change="updateSalesChart">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="year">本年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container">
            <v-chart :option="salesChartOption" autoresize />
          </div>
        </el-card>
      </el-col>
      
      <!-- 热门菜品排行 -->
      <el-col :xs="24" :lg="8">
        <el-card shadow="hover">
          <template #header>
            <span>热门菜品排行</span>
          </template>
          <el-table :data="topDishes" style="width: 100%" :show-header="false">
            <el-table-column prop="rank" width="50" align="center">
              <template #default="{ row }">
                <el-tag :type="getRankType(row.rank)" size="small">{{ row.rank }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="name" />
            <el-table-column prop="sales" width="80" align="right">
              <template #default="{ row }">
                <span class="sales-text">{{ row.sales }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 第二行图表 -->
    <el-row :gutter="16" style="margin-top: 16px;">
      <!-- 订单统计条形图 -->
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover">
          <template #header>
            <span>各部门订单统计</span>
          </template>
          <div class="chart-container">
            <v-chart :option="orderBarChartOption" autoresize />
          </div>
        </el-card>
      </el-col>
      
      <!-- 菜品分类占比饼图 -->
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover">
          <template #header>
            <span>菜品分类占比</span>
          </template>
          <div class="chart-container">
            <v-chart :option="categoryPieChartOption" autoresize />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Refresh, Download, ShoppingCart, Money, User, Bell } from '@element-plus/icons-vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import { ElMessage } from 'element-plus'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const dateRange = ref<[Date, Date]>([new Date(), new Date()])
const chartType = ref('week')

// 统计数据
const statsData = reactive({
  todayOrders: 1285,
  todayRevenue: 58960,
  onlineUsers: 3542,
  pendingTasks: 28
})

// 热门菜品排行
const topDishes = ref([
  { rank: 1, name: '宫保鸡丁', sales: '1285份' },
  { rank: 2, name: '红烧肉', sales: '1089份' },
  { rank: 3, name: '鱼香肉丝', sales: '956份' },
  { rank: 4, name: '麻婆豆腐', sales: '832份' },
  { rank: 5, name: '糖醋排骨', sales: '728份' },
  { rank: 6, name: '水煮鱼', sales: '685份' },
  { rank: 7, name: '酸菜鱼', sales: '612份' },
  { rank: 8, name: '回锅肉', sales: '568份' }
])

// 销售趋势数据
const salesData = {
  week: {
    dates: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    orders: [820, 932, 901, 934, 1290, 1330, 1320],
    revenue: [35000, 42000, 38000, 45000, 58000, 62000, 59000]
  },
  month: {
    dates: Array.from({ length: 30 }, (_, i) => `${i + 1}日`),
    orders: Array.from({ length: 30 }, () => Math.floor(Math.random() * 500) + 800),
    revenue: Array.from({ length: 30 }, () => Math.floor(Math.random() * 30000) + 35000)
  },
  year: {
    dates: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    orders: [25000, 23000, 28000, 32000, 35000, 38000, 42000, 45000, 43000, 46000, 48000, 52000],
    revenue: [1200000, 1100000, 1350000, 1550000, 1680000, 1820000, 2010000, 2150000, 2050000, 2200000, 2300000, 2480000]
  }
}

// 销售趋势图表配置
const salesChartOption = computed(() => {
  const data = salesData[chartType.value as keyof typeof salesData]
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['订单数', '营业额']
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
      data: data.dates
    },
    yAxis: [
      {
        type: 'value',
        name: '订单数',
        position: 'left'
      },
      {
        type: 'value',
        name: '营业额(元)',
        position: 'right'
      }
    ],
    series: [
      {
        name: '订单数',
        type: 'line',
        smooth: true,
        data: data.orders,
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
        name: '营业额',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        data: data.revenue,
        itemStyle: {
          color: '#67C23A'
        },
        areaStyle: {
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
        }
      }
    ]
  }
})

// 订单统计条形图配置
const orderBarChartOption = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    boundaryGap: [0, 0.01]
  },
  yAxis: {
    type: 'category',
    data: ['厨房1区', '厨房2区', '厨房3区', '餐厅A', '餐厅B', '外卖部']
  },
  series: [
    {
      name: '订单数',
      type: 'bar',
      data: [2850, 2680, 2450, 3200, 2980, 4100],
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#409EFF' },
            { offset: 1, color: '#67C23A' }
          ]
        }
      },
      label: {
        show: true,
        position: 'right',
        formatter: '{c}单'
      }
    }
  ]
})

// 菜品分类占比饼图配置
const categoryPieChartOption = ref({
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
      name: '菜品分类',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{b}: {d}%'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      data: [
        { value: 3850, name: '川菜', itemStyle: { color: '#409EFF' } },
        { value: 2680, name: '粤菜', itemStyle: { color: '#67C23A' } },
        { value: 2150, name: '湘菜', itemStyle: { color: '#E6A23C' } },
        { value: 1850, name: '鲁菜', itemStyle: { color: '#F56C6C' } },
        { value: 1520, name: '浙菜', itemStyle: { color: '#909399' } },
        { value: 1200, name: '其他', itemStyle: { color: '#C0C4CC' } }
      ]
    }
  ]
})

// 刷新数据
const refreshData = () => {
  ElMessage.success('数据已刷新')
  // 模拟数据更新
  statsData.todayOrders = Math.floor(Math.random() * 500) + 1000
  statsData.todayRevenue = Math.floor(Math.random() * 20000) + 50000
  statsData.onlineUsers = Math.floor(Math.random() * 1000) + 3000
  statsData.pendingTasks = Math.floor(Math.random() * 20) + 10
}

// 更新销售图表
const updateSalesChart = () => {
  // 图表会自动响应 chartType 变化
}

// 获取排名标签类型
const getRankType = (rank: number) => {
  if (rank === 1) return 'danger'
  if (rank === 2) return 'warning'
  if (rank === 3) return 'success'
  return 'info'
}
</script>

<style scoped>
.overview-view {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #303133;
}

.stats-row {
  margin-top: 0;
}

.stat-card {
  height: 100%;
  transition: all 0.3s;
  border-radius: 8px;
}

.stat-card.blue {
  border-left: 4px solid #409EFF;
}

.stat-card.green {
  border-left: 4px solid #67C23A;
}

.stat-card.orange {
  border-left: 4px solid #E6A23C;
}

.stat-card.red {
  border-left: 4px solid #F56C6C;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: 350px;
  width: 100%;
}

.sales-text {
  color: #409EFF;
  font-weight: 600;
}

:deep(.el-card) {
  border-radius: 8px;
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
  background-color: #fafafa;
  font-weight: 600;
}

:deep(.el-statistic__head) {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

:deep(.el-statistic__content) {
  font-size: 28px;
  font-weight: 600;
}

:deep(.el-table) {
  font-size: 14px;
}

:deep(.el-table td) {
  padding: 10px 0;
}
</style>

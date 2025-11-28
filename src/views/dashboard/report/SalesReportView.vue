<template>
  <div class="sales-report-view">
    <div class="page-header">
      <h2>销售报表</h2>
      <el-space>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <el-button type="primary" :icon="Download">导出报表</el-button>
      </el-space>
    </div>

    <el-row :gutter="16" class="stats-row">
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="总销售额" :value="589600" :precision="2" prefix="¥">
            <template #suffix>
              <el-tag type="success" size="small">+18.5%</el-tag>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="订单总数" :value="12850">
            <template #suffix>
              <el-tag type="success" size="small">+12.3%</el-tag>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="客单价" :value="45.8" :precision="2" prefix="¥">
            <template #suffix>
              <el-tag type="warning" size="small">-2.1%</el-tag>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="退款金额" :value="8960" :precision="2" prefix="¥">
            <template #suffix>
              <el-tag type="danger" size="small">+5.2%</el-tag>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-top: 16px;">
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header>
            <span>销售趋势图</span>
          </template>
          <div class="chart-container">
            <el-empty description="图表区域 - 可集成 ECharts" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-top: 16px;">
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover">
          <template #header>
            <span>销售排行榜</span>
          </template>
          <el-table :data="topSales" style="width: 100%">
            <el-table-column label="排名" prop="rank" width="80" />
            <el-table-column label="菜品名称" prop="name" />
            <el-table-column label="销售额" prop="amount" width="120" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover">
          <template #header>
            <span>销售分类占比</span>
          </template>
          <div class="chart-container">
            <el-empty description="饼图区域" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Download } from '@element-plus/icons-vue'

const dateRange = ref<[Date, Date]>([new Date(), new Date()])

const topSales = ref([
  { rank: 1, name: '宫保鸡丁', amount: '¥58,960' },
  { rank: 2, name: '红烧肉', amount: '¥45,230' },
  { rank: 3, name: '鱼香肉丝', amount: '¥38,560' },
  { rank: 4, name: '麻婆豆腐', amount: '¥32,180' },
  { rank: 5, name: '糖醋排骨', amount: '¥28,950' }
])
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.stats-row {
  margin-top: 20px;
}

.stat-card {
  text-align: center;
}

.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<template>
  <div class="energy-consumption-view">
    <div class="page-header">
      <h2>能耗统计</h2>
      <el-space>
        <el-date-picker
          v-model="dateRange"
          type="monthrange"
          range-separator="至"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
        />
        <el-button type="primary" :icon="Download">导出报表</el-button>
      </el-space>
    </div>

    <el-row :gutter="16" class="stats-row">
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card electricity">
          <el-statistic title="本月用电" :value="15680" suffix="kWh" />
          <div class="stat-footer">
            <span>较上月</span>
            <el-tag type="success" size="small">-8.5%</el-tag>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card water">
          <el-statistic title="本月用水" :value="2850" suffix="吨" />
          <div class="stat-footer">
            <span>较上月</span>
            <el-tag type="warning" size="small">+3.2%</el-tag>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card gas">
          <el-statistic title="本月燃气" :value="1250" suffix="m³" />
          <div class="stat-footer">
            <span>较上月</span>
            <el-tag type="success" size="small">-5.8%</el-tag>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card cost">
          <el-statistic title="能耗费用" :value="28560" :precision="2" prefix="¥">
            <template #prefix>
              <el-icon><Money /></el-icon>
            </template>
          </el-statistic>
          <div class="stat-footer">
            <span>较上月</span>
            <el-tag type="success" size="small">-6.5%</el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-top: 16px;">
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>能耗趋势分析</span>
              <el-radio-group v-model="chartType" size="small">
                <el-radio-button label="day">日</el-radio-button>
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container">
            <el-empty description="能耗趋势图表区域" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-top: 16px;">
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover">
          <template #header>
            <span>能耗占比</span>
          </template>
          <div class="chart-container">
            <el-empty description="饼图区域" />
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover">
          <template #header>
            <span>分区能耗排行</span>
          </template>
          <el-table :data="areaConsumption" style="width: 100%">
            <el-table-column label="区域" prop="area" />
            <el-table-column label="用电(kWh)" prop="electricity" width="120" />
            <el-table-column label="用水(吨)" prop="water" width="100" />
            <el-table-column label="燃气(m³)" prop="gas" width="100" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Download, Money } from '@element-plus/icons-vue'

const dateRange = ref<[Date, Date]>([new Date(), new Date()])
const chartType = ref('month')

const areaConsumption = ref([
  { area: '厨房1区', electricity: '3850', water: '680', gas: '320' },
  { area: '厨房2区', electricity: '4120', water: '720', gas: '380' },
  { area: '餐厅区域', electricity: '2560', water: '450', gas: '150' },
  { area: '办公区域', electricity: '1850', water: '280', gas: '80' },
  { area: '其他区域', electricity: '3300', water: '720', gas: '320' }
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

.stat-card.electricity {
  border-left: 4px solid #409EFF;
}

.stat-card.water {
  border-left: 4px solid #67C23A;
}

.stat-card.gas {
  border-left: 4px solid #E6A23C;
}

.stat-card.cost {
  border-left: 4px solid #F56C6C;
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
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

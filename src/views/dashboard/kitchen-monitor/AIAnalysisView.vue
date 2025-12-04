<template>
  <div class="ai-analysis-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-icon">
          <el-icon :size="24"><Cpu /></el-icon>
        </div>
        <div class="header-content">
          <h2>AI智能分析</h2>
          <p class="header-desc">基于AI视觉识别技术,自动识别违规行为和安全隐患</p>
        </div>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="Setting">模型配置</el-button>
        <el-button :icon="Download">导出分析报告</el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stats-cards">
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card-blue">
          <div class="stat-icon">
            <el-icon :size="32"><DataAnalysis /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.totalAnalysis }}</div>
            <div class="stat-label">分析次数(今日)</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card-green">
          <div class="stat-icon">
            <el-icon :size="32"><SuccessFilled /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.accuracy }}%</div>
            <div class="stat-label">识别准确率</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card-orange">
          <div class="stat-icon">
            <el-icon :size="32"><Warning /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.alerts }}</div>
            <div class="stat-label">今日预警</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card-cyan">
          <div class="stat-icon">
            <el-icon :size="32"><TrendCharts /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.improvement }}%</div>
            <div class="stat-label">合规率提升</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- AI分析功能区 -->
    <el-row :gutter="16" class="analysis-section">
      <!-- 识别类型统计 -->
      <el-col :span="12">
        <el-card shadow="never" class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">识别类型分布</span>
              <el-select v-model="chartPeriod" size="small" style="width: 100px">
                <el-option label="今日" value="today" />
                <el-option label="本周" value="week" />
                <el-option label="本月" value="month" />
              </el-select>
            </div>
          </template>
          <div class="chart-container" ref="typeChartRef">
            <div class="chart-placeholder">
              <el-icon :size="64" color="#409EFF"><PieChart /></el-icon>
              <p>识别类型分布图表</p>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 时段分析 -->
      <el-col :span="12">
        <el-card shadow="never" class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">违规行为时段分析</span>
              <el-date-picker
                v-model="analysisDate"
                type="date"
                placeholder="选择日期"
                size="small"
                style="width: 150px"
              />
            </div>
          </template>
          <div class="chart-container" ref="trendChartRef">
            <div class="chart-placeholder">
              <el-icon :size="64" color="#67C23A"><TrendCharts /></el-icon>
              <p>时段趋势分析图表</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- AI识别模型 -->
    <el-card shadow="never" class="model-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">AI识别模型</span>
          <el-button type="primary" size="small" :icon="Plus" @click="handleAddModel">
            添加模型
          </el-button>
        </div>
      </template>

      <el-row :gutter="16">
        <el-col :xs="24" :sm="12" :lg="6" v-for="model in aiModels" :key="model.id">
          <div class="model-item" :class="{ active: model.enabled }">
            <div class="model-header">
              <div class="model-icon">
                <el-icon :size="32"><Cpu /></el-icon>
              </div>
              <el-switch v-model="model.enabled" @change="handleModelToggle(model)" />
            </div>
            <div class="model-info">
              <h4>{{ model.name }}</h4>
              <p class="model-desc">{{ model.description }}</p>
              <div class="model-stats">
                <div class="stat-item">
                  <span class="label">准确率:</span>
                  <span class="value">{{ model.accuracy }}%</span>
                </div>
                <div class="stat-item">
                  <span class="label">识别次数:</span>
                  <span class="value">{{ model.count }}</span>
                </div>
              </div>
            </div>
            <div class="model-actions">
              <el-button size="small" text @click="handleConfigModel(model)">
                配置
              </el-button>
              <el-button size="small" text type="primary" @click="handleTestModel(model)">
                测试
              </el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- AI分析记录 -->
    <el-card shadow="never" class="record-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">AI分析记录</span>
        </div>
      </template>

      <!-- 搜索表单 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="识别类型">
          <el-select v-model="searchForm.type" placeholder="请选择" clearable style="width: 150px">
            <el-option label="未戴口罩" value="no-mask" />
            <el-option label="未戴帽子" value="no-hat" />
            <el-option label="抽烟" value="smoking" />
            <el-option label="玩手机" value="phone" />
            <el-option label="老鼠" value="rat" />
          </el-select>
        </el-form-item>
        <el-form-item label="风险等级">
          <el-select v-model="searchForm.level" placeholder="请选择" clearable style="width: 120px">
            <el-option label="高风险" value="high" />
            <el-option label="中风险" value="medium" />
            <el-option label="低风险" value="low" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable style="width: 120px">
            <el-option label="已处理" value="handled" />
            <el-option label="待处理" value="pending" />
            <el-option label="已忽略" value="ignored" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 分析记录表格 -->
      <el-table :data="analysisRecords" stripe style="width: 100%" v-loading="loading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="time" label="识别时间" width="160" />
        <el-table-column prop="camera" label="摄像头" min-width="150" />
        <el-table-column prop="type" label="识别类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getTypeTagType(row.type)">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="风险等级" width="100">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="confidence" label="置信度" width="100">
          <template #default="{ row }">
            <el-progress 
              :percentage="row.confidence" 
              :color="getConfidenceColor(row.confidence)"
              :stroke-width="8"
            />
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="180" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleViewSnapshot(row)">查看截图</el-button>
            <el-button type="success" link @click="handleProcess(row)">处理</el-button>
            <el-button type="info" link @click="handleIgnore(row)">忽略</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { 
  Plus, Download, Search, Refresh, Setting, Cpu, DataAnalysis, 
  SuccessFilled, Warning, TrendCharts, PieChart
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 统计数据
const statistics = reactive({
  totalAnalysis: 1856,
  accuracy: 96.8,
  alerts: 23,
  improvement: 15.6
})

// 图表时间范围
const chartPeriod = ref('today')
const analysisDate = ref(new Date())

// AI模型
const aiModels = ref([
  {
    id: 1,
    name: '口罩识别',
    description: '检测工作人员是否佩戴口罩',
    accuracy: 98.5,
    count: 5680,
    enabled: true
  },
  {
    id: 2,
    name: '帽子识别',
    description: '检测工作人员是否佩戴工作帽',
    accuracy: 97.2,
    count: 5680,
    enabled: true
  },
  {
    id: 3,
    name: '抽烟识别',
    description: '检测操作区域是否有人抽烟',
    accuracy: 95.8,
    count: 856,
    enabled: true
  },
  {
    id: 4,
    name: '手机识别',
    description: '检测工作人员是否在操作时玩手机',
    accuracy: 94.3,
    count: 1256,
    enabled: true
  },
  {
    id: 5,
    name: '老鼠识别',
    description: '检测操作区域是否有老鼠出现',
    accuracy: 99.1,
    count: 12,
    enabled: true
  },
  {
    id: 6,
    name: '火焰识别',
    description: '检测是否有明火或火灾隐患',
    accuracy: 99.5,
    count: 3,
    enabled: true
  }
])

// 搜索表单
const searchForm = reactive({
  type: '',
  level: '',
  status: ''
})

const loading = ref(false)

// 分析记录
const analysisRecords = ref([
  {
    id: 1,
    time: '2024-12-04 10:15:32',
    camera: '第一食堂-操作间1',
    type: '未戴口罩',
    level: '高风险',
    confidence: 98,
    description: '检测到1名工作人员未佩戴口罩',
    status: '待处理'
  },
  {
    id: 2,
    time: '2024-12-04 10:20:15',
    camera: '第一食堂-操作间2',
    type: '玩手机',
    level: '中风险',
    confidence: 92,
    description: '检测到工作人员在操作时使用手机',
    status: '已处理'
  },
  {
    id: 3,
    time: '2024-12-04 10:35:48',
    camera: '第二食堂-仓库',
    type: '老鼠',
    level: '高风险',
    confidence: 96,
    description: '检测到老鼠出现在仓库区域',
    status: '已处理'
  }
])

const pagination = reactive({
  page: 1,
  size: 10,
  total: 3
})

const handleModelToggle = (model: any) => {
  ElMessage.success(`${model.enabled ? '启用' : '禁用'}模型: ${model.name}`)
}

const handleConfigModel = (model: any) => {
  ElMessage.info(`配置模型: ${model.name}`)
}

const handleTestModel = (model: any) => {
  ElMessage.info(`测试模型: ${model.name}`)
}

const handleAddModel = () => {
  ElMessage.info('添加新模型')
}

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    ElMessage.success('查询成功')
    loading.value = false
  }, 500)
}

const handleReset = () => {
  searchForm.type = ''
  searchForm.level = ''
  searchForm.status = ''
}

const handleViewSnapshot = (row: any) => {
  ElMessage.info(`查看截图: ${row.type}`)
}

const handleProcess = (row: any) => {
  ElMessage.success(`处理记录: ${row.type}`)
}

const handleIgnore = (row: any) => {
  ElMessageBox.confirm(`确定要忽略此记录吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('已忽略')
  })
}

const getTypeTagType = (type: string) => {
  const map: Record<string, any> = {
    '未戴口罩': 'danger',
    '未戴帽子': 'warning',
    '抽烟': 'danger',
    '玩手机': 'warning',
    '老鼠': 'danger'
  }
  return map[type] || ''
}

const getLevelType = (level: string) => {
  const map: Record<string, any> = {
    '高风险': 'danger',
    '中风险': 'warning',
    '低风险': 'success'
  }
  return map[level] || 'info'
}

const getStatusTagType = (status: string) => {
  const map: Record<string, any> = {
    '已处理': 'success',
    '待处理': 'warning',
    '已忽略': 'info'
  }
  return map[status] || 'info'
}

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 90) return '#67C23A'
  if (confidence >= 70) return '#E6A23C'
  return '#F56C6C'
}
</script>

<style scoped>
.ai-analysis-view {
  padding: 24px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e8f4ff;
  border-radius: 10px;
  color: #409EFF;
}

.header-content h2 {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.header-desc {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 统计卡片 */
.stats-cards {
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  cursor: pointer;
  border-left: 4px solid transparent;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

.stat-card-blue {
  border-left-color: #409EFF;
}

.stat-card-blue .stat-icon {
  background: #e8f4ff;
  color: #409EFF;
}

.stat-card-green {
  border-left-color: #67C23A;
}

.stat-card-green .stat-icon {
  background: #e8f8e8;
  color: #67C23A;
}

.stat-card-orange {
  border-left-color: #E6A23C;
}

.stat-card-orange .stat-icon {
  background: #fef3e8;
  color: #E6A23C;
}

.stat-card-cyan {
  border-left-color: #17a2b8;
}

.stat-card-cyan .stat-icon {
  background: #e8f8fa;
  color: #17a2b8;
}

.stat-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
}

/* 分析区域 */
.analysis-section {
  margin-bottom: 24px;
}

.chart-card,
.model-card,
.record-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-weight: 600;
  font-size: 16px;
  color: #1f2937;
}

.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  text-align: center;
  color: #909399;
}

.chart-placeholder p {
  margin-top: 16px;
  font-size: 14px;
}

/* AI模型卡片 */
.model-item {
  padding: 20px;
  background: #fff;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.3s ease;
  margin-bottom: 16px;
}

.model-item:hover {
  border-color: #409EFF;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.model-item.active {
  border-color: #67C23A;
  background: #f0f9ff;
}

.model-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.model-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e8f4ff;
  border-radius: 8px;
  color: #409EFF;
}

.model-info h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.model-desc {
  margin: 0 0 12px 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
}

.model-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  font-size: 13px;
}

.stat-item .label {
  color: #6b7280;
}

.stat-item .value {
  color: #1f2937;
  font-weight: 600;
  margin-left: 4px;
}

.model-actions {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 8px;
}

/* 搜索表单 */
.search-form {
  margin-bottom: 16px;
}

.search-form :deep(.el-form-item) {
  margin-bottom: 0;
}

.search-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #374151;
}

/* 表格 */
.record-card :deep(.el-table) {
  font-size: 14px;
}

.record-card :deep(.el-table th) {
  background: #f9fafb;
  color: #374151;
  font-weight: 600;
}

.record-card :deep(.el-table td),
.record-card :deep(.el-table th) {
  padding: 14px 0;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-button.is-link) {
  padding: 4px 8px;
  font-size: 13px;
}
</style>

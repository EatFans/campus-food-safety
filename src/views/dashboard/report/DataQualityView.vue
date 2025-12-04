<template>
  <div class="data-quality-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2>数据质量分析</h2>
        <p class="header-desc">数据完整性、准确性、及时性综合评估</p>
      </div>
      <div class="header-actions">
        <el-date-picker
          v-model="analysisDate"
          type="date"
          placeholder="选择分析日期"
          style="width: 180px; margin-right: 12px;"
        />
        <el-button type="primary" :icon="Refresh" @click="refreshData">刷新</el-button>
        <el-button type="success" :icon="Download" @click="exportReport">导出报告</el-button>
      </div>
    </div>

    <!-- 综合评分 -->
    <el-row :gutter="16" class="score-section">
      <el-col :xs="24" :md="8">
        <el-card shadow="hover" class="score-card overall">
          <div class="score-content">
            <div class="score-label">综合质量评分</div>
            <div class="score-value">{{ overallScore }}</div>
            <div class="score-rating">
              <el-rate v-model="ratingValue" disabled show-score text-color="#ff9900" />
            </div>
            <div class="score-desc">数据质量良好</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="16">
        <el-card shadow="hover" class="dimension-card">
          <div class="dimension-grid">
            <div class="dimension-item completeness">
              <div class="dimension-icon">
                <el-icon><DocumentChecked /></el-icon>
              </div>
              <div class="dimension-info">
                <div class="dimension-label">完整性</div>
                <div class="dimension-value">{{ completenessScore }}%</div>
                <el-progress :percentage="completenessScore" :show-text="false" color="#67C23A" />
              </div>
            </div>
            <div class="dimension-item accuracy">
              <div class="dimension-icon">
                <el-icon><Aim /></el-icon>
              </div>
              <div class="dimension-info">
                <div class="dimension-label">准确性</div>
                <div class="dimension-value">{{ accuracyScore }}%</div>
                <el-progress :percentage="accuracyScore" :show-text="false" color="#409EFF" />
              </div>
            </div>
            <div class="dimension-item timeliness">
              <div class="dimension-icon">
                <el-icon><Clock /></el-icon>
              </div>
              <div class="dimension-info">
                <div class="dimension-label">及时性</div>
                <div class="dimension-value">{{ timelinessScore }}%</div>
                <el-progress :percentage="timelinessScore" :show-text="false" color="#E6A23C" />
              </div>
            </div>
            <div class="dimension-item consistency">
              <div class="dimension-icon">
                <el-icon><Connection /></el-icon>
              </div>
              <div class="dimension-info">
                <div class="dimension-label">一致性</div>
                <div class="dimension-value">{{ consistencyScore }}%</div>
                <el-progress :percentage="consistencyScore" :show-text="false" color="#909399" />
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据质量趋势 -->
    <el-row :gutter="16" class="trend-section">
      <el-col :xs="24" :md="16">
        <el-card shadow="hover" class="trend-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">数据质量趋势</span>
              <el-radio-group v-model="trendPeriod" size="small">
                <el-radio-button label="week">近7天</el-radio-button>
                <el-radio-button label="month">近30天</el-radio-button>
                <el-radio-button label="quarter">近3月</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container" style="height: 300px;">
            <el-empty description="趋势图待集成 (ECharts)" />
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="8">
        <el-card shadow="hover" class="issue-card">
          <template #header>
            <span class="card-title">质量问题分布</span>
          </template>
          <div class="issue-list">
            <div v-for="issue in qualityIssues" :key="issue.type" class="issue-item">
              <div class="issue-header">
                <span class="issue-type">{{ issue.type }}</span>
                <el-tag :type="getIssueTagType(issue.level)" size="small">
                  {{ issue.count }}
                </el-tag>
              </div>
              <el-progress
                :percentage="issue.percentage"
                :color="getIssueColor(issue.level)"
                :stroke-width="6"
              />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据源质量分析 -->
    <el-card shadow="hover" class="datasource-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">数据源质量分析</span>
          <el-space>
            <el-input
              v-model="searchKeyword"
              placeholder="搜索数据源"
              :prefix-icon="Search"
              size="small"
              style="width: 200px"
              clearable
            />
            <el-select v-model="filterStatus" placeholder="状态筛选" size="small" style="width: 120px">
              <el-option label="全部" value="all" />
              <el-option label="优秀" value="excellent" />
              <el-option label="良好" value="good" />
              <el-option label="一般" value="fair" />
              <el-option label="较差" value="poor" />
            </el-select>
          </el-space>
        </div>
      </template>

      <el-table :data="dataSourceList" v-loading="loading" stripe>
        <el-table-column type="index" label="#" width="50" align="center" />
        <el-table-column label="数据源名称" prop="name" width="180" />
        <el-table-column label="数据类型" prop="type" width="120">
          <template #default="{ row }">
            <el-tag size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="完整性" prop="completeness" width="120" align="center">
          <template #default="{ row }">
            <el-progress
              :percentage="row.completeness"
              :color="getScoreColor(row.completeness)"
              :stroke-width="8"
              style="width: 80px;"
            />
          </template>
        </el-table-column>
        <el-table-column label="准确性" prop="accuracy" width="120" align="center">
          <template #default="{ row }">
            <el-progress
              :percentage="row.accuracy"
              :color="getScoreColor(row.accuracy)"
              :stroke-width="8"
              style="width: 80px;"
            />
          </template>
        </el-table-column>
        <el-table-column label="及时性" prop="timeliness" width="120" align="center">
          <template #default="{ row }">
            <el-progress
              :percentage="row.timeliness"
              :color="getScoreColor(row.timeliness)"
              :stroke-width="8"
              style="width: 80px;"
            />
          </template>
        </el-table-column>
        <el-table-column label="综合评分" prop="overallScore" width="100" align="center">
          <template #default="{ row }">
            <span class="score-badge" :class="getScoreLevel(row.overallScore)">
              {{ row.overallScore }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="质量等级" prop="level" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getLevelTagType(row.level)" size="small">
              {{ getLevelText(row.level) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="问题数" prop="issueCount" width="80" align="center">
          <template #default="{ row }">
            <el-badge :value="row.issueCount" :type="row.issueCount > 0 ? 'danger' : 'success'">
              <el-button size="small" circle />
            </el-badge>
          </template>
        </el-table-column>
        <el-table-column label="最后更新" prop="lastUpdate" width="180" />
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="viewDetail(row)">详情</el-button>
            <el-button link type="warning" size="small" @click="analyzeData(row)">分析</el-button>
            <el-button link type="info" size="small" @click="exportData(row)">导出</el-button>
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
        />
      </div>
    </el-card>

    <!-- 质量改进建议 -->
    <el-card shadow="hover" class="suggestion-card">
      <template #header>
        <span class="card-title">质量改进建议</span>
      </template>
      <el-row :gutter="16">
        <el-col :xs="24" :md="8" v-for="suggestion in suggestions" :key="suggestion.id">
          <div class="suggestion-item" :class="suggestion.priority">
            <div class="suggestion-header">
              <el-icon class="suggestion-icon">
                <component :is="suggestion.icon" />
              </el-icon>
              <span class="suggestion-title">{{ suggestion.title }}</span>
            </div>
            <div class="suggestion-content">{{ suggestion.content }}</div>
            <div class="suggestion-footer">
              <el-tag :type="getPriorityTagType(suggestion.priority)" size="small">
                {{ getPriorityText(suggestion.priority) }}
              </el-tag>
              <el-button link type="primary" size="small" @click="applySuggestion(suggestion)">
                应用建议
              </el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, markRaw } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Refresh, Download, Search, DocumentChecked, Aim, Clock,
  Connection, WarningFilled, InfoFilled, CircleCheckFilled
} from '@element-plus/icons-vue'

interface QualityIssue {
  type: string
  count: number
  percentage: number
  level: 'high' | 'medium' | 'low'
}

interface DataSource {
  id: string
  name: string
  type: string
  completeness: number
  accuracy: number
  timeliness: number
  overallScore: number
  level: 'excellent' | 'good' | 'fair' | 'poor'
  issueCount: number
  lastUpdate: string
}

interface Suggestion {
  id: string
  title: string
  content: string
  priority: 'high' | 'medium' | 'low'
  icon: any
}

const loading = ref(false)
const analysisDate = ref(new Date())
const trendPeriod = ref('month')
const searchKeyword = ref('')
const filterStatus = ref('all')

const overallScore = ref(88)
const ratingValue = ref(4.5)
const completenessScore = ref(92)
const accuracyScore = ref(88)
const timelinessScore = ref(85)
const consistencyScore = ref(87)

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const qualityIssues = ref<QualityIssue[]>([
  { type: '数据缺失', count: 12, percentage: 35, level: 'high' },
  { type: '格式错误', count: 8, percentage: 24, level: 'medium' },
  { type: '重复数据', count: 6, percentage: 18, level: 'medium' },
  { type: '数据延迟', count: 5, percentage: 15, level: 'low' },
  { type: '其他问题', count: 3, percentage: 8, level: 'low' }
])

const dataSourceList = ref<DataSource[]>([
  {
    id: '1',
    name: '采购管理系统',
    type: '业务系统',
    completeness: 95,
    accuracy: 92,
    timeliness: 88,
    overallScore: 92,
    level: 'excellent',
    issueCount: 2,
    lastUpdate: '2025-12-04 10:30'
  },
  {
    id: '2',
    name: '库存管理系统',
    type: '业务系统',
    completeness: 88,
    accuracy: 85,
    timeliness: 90,
    overallScore: 88,
    level: 'good',
    issueCount: 5,
    lastUpdate: '2025-12-04 09:15'
  },
  {
    id: '3',
    name: '供应商数据',
    type: '外部数据',
    completeness: 78,
    accuracy: 82,
    timeliness: 75,
    overallScore: 78,
    level: 'fair',
    issueCount: 8,
    lastUpdate: '2025-12-03 18:20'
  },
  {
    id: '4',
    name: '快检记录',
    type: '检测数据',
    completeness: 92,
    accuracy: 95,
    timeliness: 93,
    overallScore: 93,
    level: 'excellent',
    issueCount: 1,
    lastUpdate: '2025-12-04 11:00'
  }
])

const suggestions = ref<Suggestion[]>([
  {
    id: '1',
    title: '完善数据录入规范',
    content: '建议制定统一的数据录入标准，减少格式错误和数据缺失问题',
    priority: 'high',
    icon: markRaw(WarningFilled)
  },
  {
    id: '2',
    title: '优化数据同步机制',
    content: '建议优化系统间数据同步频率，提高数据及时性',
    priority: 'medium',
    icon: markRaw(InfoFilled)
  },
  {
    id: '3',
    title: '建立数据质量监控',
    content: '建议建立自动化数据质量监控机制，及时发现和处理问题',
    priority: 'high',
    icon: markRaw(CircleCheckFilled)
  }
])

const getIssueTagType = (level: string) => {
  const types: Record<string, any> = {
    high: 'danger',
    medium: 'warning',
    low: 'info'
  }
  return types[level] || 'info'
}

const getIssueColor = (level: string) => {
  const colors: Record<string, string> = {
    high: '#F56C6C',
    medium: '#E6A23C',
    low: '#909399'
  }
  return colors[level] || '#909399'
}

const getScoreColor = (score: number) => {
  if (score >= 90) return '#67C23A'
  if (score >= 80) return '#409EFF'
  if (score >= 70) return '#E6A23C'
  return '#F56C6C'
}

const getScoreLevel = (score: number) => {
  if (score >= 90) return 'excellent'
  if (score >= 80) return 'good'
  if (score >= 70) return 'fair'
  return 'poor'
}

const getLevelTagType = (level: string) => {
  const types: Record<string, any> = {
    excellent: 'success',
    good: 'primary',
    fair: 'warning',
    poor: 'danger'
  }
  return types[level] || 'info'
}

const getLevelText = (level: string) => {
  const texts: Record<string, string> = {
    excellent: '优秀',
    good: '良好',
    fair: '一般',
    poor: '较差'
  }
  return texts[level] || '未知'
}

const getPriorityTagType = (priority: string) => {
  const types: Record<string, any> = {
    high: 'danger',
    medium: 'warning',
    low: 'info'
  }
  return types[priority] || 'info'
}

const getPriorityText = (priority: string) => {
  const texts: Record<string, string> = {
    high: '高优先级',
    medium: '中优先级',
    low: '低优先级'
  }
  return texts[priority] || '未知'
}

const refreshData = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据已刷新')
  }, 1000)
}

const exportReport = () => {
  ElMessage.success('报告导出功能开发中...')
}

const viewDetail = (row: DataSource) => {
  ElMessage.info(`查看详情: ${row.name}`)
}

const analyzeData = (row: DataSource) => {
  ElMessage.info(`分析数据: ${row.name}`)
}

const exportData = (row: DataSource) => {
  ElMessage.info(`导出数据: ${row.name}`)
}

const applySuggestion = (suggestion: Suggestion) => {
  ElMessage.success(`应用建议: ${suggestion.title}`)
}

pagination.total = dataSourceList.value.length
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 28px;
  background: white;
  border-radius: 16px;
  border: 1px solid #EBEEF5;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.header-content h2 {
  margin: 0 0 8px 0;
  font-size: 26px;
  font-weight: 600;
  color: #303133;
}

.header-desc {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.header-actions {
  display: flex;
  align-items: center;
}

.score-section {
  margin-bottom: 16px;
}

.score-card {
  border-radius: 12px;
  background: white;
  border: 1px solid #EBEEF5;
  height: 100%;
}

.score-content {
  text-align: center;
  padding: 20px;
}

.score-label {
  font-size: 16px;
  margin-bottom: 16px;
  color: #909399;
}

.score-value {
  font-size: 64px;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 16px;
  color: #303133;
}

.score-rating {
  margin-bottom: 12px;
}

.score-desc {
  font-size: 14px;
  color: #67C23A;
  font-weight: 500;
}

.dimension-card {
  border-radius: 12px;
  height: 100%;
}

.dimension-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 10px;
}

.dimension-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background: #f5f7fa;
  transition: all 0.3s;
}

.dimension-item:hover {
  background: #e4e7ed;
  transform: translateY(-2px);
}

.dimension-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 12px;
}

.dimension-item.completeness .dimension-icon {
  background: #67C23A;
  color: white;
}

.dimension-item.accuracy .dimension-icon {
  background: #409EFF;
  color: white;
}

.dimension-item.timeliness .dimension-icon {
  background: #E6A23C;
  color: white;
}

.dimension-item.consistency .dimension-icon {
  background: #909399;
  color: white;
}

.dimension-info {
  flex: 1;
}

.dimension-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.dimension-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.trend-section {
  margin-bottom: 16px;
}

.trend-card,
.issue-card {
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

.issue-list {
  padding: 10px 0;
}

.issue-item {
  margin-bottom: 16px;
}

.issue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.issue-type {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.datasource-card {
  margin-bottom: 16px;
  border-radius: 12px;
}

.score-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 14px;
}

.score-badge.excellent {
  background: #f0f9ff;
  color: #67C23A;
}

.score-badge.good {
  background: #ecf5ff;
  color: #409EFF;
}

.score-badge.fair {
  background: #fdf6ec;
  color: #E6A23C;
}

.score-badge.poor {
  background: #fef0f0;
  color: #F56C6C;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.suggestion-card {
  border-radius: 12px;
}

.suggestion-item {
  padding: 20px;
  border-radius: 8px;
  background: white;
  border: 2px solid #EBEEF5;
  transition: all 0.3s;
  height: 100%;
}

.suggestion-item:hover {
  border-color: #409EFF;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.suggestion-item.high {
  border-left: 4px solid #F56C6C;
}

.suggestion-item.medium {
  border-left: 4px solid #E6A23C;
}

.suggestion-item.low {
  border-left: 4px solid #909399;
}

.suggestion-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.suggestion-icon {
  font-size: 20px;
  margin-right: 8px;
  color: #409EFF;
}

.suggestion-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.suggestion-content {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 16px;
}

.suggestion-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

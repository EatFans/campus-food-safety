<template>
  <div class="process-report-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2>过程管理报表</h2>
      <el-space>
        <el-select v-model="selectedProcess" placeholder="选择流程" style="width: 180px">
          <el-option label="采购流程" value="purchase" />
          <el-option label="验收流程" value="inspection" />
          <el-option label="加工流程" value="processing" />
          <el-option label="配送流程" value="delivery" />
        </el-select>
        <el-button type="primary" :icon="Refresh" @click="refreshData">刷新</el-button>
        <el-button type="success" :icon="Download" @click="exportData">导出</el-button>
      </el-space>
    </div>

    <!-- 流程概览 -->
    <el-row :gutter="16" class="process-overview">
      <el-col :xs="24" :sm="6">
        <div class="process-stat-card total">
          <div class="card-icon">
            <el-icon><Document /></el-icon>
          </div>
          <div class="card-info">
            <div class="card-value">{{ processStats.total }}</div>
            <div class="card-label">总流程数</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="6">
        <div class="process-stat-card completed">
          <div class="card-icon">
            <el-icon><CircleCheckFilled /></el-icon>
          </div>
          <div class="card-info">
            <div class="card-value">{{ processStats.completed }}</div>
            <div class="card-label">已完成</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="6">
        <div class="process-stat-card processing">
          <div class="card-icon">
            <el-icon><Loading /></el-icon>
          </div>
          <div class="card-info">
            <div class="card-value">{{ processStats.processing }}</div>
            <div class="card-label">进行中</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="6">
        <div class="process-stat-card delayed">
          <div class="card-icon">
            <el-icon><WarningFilled /></el-icon>
          </div>
          <div class="card-info">
            <div class="card-value">{{ processStats.delayed }}</div>
            <div class="card-label">延期</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 流程效率分析 -->
    <el-row :gutter="16" class="efficiency-section">
      <el-col :xs="24" :md="12">
        <el-card shadow="hover" class="efficiency-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">流程效率趋势</span>
              <el-tag type="success" size="small">平均完成时间: 2.5天</el-tag>
            </div>
          </template>
          <div class="chart-container" style="height: 280px;">
            <el-empty description="折线图待集成" />
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card shadow="hover" class="efficiency-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">各环节耗时占比</span>
              <el-tag type="info" size="small">总计: 100%</el-tag>
            </div>
          </template>
          <div class="chart-container" style="height: 280px;">
            <el-empty description="环形图待集成" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 流程列表 -->
    <el-card shadow="hover" class="process-list-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">流程记录</span>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索流程编号或名称"
            :prefix-icon="Search"
            style="width: 250px;"
            clearable
          />
        </div>
      </template>

      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="全部流程" name="all">
          <div class="process-timeline">
            <el-timeline>
              <el-timeline-item
                v-for="item in filteredProcessList"
                :key="item.id"
                :timestamp="item.createTime"
                placement="top"
                :type="getTimelineType(item.status)"
                :icon="getTimelineIcon(item.status)"
              >
                <el-card shadow="hover" class="timeline-card">
                  <div class="timeline-header">
                    <div class="timeline-title">
                      <span class="process-no">{{ item.processNo }}</span>
                      <el-tag :type="getStatusTagType(item.status)" size="small">
                        {{ getStatusText(item.status) }}
                      </el-tag>
                    </div>
                    <div class="timeline-actions">
                      <el-button link type="primary" size="small" @click="viewProcess(item)">
                        查看详情
                      </el-button>
                    </div>
                  </div>
                  <div class="timeline-content">
                    <div class="content-row">
                      <span class="label">流程名称：</span>
                      <span class="value">{{ item.processName }}</span>
                    </div>
                    <div class="content-row">
                      <span class="label">当前环节：</span>
                      <span class="value highlight">{{ item.currentStep }}</span>
                    </div>
                    <div class="content-row">
                      <span class="label">负责人：</span>
                      <span class="value">{{ item.handler }}</span>
                    </div>
                    <div class="content-row">
                      <span class="label">进度：</span>
                      <el-progress
                        :percentage="item.progress"
                        :color="getProgressColor(item.progress)"
                        :stroke-width="8"
                        style="width: 200px;"
                      />
                    </div>
                  </div>
                  <div class="timeline-steps">
                    <el-steps :active="item.activeStep" finish-status="success" simple>
                      <el-step
                        v-for="step in item.steps"
                        :key="step.name"
                        :title="step.name"
                        :description="step.time"
                      />
                    </el-steps>
                  </div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-tab-pane>

        <el-tab-pane label="进行中" name="processing">
          <el-empty description="暂无进行中的流程" />
        </el-tab-pane>

        <el-tab-pane label="已完成" name="completed">
          <el-empty description="暂无已完成的流程" />
        </el-tab-pane>

        <el-tab-pane label="异常" name="abnormal">
          <el-empty description="暂无异常流程" />
        </el-tab-pane>
      </el-tabs>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[5, 10, 20, 50]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 流程详情对话框 -->
    <el-dialog v-model="showDetailDialog" title="流程详情" width="900px">
      <el-descriptions v-if="currentProcess" :column="2" border>
        <el-descriptions-item label="流程编号">{{ currentProcess.processNo }}</el-descriptions-item>
        <el-descriptions-item label="流程名称">{{ currentProcess.processName }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentProcess.createTime }}</el-descriptions-item>
        <el-descriptions-item label="预计完成时间">{{ currentProcess.expectedTime }}</el-descriptions-item>
        <el-descriptions-item label="当前环节">{{ currentProcess.currentStep }}</el-descriptions-item>
        <el-descriptions-item label="负责人">{{ currentProcess.handler }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusTagType(currentProcess.status)">
            {{ getStatusText(currentProcess.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="进度">
          <el-progress :percentage="currentProcess.progress" />
        </el-descriptions-item>
        <el-descriptions-item label="流程说明" :span="2">
          {{ currentProcess.description }}
        </el-descriptions-item>
      </el-descriptions>

      <div class="detail-steps" style="margin-top: 20px;">
        <h4>流程步骤</h4>
        <el-steps :active="currentProcess?.activeStep" direction="vertical">
          <el-step
            v-for="(step, index) in currentProcess?.steps"
            :key="index"
            :title="step.name"
            :description="step.time"
          >
            <template #icon>
              <el-icon v-if="index < (currentProcess?.activeStep || 0)">
                <CircleCheckFilled />
              </el-icon>
              <el-icon v-else-if="index === (currentProcess?.activeStep || 0)">
                <Loading />
              </el-icon>
              <el-icon v-else>
                <Clock />
              </el-icon>
            </template>
          </el-step>
        </el-steps>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Refresh, Download, Search, Document, CircleCheckFilled,
  Loading, WarningFilled, Clock
} from '@element-plus/icons-vue'

interface ProcessStep {
  name: string
  time: string
}

interface ProcessItem {
  id: string
  processNo: string
  processName: string
  currentStep: string
  handler: string
  status: 'completed' | 'processing' | 'delayed' | 'pending'
  progress: number
  createTime: string
  expectedTime: string
  activeStep: number
  steps: ProcessStep[]
  description: string
}

const selectedProcess = ref('purchase')
const searchKeyword = ref('')
const activeTab = ref('all')
const showDetailDialog = ref(false)
const currentProcess = ref<ProcessItem | null>(null)

const processStats = reactive({
  total: 156,
  completed: 128,
  processing: 18,
  delayed: 10
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 5,
  total: 0
})

const processList = ref<ProcessItem[]>([
  {
    id: '1',
    processNo: 'PR20251204001',
    processName: '蔬菜采购流程',
    currentStep: '供应商确认',
    handler: '张三',
    status: 'processing',
    progress: 60,
    createTime: '2025-12-04 09:00',
    expectedTime: '2025-12-06 18:00',
    activeStep: 2,
    steps: [
      { name: '需求提交', time: '2025-12-04 09:00' },
      { name: '审批通过', time: '2025-12-04 10:30' },
      { name: '供应商确认', time: '进行中' },
      { name: '采购执行', time: '待开始' },
      { name: '验收入库', time: '待开始' }
    ],
    description: '本月蔬菜类食材采购流程，预计采购金额5万元'
  },
  {
    id: '2',
    processNo: 'PR20251203002',
    processName: '肉类验收流程',
    currentStep: '质检完成',
    handler: '李四',
    status: 'completed',
    progress: 100,
    createTime: '2025-12-03 08:00',
    expectedTime: '2025-12-03 12:00',
    activeStep: 4,
    steps: [
      { name: '到货登记', time: '2025-12-03 08:00' },
      { name: '外观检查', time: '2025-12-03 08:30' },
      { name: '质量检测', time: '2025-12-03 09:00' },
      { name: '验收确认', time: '2025-12-03 10:00' },
      { name: '入库完成', time: '2025-12-03 11:00' }
    ],
    description: '猪肉验收流程，共计200kg，质检合格'
  },
  {
    id: '3',
    processNo: 'PR20251202003',
    processName: '食材加工流程',
    currentStep: '加工中',
    handler: '王五',
    status: 'delayed',
    progress: 45,
    createTime: '2025-12-02 06:00',
    expectedTime: '2025-12-02 10:00',
    activeStep: 1,
    steps: [
      { name: '原料准备', time: '2025-12-02 06:00' },
      { name: '清洗加工', time: '进行中(延期)' },
      { name: '质量检查', time: '待开始' },
      { name: '包装存储', time: '待开始' }
    ],
    description: '早餐食材加工流程，因设备故障导致延期'
  }
])

const filteredProcessList = computed(() => {
  if (!searchKeyword.value) return processList.value
  return processList.value.filter(item =>
    item.processNo.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    item.processName.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

const getTimelineType = (status: string) => {
  const types: Record<string, any> = {
    completed: 'success',
    processing: 'primary',
    delayed: 'danger',
    pending: 'info'
  }
  return types[status] || 'info'
}

const getTimelineIcon = (status: string) => {
  const icons: Record<string, any> = {
    completed: CircleCheckFilled,
    processing: Loading,
    delayed: WarningFilled,
    pending: Clock
  }
  return icons[status] || Clock
}

const getStatusTagType = (status: string) => {
  const types: Record<string, any> = {
    completed: 'success',
    processing: 'primary',
    delayed: 'danger',
    pending: 'warning'
  }
  return types[status] || 'info'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    completed: '已完成',
    processing: '进行中',
    delayed: '延期',
    pending: '待开始'
  }
  return texts[status] || '未知'
}

const getProgressColor = (percentage: number) => {
  if (percentage < 30) return '#F56C6C'
  if (percentage < 70) return '#E6A23C'
  return '#67C23A'
}

const refreshData = () => {
  ElMessage.success('数据已刷新')
}

const exportData = () => {
  ElMessage.success('导出功能开发中...')
}

const handleTabChange = () => {
  ElMessage.info(`切换到 ${activeTab.value} 标签`)
}

const viewProcess = (item: ProcessItem) => {
  currentProcess.value = item
  showDetailDialog.value = true
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
}

pagination.total = processList.value.length
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 24px;
  background: white;
  border-radius: 16px;
  border: 1px solid #EBEEF5;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.process-overview {
  margin-bottom: 16px;
}

.process-stat-card {
  display: flex;
  align-items: center;
  padding: 24px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.process-stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  margin-right: 16px;
}

.process-stat-card.total .card-icon {
  background: #409EFF;
  color: white;
}

.process-stat-card.completed .card-icon {
  background: #67C23A;
  color: white;
}

.process-stat-card.processing .card-icon {
  background: #E6A23C;
  color: white;
}

.process-stat-card.delayed .card-icon {
  background: #F56C6C;
  color: white;
}

.card-value {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
  margin-bottom: 8px;
}

.card-label {
  font-size: 14px;
  color: #909399;
}

.efficiency-section {
  margin-bottom: 16px;
}

.efficiency-card {
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

.process-list-card {
  border-radius: 12px;
}

.process-timeline {
  padding: 20px 0;
}

.timeline-card {
  margin-bottom: 16px;
  border-radius: 8px;
  transition: all 0.3s;
}

.timeline-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.timeline-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.process-no {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.timeline-content {
  margin-bottom: 16px;
}

.content-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.label {
  font-size: 14px;
  color: #909399;
  width: 100px;
}

.value {
  font-size: 14px;
  color: #606266;
}

.value.highlight {
  color: #409EFF;
  font-weight: 600;
}

.timeline-steps {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #EBEEF5;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.detail-steps {
  margin-top: 20px;
}

.detail-steps h4 {
  margin-bottom: 16px;
  color: #303133;
}
</style>

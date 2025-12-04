<template>
  <div class="operation-report-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div>
        <h2>运维管理报表</h2>
        <p class="subtitle">系统运维状态监控与设备管理报表</p>
      </div>
      <el-space>
        <el-button type="primary" :icon="Refresh" @click="refreshData" circle />
        <el-button type="success" :icon="Download" @click="exportReport" circle />
        <el-button type="info" :icon="Setting" @click="showSettings = true" circle />
      </el-space>
    </div>

    <!-- 系统状态监控 -->
    <el-row :gutter="16" class="system-status">
      <el-col :xs="24" :sm="12" :md="6">
        <div class="status-card online">
          <div class="status-header">
            <el-icon class="status-icon"><Monitor /></el-icon>
            <span class="status-label">系统在线率</span>
          </div>
          <div class="status-value">99.8%</div>
          <div class="status-footer">
            <el-progress :percentage="99.8" :show-text="false" :stroke-width="4" color="#67C23A" />
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="status-card equipment">
          <div class="status-header">
            <el-icon class="status-icon"><Tools /></el-icon>
            <span class="status-label">设备正常率</span>
          </div>
          <div class="status-value">95.2%</div>
          <div class="status-footer">
            <el-progress :percentage="95.2" :show-text="false" :stroke-width="4" color="#409EFF" />
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="status-card response">
          <div class="status-header">
            <el-icon class="status-icon"><Timer /></el-icon>
            <span class="status-label">平均响应时间</span>
          </div>
          <div class="status-value">1.2s</div>
          <div class="status-footer">
            <span class="status-desc">优秀</span>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="status-card alert">
          <div class="status-header">
            <el-icon class="status-icon"><BellFilled /></el-icon>
            <span class="status-label">今日告警</span>
          </div>
          <div class="status-value">3</div>
          <div class="status-footer">
            <span class="status-desc">较昨日 -2</span>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 设备监控 -->
    <el-row :gutter="16" class="equipment-section">
      <el-col :xs="24" :md="16">
        <el-card shadow="hover" class="equipment-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">设备运行状态</span>
              <el-space>
                <el-tag type="success" size="small">正常: 28</el-tag>
                <el-tag type="warning" size="small">维护: 3</el-tag>
                <el-tag type="danger" size="small">故障: 1</el-tag>
              </el-space>
            </div>
          </template>
          <div class="equipment-grid">
            <div
              v-for="equipment in equipmentList"
              :key="equipment.id"
              class="equipment-item"
              :class="equipment.status"
            >
              <div class="equipment-icon">
                <el-icon><component :is="getEquipmentIcon(equipment.type)" /></el-icon>
              </div>
              <div class="equipment-info">
                <div class="equipment-name">{{ equipment.name }}</div>
                <div class="equipment-location">{{ equipment.location }}</div>
              </div>
              <div class="equipment-status">
                <el-tag :type="getEquipmentStatusType(equipment.status)" size="small">
                  {{ getEquipmentStatusText(equipment.status) }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="8">
        <el-card shadow="hover" class="maintenance-card">
          <template #header>
            <span class="card-title">维护计划</span>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="plan in maintenancePlans"
              :key="plan.id"
              :timestamp="plan.date"
              placement="top"
              :type="plan.type"
            >
              <div class="plan-item">
                <div class="plan-title">{{ plan.title }}</div>
                <div class="plan-desc">{{ plan.description }}</div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>

    <!-- 运维统计 -->
    <el-row :gutter="16" class="stats-section">
      <el-col :xs="24" :md="12">
        <el-card shadow="hover">
          <template #header>
            <span class="card-title">故障处理统计</span>
          </template>
          <div class="chart-container" style="height: 250px;">
            <el-empty description="柱状图待集成" />
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card shadow="hover">
          <template #header>
            <span class="card-title">设备使用率</span>
          </template>
          <div class="chart-container" style="height: 250px;">
            <el-empty description="雷达图待集成" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 运维记录表格 -->
    <el-card shadow="hover" class="record-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">运维记录</span>
          <el-space>
            <el-select v-model="recordType" placeholder="记录类型" size="small" style="width: 120px">
              <el-option label="全部" value="all" />
              <el-option label="维护" value="maintenance" />
              <el-option label="故障" value="fault" />
              <el-option label="巡检" value="inspection" />
            </el-select>
            <el-input
              v-model="searchText"
              placeholder="搜索记录"
              :prefix-icon="Search"
              size="small"
              style="width: 200px"
              clearable
            />
          </el-space>
        </div>
      </template>

      <el-table :data="recordList" v-loading="loading" stripe>
        <el-table-column type="index" label="#" width="50" />
        <el-table-column label="记录时间" prop="time" width="180" />
        <el-table-column label="类型" prop="type" width="100">
          <template #default="{ row }">
            <el-tag :type="getRecordTypeTag(row.type)" size="small">
              {{ getRecordTypeText(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="设备名称" prop="equipmentName" width="150" />
        <el-table-column label="问题描述" prop="description" show-overflow-tooltip />
        <el-table-column label="处理人" prop="handler" width="100" />
        <el-table-column label="耗时" prop="duration" width="100" />
        <el-table-column label="状态" prop="status" width="100">
          <template #default="{ row }">
            <el-tag :type="getRecordStatusTag(row.status)" size="small">
              {{ getRecordStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="viewRecord(row)">详情</el-button>
            <el-button link type="info" size="small" @click="exportRecord(row)">导出</el-button>
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

    <!-- 设置对话框 -->
    <el-dialog v-model="showSettings" title="运维设置" width="600px">
      <el-form label-width="120px">
        <el-form-item label="告警阈值">
          <el-input-number v-model="settings.alertThreshold" :min="1" :max="100" />
        </el-form-item>
        <el-form-item label="巡检频率">
          <el-select v-model="settings.inspectionFrequency" style="width: 100%">
            <el-option label="每日" value="daily" />
            <el-option label="每周" value="weekly" />
            <el-option label="每月" value="monthly" />
          </el-select>
        </el-form-item>
        <el-form-item label="自动报警">
          <el-switch v-model="settings.autoAlert" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showSettings = false">取消</el-button>
        <el-button type="primary" @click="saveSettings">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, markRaw } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Refresh, Download, Setting, Search, Monitor, Tools, Timer,
  BellFilled, Cpu, Refrigerator, VideoCamera, Printer as PrinterIcon
} from '@element-plus/icons-vue'

interface Equipment {
  id: string
  name: string
  type: string
  location: string
  status: 'normal' | 'maintenance' | 'fault'
}

interface MaintenancePlan {
  id: string
  date: string
  title: string
  description: string
  type: 'primary' | 'success' | 'warning'
}

interface OperationRecord {
  id: string
  time: string
  type: 'maintenance' | 'fault' | 'inspection'
  equipmentName: string
  description: string
  handler: string
  duration: string
  status: 'completed' | 'processing' | 'pending'
}

const loading = ref(false)
const showSettings = ref(false)
const recordType = ref('all')
const searchText = ref('')

const settings = reactive({
  alertThreshold: 10,
  inspectionFrequency: 'daily',
  autoAlert: true
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const equipmentList = ref<Equipment[]>([
  { id: '1', name: '冷库A制冷机', type: 'refrigerator', location: '冷库A', status: 'normal' },
  { id: '2', name: '冷库B制冷机', type: 'refrigerator', location: '冷库B', status: 'normal' },
  { id: '3', name: '监控摄像头01', type: 'camera', location: '厨房A区', status: 'normal' },
  { id: '4', name: '监控摄像头02', type: 'camera', location: '厨房B区', status: 'maintenance' },
  { id: '5', name: '服务器主机', type: 'server', location: '机房', status: 'normal' },
  { id: '6', name: '打印机01', type: 'printer', location: '办公室', status: 'fault' }
])

const maintenancePlans = ref<MaintenancePlan[]>([
  {
    id: '1',
    date: '2025-12-05',
    title: '冷库制冷系统维护',
    description: '定期检查制冷系统运行状态',
    type: 'primary'
  },
  {
    id: '2',
    date: '2025-12-07',
    title: '监控设备巡检',
    description: '检查所有监控摄像头工作状态',
    type: 'success'
  },
  {
    id: '3',
    date: '2025-12-10',
    title: '服务器系统更新',
    description: '系统安全补丁更新',
    type: 'warning'
  }
])

const recordList = ref<OperationRecord[]>([
  {
    id: '1',
    time: '2025-12-04 10:30',
    type: 'fault',
    equipmentName: '打印机01',
    description: '打印机卡纸，无法正常打印',
    handler: '张三',
    duration: '30分钟',
    status: 'completed'
  },
  {
    id: '2',
    time: '2025-12-04 09:00',
    type: 'inspection',
    equipmentName: '冷库A制冷机',
    description: '定期巡检，运行正常',
    handler: '李四',
    duration: '15分钟',
    status: 'completed'
  },
  {
    id: '3',
    time: '2025-12-03 14:20',
    type: 'maintenance',
    equipmentName: '监控摄像头02',
    description: '镜头清洁和角度调整',
    handler: '王五',
    duration: '45分钟',
    status: 'processing'
  }
])

const getEquipmentIcon = (type: string) => {
  const icons: Record<string, any> = {
    refrigerator: markRaw(Refrigerator),
    camera: markRaw(VideoCamera),
    server: markRaw(Cpu),
    printer: markRaw(PrinterIcon)
  }
  return icons[type] || Cpu
}

const getEquipmentStatusType = (status: string) => {
  const types: Record<string, any> = {
    normal: 'success',
    maintenance: 'warning',
    fault: 'danger'
  }
  return types[status] || 'info'
}

const getEquipmentStatusText = (status: string) => {
  const texts: Record<string, string> = {
    normal: '正常',
    maintenance: '维护中',
    fault: '故障'
  }
  return texts[status] || '未知'
}

const getRecordTypeTag = (type: string) => {
  const tags: Record<string, any> = {
    maintenance: 'primary',
    fault: 'danger',
    inspection: 'success'
  }
  return tags[type] || 'info'
}

const getRecordTypeText = (type: string) => {
  const texts: Record<string, string> = {
    maintenance: '维护',
    fault: '故障',
    inspection: '巡检'
  }
  return texts[type] || '未知'
}

const getRecordStatusTag = (status: string) => {
  const tags: Record<string, any> = {
    completed: 'success',
    processing: 'warning',
    pending: 'info'
  }
  return tags[status] || 'info'
}

const getRecordStatusText = (status: string) => {
  const texts: Record<string, string> = {
    completed: '已完成',
    processing: '处理中',
    pending: '待处理'
  }
  return texts[status] || '未知'
}

const refreshData = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据已刷新')
  }, 1000)
}

const exportReport = () => {
  ElMessage.success('导出功能开发中...')
}

const saveSettings = () => {
  ElMessage.success('设置已保存')
  showSettings.value = false
}

const viewRecord = (row: OperationRecord) => {
  ElMessage.info(`查看记录: ${row.id}`)
}

const exportRecord = (row: OperationRecord) => {
  ElMessage.info(`导出记录: ${row.id}`)
}

pagination.total = recordList.value.length
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

.page-header h2 {
  margin: 0 0 8px 0;
  font-size: 26px;
  font-weight: 600;
  color: #303133;
}

.subtitle {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.system-status {
  margin-bottom: 16px;
}

.status-card {
  padding: 24px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.status-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.status-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.status-icon {
  font-size: 24px;
  margin-right: 8px;
}

.status-card.online .status-icon {
  color: #67C23A;
}

.status-card.equipment .status-icon {
  color: #409EFF;
}

.status-card.response .status-icon {
  color: #E6A23C;
}

.status-card.alert .status-icon {
  color: #F56C6C;
}

.status-label {
  font-size: 14px;
  color: #909399;
}

.status-value {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 12px;
}

.status-footer {
  margin-top: 8px;
}

.status-desc {
  font-size: 12px;
  color: #909399;
}

.equipment-section {
  margin-bottom: 16px;
}

.equipment-card,
.maintenance-card {
  border-radius: 12px;
  height: 100%;
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

.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.equipment-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background: #f5f7fa;
  transition: all 0.3s;
}

.equipment-item:hover {
  background: #e4e7ed;
  transform: translateX(4px);
}

.equipment-item.normal {
  border-left: 4px solid #67C23A;
}

.equipment-item.maintenance {
  border-left: 4px solid #E6A23C;
}

.equipment-item.fault {
  border-left: 4px solid #F56C6C;
}

.equipment-icon {
  font-size: 24px;
  margin-right: 12px;
  color: #606266;
}

.equipment-info {
  flex: 1;
}

.equipment-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.equipment-location {
  font-size: 12px;
  color: #909399;
}

.plan-item {
  padding: 8px 0;
}

.plan-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.plan-desc {
  font-size: 12px;
  color: #909399;
}

.stats-section {
  margin-bottom: 16px;
}

.chart-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.record-card {
  border-radius: 12px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>

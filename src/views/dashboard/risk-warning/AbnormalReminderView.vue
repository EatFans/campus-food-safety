<template>
  <div class="abnormal-reminder-view">
    <div class="page-header">
      <h2>异常提醒</h2>
      <el-space>
        <el-button type="primary" :icon="Refresh" @click="refreshData">刷新数据</el-button>
        <el-button :icon="Download" @click="exportData">导出报告</el-button>
        <el-button :icon="Bell" @click="showRuleSettings = true">规则设置</el-button>
      </el-space>
    </div>

    <!-- 异常统计概览 -->
    <el-row :gutter="16" class="stats-overview">
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card high-risk">
          <div class="stat-content">
            <el-icon class="stat-icon" color="#F56C6C"><WarningFilled /></el-icon>
            <div class="stat-info">
              <div class="stat-number">{{ highRiskCount }}</div>
              <div class="stat-label">高风险异常</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card medium-risk">
          <div class="stat-content">
            <el-icon class="stat-icon" color="#E6A23C"><Warning /></el-icon>
            <div class="stat-info">
              <div class="stat-number">{{ mediumRiskCount }}</div>
              <div class="stat-label">中风险异常</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card low-risk">
          <div class="stat-content">
            <el-icon class="stat-icon" color="#409EFF"><InfoFilled /></el-icon>
            <div class="stat-info">
              <div class="stat-number">{{ lowRiskCount }}</div>
              <div class="stat-label">低风险异常</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card resolved">
          <div class="stat-content">
            <el-icon class="stat-icon" color="#67C23A"><SuccessFilled /></el-icon>
            <div class="stat-info">
              <div class="stat-number">{{ resolvedCount }}</div>
              <div class="stat-label">已解决</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 异常类型分布图表 -->
    <el-row :gutter="16" class="chart-section">
      <el-col :xs="24" :sm="12">
        <el-card shadow="hover" title="异常类型分布">
          <template #header>
            <span>异常类型分布</span>
          </template>
          <div class="chart-container">
            <el-empty description="图表组件待集成" />
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-card shadow="hover" title="异常趋势">
          <template #header>
            <span>异常趋势分析</span>
          </template>
          <div class="chart-container">
            <el-empty description="图表组件待集成" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 筛选条件 -->
    <el-card shadow="hover" class="filter-card">
      <el-form :model="filterForm" inline>
        <el-form-item label="异常类型">
          <el-select v-model="filterForm.abnormalType" placeholder="全部类型" clearable style="width: 140px">
            <el-option label="温度异常" value="temperature" />
            <el-option label="湿度异常" value="humidity" />
            <el-option label="设备故障" value="equipment" />
            <el-option label="操作违规" value="operation" />
            <el-option label="库存异常" value="inventory" />
            <el-option label="卫生问题" value="hygiene" />
          </el-select>
        </el-form-item>
        <el-form-item label="风险等级">
          <el-select v-model="filterForm.riskLevel" placeholder="全部等级" clearable style="width: 120px">
            <el-option label="高风险" value="high" />
            <el-option label="中风险" value="medium" />
            <el-option label="低风险" value="low" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select v-model="filterForm.status" placeholder="全部状态" clearable style="width: 120px">
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="processing" />
            <el-option label="已解决" value="resolved" />
            <el-option label="已忽略" value="ignored" />
          </el-select>
        </el-form-item>
        <el-form-item label="发生区域">
          <el-select v-model="filterForm.area" placeholder="全部区域" clearable style="width: 130px">
            <el-option label="厨房A区" value="kitchen_a" />
            <el-option label="厨房B区" value="kitchen_b" />
            <el-option label="仓库区域" value="warehouse" />
            <el-option label="餐厅区域" value="dining" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="filterForm.timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 320px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleFilter">查询</el-button>
          <el-button :icon="RefreshLeft" @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 异常提醒列表 -->
    <el-card shadow="hover" class="table-card">
      <el-table :data="abnormalList" v-loading="loading" style="width: 100%">
        <el-table-column type="expand">
          <template #default="{ row }">
            <div class="expand-detail">
              <el-descriptions :column="2" border>
                <el-descriptions-item label="异常描述" :span="2">{{ row.description }}</el-descriptions-item>
                <el-descriptions-item label="发现人员">{{ row.discoverer }}</el-descriptions-item>
                <el-descriptions-item label="联系方式">{{ row.contact }}</el-descriptions-item>
                <el-descriptions-item label="影响范围">{{ row.impactScope }}</el-descriptions-item>
                <el-descriptions-item label="紧急程度">{{ row.urgency }}</el-descriptions-item>
                <el-descriptions-item label="处理建议" :span="2">{{ row.suggestions }}</el-descriptions-item>
                <el-descriptions-item label="相关图片" :span="2">
                  <div v-if="row.images && row.images.length > 0" class="image-list">
                    <el-image 
                      v-for="(img, index) in row.images" 
                      :key="index"
                      :src="img" 
                      style="width: 80px; height: 80px; margin-right: 8px;"
                      fit="cover"
                      :preview-src-list="row.images"
                    />
                  </div>
                  <span v-else>暂无图片</span>
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="异常编号" prop="id" width="120" />
        <el-table-column label="异常类型" prop="abnormalType" width="120">
          <template #default="{ row }">
            <el-tag :type="getAbnormalTypeTagType(row.abnormalType)" size="small">
              {{ getAbnormalTypeText(row.abnormalType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="风险等级" prop="riskLevel" width="100">
          <template #default="{ row }">
            <el-tag :type="getRiskLevelTagType(row.riskLevel)" size="small">
              {{ getRiskLevelText(row.riskLevel) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发生位置" prop="location" width="120" />
        <el-table-column label="发生时间" prop="occurTime" width="180" />
        <el-table-column label="发现时间" prop="discoverTime" width="180" />
        <el-table-column label="处理状态" prop="status" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="负责人" prop="responsiblePerson" width="100" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="viewDetail(row)">详情</el-button>
            <el-button 
              v-if="row.status === 'pending'" 
              link type="warning" 
              size="small" 
              @click="handleAbnormal(row)"
            >
              处理
            </el-button>
            <el-button 
              v-if="row.status === 'processing'" 
              link type="success" 
              size="small" 
              @click="resolveAbnormal(row)"
            >
              解决
            </el-button>
            <el-button 
              v-if="['pending', 'processing'].includes(row.status)" 
              link type="info" 
              size="small" 
              @click="ignoreAbnormal(row)"
            >
              忽略
            </el-button>
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 规则设置对话框 -->
    <el-dialog v-model="showRuleSettings" title="异常提醒规则设置" width="700px">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="监控规则" name="monitor">
          <el-form :model="ruleForm.monitor" label-width="140px">
            <el-form-item label="温度监控">
              <el-row :gutter="16">
                <el-col :span="12">
                  <el-input-number v-model="ruleForm.monitor.tempMin" :min="-50" :max="50" />
                  <span style="margin-left: 8px;">°C 最低温度</span>
                </el-col>
                <el-col :span="12">
                  <el-input-number v-model="ruleForm.monitor.tempMax" :min="-50" :max="50" />
                  <span style="margin-left: 8px;">°C 最高温度</span>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="湿度监控">
              <el-row :gutter="16">
                <el-col :span="12">
                  <el-input-number v-model="ruleForm.monitor.humidityMin" :min="0" :max="100" />
                  <span style="margin-left: 8px;">% 最低湿度</span>
                </el-col>
                <el-col :span="12">
                  <el-input-number v-model="ruleForm.monitor.humidityMax" :min="0" :max="100" />
                  <span style="margin-left: 8px;">% 最高湿度</span>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="库存预警">
              <el-row :gutter="16">
                <el-col :span="12">
                  <el-input-number v-model="ruleForm.monitor.stockThreshold" :min="1" :max="1000" />
                  <span style="margin-left: 8px;">件 库存阈值</span>
                </el-col>
                <el-col :span="12">
                  <el-input-number v-model="ruleForm.monitor.expiryDays" :min="1" :max="30" />
                  <span style="margin-left: 8px;">天 临期天数</span>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="设备监控">
              <el-switch v-model="ruleForm.monitor.equipmentMonitor" />
              <span style="margin-left: 8px; color: #909399;">启用设备状态监控</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="通知规则" name="notification">
          <el-form :model="ruleForm.notification" label-width="140px">
            <el-form-item label="启用通知">
              <el-switch v-model="ruleForm.notification.enabled" />
            </el-form-item>
            <el-form-item label="通知方式">
              <el-checkbox-group v-model="ruleForm.notification.methods">
                <el-checkbox label="system">系统通知</el-checkbox>
                <el-checkbox label="email">邮件通知</el-checkbox>
                <el-checkbox label="sms">短信通知</el-checkbox>
                <el-checkbox label="wechat">微信通知</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="通知人员">
              <el-select v-model="ruleForm.notification.recipients" multiple placeholder="选择通知人员" style="width: 100%">
                <el-option label="食品安全主管" value="safety_manager" />
                <el-option label="仓库管理员" value="warehouse_manager" />
                <el-option label="厨房主管" value="kitchen_manager" />
                <el-option label="设备维护员" value="maintenance_staff" />
              </el-select>
            </el-form-item>
            <el-form-item label="通知频率">
              <el-radio-group v-model="ruleForm.notification.frequency">
                <el-radio label="immediate">立即通知</el-radio>
                <el-radio label="hourly">每小时汇总</el-radio>
                <el-radio label="daily">每日汇总</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <el-button @click="showRuleSettings = false">取消</el-button>
        <el-button type="primary" @click="saveRuleSettings">保存设置</el-button>
      </template>
    </el-dialog>

    <!-- 处理异常对话框 -->
    <el-dialog v-model="showHandleDialog" title="处理异常" width="600px">
      <el-form :model="handleForm" label-width="120px">
        <el-form-item label="处理方式">
          <el-radio-group v-model="handleForm.method">
            <el-radio label="immediate">立即处理</el-radio>
            <el-radio label="scheduled">计划处理</el-radio>
            <el-radio label="escalate">上报处理</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理措施">
          <el-input v-model="handleForm.measures" type="textarea" :rows="4" placeholder="请输入具体处理措施" />
        </el-form-item>
        <el-form-item label="处理人员">
          <el-select v-model="handleForm.handler" placeholder="选择处理人员" style="width: 100%">
            <el-option label="张三" value="zhangsan" />
            <el-option label="李四" value="lisi" />
            <el-option label="王五" value="wangwu" />
          </el-select>
        </el-form-item>
        <el-form-item label="预计完成时间">
          <el-date-picker v-model="handleForm.completeTime" type="datetime" placeholder="选择完成时间" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showHandleDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmHandle">确认处理</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Refresh, Download, Bell, Search, RefreshLeft,
  WarningFilled, Warning, InfoFilled, SuccessFilled
} from '@element-plus/icons-vue'

interface AbnormalItem {
  id: string
  abnormalType: string
  riskLevel: 'high' | 'medium' | 'low'
  location: string
  occurTime: string
  discoverTime: string
  status: 'pending' | 'processing' | 'resolved' | 'ignored'
  responsiblePerson: string
  description: string
  discoverer: string
  contact: string
  impactScope: string
  urgency: string
  suggestions: string
  images: string[]
}

const loading = ref(false)
const showRuleSettings = ref(false)
const showHandleDialog = ref(false)
const activeTab = ref('monitor')

const highRiskCount = ref(5)
const mediumRiskCount = ref(12)
const lowRiskCount = ref(18)
const resolvedCount = ref(45)

const filterForm = reactive({
  abnormalType: '',
  riskLevel: '',
  status: '',
  area: '',
  timeRange: null as any
})

const ruleForm = reactive({
  monitor: {
    tempMin: 2,
    tempMax: 8,
    humidityMin: 60,
    humidityMax: 80,
    stockThreshold: 50,
    expiryDays: 7,
    equipmentMonitor: true
  },
  notification: {
    enabled: true,
    methods: ['system', 'email'],
    recipients: ['safety_manager', 'warehouse_manager'],
    frequency: 'immediate'
  }
})

const handleForm = reactive({
  method: 'immediate',
  measures: '',
  handler: '',
  completeTime: null as any
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})

const abnormalList = ref<AbnormalItem[]>([
  {
    id: 'YC2025120401',
    abnormalType: 'temperature',
    riskLevel: 'high',
    location: '冷库A区',
    occurTime: '2025-12-04 06:30',
    discoverTime: '2025-12-04 06:45',
    status: 'pending',
    responsiblePerson: '张三',
    description: '冷库A区温度异常升高，达到12°C，超出正常温度范围(2-8°C)，可能影响冷藏食材质量',
    discoverer: '夜班巡检员',
    contact: '13800138000',
    impactScope: '冷库A区所有冷藏食材',
    urgency: '紧急',
    suggestions: '立即检查制冷设备，必要时转移食材至其他冷库',
    images: [
      'https://via.placeholder.com/200x200?text=温度监控截图',
      'https://via.placeholder.com/200x200?text=设备状态图'
    ]
  },
  {
    id: 'YC2025120402',
    abnormalType: 'equipment',
    riskLevel: 'medium',
    location: '厨房B区',
    occurTime: '2025-12-04 08:00',
    discoverTime: '2025-12-04 08:15',
    status: 'processing',
    responsiblePerson: '李四',
    description: '厨房B区消毒柜出现故障，显示屏显示E2错误代码，无法正常工作',
    discoverer: '厨师长',
    contact: '13900139000',
    impactScope: '厨房B区餐具消毒',
    urgency: '中等',
    suggestions: '联系设备维修人员检修，期间使用备用消毒设备',
    images: [
      'https://via.placeholder.com/200x200?text=设备故障图'
    ]
  },
  {
    id: 'YC2025120403',
    abnormalType: 'hygiene',
    riskLevel: 'low',
    location: '餐厅区域',
    occurTime: '2025-12-04 10:30',
    discoverTime: '2025-12-04 10:45',
    status: 'resolved',
    responsiblePerson: '王五',
    description: '餐厅地面有少量油污，可能存在滑倒风险',
    discoverer: '清洁工',
    contact: '13700137000',
    impactScope: '餐厅用餐区域',
    urgency: '一般',
    suggestions: '立即清理并设置警示标识',
    images: []
  }
])

const getAbnormalTypeTagType = (type: string) => {
  const types = {
    temperature: 'danger',
    humidity: 'warning',
    equipment: 'info',
    operation: 'danger',
    inventory: 'warning',
    hygiene: 'info'
  }
  return types[type as keyof typeof types] || 'info'
}

const getAbnormalTypeText = (type: string) => {
  const texts = {
    temperature: '温度异常',
    humidity: '湿度异常',
    equipment: '设备故障',
    operation: '操作违规',
    inventory: '库存异常',
    hygiene: '卫生问题'
  }
  return texts[type as keyof typeof texts] || '未知'
}

const getRiskLevelTagType = (level: string) => {
  const types = {
    high: 'danger',
    medium: 'warning',
    low: 'info'
  }
  return types[level as keyof typeof types] || 'info'
}

const getRiskLevelText = (level: string) => {
  const texts = {
    high: '高风险',
    medium: '中风险',
    low: '低风险'
  }
  return texts[level as keyof typeof texts] || '未知'
}

const getStatusTagType = (status: string) => {
  const types = {
    pending: 'danger',
    processing: 'warning',
    resolved: 'success',
    ignored: 'info'
  }
  return types[status as keyof typeof types] || 'info'
}

const getStatusText = (status: string) => {
  const texts = {
    pending: '待处理',
    processing: '处理中',
    resolved: '已解决',
    ignored: '已忽略'
  }
  return texts[status as keyof typeof texts] || '未知'
}

const refreshData = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据已刷新')
  }, 1000)
}

const exportData = () => {
  ElMessage.success('导出功能开发中...')
}

const handleFilter = () => {
  ElMessage.success('筛选条件已应用')
}

const resetFilter = () => {
  Object.assign(filterForm, {
    abnormalType: '',
    riskLevel: '',
    status: '',
    area: '',
    timeRange: null
  })
  ElMessage.success('筛选条件已重置')
}

const viewDetail = (row: AbnormalItem) => {
  ElMessage.info(`查看异常详情: ${row.id}`)
}

const handleAbnormal = (row: AbnormalItem) => {
  showHandleDialog.value = true
}

const resolveAbnormal = (row: AbnormalItem) => {
  ElMessageBox.confirm(
    `确认异常 ${row.id} 已解决吗？`,
    '解决确认',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'success'
    }
  ).then(() => {
    row.status = 'resolved'
    resolvedCount.value++
    ElMessage.success('异常已标记为解决')
  })
}

const ignoreAbnormal = (row: AbnormalItem) => {
  ElMessageBox.confirm(
    `确认忽略异常 ${row.id} 吗？忽略后将不再提醒该异常。`,
    '忽略确认',
    {
      confirmButtonText: '确认忽略',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    row.status = 'ignored'
    ElMessage.success('异常已忽略')
  })
}

const saveRuleSettings = () => {
  ElMessage.success('规则设置已保存')
  showRuleSettings.value = false
}

const confirmHandle = () => {
  ElMessage.success('处理申请已提交')
  showHandleDialog.value = false
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
}

onMounted(() => {
  pagination.total = abnormalList.value.length
})
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

.stats-overview {
  margin-bottom: 16px;
}

.stat-card {
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 10px;
}

.stat-icon {
  font-size: 32px;
  margin-right: 16px;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.stat-card.high-risk .stat-number {
  color: #F56C6C;
}

.stat-card.medium-risk .stat-number {
  color: #E6A23C;
}

.stat-card.low-risk .stat-number {
  color: #409EFF;
}

.stat-card.resolved .stat-number {
  color: #67C23A;
}

.chart-section {
  margin-bottom: 16px;
}

.chart-container {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-card {
  margin-bottom: 16px;
}

.table-card {
  margin-bottom: 16px;
}

.expand-detail {
  padding: 20px;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>

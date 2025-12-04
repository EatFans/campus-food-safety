<template>
  <div class="test-fail-warning-view">
    <div class="page-header">
      <h2>快检不合格预警</h2>
      <el-space>
        <el-button type="primary" :icon="Refresh" @click="refreshData">刷新数据</el-button>
        <el-button :icon="Download" @click="exportData">导出报告</el-button>
        <el-button :icon="Setting" @click="showSettings = true">预警设置</el-button>
      </el-space>
    </div>

    <!-- 预警统计卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card critical">
          <el-statistic title="严重预警" :value="criticalCount">
            <template #prefix>
              <el-icon color="#F56C6C"><WarningFilled /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card warning">
          <el-statistic title="一般预警" :value="warningCount">
            <template #prefix>
              <el-icon color="#E6A23C"><Warning /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card today">
          <el-statistic title="今日新增" :value="todayCount">
            <template #prefix>
              <el-icon color="#409EFF"><Clock /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card resolved">
          <el-statistic title="已处理" :value="resolvedCount">
            <template #prefix>
              <el-icon color="#67C23A"><SuccessFilled /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <!-- 筛选条件 -->
    <el-card shadow="hover" style="margin-top: 16px;">
      <el-form :model="searchForm" inline>
        <el-form-item label="预警级别">
          <el-select v-model="searchForm.level" placeholder="全部级别" clearable style="width: 120px">
            <el-option label="严重" value="critical" />
            <el-option label="一般" value="warning" />
          </el-select>
        </el-form-item>
        <el-form-item label="检测项目">
          <el-select v-model="searchForm.testType" placeholder="全部项目" clearable style="width: 150px">
            <el-option label="农药残留" value="pesticide" />
            <el-option label="重金属" value="heavy_metal" />
            <el-option label="微生物" value="microorganism" />
            <el-option label="添加剂" value="additive" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部状态" clearable style="width: 120px">
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="processing" />
            <el-option label="已处理" value="resolved" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="RefreshLeft" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 预警列表 -->
    <el-card shadow="hover" style="margin-top: 16px;">
      <el-table :data="warningList" v-loading="loading" style="width: 100%">
        <el-table-column type="expand">
          <template #default="{ row }">
            <div class="expand-content">
              <el-descriptions :column="2" border>
                <el-descriptions-item label="检测机构">{{ row.testingOrg }}</el-descriptions-item>
                <el-descriptions-item label="检测人员">{{ row.tester }}</el-descriptions-item>
                <el-descriptions-item label="检测方法">{{ row.method }}</el-descriptions-item>
                <el-descriptions-item label="标准值">{{ row.standardValue }}</el-descriptions-item>
                <el-descriptions-item label="检测值" :span="2">
                  <el-tag :type="row.testValue > row.standardValue ? 'danger' : 'success'">
                    {{ row.testValue }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="异常描述" :span="2">{{ row.description }}</el-descriptions-item>
                <el-descriptions-item label="处理措施" :span="2">{{ row.measures }}</el-descriptions-item>
              </el-descriptions>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="预警编号" prop="id" width="120" />
        <el-table-column label="食材名称" prop="foodName" width="150" />
        <el-table-column label="检测项目" prop="testType" width="120" />
        <el-table-column label="预警级别" width="100">
          <template #default="{ row }">
            <el-tag :type="row.level === 'critical' ? 'danger' : 'warning'">
              {{ row.level === 'critical' ? '严重' : '一般' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="检测时间" prop="testTime" width="180" />
        <el-table-column label="供应商" prop="supplier" width="150" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="viewDetail(row)">详情</el-button>
            <el-button 
              v-if="row.status === 'pending'" 
              link type="warning" 
              size="small" 
              @click="handleWarning(row)"
            >
              处理
            </el-button>
            <el-button 
              v-if="row.status === 'processing'" 
              link type="success" 
              size="small" 
              @click="resolveWarning(row)"
            >
              完成
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

    <!-- 预警设置对话框 -->
    <el-dialog v-model="showSettings" title="预警设置" width="600px">
      <el-form :model="settingsForm" label-width="120px">
        <el-form-item label="预警通知">
          <el-switch v-model="settingsForm.notification" />
        </el-form-item>
        <el-form-item label="邮件通知">
          <el-switch v-model="settingsForm.emailNotification" />
        </el-form-item>
        <el-form-item label="短信通知">
          <el-switch v-model="settingsForm.smsNotification" />
        </el-form-item>
        <el-form-item label="自动升级">
          <el-switch v-model="settingsForm.autoEscalate" />
        </el-form-item>
        <el-form-item label="处理时限(小时)">
          <el-input-number v-model="settingsForm.deadline" :min="1" :max="168" />
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Refresh, Download, Setting, Search, RefreshLeft,
  WarningFilled, Warning, Clock, SuccessFilled
} from '@element-plus/icons-vue'

interface WarningItem {
  id: string
  foodName: string
  testType: string
  level: 'critical' | 'warning'
  testTime: string
  supplier: string
  status: 'pending' | 'processing' | 'resolved'
  testingOrg: string
  tester: string
  method: string
  standardValue: string
  testValue: string
  description: string
  measures: string
}

const loading = ref(false)
const showSettings = ref(false)
const criticalCount = ref(8)
const warningCount = ref(15)
const todayCount = ref(3)
const resolvedCount = ref(42)

const searchForm = reactive({
  level: '',
  testType: '',
  status: '',
  dateRange: null as any
})

const settingsForm = reactive({
  notification: true,
  emailNotification: true,
  smsNotification: false,
  autoEscalate: true,
  deadline: 24
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})

const warningList = ref<WarningItem[]>([
  {
    id: 'YJ2025120401',
    foodName: '青菜',
    testType: '农药残留',
    level: 'critical',
    testTime: '2025-12-04 08:30',
    supplier: '绿色蔬菜供应商',
    status: 'pending',
    testingOrg: '食品安全检测中心',
    tester: '张三',
    method: '液相色谱法',
    standardValue: '≤0.2 mg/kg',
    testValue: '0.5 mg/kg',
    description: '检测出农药残留超标，超出标准值2.5倍',
    measures: '立即停止使用，联系供应商退换货'
  },
  {
    id: 'YJ2025120402',
    foodName: '猪肉',
    testType: '重金属',
    level: 'warning',
    testTime: '2025-12-04 09:15',
    supplier: '优质肉类供应商',
    status: 'processing',
    testingOrg: '食品安全检测中心',
    tester: '李四',
    method: '原子吸收光谱法',
    standardValue: '≤0.1 mg/kg',
    testValue: '0.15 mg/kg',
    description: '重金属含量略高，需要关注',
    measures: '加强检测，密切监控'
  },
  {
    id: 'YJ2025120403',
    foodName: '豆制品',
    testType: '添加剂',
    level: 'warning',
    testTime: '2025-12-04 10:00',
    supplier: '豆制品加工厂',
    status: 'resolved',
    testingOrg: '食品安全检测中心',
    tester: '王五',
    method: '高效液相色谱法',
    standardValue: '≤0.5 g/kg',
    testValue: '0.6 g/kg',
    description: '添加剂含量轻微超标',
    measures: '已更换供应商，问题解决'
  }
])

const getStatusType = (status: string) => {
  const types = {
    pending: 'danger',
    processing: 'warning',
    resolved: 'success'
  }
  return types[status as keyof typeof types] || 'info'
}

const getStatusText = (status: string) => {
  const texts = {
    pending: '待处理',
    processing: '处理中',
    resolved: '已处理'
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

const handleSearch = () => {
  ElMessage.success('查询功能执行中...')
}

const resetSearch = () => {
  Object.assign(searchForm, {
    level: '',
    testType: '',
    status: '',
    dateRange: null
  })
  ElMessage.success('筛选条件已重置')
}

const viewDetail = (row: WarningItem) => {
  ElMessage.info(`查看预警详情: ${row.id}`)
}

const handleWarning = (row: WarningItem) => {
  ElMessageBox.confirm(
    `确认处理预警 ${row.id} 吗？`,
    '处理预警',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    row.status = 'processing'
    ElMessage.success('预警已开始处理')
  })
}

const resolveWarning = (row: WarningItem) => {
  ElMessageBox.confirm(
    `确认预警 ${row.id} 已处理完成吗？`,
    '完成处理',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'success'
    }
  ).then(() => {
    row.status = 'resolved'
    resolvedCount.value++
    ElMessage.success('预警处理已完成')
  })
}

const saveSettings = () => {
  ElMessage.success('设置已保存')
  showSettings.value = false
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  // 重新加载数据
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  // 重新加载数据
}

onMounted(() => {
  pagination.total = warningList.value.length
})
</script>

<style scoped>
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
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.stats-row {
  margin-bottom: 16px;
}

.stat-card {
  text-align: center;
  transition: all 0.3s;
  border-radius: 12px;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stat-card.critical :deep(.el-statistic__head) {
  color: #F56C6C;
}

.stat-card.warning :deep(.el-statistic__head) {
  color: #E6A23C;
}

.stat-card.today :deep(.el-statistic__head) {
  color: #409EFF;
}

.stat-card.resolved :deep(.el-statistic__head) {
  color: #67C23A;
}

.expand-content {
  padding: 20px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>

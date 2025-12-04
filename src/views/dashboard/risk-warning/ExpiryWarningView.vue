<template>
  <div class="expiry-warning-view">
    <div class="page-header">
      <h2>过期预警</h2>
      <el-space>
        <el-button type="primary" :icon="Refresh" @click="refreshData">刷新数据</el-button>
        <el-button :icon="Download" @click="exportReport">导出报告</el-button>
        <el-button :icon="Bell" @click="showNotificationSettings = true">通知设置</el-button>
      </el-space>
    </div>

    <!-- 预警概览卡片 -->
    <el-row :gutter="16" class="overview-cards">
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="overview-card expired">
          <div class="card-content">
            <el-icon class="card-icon" color="#F56C6C"><CircleCloseFilled /></el-icon>
            <div class="card-info">
              <div class="card-number">{{ expiredCount }}</div>
              <div class="card-title">已过期</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="overview-card expiring-today">
          <div class="card-content">
            <el-icon class="card-icon" color="#E6A23C"><WarningFilled /></el-icon>
            <div class="card-info">
              <div class="card-number">{{ expiringTodayCount }}</div>
              <div class="card-title">今日过期</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="overview-card expiring-soon">
          <div class="card-content">
            <el-icon class="card-icon" color="#409EFF"><Clock /></el-icon>
            <div class="card-info">
              <div class="card-number">{{ expiringSoonCount }}</div>
              <div class="card-title">即将过期</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="overview-card normal">
          <div class="card-content">
            <el-icon class="card-icon" color="#67C23A"><SuccessFilled /></el-icon>
            <div class="card-info">
              <div class="card-number">{{ normalCount }}</div>
              <div class="card-title">正常库存</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 筛选和搜索 -->
    <el-card shadow="hover" class="filter-card">
      <el-form :model="filterForm" inline>
        <el-form-item label="预警状态">
          <el-select v-model="filterForm.warningType" placeholder="全部状态" clearable style="width: 130px">
            <el-option label="已过期" value="expired" />
            <el-option label="今日过期" value="expiring_today" />
            <el-option label="即将过期" value="expiring_soon" />
          </el-select>
        </el-form-item>
        <el-form-item label="食材类别">
          <el-select v-model="filterForm.category" placeholder="全部类别" clearable style="width: 140px">
            <el-option label="蔬菜类" value="vegetables" />
            <el-option label="肉类" value="meat" />
            <el-option label="水产类" value="seafood" />
            <el-option label="调料类" value="seasoning" />
            <el-option label="粮油类" value="grains" />
          </el-select>
        </el-form-item>
        <el-form-item label="存储位置">
          <el-select v-model="filterForm.storage" placeholder="全部位置" clearable style="width: 130px">
            <el-option label="冷库A" value="cold_storage_a" />
            <el-option label="冷库B" value="cold_storage_b" />
            <el-option label="常温库" value="normal_storage" />
            <el-option label="冷冻库" value="freezer" />
          </el-select>
        </el-form-item>
        <el-form-item label="过期时间">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleFilter">查询</el-button>
          <el-button :icon="RefreshLeft" @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 过期预警列表 -->
    <el-card shadow="hover" class="table-card">
      <el-table :data="expiryList" v-loading="loading" style="width: 100%">
        <el-table-column type="expand">
          <template #default="{ row }">
            <div class="expand-detail">
              <el-descriptions :column="3" border>
                <el-descriptions-item label="批次号">{{ row.batchNumber }}</el-descriptions-item>
                <el-descriptions-item label="供应商">{{ row.supplier }}</el-descriptions-item>
                <el-descriptions-item label="采购日期">{{ row.purchaseDate }}</el-descriptions-item>
                <el-descriptions-item label="入库时间">{{ row.storageTime }}</el-descriptions-item>
                <el-descriptions-item label="存储条件">{{ row.storageCondition }}</el-descriptions-item>
                <el-descriptions-item label="负责人">{{ row.responsiblePerson }}</el-descriptions-item>
                <el-descriptions-item label="备注" :span="3">{{ row.remarks }}</el-descriptions-item>
              </el-descriptions>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="预警编号" prop="id" width="120" />
        <el-table-column label="食材名称" prop="foodName" width="150" />
        <el-table-column label="类别" prop="category" width="100" />
        <el-table-column label="当前库存" prop="currentStock" width="100">
          <template #default="{ row }">
            <span :class="getStockClass(row.currentStock, row.warningLevel)">
              {{ row.currentStock }} {{ row.unit }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="生产日期" prop="productionDate" width="120" />
        <el-table-column label="过期日期" prop="expiryDate" width="120">
          <template #default="{ row }">
            <span :class="getExpiryDateClass(row.warningLevel)">
              {{ row.expiryDate }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="剩余天数" prop="remainingDays" width="100">
          <template #default="{ row }">
            <el-tag :type="getDaysTagType(row.remainingDays)" size="small">
              {{ row.remainingDays > 0 ? `${row.remainingDays}天` : '已过期' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="存储位置" prop="storageLocation" width="100" />
        <el-table-column label="预警级别" width="100">
          <template #default="{ row }">
            <el-tag :type="getWarningLevelType(row.warningLevel)" size="small">
              {{ getWarningLevelText(row.warningLevel) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="处理状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getProcessStatusType(row.processStatus)" size="small">
              {{ getProcessStatusText(row.processStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="viewDetail(row)">详情</el-button>
            <el-button 
              v-if="row.processStatus === 'pending'" 
              link type="warning" 
              size="small" 
              @click="handleExpiry(row)"
            >
              处理
            </el-button>
            <el-button 
              v-if="row.warningLevel !== 'expired'" 
              link type="info" 
              size="small" 
              @click="extendExpiry(row)"
            >
              延期
            </el-button>
            <el-button link type="danger" size="small" @click="disposeItem(row)">销毁</el-button>
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

    <!-- 通知设置对话框 -->
    <el-dialog v-model="showNotificationSettings" title="过期预警通知设置" width="500px">
      <el-form :model="notificationForm" label-width="120px">
        <el-form-item label="启用通知">
          <el-switch v-model="notificationForm.enabled" />
        </el-form-item>
        <el-form-item label="提前天数">
          <el-input-number v-model="notificationForm.advanceDays" :min="1" :max="30" />
          <span style="margin-left: 8px; color: #909399;">天发送预警通知</span>
        </el-form-item>
        <el-form-item label="通知方式">
          <el-checkbox-group v-model="notificationForm.methods">
            <el-checkbox label="system">系统通知</el-checkbox>
            <el-checkbox label="email">邮件通知</el-checkbox>
            <el-checkbox label="sms">短信通知</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="通知人员">
          <el-select v-model="notificationForm.recipients" multiple placeholder="选择通知人员" style="width: 100%">
            <el-option label="仓库管理员" value="warehouse_manager" />
            <el-option label="采购经理" value="purchase_manager" />
            <el-option label="食品安全员" value="safety_officer" />
            <el-option label="食堂主管" value="canteen_supervisor" />
          </el-select>
        </el-form-item>
        <el-form-item label="通知时间">
          <el-time-picker v-model="notificationForm.notifyTime" placeholder="选择时间" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showNotificationSettings = false">取消</el-button>
        <el-button type="primary" @click="saveNotificationSettings">保存设置</el-button>
      </template>
    </el-dialog>

    <!-- 处理过期物品对话框 -->
    <el-dialog v-model="showHandleDialog" title="处理过期物品" width="600px">
      <el-form :model="handleForm" label-width="120px">
        <el-form-item label="处理方式">
          <el-radio-group v-model="handleForm.method">
            <el-radio label="return">退回供应商</el-radio>
            <el-radio label="dispose">销毁处理</el-radio>
            <el-radio label="donate">捐赠处理</el-radio>
            <el-radio label="other">其他方式</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理说明">
          <el-input v-model="handleForm.description" type="textarea" :rows="4" placeholder="请输入处理说明" />
        </el-form-item>
        <el-form-item label="处理人员">
          <el-input v-model="handleForm.handler" placeholder="请输入处理人员姓名" />
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
  CircleCloseFilled, WarningFilled, Clock, SuccessFilled
} from '@element-plus/icons-vue'

interface ExpiryItem {
  id: string
  foodName: string
  category: string
  currentStock: number
  unit: string
  productionDate: string
  expiryDate: string
  remainingDays: number
  storageLocation: string
  warningLevel: 'expired' | 'expiring_today' | 'expiring_soon' | 'normal'
  processStatus: 'pending' | 'processing' | 'completed'
  batchNumber: string
  supplier: string
  purchaseDate: string
  storageTime: string
  storageCondition: string
  responsiblePerson: string
  remarks: string
}

const loading = ref(false)
const showNotificationSettings = ref(false)
const showHandleDialog = ref(false)

const expiredCount = ref(12)
const expiringTodayCount = ref(8)
const expiringSoonCount = ref(25)
const normalCount = ref(156)

const filterForm = reactive({
  warningType: '',
  category: '',
  storage: '',
  dateRange: null as any
})

const notificationForm = reactive({
  enabled: true,
  advanceDays: 3,
  methods: ['system', 'email'],
  recipients: ['warehouse_manager', 'safety_officer'],
  notifyTime: new Date(2025, 11, 4, 9, 0)
})

const handleForm = reactive({
  method: 'dispose',
  description: '',
  handler: '',
  completeTime: null as any
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})

const expiryList = ref<ExpiryItem[]>([
  {
    id: 'GQ2025120401',
    foodName: '西红柿',
    category: '蔬菜类',
    currentStock: 15,
    unit: 'kg',
    productionDate: '2025-11-20',
    expiryDate: '2025-12-04',
    remainingDays: 0,
    storageLocation: '冷库A',
    warningLevel: 'expiring_today',
    processStatus: 'pending',
    batchNumber: 'P20251120001',
    supplier: '绿色蔬菜供应商',
    purchaseDate: '2025-11-21',
    storageTime: '2025-11-21 08:30',
    storageCondition: '温度: 2-4°C, 湿度: 85-90%',
    responsiblePerson: '张三',
    remarks: '今日到期，建议尽快使用或处理'
  },
  {
    id: 'GQ2025120402',
    foodName: '猪肉',
    category: '肉类',
    currentStock: 8,
    unit: 'kg',
    productionDate: '2025-11-15',
    expiryDate: '2025-12-02',
    remainingDays: -2,
    storageLocation: '冷冻库',
    warningLevel: 'expired',
    processStatus: 'processing',
    batchNumber: 'P20251115001',
    supplier: '优质肉类供应商',
    purchaseDate: '2025-11-16',
    storageTime: '2025-11-16 09:00',
    storageCondition: '温度: -18°C以下',
    responsiblePerson: '李四',
    remarks: '已过期2天，正在处理中'
  },
  {
    id: 'GQ2025120403',
    foodName: '牛奶',
    category: '乳制品',
    currentStock: 20,
    unit: '盒',
    productionDate: '2025-11-25',
    expiryDate: '2025-12-08',
    remainingDays: 4,
    storageLocation: '冷库B',
    warningLevel: 'expiring_soon',
    processStatus: 'pending',
    batchNumber: 'P20251125001',
    supplier: '新鲜乳制品厂',
    purchaseDate: '2025-11-26',
    storageTime: '2025-11-26 10:00',
    storageCondition: '温度: 2-6°C',
    responsiblePerson: '王五',
    remarks: '4天后过期，建议优先使用'
  }
])

const getStockClass = (stock: number, level: string) => {
  if (level === 'expired') return 'text-danger'
  if (level === 'expiring_today') return 'text-warning'
  if (level === 'expiring_soon') return 'text-info'
  return 'text-success'
}

const getExpiryDateClass = (level: string) => {
  const classes = {
    expired: 'text-danger font-bold',
    expiring_today: 'text-warning font-bold',
    expiring_soon: 'text-info',
    normal: 'text-success'
  }
  return classes[level as keyof typeof classes] || ''
}

const getDaysTagType = (days: number) => {
  if (days <= 0) return 'danger'
  if (days <= 1) return 'warning'
  if (days <= 7) return 'info'
  return 'success'
}

const getWarningLevelType = (level: string) => {
  const types = {
    expired: 'danger',
    expiring_today: 'warning',
    expiring_soon: 'info',
    normal: 'success'
  }
  return types[level as keyof typeof types] || 'info'
}

const getWarningLevelText = (level: string) => {
  const texts = {
    expired: '已过期',
    expiring_today: '今日过期',
    expiring_soon: '即将过期',
    normal: '正常'
  }
  return texts[level as keyof typeof texts] || '未知'
}

const getProcessStatusType = (status: string) => {
  const types = {
    pending: 'warning',
    processing: 'info',
    completed: 'success'
  }
  return types[status as keyof typeof types] || 'info'
}

const getProcessStatusText = (status: string) => {
  const texts = {
    pending: '待处理',
    processing: '处理中',
    completed: '已完成'
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

const exportReport = () => {
  ElMessage.success('导出功能开发中...')
}

const handleFilter = () => {
  ElMessage.success('筛选条件已应用')
}

const resetFilter = () => {
  Object.assign(filterForm, {
    warningType: '',
    category: '',
    storage: '',
    dateRange: null
  })
  ElMessage.success('筛选条件已重置')
}

const viewDetail = (row: ExpiryItem) => {
  ElMessage.info(`查看详情: ${row.id}`)
}

const handleExpiry = (row: ExpiryItem) => {
  showHandleDialog.value = true
}

const extendExpiry = (row: ExpiryItem) => {
  ElMessageBox.prompt('请输入延期的天数', '延期处理', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPattern: /^[1-9]\d*$/,
    inputErrorMessage: '请输入正整数'
  }).then(({ value }) => {
    ElMessage.success(`已延期 ${value} 天`)
  })
}

const disposeItem = (row: ExpiryItem) => {
  ElMessageBox.confirm(
    `确认销毁 ${row.foodName} 吗？此操作不可撤销。`,
    '销毁确认',
    {
      confirmButtonText: '确认销毁',
      cancelButtonText: '取消',
      type: 'error'
    }
  ).then(() => {
    ElMessage.success('销毁申请已提交')
  })
}

const saveNotificationSettings = () => {
  ElMessage.success('通知设置已保存')
  showNotificationSettings.value = false
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
  pagination.total = expiryList.value.length
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

.overview-cards {
  margin-bottom: 16px;
}

.overview-card {
  transition: all 0.3s;
  border-radius: 12px;
}

.overview-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-content {
  display: flex;
  align-items: center;
  padding: 10px;
}

.card-icon {
  font-size: 32px;
  margin-right: 16px;
}

.card-info {
  flex: 1;
}

.card-number {
  font-size: 28px;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 4px;
}

.card-title {
  font-size: 14px;
  color: #909399;
}

.overview-card.expired .card-number {
  color: #F56C6C;
}

.overview-card.expiring-today .card-number {
  color: #E6A23C;
}

.overview-card.expiring-soon .card-number {
  color: #409EFF;
}

.overview-card.normal .card-number {
  color: #67C23A;
}

.filter-card {
  margin-bottom: 16px;
  border-radius: 12px;
}

.table-card {
  margin-bottom: 16px;
  border-radius: 12px;
}

.expand-detail {
  padding: 20px;
}

.text-danger {
  color: #F56C6C;
}

.text-warning {
  color: #E6A23C;
}

.text-info {
  color: #409EFF;
}

.text-success {
  color: #67C23A;
}

.font-bold {
  font-weight: bold;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>

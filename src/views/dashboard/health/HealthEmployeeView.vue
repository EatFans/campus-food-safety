<template>
  <div class="health-employee-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2>员工健康</h2>
        <span class="subtitle">共 {{ pagination.total }} 名员工</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large" @click="handleAdd">添加健康记录</el-button>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card success">
          <div class="stat-content">
            <div class="stat-icon success-icon">
              <el-icon :size="32"><CircleCheck /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ validCount }}</div>
              <div class="stat-label">健康证有效</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card warning">
          <div class="stat-content">
            <div class="stat-icon warning-icon">
              <el-icon :size="32"><Warning /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ expiringCount }}</div>
              <div class="stat-label">即将到期</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card danger">
          <div class="stat-content">
            <div class="stat-icon danger-icon">
              <el-icon :size="32"><Close /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ expiredCount }}</div>
              <div class="stat-label">已过期</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-card shadow="hover" class="stat-card info">
          <div class="stat-content">
            <div class="stat-icon info-icon">
              <el-icon :size="32"><Calendar /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ monthCheckCount }}</div>
              <div class="stat-label">本月体检</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 搜索筛选区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="员工姓名">
              <el-input 
                v-model="searchForm.name" 
                placeholder="请输入员工姓名" 
                clearable
                size="large"
                :prefix-icon="Search"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="所属部门">
              <el-select v-model="searchForm.department" placeholder="请选择部门" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="厨房部" value="厨房部" />
                <el-option label="服务部" value="服务部" />
                <el-option label="采购部" value="采购部" />
                <el-option label="管理部" value="管理部" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="健康状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="有效" value="有效" />
                <el-option label="即将到期" value="即将到期" />
                <el-option label="已过期" value="已过期" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="到期时间">
              <el-date-picker
                v-model="searchForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="large"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="search-actions">
            <el-button type="primary" size="large" :icon="Search" @click="handleSearch">搜索</el-button>
            <el-button size="large" :icon="Refresh" @click="handleReset">重置</el-button>
            <el-button size="large" :icon="Download">导出</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 数据表格区域 -->
    <el-card shadow="never" class="table-card">
      <!-- 表格工具栏 -->
      <div class="table-toolbar">
        <div class="toolbar-left">
          <el-button type="warning" :icon="Bell" :disabled="selectedIds.length === 0">
            批量提醒
          </el-button>
          <el-button type="danger" :icon="Delete" :disabled="selectedIds.length === 0">
            批量删除
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-tooltip content="刷新" placement="top">
            <el-button circle :icon="Refresh" @click="handleRefresh" />
          </el-tooltip>
        </div>
      </div>

      <!-- 表格 -->
      <el-table 
        :data="healthRecords" 
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        stripe
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="员工姓名" prop="name" width="120" />
        <el-table-column label="所属部门" prop="department" width="120" align="center">
          <template #default="{ row }">
            <el-tag size="small">{{ row.department }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="健康证编号" prop="certificateNo" width="150" show-overflow-tooltip />
        <el-table-column label="联系电话" prop="phone" width="130" />
        <el-table-column label="发证日期" prop="issueDate" width="120" />
        <el-table-column label="有效期至" prop="expiryDate" width="120" align="center">
          <template #default="{ row }">
            <el-text :type="getExpiryType(row.expiryDate)">{{ row.expiryDate }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="剩余天数" width="100" align="center">
          <template #default="{ row }">
            <el-text :type="getDaysType(row.remainDays)">{{ row.remainDays }}天</el-text>
          </template>
        </el-table-column>
        <el-table-column label="健康状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)" effect="dark">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small" :icon="View">查看</el-button>
            <el-button link type="success" size="small" :icon="Edit">更新</el-button>
            <el-button link type="warning" size="small" :icon="Bell">提醒</el-button>
            <el-button link type="danger" size="small" :icon="Delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Plus, Download, Search, Refresh, Delete, Edit, View, Bell, CircleCheck, Warning, Close, Calendar } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const selectedIds = ref<number[]>([])

// 搜索表单
const searchForm = reactive({
  name: '',
  department: '',
  status: '',
  dateRange: []
})

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 35
})

// 健康记录数据
const healthRecords = ref([
  { id: 1, name: '张三', department: '厨房部', certificateNo: 'HC202511280001', phone: '13800138001', issueDate: '2025-05-28', expiryDate: '2026-05-27', remainDays: 180, status: '有效' },
  { id: 2, name: '李四', department: '服务部', certificateNo: 'HC202511280002', phone: '13800138002', issueDate: '2025-06-15', expiryDate: '2026-06-14', remainDays: 198, status: '有效' },
  { id: 3, name: '王五', department: '采购部', certificateNo: 'HC202511280003', phone: '13800138003', issueDate: '2024-12-10', expiryDate: '2025-12-09', remainDays: 11, status: '即将到期' },
  { id: 4, name: '赵六', department: '管理部', certificateNo: 'HC202511280004', phone: '13800138004', issueDate: '2024-08-01', expiryDate: '2025-07-31', remainDays: -120, status: '已过期' },
  { id: 5, name: '孙七', department: '厨房部', certificateNo: 'HC202511280005', phone: '13800138005', issueDate: '2025-07-20', expiryDate: '2026-07-19', remainDays: 233, status: '有效' },
  { id: 6, name: '周八', department: '服务部', certificateNo: 'HC202511280006', phone: '13800138006', issueDate: '2025-04-10', expiryDate: '2026-04-09', remainDays: 132, status: '有效' },
  { id: 7, name: '吴九', department: '厨房部', certificateNo: 'HC202511280007', phone: '13800138007', issueDate: '2024-11-25', expiryDate: '2025-11-24', remainDays: -4, status: '已过期' },
  { id: 8, name: '郑十', department: '采购部', certificateNo: 'HC202511280008', phone: '13800138008', issueDate: '2025-03-15', expiryDate: '2026-03-14', remainDays: 106, status: '有效' },
  { id: 9, name: '钱一', department: '管理部', certificateNo: 'HC202511280009', phone: '13800138009', issueDate: '2024-12-20', expiryDate: '2025-12-19', remainDays: 21, status: '即将到期' },
  { id: 10, name: '陈二', department: '服务部', certificateNo: 'HC202511280010', phone: '13800138010', issueDate: '2025-08-05', expiryDate: '2026-08-04', remainDays: 249, status: '有效' }
])

// 统计数据
const validCount = computed(() => healthRecords.value.filter(r => r.status === '有效').length)
const expiringCount = computed(() => healthRecords.value.filter(r => r.status === '即将到期').length)
const expiredCount = computed(() => healthRecords.value.filter(r => r.status === '已过期').length)
const monthCheckCount = computed(() => 12)

// 搜索
const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    ElMessage.success('搜索完成')
    loading.value = false
  }, 500)
}

// 重置
const handleReset = () => {
  searchForm.name = ''
  searchForm.department = ''
  searchForm.status = ''
  searchForm.dateRange = []
  handleSearch()
}

// 刷新
const handleRefresh = () => {
  handleSearch()
}

// 新增
const handleAdd = () => {
  ElMessage.info('打开添加健康记录对话框')
}

// 选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  handleSearch()
}

// 当前页变化
const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  handleSearch()
}

// 获取状态颜色
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    '有效': 'success',
    '即将到期': 'warning',
    '已过期': 'danger'
  }
  return colors[status] || 'info'
}

// 获取到期类型
const getExpiryType = (expiryDate: string) => {
  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'danger'
  if (diffDays < 30) return 'warning'
  return 'success'
}

// 获取剩余天数类型
const getDaysType = (days: number) => {
  if (days < 0) return 'danger'
  if (days < 30) return 'warning'
  return 'success'
}
</script>

<style scoped>
.health-employee-view {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.page-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #303133;
}

.subtitle {
  font-size: 14px;
  color: #909399;
}

/* 统计卡片 */
.stats-row {
  margin-bottom: 16px;
}

.stat-card {
  border-radius: 8px;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-card.success {
  border-left: 4px solid #67C23A;
}

.stat-card.warning {
  border-left: 4px solid #E6A23C;
}

.stat-card.danger {
  border-left: 4px solid #F56C6C;
}

.stat-card.info {
  border-left: 4px solid #909399;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.success-icon {
  background: rgba(103, 194, 58, 0.1);
  color: #67C23A;
}

.warning-icon {
  background: rgba(230, 162, 60, 0.1);
  color: #E6A23C;
}

.danger-icon {
  background: rgba(245, 108, 108, 0.1);
  color: #F56C6C;
}

.info-icon {
  background: rgba(144, 147, 153, 0.1);
  color: #909399;
}

.stat-info {
  flex: 1;
  text-align: left;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.search-card {
  margin-bottom: 16px;
  border-radius: 8px;
}

.search-card :deep(.el-card__body) {
  padding: 20px;
}

.search-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.table-card {
  border-radius: 8px;
}

.table-card :deep(.el-card__body) {
  padding: 20px;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  gap: 8px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

:deep(.el-table) {
  border-radius: 4px;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 600;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}

:deep(.el-button + .el-button) {
  margin-left: 8px;
}
</style>

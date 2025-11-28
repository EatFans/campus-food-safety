<template>
  <div class="pending-order-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2>待处理订单</h2>
        <span class="subtitle">共 {{ pagination.total }} 条待处理订单</span>
      </div>
      <el-button type="primary" :icon="CircleCheck" size="large" @click="batchProcess">批量处理</el-button>
    </div>

    <!-- 搜索筛选区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="订单号">
              <el-input 
                v-model="searchForm.orderNo" 
                placeholder="请输入订单号" 
                clearable
                size="large"
                :prefix-icon="Search"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="用户名">
              <el-input 
                v-model="searchForm.userName" 
                placeholder="请输入用户名" 
                clearable
                size="large"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="订单类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="堂食" value="堂食" />
                <el-option label="外卖" value="外卖" />
                <el-option label="预订" value="预订" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="下单时间">
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
          <el-button type="success" :icon="CircleCheck" :disabled="selectedIds.length === 0">
            批量接单
          </el-button>
          <el-button type="danger" :icon="Close" :disabled="selectedIds.length === 0">
            批量拒绝
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
        :data="orders" 
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        stripe
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="订单号" prop="orderNo" width="180" show-overflow-tooltip />
        <el-table-column label="订单类型" prop="type" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="用户" prop="userName" width="120" />
        <el-table-column label="联系电话" prop="phone" width="130" />
        <el-table-column label="订单金额" width="120" align="right">
          <template #default="{ row }">
            <span class="amount-text">¥{{ row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付方式" prop="payMethod" width="120" />
        <el-table-column label="下单时间" prop="createTime" width="180" />
        <el-table-column label="等待时长" width="100" align="center">
          <template #default="{ row }">
            <el-text :type="getWaitTimeType(row.waitMinutes)">{{ row.waitMinutes }}分钟</el-text>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default>
            <el-button link type="success" size="small" :icon="CircleCheck">接单</el-button>
            <el-button link type="danger" size="small" :icon="Close">拒绝</el-button>
            <el-button link type="primary" size="small" :icon="View">详情</el-button>
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
import { ref, reactive } from 'vue'
import { Search, Refresh, Download, CircleCheck, Close, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const selectedIds = ref<number[]>([])

// 搜索表单
const searchForm = reactive({
  orderNo: '',
  userName: '',
  type: '',
  dateRange: []
})

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 25
})

// 订单数据
const orders = ref([
  { id: 1, orderNo: 'ORD202511280025', type: '外卖', userName: '张三', phone: '13800138001', amount: '128.50', payMethod: '微信支付', createTime: '2025-11-28 09:25', waitMinutes: 2 },
  { id: 2, orderNo: 'ORD202511280024', type: '堂食', userName: '李四', phone: '13800138002', amount: '256.00', payMethod: '支付宝', createTime: '2025-11-28 09:20', waitMinutes: 7 },
  { id: 3, orderNo: 'ORD202511280023', type: '外卖', userName: '王五', phone: '13800138003', amount: '89.00', payMethod: '微信支付', createTime: '2025-11-28 09:15', waitMinutes: 12 },
  { id: 4, orderNo: 'ORD202511280022', type: '预订', userName: '赵六', phone: '13800138004', amount: '568.00', payMethod: '现金', createTime: '2025-11-28 09:10', waitMinutes: 17 },
  { id: 5, orderNo: 'ORD202511280021', type: '外卖', userName: '孙七', phone: '13800138005', amount: '156.50', payMethod: '微信支付', createTime: '2025-11-28 09:05', waitMinutes: 22 },
  { id: 6, orderNo: 'ORD202511280020', type: '堂食', userName: '周八', phone: '13800138006', amount: '95.00', payMethod: '支付宝', createTime: '2025-11-28 09:00', waitMinutes: 27 },
  { id: 7, orderNo: 'ORD202511280019', type: '外卖', userName: '吴九', phone: '13800138007', amount: '178.00', payMethod: '微信支付', createTime: '2025-11-28 08:55', waitMinutes: 32 },
  { id: 8, orderNo: 'ORD202511280018', type: '堂食', userName: '郑十', phone: '13800138008', amount: '68.50', payMethod: '现金', createTime: '2025-11-28 08:50', waitMinutes: 37 }
])

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
  searchForm.orderNo = ''
  searchForm.userName = ''
  searchForm.type = ''
  searchForm.dateRange = []
  handleSearch()
}

// 刷新
const handleRefresh = () => {
  handleSearch()
}

// 批量处理
const batchProcess = () => {
  ElMessage.info('批量处理订单')
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

// 获取类型颜色
const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    '堂食': '',
    '外卖': 'success',
    '预订': 'warning'
  }
  return colors[type] || 'info'
}

// 获取等待时长类型
const getWaitTimeType = (minutes: number) => {
  if (minutes < 10) return 'success'
  if (minutes < 20) return 'warning'
  return 'danger'
}
</script>

<style scoped>
.pending-order-view {
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

.amount-text {
  color: #f56c6c;
  font-weight: 600;
  font-size: 15px;
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

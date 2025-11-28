<template>
  <div class="refund-manage-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2>退款管理</h2>
        <span class="subtitle">共 {{ pagination.total }} 条退款申请</span>
      </div>
      <el-button type="primary" :icon="Setting" size="large">退款设置</el-button>
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
            <el-form-item label="退款状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="待审核" value="待审核" />
                <el-option label="已同意" value="已同意" />
                <el-option label="已拒绝" value="已拒绝" />
                <el-option label="已退款" value="已退款" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="申请时间">
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
            批量同意
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
        :data="refunds" 
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        stripe
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="订单号" prop="orderNo" width="180" show-overflow-tooltip />
        <el-table-column label="用户" prop="userName" width="120" />
        <el-table-column label="联系电话" prop="phone" width="130" />
        <el-table-column label="退款金额" width="120" align="right">
          <template #default="{ row }">
            <span class="refund-amount">¥{{ row.refundAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="退款原因" prop="reason" min-width="200" show-overflow-tooltip />
        <el-table-column label="申请时间" prop="applyTime" width="180" />
        <el-table-column label="退款状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)" effect="dark">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="处理人" prop="handler" width="100">
          <template #default="{ row }">
            <span>{{ row.handler || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="primary" size="small" :icon="View">详情</el-button>
            <el-button link type="success" size="small" :icon="CircleCheck" v-if="row.status === '待审核'">
              同意
            </el-button>
            <el-button link type="danger" size="small" :icon="Close" v-if="row.status === '待审核'">
              拒绝
            </el-button>
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
import { Search, Refresh, Download, Setting, CircleCheck, Close, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const selectedIds = ref<number[]>([])

// 搜索表单
const searchForm = reactive({
  orderNo: '',
  userName: '',
  status: '',
  dateRange: []
})

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 18
})

// 退款数据
const refunds = ref([
  { id: 1, orderNo: 'ORD202511280018', userName: '张三', phone: '13800138001', refundAmount: '128.50', reason: '菜品不新鲜，要求退款', applyTime: '2025-11-28 09:20', status: '待审核', handler: null },
  { id: 2, orderNo: 'ORD202511280017', userName: '李四', phone: '13800138002', refundAmount: '256.00', reason: '等待时间过长，不想要了', applyTime: '2025-11-28 09:15', status: '待审核', handler: null },
  { id: 3, orderNo: 'ORD202511280016', userName: '王五', phone: '13800138003', refundAmount: '89.00', reason: '下错单了', applyTime: '2025-11-28 09:10', status: '待审核', handler: null },
  { id: 4, orderNo: 'ORD202511280015', userName: '赵六', phone: '13800138004', refundAmount: '568.00', reason: '临时有事，无法就餐', applyTime: '2025-11-28 09:05', status: '已同意', handler: '管理员' },
  { id: 5, orderNo: 'ORD202511280014', userName: '孙七', phone: '13800138005', refundAmount: '156.50', reason: '菜品口味不符合预期', applyTime: '2025-11-28 09:00', status: '已退款', handler: '管理员' },
  { id: 6, orderNo: 'ORD202511280013', userName: '周八', phone: '13800138006', refundAmount: '95.00', reason: '送餐地址错误', applyTime: '2025-11-28 08:55', status: '已退款', handler: '客服A' },
  { id: 7, orderNo: 'ORD202511280012', userName: '吴九', phone: '13800138007', refundAmount: '178.00', reason: '无理由退款', applyTime: '2025-11-28 08:50', status: '已拒绝', handler: '客服B' },
  { id: 8, orderNo: 'ORD202511280011', userName: '郑十', phone: '13800138008', refundAmount: '68.50', reason: '菜品有异物', applyTime: '2025-11-28 08:45', status: '已退款', handler: '管理员' }
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
  searchForm.status = ''
  searchForm.dateRange = []
  handleSearch()
}

// 刷新
const handleRefresh = () => {
  handleSearch()
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
    '待审核': 'warning',
    '已同意': 'primary',
    '已拒绝': 'danger',
    '已退款': 'success'
  }
  return colors[status] || 'info'
}
</script>

<style scoped>
.refund-manage-view {
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

.refund-amount {
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

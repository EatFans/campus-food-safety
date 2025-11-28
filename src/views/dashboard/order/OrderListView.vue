<template>
  <div class="order-list-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2>订单列表</h2>
        <span class="subtitle">共 {{ pagination.total }} 条订单</span>
      </div>
      <el-button type="primary" :icon="Plus">新建订单</el-button>
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
            <el-form-item label="订单状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="待支付" value="待支付" />
                <el-option label="已支付" value="已支付" />
                <el-option label="配送中" value="配送中" />
                <el-option label="已完成" value="已完成" />
                <el-option label="已取消" value="已取消" />
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
          <el-button type="danger" :icon="Delete" :disabled="selectedIds.length === 0">
            批量删除
          </el-button>
          <el-button :icon="Download" :disabled="selectedIds.length === 0">
            批量导出
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-tooltip content="刷新" placement="top">
            <el-button circle :icon="Refresh" @click="handleRefresh" />
          </el-tooltip>
          <el-tooltip content="列设置" placement="top">
            <el-button circle :icon="Setting" />
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
        <el-table-column label="用户" prop="userName" width="120" />
        <el-table-column label="订单金额" width="120" align="right">
          <template #default="{ row }">
            <span class="amount-text">¥{{ row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)" effect="dark">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="支付方式" prop="payMethod" width="120" />
        <el-table-column label="下单时间" prop="createTime" width="180" />
        <el-table-column label="备注" prop="remark" min-width="150" show-overflow-tooltip />
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="primary" size="small" :icon="View">查看</el-button>
            <el-button link type="success" size="small" :icon="Edit" v-if="row.status === '待支付'">
              处理
            </el-button>
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
import { ref, reactive } from 'vue'
import { Search, Plus, Refresh, Download, Delete, Setting, View, Edit } from '@element-plus/icons-vue'
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
  total: 100
})

// 订单数据
const orders = ref([
  { 
    id: 1, 
    orderNo: 'ORD202511280001', 
    userName: '张三', 
    amount: '58.50', 
    status: '待支付', 
    payMethod: '微信支付',
    createTime: '2025-11-28 08:30:15',
    remark: '请尽快送达'
  },
  { 
    id: 2, 
    orderNo: 'ORD202511280002', 
    userName: '李四', 
    amount: '125.00', 
    status: '已支付', 
    payMethod: '支付宝',
    createTime: '2025-11-28 08:25:30',
    remark: '不要辣椒'
  },
  { 
    id: 3, 
    orderNo: 'ORD202511280003', 
    userName: '王五', 
    amount: '89.00', 
    status: '配送中', 
    payMethod: '微信支付',
    createTime: '2025-11-28 08:20:45',
    remark: ''
  },
  { 
    id: 4, 
    orderNo: 'ORD202511280004', 
    userName: '赵六', 
    amount: '156.50', 
    status: '已完成', 
    payMethod: '现金',
    createTime: '2025-11-28 08:15:20',
    remark: '送到3楼'
  },
  { 
    id: 5, 
    orderNo: 'ORD202511280005', 
    userName: '孙七', 
    amount: '78.00', 
    status: '已取消', 
    payMethod: '微信支付',
    createTime: '2025-11-28 08:10:30',
    remark: '用户取消'
  },
  { 
    id: 6, 
    orderNo: 'ORD202511280006', 
    userName: '周八', 
    amount: '95.50', 
    status: '已支付', 
    payMethod: '支付宝',
    createTime: '2025-11-28 08:05:15',
    remark: ''
  },
  { 
    id: 7, 
    orderNo: 'ORD202511280007', 
    userName: '吴九', 
    amount: '112.00', 
    status: '配送中', 
    payMethod: '微信支付',
    createTime: '2025-11-28 08:00:45',
    remark: '多加饭'
  },
  { 
    id: 8, 
    orderNo: 'ORD202511280008', 
    userName: '郑十', 
    amount: '68.50', 
    status: '已完成', 
    payMethod: '现金',
    createTime: '2025-11-28 07:55:20',
    remark: ''
  }
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

// 状态颜色
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    '待支付': 'warning',
    '已支付': '',
    '配送中': 'info',
    '已完成': 'success',
    '已取消': 'danger'
  }
  return colors[status] || 'info'
}
</script>

<style scoped>
.order-list-view {
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

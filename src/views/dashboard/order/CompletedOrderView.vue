<template>
  <div class="completed-order-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2>已完成订单</h2>
        <span class="subtitle">共 {{ pagination.total }} 条已完成订单</span>
      </div>
      <el-button type="primary" :icon="Download" size="large">导出报表</el-button>
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
            <el-form-item label="完成时间">
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
          <el-button :icon="Download" :disabled="selectedIds.length === 0">
            批量导出
          </el-button>
          <el-button :icon="Delete" :disabled="selectedIds.length === 0">
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
        <el-table-column label="订单金额" width="120" align="right">
          <template #default="{ row }">
            <span class="amount-text">¥{{ row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付方式" prop="payMethod" width="120" />
        <el-table-column label="下单时间" prop="createTime" width="180" />
        <el-table-column label="完成时间" prop="completeTime" width="180" />
        <el-table-column label="评分" width="100" align="center">
          <template #default="{ row }">
            <el-rate v-model="row.rating" disabled show-score text-color="#ff9900" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small" :icon="View">详情</el-button>
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
import { Search, Refresh, Download, Delete, View } from '@element-plus/icons-vue'
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
  total: 156
})

// 订单数据
const orders = ref([
  { id: 1, orderNo: 'ORD202511280015', type: '外卖', userName: '张三', amount: '128.50', payMethod: '微信支付', createTime: '2025-11-28 08:30', completeTime: '2025-11-28 09:15', rating: 5 },
  { id: 2, orderNo: 'ORD202511280014', type: '堂食', userName: '李四', amount: '256.00', payMethod: '支付宝', createTime: '2025-11-28 08:20', completeTime: '2025-11-28 09:10', rating: 4 },
  { id: 3, orderNo: 'ORD202511280013', type: '外卖', userName: '王五', amount: '89.00', payMethod: '微信支付', createTime: '2025-11-28 08:15', completeTime: '2025-11-28 09:05', rating: 5 },
  { id: 4, orderNo: 'ORD202511280012', type: '预订', userName: '赵六', amount: '568.00', payMethod: '现金', createTime: '2025-11-28 08:10', completeTime: '2025-11-28 09:00', rating: 5 },
  { id: 5, orderNo: 'ORD202511280011', type: '外卖', userName: '孙七', amount: '156.50', payMethod: '微信支付', createTime: '2025-11-28 08:05', completeTime: '2025-11-28 08:55', rating: 4 },
  { id: 6, orderNo: 'ORD202511280010', type: '堂食', userName: '周八', amount: '95.00', payMethod: '支付宝', createTime: '2025-11-28 08:00', completeTime: '2025-11-28 08:50', rating: 3 },
  { id: 7, orderNo: 'ORD202511280009', type: '外卖', userName: '吴九', amount: '178.00', payMethod: '微信支付', createTime: '2025-11-28 07:55', completeTime: '2025-11-28 08:45', rating: 5 },
  { id: 8, orderNo: 'ORD202511280008', type: '堂食', userName: '郑十', amount: '68.50', payMethod: '现金', createTime: '2025-11-28 07:50', completeTime: '2025-11-28 08:40', rating: 4 },
  { id: 9, orderNo: 'ORD202511280007', type: '外卖', userName: '钱一', amount: '225.00', payMethod: '微信支付', createTime: '2025-11-28 07:45', completeTime: '2025-11-28 08:35', rating: 5 },
  { id: 10, orderNo: 'ORD202511280006', type: '堂食', userName: '陈二', amount: '138.50', payMethod: '支付宝', createTime: '2025-11-28 07:40', completeTime: '2025-11-28 08:30', rating: 4 }
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
</script>

<style scoped>
.completed-order-view {
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
  color: #67c23a;
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

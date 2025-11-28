<template>
  <div class="coupon-manage-view">
    <div class="page-header">
      <div class="header-left">
        <h2>优惠券管理</h2>
        <span class="subtitle">共 {{ pagination.total }} 张优惠券</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large">创建优惠券</el-button>
    </div>

    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="优惠券名">
              <el-input v-model="searchForm.name" placeholder="请输入优惠券名称" clearable size="large" :prefix-icon="Search" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="优惠类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="满减券" value="满减券" />
                <el-option label="折扣券" value="折扣券" />
                <el-option label="兑换券" value="兑换券" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="券状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="未发放" value="未发放" />
                <el-option label="发放中" value="发放中" />
                <el-option label="已结束" value="已结束" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="创建时间">
              <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="large" style="width: 100%;" />
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

    <el-card shadow="never" class="table-card">
      <div class="table-toolbar">
        <div class="toolbar-left">
          <el-button type="danger" :icon="Delete" :disabled="selectedIds.length === 0">批量删除</el-button>
        </div>
        <div class="toolbar-right">
          <el-tooltip content="刷新" placement="top">
            <el-button circle :icon="Refresh" @click="handleRefresh" />
          </el-tooltip>
        </div>
      </div>

      <el-table :data="coupons" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange" stripe border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="优惠券名称" prop="name" width="180" />
        <el-table-column label="优惠类型" prop="type" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="优惠金额" width="120" align="right">
          <template #default="{ row }">
            <span class="amount-text">{{ row.discount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="使用门槛" prop="threshold" width="120" />
        <el-table-column label="发放数量" prop="totalCount" width="100" align="center" />
        <el-table-column label="已领取" prop="receivedCount" width="100" align="center">
          <template #default="{ row }">
            <el-text type="primary">{{ row.receivedCount }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="已使用" prop="usedCount" width="100" align="center">
          <template #default="{ row }">
            <el-text type="success">{{ row.usedCount }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="有效期" prop="validPeriod" width="180" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)" effect="dark">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small" :icon="Edit">编辑</el-button>
            <el-button link type="success" size="small" :icon="View">详情</el-button>
            <el-button link type="danger" size="small" :icon="Delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize" :page-sizes="[10, 20, 50, 100]" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, Refresh, Download, Delete, Edit, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const selectedIds = ref<number[]>([])

const searchForm = reactive({
  name: '',
  type: '',
  status: '',
  dateRange: []
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 45
})

const coupons = ref([
  { id: 1, name: '新用户专享券', type: '满减券', discount: '¥20', threshold: '满100元', totalCount: 1000, receivedCount: 856, usedCount: 425, validPeriod: '2025-11-01至2025-12-31', status: '发放中' },
  { id: 2, name: '周末特惠券', type: '折扣券', discount: '8.8折', threshold: '无门槛', totalCount: 500, receivedCount: 325, usedCount: 156, validPeriod: '2025-11-23至2025-11-24', status: '已结束' },
  { id: 3, name: '满减优惠券', type: '满减券', discount: '¥50', threshold: '满200元', totalCount: 800, receivedCount: 652, usedCount: 325, validPeriod: '2025-11-20至2025-11-30', status: '发放中' },
  { id: 4, name: '免费兑换券', type: '兑换券', discount: '免费', threshold: '无门槛', totalCount: 200, receivedCount: 0, usedCount: 0, validPeriod: '2025-12-01至2025-12-31', status: '未发放' },
  { id: 5, name: '会员专享券', type: '折扣券', discount: '9折', threshold: '仅限会员', totalCount: 1500, receivedCount: 1285, usedCount: 856, validPeriod: '2025-11-01至2025-12-31', status: '发放中' },
  { id: 6, name: '满100减15', type: '满减券', discount: '¥15', threshold: '满100元', totalCount: 600, receivedCount: 425, usedCount: 268, validPeriod: '2025-11-25至2025-11-30', status: '发放中' },
  { id: 7, name: '限时秒杀券', type: '折扣券', discount: '5折', threshold: '限量商品', totalCount: 100, receivedCount: 100, usedCount: 85, validPeriod: '2025-11-28至2025-11-28', status: '发放中' },
  { id: 8, name: '满200减30', type: '满减券', discount: '¥30', threshold: '满200元', totalCount: 400, receivedCount: 325, usedCount: 156, validPeriod: '2025-11-15至2025-11-25', status: '已结束' },
  { id: 9, name: '生日专享券', type: '兑换券', discount: '免费蛋糕', threshold: '生日当月', totalCount: 300, receivedCount: 156, usedCount: 85, validPeriod: '长期有效', status: '发放中' },
  { id: 10, name: '年终大促券', type: '满减券', discount: '¥100', threshold: '满500元', totalCount: 1000, receivedCount: 0, usedCount: 0, validPeriod: '2025-12-20至2025-12-31', status: '未发放' }
])

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    ElMessage.success('搜索完成')
    loading.value = false
  }, 500)
}

const handleReset = () => {
  searchForm.name = ''
  searchForm.type = ''
  searchForm.status = ''
  searchForm.dateRange = []
  handleSearch()
}

const handleRefresh = () => {
  handleSearch()
}

const handleSelectionChange = (selection: any[]) => {
  selectedIds.value = selection.map(item => item.id)
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  handleSearch()
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  handleSearch()
}

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    '满减券': 'danger',
    '折扣券': 'warning',
    '兑换券': 'success'
  }
  return colors[type] || 'info'
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    '未发放': 'info',
    '发放中': 'success',
    '已结束': 'danger'
  }
  return colors[status] || 'info'
}
</script>

<style scoped>
.coupon-manage-view {
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

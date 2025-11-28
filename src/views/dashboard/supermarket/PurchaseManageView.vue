<template>
  <div class="purchase-manage-view">
    <div class="page-header">
      <div class="header-left">
        <h2>采购管理</h2>
        <span class="subtitle">共 {{ pagination.total }} 条采购记录</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large">新增采购</el-button>
    </div>

    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="采购单号">
              <el-input v-model="searchForm.orderNo" placeholder="请输入采购单号" clearable size="large" :prefix-icon="Search" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="供应商">
              <el-input v-model="searchForm.supplier" placeholder="请输入供应商" clearable size="large" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="采购状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="待审核" value="待审核" />
                <el-option label="已审核" value="已审核" />
                <el-option label="采购中" value="采购中" />
                <el-option label="已完成" value="已完成" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="采购时间">
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
          <el-button type="success" :icon="CircleCheck" :disabled="selectedIds.length === 0">批量审核</el-button>
          <el-button type="danger" :icon="Delete" :disabled="selectedIds.length === 0">批量删除</el-button>
        </div>
        <div class="toolbar-right">
          <el-tooltip content="刷新" placement="top">
            <el-button circle :icon="Refresh" @click="handleRefresh" />
          </el-tooltip>
        </div>
      </div>

      <el-table :data="purchases" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange" stripe border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="采购单号" prop="orderNo" width="150" show-overflow-tooltip>
          <template #default="{ row }">
            <el-text type="primary">{{ row.orderNo }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="供应商" prop="supplier" width="150" />
        <el-table-column label="采购商品" prop="goods" min-width="200" show-overflow-tooltip />
        <el-table-column label="采购数量" prop="quantity" width="100" align="center" />
        <el-table-column label="采购金额" width="120" align="right">
          <template #default="{ row }">
            <span class="amount-text">¥{{ row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="采购人" prop="purchaser" width="100" />
        <el-table-column label="采购时间" prop="purchaseTime" width="180" />
        <el-table-column label="采购状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)" effect="dark">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="primary" size="small" :icon="View">详情</el-button>
            <el-button link type="success" size="small" :icon="CircleCheck" v-if="row.status === '待审核'">审核</el-button>
            <el-button link type="warning" size="small" :icon="Edit">编辑</el-button>
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
import { Search, Plus, Refresh, Download, Delete, Edit, View, CircleCheck } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const selectedIds = ref<number[]>([])

const searchForm = reactive({
  orderNo: '',
  supplier: '',
  status: '',
  dateRange: []
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 65
})

const purchases = ref([
  { id: 1, orderNo: 'PO202511280001', supplier: '绿源农场', goods: '新鲜鸡蛋500个、土鸡蛋300个', quantity: 800, amount: '10,240.00', purchaser: '张三', purchaseTime: '2025-11-28 09:00', status: '已完成' },
  { id: 2, orderNo: 'PO202511280002', supplier: '有机农庄', goods: '有机蔬菜包200份、新鲜西红柿100kg', quantity: 300, amount: '6,450.00', purchaser: '李四', purchaseTime: '2025-11-28 08:45', status: '采购中' },
  { id: 3, orderNo: 'PO202511280003', supplier: '五常大米', goods: '优质大米150袋', quantity: 150, amount: '6,750.00', purchaser: '王五', purchaseTime: '2025-11-28 08:30', status: '已审核' },
  { id: 4, orderNo: 'PO202511280004', supplier: '绿色养殖场', goods: '新鲜猪肉80kg、新鲜牛肉60kg', quantity: 140, amount: '8,520.00', purchaser: '赵六', purchaseTime: '2025-11-28 08:15', status: '待审核' },
  { id: 5, orderNo: 'PO202511280005', supplier: '金龙鱼', goods: '食用油120桶', quantity: 120, amount: '8,160.00', purchaser: '孙七', purchaseTime: '2025-11-28 08:00', status: '已完成' },
  { id: 6, orderNo: 'PO202511280006', supplier: '绿源农场', goods: '鹌鹑蛋200个', quantity: 200, amount: '3,000.00', purchaser: '周八', purchaseTime: '2025-11-27 16:30', status: '已完成' },
  { id: 7, orderNo: 'PO202511280007', supplier: '有机农庄', goods: '有机黄瓜350kg', quantity: 350, amount: '2,380.00', purchaser: '吴九', purchaseTime: '2025-11-27 15:45', status: '已完成' },
  { id: 8, orderNo: 'PO202511280008', supplier: '海鲜水产公司', goods: '新鲜鲈鱼30kg、虾仁25kg', quantity: 55, amount: '3,850.00', purchaser: '郑十', purchaseTime: '2025-11-27 15:00', status: '采购中' },
  { id: 9, orderNo: 'PO202511280009', supplier: '优质肉类供应商', goods: '鸡肉40kg', quantity: 40, amount: '1,520.00', purchaser: '钱一', purchaseTime: '2025-11-27 14:30', status: '已审核' },
  { id: 10, orderNo: 'PO202511280010', supplier: '粮油批发市场', goods: '大米200kg', quantity: 200, amount: '9,000.00', purchaser: '陈二', purchaseTime: '2025-11-27 14:00', status: '待审核' }
])

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    ElMessage.success('搜索完成')
    loading.value = false
  }, 500)
}

const handleReset = () => {
  searchForm.orderNo = ''
  searchForm.supplier = ''
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

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    '待审核': 'warning',
    '已审核': 'primary',
    '采购中': 'info',
    '已完成': 'success'
  }
  return colors[status] || 'info'
}
</script>

<style scoped>
.purchase-manage-view {
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

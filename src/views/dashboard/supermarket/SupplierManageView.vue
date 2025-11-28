<template>
  <div class="supplier-manage-view">
    <div class="page-header">
      <div class="header-left">
        <h2>供应商管理</h2>
        <span class="subtitle">共 {{ pagination.total }} 家供应商</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large">添加供应商</el-button>
    </div>

    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="供应商名">
              <el-input v-model="searchForm.name" placeholder="请输入供应商名称" clearable size="large" :prefix-icon="Search" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="供应类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="蔬菜供应" value="蔬菜供应" />
                <el-option label="肉类供应" value="肉类供应" />
                <el-option label="粮油供应" value="粮油供应" />
                <el-option label="综合供应" value="综合供应" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="合作状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="合作中" value="合作中" />
                <el-option label="暂停" value="暂停" />
                <el-option label="终止" value="终止" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="合作时间">
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
          <el-button :icon="Download" :disabled="selectedIds.length === 0">批量导出</el-button>
        </div>
        <div class="toolbar-right">
          <el-tooltip content="刷新" placement="top">
            <el-button circle :icon="Refresh" @click="handleRefresh" />
          </el-tooltip>
        </div>
      </div>

      <el-table :data="suppliers" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange" stripe border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="供应商名称" prop="name" width="180" />
        <el-table-column label="供应类型" prop="type" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="联系人" prop="contact" width="100" />
        <el-table-column label="联系电话" prop="phone" width="130" />
        <el-table-column label="地址" prop="address" min-width="200" show-overflow-tooltip />
        <el-table-column label="信用评级" width="120" align="center">
          <template #default="{ row }">
            <el-rate v-model="row.rating" disabled show-score text-color="#ff9900" />
          </template>
        </el-table-column>
        <el-table-column label="合作状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)" effect="dark">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="合作时间" prop="cooperateTime" width="120" />
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small" :icon="Edit">编辑</el-button>
            <el-button link type="success" size="small" :icon="View">详情</el-button>
            <el-button link type="warning" size="small" :icon="Document">合同</el-button>
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
import { Search, Plus, Refresh, Download, Delete, Edit, View, Document } from '@element-plus/icons-vue'
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
  total: 28
})

const suppliers = ref([
  { id: 1, name: '绿源农场', type: '蔬菜供应', contact: '张经理', phone: '13800138001', address: '山东省济南市历城区农业园区', rating: 4.8, status: '合作中', cooperateTime: '2023-01-15' },
  { id: 2, name: '有机农庄', type: '蔬菜供应', contact: '李经理', phone: '13800138002', address: '山东省寿光市蔬菜基地', rating: 4.9, status: '合作中', cooperateTime: '2023-03-20' },
  { id: 3, name: '绿色养殖场', type: '肉类供应', contact: '王经理', phone: '13800138003', address: '河南省郑州市畜牧养殖区', rating: 4.7, status: '合作中', cooperateTime: '2023-05-10' },
  { id: 4, name: '五常大米', type: '粮油供应', contact: '赵经理', phone: '13800138004', address: '黑龙江省五常市粮食基地', rating: 4.9, status: '合作中', cooperateTime: '2023-02-01' },
  { id: 5, name: '金龙鱼', type: '粮油供应', contact: '孙经理', phone: '13800138005', address: '上海市浦东新区工业园', rating: 4.8, status: '合作中', cooperateTime: '2023-04-15' },
  { id: 6, name: '海鲜水产公司', type: '综合供应', contact: '周经理', phone: '13800138006', address: '广东省深圳市水产批发市场', rating: 4.6, status: '合作中', cooperateTime: '2023-06-20' },
  { id: 7, name: '优质肉类供应商', type: '肉类供应', contact: '吴经理', phone: '13800138007', address: '山东省青岛市肉类加工区', rating: 4.7, status: '合作中', cooperateTime: '2023-07-10' },
  { id: 8, name: '粮油批发市场', type: '粮油供应', contact: '郑经理', phone: '13800138008', address: '河北省石家庄市粮油批发市场', rating: 4.5, status: '暂停', cooperateTime: '2022-12-01' },
  { id: 9, name: '新鲜蔬菜配送', type: '蔬菜供应', contact: '钱经理', phone: '13800138009', address: '山东省潍坊市蔬菜配送中心', rating: 4.8, status: '合作中', cooperateTime: '2023-08-15' },
  { id: 10, name: '优选食材供应', type: '综合供应', contact: '陈经理', phone: '13800138010', address: '江苏省南京市食材批发市场', rating: 4.6, status: '合作中', cooperateTime: '2023-09-01' }
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
    '蔬菜供应': 'success',
    '肉类供应': 'danger',
    '粮油供应': 'warning',
    '综合供应': 'primary'
  }
  return colors[type] || 'info'
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    '合作中': 'success',
    '暂停': 'warning',
    '终止': 'danger'
  }
  return colors[status] || 'info'
}
</script>

<style scoped>
.supplier-manage-view {
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

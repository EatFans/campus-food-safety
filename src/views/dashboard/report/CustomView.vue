<template>
  <div class="custom-view">
    <div class="page-header">
      <div class="header-left">
        <h2>自定义报表</h2>
        <span class="subtitle">共 {{ pagination.total }} 个报表</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large">创建报表</el-button>
    </div>

    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="报表名称">
              <el-input v-model="searchForm.name" placeholder="请输入报表名称" clearable size="large" :prefix-icon="Search" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="报表类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="销售类" value="销售类" />
                <el-option label="财务类" value="财务类" />
                <el-option label="运营类" value="运营类" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="search-actions">
            <el-button type="primary" size="large" :icon="Search" @click="handleSearch">搜索</el-button>
            <el-button size="large" :icon="Refresh" @click="handleReset">重置</el-button>
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

      <el-table :data="reports" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange" stripe border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="报表编号" prop="reportNo" width="150">
          <template #default="{ row }">
            <el-text type="primary">{{ row.reportNo }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="报表名称" prop="name" width="200" />
        <el-table-column label="报表类型" prop="type" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="数据源" prop="dataSource" width="150" />
        <el-table-column label="创建人" prop="creator" width="100" />
        <el-table-column label="创建时间" prop="createTime" width="180" />
        <el-table-column label="最后运行" prop="lastRun" width="180" />
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small" :icon="View">查看</el-button>
            <el-button link type="success" size="small" :icon="Promotion">运行</el-button>
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
import { Search, Plus, Refresh, Delete, Edit, View, Promotion } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const selectedIds = ref<number[]>([])

const searchForm = reactive({
  name: '',
  type: ''
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 18
})

const reports = ref([
  { id: 1, reportNo: 'RPT001', name: '每日销售汇总', type: '销售类', dataSource: '销售数据表', creator: '张三', createTime: '2023-01-15 10:00', lastRun: '2025-11-28 09:00' },
  { id: 2, reportNo: 'RPT002', name: '菜品销量排行', type: '销售类', dataSource: '订单明细表', creator: '李四', createTime: '2023-01-15 10:05', lastRun: '2025-11-28 08:30' },
  { id: 3, reportNo: 'RPT003', name: '月度成本分析', type: '财务类', dataSource: '财务数据表', creator: '王五', createTime: '2023-01-15 10:10', lastRun: '2025-11-01 10:00' },
  { id: 4, reportNo: 'RPT004', name: '客流量趋势', type: '运营类', dataSource: '运营数据表', creator: '赵六', createTime: '2023-01-15 10:15', lastRun: '2025-11-28 08:00' },
  { id: 5, reportNo: 'RPT005', name: '会员消费分析', type: '销售类', dataSource: '会员数据表', creator: '张三', createTime: '2023-02-20 14:00', lastRun: '2025-11-27 18:00' },
  { id: 6, reportNo: 'RPT006', name: '食材采购统计', type: '财务类', dataSource: '采购数据表', creator: '王五', createTime: '2023-03-10 09:00', lastRun: '2025-11-28 07:00' },
  { id: 7, reportNo: 'RPT007', name: '员工绩效报表', type: '运营类', dataSource: '员工数据表', creator: '赵六', createTime: '2023-04-05 11:00', lastRun: '2025-11-01 09:00' },
  { id: 8, reportNo: 'RPT008', name: '能耗分析报表', type: '财务类', dataSource: '能源数据表', creator: '王五', createTime: '2023-05-12 13:00', lastRun: '2025-11-28 06:00' },
  { id: 9, reportNo: 'RPT009', name: '满意度调查', type: '运营类', dataSource: '评价数据表', creator: '赵六', createTime: '2023-06-18 15:00', lastRun: '2025-11-27 20:00' },
  { id: 10, reportNo: 'RPT010', name: '库存周转率', type: '运营类', dataSource: '库存数据表', creator: '李四', createTime: '2023-07-22 10:30', lastRun: '2025-11-28 08:00' }
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
    '销售类': 'primary',
    '财务类': 'success',
    '运营类': 'warning'
  }
  return colors[type] || 'info'
}
</script>

<style scoped>
.custom-view {
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

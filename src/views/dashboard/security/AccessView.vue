<template>
  <div class="access-view">
    <div class="page-header">
      <div class="header-left">
        <h2>门禁管理</h2>
        <span class="subtitle">共 {{ pagination.total }} 条记录</span>
      </div>
    </div>

    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="人员姓名">
              <el-input v-model="searchForm.name" placeholder="请输入人员姓名" clearable size="large" :prefix-icon="Search" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="门禁位置">
              <el-select v-model="searchForm.location" placeholder="请选择位置" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="主入口" value="主入口" />
                <el-option label="后门" value="后门" />
                <el-option label="仓库门" value="仓库门" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="通行时间">
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
        <h3>通行记录</h3>
        <el-tooltip content="刷新" placement="top">
          <el-button circle :icon="Refresh" @click="handleRefresh" />
        </el-tooltip>
      </div>

      <el-table :data="records" style="width: 100%" v-loading="loading" stripe border>
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="人员姓名" prop="name" width="120" />
        <el-table-column label="人员类型" prop="type" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="门禁位置" prop="location" width="120" />
        <el-table-column label="通行方向" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.direction === '进入' ? 'success' : 'warning'" size="small">{{ row.direction }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="通行时间" prop="accessTime" width="180" />
        <el-table-column label="验证方式" prop="method" width="120" align="center">
          <template #default="{ row }">
            <el-tag size="small">{{ row.method }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="通行状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '成功' ? 'success' : 'danger'" effect="dark">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" min-width="150" show-overflow-tooltip />
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small" :icon="View">详情</el-button>
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
import { Search, Refresh, Download, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)

const searchForm = reactive({
  name: '',
  location: '',
  dateRange: []
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 256
})

const records = ref([
  { id: 1, name: '张三', type: '员工', location: '主入口', direction: '进入', accessTime: '2025-11-28 08:00', method: '刷卡', status: '成功', remark: '' },
  { id: 2, name: '李四', type: '员工', location: '主入口', direction: '进入', accessTime: '2025-11-28 08:05', method: '刷卡', status: '成功', remark: '' },
  { id: 3, name: '王五', type: '员工', location: '后门', direction: '进入', accessTime: '2025-11-28 08:10', method: '刷卡', status: '成功', remark: '' },
  { id: 4, name: '赵六', type: '访客', location: '主入口', direction: '进入', accessTime: '2025-11-28 09:00', method: '登记', status: '成功', remark: '供应商送货' },
  { id: 5, name: '孙七', type: '员工', location: '仓库门', direction: '进入', accessTime: '2025-11-28 09:15', method: '刷卡', status: '成功', remark: '' },
  { id: 6, name: '周八', type: '员工', location: '主入口', direction: '离开', accessTime: '2025-11-28 17:30', method: '刷卡', status: '成功', remark: '' },
  { id: 7, name: '吴九', type: '员工', location: '后门', direction: '离开', accessTime: '2025-11-28 17:35', method: '刷卡', status: '成功', remark: '' },
  { id: 8, name: '未知', type: '其他', location: '后门', direction: '进入', accessTime: '2025-11-28 02:30', method: '强行', status: '失败', remark: '异常进入尝试' },
  { id: 9, name: '郑十', type: '员工', location: '主入口', direction: '进入', accessTime: '2025-11-28 08:20', method: '刷卡', status: '成功', remark: '' },
  { id: 10, name: '钱一', type: '访客', location: '主入口', direction: '离开', accessTime: '2025-11-28 11:00', method: '登记', status: '成功', remark: '参观结束' }
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
  searchForm.location = ''
  searchForm.dateRange = []
  handleSearch()
}

const handleRefresh = () => {
  handleSearch()
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
    '员工': 'primary',
    '访客': 'warning',
    '其他': 'info'
  }
  return colors[type] || 'info'
}
</script>

<style scoped>
.access-view {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
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

.table-toolbar h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
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

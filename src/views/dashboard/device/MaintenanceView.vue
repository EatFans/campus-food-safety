<template>
  <div class="maintenance-view">
    <div class="page-header">
      <div class="header-left">
        <h2>维护保养</h2>
        <span class="subtitle">共 {{ pagination.total }} 条记录</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large">添加保养</el-button>
    </div>

    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="设备名称">
              <el-input v-model="searchForm.device" placeholder="请输入设备名称" clearable size="large" :prefix-icon="Search" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="保养类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="日常保养" value="日常保养" />
                <el-option label="定期保养" value="定期保养" />
                <el-option label="专项保养" value="专项保养" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="保养状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="待保养" value="待保养" />
                <el-option label="保养中" value="保养中" />
                <el-option label="已完成" value="已完成" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="保养时间">
              <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="large" style="width: 100%;" />
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
        <div class="toolbar-right">
          <el-tooltip content="刷新" placement="top">
            <el-button circle :icon="Refresh" @click="handleRefresh" />
          </el-tooltip>
        </div>
      </div>

      <el-table :data="maintenances" style="width: 100%" v-loading="loading" stripe border>
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="设备编号" prop="deviceNo" width="120">
          <template #default="{ row }">
            <el-text type="primary">{{ row.deviceNo }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="设备名称" prop="deviceName" width="150" />
        <el-table-column label="保养类型" prop="type" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="保养内容" prop="content" min-width="200" show-overflow-tooltip />
        <el-table-column label="保养人员" prop="staff" width="100" />
        <el-table-column label="计划时间" prop="planTime" width="180" />
        <el-table-column label="保养状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)" effect="dark">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="primary" size="small" :icon="View">详情</el-button>
            <el-button link type="success" size="small" :icon="CircleCheck" v-if="row.status !== '已完成'">完成</el-button>
            <el-button link type="warning" size="small" :icon="Edit">编辑</el-button>
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
import { Search, Plus, Refresh, Edit, View, CircleCheck } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)

const searchForm = reactive({
  device: '',
  type: '',
  status: '',
  dateRange: []
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 86
})

const maintenances = ref([
  { id: 1, deviceNo: 'DEV001', deviceName: '商用燃气灶', type: '日常保养', content: '清洁灶台、检查燃气管道', staff: '张三', planTime: '2025-11-28 14:00', status: '待保养' },
  { id: 2, deviceNo: 'DEV002', deviceName: '冷藏柜', type: '定期保养', content: '清洁冷凝器、检查制冷系统', staff: '李四', planTime: '2025-11-28 10:00', status: '保养中' },
  { id: 3, deviceNo: 'DEV003', deviceName: '消毒柜', type: '日常保养', content: '清洁内部、检查消毒功能', staff: '王五', planTime: '2025-11-27 15:00', status: '已完成' },
  { id: 4, deviceNo: 'DEV004', deviceName: '监控摄像头', type: '定期保养', content: '清洁镜头、检查录像功能', staff: '赵六', planTime: '2025-11-26 16:00', status: '已完成' },
  { id: 5, deviceNo: 'DEV005', deviceName: '油烟机', type: '专项保养', content: '深度清洁、更换滤网', staff: '张三', planTime: '2025-11-29 09:00', status: '待保养' },
  { id: 6, deviceNo: 'DEV006', deviceName: '冷冻柜', type: '定期保养', content: '除霜、检查密封条', staff: '李四', planTime: '2025-11-28 11:00', status: '保养中' },
  { id: 7, deviceNo: 'DEV007', deviceName: '洗碗机', type: '日常保养', content: '清洁过滤器、检查喷淋臂', staff: '孙七', planTime: '2025-11-27 14:00', status: '已完成' },
  { id: 8, deviceNo: 'DEV008', deviceName: '紫外线消毒灯', type: '定期保养', content: '更换灯管、检查定时器', staff: '王五', planTime: '2025-11-30 10:00', status: '待保养' },
  { id: 9, deviceNo: 'DEV009', deviceName: '电磁炉', type: '专项保养', content: '检查电路、测试功率', staff: '周八', planTime: '2025-11-25 13:00', status: '已完成' },
  { id: 10, deviceNo: 'DEV010', deviceName: '保鲜柜', type: '日常保养', content: '清洁内部、检查温控', staff: '李四', planTime: '2025-11-28 15:00', status: '待保养' }
])

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    ElMessage.success('搜索完成')
    loading.value = false
  }, 500)
}

const handleReset = () => {
  searchForm.device = ''
  searchForm.type = ''
  searchForm.status = ''
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
    '日常保养': 'success',
    '定期保养': 'primary',
    '专项保养': 'warning'
  }
  return colors[type] || 'info'
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    '待保养': 'info',
    '保养中': 'warning',
    '已完成': 'success'
  }
  return colors[status] || 'info'
}
</script>

<style scoped>
.maintenance-view {
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
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 16px;
}

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

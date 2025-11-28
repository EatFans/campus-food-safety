<template>
  <div class="repair-view">
    <div class="page-header">
      <div class="header-left">
        <h2>维修记录</h2>
        <span class="subtitle">共 {{ pagination.total }} 条记录</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large">添加维修</el-button>
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
            <el-form-item label="故障类型">
              <el-select v-model="searchForm.faultType" placeholder="请选择类型" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="电路故障" value="电路故障" />
                <el-option label="机械故障" value="机械故障" />
                <el-option label="系统故障" value="系统故障" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="维修状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="待维修" value="待维修" />
                <el-option label="维修中" value="维修中" />
                <el-option label="已完成" value="已完成" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="报修时间">
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
        <div class="toolbar-right">
          <el-tooltip content="刷新" placement="top">
            <el-button circle :icon="Refresh" @click="handleRefresh" />
          </el-tooltip>
        </div>
      </div>

      <el-table :data="repairs" style="width: 100%" v-loading="loading" stripe border>
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="维修单号" prop="repairNo" width="150" show-overflow-tooltip>
          <template #default="{ row }">
            <el-text type="primary">{{ row.repairNo }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="设备编号" prop="deviceNo" width="120" />
        <el-table-column label="设备名称" prop="deviceName" width="150" />
        <el-table-column label="故障类型" prop="faultType" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getFaultTypeColor(row.faultType)" size="small">{{ row.faultType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="故障描述" prop="faultDesc" min-width="200" show-overflow-tooltip />
        <el-table-column label="维修人员" prop="repairStaff" width="100" />
        <el-table-column label="维修费用" width="120" align="right">
          <template #default="{ row }">
            <span class="cost-text">¥{{ row.cost }}</span>
          </template>
        </el-table-column>
        <el-table-column label="报修时间" prop="reportTime" width="180" />
        <el-table-column label="维修状态" width="100" align="center">
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
import { Search, Plus, Refresh, Download, Edit, View, CircleCheck } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)

const searchForm = reactive({
  device: '',
  faultType: '',
  status: '',
  dateRange: []
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 52
})

const repairs = ref([
  { id: 1, repairNo: 'REP202511280001', deviceNo: 'DEV005', deviceName: '油烟机', faultType: '机械故障', faultDesc: '风扇不转,噪音大', repairStaff: '张三', cost: '350.00', reportTime: '2025-11-28 08:00', status: '维修中' },
  { id: 2, repairNo: 'REP202511270001', deviceNo: 'DEV009', deviceName: '电磁炉', faultType: '电路故障', faultDesc: '无法加热,显示屏不亮', repairStaff: '周八', cost: '280.00', reportTime: '2025-11-27 14:30', status: '已完成' },
  { id: 3, repairNo: 'REP202511270002', deviceNo: 'DEV003', deviceName: '消毒柜', faultType: '系统故障', faultDesc: '温度无法达标', repairStaff: '王五', cost: '420.00', reportTime: '2025-11-27 10:15', status: '已完成' },
  { id: 4, repairNo: 'REP202511260001', deviceNo: 'DEV002', deviceName: '冷藏柜', faultType: '机械故障', faultDesc: '制冷效果差', repairStaff: '李四', cost: '680.00', reportTime: '2025-11-26 16:00', status: '已完成' },
  { id: 5, repairNo: 'REP202511260002', deviceNo: 'DEV004', deviceName: '监控摄像头', faultType: '系统故障', faultDesc: '画面模糊,无法录像', repairStaff: '赵六', cost: '520.00', reportTime: '2025-11-26 11:30', status: '已完成' },
  { id: 6, repairNo: 'REP202511250001', deviceNo: 'DEV007', deviceName: '洗碗机', faultType: '电路故障', faultDesc: '漏电保护器跳闸', repairStaff: '孙七', cost: '380.00', reportTime: '2025-11-25 15:20', status: '已完成' },
  { id: 7, repairNo: 'REP202511250002', deviceNo: 'DEV001', deviceName: '商用燃气灶', faultType: '其他', faultDesc: '燃气泄漏', repairStaff: '张三', cost: '560.00', reportTime: '2025-11-25 09:45', status: '已完成' },
  { id: 8, repairNo: 'REP202511240001', deviceNo: 'DEV006', deviceName: '冷冻柜', faultType: '机械故障', faultDesc: '压缩机异响', repairStaff: '李四', cost: '850.00', reportTime: '2025-11-24 13:00', status: '已完成' },
  { id: 9, repairNo: 'REP202511240002', deviceNo: 'DEV008', deviceName: '紫外线消毒灯', faultType: '电路故障', faultDesc: '灯管不亮', repairStaff: '王五', cost: '180.00', reportTime: '2025-11-24 10:30', status: '已完成' },
  { id: 10, repairNo: 'REP202511230001', deviceNo: 'DEV010', deviceName: '保鲜柜', faultType: '系统故障', faultDesc: '温控失灵', repairStaff: '李四', cost: '320.00', reportTime: '2025-11-23 14:15', status: '已完成' }
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
  searchForm.faultType = ''
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

const getFaultTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    '电路故障': 'danger',
    '机械故障': 'warning',
    '系统故障': 'primary',
    '其他': 'info'
  }
  return colors[type] || 'info'
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    '待维修': 'info',
    '维修中': 'warning',
    '已完成': 'success'
  }
  return colors[status] || 'info'
}
</script>

<style scoped>
.repair-view {
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

.cost-text {
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

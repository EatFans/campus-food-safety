<template>
  <div class="logistics-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-icon">
          <el-icon :size="24"><Van /></el-icon>
        </div>
        <div class="header-content">
          <h2>物流环节信息管理</h2>
          <p class="header-desc">记录运输车辆、司机信息、运输温度、配送时间等物流信息</p>
        </div>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增记录</el-button>
        <el-button :icon="Download">导出数据</el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stats-cards">
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card-blue">
          <div class="stat-icon">
            <el-icon :size="32"><Van /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.total }}</div>
            <div class="stat-label">物流记录总数</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card-green">
          <div class="stat-icon">
            <el-icon :size="32"><CircleCheck /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.delivered }}</div>
            <div class="stat-label">已送达</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card-orange">
          <div class="stat-icon">
            <el-icon :size="32"><Clock /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.inTransit }}</div>
            <div class="stat-label">运输中</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card stat-card-cyan">
          <div class="stat-icon">
            <el-icon :size="32"><Calendar /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.today }}</div>
            <div class="stat-label">今日配送</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 搜索区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="运单号">
          <el-input 
            v-model="searchForm.orderNo" 
            placeholder="请输入运单号" 
            clearable 
            :prefix-icon="Search"
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="车牌号">
          <el-input 
            v-model="searchForm.vehicleNo" 
            placeholder="请输入车牌号" 
            clearable 
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable style="width: 120px">
            <el-option label="已送达" value="delivered" />
            <el-option label="运输中" value="in_transit" />
            <el-option label="待发货" value="pending" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card shadow="never" class="table-card">
      <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="orderNo" label="运单号" width="150" />
        <el-table-column prop="vehicleNo" label="车牌号" width="100" />
        <el-table-column prop="driver" label="司机" width="100" />
        <el-table-column prop="phone" label="联系电话" width="120" />
        <el-table-column prop="origin" label="起点" width="120" />
        <el-table-column prop="destination" label="终点" width="120" />
        <el-table-column prop="departTime" label="发车时间" width="150" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="View" @click="handleView(row)">查看</el-button>
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Plus, Download, Search, Refresh, View, Edit, Delete, Van, CircleCheck, Clock, Calendar } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 统计数据
const statistics = reactive({
  total: 1568,
  delivered: 1520,
  inTransit: 35,
  today: 87
})

// 搜索表单
const searchForm = reactive({
  orderNo: '',
  vehicleNo: '',
  status: ''
})

const loading = ref(false)

const tableData = ref([
  {
    id: 1,
    orderNo: 'WL20241204001',
    vehicleNo: '京A12345',
    driver: '张师傅',
    phone: '138-0000-1111',
    origin: '配送中心',
    destination: '第一食堂',
    departTime: '2024-12-04 06:00',
    status: '已送达'
  },
  {
    id: 2,
    orderNo: 'WL20241204002',
    vehicleNo: '京B67890',
    driver: '李师傅',
    phone: '139-0000-2222',
    origin: '配送中心',
    destination: '第二食堂',
    departTime: '2024-12-04 06:30',
    status: '运输中'
  },
  {
    id: 3,
    orderNo: 'WL20241204003',
    vehicleNo: '京C11111',
    driver: '王师傅',
    phone: '136-0000-3333',
    origin: '配送中心',
    destination: '第三食堂',
    departTime: '2024-12-04 07:00',
    status: '已送达'
  }
])

const pagination = reactive({
  page: 1,
  size: 10,
  total: 3
})

const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    '已送达': 'success',
    '运输中': 'warning',
    '待发货': 'info'
  }
  return map[status] || 'info'
}

const handleAdd = () => {
  ElMessage.info('打开新增对话框')
}

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    ElMessage.success('查询成功')
    loading.value = false
  }, 500)
}

const handleReset = () => {
  searchForm.orderNo = ''
  searchForm.vehicleNo = ''
  searchForm.status = ''
}

const handleView = (row: any) => {
  ElMessage.info(`查看物流记录: ${row.orderNo}`)
}

const handleEdit = (row: any) => {
  ElMessage.info(`编辑物流记录: ${row.orderNo}`)
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除物流记录"${row.orderNo}"吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
  })
}
</script>

<style scoped>
.logistics-view {
  padding: 24px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e8f4ff;
  border-radius: 10px;
  color: #409EFF;
}

.header-content h2 {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.header-desc {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 统计卡片 */
.stats-cards {
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  cursor: pointer;
  border-left: 4px solid transparent;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

.stat-card-blue {
  border-left-color: #409EFF;
}

.stat-card-blue .stat-icon {
  background: #e8f4ff;
  color: #409EFF;
}

.stat-card-green {
  border-left-color: #67C23A;
}

.stat-card-green .stat-icon {
  background: #e8f8e8;
  color: #67C23A;
}

.stat-card-orange {
  border-left-color: #E6A23C;
}

.stat-card-orange .stat-icon {
  background: #fef3e8;
  color: #E6A23C;
}

.stat-card-cyan {
  border-left-color: #17a2b8;
}

.stat-card-cyan .stat-icon {
  background: #e8f8fa;
  color: #17a2b8;
}

.stat-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
}

/* 搜索卡片 */
.search-card {
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.search-form {
  margin: 0;
}

.search-form :deep(.el-form-item) {
  margin-bottom: 0;
}

.search-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #374151;
}

/* 表格卡片 */
.table-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.table-card :deep(.el-table) {
  font-size: 14px;
}

.table-card :deep(.el-table th) {
  background: #f9fafb;
  color: #374151;
  font-weight: 600;
}

.table-card :deep(.el-table td),
.table-card :deep(.el-table th) {
  padding: 14px 0;
}

.table-card :deep(.el-table__row:hover) {
  background: #f9fafb;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-button.is-link) {
  padding: 4px 8px;
  font-size: 13px;
}
</style>

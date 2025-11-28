<template>
  <div class="points-manage-view">
    <div class="page-header">
      <div class="header-left">
        <h2>积分管理</h2>
        <span class="subtitle">共 {{ pagination.total }} 条积分记录</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large">积分调整</el-button>
    </div>

    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="会员姓名">
              <el-input v-model="searchForm.name" placeholder="请输入会员姓名" clearable size="large" :prefix-icon="Search" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="变动类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="消费获得" value="消费获得" />
                <el-option label="签到获得" value="签到获得" />
                <el-option label="兑换消耗" value="兑换消耗" />
                <el-option label="过期扣除" value="过期扣除" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="积分变动">
              <el-select v-model="searchForm.change" placeholder="请选择" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="增加" value="增加" />
                <el-option label="减少" value="减少" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="变动时间">
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
          <el-button :icon="Download" :disabled="selectedIds.length === 0">批量导出</el-button>
        </div>
        <div class="toolbar-right">
          <el-tooltip content="刷新" placement="top">
            <el-button circle :icon="Refresh" @click="handleRefresh" />
          </el-tooltip>
        </div>
      </div>

      <el-table :data="points" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange" stripe border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="会员姓名" prop="memberName" width="120" />
        <el-table-column label="手机号" prop="phone" width="130" />
        <el-table-column label="变动类型" prop="type" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="积分变动" width="120" align="center">
          <template #default="{ row }">
            <el-text :type="row.change > 0 ? 'success' : 'danger'" style="font-weight: 600;">
              {{ row.change > 0 ? '+' : '' }}{{ row.change }}
            </el-text>
          </template>
        </el-table-column>
        <el-table-column label="当前积分" width="100" align="center">
          <template #default="{ row }">
            <el-text type="warning">{{ row.currentPoints }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="变动说明" prop="description" min-width="200" show-overflow-tooltip />
        <el-table-column label="变动时间" prop="changeTime" width="180" />
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
import { Search, Plus, Refresh, Download, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const selectedIds = ref<number[]>([])

const searchForm = reactive({
  name: '',
  type: '',
  change: '',
  dateRange: []
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 285
})

const points = ref([
  { id: 1, memberName: '张三', phone: '13800138001', type: '消费获得', change: 128, currentPoints: 2580, description: '订单消费获得积分', changeTime: '2025-11-28 10:30' },
  { id: 2, memberName: '李四', phone: '13800138002', type: '签到获得', change: 10, currentPoints: 1256, description: '每日签到获得积分', changeTime: '2025-11-28 09:00' },
  { id: 3, memberName: '王五', phone: '13800138003', type: '兑换消耗', change: -500, currentPoints: 5680, description: '兑换商品消耗积分', changeTime: '2025-11-28 08:45' },
  { id: 4, memberName: '赵六', phone: '13800138004', type: '消费获得', change: 56, currentPoints: 568, description: '订单消费获得积分', changeTime: '2025-11-28 08:30' },
  { id: 5, memberName: '孙七', phone: '13800138005', type: '签到获得', change: 10, currentPoints: 3256, description: '每日签到获得积分', changeTime: '2025-11-28 08:15' },
  { id: 6, memberName: '周八', phone: '13800138006', type: '消费获得', change: 95, currentPoints: 1568, description: '订单消费获得积分', changeTime: '2025-11-27 16:30' },
  { id: 7, memberName: '吴九', phone: '13800138007', type: '过期扣除', change: -50, currentPoints: 256, description: '积分过期自动扣除', changeTime: '2025-11-27 00:00' },
  { id: 8, memberName: '郑十', phone: '13800138008', type: '消费获得', change: 165, currentPoints: 2856, description: '订单消费获得积分', changeTime: '2025-11-26 15:20' },
  { id: 9, memberName: '钱一', phone: '13800138009', type: '兑换消耗', change: -1000, currentPoints: 6580, description: '兑换优惠券消耗积分', changeTime: '2025-11-26 14:10' },
  { id: 10, memberName: '陈二', phone: '13800138010', type: '签到获得', change: 10, currentPoints: 1856, description: '每日签到获得积分', changeTime: '2025-11-26 09:00' }
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
  searchForm.change = ''
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
    '消费获得': 'success',
    '签到获得': 'primary',
    '兑换消耗': 'warning',
    '过期扣除': 'danger'
  }
  return colors[type] || 'info'
}
</script>

<style scoped>
.points-manage-view {
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

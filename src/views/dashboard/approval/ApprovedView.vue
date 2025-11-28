<template>
  <div class="approved-view">
    <div class="page-header">
      <div class="header-left">
        <h2>已审批</h2>
        <span class="subtitle">共 {{ pagination.total }} 条已审批</span>
      </div>
    </div>

    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="申请人">
              <el-input v-model="searchForm.applicant" placeholder="请输入申请人" clearable size="large" :prefix-icon="Search" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="审批类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="请假申请" value="请假申请" />
                <el-option label="加班申请" value="加班申请" />
                <el-option label="采购申请" value="采购申请" />
                <el-option label="报销申请" value="报销申请" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="审批结果">
              <el-select v-model="searchForm.result" placeholder="请选择结果" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="已通过" value="已通过" />
                <el-option label="已拒绝" value="已拒绝" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="审批时间">
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

      <el-table :data="approvals" style="width: 100%" v-loading="loading" stripe border>
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="审批编号" prop="approvalNo" width="150" show-overflow-tooltip>
          <template #default="{ row }">
            <el-text type="primary">{{ row.approvalNo }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="审批类型" prop="type" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="申请人" prop="applicant" width="120" />
        <el-table-column label="所属部门" prop="department" width="120" />
        <el-table-column label="申请内容" prop="content" min-width="200" show-overflow-tooltip />
        <el-table-column label="审批结果" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.result === '已通过' ? 'success' : 'danger'" effect="dark">{{ row.result }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="审批时间" prop="approvalTime" width="180" />
        <el-table-column label="审批意见" prop="opinion" min-width="150" show-overflow-tooltip />
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
  applicant: '',
  type: '',
  result: '',
  dateRange: []
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 156
})

const approvals = ref([
  { id: 1, approvalNo: 'AP202511270001', type: '请假申请', applicant: '张三', department: '厨房部', content: '因病请假2天', result: '已通过', approvalTime: '2025-11-27 10:00', opinion: '同意请假,注意休息' },
  { id: 2, approvalNo: 'AP202511270002', type: '加班申请', applicant: '李四', department: '服务部', content: '周末活动加班8小时', result: '已通过', approvalTime: '2025-11-27 09:45', opinion: '同意加班' },
  { id: 3, approvalNo: 'AP202511270003', type: '采购申请', applicant: '王五', department: '采购部', content: '紧急采购食材', result: '已拒绝', approvalTime: '2025-11-27 09:30', opinion: '预算不足,暂不批准' },
  { id: 4, approvalNo: 'AP202511270004', type: '报销申请', applicant: '赵六', department: '管理部', content: '差旅费报销', result: '已通过', approvalTime: '2025-11-27 09:15', opinion: '符合报销标准' },
  { id: 5, approvalNo: 'AP202511260001', type: '请假申请', applicant: '孙七', department: '厨房部', content: '家中有事请假1天', result: '已通过', approvalTime: '2025-11-26 16:30', opinion: '同意' },
  { id: 6, approvalNo: 'AP202511260002', type: '加班申请', applicant: '周八', department: '服务部', content: '工作日加班3小时', result: '已通过', approvalTime: '2025-11-26 15:45', opinion: '同意加班' },
  { id: 7, approvalNo: 'AP202511260003', type: '采购申请', applicant: '吴九', department: '采购部', content: '月度食材采购', result: '已通过', approvalTime: '2025-11-26 15:00', opinion: '按计划采购' },
  { id: 8, approvalNo: 'AP202511260004', type: '报销申请', applicant: '郑十', department: '管理部', content: '办公用品采购报销', result: '已拒绝', approvalTime: '2025-11-26 14:30', opinion: '发票不全' },
  { id: 9, approvalNo: 'AP202511260005', type: '请假申请', applicant: '钱一', department: '厨房部', content: '年假申请5天', result: '已通过', approvalTime: '2025-11-26 14:00', opinion: '同意年假' },
  { id: 10, approvalNo: 'AP202511260006', type: '加班申请', applicant: '陈二', department: '服务部', content: '活动准备加班', result: '已通过', approvalTime: '2025-11-26 13:30', opinion: '同意' }
])

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    ElMessage.success('搜索完成')
    loading.value = false
  }, 500)
}

const handleReset = () => {
  searchForm.applicant = ''
  searchForm.type = ''
  searchForm.result = ''
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
    '请假申请': 'primary',
    '加班申请': 'warning',
    '采购申请': 'success',
    '报销申请': 'info'
  }
  return colors[type] || 'info'
}
</script>

<style scoped>
.approved-view {
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

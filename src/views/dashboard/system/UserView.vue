<template>
  <div class="user-view">
    <div class="page-header">
      <div class="header-left">
        <h2>用户管理</h2>
        <span class="subtitle">共 {{ pagination.total }} 个用户</span>
      </div>
      <el-button type="primary" :icon="Plus" size="large">添加用户</el-button>
    </div>

    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="用户名">
              <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable size="large" :prefix-icon="Search" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="角色">
              <el-select v-model="searchForm.role" placeholder="请选择角色" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="管理员" value="管理员" />
                <el-option label="普通用户" value="普通用户" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="启用" value="启用" />
                <el-option label="禁用" value="禁用" />
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

      <el-table :data="users" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange" stripe border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="用户名" prop="username" width="150" />
        <el-table-column label="姓名" prop="name" width="120" />
        <el-table-column label="角色" prop="role" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="row.role === '管理员' ? 'danger' : 'primary'" size="small">{{ row.role }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="phone" width="130" />
        <el-table-column label="邮箱" prop="email" width="200" />
        <el-table-column label="最后登录" prop="lastLogin" width="180" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : 'danger'" effect="dark">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="primary" size="small" :icon="Edit">编辑</el-button>
            <el-button link type="warning" size="small" :icon="Key">重置密码</el-button>
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
import { Search, Plus, Refresh, Delete, Edit, Key } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const selectedIds = ref<number[]>([])

const searchForm = reactive({
  username: '',
  role: '',
  status: ''
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 25
})

const users = ref([
  { id: 1, username: 'admin', name: '系统管理员', role: '管理员', phone: '13800138000', email: 'admin@example.com', lastLogin: '2025-11-28 10:30', status: '启用' },
  { id: 2, username: 'zhangsan', name: '张三', role: '普通用户', phone: '13800138001', email: 'zhangsan@example.com', lastLogin: '2025-11-28 09:15', status: '启用' },
  { id: 3, username: 'lisi', name: '李四', role: '普通用户', phone: '13800138002', email: 'lisi@example.com', lastLogin: '2025-11-27 18:20', status: '启用' },
  { id: 4, username: 'wangwu', name: '王五', role: '普通用户', phone: '13800138003', email: 'wangwu@example.com', lastLogin: '2025-11-27 16:45', status: '禁用' },
  { id: 5, username: 'zhaoliu', name: '赵六', role: '普通用户', phone: '13800138004', email: 'zhaoliu@example.com', lastLogin: '2025-11-28 08:30', status: '启用' },
  { id: 6, username: 'sunqi', name: '孙七', role: '普通用户', phone: '13800138005', email: 'sunqi@example.com', lastLogin: '2025-11-27 20:10', status: '启用' },
  { id: 7, username: 'zhouba', name: '周八', role: '普通用户', phone: '13800138006', email: 'zhouba@example.com', lastLogin: '2025-11-28 07:50', status: '启用' },
  { id: 8, username: 'wujiu', name: '吴九', role: '普通用户', phone: '13800138007', email: 'wujiu@example.com', lastLogin: '2025-11-27 19:30', status: '启用' },
  { id: 9, username: 'zhengshi', name: '郑十', role: '普通用户', phone: '13800138008', email: 'zhengshi@example.com', lastLogin: '2025-11-28 09:00', status: '启用' },
  { id: 10, username: 'qianyi', name: '钱一', role: '管理员', phone: '13800138009', email: 'qianyi@example.com', lastLogin: '2025-11-28 10:00', status: '启用' }
])

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    ElMessage.success('搜索完成')
    loading.value = false
  }, 500)
}

const handleReset = () => {
  searchForm.username = ''
  searchForm.role = ''
  searchForm.status = ''
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
</script>

<style scoped>
.user-view {
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

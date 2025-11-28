<template>
  <div class="log-view">
    <div class="page-header">
      <h2>操作日志</h2>
    </div>

    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="操作人">
              <el-input v-model="searchForm.operator" placeholder="请输入操作人" clearable size="large" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="操作类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" clearable size="large" style="width: 100%;">
                <el-option label="全部" value="" />
                <el-option label="登录" value="登录" />
                <el-option label="新增" value="新增" />
                <el-option label="修改" value="修改" />
                <el-option label="删除" value="删除" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="操作时间">
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
      <el-table :data="logs" style="width: 100%" v-loading="loading" stripe border>
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="操作人" prop="operator" width="120" />
        <el-table-column label="操作类型" prop="type" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作模块" prop="module" width="150" />
        <el-table-column label="操作内容" prop="content" min-width="200" show-overflow-tooltip />
        <el-table-column label="IP地址" prop="ip" width="140" />
        <el-table-column label="操作时间" prop="time" width="180" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '成功' ? 'success' : 'danger'" effect="dark">{{ row.status }}</el-tag>
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
import { Search, Refresh, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)

const searchForm = reactive({
  operator: '',
  type: '',
  dateRange: []
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 156
})

const logs = ref([
  { id: 1, operator: '张三', type: '登录', module: '系统登录', content: '用户登录系统', ip: '192.168.1.100', time: '2025-11-28 10:30', status: '成功' },
  { id: 2, operator: '李四', type: '新增', module: '用户管理', content: '新增用户: 王五', ip: '192.168.1.101', time: '2025-11-28 10:25', status: '成功' },
  { id: 3, operator: '王五', type: '修改', module: '员工管理', content: '修改员工信息', ip: '192.168.1.102', time: '2025-11-28 10:20', status: '成功' },
  { id: 4, operator: '赵六', type: '删除', module: '角色管理', content: '删除角色: 测试角色', ip: '192.168.1.103', time: '2025-11-28 10:15', status: '成功' },
  { id: 5, operator: '孙七', type: '登录', module: '系统登录', content: '用户登录系统', ip: '192.168.1.104', time: '2025-11-28 10:10', status: '失败' },
  { id: 6, operator: '周八', type: '修改', module: '菜单管理', content: '修改菜单配置', ip: '192.168.1.105', time: '2025-11-28 10:05', status: '成功' },
  { id: 7, operator: '吴九', type: '新增', module: '权限管理', content: '新增权限配置', ip: '192.168.1.106', time: '2025-11-28 10:00', status: '成功' },
  { id: 8, operator: '郑十', type: '登录', module: '系统登录', content: '用户登录系统', ip: '192.168.1.107', time: '2025-11-28 09:55', status: '成功' },
  { id: 9, operator: '钱一', type: '修改', module: '系统设置', content: '修改系统参数', ip: '192.168.1.108', time: '2025-11-28 09:50', status: '成功' },
  { id: 10, operator: '陈二', type: '删除', module: '数据字典', content: '删除字典项', ip: '192.168.1.109', time: '2025-11-28 09:45', status: '成功' }
])

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    ElMessage.success('搜索完成')
    loading.value = false
  }, 500)
}

const handleReset = () => {
  searchForm.operator = ''
  searchForm.type = ''
  searchForm.dateRange = []
  handleSearch()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
}

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    '登录': 'primary',
    '新增': 'success',
    '修改': 'warning',
    '删除': 'danger'
  }
  return colors[type] || 'info'
}
</script>

<style scoped>
.log-view {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header h2 {
  margin: 0 0 16px 0;
  font-size: 22px;
  font-weight: 600;
  color: #303133;
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
</style>

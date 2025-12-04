<template>
  <div class="canteen-info-view">
    <div class="page-header">
      <h2>食堂基本信息管理</h2>
      <el-space>
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增食堂</el-button>
        <el-button :icon="Download">导出数据</el-button>
      </el-space>
    </div>

    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="食堂名称">
          <el-input v-model="searchForm.name" placeholder="请输入食堂名称" clearable />
        </el-form-item>
        <el-form-item label="所属学校">
          <el-select v-model="searchForm.schoolId" placeholder="请选择" clearable>
            <el-option label="阳光小学" value="1" />
            <el-option label="实验中学" value="2" />
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
        <el-table-column prop="name" label="食堂名称" min-width="120" />
        <el-table-column prop="schoolName" label="所属学校" min-width="120" />
        <el-table-column prop="location" label="位置" min-width="150" />
        <el-table-column prop="area" label="面积(㎡)" width="100" />
        <el-table-column prop="license" label="资质证书" width="120">
          <template #default="{ row }">
            <el-tag :type="row.license ? 'success' : 'danger'">
              {{ row.license ? '已上传' : '未上传' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '营业中' ? 'success' : 'info'">
              {{ row.status }}
            </el-tag>
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
import { Plus, Download, Search, Refresh, View, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({
  name: '',
  schoolId: ''
})

const tableData = ref([
  {
    id: 1,
    name: '第一食堂',
    schoolName: '阳光小学',
    location: '教学楼东侧',
    area: '500',
    license: true,
    status: '营业中'
  },
  {
    id: 2,
    name: '第二食堂',
    schoolName: '阳光小学',
    location: '宿舍楼一层',
    area: '400',
    license: true,
    status: '营业中'
  },
  {
    id: 3,
    name: '教工食堂',
    schoolName: '实验中学',
    location: '行政楼二层',
    area: '300',
    license: false,
    status: '装修中'
  }
])

const loading = ref(false)

const pagination = reactive({
  page: 1,
  size: 10,
  total: 3
})

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    ElMessage.success('查询成功')
    loading.value = false
  }, 500)
}

const handleReset = () => {
  searchForm.name = ''
  searchForm.schoolId = ''
}

const handleAdd = () => {
  ElMessage.info('打开新增对话框')
}

const handleView = (row: any) => {
  ElMessage.info(`查看食堂: ${row.name}`)
}

const handleEdit = (row: any) => {
  ElMessage.info(`编辑食堂: ${row.name}`)
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除食堂"${row.name}"吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
  })
}
</script>

<style scoped>
.canteen-info-view {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.search-card,
.table-card {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>

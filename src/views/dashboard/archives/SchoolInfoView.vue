<template>
  <div class="school-info-view">
    <div class="page-header">
      <h2>学校基本信息管理</h2>
      <el-space>
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增学校</el-button>
        <el-button :icon="Download">导出数据</el-button>
      </el-space>
    </div>

    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="学校名称">
          <el-input v-model="searchForm.name" placeholder="请输入学校名称" clearable />
        </el-form-item>
        <el-form-item label="学校类型">
          <el-select v-model="searchForm.type" placeholder="请选择" clearable>
            <el-option label="小学" value="primary" />
            <el-option label="初中" value="middle" />
            <el-option label="高中" value="high" />
            <el-option label="大学" value="university" />
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
        <el-table-column prop="name" label="学校名称" min-width="150" />
        <el-table-column prop="type" label="学校类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getTypeTag(row.type)">{{ getTypeName(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="学校地址" min-width="200" />
        <el-table-column prop="scale" label="学校规模" width="100" />
        <el-table-column prop="contact" label="联系人" width="100" />
        <el-table-column prop="phone" label="联系电话" width="120" />
        <el-table-column prop="createTime" label="创建时间" width="160" />
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
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="学校名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入学校名称" />
        </el-form-item>
        <el-form-item label="学校类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择学校类型" style="width: 100%">
            <el-option label="小学" value="primary" />
            <el-option label="初中" value="middle" />
            <el-option label="高中" value="high" />
            <el-option label="大学" value="university" />
          </el-select>
        </el-form-item>
        <el-form-item label="学校地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入学校地址" />
        </el-form-item>
        <el-form-item label="学校规模" prop="scale">
          <el-input v-model="form.scale" placeholder="如:3000人" />
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="form.contact" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Plus, Download, Search, Refresh, View, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

// 搜索表单
const searchForm = reactive({
  name: '',
  type: ''
})

// 表格数据
const tableData = ref([
  {
    id: 1,
    name: '阳光小学',
    type: 'primary',
    address: '北京市朝阳区建国路88号',
    scale: '2000人',
    contact: '张校长',
    phone: '010-12345678',
    createTime: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    name: '实验中学',
    type: 'middle',
    address: '北京市海淀区中关村大街100号',
    scale: '3500人',
    contact: '李主任',
    phone: '010-87654321',
    createTime: '2024-02-20 14:20:00'
  },
  {
    id: 3,
    name: '第一高级中学',
    type: 'high',
    address: '北京市西城区复兴门内大街1号',
    scale: '4000人',
    contact: '王校长',
    phone: '010-11223344',
    createTime: '2024-03-10 09:15:00'
  }
])

const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  size: 10,
  total: 3
})

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增学校')
const formRef = ref<FormInstance>()

// 表单数据
const form = reactive({
  id: null,
  name: '',
  type: '',
  address: '',
  scale: '',
  contact: '',
  phone: ''
})

// 表单验证规则
const rules: FormRules = {
  name: [{ required: true, message: '请输入学校名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择学校类型', trigger: 'change' }],
  address: [{ required: true, message: '请输入学校地址', trigger: 'blur' }],
  contact: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$|^0\d{2,3}-?\d{7,8}$/, message: '请输入正确的电话号码', trigger: 'blur' }
  ]
}

// 获取类型标签
const getTypeTag = (type: string) => {
  const map: Record<string, any> = {
    primary: 'success',
    middle: 'primary',
    high: 'warning',
    university: 'danger'
  }
  return map[type] || 'info'
}

// 获取类型名称
const getTypeName = (type: string) => {
  const map: Record<string, string> = {
    primary: '小学',
    middle: '初中',
    high: '高中',
    university: '大学'
  }
  return map[type] || type
}

// 查询
const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    ElMessage.success('查询成功')
    loading.value = false
  }, 500)
}

// 重置
const handleReset = () => {
  searchForm.name = ''
  searchForm.type = ''
  handleSearch()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增学校'
  dialogVisible.value = true
}

// 查看
const handleView = (row: any) => {
  ElMessage.info(`查看学校: ${row.name}`)
}

// 编辑
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑学校'
  Object.assign(form, row)
  dialogVisible.value = true
}

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除学校"${row.name}"吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
  })
}

// 提交表单
const handleSubmit = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      ElMessage.success(dialogTitle.value === '新增学校' ? '新增成功' : '编辑成功')
      dialogVisible.value = false
    }
  })
}

// 关闭对话框
const handleDialogClose = () => {
  formRef.value?.resetFields()
  form.id = null
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.size = size
  handleSearch()
}

const handlePageChange = (page: number) => {
  pagination.page = page
  handleSearch()
}

onMounted(() => {
  // 初始化数据
})
</script>

<style scoped>
.school-info-view {
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

.search-card {
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style>

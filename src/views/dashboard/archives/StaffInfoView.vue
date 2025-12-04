<template>
  <div class="staff-info-view">
    <div class="page-header">
      <h2>从业人员基本信息管理</h2>
      <el-space>
        <el-button type="primary" :icon="Plus">新增人员</el-button>
        <el-button :icon="Download">导出数据</el-button>
      </el-space>
    </div>

    <el-card shadow="never">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="gender" label="性别" width="60" />
        <el-table-column prop="age" label="年龄" width="60" />
        <el-table-column prop="position" label="岗位" width="100" />
        <el-table-column prop="canteen" label="所属食堂" width="120" />
        <el-table-column prop="healthCert" label="健康证" width="100">
          <template #default="{ row }">
            <el-tag :type="row.healthCertValid ? 'success' : 'danger'">
              {{ row.healthCertValid ? '有效' : '已过期' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="healthCertExpiry" label="健康证到期日" width="120" />
        <el-table-column prop="training" label="培训记录" width="100">
          <template #default="{ row }">
            <el-link type="primary">查看({{ row.trainingCount }}次)</el-link>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link>查看</el-button>
            <el-button type="primary" link>编辑</el-button>
            <el-button type="danger" link>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Download } from '@element-plus/icons-vue'

const tableData = ref([
  {
    id: 1,
    name: '张三',
    gender: '男',
    age: 35,
    position: '厨师长',
    canteen: '第一食堂',
    healthCertValid: true,
    healthCertExpiry: '2025-06-30',
    trainingCount: 5
  },
  {
    id: 2,
    name: '李四',
    gender: '女',
    age: 28,
    position: '配菜员',
    canteen: '第一食堂',
    healthCertValid: true,
    healthCertExpiry: '2025-03-15',
    trainingCount: 3
  },
  {
    id: 3,
    name: '王五',
    gender: '男',
    age: 42,
    position: '采购员',
    canteen: '第二食堂',
    healthCertValid: false,
    healthCertExpiry: '2024-11-20',
    trainingCount: 8
  }
])
</script>

<style scoped>
.staff-info-view {
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
}
</style>

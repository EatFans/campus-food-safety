<template>
  <div class="user-manage-view">
    <div class="page-header">
      <h2>用户管理</h2>
      <el-space>
        <el-input v-model="searchText" placeholder="搜索用户" :prefix-icon="Search" style="width: 200px;" />
        <el-button type="primary" :icon="Plus">添加用户</el-button>
      </el-space>
    </div>

    <el-card shadow="hover">
      <el-table :data="users" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column label="用户名" prop="username" width="150" />
        <el-table-column label="姓名" prop="realName" width="120" />
        <el-table-column label="角色" width="120">
          <template #default="{ row }">
            <el-tag>{{ row.role }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" prop="email" width="200" />
        <el-table-column label="手机号" prop="phone" width="130" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-switch v-model="row.status" active-text="启用" inactive-text="禁用" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default>
            <el-button link type="primary" size="small">编辑</el-button>
            <el-button link type="warning" size="small">重置密码</el-button>
            <el-button link type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'

const searchText = ref('')

const users = ref([
  { id: 1, username: 'admin', realName: '管理员', role: '超级管理员', email: 'admin@example.com', phone: '13800138000', status: true, createTime: '2023-01-01 00:00:00' },
  { id: 2, username: 'zhangsan', realName: '张三', role: '普通用户', email: 'zhangsan@example.com', phone: '13800138001', status: true, createTime: '2023-06-15 10:30:00' },
  { id: 3, username: 'lisi', realName: '李四', role: '普通用户', email: 'lisi@example.com', phone: '13800138002', status: true, createTime: '2023-08-20 14:20:00' },
  { id: 4, username: 'wangwu', realName: '王五', role: '审核员', email: 'wangwu@example.com', phone: '13800138003', status: false, createTime: '2023-10-10 09:00:00' }
])
</script>

<style scoped>
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

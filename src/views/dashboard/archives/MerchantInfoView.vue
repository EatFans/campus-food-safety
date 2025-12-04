<template>
  <div class="merchant-info-view">
    <div class="page-header">
      <h2>商家档案管理</h2>
      <el-space>
        <el-button type="primary" :icon="Plus">新增商家</el-button>
        <el-button :icon="Download">导出数据</el-button>
      </el-space>
    </div>

    <el-card shadow="never">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="name" label="供应商名称" min-width="150" />
        <el-table-column prop="type" label="经营范围" width="120" />
        <el-table-column prop="license" label="资质证书" width="100">
          <template #default="{ row }">
            <el-tag :type="row.license ? 'success' : 'warning'">
              {{ row.license ? '已认证' : '待认证' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="contact" label="联系人" width="100" />
        <el-table-column prop="phone" label="联系电话" width="120" />
        <el-table-column prop="rating" label="评价等级" width="100">
          <template #default="{ row }">
            <el-rate v-model="row.rating" disabled show-score />
          </template>
        </el-table-column>
        <el-table-column prop="cooperationTime" label="合作时间" width="120" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default>
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
    name: '绿源蔬菜供应公司',
    type: '蔬菜水果',
    license: true,
    contact: '刘经理',
    phone: '138-0000-1111',
    rating: 4.5,
    cooperationTime: '2023-01-15'
  },
  {
    id: 2,
    name: '鲜肉配送中心',
    type: '肉类禽蛋',
    license: true,
    contact: '陈经理',
    phone: '139-0000-2222',
    rating: 4.8,
    cooperationTime: '2022-08-20'
  },
  {
    id: 3,
    name: '粮油批发商行',
    type: '粮油调料',
    license: false,
    contact: '赵经理',
    phone: '136-0000-3333',
    rating: 4.2,
    cooperationTime: '2024-03-10'
  }
])
</script>

<style scoped>
.merchant-info-view {
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

<template>
  <div class="supermarket-goods-view">
    <div class="page-header">
      <h2>商品管理</h2>
      <el-space>
        <el-input v-model="searchText" placeholder="搜索商品" :prefix-icon="Search" style="width: 200px;" />
        <el-button type="primary" :icon="Plus">添加商品</el-button>
      </el-space>
    </div>

    <el-card shadow="hover">
      <el-table :data="goods" style="width: 100%">
        <el-table-column label="商品图片" width="100">
          <template #default>
            <el-image
              style="width: 60px; height: 60px; border-radius: 4px;"
              src="https://via.placeholder.com/60"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="name" />
        <el-table-column label="商品分类" prop="category" width="120" />
        <el-table-column label="价格" width="100">
          <template #default="{ row }">
            <span style="color: #f56c6c; font-weight: 600;">¥{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="库存" prop="stock" width="100" />
        <el-table-column label="供应商" prop="supplier" width="150" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-switch v-model="row.status" active-text="上架" inactive-text="下架" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default>
            <el-button link type="primary" size="small">编辑</el-button>
            <el-button link type="warning" size="small">补货</el-button>
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

const goods = ref([
  { id: 1, name: '新鲜鸡蛋', category: '蛋类', price: '12.80', stock: 500, supplier: '绿源农场', status: true },
  { id: 2, name: '有机蔬菜包', category: '蔬菜', price: '28.00', stock: 200, supplier: '有机农庄', status: true },
  { id: 3, name: '优质大米', category: '粮油', price: '45.00', stock: 150, supplier: '五常大米', status: true },
  { id: 4, name: '新鲜猪肉', category: '肉类', price: '38.00', stock: 80, supplier: '绿色养殖场', status: true }
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

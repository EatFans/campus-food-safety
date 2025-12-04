<template>
  <div class="production-view">
    <div class="page-header">
      <h2>生产环节信息管理</h2>
      <el-space>
        <el-button type="primary" :icon="Plus">新增记录</el-button>
        <el-button :icon="Download">导出数据</el-button>
      </el-space>
    </div>

    <el-card shadow="never">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="productName" label="产品名称" min-width="120" />
        <el-table-column prop="origin" label="产地" width="120" />
        <el-table-column prop="productionDate" label="生产日期" width="120" />
        <el-table-column prop="batchNo" label="批次号" width="150" />
        <el-table-column prop="testReport" label="检测报告" width="100">
          <template #default="{ row }">
            <el-link type="primary" v-if="row.testReport">查看</el-link>
            <el-tag type="info" v-else size="small">未上传</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
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
    productName: '有机西红柿',
    origin: '山东寿光',
    productionDate: '2024-12-01',
    batchNo: 'XHS20241201001',
    testReport: true,
    status: '合格'
  },
  {
    id: 2,
    productName: '鲜猪肉',
    origin: '河北保定',
    productionDate: '2024-12-03',
    batchNo: 'ZR20241203002',
    testReport: true,
    status: '合格'
  },
  {
    id: 3,
    productName: '大米',
    origin: '黑龙江五常',
    productionDate: '2024-11-20',
    batchNo: 'DM20241120003',
    testReport: false,
    status: '待检'
  }
])

const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    '合格': 'success',
    '待检': 'warning',
    '不合格': 'danger'
  }
  return map[status] || 'info'
}
</script>

<style scoped>
.production-view {
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

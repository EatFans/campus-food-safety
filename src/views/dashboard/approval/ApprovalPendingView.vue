<template>
  <div class="approval-pending-view">
    <div class="page-header">
      <h2>待审批</h2>
      <el-space>
        <el-select v-model="filterType" placeholder="审批类型" style="width: 150px;">
          <el-option label="全部类型" value="" />
          <el-option label="请假申请" value="leave" />
          <el-option label="报销申请" value="expense" />
          <el-option label="采购申请" value="purchase" />
        </el-select>
        <el-button type="primary" :icon="Check">批量审批</el-button>
      </el-space>
    </div>

    <el-row :gutter="16" class="stats-row">
      <el-col :xs="24" :sm="8">
        <el-card shadow="hover" class="stat-card urgent">
          <el-statistic title="紧急待审" :value="5">
            <template #prefix>
              <el-icon color="#F56C6C"><Clock /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="8">
        <el-card shadow="hover" class="stat-card normal">
          <el-statistic title="普通待审" :value="23">
            <template #prefix>
              <el-icon color="#409EFF"><Document /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="8">
        <el-card shadow="hover" class="stat-card today">
          <el-statistic title="今日已审" :value="12">
            <template #prefix>
              <el-icon color="#67C23A"><SuccessFilled /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="hover" style="margin-top: 16px;">
      <el-table :data="approvals" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column label="申请类型" width="120">
          <template #default="{ row }">
            <el-tag>{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="申请标题" prop="title" />
        <el-table-column label="申请人" prop="applicant" width="120" />
        <el-table-column label="申请时间" prop="applyTime" width="180" />
        <el-table-column label="紧急程度" width="100">
          <template #default="{ row }">
            <el-tag :type="row.urgent ? 'danger' : 'info'">
              {{ row.urgent ? '紧急' : '普通' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default>
            <el-button link type="primary" size="small">查看</el-button>
            <el-button link type="success" size="small">通过</el-button>
            <el-button link type="danger" size="small">驳回</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Check, Clock, Document, SuccessFilled } from '@element-plus/icons-vue'

const filterType = ref('')

const approvals = ref([
  { id: 1, type: '请假申请', title: '张三请假申请 - 事假2天', applicant: '张三', applyTime: '2025-11-28 08:30', urgent: true },
  { id: 2, type: '报销申请', title: '李四差旅费报销', applicant: '李四', applyTime: '2025-11-28 08:15', urgent: false },
  { id: 3, type: '采购申请', title: '厨房设备采购申请', applicant: '王五', applyTime: '2025-11-28 08:00', urgent: true },
  { id: 4, type: '请假申请', title: '赵六病假申请', applicant: '赵六', applyTime: '2025-11-27 17:30', urgent: false }
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

.stats-row {
  margin-top: 20px;
}

.stat-card {
  text-align: center;
}

.stat-card.urgent {
  border-left: 4px solid var(--el-color-danger);
}

.stat-card.normal {
  border-left: 4px solid var(--el-color-primary);
}

.stat-card.today {
  border-left: 4px solid var(--el-color-success);
}
</style>

<template>
  <div class="workplace-view">
    <div class="page-header">
      <h2>工作台</h2>
      <el-button type="primary">新建任务</el-button>
    </div>
    
    <el-row :gutter="16" class="stats-row">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="总访问量" :value="9105">
            <template #prefix>
              <el-icon><TrendCharts /></el-icon>
            </template>
          </el-statistic>
          <div class="stat-footer">
            <span>昨天</span>
            <el-tag type="success" size="small">+20%</el-tag>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="在线用户" :value="181">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-statistic>
          <div class="stat-footer">
            <span>昨天</span>
            <el-tag type="success" size="small">+18%</el-tag>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="总点击" :value="9504">
            <template #prefix>
              <el-icon><Mouse /></el-icon>
            </template>
          </el-statistic>
          <div class="stat-footer">
            <span>昨天</span>
            <el-tag type="danger" size="small">-12%</el-tag>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="新用户" :value="155">
            <template #prefix>
              <el-icon><UserFilled /></el-icon>
            </template>
          </el-statistic>
          <div class="stat-footer">
            <span>昨天</span>
            <el-tag type="success" size="small">+33%</el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
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
  height: 100%;
}

.stat-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
</style>

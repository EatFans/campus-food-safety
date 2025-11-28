<template>
  <div class="core-view">
    <div class="page-header">
      <h2>核心中心</h2>
      <p class="subtitle">系统核心功能管理</p>
    </div>
    <div class="content-card">
      <p>核心中心内容区域</p>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.core-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header h2 {
  margin: 0 0 8px 0;
  color: #262626;
  font-size: 24px;
  font-weight: 600;
}

.subtitle {
  margin: 0;
  color: #8c8c8c;
  font-size: 14px;
}

.content-card {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  border: 1px solid #f0f0f0;
  min-height: 400px;
}
</style>

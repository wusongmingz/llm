<template>
  <ACard class="title" :hidePadding="true" :bodyStyle="{ padding: '8px 20px' }">
    <div class="title-content">聚合商：{{ userStore.sysOrg?.displayName || '无数据' }}</div>
  </ACard>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
</script>

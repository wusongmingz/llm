<template>
  <el-card class="box-card" :class="props?.hidePadding ?? false ? 'hide-padding' : 'show-padding'" v-bind="props">
    <template #header v-if="$slots.header">
      <slot name="header"></slot>
    </template>
    <slot></slot>
  </el-card>
</template>

<script setup lang="ts">
import { CardProps } from 'element-plus';
interface ACardProps extends Partial<CardProps> {
  hidePadding?: boolean;
}

/**
 * @prop {boolean} hidePadding - 可选, 卡片内部没有内边距
 * @prop {CardProps} 支持 element plus 在 el-card 中所有属性
 */
const props = defineProps<ACardProps>();
</script>

<style lang="scss" scoped>
.box-card {
  transition: background-color var(--el-transition-duration);
  display: flex;
  flex-direction: column;
  border-radius: 15px;
  border: 1px solid #d7d7d7;
  :deep(.el-card__header) {
    padding: 10px 20px;
    background-color: var(--layout-main-bg-color);
    transition: background-color var(--el-transition-duration);
  }

  :deep(.el-card__body) {
    flex: 1;
    overflow-y: auto;
  }
}

.hide-padding {
  :deep(.el-card__body) {
    padding: 0;
  }
}

.show-padding {
  :deep(.el-card__body) {
    // padding: 10px;
  }
}

.el-card.is-always-shadow,
.el-card.is-hover-shadow:focus,
.el-card.is-hover-shadow:hover {
  box-shadow: none;
}
</style>

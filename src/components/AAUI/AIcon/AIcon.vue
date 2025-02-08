<template>
  <svg aria-hidden="true">
    <use :xlink:href="'#' + props.icon"></use>
  </svg>
</template>

<script setup lang="ts">
/**
 * @prop {string} icon - 必填, 仅适配 icon-font, 填写 icon-font 图标名
 */
const props = defineProps<{
  icon: string;
}>();
</script>

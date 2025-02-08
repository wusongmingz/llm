<script setup lang="ts">
import { ElMessageBox } from 'element-plus';
import { toRefs } from 'vue';

const prop = defineProps<{
  isEdit: boolean;
  size?: 'small' | 'default' | 'large';
}>();
const { isEdit } = toRefs(prop);
const emit = defineEmits<{
  (e: 'update:isEdit', value: boolean): void;
  (e: 'submit'): void;
  (e: 'cancel'): void;
}>();

const cancelConfirm = () => {
  ElMessageBox.confirm('点击取消后将丢失修改的内容', { type: 'warning' }).then(() => {
    emit('update:isEdit', false);
    emit('cancel');
  });
};
</script>

<template>
  <div style="text-align: right; margin-bottom: 10px">
    <el-button :size="prop.size" v-if="!isEdit" @click="emit('update:isEdit', true)">编辑</el-button>
    <el-button :size="prop.size" v-if="isEdit" @click="cancelConfirm" :type="'danger'">取消</el-button>
    <el-button :size="prop.size" v-if="isEdit" @click="emit('submit')" :type="'primary'">保存</el-button>
  </div>
</template>

<style scoped lang="scss"></style>

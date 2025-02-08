<template>
  <div>
    <div class="tltle">
      {{ modelDetailAll.name }}&nbsp;&nbsp;<el-icon size="25" class="icon-color" @click="copyRecord(modelDetailAll.name)">
        <AIcon icon="icon-fuzhi" />
      </el-icon>
    </div>
    <div class="context">
      <div class="context-time">
        更新时间：{{ dayjs(modelDetailAll.updateTime).format('YYYY-MM-DD') }} |{{ modelDetailAll.contextLength }}上下文 | 输入:{{
          modelDetailAll.inPrice
        }}{{ modelDetailAll.inPriceUnit }} | 输出:{{ modelDetailAll.outPrice }}{{ modelDetailAll.outPriceUnit }}
      </div>
      <div class="context-text">
        {{ modelDetailAll.introduce }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, inject } from 'vue';
import { copyToClipboard } from '@/utils/commonUtil';
import { ElMessage, dayjs } from 'element-plus';
//复制功能
const copyRecord = (item: string) => {
  const content = item;
  copyToClipboard({
    content,
    success() {
      ElMessage({
        message: '复制成功',
        type: 'success',
      });
    },
    error() {
      ElMessage({
        message: '复制失败',
        type: 'error',
      });
    },
  });
};
const modelDetailAll = <any>inject('modelDetailAll');
</script>
<style lang="scss" scoped>
.tltle {
  font-size: 18px;
  font-weight: bold;
  margin-right: 15px;
  height: 50px;
  border-bottom: 1px solid #7f7f7f;
  .icon-color {
    cursor: pointer;
    color: #7f7f7f;
  }
}
.context {
  padding: 20px;
  .context-time {
    color: #7f7f7f;
    font-size: 12px;
    margin-bottom: 20px;
  }
  .context-text {
    font-size: 13px;
    line-height: 20px;
  }
}
</style>

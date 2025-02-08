<template>
  <div class="box-i">
    <div class="tltle">API接口</div>
    <div class="card-body">
      <div class="card-box">
        <div class="card-text">
          <IFrame :url="modelDetailAll.url" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, inject, onMounted } from 'vue';
import IFrame from '@/layout/IFrame/IFrame.vue';
const modelDetailAll = <any>inject('modelDetailAll');
</script>
<style lang="scss" scoped>
.box-i {
  height: 100%;
  display: flex;
  flex-direction: column;
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
  .card-body {
    width: 100%;
    flex: 1;
    padding-right: 15px;
    .card-box {
      height: 100%;
      overflow: hidden;
      border: 0px;
      .card-text {
        width: calc(100% + 90px);
        height: calc(100% + 90px);
        margin: -60px 0px 0px -10px;
      }
    }
  }
}
</style>

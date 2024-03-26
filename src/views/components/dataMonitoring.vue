<template>
  <div class="dataMonitoring-box">
    <img
      src="@/assets/monitoring-bg.png"
      class="monitoring-bg-bg"
      width="100%"
      alt="header背景图标"
    />
    <small-title>数据监控情况</small-title>
    <div class="content-top top">
      <div v-for="(item, index) in dataTop" :key="index">
        <div class="content-item">
          <dataMonitoringItem
            :key="item.id"
            :name="item.name"
            :number="item.count"
          ></dataMonitoringItem>
        </div>
      </div>
    </div>
    <div class="content-top bottom">
      <div v-for="(item, index) in dataBottom" :key="index">
        <div class="content-item">
          <dataMonitoringItem
            :key="item.id"
            :unit="item?.unit"
            :name="item.name"
            :number="item.count"
          ></dataMonitoringItem>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SmallTitle from "./small-title.vue";
import dataMonitoringItem from "./dataMonitoringItem.vue";

const dataTop = ref([
  { name: "自助机总量(台)", count: 21, id: 1, value: "terminalCount" },
  {
    name: "自助机实时在线量(台)",
    count: 0,
    id: 2,
    value: "terminalOnlineCount",
  },
  { name: "自助机型号数量(类)", count: 21, id: 3, value: "terminalModelCount" },
]);
const dataBottom = ref([
  { name: "办件总量(件)", count: 9, id: 1, value: "totalHandleProject" },
  { name: "今日办件量(件)", count: 420, id: 2, value: "todayHandleProject" },
  { name: "好评率", count: 50, id: 3, value: "positiveRate", unit: "%" },
]);
</script>

<style lang="less" scoped>
.dataMonitoring-box {
  position: relative;
  z-index: 2;
  :deep(.small-title-box) {
    margin: 0 auto;
  }
  .monitoring-bg-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 881px;
    height: 251px;
  }
  .content-top {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    &.top {
      margin-top: 20px;
    }
    &.bottom {
      margin-top: 28px;
    }
    .content-item {
      flex: 1;
    }
    .border {
      width: 1px;
      height: 46px;
      opacity: 0.29;
      background: #76edff;
    }
  }
}
</style>

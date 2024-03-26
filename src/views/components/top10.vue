<template>
  <div class="top10-box">
    <smallTitle>高频事项TOP10</smallTitle>
    <div class="top10-content">
      <div v-for="(item, index) in topData" :key="item.id" class="top10-item">
        <topList
          :name="item.terminalName"
          :count="item.handleProjectCount"
          :index="index + 1"
        ></topList>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import smallTitle from "./small-title.vue";
import topList from "./topList.vue";

const topData = ref([
  {
    terminalName: "交通违章罚款缴纳机",
    terminalCode: "ZZFWZD-CD-E5-9384E",
    handleProjectCount: 103298,
    id: 1,
  },
  {
    terminalName: "临时身份证明",
    terminalCode: "ZZFWZD-JC-A2-89E01",
    handleProjectCount: 90313,
    id: 2,
  },
  {
    terminalName: "企业参保证明",
    terminalCode: "ZZFWZD-XD-F2-3840F",
    handleProjectCount: 85694,
    id: 3,
  },
  {
    terminalName: "期满换领机动车驾驶证",
    terminalCode: "ZZFWZD-JC-A1-P3849",
    handleProjectCount: 84039,
    id: 4,
  },
  {
    terminalName: "本省籍身份证换领、补领",
    terminalCode: "ZZFWZD-NW-A2-29491Q",
    handleProjectCount: 83183,
    id: 5,
  },
  {
    terminalName: "交通违章罚款缴纳机",
    terminalCode: "ZZFWZD-CD-E5-9384E",
    handleProjectCount: 103298,
    id: 1,
  },
  {
    terminalName: "临时身份证明",
    terminalCode: "ZZFWZD-JC-A2-89E01",
    handleProjectCount: 90313,
    id: 2,
  },
  {
    terminalName: "企业参保证明",
    terminalCode: "ZZFWZD-XD-F2-3840F",
    handleProjectCount: 85694,
    id: 3,
  },
  {
    terminalName: "期满换领机动车驾驶证",
    terminalCode: "ZZFWZD-JC-A1-P3849",
    handleProjectCount: 84039,
    id: 4,
  },
  {
    terminalName: "本省籍身份证换领、补领",
    terminalCode: "ZZFWZD-NW-A2-29491Q",
    handleProjectCount: 83183,
    id: 5,
  },
]);
</script>

<style lang="less" scoped>
.top10-content {
  margin-top: 20px;
  height: 450px;
}
.top10-item {
  margin-bottom: 24px;
}
</style>

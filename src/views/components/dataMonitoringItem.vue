<template>
  <div class="item-box">
    <div class="number">{{ number }} {{ unit }}</div>
    <div class="name">{{ name }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  name: {
    type: String,
    default: "",
  },

  number: {
    type: [Number, String],
    default: undefined,
  },
  unit: {
    type: String,
    default: "",
  },
});
</script>

<style lang="less" scoped>
.item-box {
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;
  .number {
    height: 34px;
    font-size: 34px;
    font-family:
      DIN Alternate,
      DIN Alternate-Bold;
    font-weight: 700;
    text-align: center;
    color: #ffd457;
    line-height: 34px;
    letter-spacing: 0.06px;
  }
  .name {
    margin-top: 10px;
    height: 16px;
    font-size: 16px;
    font-family:
      PingFang SC,
      PingFang SC-Regular;
    font-weight: 400;
    text-align: center;
    color: #a8e6ff;
    line-height: 16px;
  }
}
</style>

<template>
  <div class="top-box">
    <div class="index" :class="'top' + index">{{ index }}</div>
    <div class="content-box">
      <div class="name-box">
        <div class="name">{{ name }}</div>
        <div v-if="number" class="number">{{ number }}</div>
      </div>
      <div class="count-box">{{ count }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  name: {
    type: String,
    default: "",
  },
  count: {
    type: Number,
    default: null,
  },
  index: {
    type: Number,
    default: null,
  },
  number: {
    type: [Number, String],
  },
});
</script>

<style lang="less" scoped>
.top-box {
  display: flex;
  align-items: center;

  .index {
    width: 22px;
    height: 22px;
    font-size: 14px;
    font-family:
      PingFang SC,
      PingFang SC-Regular;
    font-weight: 400;
    text-align: center;
    color: #a8e6ff;
    line-height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    &.top1 {
      width: 22px;
      height: 22px;
      background: #e79328;
      border-radius: 3px;
      font-size: 14px;
      font-weight: 400;
      text-align: center;
      color: #ffffff;
    }
    &.top2 {
      width: 22px;
      height: 22px;
      background: #a0a5a8;
      border-radius: 3px;
      font-size: 14px;
      font-weight: 400;
      text-align: center;
      color: #ffffff;
    }
    &.top3 {
      width: 22px;
      height: 22px;
      background: #d89d90;
      border-radius: 3px;
      font-size: 14px;
      font-weight: 400;
      text-align: center;
      color: #ffffff;
    }
  }
  .content-box {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .name-box {
    display: flex;
    // align-items: center;
    flex-direction: column;
    // height: 14px;
    font-size: 14px;
    font-family:
      PingFang SC,
      PingFang SC-Regular;
    font-weight: 400;
    text-align: left;
    color: #a8e6ff;
    line-height: 14px;
    margin-left: 16px;
    .number {
      margin-top: 8px;
      height: 12px;
      font-size: 12px;
      font-family:
        PingFang SC,
        PingFang SC-Regular;
      font-weight: 400;
      text-align: left;
      color: rgba(168, 230, 255, 0.75);
      line-height: 12px;
    }
  }
  .count-box {
    height: 16px;
    font-size: 16px;
    font-family:
      PingFang SC,
      PingFang SC-Medium;
    font-weight: 500;
    text-align: right;
    color: #ffffff;
    line-height: 16px;
  }
}
</style>

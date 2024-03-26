<template>
  <div class="small-title-box">
    <img
      src="@/assets/small-title-bg.png"
      class="small-title-bg"
      width="100%"
      alt="header背景图标"
    />
    <span class="small-title"><slot></slot></span>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
.small-title-box {
  position: relative;
  width: 434px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  .small-title-bg {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .small-title {
    position: relative;
    height: 18px;
    font-size: 18px;
    font-family:
      PingFang SC,
      PingFang SC-Medium;
    font-weight: 500;
    text-align: center;
    color: #adfcff;
    line-height: 18px;
    z-index: 2;
  }
}
</style>

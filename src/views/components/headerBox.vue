<template>
  <div>
    <div class="header-box">
      <img
        src="@/assets/header.png"
        class="header-bg"
        width="100%"
        alt="header背景图标"
      />
      <div class="header-title">
        <img
          src="@/assets/headerTitle.png"
          class="header-title-img"
          width="100%"
          alt="header背景图标"
        />
      </div>
      <!-- 右上角的时间 -->
    </div>
    <div class="fx_time">{{ nowTime }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
let nowTime = ref();
let timer = ref();
const getNowTime = () => {
  let date = new Date();
  let year = date.getFullYear();
  let month =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  let minute =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  let seconds =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

  const weeks = new Array(
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六"
  );

  nowTime.value =
    year +
    "年" +
    month +
    "月" +
    day +
    "日 " +
    hour +
    ":" +
    minute +
    ":" +
    seconds +
    " " +
    weeks[new Date().getDay()];
};
onMounted(() => {
  timer.value = setInterval(() => getNowTime(), 1000);
});
onBeforeUnmount(() => {
  clearTimeout(timer.value);
});
</script>

<style lang="less" scoped>
.header-box {
  position: relative;
  width: 1590px;
  height: 102px;
  margin: 0 auto;
  .header-bg {
    position: absolute;
    width: 1590px;
    height: 102px;
    margin: 0 auto;
  }
  .header-title {
    display: flex;
    // align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    .header-title-img {
      width: 586px;
      height: 52px;
      margin-top: 10px;
    }
  }
}
.fx_time {
  position: absolute;
  right: 36px;
  top: 25px;
  height: 16px;
  font-size: 16px;
  font-weight: 400;
  color: #6cf7fc;
  line-height: 16px;
}
</style>

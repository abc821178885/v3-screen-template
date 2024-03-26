<template>
  <scale-box>
    <div class="fx_page">
      <HeaderBox />
      <div class="content-box">
        <div class="left-box">
          <state-statistics />
          <type-analysis />
          <trend-statistics />
        </div>
        <div class="center-box">
          <img
            src="@/assets/map-bg.png"
            class="map-bg"
            width="100%"
            alt="header背景图标"
          />
          <dataMonitoring />
          <mapBox></mapBox>
        </div>
        <div class="right-box">
          <top10 />
          <top5 />
        </div>
      </div>
    </div>
  </scale-box>
</template>
<script lang="ts" setup>
import ScaleBox from "@/components/scale-box/index.vue";
import HeaderBox from "./components/headerBox.vue";
import StateStatistics from "./components/stateStatistics.vue";
import TypeAnalysis from "./components/type-analysis.vue";
import TrendStatistics from "./components/trend-statistics.vue";
import dataMonitoring from "./components/dataMonitoring.vue";
import top10 from "./components/top10.vue";
import top5 from "./components/top5.vue";
import mapBox from "./components/map-box.vue";
</script>
<style lang="less" scoped>
.fx_page {
  position: relative;
  width: 1920px;
  height: 1080px;
  background: #00174b;
  overflow: hidden;
  -moz-transform-origin: 0 0;
  -webkit-transform-origin: 0 0;
  -o-transform-origin: 0 0;

  .content-box {
    margin-top: 22px;
    display: flex;
    flex-direction: row;
    margin-left: 48px;
    .left-box {
      width: 434px;
    }
    .center-box {
      position: relative;
      width: 880px;
      margin-left: 38px;
      .map-bg {
        position: absolute;
        bottom: 0;
        left: -50px;
        width: 1197px;
        height: 824px;
        z-index: 0;
      }
    }
    .right-box {
      width: 434px;
      margin-left: 48px;
      position: relative;
      z-index: 2;
    }
  }
}
</style>

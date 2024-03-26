<template>
  <section>
    <smallTitle>办件数量趋势统计</smallTitle>
    <div class="content">
      <div class="date-box">
        <div :class="activeName === 1 ? 'is-active' : ''" @click="onChange(1)">
          最近7天
        </div>
        <div :class="activeName === 2 ? 'is-active' : ''" @click="onChange(2)">
          最近30天
        </div>
        <div :class="activeName === 3 ? 'is-active' : ''" @click="onChange(3)">
          最近一年
        </div>
      </div>
      <div id="fullyLoadedCharts" ref="chartsRef"></div>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import smallTitle from "./small-title.vue";
import * as echarts from "echarts";
import emitter from "@/hooks/mitt";
import { trendData } from "./stateStatistics";

const adcodeValue = ref();
emitter.on("changeRegion", (adcode) => {
  adcodeValue.value = adcode;
  getData();
});
const fullyLoadedCharts = ref();
const activeName = ref(1);
const onChange = (count: number) => {
  activeName.value = count;
  if (fullyLoadedCharts.value) {
    fullyLoadedCharts.value.dispose(); //销毁
  }
  getData();
};

const xAxisData = ref<string[]>([]);
const yAxisData = ref<number[]>([]);
const getData = async () => {
  const data = trendData;
  const chartData = data;
  let xData: any = [];
  let yData: any = [];
  chartData.forEach((item: any) => {
    xData.push(item.nodeName);
    yData.push(item.projectCount);
  });
  xAxisData.value = xData;
  yAxisData.value = yData;
  initOperatingCondition();
};

const chartsRef = ref();
const initOperatingCondition = () => {
  const fullyLoadedCharts = echarts.init(chartsRef.value);
  fullyLoadedCharts.setOption({
    tooltip: {
      show: true,
    },
    legend: {
      show: false,
    },
    grid: {
      height: 200,
      // width: '100%',
      top: 30,
      left: 50,
    },
    xAxis: {
      type: "category",
      data: xAxisData.value,
      axisTick: {
        alignWithLabel: true,
      },
      axisLabel: {
        color: "#A8E6FF",
        fontSize: 13,
        // interval: 0,
        // rotate: 35,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "rgba(0,0,0,0.15)",
        },
      },
    },
    yAxis: {
      type: "value",
      name: "单位：件",
      nameTextStyle: {
        color: "#A8E6FF",
        align: "right",
      },
      minInterval: 1,
      axisTick: {
        show: true,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        color: "#A8E6FF",
        fontSize: 14,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(168,230,255,0.3)",
          type: "dashed",
        },
      },
    },
    series: [
      {
        data: yAxisData.value,
        type: "line",
        smooth: true,
        symbolSize: 1,
        lineStyle: {
          normal: {
            width: 4,
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 1, //从左到右
              y2: 0,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(62,230,222,1)", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "rgba(62,230,222,1)", // 100% 处的颜色
                },
              ],
              globalCoord: false, // 缺省为 false
            },
          },
        },
        areaStyle: {
          normal: {
            color: {
              type: "linear",
              x: 0,
              y: 1,
              x2: 0, //从左到右，但不能从上到下，需要借助辅助系列
              y2: 0,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(62,230,222,0)", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "rgba(62,230,222,0.4)", // 100% 处的颜色
                },
              ],
              globalCoord: false, // 缺省为 false
            },
          },
        },
      },
    ],
  });
};
onMounted(() => {
  getData();
});
</script>
<style lang="less" scoped>
#fullyLoadedCharts {
  height: 280px;
  width: 100%;
}

.date-box {
  width: 50%;
  margin-left: 50%;
  display: flex;
  align-items: baseline;
  justify-content: space-evenly;
  font-size: 14px;
  color: rgba(120, 217, 255, 0.69);
  cursor: pointer;
  margin-top: 16px;
}
.is-active {
  border: none;
  color: #78d9ff;
  border-bottom: 3px solid transparent;
  border-radius: 16px;
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
  border-image: linear-gradient(244deg, #54ffb5 17%, #2bd2ff) 3 3;
}
</style>

<template>
  <div class="stateStatistics-box">
    <smallTitle>自助机检测状态统计</smallTitle>
    <el-row :gutter="20" style="margin-top: 16px; width: 424px">
      <el-col :span="10">
        <div class="legend-box">
          <div class="legend-item">
            <div class="circle" style="background: #00c68e"></div>
            <div>正常</div>
          </div>
          <div class="legend-item">
            <div class="circle" style="background: #f7aa01"></div>
            <div>告警</div>
          </div>
          <div class="legend-item">
            <div class="circle" style="background: #ff4646"></div>
            <div>故障</div>
          </div>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="date-box">
          <div
            :class="activeName === 1 ? 'is-active' : ''"
            @click="onChange(1)"
          >
            最近7天
          </div>
          <div
            :class="activeName === 2 ? 'is-active' : ''"
            @click="onChange(2)"
          >
            最近30天
          </div>
          <div
            :class="activeName === 3 ? 'is-active' : ''"
            @click="onChange(3)"
          >
            最近一年
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="content">
      <div id="stateStatistics" ref="stateStatisticsRef"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, onMounted } from "vue";
import * as echarts from "echarts";
import smallTitle from "./small-title.vue";
import emitter from "@/hooks/mitt";
import { stateDatas } from "./stateStatistics";
const adcodeValue = ref();
emitter.on("changeRegion", (adcode) => {
  adcodeValue.value = adcode;
  getData();
});
onUnmounted(() => {
  emitter.off("changeRegion");
});
const onChange = (active: number) => {
  activeName.value = active;
  if (chart.value) {
    chart.value.dispose(); //销毁
  }
  getData();
};
onMounted(() => {
  getData();
});
interface dataType {
  dateStr: [string | number][];
  terminalTotal: [string | number][];
  terminalNormalCount: [string | number][]; //监测正常数量
  terminalAlarmCount: [string | number][]; //监测告警数量
  terminalFailureCount: [string | number][]; //监测故障数量
}
const statisticsData = ref<dataType>();
const getData = async () => {
  statisticsData.value = formatterData(stateDatas.value);
  initChart();
};

const formatterData = (data: any) => {
  const newData = ref<dataType>({
    dateStr: [], // 时间
    terminalTotal: [], // 总量
    terminalNormalCount: [], //监测正常数量
    terminalAlarmCount: [], //监测告警数量
    terminalFailureCount: [], //监测故障数量
  });
  data.forEach((item: any) => {
    for (let ele in item) {
      // @ts-ignore
      newData.value[ele] && newData.value[ele].push(item[ele]);
    }
  });
  return newData.value;
};

const stateStatisticsRef = ref();
const chart = ref<any>(null); // echarts
// type:1 近七天， type：2 近一个月，type：3近一年
const activeName = ref(1);
const initChart = () => {
  const chartEle: HTMLElement = stateStatisticsRef.value as HTMLElement;
  chart.value = echarts.init(chartEle);
  chart.value.setOption({
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        crossStyle: {
          color: "#A8E6FF",
        },
      },
    },
    legend: {
      show: false,
    },
    grid: {
      top: 40,
      bottom: 40,
    },
    dataZoom: setDataZoom(),
    xAxis: [
      {
        type: "category",
        data: statisticsData.value?.dateStr,
        axisPointer: {
          type: "shadow",
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "#A8E6FF",
          },
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "单位: 台",
        axisLine: {
          show: false,
          lineStyle: {
            color: "#A8E6FF",
            type: "dashed",
          },
        },
        minInterval: 1,
        // 设置网格线为虚线
        splitLine: {
          show: true,
          lineStyle: {
            color: "rgba(255, 255, 255, 0.16)",
            type: "dashed",
          },
        },
      },
    ],
    series: [
      {
        name: "正常",
        type: "bar",
        itemStyle: {
          normal: {
            color: "#00C68E",
          },
        },
        data: statisticsData.value?.terminalNormalCount,
      },
      {
        name: "告警",
        type: "bar",
        itemStyle: {
          normal: {
            color: "#F7AA01",
          },
        },
        data: statisticsData.value?.terminalAlarmCount,
      },
      {
        name: "故障",
        type: "bar",
        itemStyle: {
          normal: {
            color: "#FF4646",
          },
        },
        data: statisticsData.value?.terminalFailureCount,
      },
      {
        name: "总量",
        type: "line",
        smooth: true,
        showSymbol: false,
        areaStyle: {
          //区域填充样式
          normal: {
            //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: "rgba(33,200,255,0.5)",
                },
                {
                  offset: 0.5,
                  color: "rgba(75,145,255,0.3)",
                },
                {
                  offset: 1,
                  color: "rgba(38,109,255,0.1)",
                },
              ],
              false
            ),
            shadowColor: "rgba(38,109,255,0.1)", //阴影颜色
            shadowBlur: 40, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
          },
        },
        data: statisticsData.value?.terminalTotal,
      },
    ],
  });
};
const setDataZoom = () => {
  if (activeName.value !== 1) {
    return [
      {
        type: "slider",
        show: true, // x轴是否启用
        start: 50, // 从哪里开始显示
        end: 100, // 到哪里结束显示
        handleSize: 8,
      },
      {
        type: "inside",
        start: 50,
        end: 100,
      },
      {
        type: "slider",
        show: false, // y轴是否启用
        yAxisIndex: 0,
        filterMode: "empty",
        width: 12,
        height: "70%",
        handleSize: 8,
        showDataShadow: false,
        left: "93%",
      },
    ];
  } else {
    return undefined;
  }
};
</script>

<style lang="less" scoped>
#stateStatistics {
  width: 434px;
  height: 245px;
}
.legend-box {
  display: flex;
  justify-content: space-around;
  font-size: 12px;
  color: rgba(168, 230, 255, 0.75);
}
.circle {
  width: 8px;
  height: 8px;
  margin-right: 6px;
  border-radius: 50%;
}
.legend-item {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}
.date-box {
  display: flex;
  align-items: baseline;
  justify-content: space-evenly;
  font-size: 14px;
  color: rgba(120, 217, 255, 0.69);
  cursor: pointer;
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

<template>
  <section class="box">
    <smallTitle>自助机类型分析</smallTitle>
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="container">
          <div id="charts" class="chartsGl"></div>
          <!-- 饼图下面的底座 -->
          <div class="buttomCharts">
            <div style="font-size: 14px; padding-top: 65px">
              {{ chart1CenterName }}
            </div>
            <div>{{ chart1CenterData }}</div>
          </div>
        </div>
        <div class="type-btn">按自助机</div>
      </el-col>
      <el-col :span="12">
        <div class="container">
          <div id="charts2" class="chartsGl2"></div>
          <!-- 饼图下面的底座 -->
          <div class="buttomCharts">
            <div style="font-size: 14px; padding-top: 65px">
              {{ chart2CenterName }}
            </div>
            <div>{{ chart2CenterData }}</div>
          </div>
        </div>
        <div class="type-btn">按警种</div>
      </el-col>
    </el-row>
  </section>
</template>
<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import smallTitle from "./small-title.vue";
import * as echarts from "echarts";
import "echarts-gl";
import emitter from "@/hooks/mitt";
import { policeType, categoryData } from "./stateStatistics";
onMounted(() => {
  getChartData();
  getChart2Data();
});
const adcodeValue = ref();
emitter.on("changeRegion", (adcode) => {
  adcodeValue.value = adcode;
  getChartData();
  getChart2Data();
});

interface optionDataType {
  name: string;
  value: number;
  [params: string]: any;
}
const chartColor = ["#00C68E", "#49C3FF", "#B676FF", "#F7AA01"];

const optionData = ref<optionDataType[]>([]);
const optionData2 = ref<optionDataType[]>([]);
const total = ref(100);
const total2 = ref(100);
const getChartData = async () => {
  const data = categoryData;
  optionData.value = [];
  total.value = 0;
  data.forEach((item: any, index: number) => {
    if (index < 4) {
      total.value += parseInt(item?.terminalCount) || 0;
      optionData.value.push({
        name: item?.categoryValue, //名称
        value: item?.terminalCount || 0, //值
        itemStyle: {
          color: chartColor[index % 4],
        },
      });
    }
  });

  initChart();
};

const getChart2Data = async () => {
  const data = policeType;
  optionData2.value = [];
  total2.value = 0;
  data.forEach((item: any, index: number) => {
    if (index < 4) {
      total2.value += parseInt(item?.terminalCount) || 0;
      optionData2.value.push({
        name: item?.policeTypeName, //名称
        value: item?.terminalCount || 0, //值
        itemStyle: {
          color: chartColor[index % 4],
        },
      });
    }
  });
  init2Chart();
};
onUnmounted(() => {
  emitter.off("changeRegion");
});

const getHeight3D = (series: any[]) => {
  series.sort((a, b) => {
    return b.pieData.value - a.pieData.value;
  });
  return 10;
};

const getParametricEquation = (
  startRatio: number,
  endRatio: number,
  isSelected: boolean,
  isHovered: any,
  k: number,
  h: number
) => {
  // 计算
  let midRatio = (startRatio + endRatio) / 2;
  let startRadian = startRatio * Math.PI * 2;
  let endRadian = endRatio * Math.PI * 2;
  let midRadian = midRatio * Math.PI * 2;
  // 如果只有一个扇形，则不实现选中效果。
  if (startRatio === 0 && endRatio === 1) {
    isSelected = false;
  }
  // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
  k = typeof k !== "undefined" ? k : 1 / 3;
  // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
  let offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
  let offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;
  // 计算高亮效果的放大比例（未高亮，则比例为 1）
  let hoverRate = isHovered ? 1.05 : 1;
  // 返回曲面参数方程
  return {
    u: {
      min: -Math.PI,
      max: Math.PI * 3,
      step: Math.PI / 32,
    },
    v: {
      min: 0,
      max: Math.PI * 2,
      step: Math.PI / 20,
    },
    x: function (u: number, v: number) {
      if (u < startRadian) {
        return (
          offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate
        );
      }
      if (u > endRadian) {
        return (
          offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate
        );
      }
      return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
    },
    y: function (u: number, v: number) {
      if (u < startRadian) {
        return (
          offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate
        );
      }
      if (u > endRadian) {
        return (
          offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate
        );
      }
      return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
    },
    z: function (u: number, v: number) {
      if (u < -Math.PI * 0.5) {
        return Math.sin(u);
      }
      if (u > Math.PI * 2.5) {
        return Math.sin(u) * h * 0.1;
      }
      return Math.sin(v) > 0 ? 1 * h * 0.1 : -1;
    },
  };
};

const fomatFloat = (num: any, n: any) => {
  var f = parseFloat(num);
  if (isNaN(f)) {
    return false;
  }
  f = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); // n 幂
  var s = f.toString();
  var rs = s.indexOf(".");
  //判定如果是整数，增加小数点再补0
  if (rs < 0) {
    rs = s.length;
    s += ".";
  }
  while (s.length <= rs + n) {
    s += "0";
  }
  return s;
};

const getPie3D = (pieData: any[], internalDiameterRatio: number) => {
  let series = [];
  let sumValue = 0;
  let startValue = 0;
  let endValue = 0;
  let legendData = [];
  let legendBfb: { name: any; value: string | false }[] = [];
  let k = 1 - internalDiameterRatio;
  pieData.sort((a, b) => {
    return b.value - a.value;
  });
  // 为每一个饼图数据，生成一个 series-surface(参数曲面) 配置
  for (let i = 0; i < pieData.length; i++) {
    sumValue += pieData[i].value;
    let seriesItem = {
      //系统名称
      name:
        typeof pieData[i].name === "undefined" ? `series${i}` : pieData[i].name,
      type: "surface",
      //是否为参数曲面（是）
      parametric: true,
      //曲面图网格线（否）上面一根一根的
      wireframe: {
        show: false,
      },
      pieData: pieData[i],
      pieStatus: {
        selected: false,
        hovered: false,
        k: k,
      },
      //设置饼图在容器中的位置(目前没发现啥用)
      //   center: ['50%', '100%']
    };

    //曲面的颜色、不透明度等样式。
    if (typeof pieData[i].itemStyle != "undefined") {
      let itemStyle = {};
      typeof pieData[i].itemStyle.color != "undefined"
        ? (itemStyle.color = pieData[i].itemStyle.color)
        : null;
      typeof pieData[i].itemStyle.opacity != "undefined"
        ? (itemStyle.opacity = pieData[i].itemStyle.opacity)
        : null;
      // @ts-ignore
      seriesItem.itemStyle = itemStyle;
    }
    series.push(seriesItem);
  }

  // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
  // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
  legendData = [];
  legendBfb = [];
  for (let i = 0; i < series.length; i++) {
    endValue = startValue + series[i].pieData.value;
    series[i].pieData.startRatio = startValue / sumValue;
    series[i].pieData.endRatio = endValue / sumValue;
    // @ts-ignore
    series[i].parametricEquation = getParametricEquation(
      series[i].pieData.startRatio,
      series[i].pieData.endRatio,
      false,
      false,
      k,
      series[i].pieData.value
    );
    startValue = endValue;
    let bfb = fomatFloat(series[i].pieData.value / sumValue, 4);
    legendData.push({
      name: series[i].name,
      value: bfb,
    });
    legendBfb.push({
      name: series[i].name,
      value: bfb,
    });
  }
  //(第二个参数可以设置你这个环形的高低程度)
  let boxHeight = getHeight3D(series); //通过传参设定3d饼/环的高度
  // 准备待返回的配置项，把准备好的 legendData、series 传入。
  let option = {
    //图例组件
    legend: {
      data: legendData,
      // left: 35,
      top: "auto",
      //图例文字每项之间的间隔
      itemGap: 10,
      itemWidth: 8,
      itemHeight: 8,
      textStyle: {
        color: "#A1E2FF",
      },
      show: true,
      icon: "rect",
      //格式化图例文本（我是数值什么显示什么）
      // formatter: function (name: any) {
      //   var target;
      //   for (var i = 0, l = pieData.length; i < l; i++) {
      //     if (pieData[i].name == name) {
      //       target = (pieData[i].value / total.value) * 100 + '%';
      //     }
      //   }
      //   return `${name}  ${target}`;
      // },
      // 这个可以显示百分比那种（可以根据你想要的来配置）
      formatter: function (param: any) {
        let item = legendBfb.filter((item) => item.name == param)[0];
        // @ts-ignore
        let bfs = fomatFloat(item.value * 100, 2) + "%";
        return `${item.name} ${bfs}`;
      },
    },
    //移动上去提示的文本内容(我没来得及改 你们可以根据需求改)
    tooltip: {
      show: false,
    },
    //这个可以变形
    xAxis3D: {
      min: -1,
      max: 1,
    },
    yAxis3D: {
      min: -1,
      max: 1,
    },
    zAxis3D: {
      min: -1,
      max: 1,
    },
    //此处是修改样式的重点
    grid3D: {
      show: false,
      boxHeight: boxHeight, //圆环的高度
      //这是饼图的位置
      // top: '20.5%',
      left: "-4%",
      viewControl: {
        //3d效果可以放大、旋转等，请自己去查看官方配置
        alpha: 35, //角度(这个很重要 调节角度的)
        distance: 180, //调整视角到主体的距离，类似调整zoom(这是整体大小)
        rotateSensitivity: 0, //设置为0无法旋转
        zoomSensitivity: 0, //设置为0无法缩放
        panSensitivity: 0, //设置为0无法平移
        autoRotate: true, //自动旋转
      },
    },
    series: series,
  };
  return option;
};

const bindListen = (myChart: any, type: number) => {
  myChart.on("click", function (params: any) {
    console.log(params);

    if (type === 1) {
      chart1CenterName.value = params.seriesName;
      chart1CenterData.value =
        (
          (optionData.value.find((x) => x.name === params.seriesName)?.value /
            total.value) *
          100
        ).toFixed(2) + "%";
    } else {
      chart2CenterName.value = params.seriesName;
      // @ts-ignore
      chart2CenterData.value =
        (
          (optionData2.value.find((x) => x.name === params.seriesName)?.value /
            total2.value) *
          100
        ).toFixed(2) + "%";
    }
  });
};
const chart1CenterName = ref(""); // 饼图中间展示文字
const chart1CenterData = ref("");
const chart2CenterName = ref(""); // 饼图中间展示文字
const chart2CenterData = ref("");
const initChart = () => {
  let myChart = echarts.init(document.getElementById("charts"));
  // 传入数据生成 option ; getPie3D(数据，透明的空心占比（调节中间空心范围的0就是普通饼1就很镂空）)
  const option = getPie3D(optionData.value, 0.85);
  //将配置项设置进去
  myChart.setOption(option);
  chart1CenterName.value = optionData.value[0].name;
  chart1CenterData.value =
    ((optionData.value[0].value / total.value) * 100).toFixed(2) + "%";
  bindListen(myChart, 1);
};
const init2Chart = () => {
  let myChart = echarts.init(document.getElementById("charts2"));
  // 传入数据生成 option ; getPie3D(数据，透明的空心占比（调节中间空心范围的0就是普通饼1就很镂空）)
  const option = getPie3D(optionData2.value, 0.85);
  //将配置项设置进去
  chart2CenterName.value = optionData2.value[0].name;
  chart2CenterData.value =
    ((optionData2.value[0].value / total2.value) * 100).toFixed(2) + "%";
  myChart.setOption(option);
  bindListen(myChart, 2);
};
</script>
<style lang="less" scoped>
.type-btn {
  font-size: 14px;
  color: #a8e6ff;
  width: 116px;
  height: 29px;
  text-align: center;
  line-height: 29px;
  background-image: url("@/assets/analysis-btn.png");
  margin-left: 45px;
}
#selfServiceMachine {
  width: 220px;
  height: 200px;
}
.container {
  width: 100%;
  height: 95%;
  padding: 20px 0;
}
//饼图的大小
.chartsGl {
  height: 200px;
  width: 220px;
}
.chartsGl2 {
  height: 200px;
  width: 220px;
}
.buttomCharts {
  background: center top url("@/assets/analysis-bg.png") no-repeat;
  background-size: cover;
  height: 160px;
  width: 100%;
  margin-top: -180px;
  color: #fff;
  font-size: 16px;
  text-align: center;
}
.box {
  height: 300px;
}
</style>

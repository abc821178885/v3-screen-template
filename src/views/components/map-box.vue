<template>
  <div class="map-box">
    <div class="map-button-box">
      <div class="map-button">
        <el-checkbox v-model="isChecked" label="1" @change="onChange"
          >定位故障自助机</el-checkbox
        >
      </div>
      <div
        v-if="currentAddressIndex"
        class="map-button"
        style="width: 133px; cursor: pointer"
        @click="back"
      >
        <img
          src="@/assets/back.png"
          width="16"
          style="margin-right: 4px; cursor: pointer"
        />
        返回上一级
      </div>
    </div>
    <div
      ref="chartsDOM"
      style="width: 720px; height: 575px; margin: 0 auto"
    ></div>
    <!-- <smallTitle>数据监控情况</smallTitle> -->
    <!-- <div class="tips-box">
      <img src="@/assets/dashboard/rect-bg.png" class="rect-bg" width="256"> 
      <div style="position: relative;z-index: 2">
        <div class="title">公安自助一体机</div>
        <div class="item-box">
          <div class="name">数量</div>
          <div class="number">30台</div>
        </div>
        <div class="item-box">
          <div class="name">办件总量</div>
          <div class="number">30件</div>
        </div>
        <div class="item-box">
          <div class="name">今日办件量</div>
          <div class="number">30件</div>
        </div>
      </div>
    </div> -->
    <terminalDialog ref="terminalDialogRef"></terminalDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
import "echarts-gl";
import emitter from "@/hooks/mitt";
import axios from "axios";
import landmarkRed from "@/assets/landmark-red.png";
import landmarkBlue1 from "@/assets/landmark-blue1.png";
import landmarkBlue2 from "@/assets/landmark-blue2.png";
import landmarkBlue3 from "@/assets/landmark-blue3.png";
import landmarkSelect from "@/assets/landmark-selected.png";
import terminalDialog from "./terminalDialog.vue";
let adcode = ref(330000);

onMounted(async () => {
  await init();
});

const terminalCount = ref<any[]>([]);
//  获取该地区下的所有的数据
const getTerminalCount = async () => {
  const successData = ref([]),
    errorData = ref();
  // const { data } = await getFaultTerminal({ regionCode: adcode.value });
  // errorData.value = data;
  // const { data: res } = await terminalCountRegionTerminalAll({
  //   regionCode: adcode.value,
  // });
  // successData.value = res;
  const newData = ref<any[]>([]);

  successData.value.forEach(async (item: any) => {
    const target = errorData.value.filter((ele: any) => {
      return ele.regionCode == item.regionCode;
    })[0];

    newData.value.push({
      ...item,
      faultTerminalCount: target?.faultTerminalCount,
      name: item.regionName,
      value: item.terminalCount,
      adcode: item.regionCode,
    });
  });

  terminalCount.value = newData.value;
};

const getDataByAdcode = (code: number, adcode: string) => {
  // @ts-ignore
  const newData = terminalCount.value;
  if (newData) {
    const target: any = newData.filter(
      // eslint-disable-next-line prettier/prettier
      (item: any) => item.regionCode === adcode.toString()
    )[0];
    return target;
  }
  return {};
};
interface serDataType {
  [key: string]: any;
}

var serData = ref<serDataType[]>([]);
let symbolSize = [56, 58];
const formatterSerData = () => {
  // 散点图配置
  serData.value = [];
  mapData.value?.features?.forEach((feature: any) => {
    const item = feature.properties;
    // const geometry = feature.geometry;
    const data: any = getDataByAdcode(item.parent.adcode, item.adcode);

    serData.value.push({
      // name: `${item.name}`,
      name: data?.regionName,
      // geoIndex: 1,
      type: "effectScatter",
      coordinateSystem: "geo",
      effectType: "ripple",
      showEffectOn: "emphasis",
      legendHoverLink: false,
      // 散点样式
      rippleEffect: {
        period: 1,
        scale: 1,
        brushType: "stroke",
      },
      // 散点大小 自定义散点图片
      symbol: (value: number, params: any) => {
        if (isChecked.value && params?.data?.faultTerminalCount) {
          //  是故障机，并且有数量就展示
          return `image://${landmarkRed}`;
        } else if (params?.name === currentSeries.value?.name) {
          //  如果是选中状态， 展示的标注不一样：暂时没有起作用
          return `image://${landmarkSelect}`;
        } else if (params?.data?.terminalCount) {
          // 如果是正常机器，根据数字长度展示的不一样
          const len = params?.data?.terminalCount?.toString().length || 1;
          if (len == 3) {
            return `image://${landmarkBlue3}`;
          } else if (len == 2) {
            return `image://${landmarkBlue2}`;
          } else {
            return `image://${landmarkBlue1}`;
          }
        } else {
          // 其他情况不展示图片
          return "image://";
        }
      },
      symbolSize: symbolSize,
      hoverAnimation: false,
      // 标志的样式
      itemStyle: {
        normal: {
          color: "red",
          shadowBlur: 10,
          shadowColor: "#333",
        },
      },
      label: {
        normal: {
          formatter: (params: any) => {
            if (isChecked.value && params?.data?.faultTerminalCount) {
              return params?.data?.faultTerminalCount || 0;
            } else if (params?.data?.terminalCount) {
              return params?.data?.terminalCount || 0;
            } else {
              return "";
            }
          },
          position: "top",
          show: true,
          color: "#fff",
          fontSize: 20,
          distance: -12,
          width: 56,
          height: 27,
          border: "1px solid",
          align: "center",
          verticalAlign: "middle",
        },
      },
      data: [
        {
          ...data,
          adcode: item.adcode,
          name: item.name,
          value: item.centroid,
        },
      ],
    });
  });
};
// 整个地图的
const mapDataSeries = () => {
  return [
    {
      // name: '浙江省',
      type: "map",
      map: "mapJson", // 这个是上面注册时的名字哦，registerMap（'这个名字保持一致'）
      layoutSize: "96%",
      roam: "scale", //禁止拖拽
      itemStyle: {
        // opacity: 0.5,
        normal: {
          borderColor: "#175fb8",
          borderWidth: 1,
          areaColor: {
            type: "linear",
            x: 1,
            y: 1,
            r: 0.5,
            colorStops: [
              {
                offset: 0.1,
                color: "rgba(2,14,48,0.76)",
              },
              {
                offset: 1,
                color: "rgba(0,44,117,0.80)",
              },
            ],
          }, // 默认的颜色
        },
        // background: linear-gradient(180deg,rgba(0,44,117,0.80) 1%, rgba(2,14,48,0.76) 100%);
        emphasis: {
          areaColor: "rgba(168,113,24,0.83)", // 悬浮的颜色
          borderColor: "#ffffff",
          label: {
            color: "#ffffff",
            fontSize: 14,
          },
        },
      },
      label: {
        show: true,
        color: "#fff",
        fontSize: 14,
      },
      // zlevel: 10,
      // @ts-ignore
      data: [...terminalCount.value],
    },
  ];
};
const currentAddressIndex = ref(0);
let myChart = ref();
let mapData = ref(); // 要渲染的地图的数据
let mapOption = ref();
let currentSeries = ref();
const lastTooltipAdcode = ref();
const clickTimer = ref();
const terminalDialogRef = ref();
const clickableList = ref(["330600", "330681", "330681109"]);
const chartsDOM = ref();
const init = async () => {
  // 初始化统计图对象
  myChart.value = echarts.init(chartsDOM.value);
  // 显示 loading 动画
  myChart.value.showLoading();
  // 再得到数据的基础上，进行地图绘制
  myChart.value.hideLoading();
  await axios.get(`/static/mapData/${adcode.value}.json`).then((res) => {
    mapData.value = res.data;
    formatterSerData();
  });
  echarts.registerMap("mapJson", mapData.value);
  mapOption.value = {
    layoutCenter: ["50%", "50%"], //位置
    layoutSize: 575, //大小
    tooltip: {
      className: "custom-tooltip-box",
      formatter: function (params: any) {
        const data = params.data;
        var result = `
            <div style="" class="custom-tooltip-style">
              <div style="height: 16px; font-size: 16px; font-weight: 500;text-align: left;color: #f7db2a;line-height: 16px;">公安自助一体机</div>
                <div style="display: flex;align-items: center;justify-content: space-between;margin-top: 10px;">
                  <div class="name" style="height: 20px;font-size: 14px;font-weight: 400;text-align: left;color: #c5e3ff;line-height: 20px;">数量</div>
                  <div class="number" style="height: 20px;font-size: 14px;font-weight: 400; text-align: right; color: #f7db2a; line-height: 20px;">${
                    data?.terminalCount || 0
                  }台</div>
                </div>
                <div class="item-box" style="display: flex;align-items: center;justify-content: space-between;margin-top: 10px;">
                  <div class="name" style="height: 20px;font-size: 14px;font-weight: 400;text-align: left;color: #c5e3ff !important;line-height: 20px;">办件总量</div>
                  <div class="number" style="height: 20px;font-size: 14px;font-weight: 400; text-align: right; color: #f7db2a; line-height: 20px;">${
                    data?.totalHandleProject || 0
                  }件</div>
                </div>
                <div class="item-box" style="display: flex;align-items: center;justify-content: space-between;margin-top: 10px;">
                  <div class="name" style="height: 20px;font-size: 14px;font-weight: 400;text-align: left;color: #c5e3ff;line-height: 20px;">今日办件量</div>
                  <div class="number" style="height: 20px;font-size: 14px;font-weight: 400; text-align: right; color: #f7db2a; line-height: 20px;">${
                    data?.todayHandleProject || 0
                  }件</div>
                </div>
              </div>`;
        return result;
      },
    },
    itemStyle: {
      normal: {
        borderColor: "white",
        borderWidth: 1,
        areaColor: "rgba(168,113,24,0.83)", // 选中的颜色
      },
      // emphasis: {
      //   areaColor: 'rgba(168,113,24,0.83)', // 市色块的颜色
      // },
    },
    type: "map",
    map: "mapJson", // 这个是上面注册时的名字哦，registerMap（'这个名字保持一致'）
    label: {
      show: true,
    },
    geo: [
      {
        // 外围边框
        map: "mapJson",
        roam: "scale", //禁止拖拽
        zoom: 1,
        // roam: false,//禁止拖拽
        layoutSize: "98%",
        // 偏移
        // aspectScale: 0.76,
        itemStyle: {
          shadowColor: "rgba(39,231,255,0.59)",
          shadowBlur: 14,
          normal: {
            borderColor: "#27E7FF",
            borderWidth: 3,
          },
        },
        label: {
          show: true,
          color: "#ffffff",
        },
      },
      {
        // 中间的白色边框
        map: `mapJson`,
        roam: "scale", //禁止拖拽
        zoom: 1,
        // 图形上的文本标签
        label: {
          show: false,
        },
        layoutSize: "96%",
        itemStyle: {
          normal: {
            borderColor: "white",
            borderWidth: 1,
            areaColor: "rgba(168,113,24,0.83)", // 选中的颜色
          },
          // emphasis: {
          //   areaColor: 'rgba(168,113,24,0.83)', // 市色块的颜色
          // },
        },
      },
    ],
    // @ts-ignore
    series: mapDataSeries().concat(serData.value),
  };

  myChart.value.setOption(mapOption.value);
  myChart.value.on("click", async (params: any) => {
    clearTimeout(clickTimer.value);
    clickTimer.value = setTimeout(async function () {
      if (
        clickableList.value.indexOf(params?.data?.adcode?.toString()) > -1 ||
        params?.data?.adcode?.toString().indexOf("330681") > -1
      ) {
        currentAddressIndex.value++;
        if (myChart.value) {
          myChart.value.dispose(); //销毁
        }
        lastTooltipAdcode.value = adcode.value;
        adcode.value = params?.data?.adcode;
        if (adcode.value) {
          await getTerminalCount();
          init();
        }
      } else {
        return;
      }
    }, 250);
  });
  myChart.value.on("dblclick", async (params: any) => {
    // 当双击事件发生时，清除单击事件，仅响应双击事件
    clearTimeout(clickTimer.value);
    if (
      params?.data?.adcode.indexOf("330681") > -1 &&
      params?.data?.name !== "诸暨市"
    ) {
      terminalDialogRef.value.showDialog(params.data);
    }
  });
  //  缩放
  myChart.value.on("georoam", (params: any) => {
    let option = myChart.value.getOption(); //获得option对象

    if (params.zoom != null && params.zoom != undefined) {
      //捕捉到缩放时
      option.geo[0].zoom = option.series[0].zoom; //下层geo的缩放等级跟着上层的geo一起改变
      option.geo[0].center = option.series[0].center; //下层的geo的中心位置随着上层geo一起改变
    } else {
      //捕捉到拖曳时
      option.geo[0].center = option.series[0].center; //下层的geo的中心位置随着上层geo一起改变
    }
    myChart.value.setOption(option); //设置option
  });

  // myChart.getZr().on('dblclick', (clickparams)=> {
  // 鼠标移入
  // myChart.value.on("mousemove", (params) => {
  // console.log('mousemove',params,);
  // if (!currentSeries.value || (currentSeries.value?.name !== params.name && params?.componentType === "series" && params?.seriesType === "map")){
  //   currentSeries.value = params;
  //   updateSymbolData()
  // }
  // const data = getTrendTerminal(params.data.adcode)
  //   // 将数据整理为tooltip的格式
  // const  tooltipContent = formatTooltipContent(data);

  //   // 更新tooltip的内容
  //   myChart.value.dispatchAction({
  //     type: 'showTip',
  //     dataIndex: params.dataIndex,
  //     seriesName: params.seriesName,
  //     value: tooltipContent
  //   });

  // });
  // 鼠标移出
  // myChart.value.on("mouseout", (params) => {
  //   // console.log('mouseout',params.name,params);
  //   if (currentSeries.value?.name !== params.name && params?.componentType === "series" && params?.seriesType === "map"){
  //     currentSeries.value = '';
  //     updateSymbolData()
  //   }
  // });
  window.addEventListener("resize", function () {
    myChart.value.resize();
  });
  changeRegion();
};

const adcodeIndex = [330000, 330600, 330681, 330681109];
// 返回上一级
const back = async () => {
  if (currentAddressIndex.value === 0) {
    return;
  }
  currentAddressIndex.value--;
  if (myChart.value) {
    myChart.value.dispose(); //销毁
  }
  adcode.value = adcodeIndex[currentAddressIndex.value];
  await getTerminalCount();
  init();
};

const isChecked = ref(false);
const onChange = async () => {
  // if (myChart.value) {
  //   myChart.value.dispose(); //销毁
  // }
  // await getTerminalCount()
  // await init()
  updateSymbolData();
};
const updateSymbolData = () => {
  formatterSerData();
  // @ts-ignore
  mapOption.value.series = mapDataSeries().concat(serData.value);
  myChart.value.setOption(mapOption.value);
};

const changeRegion = () => {
  emitter.emit("changeRegion", adcode.value);
};
</script>

<style lang="less" scoped>
.map-box {
  position: relative;
  margin-top: 100px;
}

.map-button-box {
  position: absolute;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 10px;
  .map-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 154px;
    height: 42px;
    background: url("@/assets/map-button-bg.png") 0 0 no-repeat;
    background-size: 100% 100%;
    font-size: 14px;
    font-family:
      PingFang SC,
      PingFang SC-Regular;
    font-weight: 400;
    text-align: left;
    color: #a8e6ff;
    line-height: 14px;
    :deep(.is-checked .el-checkbox__inner) {
      background-color: #409eff;
    }
    :deep(.el-checkbox__inner) {
      border-color: #00befa;
      background-color: transparent;
    }

    :deep(.el-checkbox__label) {
      color: #a8e6ff;
      font-size: 14px;
    }
  }
}

:deep(.custom-tooltip-box) {
  padding: 0 !important;
  border: none !important;
  background-color: transparent !important;
  // 给子盒子自定义样式
  .custom-tooltip-style {
    width: 256px;
    height: 160px;
    background-image: url("@/assets/rect-bg.png");
    background-size: 100% 100%;
    color: #fff;
    position: relative;
    z-index: 2;
    padding: 18px 20px;
    box-sizing: border-box;
  }
}

.tips-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 256px;
  height: 160px;
  // background: rgba(7,32,97,0.90);
  // border: 2px solid #ffb956;
  padding: 18px 20px;
  .rect-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
  .title {
    height: 16px;
    font-size: 16px;
    font-family:
      PingFang SC,
      PingFang SC-Medium;
    font-weight: 500;
    text-align: left;
    color: #f7db2a;
    line-height: 16px;
  }
  .item-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    .name {
      height: 20px;
      font-size: 14px;
      font-family:
        PingFang SC,
        PingFang SC-Regular;
      font-weight: 400;
      text-align: left;
      color: #c5e3ff;
      line-height: 20px;
    }
    .number {
      height: 20px;
      font-size: 14px;
      font-family:
        PingFang SC,
        PingFang SC-Regular;
      font-weight: 400;
      text-align: right;
      color: #f7db2a;
      line-height: 20px;
    }
  }
}
</style>

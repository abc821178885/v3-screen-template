import { ref } from "vue";

interface dataType {
  dateStr: string | number;
  terminalTotal: string | number;
  terminalNormalCount: string | number; //监测正常数量
  terminalAlarmCount: string | number; //监测告警数量
  terminalFailureCount: string | number; //监测故障数量
}
export const stateDatas = ref<dataType[]>([
  {
    dateStr: "12-23",
    terminalAlarmCount: 1,
    terminalFailureCount: 2,
    terminalNormalCount: 0,
    terminalTotal: 0,
  },
  {
    dateStr: "12-24",
    terminalAlarmCount: 1,
    terminalFailureCount: 2,
    terminalNormalCount: 0,
    terminalTotal: 0,
  },
  {
    dateStr: "12-25",
    terminalAlarmCount: 1,
    terminalFailureCount: 0,
    terminalNormalCount: 0,
    terminalTotal: 0,
  },
  {
    dateStr: "12-26",
    terminalAlarmCount: 0,
    terminalFailureCount: 2,
    terminalNormalCount: 0,
    terminalTotal: 0,
  },
  {
    dateStr: "12-27",
    terminalAlarmCount: 0,
    terminalFailureCount: 0,
    terminalNormalCount: 0,
    terminalTotal: 0,
  },
  {
    dateStr: "12-28",
    terminalAlarmCount: 0,
    terminalFailureCount: 0,
    terminalNormalCount: 3,
    terminalTotal: 0,
  },
  {
    dateStr: "12-29",
    terminalAlarmCount: 1,
    terminalFailureCount: 0,
    terminalNormalCount: 0,
    terminalTotal: 0,
  },
]);

export const categoryData = [
  { category: "A", categoryValue: "独立终端", terminalCount: 5 },
  { category: "B", categoryValue: "融合终端", terminalCount: 12 },
];

export const policeType = [
  {
    policeType: "jj",
    policeTypeName: "交管",
    terminalCount: 8,
  },
  {
    policeType: "xz",
    policeTypeName: "刑侦",
    terminalCount: 8,
  },
  {
    policeType: "qt",
    policeTypeName: "其他",
    terminalCount: 3,
  },
  { policeType: "js", policeTypeName: "监管", terminalCount: 5 },
  { policeType: "wa", policeTypeName: "网安", terminalCount: 3 },
];

export const trendData = [
  { nodeName: "12-23", projectCount: 0 },
  { nodeName: "12-24", projectCount: 0 },
  { nodeName: "12-25", projectCount: 0 },
  { nodeName: "12-26", projectCount: 1 },
  { nodeName: "12-27", projectCount: 2 },
  { nodeName: "12-27", projectCount: 1 },
  { nodeName: "12-27", projectCount: 0 },
];
